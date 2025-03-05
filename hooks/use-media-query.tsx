import React from "react";

export default function useMediaQuery(mediaQuery: string) {
  const [matches, setMatches] = React.useState(false);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQueryList = window.matchMedia(mediaQuery);
    setMatches(mediaQueryList.matches);

    const listener = () => setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [mediaQuery]);

  return matches;
}
