<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ArrowLeft, Check, Clock, LogOut } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();

const isEditing = ref(false);
const firstName = ref("");
const lastName = ref("");
const program = ref("");
const editError = ref("");
const editSuccess = ref("");

const displayName = computed(() => {
  if (authStore.user?.firstName || authStore.user?.lastName) {
    return `${authStore.user?.firstName || ""} ${authStore.user?.lastName || ""}`.trim();
  }
  return authStore.user?.username || "User";
});

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: "Login" });
  } else {
    loadProfile();
  }
});

async function loadProfile() {
  try {
    await authStore.fetchProfile();
    firstName.value = authStore.user?.firstName || "";
    lastName.value = authStore.user?.lastName || "";
    program.value = authStore.user?.program || "";
  } catch (err) {
    editError.value = "Failed to load profile. Please refresh.";
  }
}

async function handleUpdateProfile() {
  editError.value = "";
  editSuccess.value = "";

  try {
    await authStore.updateProfile({
      firstName: firstName.value,
      lastName: lastName.value,
      program: program.value,
    });
    editSuccess.value = "Profile updated successfully!";
    isEditing.value = false;
    setTimeout(() => {
      editSuccess.value = "";
    }, 3000);
  } catch (err) {
    editError.value = authStore.error || "Failed to update profile";
  }
}

function cancelEdit() {
  isEditing.value = false;
  firstName.value = authStore.user?.firstName || "";
  lastName.value = authStore.user?.lastName || "";
  program.value = authStore.user?.program || "";
}

function handleLogout() {
  authStore.logout();
  router.push({ name: "/" });
}
</script>

<template>
  <div class="profile-container">
    <!-- Navigation Bar -->
    <nav class="profile-nav">
      <div class="nav-content">
        <button @click="$router.push('/')" class="nav-back-btn">
          <ArrowLeft class="nav-icon" />
          <span class="nav-text">Back</span>
        </button>
        <div class="nav-title-section">
          <h2 class="nav-logo">GAWT</h2>
          <p class="nav-subtitle">Trading Platform</p>
        </div>
        <button class="nav-logout-btn" @click="handleLogout">
          <LogOut class="logout-icon" />
          <span class="logout-text">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="profile-main">
      <!-- Profile Card -->
      <div class="profile-card">
        <!-- Header Section -->
        <div class="profile-header">
          <div class="header-content">
            <div class="avatar-container">
              {{ displayName.charAt(0).toUpperCase() }}
            </div>
            <div class="header-info">
              <h1 class="profile-name">{{ displayName }}</h1>
              <p class="verification-status">
                <VerifiedIcon
                  :type="authStore.isVerified ? 'verified' : 'pending'"
                />
                {{
                  authStore.isVerified
                    ? "Account Verified"
                    : "Verify your account"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="editError" class="message error-message">
          {{ editError }}
        </div>

        <div v-if="editSuccess" class="message success-message">
          {{ editSuccess }}
        </div>

        <!-- Profile Details -->
        <div class="details-section">
          <div v-if="!isEditing" class="view-mode">
            <div class="detail-grid">
              <DetailRow
                label="Username"
                :value="authStore.user?.username || ''"
                accent="#FFD700"
              />
              <DetailRow label="Email" :value="authStore.user?.email || ''" />
              <DetailRow
                label="First Name"
                :value="authStore.user?.firstName || '—'"
              />
              <DetailRow
                label="Last Name"
                :value="authStore.user?.lastName || '—'"
              />
              <DetailRow
                label="Program"
                :value="authStore.user?.program || '—'"
              />
              <DetailRow
                label="Role"
                :value="authStore.user?.role || 'USER'"
                accent="#00733F"
              />
            </div>

            <button class="edit-button" @click="isEditing = true">
              Edit Profile
            </button>
          </div>

          <div v-else class="edit-mode">
            <form @submit.prevent="handleUpdateProfile" class="edit-form">
              <FormField label="First Name" v-model="firstName" />
              <FormField label="Last Name" v-model="lastName" />
              <FormField
                label="Program"
                v-model="program"
                type="select"
                :options="[
                  { value: '', label: 'Select program' },
                  { value: 'Computer Science', label: 'Computer Science' },
                  {
                    value: 'Software Engineering',
                    label: 'Software Engineering',
                  },
                  {
                    value: 'Information Technology',
                    label: 'Information Technology',
                  },
                  { value: 'Business', label: 'Business' },
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Other', label: 'Other' },
                ]"
              />

              <div class="form-actions">
                <button
                  type="submit"
                  class="save-btn"
                  :disabled="authStore.isLoading"
                >
                  {{ authStore.isLoading ? "Saving..." : "Save Changes" }}
                </button>
                <button type="button" @click="cancelEdit" class="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #00733f 0%, #a7d49b 50%, #f5f5f5 100%);
  color: #333333;
  font-family: "Inter", system-ui, sans-serif;
}

.profile-nav {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(40px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-content {
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  color: #ffffff;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-text {
  font-weight: 600;
  font-size: 0.875rem;
}

.nav-title-section {
  text-align: center;
  flex: 1;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(to right, #ffd700, #ff8c42);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  margin: 0;
}

.nav-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(167, 212, 155, 0.9);
  margin: 0.25rem 0 0;
}

.nav-logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(to right, #ff4444, #cc3333);
  color: #ffffff;
  font-weight: 700;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(20px);
  font-size: 0.875rem;
  white-space: nowrap;
}

.nav-logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(255, 68, 68, 0.4);
}

.logout-icon {
  width: 1rem;
  height: 1rem;
}

.logout-text {
  display: none;
}

@media (min-width: 640px) {
  .logout-text {
    display: inline;
  }
}

.profile-main {
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(40px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 119, 63, 0.2);
  transition: all 0.5s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 35px 70px rgba(0, 119, 63, 0.3);
  border-color: rgba(255, 215, 0, 0.5);
}

.profile-header {
  background: linear-gradient(
    135deg,
    rgba(0, 119, 63, 0.95),
    rgba(167, 212, 155, 0.9)
  );
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
  }
}

.avatar-container {
  width: 6rem;
  height: 6rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffd700;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(to right, #ffffff, #ffd700);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
  margin: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@media (min-width: 640px) {
  .profile-name {
    font-size: 3rem;
    text-align: left;
  }
}

.verification-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  padding: 0.75rem 1.25rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
}

.verified-badge {
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
  padding: 0.25rem;
}

.pending-badge {
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 50%;
  padding: 0.25rem;
}

.message {
  padding: 1.5rem;
  border-radius: 1.5rem;
  margin: 1.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  backdrop-filter: blur(20px);
  text-align: center;
}

.error-message {
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid rgba(255, 68, 68, 0.4);
  color: rgba(255, 255, 255, 0.95);
}

.success-message {
  background: rgba(0, 119, 63, 0.3);
  border: 1px solid rgba(0, 119, 63, 0.5);
  color: #ffffff;
}

.details-section {
  padding: 2rem;
}

.view-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.detail-label {
  font-size: 1.25rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.detail-value-accent {
  background: linear-gradient(to right, var(--color), #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.edit-button {
  width: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(to right, #00733f, #a7d49b);
  color: #ffffff;
  font-weight: 900;
  font-size: 1.25rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.4s;
  box-shadow: 0 15px 30px rgba(0, 119, 63, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.edit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 25px 50px rgba(0, 119, 63, 0.5);
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 1.25rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input,
.form-select {
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(40px);
  color: #333333;
  font-weight: 600;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.5);
}

.form-input::placeholder {
  color: rgba(51, 51, 51, 0.6);
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.save-btn {
  flex: 1;
  padding: 1.5rem 2rem;
  background: linear-gradient(to right, #00733f, #a7d49b);
  color: #ffffff;
  font-weight: 900;
  font-size: 1.25rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 15px 30px rgba(0, 119, 63, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 119, 63, 0.5);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  flex: 1;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  font-size: 1.125rem;
  border-radius: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(20px);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 215, 0, 0.6);
  color: #ffd700;
  transform: translateY(-2px);
}

/* Component overrides for scoped styling */
.verified-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #22c55e;
}

.pending-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #fbbf24;
}
</style>
