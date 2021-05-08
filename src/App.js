import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// import bgimg from './images/chatbg.jpg';

firebase.initializeApp({
  apiKey: "AIzaSyCtKO1eKCQ7kCayJphUe9raznLjUdURLCo",
  authDomain: "chatapp-07.firebaseapp.com",
  projectId: "chatapp-07",
  storageBucket: "chatapp-07.appspot.com",
  messagingSenderId: "809417763271",
  appId: "1:809417763271:web:0d2adc74d14057db3ad1e2"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        { user ? <ChatRoom /> : <SignIn /> }
        {/* <img src={"./images/chatbg.png"} alt="chat-background" /> */}
        {/* <img className="chatimg" src={bgimg} alt="img" />  */}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={ signInWithGoogle }> Sign in with Google </button>

  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}> Sign Out </button>
  )
}

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = firestore.collection('messages');//ref to firestore collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'}); //listen to data with a hook, reacts to changes in realtime

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }
   
  return(
    <>
      <main>
        { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </main>

      <div ref={dummy}>
      
      </div>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit"> 🕊️ </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='photourl'/>
      <p>{ text }</p>
    </div>
  )
}

export default App;
