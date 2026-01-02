import { Callout } from "nextra-theme-docs";

const messages = {
  "en-US": "This site is no longer the source of truth for O3 developer docs. The maintained docs now live on the OpenMRS Wiki:",
  "fr-FR": "Ce site n’est plus la source de vérité maintenue pour la documentation des développeurs O3. Les docs maintenues se trouvent maintenant sur le Wiki OpenMRS :",
};

export default function DeprecationWarning({ href, locale = "en-US" }) {
  const message = messages[locale] || messages["en-US"];

  return (
    <Callout emoji="⚠️" type="warning">
      {message} <a href={href}>{href}</a>
    </Callout>
  );
}
