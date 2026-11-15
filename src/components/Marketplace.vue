<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e2e8f0] font-sans"
  >
    <!-- Header with Post Button -->
    <header
      class="bg-[#00733f]/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center justify-between gap-2 sm:gap-4">
          <!-- Left Section - Back Button -->
          <button
            @click="$router.push('/')"
            class="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-3 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold text-sm sm:text-base transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5 flex-shrink-0"
          >
            <ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="hidden sm:inline">Back to Home</span>
          </button>

          <!-- Center Section - Title -->
          <div class="text-center flex-1 min-w-0 px-2">
            <p
              class="text-xs sm:text-sm font-bold text-[#ffd700] uppercase tracking-wider"
            >
              Marketplace
            </p>
            <h1
              class="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-[#ffd700] bg-clip-text text-transparent mt-0.5 sm:mt-1 truncate"
            >
              Trading Feed
            </h1>
          </div>

          <!-- Right Section - Notifications + Chats + Post Button -->
          <div class="flex items-center gap-2 flex-shrink-0">
          <NotificationBell v-if="authStore.isAuthenticated" />
          <button
            v-if="authStore.isAuthenticated"
            @click="$router.push({ name: 'Chats' })"
            class="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-3 bg-white/50 border border-black/10 rounded-full text-[#333] font-semibold text-sm sm:text-base transition-all hover:bg-white hover:shadow-lg"
            aria-label="Open chats"
          >
            <MessagesSquare class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="hidden md:inline">Chats</span>
            <span
              v-if="chatStore.unreadTotal"
              class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#ff8c42] text-white text-[11px] font-bold flex items-center justify-center shadow"
              >{{ chatStore.unreadTotal }}</span
            >
          </button>
          <button
            @click="
              authStore.isAuthenticated
                ? $router.push({ name: 'MarketplacePost' })
                : openAuthModal()
            "
            class="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-3 bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] font-bold text-sm sm:text-base rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 flex-shrink-0"
          >
            <PlusCircle class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="hidden sm:inline">Post Item</span>
          </button>
          <!-- Profile -->
          <button
            v-if="authStore.isAuthenticated"
            @click="$router.push({ name: 'Profile' })"
            class="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-white to-[#a7d49b] border-2 border-white/70 text-[#00733f] font-black text-sm sm:text-lg flex items-center justify-center shadow transition-all hover:shadow-lg hover:scale-105 flex-shrink-0"
            :title="`My account (${authStore.user?.username || ''})`"
            aria-label="My account"
          >
            {{ profileInitial }}
          </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Error Toast -->
    <Transition name="toast">
      <div
        v-if="errorToast"
        class="fixed top-20 right-2 left-2 sm:left-auto sm:right-4 z-[1000] max-w-md animate-slide-in-right"
      >
        <div
          class="bg-orange-400/15 backdrop-blur-md border border-orange-400/40 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex gap-2 sm:gap-3 shadow-[0_20px_40px_rgba(255,140,66,0.2)]"
        >
          <AlertTriangle
            class="w-4 h-4 sm:w-5 sm:h-5 text-[#ff8c42] flex-shrink-0 mt-0.5"
          />
          <div class="flex-1">
            <p class="font-bold text-[#333] text-sm sm:text-base mb-1">
              {{ errorToast }}
            </p>
            <p class="text-xs sm:text-sm text-slate-500">
              Please try refreshing the page.
            </p>
          </div>
          <button @click="errorToast = ''" class="text-2xl text-[#ff8c42] px-1">
            ×
          </button>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 sm:py-16 lg:py-20">
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#00733f]/30 border-t-[#00733f] rounded-full animate-spin mx-auto mb-4 sm:mb-6"
        ></div>
        <p class="text-lg sm:text-xl font-semibold text-slate-500 mb-2">
          Loading marketplace...
        </p>
        <p class="text-sm sm:text-base text-slate-500">
          Fetching latest listings from campus traders
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="items.length === 0"
        class="text-center py-12 sm:py-16 lg:py-20"
      >
        <Package
          class="w-16 h-16 sm:w-24 sm:h-24 text-[#a7d49b]/75 mx-auto mb-4 sm:mb-6"
        />
        <p class="text-2xl sm:text-3xl font-black text-[#333] mb-2 sm:mb-3">
          No items yet
        </p>
        <p
          class="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-sm mx-auto"
        >
          Be the first to post something! Your listing will appear here.
        </p>
        <button
          @click="
            authStore.isAuthenticated
              ? $router.push({ name: 'MarketplacePost' })
              : openAuthModal()
          "
          class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#ffd700] to-[#ff8c42] text-[#333] font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-base sm:text-lg"
        >
          Start Trading
        </button>
      </div>

      <!-- Items Feed -->
      <div v-else class="flex flex-col gap-4 sm:gap-6">
        <div v-for="item in items" :key="item.id" :id="`item-${item.id}`" class="animate-fade-in-up">
          <div
            class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <!-- Card Grid -->
            <div
              class="grid lg:grid-cols-[18rem_1fr] gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8"
            >
              <!-- Image & Badges -->
              <div class="flex flex-col gap-3 sm:gap-4">
                <div
                  class="aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-100 transition-transform group-hover:scale-105"
                >
                  <img
                    v-if="item.thumbnailUrl"
                    :src="item.thumbnailUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200"
                  >
                    <Package class="w-12 h-12 sm:w-16 sm:h-16 text-[#a7d49b]" />
                  </div>
                </div>

                <div class="flex flex-wrap gap-1.5 sm:gap-2">
                  <span
                    :class="[
                      'px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wide shadow-md',
                      statusOf(item) === 'TRADED'
                        ? 'bg-slate-700 text-white'
                        : 'bg-[#a7d49b]/40 text-[#00733f]',
                    ]"
                    >{{ statusOf(item) === "TRADED" ? "Traded" : "Available" }}</span
                  >
                  <span
                    class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white shadow-md"
                    >{{ item.condition }}</span
                  >
                  <span
                    v-if="item.category"
                    class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gray-100 text-[#333] shadow-sm"
                    >{{ item.category }}</span
                  >
                </div>
              </div>

              <!-- Content -->
              <div class="flex flex-col justify-between gap-4 sm:gap-6">
                <!-- Header -->
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4"
                >
                  <div>
                    <p
                      class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
                    >
                      Posted by
                    </p>
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div
                        class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00733f] to-[#a7d49b] text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-md"
                      >
                        {{ item.user.username.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <h3 class="text-base sm:text-xl font-black text-[#333]">
                          {{ item.user.username }}
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-500">
                          {{ item.user.email }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Details -->
                <div>
                  <h2
                    class="text-xl sm:text-2xl lg:text-3xl font-black text-[#333] mb-2 sm:mb-4"
                  >
                    {{ item.title }}
                  </h2>
                  <p
                    v-if="item.description"
                    class="text-sm sm:text-base text-slate-500 leading-relaxed mb-4 sm:mb-6 line-clamp-3"
                  >
                    {{ item.description }}
                  </p>

                  <div class="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00733f]/10 to-[#a7d49b]/10 border border-slate-200"
                    >
                      <p
                        class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
                      >
                        Meetup
                      </p>
                      <p class="text-base sm:text-lg font-black text-[#00733f]">
                        {{ item.meetupLocation || "To be arranged" }}
                      </p>
                    </div>
                    <div
                      class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff8c42]/10 to-[#ffd700]/10 border border-slate-200"
                    >
                      <p
                        class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
                      >
                        Posted
                      </p>
                      <p class="text-base sm:text-lg font-black text-[#333]">
                        {{ formatDate(item.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-3 sm:gap-4">
                  <div class="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      @click="handleLike(item)"
                      :class="[
                        'px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 hover:-translate-y-0.5 hover:shadow-lg',
                        item.liked
                          ? 'bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white border-[#00733f] shadow-md'
                          : 'text-slate-500 hover:border-[#00733f]',
                      ]"
                    >
                      <Heart
                        :class="item.liked ? 'fill-white' : ''"
                        class="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span>{{ item.localLikes || item.likes || 0 }}</span>
                      <span class="hidden sm:inline">{{
                        item.liked ? "Liked" : "Like"
                      }}</span>
                    </button>
                    <button
                      @click="toggleComments(item)"
                      class="px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white text-slate-500 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:border-[#00733f]"
                    >
                      <MessageCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{{ item.commentCount || 0 }}</span>
                      <span class="hidden sm:inline"
                        >Comment{{ item.commentCount !== 1 ? "s" : "" }}</span
                      >
                    </button>
                  </div>
                  <div
                    v-if="isOwnItem(item)"
                    class="px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 text-center text-sm font-bold text-slate-500"
                  >
                    This is your listing — offers arrive in
                    <button
                      class="text-[#00733f] underline"
                      @click="$router.push({ name: 'Chats' })"
                    >
                      Chats
                    </button>
                  </div>
                  <button
                    v-else
                    @click="messageOwner(item)"
                    :disabled="
                      statusOf(item) === 'TRADED' ||
                      startingChatItemId === item.id
                    "
                    class="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white font-black text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 enabled:hover:-translate-y-0.5 enabled:hover:scale-[1.01] enabled:hover:shadow-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send class="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{{
                      statusOf(item) === "TRADED"
                        ? "Already Traded"
                        : startingChatItemId === item.id
                          ? "Opening chat…"
                          : "Message Owner"
                    }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <Transition name="comments">
              <div
                v-if="item.showComments"
                class="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-gray-100"
              >
                <div class="p-4 sm:p-6 lg:p-8">
                  <!-- Comments List (Facebook-style threads: comment + replies) -->
                  <div class="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      v-for="comment in topLevelComments(item)"
                      :key="comment.id"
                      class="flex flex-col gap-2"
                    >
                      <!-- Top-level comment -->
                      <div
                        :id="`comment-${comment.id}`"
                        class="flex gap-2 sm:gap-3 p-3 sm:p-4 bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl border transition-all duration-500"
                        :class="
                          highlightCommentId === comment.id
                            ? 'border-[#00733f] ring-4 ring-[#00733f]/20'
                            : 'border-slate-200/50'
                        "
                      >
                        <div
                          class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-500/10 to-gray-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
                        >
                          <User class="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <p class="font-bold text-[#333] text-sm sm:text-base truncate">
                              {{ comment.username }}
                            </p>
                            <p class="text-xs text-slate-500">
                              {{ formatDate(comment.createdAt) }}
                            </p>
                          </div>
                          <p class="text-sm sm:text-base text-slate-600 break-words">
                            {{ comment.content }}
                          </p>
                          <div class="flex flex-wrap items-center gap-1 mt-1.5 -ml-2">
                            <button
                              v-if="authStore.isAuthenticated"
                              @click="startReply(item, comment, comment)"
                              class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[#00733f] hover:bg-[#00733f]/10 transition-colors"
                              title="Reply to this comment"
                            >
                              <Reply class="w-4 h-4" />
                              <span class="text-xs font-semibold">Reply</span>
                            </button>
                            <button
                              v-if="canDeleteComment(comment.userId)"
                              @click="toggleEditComment(item, comment.id, comment.content)"
                              :disabled="addingCommentItemId === item.id"
                              :class="[
                                'inline-flex items-center gap-1 px-2 py-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                                isEditingComment(item.id, comment.id)
                                  ? 'text-slate-700 hover:bg-slate-100'
                                  : 'text-amber-700 hover:bg-amber-50',
                              ]"
                              :title="isEditingComment(item.id, comment.id) ? 'Cancel editing' : 'Edit your comment'"
                            >
                              <Pencil class="w-4 h-4" />
                              <span class="text-xs font-semibold">{{
                                isEditingComment(item.id, comment.id) ? "Cancel" : "Edit"
                              }}</span>
                            </button>
                            <button
                              v-if="canDeleteComment(comment.userId)"
                              @click="handleDeleteComment(item, comment.id)"
                              :disabled="deletingCommentId === comment.id"
                              class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Delete your comment and its replies"
                            >
                              <Trash2 class="w-4 h-4" />
                              <span class="text-xs font-semibold">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Replies -->
                      <div
                        v-if="repliesOf(item, comment.id).length"
                        class="ml-8 sm:ml-12 flex flex-col gap-2"
                      >
                        <button
                          v-if="!isThreadOpen(comment.id)"
                          @click="openThread(comment.id)"
                          class="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#00733f] transition-colors"
                        >
                          <CornerDownRight class="w-4 h-4" />
                          View {{ repliesOf(item, comment.id).length }}
                          {{ repliesOf(item, comment.id).length === 1 ? "reply" : "replies" }}
                        </button>
                        <template v-else>
                          <div
                            v-for="reply in repliesOf(item, comment.id)"
                            :key="reply.id"
                            :id="`comment-${reply.id}`"
                            class="flex gap-2 p-2.5 sm:p-3 bg-white/60 rounded-xl border transition-all duration-500"
                            :class="
                              highlightCommentId === reply.id
                                ? 'border-[#00733f] ring-4 ring-[#00733f]/20'
                                : 'border-slate-200/50'
                            "
                          >
                            <div
                              class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-500/10 to-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                            >
                              <User class="w-3 h-3 text-slate-500" />
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5">
                                <p class="font-bold text-[#333] text-sm truncate">
                                  {{ reply.username }}
                                </p>
                                <p class="text-xs text-slate-500">
                                  {{ formatDate(reply.createdAt) }}
                                </p>
                              </div>
                              <p class="text-sm text-slate-600 break-words">
                                <span
                                  v-if="showMention(reply, comment)"
                                  class="font-bold text-[#00733f]"
                                  >@{{ reply.replyToUsername }}</span
                                >
                                {{ reply.content }}
                              </p>
                              <div class="flex flex-wrap items-center gap-1 mt-1 -ml-2">
                                <button
                                  v-if="authStore.isAuthenticated"
                                  @click="startReply(item, comment, reply)"
                                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[#00733f] hover:bg-[#00733f]/10 transition-colors"
                                >
                                  <Reply class="w-3.5 h-3.5" />
                                  <span class="text-xs font-semibold">Reply</span>
                                </button>
                                <button
                                  v-if="canDeleteComment(reply.userId)"
                                  @click="toggleEditComment(item, reply.id, reply.content)"
                                  :disabled="addingCommentItemId === item.id"
                                  :class="[
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg disabled:opacity-50 transition-colors',
                                    isEditingComment(item.id, reply.id)
                                      ? 'text-slate-700 hover:bg-slate-100'
                                      : 'text-amber-700 hover:bg-amber-50',
                                  ]"
                                >
                                  <Pencil class="w-3.5 h-3.5" />
                                  <span class="text-xs font-semibold">{{
                                    isEditingComment(item.id, reply.id) ? "Cancel" : "Edit"
                                  }}</span>
                                </button>
                                <button
                                  v-if="canDeleteComment(reply.userId)"
                                  @click="handleDeleteComment(item, reply.id)"
                                  :disabled="deletingCommentId === reply.id"
                                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                                >
                                  <Trash2 class="w-3.5 h-3.5" />
                                  <span class="text-xs font-semibold">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            @click="closeThread(comment.id)"
                            class="self-start text-xs font-bold text-slate-400 hover:text-slate-600 ml-1"
                          >
                            Hide replies
                          </button>
                        </template>
                      </div>

                      <!-- Inline reply box -->
                      <div
                        v-if="replyTarget && replyTarget.itemId === item.id && replyTarget.threadId === comment.id"
                        class="ml-8 sm:ml-12 flex flex-col gap-1.5"
                      >
                        <p class="text-xs text-slate-500 flex items-center gap-1">
                          Replying to
                          <b class="text-[#00733f]">@{{ replyTarget.username }}</b>
                          <button
                            @click="cancelReply"
                            class="ml-1 text-slate-400 hover:text-slate-600"
                            aria-label="Cancel reply"
                          >
                            <X class="w-3.5 h-3.5" />
                          </button>
                        </p>
                        <div class="flex gap-2">
                          <input
                            :id="`reply-input-${item.id}`"
                            v-model="replyText"
                            @keyup.enter="submitReply(item)"
                            @keyup.esc="cancelReply"
                            :disabled="sendingReply"
                            type="text"
                            maxlength="2000"
                            :placeholder="`Reply to ${replyTarget.username}…`"
                            aria-label="Write a reply"
                            class="flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl bg-white text-[#333] text-sm focus:outline-none focus:border-[#00733f] focus:ring-4 focus:ring-[#00733f]/10 disabled:opacity-50"
                          />
                          <button
                            @click="submitReply(item)"
                            :disabled="!replyText.trim() || sendingReply"
                            class="px-4 py-2 bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white text-sm font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <Send class="w-3.5 h-3.5" />
                            {{ sendingReply ? "Sending" : "Reply" }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Comment -->
                  <div
                    v-if="authStore.isAuthenticated"
                    class="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200"
                  >
                    <div class="flex gap-2 sm:gap-3">
                      <input
                        v-model="commentInputs[item.id]"
                        @keyup.enter="addComment(item)"
                        :disabled="addingCommentItemId === item.id"
                        type="text"
                        :placeholder="`Reply to ${item.user.username}...`"
                        class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-xl sm:rounded-2xl bg-white text-[#333] text-sm sm:text-base transition-all focus:outline-none focus:border-[#00733f] focus:ring-4 focus:ring-[#00733f]/10 placeholder:text-[#a7d49b] disabled:opacity-50"
                      />
                      <button
                        @click="addComment(item)"
                        :disabled="
                          !commentInputs[item.id]?.trim() ||
                          addingCommentItemId === item.id
                        "
                        class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#00733f] to-[#a7d49b] text-white font-bold rounded-xl sm:rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                      >
                        <Send
                          v-if="addingCommentItemId !== item.id"
                          class="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <div
                          v-else
                          class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></div>
                        <span class="text-sm sm:text-base">{{
                          addingCommentItemId === item.id ? "Posting" : "Post"
                        }}</span>
                      </button>
                    </div>
                  </div>
                  <p
                    v-else
                    class="bg-white/70 backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 text-center"
                  >
                    <button
                      @click="openAuthModal()"
                      class="text-[#00733f] font-bold flex items-center justify-center gap-2 mx-auto transition-colors hover:text-[#a7d49b]"
                    >
                      <LogIn class="w-4 h-4" />
                      Sign in to comment
                    </button>
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import NotificationBell from "@/components/NotificationBell.vue";
import type { Comment } from "@/types/item";
import { useAuthStore } from "@/stores/auth";
import {
  addLike,
  deleteComment,
  getComments,
  getItems,
  getLikeSummary,
  postComment,
  removeLike,
  updateComment,
} from "@/api/items";
import type { Item, ExtendedItem, ItemStatus } from "@/types/item";
import { useChatStore } from "@/stores/chat";
import {
  Package,
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  PlusCircle,
  AlertTriangle,
  LogIn,
  Pencil,
  Trash2,
  User,
  MessagesSquare,
  Reply,
  CornerDownRight,
  X,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();
const startingChatItemId = ref<number | null>(null);
const loading = ref(true);
const errorToast = ref("");
const addingCommentItemId = ref<number | null>(null);
const deletingCommentId = ref<number | null>(null);
const editingCommentId = ref<number | null>(null);
const editingCommentItemId = ref<number | null>(null);
const commentInputs = ref<Record<number, string>>({});

const items = ref<ExtendedItem[]>([]);

onMounted(async () => {
  try {
    const fetchedItems = await getItems(authStore.token || undefined);
    items.value = fetchedItems.map((item: Item) => ({
      ...item,
      liked: false,
      localLikes: item.likes || 0,
      showComments: false,
      commentsLoaded: false,
      comments: [],
      commentCount: item.comments?.length || 0,
    }));

    if (authStore.token) {
      await Promise.all(
        items.value.map(async (item) => {
          try {
            const likeSummary = await getLikeSummary(item.id, authStore.token!);
            item.localLikes = likeSummary.totalLikes;
            item.liked = likeSummary.likedByCurrentUser;
          } catch {
            item.localLikes = item.likes || 0;
            item.liked = false;
          }

          try {
            const comments = await getComments(item.id, authStore.token!);
            item.commentCount = comments.length;
          } catch {
            item.commentCount = item.comments?.length || 0;
          }
        }),
      );
    }
  } catch (error) {
    errorToast.value =
      "Failed to load marketplace. Please check your connection.";
    setTimeout(() => {
      errorToast.value = "";
    }, 5000);
  } finally {
    loading.value = false;
  }
  // Opened from a notification? Jump to that item/comment.
  await focusFromQuery();
});

// ------------------------------------------------------------ replies (Facebook-style)

/** The comment the user clicked "Reply" on, and the thread it belongs to. */
const replyTarget = ref<{
  itemId: number;
  threadId: number;
  commentId: number;
  username: string;
} | null>(null);
const replyText = ref("");
const sendingReply = ref(false);
const openThreads = ref(new Set<number>());
const highlightCommentId = ref<number | null>(null);

function topLevelComments(item: ExtendedItem): Comment[] {
  return (item.comments || []).filter((c) => !c.parentId);
}

function repliesOf(item: ExtendedItem, threadId: number): Comment[] {
  return (item.comments || [])
    .filter((c) => c.parentId === threadId)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

function isThreadOpen(threadId: number) {
  return openThreads.value.has(threadId);
}
function openThread(threadId: number) {
  openThreads.value.add(threadId);
}
function closeThread(threadId: number) {
  openThreads.value.delete(threadId);
}

/** Show "@name" only when replying to someone other than the thread starter. */
function showMention(reply: Comment, thread: Comment) {
  return !!reply.replyToUsername && reply.replyToUserId !== thread.userId;
}

function startReply(item: ExtendedItem, thread: Comment, target: Comment) {
  if (!authStore.isAuthenticated) {
    openAuthModal();
    return;
  }
  replyTarget.value = {
    itemId: item.id,
    threadId: thread.id,
    commentId: target.id,
    username: target.username,
  };
  replyText.value = "";
  openThread(thread.id);
  nextTick(() =>
    (document.getElementById(`reply-input-${item.id}`) as HTMLInputElement | null)?.focus(),
  );
}

function cancelReply() {
  replyTarget.value = null;
  replyText.value = "";
}

async function submitReply(item: ExtendedItem) {
  const text = replyText.value.trim();
  const target = replyTarget.value;
  if (!text || !target || sendingReply.value || !authStore.token) return;
  sendingReply.value = true;
  try {
    const created = await postComment(item.id, text, authStore.token, target.commentId);
    item.comments = [...(item.comments || []), created];
    item.commentCount = item.comments.length;
    if (created.parentId) openThread(created.parentId);
    cancelReply();
    flashComment(created.id);
  } catch {
    errorToast.value = "Failed to post reply";
    setTimeout(() => (errorToast.value = ""), 3000);
  } finally {
    sendingReply.value = false;
  }
}

function flashComment(commentId: number) {
  highlightCommentId.value = commentId;
  setTimeout(() => {
    if (highlightCommentId.value === commentId) highlightCommentId.value = null;
  }, 2500);
}

async function loadComments(item: ExtendedItem) {
  item.comments = await getComments(item.id, authStore.token!);
  item.commentCount = item.comments.length;
  item.commentsLoaded = true;
}

/** Handles ?item=ID&comment=ID links coming from notifications. */
async function focusFromQuery() {
  const itemId = Number(route.query.item);
  if (!itemId || !authStore.token) return;
  const commentId = Number(route.query.comment) || null;
  router.replace({ name: "Marketplace" }); // so the same link works again later

  const item = items.value.find((i) => i.id === itemId);
  if (!item) {
    errorToast.value = "That item is no longer available.";
    setTimeout(() => (errorToast.value = ""), 3000);
    return;
  }
  try {
    await loadComments(item); // always fresh, so the new reply is there
  } catch {
    /* comments stay as they were */
  }
  item.showComments = true;

  const comment = commentId
    ? (item.comments || []).find((c) => c.id === commentId)
    : null;
  if (comment?.parentId) openThread(comment.parentId);
  await nextTick();
  const el =
    (comment && document.getElementById(`comment-${comment.id}`)) ||
    document.getElementById(`item-${item.id}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (comment) flashComment(comment.id);
}

// Clicking a notification while already on the Marketplace.
watch(
  () => route.query.item,
  (itemId) => {
    if (itemId && !loading.value) focusFromQuery();
  },
);

function openAuthModal() {
  router.push({ name: "Home", query: { modal: "login" } });
}

async function handleLike(item: ExtendedItem) {
  if (!authStore.isAuthenticated) {
    openAuthModal();
    return;
  }

  try {
    const likeSummary = item.liked
      ? await removeLike(item.id, authStore.token!)
      : await addLike(item.id, authStore.token!);

    item.localLikes = likeSummary.totalLikes;
    item.liked = likeSummary.likedByCurrentUser;
  } catch {
    errorToast.value = "Failed to update like";
    setTimeout(() => {
      errorToast.value = "";
    }, 3000);
  }
}

async function toggleComments(item: ExtendedItem) {
  if (!authStore.isAuthenticated) {
    openAuthModal();
    return;
  }

  item.showComments = !item.showComments!;

  if (item.showComments && !item.commentsLoaded) {
    try {
      item.comments = await getComments(item.id, authStore.token!);
      item.commentCount = item.comments.length;
      item.commentsLoaded = true;
    } catch {
      errorToast.value = "Failed to load comments";
      setTimeout(() => {
        errorToast.value = "";
      }, 3000);
    }
  }
}

async function addComment(item: ExtendedItem) {
  const commentText = commentInputs.value[item.id]?.trim() || "";

  if (
    !authStore.isAuthenticated ||
    !commentText ||
    addingCommentItemId.value === item.id
  )
    return;

  addingCommentItemId.value = item.id;
  try {
    const editingId = editingCommentId.value;
    const isEditingCurrentItem =
      editingCommentItemId.value === item.id && editingId !== null;

    if (isEditingCurrentItem) {
      const updatedComment = await updateComment(
        editingId,
        commentText,
        authStore.token!,
      );

      const comments = item.comments || [];
      const commentIndex = comments.findIndex(
        (comment) => comment.id === updatedComment.id,
      );

      if (commentIndex !== -1) {
        comments[commentIndex] = updatedComment;
      }

      item.comments = comments;
      editingCommentId.value = null;
      editingCommentItemId.value = null;
    } else {
      const createdComment = await postComment(
        item.id,
        commentText,
        authStore.token!,
      );

      if (!item.comments) item.comments = [];
      item.comments.unshift(createdComment);
      item.commentCount = item.comments.length;
      item.commentsLoaded = true;
    }

    commentInputs.value[item.id] = "";
  } catch {
    errorToast.value =
      editingCommentItemId.value === item.id
        ? "Failed to update comment"
        : "Failed to post comment";
    setTimeout(() => {
      errorToast.value = "";
    }, 3000);
  } finally {
    addingCommentItemId.value = null;
  }
}

function canDeleteComment(commentUserId: number) {
  return authStore.user?.id === commentUserId;
}

function startEditComment(
  item: ExtendedItem,
  commentId: number,
  content: string,
) {
  editingCommentItemId.value = item.id;
  editingCommentId.value = commentId;
  commentInputs.value[item.id] = content;
}

function cancelEditComment(itemId: number) {
  if (editingCommentItemId.value !== itemId) {
    return;
  }

  editingCommentItemId.value = null;
  editingCommentId.value = null;
  commentInputs.value[itemId] = "";
}

function isEditingComment(itemId: number, commentId: number) {
  return (
    editingCommentItemId.value === itemId &&
    editingCommentId.value === commentId
  );
}

function toggleEditComment(
  item: ExtendedItem,
  commentId: number,
  content: string,
) {
  if (isEditingComment(item.id, commentId)) {
    cancelEditComment(item.id);
    return;
  }

  startEditComment(item, commentId, content);
}

async function handleDeleteComment(item: ExtendedItem, commentId: number) {
  if (!authStore.isAuthenticated || !authStore.token) {
    openAuthModal();
    return;
  }

  if (deletingCommentId.value === commentId) {
    return;
  }

  deletingCommentId.value = commentId;
  try {
    await deleteComment(commentId, authStore.token);
    // Deleting a comment also removes its replies (the backend does the same).
    item.comments = (item.comments || []).filter(
      (comment) => comment.id !== commentId && comment.parentId !== commentId,
    );
    item.commentCount = item.comments.length;
    if (
      replyTarget.value &&
      (replyTarget.value.commentId === commentId ||
        replyTarget.value.threadId === commentId)
    ) {
      cancelReply();
    }

    if (editingCommentId.value === commentId) {
      editingCommentId.value = null;
      editingCommentItemId.value = null;
      commentInputs.value[item.id] = "";
    }
  } catch {
    errorToast.value = "Failed to delete comment";
    setTimeout(() => {
      errorToast.value = "";
    }, 3000);
  } finally {
    deletingCommentId.value = null;
  }
}

/** Live status: socket updates from the chat store override the loaded value. */
function statusOf(item: ExtendedItem): ItemStatus {
  return chatStore.itemStatusOverrides[item.id]?.status ?? item.status;
}

/** First letter of the user's name (or username) for the header avatar. */
const profileInitial = computed(() => {
  const u = authStore.user;
  const name = u?.firstName || u?.username || "";
  return name ? name.charAt(0).toUpperCase() : "?";
});

function isOwnItem(item: ExtendedItem) {
  return !!authStore.user && item.user?.id === authStore.user.id;
}

async function messageOwner(item: ExtendedItem) {
  if (!authStore.isAuthenticated) {
    openAuthModal();
    return;
  }

  startingChatItemId.value = item.id;
  try {
    const conversation = await chatStore.startWithItem(item.id);
    router.push({ name: "Chats", params: { id: conversation.id } });
  } catch (error: any) {
    errorToast.value = error?.message || "Could not open chat.";
    setTimeout(() => {
      errorToast.value = "";
    }, 3000);
  } finally {
    startingChatItemId.value = null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped>
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.comments-enter-active,
.comments-leave-active {
  transition: all 0.3s ease;
}

.comments-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.comments-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
