import '../styles/globals.css';
import { DefaultRootState, Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { useStore } from '../store';

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState as DefaultRootState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
