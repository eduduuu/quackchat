//imports 
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


// firebase configs
firebase.initializeApp({
  apiKey: "AIzaSyC4NGCYIoG3_Jd_D3qdiQOGkXX6g0OhtyM",
  authDomain: "reactchat-c5d81.firebaseapp.com",
  projectId: "reactchat-c5d81",
  storageBucket: "reactchat-c5d81.appspot.com",
  messagingSenderId: "48829945994",
  appId: "1:48829945994:web:562e9bde7a0fc653c33573"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

// main app 
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <header>
          <h1>Quack Chat</h1>
          <SignOut />   
        </header>

        <section> 
          {user ? <ChatRoom /> : <SignIn />}
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
    <>
      <button className="signInBtn" onClick={signInWithGoogle}>Entre com a conta do google para acessar o chat.</button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="singOutBtn" onClick={() => auth.signOut()}>Deslogar</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return ( <>
    <main>
      {messages && messages.map(msg => <ChatMassage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Digite sua mensagem' />
      <button type="submit" disabled={!formValue}>ENVIAR</button>
    </form>
  </>)
}

function ChatMassage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid? 'send' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="avatar" className="avatar" />
      <p>{text}</p>
    </div>
  </>)
}

export default App
