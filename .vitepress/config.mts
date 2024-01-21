import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Joe Maylor',
  description: 'Developer, lover of TypeScript, Vue, and all things web.',
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
  },
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blogs', link: '/blogs/index' },
      { text: 'Projects', link: '/projects/index' },
    ],

    sidebar: {
      '/blogs': [
        {
          text: 'Blogs',
          items: [
            { text: 'Vue 3.3 Generics', link: '/blogs/vue-type-generics' },
          ],
        },
      ],
      '/projects': [
        {
          text: 'Projects',
          items: [
            { text: 'Football', link: '/projects/football' },
            { text: 'Landscape', link: '/projects/landscape' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/JMaylor' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/joe-maylor/' },
    ],
  },
})
