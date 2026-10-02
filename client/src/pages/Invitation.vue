<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const slug = (route.params.slug as string) || "rahul-ananya";

interface WeddingData {
  wedding: {
    id: string;
    slug: string;
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingTime: string;
    coverImage: string;
    description: string;
  };
  events: Array<{
    id: string;
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    address: string;
    mapsUrl: string;
  }>;
  memories: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    location: string;
    imageUrl: string;
  }>;
  gallery: Array<{
    id: string;
    imageUrl: string;
    caption: string;
  }>;
}

const data = ref<WeddingData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Countdown logic
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });
let timer: any = null;

function updateCountdown() {
  if (!data.value?.wedding?.weddingDate) return;
  const targetDateStr = `${data.value.wedding.weddingDate}T10:00:00`;
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    return;
  }

  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPassed: false,
  };
}

async function fetchWedding() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(`/api/public/weddings/${slug}`);
    if (!res.ok) throw new Error("Could not find invitation");
    data.value = await res.json();
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
  } catch (err: any) {
    error.value = err.message || "Failed to load invitation";
  } finally {
    loading.value = false;
  }
}

// Google Calendar URL generator
function getGoogleCalendarUrl(event: any) {
  const title = encodeURIComponent(`${data.value?.wedding?.brideName} & ${data.value?.wedding?.groomName} - ${event.name}`);
  const details = encodeURIComponent(event.description || "Wedding Celebration");
  const location = encodeURIComponent(`${event.venue || ""}, ${event.address || ""}`);
  // Format YYYYMMDD
  const cleanDate = (event.date || "").replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T040000Z/${cleanDate}T090000Z`;
}

// Download .ics file
function downloadIcs(event: any) {
  const cleanDate = (event.date || "").replace(/-/g, "");
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingStudio//WeddingInvite//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${data.value?.wedding?.brideName} & ${data.value?.wedding?.groomName} - ${event.name}`,
    `DESCRIPTION:${event.description || ""}`,
    `LOCATION:${event.venue || ""} ${event.address || ""}`,
    `DTSTART:${cleanDate}T040000Z`,
    `DTEND:${cleanDate}T090000Z`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.name}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  fetchWedding();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div v-if="loading" class="invite-loading">
    <span class="loading-ring">💍</span>
    <p>Opening Invitation...</p>
  </div>

  <div v-else-if="error || !data" class="invite-error">
    <h2>Invitation Not Found</h2>
    <p>{{ error }}</p>
    <router-link to="/dashboard" class="btn">Go to Dashboard</router-link>
  </div>

  <div v-else class="invitation-page">
    <!-- HERO SECTION -->
    <header class="hero-section" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${data.wedding.coverImage})` }">
      <div class="hero-content">
        <p class="hero-subtitle">Together with their families</p>
        <h1 class="couple-names">{{ data.wedding.brideName }} & {{ data.wedding.groomName }}</h1>
        <div class="hero-divider">❦</div>
        <p class="hero-date">SAVE THE DATE</p>
        <p class="hero-day">{{ data.wedding.weddingDate }}</p>
        <p v-if="data.wedding.weddingTime" class="hero-time">{{ data.wedding.weddingTime }}</p>
      </div>
    </header>

    <!-- COUPLE SECTION -->
    <section class="section couple-section">
      <h2 class="section-title">The Couple</h2>
      <div class="couple-pair">
        <div class="person">
          <div class="person-role">Bride</div>
          <h3 class="person-name">{{ data.wedding.brideName }}</h3>
        </div>
        <div class="heart-symbol">❤️</div>
        <div class="person">
          <div class="person-role">Groom</div>
          <h3 class="person-name">{{ data.wedding.groomName }}</h3>
        </div>
      </div>
      <p class="invitation-message">{{ data.wedding.description }}</p>
    </section>

    <!-- COUNTDOWN SECTION -->
    <section class="section countdown-section">
      <h2 class="section-title">The Big Day</h2>
      <div v-if="timeLeft.isPassed" class="passed-badge">
        <h3>TODAY IS THE DAY ❤️</h3>
      </div>
      <div v-else class="countdown-grid">
        <div class="time-block">
          <span class="time-num">{{ timeLeft.days }}</span>
          <span class="time-label">DAYS</span>
        </div>
        <div class="time-block">
          <span class="time-num">{{ timeLeft.hours }}</span>
          <span class="time-label">HOURS</span>
        </div>
        <div class="time-block">
          <span class="time-num">{{ timeLeft.minutes }}</span>
          <span class="time-label">MINUTES</span>
        </div>
        <div class="time-block">
          <span class="time-num">{{ timeLeft.seconds }}</span>
          <span class="time-label">SECONDS</span>
        </div>
      </div>
    </section>

    <!-- MEMORY LANE SECTION -->
    <section v-if="data.memories && data.memories.length > 0" class="section memory-section">
      <h2 class="section-title">Our Story & Memory Lane</h2>
      <div class="timeline">
        <div v-for="(mem, idx) in data.memories" :key="mem.id" class="timeline-item" :class="{ 'timeline-left': idx % 2 === 0, 'timeline-right': idx % 2 !== 0 }">
          <div class="timeline-badge">{{ mem.date }}</div>
          <div class="timeline-card">
            <img v-if="mem.imageUrl" :src="mem.imageUrl" :alt="mem.title" class="memory-img" />
            <h4 class="memory-title">{{ mem.title }}</h4>
            <p v-if="mem.location" class="memory-location">📍 {{ mem.location }}</p>
            <p class="memory-desc">{{ mem.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EVENTS SECTION -->
    <section v-if="data.events && data.events.length > 0" class="section events-section">
      <h2 class="section-title">Celebration Events</h2>
      <div class="events-grid">
        <div v-for="evt in data.events" :key="evt.id" class="event-card">
          <h3 class="event-name">{{ evt.name }}</h3>
          <p class="event-datetime">
            📅 {{ evt.date }}
            <span v-if="evt.startTime"> | ⏰ {{ evt.startTime }} <span v-if="evt.endTime">- {{ evt.endTime }}</span></span>
          </p>
          <p class="event-venue">📍 {{ evt.venue }}</p>
          <p v-if="evt.address" class="event-address">{{ evt.address }}</p>
          <p v-if="evt.description" class="event-desc">{{ evt.description }}</p>

          <div class="event-buttons">
            <a v-if="evt.mapsUrl" :href="evt.mapsUrl" target="_blank" rel="noopener noreferrer" class="btn btn-maps">
              Get Directions ↗
            </a>
            <a :href="getGoogleCalendarUrl(evt)" target="_blank" rel="noopener noreferrer" class="btn btn-cal">
              + Google Cal
            </a>
            <button class="btn btn-ics" @click="downloadIcs(evt)">
              .ics file
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY SECTION -->
    <section v-if="data.gallery && data.gallery.length > 0" class="section gallery-section">
      <h2 class="section-title">Captured Moments</h2>
      <div class="gallery-grid">
        <div v-for="photo in data.gallery" :key="photo.id" class="gallery-item">
          <img :src="photo.imageUrl" :alt="photo.caption || 'Couple Moment'" />
          <div v-if="photo.caption" class="gallery-caption">{{ photo.caption }}</div>
        </div>
      </div>
    </section>

    <!-- FOOTER / FINAL MESSAGE -->
    <footer class="invite-footer">
      <div class="footer-inner">
        <p class="footer-tagline">We can't wait to celebrate with you.</p>
        <span class="footer-heart">❤️</span>
        <h3 class="footer-couple">{{ data.wedding.brideName }} & {{ data.wedding.groomName }}</h3>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.invitation-page {
  font-family: var(--font-sans);
  color: #2c2523;
  background: #faf7f2;
}

.hero-section {
  min-height: 90vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  padding: 3rem 1.5rem;
}

.hero-content {
  max-width: 800px;
  animation: fadeIn 1.2s ease-out;
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e5ded2;
  margin-bottom: 1rem;
}

.couple-names {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0.5rem 0;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.hero-divider {
  font-size: 2rem;
  color: #dfc288;
  margin: 1rem 0;
}

.hero-date {
  letter-spacing: 0.3em;
  font-size: 0.9rem;
  color: #dfc288;
  font-weight: 600;
}

.hero-day {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  margin-top: 0.25rem;
  font-weight: 600;
}

.hero-time {
  font-size: 1.1rem;
  color: #eae5de;
}

.section {
  padding: 5rem 1.5rem;
  max-width: 1050px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  color: #8b263e;
  margin-bottom: 2.5rem;
  position: relative;
  letter-spacing: 0.05em;
}

.couple-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.person-role {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: #c5a059;
  font-weight: 700;
}

.person-name {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  color: #2c2523;
}

.heart-symbol {
  font-size: 2.2rem;
  color: #8b263e;
}

.invitation-message {
  max-width: 650px;
  margin: 0 auto;
  font-size: 1.15rem;
  line-height: 1.8;
  color: #5d5350;
  font-style: italic;
}

.countdown-section {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.countdown-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #faf7f2;
  border: 1px solid #eee8df;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  min-width: 110px;
}

.time-num {
  font-family: var(--font-serif);
  font-size: 2.75rem;
  font-weight: 700;
  color: #8b263e;
}

.time-label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #7a706b;
  font-weight: 600;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  background: #ffffff;
  border: 1px solid #ebd8bf;
  border-radius: 16px;
  padding: 2.25rem 1.75rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.04);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-name {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: #8b263e;
}

.event-datetime {
  font-weight: 600;
  color: #3b3330;
  font-size: 0.95rem;
}

.event-venue {
  font-weight: 700;
  color: #c5a059;
}

.event-address {
  font-size: 0.9rem;
  color: #6d6360;
}

.event-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #504845;
  margin-top: 0.5rem;
}

.event-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-maps {
  background: #8b263e;
  color: #ffffff;
}

.btn-cal {
  background: #f4ecdf;
  color: #643f16;
}

.btn-ics {
  background: #eef2f6;
  color: #334155;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  max-width: 750px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-badge {
  background: #8b263e;
  color: #ffffff;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.timeline-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #ebd8bf;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.memory-img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.memory-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: #8b263e;
}

.memory-location {
  color: #c5a059;
  font-size: 0.85rem;
  margin: 0.25rem 0;
  font-weight: 600;
}

.memory-desc {
  font-size: 0.95rem;
  color: #554e4b;
  line-height: 1.6;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.gallery-item img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.04);
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

.invite-footer {
  background: #1f1b1a;
  color: #f7f5f0;
  padding: 4rem 1.5rem;
  text-align: center;
  border-top: 1px solid #3d3533;
}

.footer-tagline {
  font-size: 1.25rem;
  font-family: var(--font-serif);
  font-style: italic;
  color: #dfc288;
}

.footer-heart {
  display: inline-block;
  font-size: 1.75rem;
  margin: 1rem 0;
}

.footer-couple {
  font-family: var(--font-serif);
  font-size: 2rem;
  letter-spacing: 0.05em;
}

.invite-loading, .invite-error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: var(--font-serif);
}

.loading-ring {
  font-size: 3rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
