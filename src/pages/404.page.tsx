import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

const NotFoundPage = () => {
  const [t] = useTranslation();

  return (
    <div className="px-[76px] pb-[185px] pt-[51px]">
      <NextSeo
        title={t('404:title')}
        noindex
      />
      404
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18next = await serverSideTranslations(locale as string, ['404', 'common']);

  return {
    props: {
      ...i18next,
    },
  };
};

export default NotFoundPage;
