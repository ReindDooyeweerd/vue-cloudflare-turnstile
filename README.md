# Vue Cloudflare Turnstile

A Vue 3 component wrapper for [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) - a user-friendly, privacy-preserving alternative to CAPTCHA.

## Features

- ✅ **Vue 3 & TypeScript** - Built with Vue 3 Composition API and full TypeScript support
- ✅ **Easy Integration** - Simple component-based API
- ✅ **Fully Typed** - Complete TypeScript definitions for all options and callbacks
- ✅ **Flexible** - Support for all Cloudflare Turnstile options
- ✅ **Reactive** - Automatic cleanup and lifecycle management
- ✅ **SSR Compatible** - Safe for server-side rendering
- ✅ **Lightweight** - Minimal bundle size with no unnecessary dependencies

## Installation

```bash
npm install vue-cloudflare-turnstile
```

```bash
yarn add vue-cloudflare-turnstile
```

```bash
pnpm add vue-cloudflare-turnstile
```

## Quick Start

### Basic Usage

```vue
<script setup lang="ts">
  import { VueTurnstile } from 'vue-cloudflare-turnstile'

  const handleSuccess = (token: string) => {
    console.log('Turnstile token:', token)
    // Send token to your server for verification
  }
</script>

<template>
  <VueTurnstile
    site-key="YOUR_SITE_KEY"
    @success="handleSuccess"
  />
</template>
```

### Global Registration

```ts
import { createApp } from 'vue'
import { VueTurnstilePlugin } from 'vue-cloudflare-turnstile'
import App from './App.vue'

const app = createApp(App)

// Register globally with default name 'VueTurnstile'
app.use(VueTurnstilePlugin)

// Or with a custom name
app.use(VueTurnstilePlugin, { componentName: 'Turnstile' })

app.mount('#app')
```

## API Reference

### Props

| Prop                | Type                                                 | Default      | Description                                                                 |
| ------------------- | ---------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `siteKey`           | `string`                                             | **required** | Your Cloudflare Turnstile site key                                          |
| `theme`             | `'light' \| 'dark' \| 'auto'`                        | `'auto'`     | Widget theme                                                                |
| `size`              | `'normal' \| 'compact' \| 'flexible' \| 'invisible'` | `'normal'`   | Widget size (invisible runs challenge in background with no visible widget) |
| `tabindex`          | `number`                                             | `0`          | Tab index for accessibility                                                 |
| `execution`         | `'render' \| 'execute'`                              | `'render'`   | When to execute the challenge                                               |
| `language`          | `string`                                             | `'auto'`     | Language code (e.g., 'en', 'es')                                            |
| `responseField`     | `boolean`                                            | `true`       | Add response field to forms                                                 |
| `responseFieldName` | `string`                                             | `undefined`  | Custom response field name                                                  |
| `retry`             | `'auto' \| 'never'`                                  | `'auto'`     | Automatic retry on failure                                                  |
| `retryInterval`     | `number`                                             | `8000`       | Retry interval in milliseconds                                              |
| `refreshExpired`    | `'auto' \| 'manual' \| 'never'`                      | `'auto'`     | Auto-refresh expired tokens                                                 |
| `appearance`        | `'always' \| 'execute' \| 'interaction-only'`        | `'always'`   | When to show the widget                                                     |
| `cData`             | `string`                                             | `undefined`  | Custom data to pass                                                         |
| `resetKey`          | `string \| number`                                   | `undefined`  | Change to trigger reset                                                     |

### Events

| Event                | Payload              | Description                                      |
| -------------------- | -------------------- | ------------------------------------------------ |
| `@success`           | `token: string`      | Emitted when challenge is completed successfully |
| `@error`             | `errorCode?: string` | Emitted when there is an error                   |
| `@expired`           | -                    | Emitted when the token expires                   |
| `@beforeInteractive` | -                    | Emitted before the challenge is interactive      |
| `@afterInteractive`  | -                    | Emitted when the challenge becomes interactive   |
| `@unsupported`       | -                    | Emitted when the browser is unsupported          |
| `@timeout`           | -                    | Emitted when the challenge times out             |

### Methods (via Template Ref)

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { VueTurnstile } from 'vue-cloudflare-turnstile'

  const turnstileRef = ref<InstanceType<typeof VueTurnstile> | null>(null)

  const reset = () => {
    turnstileRef.value?.reset()
  }

  const getToken = () => {
    const token = turnstileRef.value?.getResponse()
    console.log('Current token:', token)
  }
</script>

<template>
  <VueTurnstile
    ref="turnstileRef"
    site-key="YOUR_SITE_KEY"
  />
</template>
```

| Method          | Returns                        | Description                                       |
| --------------- | ------------------------------ | ------------------------------------------------- |
| `reset()`       | `void`                         | Reset the widget                                  |
| `remove()`      | `void`                         | Remove the widget from DOM                        |
| `getResponse()` | `string \| undefined`          | Get the current response token                    |
| `isExpired()`   | `boolean`                      | Check if token has expired                        |
| `execute()`     | `Promise<string \| undefined>` | Execute the widget (for execution mode 'execute') |

## Usage Examples

### With Form Validation

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import { VueTurnstile } from 'vue-cloudflare-turnstile'

  const email = ref('')
  const turnstileToken = ref('')
  const isSubmitting = ref(false)

  const handleTurnstileSuccess = (token: string) => {
    turnstileToken.value = token
  }

  const submitForm = async () => {
    if (!turnstileToken.value) {
      alert('Please complete the Turnstile challenge')
      return
    }

    isSubmitting.value = true

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          turnstileToken: turnstileToken.value
        })
      })

      if (response.ok) {
        alert('Form submitted successfully!')
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <form @submit.prevent="submitForm">
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />

    <VueTurnstile
      site-key="YOUR_SITE_KEY"
      @success="handleTurnstileSuccess"
    />

    <button
      type="submit"
      :disabled="!turnstileToken || isSubmitting"
    >
      Submit
    </button>
  </form>
</template>
```

## Getting Your Site Key

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile**
3. Create a new site or select an existing one
4. Copy your **Site Key** and **Secret Key**
5. Use the Site Key in your frontend component
6. Use the Secret Key for server-side verification

### Test Keys (for development)

Cloudflare provides test keys for development:

- **Visible (always passes)**: `1x00000000000000000000AA`
- **Invisible (always passes)**: `2x00000000000000000000AB`
- **Force challenge**: `3x00000000000000000000FF`

## Server-Side Verification

**IMPORTANT**: Always verify the Turnstile token on your server. Never trust client-side validation alone.

## TypeScript Support

This package includes full TypeScript definitions. Import types as needed:

```typescript
import type {
  TurnstileTheme,
  TurnstileSize,
  TurnstileErrorCode,
  TurnstileProps,
  TurnstileEmits
} from 'vue-cloudflare-turnstile'
```

## Security Best Practices

1. **Always validate server-side** - Never rely solely on client-side validation
2. **Use HTTPS** - Turnstile requires secure connections
3. **Keep secrets secure** - Never expose your Secret Key in client code
4. **Handle errors gracefully** - Implement proper error handling for network issues
5. **Set appropriate domains** - Configure allowed domains in Cloudflare Dashboard
6. **Monitor usage** - Track Turnstile usage in your Cloudflare Dashboard

## Browser Support

Turnstile works in all modern browsers that support:

- ES6+
- WebAssembly
- JavaScript enabled

## Troubleshooting

### Widget not appearing

1. Check that you're using a valid site key
2. Ensure you're accessing the page via `http://` or `https://` (not `file://`)
3. Check browser console for errors
4. Verify your domain is whitelisted in Cloudflare Dashboard

### Token validation failing

1. Verify you're using the correct Secret Key on the server
2. Ensure tokens haven't expired (300 second lifetime)
3. Check that tokens aren't being reused (each token can only be validated once)
4. Review error codes in the verification response

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Links

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Report Issues](https://github.com/yourusername/vue-cloudflare-turnstile/issues)

## Credits

Built with Vue 3, TypeScript, and Vite. Powered by Cloudflare Turnstile.
