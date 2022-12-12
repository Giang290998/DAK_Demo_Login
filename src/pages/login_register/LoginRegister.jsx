// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './login_register.scss';

// Configure Firebase.
const config = {
  // apiKey: 'AIzaSyAip4hecOJfi2iYN-iMBzWaCi9965XgBXg',
  // authDomain: 'stech-login.firebaseapp.com',
  apiKey: 'AIzaSyAVlOYUZwSdx7WGcNdi37Z6DFlQ_dSAbmM',
  authDomain: 'gsocial-354613.firebaseapp.com',
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
  const [name, setName] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [accountType, setAccountType] = useState(null)

    console.log('Is Login:::', isSignedIn)

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            setIsSignedIn(!!user);
            setToken(await user.getIdToken())
            setUid(user.uid)
            setName(user.displayName)
            setAvatar(user.photoURL)
            console.log('user: ', user)
        }
    });
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
      <h1>Name:</h1>
      <h3 className="uid">{name}</h3>
      <h1>Avatar:</h1>
      <h3 className="uid">{avatar}</h3>
      <a href="/" onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
}

export default SignInScreen;
