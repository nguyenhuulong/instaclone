import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Navigate } from 'react-router-dom';

import { selectToken } from '../../redux/user/userSelectors';

const ProtectedRoute = ({ token, children, ...props }) => {
  return (
    <Route {...props}>{token ? children : <Navigate to="/login" />}</Route>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

export default connect(mapStateToProps)(ProtectedRoute);
