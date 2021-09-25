import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import { useRouter } from 'next/router';

import PageChange from 'components/PageChange/PageChange.js';
import { UserContext } from '../context/UserContext';
import { isAuthenticated, logoutUser } from '../services/auth.service';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'draft-js/dist/Draft.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import 'assets/styles/bootstrap.min.css';
import 'assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css';
    
import 'assets/styles/smart_wizard.css';
import 'assets/styles/index.css';
import 'assets/styles/custom.css';
import 'assets/styles/header.css';
import '../node_modules/react-day-picker/lib/style.css';

import 'react-toastify/dist/ReactToastify.css';
import { getConfig } from '../services/config.service';
import Notiflix from 'notiflix';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // const Layout = Component.layout || (({ children }) => <>{children}</>);
  const [user, setUser] = useState(null);

  useEffect(() => {
    registerRouterEvents();
    fetchSize();
    checkAuth();
    fetchConfig();
  }, []);

  const registerRouterEvents = () => {
    router.events.on('routeChangeStart', (url) => {
      Notiflix.Loading.pulse('Loading...');
    });
    router.events.on('routeChangeComplete', () => {
      Notiflix.Loading.remove();
    });
    router.events.on('routeChangeError', () => {
      Notiflix.Loading.remove();
    });
  };

  const fetchSize = () => {
    
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    router.push('/');
  };

  const checkAuth = () => {
    const user = isAuthenticated();
    setUser(user);
    if (user) {
      return true;
    }
    return false;
  };

  const fetchConfig = async () => {
    try {
      const response = await getConfig();
      if(response.data && response.data.data)
        localStorage.setItem('config', JSON.stringify(response.data.data));
    } catch (e) {
      console.log(e);
    }
  };

  const providerValue = useMemo(() => ({ user, setUser, checkAuth, logout }), [
    user,
    setUser,
  ]);

  MyApp.getInitialProps = async ({ Component, router, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Askurdoctor</title>
      </Head>
      <UserContext.Provider value={providerValue}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
