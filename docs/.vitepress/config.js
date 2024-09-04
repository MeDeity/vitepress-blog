const baseUrl = "/vitepress-blog/"

export default {
    baseUrl,
    title: "MeDeity", 
    description: "技术记录",
    lastUpdated: true,
    head: [
      ["link", { rel: "icon", href: `/favicon.ico` }],
    ],
    themeConfig: {
      search: {
        provider: 'local'
      },
      nav: [
        { text: '关于', link: '/about' }
      ],
      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/MeDeity'
        }
      ]
    },
  };