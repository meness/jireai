import { getDocument, isPdfFile } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

export const extractPDFText = async (file: File): Promise<string> => {
  if (!isPdfFile(file.name)) {
    throw new Error('Use a PDF file.');
  }

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument(buffer).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, index) => {
      return pdf.getPage(index + 1);
    }),
  );
  const text = await Promise.all(
    pages.map((page) => {
      return page.getTextContent();
    }),
  );

  return text
    .map(({ items }) => {
      return (items as TextItem[])
        .map(({ hasEOL, str }) => {
          return `${str}${hasEOL ? '<br/>' : ''}`;
        })
        .join('');
    })
    .join('');
};
