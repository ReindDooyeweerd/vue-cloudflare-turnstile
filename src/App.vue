<script setup lang="ts">
  // Import components
  import { ref } from 'vue'
  import VueTurnstile from './VueTurnstile.vue'

  // Import types
  import type { TurnstileTheme, TurnstileSize } from './types'

  /**
   * Cloudflare Turnstile site key
   *
   * For testing, you can use Cloudflare's test keys:
   * - Visible (always passes): 1x00000000000000000000AA
   * - Invisible (always passes): 2x00000000000000000000AB
   * - Force challenge: 3x00000000000000000000FF
   */
  const SITE_KEY = ref<string>('1x00000000000000000000AA')

  /**
   * Reactive references
   */
  const resetKey = ref(0)
  const size = ref<TurnstileSize>('normal')
  const theme = ref<TurnstileTheme>('auto')
  const token = ref<string>('')
  const turnstileRef = ref<InstanceType<typeof VueTurnstile> | null>(null)

  /**
   * handleSuccess
   * @param responseToken - The token received upon successful completion
   */
  function handleSuccess(responseToken: string) {
    console.log('Success! Token:', responseToken)
    token.value = responseToken
  }

  /**
   * handleError
   * @param errorCode - Optional error code if an error occurred
   */
  function handleError(errorCode?: string) {
    console.error('Error:', errorCode)
    token.value = ''
  }

  /**
   * handleExpired
   * Called when the token expires
   */
  function handleExpired() {
    console.log('Token expired')
    token.value = ''
  }

  /**
   * manualReset
   * Manually resets the Turnstile widget via ref
   */
  function manualReset() {
    const turnstile = turnstileRef.value
    if (turnstile) {
      turnstile.reset()
    }
  }

  /**
   * getResponse
   * Retrieves the current response token from the Turnstile widget
   */
  const getResponse = () => {
    const response = turnstileRef.value?.getResponse()
    console.log('Current response:', response)
    alert(`Current token: ${response || 'No token available'}`)
  }
</script>

<template>
  <div class="demo-container">
    <div class="demo-intro">
      <h1>Vue Cloudflare Turnstile</h1>
      <p>
        A Vue 3 component wrapper for Cloudflare Turnstile. A user-friendly, privacy-preserving alternative to
        (re)CAPTCHA.
      </p>
      <p>Protect your forms from bots and spam without compromising user experience.</p>
      <ul>
        <li>✅ Vue 3 & TypeScript - Built with Vue 3 Composition API and full TypeScript support</li>
        <li>✅ Fully Typed - Complete TypeScript definitions for all options and callbacks</li>
        <li>✅ Flexible - Support for all Cloudflare Turnstile options</li>
        <li>✅ Reactive - Automatic cleanup and lifecycle management</li>
        <li>✅ SSR Compatible - Safe for server-side rendering</li>
        <li>✅ Lightweight - Minimal bundle size with no unnecessary dependencies</li>
      </ul>
      <p>
        <strong>
          Full docs and usage instructions can be found on
          <a href="https://github.com/reinddooyeweerd/vue-cloudflare-turnstile">GitHub</a>
          .
        </strong>
      </p>
    </div>
    <div class="demo-widget">
      <h2>Example widget</h2>
      <div class="wrapper">
        <VueTurnstile
          ref="turnstileRef"
          :key="SITE_KEY"
          :site-key="SITE_KEY"
          :theme="theme"
          :size="size"
          :reset-key="resetKey"
          @success="handleSuccess"
          @error="handleError"
          @expired="handleExpired"
        />
      </div>
    </div>
    <div class="demo-result">
      <pre>{{ token }}</pre>
    </div>
    <div class="demo-controls">
      <div class="demo-control">
        <label for="sitekey-input">Site Key:</label>
        <div class="input">
          <select
            id="sitekey-input"
            v-model="SITE_KEY"
            class="input"
          >
            <option value="1x00000000000000000000AA">Always passes (visible)</option>
            <option value="2x00000000000000000000AB">Always blocks (visible)</option>
            <option value="1x00000000000000000000BB">Always passes (invisible)</option>
            <option value="2x00000000000000000000BB">Always blocks (invisible)</option>
            <option value="3x00000000000000000000FF">Force Challenge (visible)</option>
          </select>
        </div>
      </div>
      <div class="demo-control">
        <label for="theme-select">Theme:</label>
        <div class="input">
          <select
            id="theme-select"
            v-model="theme"
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <div class="demo-control">
        <label for="size-select">Size:</label>
        <div class="input">
          <select
            id="size-select"
            v-model="size"
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
            <option value="flexible">Flexible</option>
            <option value="invisible">Invisible</option>
          </select>
        </div>
      </div>
      <div class="demo-control">
        <div class="label">Reset:</div>
        <div class="input btn-group">
          <button @click="resetKey++">Reset (via resetKey)</button>
          <button @click="manualReset">Reset (via ref)</button>
        </div>
      </div>
      <div class="demo-control">
        <div class="label">Get Response:</div>
        <div class="input">
          <button @click="getResponse">Get Current Token</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use 'App.scss';
</style>
