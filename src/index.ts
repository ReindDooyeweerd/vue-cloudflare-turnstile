import type { App, Plugin } from 'vue'
import VueTurnstile from './VueTurnstile.vue'

// Export types
export * from './types'

// Export component
export { VueTurnstile }

// Export default component
export default VueTurnstile

/**
 * Vue plugin for global registration
 */
export const VueTurnstilePlugin: Plugin = {
  install(app: App, options?: { componentName?: string }) {
    const componentName = options?.componentName || 'VueTurnstile'
    app.component(componentName, VueTurnstile)
  }
}

/**
 * Auto-install when used in browser with script tag
 */
declare global {
  interface Window {
    Vue?: App
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueTurnstilePlugin)
}
