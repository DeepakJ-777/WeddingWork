<script setup lang="ts">
import { ref } from "vue";
import confetti from "canvas-confetti";

interface RSVPPayload {
  name: string;
  attendance: "yes" | "no";
  addGuests: number;
  add_guest: number;
}

const name = ref("");
const attendance = ref<"yes" | "no" | null>("yes");
const addGuests = ref(0);
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const submittedState = ref<"yes" | "no">("yes");
const errorMessage = ref("");

function incrementGuests() {
  if (addGuests.value < 8) addGuests.value++;
}

function decrementGuests() {
  if (addGuests.value > 0) addGuests.value--;
}

async function handleRSVP() {
  if (!name.value.trim()) {
    errorMessage.value = "Please enter your name.";
    return;
  }

  if (!attendance.value) {
    errorMessage.value = "Please select whether you will attend.";
    return;
  }

  errorMessage.value = "";
  isSubmitting.value = true;

  const payload: RSVPPayload = {
    name: name.value.trim(),
    attendance: attendance.value,
    addGuests: attendance.value === "yes" ? addGuests.value : 0,
    add_guest: attendance.value === "yes" ? addGuests.value : 0,
  };

  try {
    try {
      await fetch("/api/guest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // In offline/prototype mode, still proceed smoothly
    }

    submittedState.value = attendance.value;
    isSubmitted.value = true;

    // Trigger subtle golden celebration confetti if attending
    if (attendance.value === "yes") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#B89B5E", "#D9C38F", "#23352C", "#F8F6F1"],
      });
    }
  } catch (err: any) {
    errorMessage.value = err?.message || "Failed to submit RSVP.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="rsvp-section" id="rsvp">
    <div class="rsvp-container">
      <!-- Cross Accent -->
      <div class="rsvp-crest">
        <svg class="crest-svg" viewBox="0 0 20 28" fill="none" aria-hidden="true">
          <line x1="10" y1="2" x2="10" y2="26" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="3" y1="9" x2="17" y2="9" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>

      <!-- ACTIVE RSVP FORM -->
      <div v-if="!isSubmitted" class="rsvp-card">
        <h2 class="rsvp-title">WILL YOU JOIN US?</h2>
        <p class="rsvp-subtitle">Your presence would mean the world to us as we celebrate our betrothal.</p>

        <form class="rsvp-form" @submit.prevent="handleRSVP">
          <!-- Name Input -->
          <div class="form-row">
            <label class="form-label" for="guest-name">YOUR FULL NAME</label>
            <input
              id="guest-name"
              v-model="name"
              type="text"
              class="form-input"
              placeholder="e.g. Maria Joseph"
              required
            />
          </div>

          <!-- Attendance Choice -->
          <div class="form-row">
            <span class="form-label">WILL YOU ATTEND?</span>
            <div class="choice-buttons">
              <button
                type="button"
                class="btn-choice"
                :class="{ active: attendance === 'yes' }"
                @click="attendance = 'yes'"
              >
                <span>YES, JOYFULLY ATTENDING</span>
              </button>
              <button
                type="button"
                class="btn-choice"
                :class="{ active: attendance === 'no' }"
                @click="attendance = 'no'"
              >
                <span>REGRETFULLY DECLINE</span>
              </button>
            </div>
          </div>

          <!-- Additional Guests (Eventify Flow: Only visible if Attending) -->
          <div v-if="attendance === 'yes'" class="form-row guest-counter-row">
            <span class="form-label">ADDITIONAL GUESTS (PLUS ONES / FAMILY)</span>
            <div class="counter-box">
              <button
                type="button"
                class="btn-counter"
                aria-label="Decrease guests"
                :disabled="addGuests === 0"
                @click="decrementGuests"
              >
                −
              </button>
              <span class="counter-value">{{ addGuests }}</span>
              <button
                type="button"
                class="btn-counter"
                aria-label="Increase guests"
                @click="incrementGuests"
              >
                +
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span>{{ isSubmitting ? 'CONFIRMING...' : 'CONFIRM RSVP →' }}</span>
          </button>
        </form>
      </div>

      <!-- CONFIRMATION: ATTENDING -->
      <div v-else-if="submittedState === 'yes'" class="confirmation-card">
        <div class="confirm-star">✦</div>
        <h3 class="confirm-title">THANK YOU</h3>
        <p class="confirm-message">
          We can’t wait to celebrate with you on <strong>27 December 2026</strong>.
        </p>
        <div class="confirm-divider"></div>
        <h4 class="couple-signature">DIVYA & JOHN</h4>
      </div>

      <!-- CONFIRMATION: NOT ATTENDING -->
      <div v-else class="confirmation-card">
        <div class="confirm-star">✦</div>
        <h3 class="confirm-title">THANK YOU FOR LETTING US KNOW</h3>
        <p class="confirm-message">
          We will miss having you with us in person, but we hold your warm wishes and prayers close to our hearts.
        </p>
        <div class="confirm-divider"></div>
        <h4 class="couple-signature">DIVYA & JOHN</h4>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rsvp-section {
  position: relative;
  background-color: var(--warm-white);
  padding: 8rem 1.5rem 9rem 1.5rem;
  color: var(--charcoal);
}

.rsvp-container {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rsvp-crest {
  margin-bottom: 1.5rem;
}

.crest-svg {
  width: 20px;
  height: 28px;
  display: block;
}

/* Card */
.rsvp-card, .confirmation-card {
  width: 100%;
  background: var(--ivory);
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  padding: clamp(2rem, 5vw, 3.5rem);
  box-shadow: 0 15px 45px rgba(28, 28, 26, 0.04);
  text-align: center;
}

.rsvp-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--charcoal);
  margin-bottom: 0.75rem;
}

.rsvp-subtitle {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto 2.5rem auto;
}

/* Form Layout */
.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: left;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.form-label {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--deep-green);
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  background: var(--white);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--charcoal);
  outline: none;
  transition: all 0.25s ease;
}

.form-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184, 155, 94, 0.15);
}

/* Choice Buttons */
.choice-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.btn-choice {
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  background: var(--white);
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--charcoal);
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.btn-choice.active {
  background: var(--deep-green);
  color: var(--white);
  border-color: var(--deep-green);
  box-shadow: 0 4px 15px rgba(35, 53, 44, 0.2);
}

/* Counter */
.guest-counter-row {
  align-items: flex-start;
}

.counter-box {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  background: var(--white);
  padding: 0.4rem 1rem;
}

.btn-counter {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 300;
  color: var(--charcoal);
  background: var(--warm-white);
  cursor: pointer;
  transition: background 0.2s;
}

.btn-counter:hover:not(:disabled) {
  background: var(--gold-pale);
}

.btn-counter:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.counter-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  min-width: 25px;
  text-align: center;
}

.error-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: #b0415d;
  text-align: center;
}

/* Submit */
.btn-submit {
  margin-top: 1rem;
  width: 100%;
  padding: 1.1rem;
  background: var(--deep-green);
  color: var(--white);
  border: none;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(35, 53, 44, 0.25);
}

.btn-submit:hover:not(:disabled) {
  background: var(--charcoal);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

/* Confirmation State */
.confirmation-card {
  padding: 4rem 2rem;
}

.confirm-star {
  font-size: 1.8rem;
  color: var(--gold);
  margin-bottom: 1.25rem;
}

.confirm-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--charcoal);
  margin-bottom: 1rem;
}

.confirm-message {
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.8;
  max-width: 480px;
  margin: 0 auto;
}

.confirm-divider {
  width: 50px;
  height: 1px;
  background: var(--gold);
  opacity: 0.5;
  margin: 2rem auto;
}

.couple-signature {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.16em;
  color: var(--deep-green);
}

@media (max-width: 550px) {
  .choice-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
