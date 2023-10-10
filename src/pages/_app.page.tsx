import 'reflect-metadata';

import { Analytics } from '@vercel/analytics/react';
import { NextPage } from 'next';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { ReactElement, useEffect } from 'react';
import '~/assets/styles/theme.css';
import { appConfig } from '~/config';
import '~/config/pdf.config';
import { sendGtmPageViewEvent } from '~/helpers';
import { ThemeProvider } from '~/providers';

const AppPage = ({ Component, pageProps, locale }: AppPropsWithLayout) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      sendGtmPageViewEvent(url, locale);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  const { t } = useTranslation();

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return page;
    });

  return (
    <>
      <NextSeo
        title={t('common:default_title')}
        titleTemplate={t('common:title_template')}
        description={t('common:default_description')}
        openGraph={{
          title: t('common:default_title'),
          description: t('common:default_description'),
          images: [
            {
              url: 'https://example.com/image.png',
              alt: t('common:default_title'),
              type: 'image/png',
              width: 852,
              height: 410,
            },
          ],
        }}
        twitter={{ cardType: 'summary_large_image' }}
      />
      <Head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
        />
      </Head>
      {appConfig.env.onProduction && (
        <Script
          strategy="afterInteractive"
          id="g-tag-script">
          {`!function(e,t,a,n,g){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var m=t.getElementsByTagName(a)[0],r=t.createElement(a);r.async=!0,r.src="https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_G_TAG_ID}",m.parentNode.insertBefore(r,m)}(window,document,"script","dataLayer");`}
        </Script>
      )}

      <main className="grid min-h-screen grid-cols-[100%] grid-rows-[auto_1fr_auto]">
        {getLayout(<Component {...pageProps} />)}
      </main>

      <Analytics debug={false} />
    </>
  );
};

const AppPageWrapper = ({ locale, ...props }: AppPropsWithLayout) => {
  return (
    <ThemeProvider>
      <AppPage
        {...props}
        locale={locale}
      />
    </ThemeProvider>
  );
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  locale?: string;
};

export default appWithTranslation(AppPageWrapper);
