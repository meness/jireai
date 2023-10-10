import { Dispatch, SetStateAction } from 'react';

export type Theme = {
  isRtl: boolean;
  setIsRtl: Dispatch<SetStateAction<Theme['isRtl']>>;
  direction: 'rtl' | 'ltr';
  setDirection: (direction: Theme['direction']) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};
