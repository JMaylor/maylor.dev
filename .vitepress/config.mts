import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Joe Maylor",
  description: "Developer, lover of TypeScript, Vue, and all things web.",
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
