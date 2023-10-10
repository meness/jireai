/** @see https://developers.google.com/tag-platform/gtagjs/reference/events#page_view */
export interface PageViewEvent {
  event: 'page_view';
  page_location: string;
  language?: string;
}

export interface UserEvent {
  user_id: string | null;
  crm_id: string | null;
}

/** @see https://developers.google.com/tag-platform/gtagjs/reference/events#login */
export interface LoginEvent {
  event: 'login';
  method: string;
}

/** @see https://developers.google.com/tag-platform/gtagjs/reference/events#share */
export interface ShareEvent {
  event: 'share';
  method: string;
  content_type: string;
  item_id: string;
}

/** @see https://developers.google.com/tag-platform/gtagjs/reference/events#sign_up */
export interface SignUpEvent {
  event: 'sign_up';
  method: string;
}

export type DataLayerObject = PageViewEvent | UserEvent | LoginEvent | ShareEvent | SignUpEvent;
