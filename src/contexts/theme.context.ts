import { createContext } from 'react';
import { Theme } from '~/common/types';

export const ThemeContext = createContext<Theme>({} as Theme);
