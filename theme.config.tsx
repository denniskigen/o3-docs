import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>O3 Frontend Docs</span>,
  useNextSeoProps() {
    return {
      titleTemplate: "%s – O3 Docs",
    };
  },
  project: {
    link: "https://github.com/denniskigen/o3-docs",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/denniskigen/o3-docs/blob/main",
  footer: {
    text: "MIT 2023 © OpenMRS",
  },
  nextThemes: {
    defaultTheme: "light",
  },
};

export default config;
