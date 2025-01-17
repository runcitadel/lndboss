import { RouteGuard } from '~client/standard_components';

// First page that gets rendered before every page.

type Props = {
  Component: React.ComponentType;
  pageProps: any;
  router: any;
};

const App = ({ Component, pageProps, router }: Props) => {
  return (
    <RouteGuard router={router}>
      <Component {...pageProps} />
    </RouteGuard>
  );
};

export default App;
