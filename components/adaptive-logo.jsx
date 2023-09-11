import { useEffect, useState } from "react";
import { useTheme } from "nextra-theme-docs";
import Image from "next/image";

function AdaptiveLogo({ height = 180, width = 350 }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const darkLogo = "/logo-dark.svg";
  const lightLogo = "/logo-light.svg";

  useEffect(() => {
    setMounted(true);
  }, []);

  let logoSrc = "";

  switch (theme) {
    case "light":
      logoSrc = lightLogo;
      break;
    case "dark":
      logoSrc = darkLogo;
      break;
    case "system":
      logoSrc = resolvedTheme === "dark" ? darkLogo : lightLogo;
      break;
    default:
      logoSrc =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  }

  if (!mounted) {
    return null;
  }

  return (
    <Image
      className="mx-auto w-[350px] h-[180px]"
      src={logoSrc}
      alt="OpenMRS logo"
      loading="eager"
      height={height}
      width={width}
    />
  );
}

export default AdaptiveLogo;
