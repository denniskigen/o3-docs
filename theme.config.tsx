import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import {
  editTextMap,
  feedbackLinkMap,
  gitTimestampMap,
  searchPlaceholderMap,
  tableOfContentsTitleMap,
} from "./translations/text";
import useLocalesMap from "./components/use-locales-map";
import Head from "./components/head";
import NavLogo from "./components/nav-logo";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  logo: <NavLogo />,
  head: <Head />,
  useNextSeoProps() {
    return {
      titleTemplate: "%s – O3 Docs",
    };
  },
  project: {
    link: "https://github.com/denniskigen/o3-docs",
  },
  docsRepositoryBase: "https://github.com/denniskigen/o3-docs/blob/main",
  footer: {
    text: `© ${new Date().getFullYear()} OpenMRS`,
  },
  nextThemes: {
    defaultTheme: "system",
  },
  i18n: [
    { locale: "en-US", text: "English" },
    { locale: "fr-FR", text: "French" },
  ],
  editLink: {
    text: () => useLocalesMap(editTextMap),
  },
  feedback: {
    content: () => useLocalesMap(feedbackLinkMap),
  },
  search: {
    placeholder: () => useLocalesMap(searchPlaceholderMap),
  },
  toc: {
    float: true,
    title: () => useLocalesMap(tableOfContentsTitleMap),
  },
  gitTimestamp({ timestamp }) {
    const { locale } = useRouter();
    const lastUpdatedOn = useLocalesMap(gitTimestampMap);

    return (
      <>
        {lastUpdatedOn}{" "}
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </>
    );
  },
};

export default config;
