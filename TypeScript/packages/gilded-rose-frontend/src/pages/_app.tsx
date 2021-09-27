import { DefaultRootState, Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { useStore } from '../store';
import { CssBaseline } from '@mui/material';
import createEmotionCache from '../lib/createEmotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const store = useStore(pageProps.initialReduxState as DefaultRootState);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <CssBaseline />
        <Component {...pageProps} />
      </CacheProvider>
    </Provider>
  );
}
export default MyApp;
