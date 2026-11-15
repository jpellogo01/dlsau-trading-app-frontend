import { defineStore, acceptHMRUpdate } from "pinia";
import { computed, ref } from "vue";
import { Client } from "@stomp/stompjs";
import * as chatApi from "@/api/chat";
import type {
  ChatEvent,
  ChatMessage,
  Conversation,
  ItemStatusEvent,
} from "@/types/chat";
import type { ItemStatus } from "@/types/item";
import type { AppNotification } from "@/types/notification";
import { useNotificationStore } from "@/stores/notifications";

export const useChatStore = defineStore("chat", () => {
  const conversations = ref<Conversation[]>([]);
  const messagesByConv = ref<Record<number, ChatMessage[]>>({});
  const activeConvId = ref<number | null>(null);
  const connected = ref(false);
  /** Latest status per item, so other views (e.g. Marketplace) can react live. */
  const itemStatusOverrides = ref<Record<number, ItemStatusEvent>>({});

  let client: Client | null = null;
  let token: string | null = null;

  const unreadTotal = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
  );

  const activeConversation = computed(
    () => conversations.value.find((c) => c.id === activeConvId.value) || null,
  );

  // ------------------------------------------------------------ socket

  function connect(authToken: string) {
    if (client && token === authToken) return;
    disconnect();
    token = authToken;

    client = new Client({
      brokerURL: chatApi.API_URL.replace(/^http/, "ws") + "/ws",
      connectHeaders: { Authorization: `Bearer ${authToken}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        connected.value = true;
        client?.subscribe("/user/queue/chat", (frame) => {
          try {
            handleEvent(JSON.parse(frame.body) as ChatEvent);
          } catch (e) {
            console.error("Bad chat event", e);
          }
        });
        // Comment replies / comments on your items (same socket).
        client?.subscribe("/user/queue/notifications", (frame) => {
          try {
            useNotificationStore().receive(
              JSON.parse(frame.body) as AppNotification,
            );
          } catch (e) {
            console.error("Bad notification", e);
          }
        });
        // Catch up on anything missed while disconnected.
        loadInbox().catch(() => {});
        useNotificationStore().load().catch(() => {});
        if (activeConvId.value) loadMessages(activeConvId.value).catch(() => {});
      },
      onWebSocketClose: () => {
        connected.value = false;
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"]);
      },
    });
    client.activate();
    loadInbox().catch(() => {});
    useNotificationStore().load().catch(() => {});
  }

  function disconnect() {
    client?.deactivate();
    client = null;
    token = null;
    connected.value = false;
    useNotificationStore().reset();
    conversations.value = [];
    messagesByConv.value = {};
    activeConvId.value = null;
    itemStatusOverrides.value = {};
  }

  function handleEvent(event: ChatEvent) {
    if (event.type === "MESSAGE") {
      receiveMessage(event.payload);
    } else if (event.type === "STATUS") {
      applyStatus(event.payload);
    }
  }

  function receiveMessage(msg: ChatMessage) {
    const list = (messagesByConv.value[msg.conversationId] ||= []);
    const isNew = !list.some((m) => m.id === msg.id);
    if (isNew) list.push(msg);

    const conv = conversations.value.find((c) => c.id === msg.conversationId);
    if (!conv) {
      // New thread started by someone else: refresh inbox.
      loadInbox().catch(() => {});
      return;
    }
    if (!isNew) return; // REST response and socket echo of the same message
    if (msg.imageUrl) conv.imagesUsed += 1;
    conv.lastMessagePreview = msg.imageUrl
      ? msg.content
        ? `📷 ${msg.content}`
        : "📷 Photo"
      : msg.content;
    conv.lastMessageAt = msg.createdAt;

    const isOwn = msg.senderId !== conv.otherUserId;
    if (!isOwn) {
      if (activeConvId.value === msg.conversationId) {
        // The thread is open: fetching marks it read on the server.
        markActiveRead();
      } else {
        conv.unreadCount += 1;
      }
    }
    // Move conversation to the top.
    conversations.value = [
      conv,
      ...conversations.value.filter((c) => c.id !== conv.id),
    ];
  }

  function applyStatus(evt: ItemStatusEvent) {
    itemStatusOverrides.value[evt.itemId] = evt;
    conversations.value
      .filter((c) => c.itemId === evt.itemId)
      .forEach((c) => {
        c.itemStatus = evt.status;
        c.tradedWithUserId = evt.tradedWithUserId ?? null;
      });
  }

  let readTimer: ReturnType<typeof setTimeout> | null = null;
  function markActiveRead() {
    if (readTimer) clearTimeout(readTimer);
    readTimer = setTimeout(() => {
      if (activeConvId.value && token) {
        chatApi.getMessages(activeConvId.value, token).catch(() => {});
      }
    }, 500);
  }

  // ------------------------------------------------------------ REST actions

  function requireToken(): string {
    if (!token) throw new Error("Not signed in");
    return token;
  }

  async function loadInbox() {
    conversations.value = await chatApi.getConversations(requireToken());
  }

  async function loadMessages(conversationId: number) {
    const msgs = await chatApi.getMessages(conversationId, requireToken());
    messagesByConv.value[conversationId] = msgs;
    const conv = conversations.value.find((c) => c.id === conversationId);
    if (conv) conv.unreadCount = 0;
  }

  async function openConversation(conversationId: number) {
    activeConvId.value = conversationId;
    if (!conversations.value.some((c) => c.id === conversationId)) {
      const conv = await chatApi.getConversation(conversationId, requireToken());
      conversations.value = [conv, ...conversations.value];
    }
    await loadMessages(conversationId);
  }

  function closeConversation() {
    activeConvId.value = null;
  }

  /** Called from the Marketplace "Message Owner" button. */
  async function startWithItem(itemId: number): Promise<Conversation> {
    const conv = await chatApi.startConversation(itemId, requireToken());
    const idx = conversations.value.findIndex((c) => c.id === conv.id);
    if (idx >= 0) conversations.value[idx] = conv;
    else conversations.value = [conv, ...conversations.value];
    return conv;
  }

  async function send(conversationId: number, content: string) {
    const msg = await chatApi.sendMessage(
      conversationId,
      content,
      requireToken(),
    );
    receiveMessage(msg); // de-duplicated if the socket echo arrives too
    return msg;
  }

  async function sendImage(
    conversationId: number,
    image: File,
    caption: string,
  ) {
    const msg = await chatApi.sendImageMessage(
      conversationId,
      image,
      caption,
      requireToken(),
    );
    receiveMessage(msg);
    return msg;
  }

  async function setItemStatus(conversationId: number, status: ItemStatus) {
    const conv = await chatApi.updateItemStatus(
      conversationId,
      status,
      requireToken(),
    );
    applyStatus({
      itemId: conv.itemId,
      status: conv.itemStatus,
      tradedWithUserId: conv.tradedWithUserId,
    });
    return conv;
  }

  return {
    conversations,
    messagesByConv,
    activeConvId,
    activeConversation,
    connected,
    unreadTotal,
    itemStatusOverrides,
    connect,
    disconnect,
    loadInbox,
    loadMessages,
    openConversation,
    closeConversation,
    startWithItem,
    send,
    sendImage,
    setItemStatus,
  };
});

// Let the dev server hot-swap this store when the file changes (no stale actions).
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
}
