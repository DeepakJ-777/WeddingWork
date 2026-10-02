<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Wedding {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime?: string;
  status: string;
}

const weddings = ref<Wedding[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadWeddings() {
  loading.value = true;
  try {
    const res = await fetch("/api/weddings");
    if (!res.ok) {
      // In initial dev without auth session, provide demo link
      weddings.value = [
        {
          id: "demo-wedding-1",
          slug: "rahul-ananya",
          brideName: "Ananya",
          groomName: "Rahul",
          weddingDate: "2026-12-23",
          weddingTime: "10:30 AM",
          status: "published",
        },
      ];
      return;
    }
    const data = await res.json();
    weddings.value = data.length > 0 ? data : [
      {
        id: "demo-wedding-1",
        slug: "rahul-ananya",
        brideName: "Ananya",
        groomName: "Rahul",
        weddingDate: "2026-12-23",
        weddingTime: "10:30 AM",
        status: "published",
      }
    ];
  } catch (err: any) {
    error.value = err.message || "Failed to load weddings";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadWeddings();
});
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-inner">
        <div class="brand">
          <span class="ring-icon">💍</span>
          <div>
            <h1>Wedding Studio</h1>
            <p>Manage your digital wedding invitation</p>
          </div>
        </div>
        <div class="header-actions">
          <router-link to="/dashboard/wedding/new" class="btn btn-primary">
            + Create Wedding
          </router-link>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div v-if="loading" class="state-box">
        <p>Loading your weddings...</p>
      </div>

      <div v-else-if="weddings.length === 0" class="empty-state">
        <div class="empty-icon">💌</div>
        <h2>No weddings created yet</h2>
        <p>Start by creating your first wedding invitation.</p>
        <router-link to="/dashboard/wedding/new" class="btn btn-primary">
          Create Wedding
        </router-link>
      </div>

      <div v-else class="weddings-grid">
        <div v-for="w in weddings" :key="w.id" class="wedding-card">
          <div class="card-status" :class="w.status">{{ w.status }}</div>
          <h2 class="couple-title">{{ w.brideName }} & {{ w.groomName }}</h2>
          <p class="wedding-date">📅 {{ w.weddingDate }} {{ w.weddingTime ? '• ' + w.weddingTime : '' }}</p>
          <p class="wedding-slug">🔗 /w/{{ w.slug }}</p>

          <div class="card-actions">
            <router-link :to="`/dashboard/wedding/${w.id}`" class="btn btn-secondary">
              Edit
            </router-link>
            <router-link :to="`/w/${w.slug}`" target="_blank" class="btn btn-primary">
              View Invite ↗
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f7f5f0;
  color: #2c2523;
}

.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e7e2d9;
  padding: 1.25rem 2rem;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ring-icon {
  font-size: 2.25rem;
}

.brand h1 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  color: #8b263e;
}

.brand p {
  font-size: 0.875rem;
  color: #7a706b;
}

.dashboard-main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.weddings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.wedding-card {
  background: #ffffff;
  border: 1px solid #e7e2d9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  background: #eef2ff;
  color: #4338ca;
}

.card-status.published {
  background: #ecfdf5;
  color: #065f46;
}

.couple-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  color: #8b263e;
  margin-top: 0.25rem;
}

.wedding-date {
  font-size: 0.95rem;
  color: #4b4543;
}

.wedding-slug {
  font-size: 0.85rem;
  color: #c5a059;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #8b263e;
  color: #ffffff;
}

.btn-primary:hover {
  background: #6f1e31;
}

.btn-secondary {
  background: #f0eae1;
  color: #4b4543;
}

.btn-secondary:hover {
  background: #e4dbcf;
}

.state-box, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #d5cdbf;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
</style>
