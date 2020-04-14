import React, { useState, useEffect } from "react";
import firebase, { firestore } from "firebase";

import "./App.css";
import RenderPicture from "./components/renderPicture";
import {
  handleAuth,
  handleLogout,
  uploadPicture,
  createPicture,
} from "./components/firebaseUtils";
import UploadFile from "./components/uploadFile";

function App() {
  const [user, setUser] = useState(null);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    firestore()
      .collection("pictures")
      .get()
      .then((snapshot) => {
        const picturesTemp = [];
        snapshot.docs.forEach((doc) => {
          picturesTemp.push(doc.data());
        });
        setPictures(picturesTemp);
      });
  }, []);

  const handleUploadPicture = (event) => {
    const file = event.target.files[0];
    uploadPicture(file).then((downloadURL) => {
      let record = {
        photoURL: user.providerData[0].photoURL,
        displayName: user.displayName,
        image: downloadURL,
      };
      createPicture(record)
        .then(() => {
          console.log(`Picture created successfully`);
          setPictures(pictures.concat(record));
        })
        .catch((error) => console.log(`Error creating the pictrue. ${error}`));
    });
  };

  const renderLoginButton = () => {
    if (user) {
      return (
        <>
          <UploadFile handleUpload={handleUploadPicture} />
          {pictures
            .map((pic, index) => <RenderPicture key={index} picture={pic} />)
            .reverse()}
        </>
      );
    } else {
      return <button onClick={handleAuth}>Sign in with Google</button>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Pseudogram</p>
      </header>
      <div className="content">{renderLoginButton()}</div>
    </div>
  );
}

export default App;
