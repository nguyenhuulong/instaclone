import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser } from '../../redux/user/userSelectors';

import SignUpCard from '../../components/SignUpCard/SignUpCard.js';

const SignUpPage = ({ currentUser }) => {
  const history = useNavigate();
  useEffect(() => {
    if (currentUser) history.push('/');
  }, [currentUser, history]);
  return (
    <main className="sign-up-page">
      <SignUpCard />
    </main>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(SignUpPage);
