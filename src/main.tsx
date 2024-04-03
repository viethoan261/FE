import React from 'react';
import ReactDOM from 'react-dom/client';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications as NotificationsProvider } from '@mantine/notifications';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import customTheme from './theme';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import store from './redux/store';
import router from './routers/router';

import { AuthProvider } from './contexts/AuthContext';
import i18next from './locales/i18n';
dayjs.locale(i18next.language);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(duration);

// window.addEventListener('beforeunload', (ev) => {
//   // ev.preventDefault();
//   const url = API_URLS.Auth.logout();
//   api.post(url.endPoint, {}, { headers: url.headers });
//   localStorage.removeItem('token');
//   localStorage.removeItem('authUser');
//   return (ev.returnValue = 'Are you sure you want to close?');
// });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <ReduxProvider store={store}>
        <MantineProvider theme={customTheme} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <ModalsProvider>
              <DatesProvider settings={{ locale: 'vi', weekendDays: [0] }}>
                <NotificationsProvider />
                <RouterProvider router={router()} />
              </DatesProvider>
            </ModalsProvider>
          </AuthProvider>
        </MantineProvider>
      </ReduxProvider>
    </I18nextProvider>
  </React.StrictMode>
);
