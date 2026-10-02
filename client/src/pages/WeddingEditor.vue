<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isEditing = Boolean(route.params.id);

const form = ref({
  brideName: "Ananya",
  groomName: "Rahul",
  slug: "rahul-ananya",
  weddingDate: "2026-12-23",
  weddingTime: "10:30 AM",
  coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  description: "Together with their families, Rahul and Ananya invite you to join them in celebrating their wedding day.",
  status: "published",
});

const saving = ref(false);
const message = ref<string | null>(null);

async function saveWedding() {
  saving.value = true;
  message.value = null;
  try {
    const url = isEditing ? `/api/weddings/${route.params.id}` : "/api/weddings";
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    if (res.ok) {
      message.value = "Wedding saved successfully!";
      setTimeout(() => router.push("/dashboard"), 1200);
    } else {
      const err = await res.json();
      message.value = err.error || "Failed to save";
    }
  } catch (err: any) {
    message.value = err.message || "Network error";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="editor-container">
    <header class="editor-header">
      <router-link to="/dashboard" class="back-link">← Back to Dashboard</router-link>
      <h2>{{ isEditing ? 'Edit Wedding' : 'Create New Wedding' }}</h2>
      <button class="btn btn-primary" :disabled="saving" @click="saveWedding">
        {{ saving ? 'Saving...' : 'Save Wedding' }}
      </button>
    </header>

    <main class="editor-body">
      <div v-if="message" class="status-banner">{{ message }}</div>

      <div class="form-card">
        <h3>Couple & Wedding Details</h3>

        <div class="form-grid">
          <div class="form-group">
            <label>Bride's Name</label>
            <input v-model="form.brideName" type="text" placeholder="e.g. Ananya" />
          </div>

          <div class="form-group">
            <label>Groom's Name</label>
            <input v-model="form.groomName" type="text" placeholder="e.g. Rahul" />
          </div>

          <div class="form-group">
            <label>Custom Link Slug (/w/your-slug)</label>
            <input v-model="form.slug" type="text" placeholder="e.g. rahul-ananya" />
          </div>

          <div class="form-group">
            <label>Wedding Date</label>
            <input v-model="form.weddingDate" type="date" />
          </div>

          <div class="form-group">
            <label>Wedding Time</label>
            <input v-model="form.weddingTime" type="text" placeholder="e.g. 10:30 AM" />
          </div>

          <div class="form-group">
            <label>Cover Photo URL</label>
            <input v-model="form.coverImage" type="text" placeholder="https://..." />
          </div>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
          <label>Invitation Description / Message</label>
          <textarea v-model="form.description" rows="3" placeholder="Together with their families..."></textarea>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.editor-container {
  min-height: 100vh;
  background: #f7f5f0;
}

.editor-header {
  background: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e7e2d9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link {
  color: #7a706b;
  font-weight: 600;
  font-size: 0.9rem;
}

.editor-body {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.form-card {
  background: #ffffff;
  border: 1px solid #e7e2d9;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.form-card h3 {
  font-family: var(--font-serif);
  color: #8b263e;
  margin-bottom: 1.5rem;
  font-size: 1.35rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #524a46;
}

.form-group input,
.form-group textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid #dcd5ca;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b263e;
  box-shadow: 0 0 0 3px rgba(139, 38, 62, 0.1);
}

.status-banner {
  background: #ecfdf5;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #8b263e;
  color: #ffffff;
}
</style>
