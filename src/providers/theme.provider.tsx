import { dir } from 'i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { Theme } from '~/common/types';
import { ThemeContext } from '~/contexts';

type ThemeProviderProps = PropsWithChildren<{}>;

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { locale } = useRouter();

  const [isRtl, setIsRtl] = useState<Theme['isRtl']>(false);
  const [direction, setDirection] = useState<Theme['direction']>('ltr');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const themeState = useMemo<Theme>(() => {
    return {
      isRtl,
      setIsRtl,
      direction,
      setDirection,
      isDarkMode,
      toggleDarkMode: () => {
        setIsDarkMode((previous) => {
          return !previous;
        });
      },
    };
  }, [isRtl, direction, isDarkMode]);

  useEffect(() => {
    setIsRtl(dir(locale) === 'rtl');
    setDirection(dir(locale));
  }, [locale]);

  return (
    <ThemeContext.Provider
      value={themeState}
      {...props}
    />
  );
};
