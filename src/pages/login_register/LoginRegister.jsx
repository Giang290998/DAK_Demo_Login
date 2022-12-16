// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { CircularProgress } from 'react-cssfx-loading/lib';
import axios from 'axios';
import 'firebase/compat/auth';
import './login_register.scss';

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyAip4hecOJfi2iYN-iMBzWaCi9965XgBXg',
  authDomain: 'stech-login.firebaseapp.com',
  // apiKey: 'AIzaSyAVlOYUZwSdx7WGcNdi37Z6DFlQ_dSAbmM',
  // authDomain: 'gsocial-354613.firebaseapp.com',
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [token, setToken] = useState(null)
  const [uid, setUid] = useState(null)
  const [payload, setPayload] = useState(null)
  const [loginCode, setLoginCode] = useState(null)
  const [error, setError] = useState(null)
  const [tokenResServer, setTokenResServer] = useState(null)
  const [user, setUser] = useState(null)

    console.log('Is Login:::', isSignedIn)

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
            setIsSignedIn(!!user);
            setToken(await user.getIdToken())
            setUid(user.uid)
            console.log('user: ', user)
            console.log('email: ', user.mail)
            const providerData = user.providerData[0].providerId
            const account_type = getAccountType(providerData)
            const payload = {
              name: user.displayName,
              avatar: user.photoURL,
              username: user.email || user.uid,
              identity: user.uid,
              account_type,
              email: user.email
            }
            setPayload(JSON.stringify(payload))
            axios.post(
              'http://115.78.232.196:88/api/auth/login-social', 
              payload, 
              { headers: {'authorization': `Bearer ${await user.getIdToken()}`}}
            )
            .then(res => {
              console.log(res.data)
              if (res.data) {
                setLoginCode(res.data.code)
                if (res.data.code >= 400) {
                  setError(res.data.message)
                }
                if (res.data.code < 205) {
                  setTokenResServer(res.data.data.token)
                  setUser(JSON.stringify(res.data.data.user))
                }
              }
            })
        }
    );
    function getAccountType(type) {
      if (type.includes('google')) {
        return 3
      }
      if (type.includes('facebook')) {
        return 2
      }
      return null
    }
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div className='login'>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <h1>Token:</h1>
      <h3 className="token">{token}</h3>
      <h1>Uid:</h1>
      <h3 className="uid">{uid}</h3>
      <h1>Payload:</h1>
      <h3 className="uid">{payload}</h3>
      {
        (loginCode && loginCode < 205) 
        &&
        <div className="btn success">
          <h3 className="success-status">Login Success</h3>
          <h3 className="success-status">TOKEN: </h3>
          <h3 className="success-status">{tokenResServer}</h3>
          <h3 className="success-status">USER: </h3>
          <h3 className="success-status">{user}</h3>
        </div> 
      }
      {
        loginCode >= 400 
        &&
        <div className="btn pending">
          <h3 className="pending-status">Login failed!</h3>
          <h3 className="pending-status">{error}</h3>
        </div> 
      }
      {
        !loginCode
        &&
        <div className="btn pending">
          <h3 className="pending-status">Login</h3>
          <CircularProgress color='#fff'/>
        </div>
      }
      <a href="/" className='btn' onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
}

export default SignInScreen;
