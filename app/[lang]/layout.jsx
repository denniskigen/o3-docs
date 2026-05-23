import { Footer, LastUpdated, Layout, LocaleSwitch, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import NavLogo from '../../components/nav-logo'
import { getDictionary } from '../_dictionaries/get-dictionary'
import '../../styles.css'

export default async function LangLayout({ children, params }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const pageMap = await getPageMap(`/${lang}`)

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={
            <Navbar logo={<NavLogo />} projectLink="https://github.com/denniskigen/o3-docs">
              <LocaleSwitch lite />
              <a
                href="https://talk.openmrs.org"
                target="_blank"
                rel="noreferrer"
                className="nx-p-2"
              >
                Talk
              </a>
            </Navbar>
          }
          footer={<Footer>© {new Date().getFullYear()} OpenMRS</Footer>}
          docsRepositoryBase="https://github.com/denniskigen/o3-docs/blob/main"
          i18n={[
            { locale: 'en-US', name: 'English' },
            { locale: 'fr-FR', name: 'French' },
          ]}
          sidebar={{
            autoCollapse: true,
            defaultMenuCollapseLevel: 1,
          }}
          toc={{
            backToTop: dictionary.backToTop,
            float: true,
            title: dictionary.toc,
          }}
          editLink={dictionary.editPage}
          feedback={{ content: dictionary.feedback }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          search={<Search placeholder={dictionary.searchPlaceholder} />}
          nextThemes={{ defaultTheme: 'system' }}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system,
          }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
