import { dir as i18nextDir } from 'i18next';
import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';

type DocumentPageProps = DocumentProps & { dir: string };

const DocumentPage = ({ dir, locale }: DocumentPageProps) => {
  return (
    <Html
      dir={dir}
      lang={locale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

DocumentPage.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);

  return { ...initialProps, dir: i18nextDir(ctx.locale) };
};

export default DocumentPage;
