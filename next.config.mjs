import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
})

export default withNextra({
  i18n: {
    locales: ['en-US', 'fr-FR'],
    localeDetection: true,
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/docs', destination: '/docs/introduction', permanent: false },
      { source: '/en-US/docs', destination: '/en-US/docs/introduction', permanent: false },
      { source: '/fr-FR/docs', destination: '/fr-FR/docs/introduction', permanent: false },
      { source: '/docs/coding-conventions', destination: '/docs/coding-conventions/introduction', permanent: false },
      { source: '/docs/configure-o3', destination: '/docs/configure-o3/overview', permanent: false },
      { source: '/docs/forms-in-o3', destination: '/docs/forms-in-o3/build-forms-with-o3-form-builder', permanent: false },
      { source: '/docs/frontend-modules', destination: '/docs/frontend-modules/overview', permanent: false },
      { source: '/docs/recipes/index', destination: '/docs/recipes', permanent: true },
      { source: '/docs/workspaces/index', destination: '/docs/workspaces', permanent: true },
      { source: '/docs/frontend-modules/using-webpack', destination: '/docs/frontend-modules/using-rspack', permanent: true },
      { source: '/docs/launching-workspaces', destination: '/docs/workspaces/launching-workspaces', permanent: true },
      { source: '/docs/creating-workspaces', destination: '/docs/workspaces/creating-workspaces', permanent: true },
      { source: '/docs/siderail-and-bottom-nav', destination: '/docs/workspaces/siderail-and-bottom-nav', permanent: true },
      { source: '/docs/workspace-implementation', destination: '/docs/workspaces/workspace-implementation', permanent: true },
      { source: '/en-US/docs/frontend-modules/using-webpack', destination: '/en-US/docs/frontend-modules/using-rspack', permanent: true },
      { source: '/fr-FR/docs/frontend-modules/using-webpack', destination: '/fr-FR/docs/frontend-modules/using-rspack', permanent: true },
      { source: '/en-US/docs/recipes/index', destination: '/en-US/docs/recipes', permanent: true },
      { source: '/fr-FR/docs/recipes/index', destination: '/fr-FR/docs/recipes', permanent: true },
      { source: '/en-US/docs/workspaces/index', destination: '/en-US/docs/workspaces', permanent: true },
      { source: '/fr-FR/docs/workspaces/index', destination: '/fr-FR/docs/workspaces', permanent: true },
      { source: '/en-US/docs/launching-workspaces', destination: '/en-US/docs/workspaces/launching-workspaces', permanent: true },
      { source: '/fr-FR/docs/launching-workspaces', destination: '/fr-FR/docs/workspaces/launching-workspaces', permanent: true },
      { source: '/en-US/docs/creating-workspaces', destination: '/en-US/docs/workspaces/creating-workspaces', permanent: true },
      { source: '/fr-FR/docs/creating-workspaces', destination: '/fr-FR/docs/workspaces/creating-workspaces', permanent: true },
      { source: '/en-US/docs/siderail-and-bottom-nav', destination: '/en-US/docs/workspaces/siderail-and-bottom-nav', permanent: true },
      { source: '/fr-FR/docs/siderail-and-bottom-nav', destination: '/fr-FR/docs/workspaces/siderail-and-bottom-nav', permanent: true },
      { source: '/en-US/docs/workspace-implementation', destination: '/en-US/docs/workspaces/workspace-implementation', permanent: true },
      { source: '/fr-FR/docs/workspace-implementation', destination: '/fr-FR/docs/workspaces/workspace-implementation', permanent: true },
    ]
  },
})
