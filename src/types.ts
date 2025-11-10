/**
 * Cloudflare Turnstile API Types
 * Based on official documentation: https://developers.cloudflare.com/turnstile/
 */

/**
 * Theme options for the Turnstile widget
 */
export type TurnstileTheme = 'light' | 'dark' | 'auto'

/**
 * Size options for the Turnstile widget
 * - normal: 300x65px (default)
 * - flexible: 100% width, 65px height
 * - compact: 150x140px
 * - invisible: No visible widget (runs in background)
 */
export type TurnstileSize = 'normal' | 'flexible' | 'compact' | 'invisible'

/**
 * Execution mode for the Turnstile widget
 */
export type TurnstileExecution = 'render' | 'execute'

/**
 * Language/locale options for the Turnstile widget
 */
export type TurnstileLanguage = 'auto' | string

/**
 * Error codes returned by Turnstile
 */
export type TurnstileErrorCode =
  | 'network-error'
  | 'timeout-or-duplicate'
  | 'invalid-domain'
  | 'internal-error'
  | 'challenge-error'

/**
 * Configuration options for the Turnstile widget
 */
export interface TurnstileRenderOptions {
  /**
   * Your Turnstile site key (required)
   */
  sitekey: string

  /**
   * Callback invoked upon successful completion of the challenge
   */
  callback?: (token: string) => void

  /**
   * Callback invoked when there is a network error
   */
  'error-callback'?: (errorCode?: TurnstileErrorCode) => void

  /**
   * Callback invoked when the challenge expires and needs to be rerun
   */
  'expired-callback'?: () => void

  /**
   * Callback invoked before the challenge is interactive
   */
  'before-interactive-callback'?: () => void

  /**
   * Callback invoked when challenge becomes interactive
   */
  'after-interactive-callback'?: () => void

  /**
   * Callback invoked when challenge is not supported by browser
   */
  'unsupported-callback'?: () => void

  /**
   * Callback invoked when the challenge times out
   */
  'timeout-callback'?: () => void

  /**
   * The widget theme
   */
  theme?: TurnstileTheme

  /**
   * The widget size
   */
  size?: TurnstileSize

  /**
   * The tabindex of the widget
   */
  tabindex?: number

  /**
   * Execution mode of the widget
   */
  execution?: TurnstileExecution

  /**
   * Language to display the widget in
   */
  language?: TurnstileLanguage

  /**
   * Custom response field name for forms
   */
  'response-field'?: boolean

  /**
   * Custom response field name
   */
  'response-field-name'?: string

  /**
   * Controls whether or not the widget should automatically retry
   */
  retry?: 'auto' | 'never'

  /**
   * Interval for auto-retry in milliseconds
   */
  'retry-interval'?: number

  /**
   * Automatically refreshes the token when it expires
   */
  'refresh-expired'?: 'auto' | 'manual' | 'never'

  /**
   * Appearance mode
   */
  appearance?: 'always' | 'execute' | 'interaction-only'

  /**
   * A customer value that can be used to differentiate widgets
   */
  cData?: string
}

/**
 * Turnstile widget instance
 */
export interface TurnstileWidget {
  /**
   * Remove the widget from the DOM
   */
  remove(): void

  /**
   * Get the current response token
   */
  getResponse(): string | undefined

  /**
   * Check if a token has been generated
   */
  isExpired(): boolean

  /**
   * Reset the widget
   */
  reset(): void
}

/**
 * Turnstile global API
 */
export interface TurnstileAPI {
  /**
   * Render a Turnstile widget
   */
  render(element: string | HTMLElement, options: TurnstileRenderOptions): string | undefined

  /**
   * Reset a widget
   */
  reset(widgetId: string): void

  /**
   * Remove a widget
   */
  remove(widgetId: string): void

  /**
   * Get the response token from a widget
   */
  getResponse(widgetId: string): string | undefined

  /**
   * Check if a widget's token has expired
   */
  isExpired(widgetId: string): boolean

  /**
   * Execute a widget (for execution mode 'execute')
   */
  execute(element?: string | HTMLElement, options?: TurnstileRenderOptions): Promise<string>
}

/**
 * Props for the Vue Turnstile component
 */
export interface TurnstileProps {
  /**
   * Your Turnstile site key (required)
   */
  siteKey: string

  /**
   * The widget theme
   */
  theme?: TurnstileTheme

  /**
   * The widget size
   */
  size?: TurnstileSize

  /**
   * The tabindex of the widget
   */
  tabindex?: number

  /**
   * Execution mode of the widget
   */
  execution?: TurnstileExecution

  /**
   * Language to display the widget in
   */
  language?: TurnstileLanguage

  /**
   * Custom response field name for forms
   */
  responseField?: boolean

  /**
   * Custom response field name
   */
  responseFieldName?: string

  /**
   * Controls whether or not the widget should automatically retry
   */
  retry?: 'auto' | 'never'

  /**
   * Interval for auto-retry in milliseconds
   */
  retryInterval?: number

  /**
   * Automatically refreshes the token when it expires
   */
  refreshExpired?: 'auto' | 'manual' | 'never'

  /**
   * Appearance mode
   */
  appearance?: 'always' | 'execute' | 'interaction-only'

  /**
   * A customer value that can be used to differentiate widgets
   */
  cData?: string

  /**
   * Reset the widget when this value changes
   */
  resetKey?: string | number
}

/**
 * Emits for the Vue Turnstile component
 */
export interface TurnstileEmits {
  /**
   * Emitted when the challenge is successfully completed
   */
  success: [token: string]

  /**
   * Emitted when there is an error
   */
  error: [errorCode?: TurnstileErrorCode]

  /**
   * Emitted when the token expires
   */
  expired: []

  /**
   * Emitted before the challenge is interactive
   */
  beforeInteractive: []

  /**
   * Emitted when the challenge becomes interactive
   */
  afterInteractive: []

  /**
   * Emitted when challenge is not supported
   */
  unsupported: []

  /**
   * Emitted when the challenge times out
   */
  timeout: []
}

/**
 * Global window interface extension
 */
declare global {
  interface Window {
    turnstile?: TurnstileAPI
    onloadTurnstileCallback?: () => void
  }
}
