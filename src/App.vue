<script setup lang="ts">
  import { ref } from 'vue'
  import VueTurnstile from './VueTurnstile.vue'
  import type { TurnstileTheme, TurnstileSize } from './types'

  // IMPORTANT: Replace with your actual Cloudflare Turnstile site key
  // For testing, you can use Cloudflare's test keys:
  // - Visible (always passes): 1x00000000000000000000AA
  // - Invisible (always passes): 2x00000000000000000000AB
  // - Force challenge: 3x00000000000000000000FF
  const SITE_KEY = '1x00000000000000000000AA'

  const token = ref<string>('')
  const theme = ref<TurnstileTheme>('auto')
  const size = ref<TurnstileSize>('normal')
  const resetKey = ref(0)
  const turnstileRef = ref<InstanceType<typeof VueTurnstile> | null>(null)

  const handleSuccess = (responseToken: string) => {
    console.log('Success! Token:', responseToken)
    token.value = responseToken
  }

  const handleError = (errorCode?: string) => {
    console.error('Error:', errorCode)
    token.value = ''
  }

  const handleExpired = () => {
    console.log('Token expired')
    token.value = ''
  }

  const resetWidget = () => {
    resetKey.value++
    token.value = ''
  }

  const manualReset = () => {
    turnstileRef.value?.reset()
    token.value = ''
  }

  const getResponse = () => {
    const response = turnstileRef.value?.getResponse()
    console.log('Current response:', response)
    alert(`Current token: ${response || 'No token available'}`)
  }
</script>

<template>
  <div class="app">
    <main class="main">
      <section class="demo-section">
        <h2>Basic Demo</h2>
        <p class="description">
          This is a basic implementation of the Cloudflare Turnstile component.
        </p>

        <div class="turnstile-container">
          <VueTurnstile
            ref="turnstileRef"
            :site-key="SITE_KEY"
            :theme="theme"
            :size="size"
            :reset-key="resetKey"
            @success="handleSuccess"
            @error="handleError"
            @expired="handleExpired"
          />
        </div>

        <div
          v-if="token"
          class="token-display"
        >
          <h3>Token Received:</h3>
          <code>{{ token.substring(0, 50) }}...</code>
        </div>
      </section>

      <section class="controls-section">
        <h2>Configuration</h2>

        <div class="control-group">
          <label for="theme">Theme:</label>
          <select
            id="theme"
            v-model="theme"
          >
            <option value="auto">
              Auto
            </option>
            <option value="light">
              Light
            </option>
            <option value="dark">
              Dark
            </option>
          </select>
        </div>

        <div class="control-group">
          <label for="size">Size:</label>
          <select
            id="size"
            v-model="size"
          >
            <option value="normal">
              Normal
            </option>
            <option value="compact">
              Compact
            </option>
            <option value="flexible">
              Flexible
            </option>
            <option value="invisible">
              Invisible
            </option>
          </select>
        </div>

        <div class="control-group">
          <button
            class="btn"
            @click="resetWidget"
          >
            Reset (via resetKey)
          </button>
          <button
            class="btn"
            @click="manualReset"
          >
            Reset (via ref)
          </button>
          <button
            class="btn btn-secondary"
            @click="getResponse"
          >
            Get Response
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .demo-section,
  .controls-section,
  .info-section {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  h2 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .description {
    color: #7f8c8d;
    margin-bottom: 1.5rem;
  }

  .turnstile-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: white;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .token-display {
    background: #e8f5e9;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #4caf50;
  }

  .token-display h3 {
    margin-top: 0;
    font-size: 1rem;
    color: #2e7d32;
  }

  .token-display code {
    display: block;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
    color: #000;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .control-group label {
    font-weight: 600;
    min-width: 80px;
    color: #2c3e50;
  }

  .btn {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .btn:hover {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
  }

  .btn-secondary:hover {
    background: #545b62;
  }

  .info-content h3 {
    margin-top: 1.5rem;
    font-size: 1.2rem;
    color: #2c3e50;
  }

  .info-content h3:first-child {
    margin-top: 0;
  }

  .info-content pre {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  .info-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .info-content li {
    margin: 0.5rem 0;
    color: #555;
  }

  .footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e9ecef;
  }

  .footer a {
    color: #007bff;
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .app {
      padding: 1rem;
    }

    .header h1 {
      font-size: 2rem;
    }

    .control-group {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
