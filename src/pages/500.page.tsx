import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

const InternalServerErrorPage = () => {
  const [t] = useTranslation();

  return (
    <div>
      <NextSeo
        title={t('500:title')}
        noindex
      />
      500
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18next = await serverSideTranslations(locale as string, ['500', 'common']);

  return {
    props: {
      ...i18next,
    },
  };
};

export default InternalServerErrorPage;
