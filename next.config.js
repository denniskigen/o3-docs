const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  flexsearch: {
    codeblocks: true,
  },
  defaultShowCopyCode: true,
});

module.exports = withNextra({
  i18n: {
    locales: ["en-US", "fr-FR"],
    localeDetection: true,
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/docs/recipes",
        destination: "/docs/recipes/index",
        permanent: false,
      },
      {
        source: "/docs/coding-conventions",
        destination: "/docs/coding-conventions/introduction",
        permanent: false,
      },
      {
        source: "/docs/configure-o3",
        destination: "/docs/configure-o3/overview",
        permanent: false,
      },
      {
        source: "/docs/forms-in-o3",
        destination: "/docs/forms-in-o3/build-forms-with-o3-form-builder",
        permanent: false,
      },
      {
        source: "/docs/frontend-modules",
        destination: "/docs/frontend-modules/overview",
        permanent: false,
      },
      {
        source: "/docs/workspaces",
        destination: "/docs/workspaces/index",
        permanent: false,
      },
    ];
  },
});
