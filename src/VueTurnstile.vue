<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import type { TurnstileProps, TurnstileEmits, TurnstileRenderOptions, TurnstileAPI } from './types'

  const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'

  const props = withDefaults(defineProps<TurnstileProps>(), {
    theme: 'auto',
    size: 'normal',
    execution: 'render',
    language: 'auto',
    retry: 'auto',
    retryInterval: 8000,
    refreshExpired: 'auto',
    appearance: 'always',
    responseField: true,
    tabindex: 0
  })

  const emit = defineEmits<TurnstileEmits>()

  const turnstileRef = ref<HTMLElement | null>(null)
  const widgetId = ref<string | undefined>()
  const isScriptLoaded = ref(false)
  const isScriptLoading = ref(false)

  /**
   * Load the Turnstile script if not already loaded
   */
  const loadTurnstileScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.turnstile) {
        isScriptLoaded.value = true
        resolve()
        return
      }

      // Check if script is already in the DOM
      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID)
      if (existingScript) {
        if (isScriptLoading.value) {
          // Wait for the existing script to load
          existingScript.addEventListener('load', () => {
            isScriptLoaded.value = true
            isScriptLoading.value = false
            resolve()
          })
          existingScript.addEventListener('error', () => {
            isScriptLoading.value = false
            reject(new Error('Failed to load Turnstile script'))
          })
        }
        return
      }

      isScriptLoading.value = true

      // Create and append the script
      const script = document.createElement('script')
      script.id = TURNSTILE_SCRIPT_ID
      script.src = `${TURNSTILE_SCRIPT_URL}?render=explicit`
      script.async = true
      script.defer = true

      script.onload = () => {
        isScriptLoaded.value = true
        isScriptLoading.value = false
        resolve()
      }

      script.onerror = () => {
        isScriptLoading.value = false
        reject(new Error('Failed to load Turnstile script'))
      }

      document.head.appendChild(script)
    })
  }

  /**
   * Get the Turnstile API instance
   */
  const getTurnstileAPI = (): TurnstileAPI | undefined => {
    return window.turnstile
  }

  /**
   * Render the Turnstile widget
   */
  const renderWidget = () => {
    if (!turnstileRef.value || widgetId.value !== undefined) {
      return
    }

    const turnstile = getTurnstileAPI()
    if (!turnstile) {
      console.error('Turnstile API not loaded')
      return
    }

    const options: TurnstileRenderOptions = {
      sitekey: props.siteKey,
      theme: props.theme,
      size: props.size,
      tabindex: props.tabindex,
      execution: props.execution,
      language: props.language,
      'response-field': props.responseField,
      'response-field-name': props.responseFieldName,
      retry: props.retry,
      'retry-interval': props.retryInterval,
      'refresh-expired': props.refreshExpired,
      appearance: props.appearance,
      cData: props.cData,
      callback: (token: string) => {
        emit('success', token)
      },
      'error-callback': (errorCode) => {
        emit('error', errorCode)
      },
      'expired-callback': () => {
        emit('expired')
      },
      'before-interactive-callback': () => {
        emit('beforeInteractive')
      },
      'after-interactive-callback': () => {
        emit('afterInteractive')
      },
      'unsupported-callback': () => {
        emit('unsupported')
      },
      'timeout-callback': () => {
        emit('timeout')
      }
    }

    try {
      widgetId.value = turnstile.render(turnstileRef.value, options)
      console.log('[VueTurnstile] Widget rendered with ID:', widgetId.value)
      console.log('[VueTurnstile] Widget options:', {
        theme: props.theme,
        size: props.size
      })
    } catch (error) {
      console.error('[VueTurnstile] Failed to render widget:', error)
    }
  }

  /**
   * Reset the widget
   */
  const reset = () => {
    const turnstile = getTurnstileAPI()
    if (turnstile && widgetId.value !== undefined) {
      turnstile.reset(widgetId.value)
    }
  }

  /**
   * Remove the widget
   */
  const remove = () => {
    const turnstile = getTurnstileAPI()
    if (turnstile && widgetId.value !== undefined) {
      turnstile.remove(widgetId.value)
      widgetId.value = undefined
    }
  }

  /**
   * Get the response token
   */
  const getResponse = (): string | undefined => {
    const turnstile = getTurnstileAPI()
    if (turnstile && widgetId.value !== undefined) {
      return turnstile.getResponse(widgetId.value)
    }
    return undefined
  }

  /**
   * Check if the token has expired
   */
  const isExpired = (): boolean => {
    const turnstile = getTurnstileAPI()
    if (turnstile && widgetId.value !== undefined) {
      return turnstile.isExpired(widgetId.value)
    }
    return false
  }

  /**
   * Execute the widget (for execution mode 'execute')
   */
  const execute = async (): Promise<string | undefined> => {
    const turnstile = getTurnstileAPI()
    if (turnstile && turnstileRef.value && widgetId.value === undefined) {
      // Widget needs to be rendered first
      renderWidget()
    }

    if (turnstile && turnstileRef.value) {
      try {
        return await turnstile.execute(turnstileRef.value, {
          sitekey: props.siteKey
        })
      } catch (error) {
        console.error('Failed to execute Turnstile challenge:', error)
        return undefined
      }
    }
    return undefined
  }

  // Watch for resetKey changes to reset the widget
  watch(
    () => props.resetKey,
    (newVal, oldVal) => {
      if (newVal !== oldVal && widgetId.value !== undefined) {
        reset()
      }
    }
  )

  // Watch for prop changes that require re-rendering
  watch(
    () => [props.theme, props.size, props.language, props.appearance, props.execution],
    () => {
      if (widgetId.value !== undefined) {
        console.log('[VueTurnstile] Props changed, re-rendering widget')
        remove()
        renderWidget()
      }
    }
  )

  // Initialize the widget on mount
  onMounted(async () => {
    try {
      await loadTurnstileScript()
      renderWidget()
    } catch (error) {
      console.error('Failed to initialize Turnstile:', error)
    }
  })

  // Clean up on unmount
  onBeforeUnmount(() => {
    remove()
  })

  // Expose methods for parent components
  defineExpose({
    reset,
    remove,
    getResponse,
    isExpired,
    execute
  })
</script>

<template>
  <div
    ref="turnstileRef"
    class="vue-turnstile"
  />
</template>
