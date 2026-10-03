<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// ── PIN Auth ──────────────────────────────────────────────
const CORRECT_PIN = import.meta.env.VITE_DASHBOARD_PIN || "";
const SESSION_KEY = "dj_admin_auth";

const isAuthenticated = ref(sessionStorage.getItem(SESSION_KEY) === "1");
const pinInput = ref("");
const pinError = ref(false);
const pinShaking = ref(false);

function handlePinDigit(digit: string) {
  if (pinInput.value.length >= 4) return;
  pinInput.value += digit;
  if (pinInput.value.length === 4) {
    submitPin();
  }
}

function clearPin() {
  pinInput.value = "";
  pinError.value = false;
}

function submitPin() {
  if (pinInput.value === CORRECT_PIN) {
    sessionStorage.setItem(SESSION_KEY, "1");
    isAuthenticated.value = true;
    fetchRsvps();
  } else {
    pinError.value = true;
    pinShaking.value = true;
    setTimeout(() => {
      pinInput.value = "";
      pinShaking.value = false;
    }, 600);
  }
}

interface RsvpItem {
  id: string;
  name: string;
  attendance: "yes" | "no";
  addGuests: number;
  notes?: string | null;
  createdAt: string;
}

interface SummaryData {
  totalResponses: number;
  attendingCount: number;
  additionalGuestsCount: number;
  totalHeadcount: number;
  declinedCount: number;
}

const rsvps = ref<RsvpItem[]>([]);
const summary = ref<SummaryData>({
  totalResponses: 0,
  attendingCount: 0,
  additionalGuestsCount: 0,
  totalHeadcount: 0,
  declinedCount: 0,
});

const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref("");
const statusFilter = ref<"all" | "yes" | "no">("all");
const isDeletingId = ref<string | null>(null);

const eventDetails = {
  title: "BETROTHAL",
  couple: "DIVYA & JOHN",
  date: "27 DECEMBER 2026",
  time: "12:15 PM IST",
  venue: "St. Mary's Cathedral, Changanacherry ",
  subVenue: "Followed by Reception in Parish Hall",
  address: "Changanacherry, Kottayam, Kerala 686101",
  inviteUrl: "/invite/divya-john-betrothal",
};

async function fetchRsvps() {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch("/api/guest/list");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    const data = await res.json();
    rsvps.value = data.rsvps || [];
    summary.value = data.summary || {
      totalResponses: 0,
      attendingCount: 0,
      additionalGuestsCount: 0,
      totalHeadcount: 0,
      declinedCount: 0,
    };
  } catch (err: any) {
    console.error("API request issue:", err);
    error.value = `API Error: ${err?.message || "Unknown error"}`;
  } finally {
    loading.value = false;
  }
}

async function deleteRsvp(id: string) {
  if (!confirm("Are you sure you want to remove this RSVP entry?")) return;

  isDeletingId.value = id;
  try {
    const res = await fetch(`/api/guest/remove/${id}`, { method: "DELETE" });
    if (res.ok) {
      rsvps.value = rsvps.value.filter((r) => r.id !== id);
      // Recompute metrics
      const attending = rsvps.value.filter((r) => r.attendance === "yes");
      const declined = rsvps.value.filter((r) => r.attendance === "no");
      const addCount = attending.reduce((acc, curr) => acc + (Number(curr.addGuests) || 0), 0);
      summary.value = {
        totalResponses: rsvps.value.length,
        attendingCount: attending.length,
        additionalGuestsCount: addCount,
        totalHeadcount: attending.length + addCount,
        declinedCount: declined.length,
      };
    }
  } catch (err) {
    console.error("Failed to delete RSVP:", err);
  } finally {
    isDeletingId.value = null;
  }
}

const filteredRsvps = computed(() => {
  return rsvps.value.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim());
    const matchesStatus = statusFilter.value === "all" || item.attendance === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

function formatDate(isoStr: string): string {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

function exportToCsv() {
  if (rsvps.value.length === 0) {
    alert("No RSVP data to export.");
    return;
  }

  const headers = ["Guest Name", "Attendance", "Additional Guests", "Total Party Size", "Submitted At"];
  const rows = rsvps.value.map((r) => [
    `"${r.name.replace(/"/g, '""')}"`,
    r.attendance === "yes" ? "Attending" : "Declined",
    r.attendance === "yes" ? r.addGuests : 0,
    r.attendance === "yes" ? 1 + Number(r.addGuests) : 0,
    `"${formatDate(r.createdAt)}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Divya_John_Betrothal_RSVPs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const AUTO_REFRESH_INTERVAL = 30; // seconds
const countdown = ref(AUTO_REFRESH_INTERVAL);
const lastUpdated = ref<string | null>(null);
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let countdownTimer: ReturnType<typeof setInterval> | null = null;

function startAutoRefresh() {
  // Clear existing timers
  if (refreshTimer) clearInterval(refreshTimer);
  if (countdownTimer) clearInterval(countdownTimer);

  countdown.value = AUTO_REFRESH_INTERVAL;

  // Countdown ticker
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    }
  }, 1000);

  // Data fetch ticker
  refreshTimer = setInterval(async () => {
    if (!document.hidden) {
      await fetchRsvps();
      lastUpdated.value = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    countdown.value = AUTO_REFRESH_INTERVAL;
  }, AUTO_REFRESH_INTERVAL * 1000);
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchRsvps().then(() => {
      lastUpdated.value = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      startAutoRefresh();
    });
  }
});

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer);
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<template>
  <!-- PIN Lock Screen -->
  <div v-if="!isAuthenticated" class="pin-lock-screen">
    <div class="pin-card">
      <div class="pin-header">
        <h1 class="pin-title">ADMIN ACCESS</h1>
        <p class="pin-subtitle">Enter your 4-digit PIN to continue</p>
      </div>

      <!-- Dot indicators -->
      <div class="pin-dots" :class="{ shake: pinShaking }">
        <span v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: pinInput.length >= i, error: pinError }" />
      </div>

      <!-- Numpad -->
      <div class="pin-numpad">
        <button v-for="n in [1,2,3,4,5,6,7,8,9]" :key="n" class="pin-btn" @click="handlePinDigit(String(n))">
          {{ n }}
        </button>
        <button class="pin-btn pin-btn-ghost" @click="clearPin">CLR</button>
        <button class="pin-btn" @click="handlePinDigit('0')">0</button>
        <button class="pin-btn pin-btn-ghost" @click="pinInput = pinInput.slice(0,-1); pinError = false">&#9003;</button>
      </div>

      <p v-if="pinError" class="pin-error-msg">Incorrect PIN. Please try again.</p>
    </div>
  </div>

  <div v-else class="admin-dashboard">
    <!-- Top Bar -->
    <header class="admin-topbar">
      <div class="topbar-inner">
        <div class="admin-brand">
          <div>
            <h1 class="brand-title">BETROTHAL GUEST DATA</h1>
            <p class="brand-sub">Attendance Tracking & Event Operations</p>
          </div>
        </div>

        <div class="topbar-actions">
          <div class="auto-refresh-status">
            <span class="live-dot" />
            <span class="refresh-info">
              <span v-if="lastUpdated">Updated {{ lastUpdated }}</span>
            </span>
          </div>
          <router-link :to="eventDetails.inviteUrl" target="_blank" class="btn btn-outline">
            <span>VIEW LIVE INVITATION</span>
            <span class="btn-arrow">↗</span>
          </router-link>
          <button class="btn btn-primary" :disabled="loading" @click="() => { fetchRsvps(); startAutoRefresh(); lastUpdated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }">
            <span>{{ loading ? "REFRESHING..." : "REFRESH NOW" }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-content">
      <!-- 1. Event Details Banner -->
      <section class="event-details-card">
        <div class="details-left">
          <span class="eyebrow-tag">OFFICIAL CEREMONY</span>
          <h2 class="card-event-title">{{ eventDetails.title }}</h2>
          <p class="card-couple">{{ eventDetails.couple }}</p>
        </div>

        <div class="details-divider" aria-hidden="true"></div>

        <div class="details-right">
          <div class="detail-item">
            <span class="item-label">DATE & TIME</span>
            <p class="item-value">{{ eventDetails.date }} · {{ eventDetails.time }}</p>
          </div>
          <div class="detail-item">
            <span class="item-label">CEREMONY & RECEPTION VENUE</span>
            <p class="item-value">{{ eventDetails.venue }}</p>
            <p class="item-sub">{{ eventDetails.subVenue }} — {{ eventDetails.address }}</p>
          </div>
        </div>
      </section>

      <!-- 2. Numerical Headcount Stat Cards (Strictly No Emojis) -->
      <section class="metrics-grid">
        <div class="metric-card card-accent-green">
          <span class="metric-label">TOTAL HEADCOUNT</span>
          <span class="metric-value">{{ summary.totalHeadcount }}</span>
          <span class="metric-sub">Attending Guests + Plus Ones</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">ATTENDING GUESTS</span>
          <span class="metric-value">{{ summary.attendingCount }}</span>
          <span class="metric-sub">Primary Responses</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">ADDITIONAL GUESTS</span>
          <span class="metric-value">{{ summary.additionalGuestsCount }}</span>
          <span class="metric-sub">Family & Plus Ones</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">REGRETFULLY DECLINED</span>
          <span class="metric-value">{{ summary.declinedCount }}</span>
          <span class="metric-sub">Unable to attend</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">TOTAL SUBMISSIONS</span>
          <span class="metric-value">{{ summary.totalResponses }}</span>
          <span class="metric-sub">Combined Responses</span>
        </div>
      </section>

      <!-- 3. Guest List Table & Controls -->
      <section class="table-section">
        <div class="table-controls-bar">
          <div class="filter-tabs">
            <button
              class="tab-btn"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              ALL RESPONSES ({{ summary.totalResponses }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: statusFilter === 'yes' }"
              @click="statusFilter = 'yes'"
            >
              ATTENDING ({{ summary.attendingCount }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: statusFilter === 'no' }"
              @click="statusFilter = 'no'"
            >
              DECLINED ({{ summary.declinedCount }})
            </button>
          </div>

          <div class="actions-right">
            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Search guest name..."
              />
              <span v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</span>
            </div>

            <button class="btn btn-export" @click="exportToCsv">
              <span>EXPORT GUEST LIST .CSV</span>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="table-container">
          <div v-if="loading" class="state-container">
            <p>Loading guest responses...</p>
          </div>

          <div v-else-if="error" class="error-container">
            <p class="error-text">{{ error }}</p>
            <button class="btn btn-primary" style="margin-top:1rem" @click="fetchRsvps">RETRY</button>
          </div>

          <div v-else-if="filteredRsvps.length === 0" class="empty-container">
            <span class="empty-star" aria-hidden="true">✦</span>
            <h3>No guest responses found</h3>
            <p v-if="searchQuery">No guests match "{{ searchQuery }}".</p>
            <p v-else>Responses submitted via the digital invitation will appear here in real time.</p>
          </div>

          <table v-else class="rsvp-table">
            <thead>
              <tr>
                <th class="th-name">GUEST NAME</th>
                <th class="th-status">ATTENDANCE</th>
                <th class="th-plus">ADDITIONAL GUESTS</th>
                <th class="th-total">TOTAL PARTY</th>
                <th class="th-date">DATE SUBMITTED</th>
                <th class="th-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="guest in filteredRsvps" :key="guest.id" class="table-row">
                <td class="td-name">
                  <span class="guest-name-text">{{ guest.name }}</span>
                </td>
                <td class="td-status">
                  <span
                    class="status-capsule"
                    :class="guest.attendance === 'yes' ? 'status-attending' : 'status-declined'"
                  >
                    <span class="capsule-pip"></span>
                    <span>{{ guest.attendance === 'yes' ? 'ATTENDING' : 'DECLINED' }}</span>
                  </span>
                </td>
                <td class="td-plus">
                  <span v-if="guest.attendance === 'yes'" class="plus-count">
                    {{ guest.addGuests > 0 ? `+${guest.addGuests}` : '—' }}
                  </span>
                  <span v-else class="muted-dash">—</span>
                </td>
                <td class="td-total">
                  <span v-if="guest.attendance === 'yes'" class="total-party-badge">
                    {{ 1 + Number(guest.addGuests) }}
                  </span>
                  <span v-else class="muted-dash">—</span>
                </td>
                <td class="td-date">
                  <span class="date-text">{{ formatDate(guest.createdAt) }}</span>
                </td>
                <td class="td-action">
                  <button
                    class="btn-delete"
                    :disabled="isDeletingId === guest.id"
                    title="Remove entry"
                    @click="deleteRsvp(guest.id)"
                  >
                    <span>{{ isDeletingId === guest.id ? "..." : "REMOVE" }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: var(--ivory);
  color: var(--charcoal);
  font-family: var(--font-body);
}

/* Top Bar */
.admin-topbar {
  background: var(--white);
  border-bottom: 1px solid var(--border-gold);
  padding: 1.25rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(28, 28, 26, 0.03);
}

.topbar-inner {
  max-width: 1250px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-crest {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--warm-white);
  border: 1px solid var(--border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-cross {
  width: 14px;
  height: 20px;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.14em;
  font-weight: 500;
  color: var(--charcoal);
  line-height: 1.2;
}

.brand-sub {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  color: var(--muted);
  text-transform: uppercase;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.15rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--deep-green);
  color: var(--white);
  border-color: var(--deep-green);
}

.btn-primary:hover:not(:disabled) {
  background: var(--charcoal);
  border-color: var(--charcoal);
}

.btn-outline {
  background: var(--warm-white);
  color: var(--charcoal);
  border-color: var(--border-gold);
}

.btn-outline:hover {
  background: var(--white);
  border-color: var(--gold);
}

.btn-export {
  background: var(--white);
  color: var(--deep-green);
  border-color: var(--border-gold);
}

.btn-export:hover {
  background: var(--warm-white);
  border-color: var(--deep-green);
}

.btn-arrow {
  font-size: 0.85rem;
  color: var(--gold);
}

/* Auto-refresh Status */
.auto-refresh-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf7d;
  display: inline-block;
  animation: pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.refresh-info {
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--muted);
  white-space: nowrap;
}

.countdown-sep {
  color: var(--border-gold);
}

/* Dashboard Content */
.dashboard-content {
  max-width: 1250px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 6rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 1. Event Details Card */
.event-details-card {
  background: var(--white);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  box-shadow: 0 10px 30px rgba(28, 28, 26, 0.03);
}

.details-left {
  flex: 1;
}

.eyebrow-tag {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.35rem;
}

.card-event-title {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--charcoal);
  line-height: 1.2;
}

.card-couple {
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--deep-green);
  letter-spacing: 0.12em;
  margin-top: 0.25rem;
}

.details-divider {
  width: 1px;
  height: 80px;
  background: var(--border-gold);
  opacity: 0.5;
}

.details-right {
  flex: 1.3;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.item-value {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--charcoal);
  line-height: 1.4;
}

.item-sub {
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.4;
  margin-top: 0.2rem;
}

/* 2. Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.metric-card {
  background: var(--white);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 16px rgba(28, 28, 26, 0.02);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(28, 28, 26, 0.06);
}

.card-accent-green {
  background: var(--deep-green);
  color: var(--white);
  border-color: var(--deep-green);
}

.card-accent-green .metric-label {
  color: var(--gold-pale);
}

.card-accent-green .metric-value {
  color: var(--white);
}

.card-accent-green .metric-sub {
  color: rgba(248, 246, 241, 0.75);
}

.metric-label {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
}

.metric-value {
  font-family: var(--font-display);
  font-size: 2.85rem;
  line-height: 1;
  font-weight: 400;
  color: var(--charcoal);
  margin: 0.65rem 0 0.4rem 0;
}

.metric-sub {
  font-size: 0.75rem;
  color: var(--muted);
}

/* 3. Table Section */
.table-section {
  background: var(--white);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(28, 28, 26, 0.03);
}

.table-controls-bar {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border-gold);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  background: var(--warm-white);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 0.45rem 0.95rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--charcoal);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--white);
}

.tab-btn.active {
  background: var(--deep-green);
  color: var(--white);
  border-color: var(--deep-green);
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  min-width: 240px;
}

.search-input {
  width: 100%;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-gold);
  background: var(--white);
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--charcoal);
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--deep-green);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--muted);
}

/* Table */
.table-container {
  overflow-x: auto;
  width: 100%;
}

.rsvp-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.rsvp-table th {
  padding: 1rem 1.75rem;
  background: var(--white);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-gold);
}

.rsvp-table td {
  padding: 1.15rem 1.75rem;
  border-bottom: 1px solid rgba(184, 155, 94, 0.15);
  font-size: 0.88rem;
  color: var(--charcoal);
}

.table-row:hover {
  background: rgba(248, 246, 241, 0.6);
}

.guest-name-text {
  font-weight: 600;
  color: var(--charcoal);
  font-size: 0.95rem;
}

/* Status Capsules */
.status-capsule {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.status-attending {
  background: rgba(35, 53, 44, 0.08);
  color: var(--deep-green);
  border: 1px solid rgba(35, 53, 44, 0.25);
}

.status-attending .capsule-pip {
  background: var(--deep-green);
}

.status-declined {
  background: rgba(28, 28, 26, 0.06);
  color: var(--muted);
  border: 1px solid rgba(28, 28, 26, 0.15);
}

.status-declined .capsule-pip {
  background: var(--muted);
}

.capsule-pip {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.plus-count {
  font-weight: 600;
  color: var(--gold);
}

.total-party-badge {
  display: inline-block;
  font-weight: 700;
  color: var(--deep-green);
  background: rgba(35, 53, 44, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.muted-dash {
  color: var(--border-gold);
}

.date-text {
  font-size: 0.78rem;
  color: var(--muted);
}

.btn-delete {
  background: transparent;
  border: 1px solid rgba(184, 155, 94, 0.3);
  color: var(--muted);
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover:not(:disabled) {
  background: #fbebee;
  color: #c92a2a;
  border-color: #f0a8b2;
}

/* Empty / State */
.state-container,
.empty-container {
  padding: 5rem 2rem;
  text-align: center;
  color: var(--muted);
}

.empty-star {
  font-size: 1.5rem;
  color: var(--gold);
  display: block;
  margin-bottom: 0.85rem;
}

.empty-container h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--charcoal);
  margin-bottom: 0.4rem;
}

/* Responsive */
@media (max-width: 900px) {
  .event-details-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .details-divider {
    display: none;
  }

  .details-right {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    width: 100%;
  }

  .table-controls-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-right {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-wrapper {
    width: 100%;
  }
}

/* ── PIN Lock Screen ─────────────────────────────────────── */
.pin-lock-screen {
  min-height: 100vh;
  background: #0d0d0f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.pin-card {
  background: #16161a;
  border: 1px solid rgba(200, 169, 81, 0.2);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
}

.pin-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.pin-cross {
  width: 20px;
  height: 28px;
  margin-bottom: 0.25rem;
}

.pin-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #c8a951;
  margin: 0;
}

.pin-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
  margin: 0;
}

.pin-dots {
  display: flex;
  gap: 1rem;
}

.pin-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(200, 169, 81, 0.4);
  background: transparent;
  transition: background 0.15s, border-color 0.15s;
}

.pin-dot.filled {
  background: #c8a951;
  border-color: #c8a951;
}

.pin-dot.error {
  border-color: #e05252;
  background: #e05252;
}

.pin-dots.shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}

.pin-numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
}

.pin-btn {
  background: #1e1e24;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
}

.pin-btn:hover {
  background: rgba(200, 169, 81, 0.12);
  border-color: rgba(200, 169, 81, 0.35);
}

.pin-btn:active {
  transform: scale(0.95);
}

.pin-btn-ghost {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.pin-error-msg {
  font-size: 0.75rem;
  color: #e05252;
  letter-spacing: 0.05em;
  margin: -0.5rem 0 0;
  text-align: center;
}
</style>
