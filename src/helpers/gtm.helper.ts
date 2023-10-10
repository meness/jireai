// Google Tag Manager helpers

export const sendGtmPageViewEvent = (url: string, locale?: string) => {
  window.dataLayer?.push({
    event: 'page_view',
    page_location: url,
    language: locale,
  });
};

export const sendGtmUserIdEvent = (userId: string | null) => {
  window.dataLayer?.push({
    user_id: userId,
    crm_id: userId,
  });
};
