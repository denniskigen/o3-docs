import 'server-only'

const dictionaries = {
  'en-US': () => import('./en-US'),
  'fr-FR': () => import('./fr-FR'),
}

export async function getDictionary(locale) {
  const { default: dictionary } = await (dictionaries[locale] ?? dictionaries['en-US'])()
  return dictionary
}
