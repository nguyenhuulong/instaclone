import React, { useEffect, Fragment, Suspense, lazy } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTransition } from 'react-spring';

import { selectCurrentUser } from '../../redux/user/userSelectors';
import { signInStart } from '../../redux/user/userActions';
import { connectSocket } from '../../redux/socket/socketActions';
import { fetchNotificationsStart } from '../../redux/notification/notificationActions';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import LoadingPage from '../../pages/LoadingPage/LoadingPage';

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage'));
const SignUpPage = lazy(() => import('../../pages/SignUpPage/SignUpPage'));
const HomePage = lazy(() => import('../../pages/HomePage/HomePage'));

export function UnconnectedApp({
  signInStart,
  alert,
  currentUser,
  connectSocket,
  fetchNotificationsStart,
}) {
  const token = localStorage.getItem('token');
  const {
    location: { pathname },
  } = useHistory();

  useEffect(() => {
    if (token) {
      signInStart(null, null, token);
      connectSocket();
      fetchNotificationsStart(token);
    }
  }, [signInStart, connectSocket, fetchNotificationsStart, token]);

  const transitions = useTransition(alert.showAlert, null, {
    from: {
      transform: 'translateY(4rem)',
    },
    enter: {
      transform: 'translateY(0rem)',
    },
    leave: {
      transform: 'translateY(4rem)',
    },
    config: {
      tension: 500,
      friction: 50,
    },
  });

  const renderApp = () => {
    // Wait for authentication
    if (!currentUser && token) {
      return <LoadingPage />;
    }
    return (
      <Fragment>
        {pathname !== '/login' && pathname !== '/signup' && <Header />}
        {transitions.map(
          ({ item, props, key }) =>
            item && (
              <Alert key={key} style={props} onClick={alert.onClick}>
                {alert.text}
              </Alert>
            )
        )}
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <ProtectedRoute exact path="/" component={HomePage} />
        </Switch>
        {pathname !== '/' && <Footer />}
        {pathname !== '/login' &&
          pathname !== '/signup' &&
          pathname !== '/new' &&
          currentUser}
      </Fragment>
    );
  };

  return (
    <div className="app" data-test="component-app">
      <Suspense fallback={<LoadingPage />}>{renderApp()}</Suspense>
    </div>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modal,
  alert: state.alert,
  currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  signInStart: (usernameOrEmail, password, token) =>
    dispatch(signInStart(usernameOrEmail, password, token)),
  connectSocket: () => dispatch(connectSocket()),
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
