export const stripHTMLTags = (text: string) => {
  return text?.replace(/(<([^>]+)>)/gi, '');
};
