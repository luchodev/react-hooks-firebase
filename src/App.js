import React, { useState, useEffect } from "react";
import firebase, { firestore } from "firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    firebase
      .firestore()
      .collection("pictures")
      .get()
      .then((snapshot) => {
        const picturesTemp = [];
        snapshot.docs.forEach((doc) => {
          picturesTemp.push(doc.data());
        });
        setPictures(picturesTemp);
      });

    // const unsubscribe = firebase
    //   .firestore()
    //   .collection("pictures")
    //   .onSnapshot((snapshot) => {
    //     let changes = snapshot.docChanges();
    //     const picturesTemp = [];
    //     changes.forEach((change) => {
    //       console.log(change);
    //       if (change.type == "added") {
    //         picturesTemp.push(change.doc.data());
    //       }
    //     });
    //     if (picturesTemp.length > 0) {
    //       setPictures(pictures.concat(picturesTemp));
    //     }
    //   });
    // return () => unsubscribe();
    //callback();
  }, []);

  const handleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => console.log(`${result.user.email} has logged In`))
      .catch((error) => console.log(`Error: ${error.code}: ${error.message}`));
  };

  const RenderPicture = ({ picture }) => {
    return (
      <>
        <img
          className="profileImage"
          src={picture.photoURL}
          alt={picture.displayName}
        />
        <span>{picture.displayName}</span>
        <img className="image" src={picture.image} alt={picture.displayName} />
      </>
    );
  };

  const UploadFile = ({ handleUpload }) => {
    return (
      <input type="file" className="inputFile" onChange={handleUpload}></input>
    );
  };

  const handleUploadPicture = (event) => {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/pictures/${file.name}`);

    const task = storageRef.put(file);
    task.on(
      "state_changed",
      (snapshot) => {},
      (error) => console.log(`Error when uploading picture: ${error}`),
      () => {
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          let record = {
            photoURL: user.providerData[0].photoURL,
            displayName: user.displayName,
            image: downloadURL,
          };

          firebase
            .firestore()
            .collection("pictures")
            .add(record)
            .then(
              () => {
                console.log(`Picture uploaded successfully`);
                setPictures(pictures.concat(record));
              },
              (err) => console.log(`error ocurrio ${err}`)
            );
        });
      }
    );
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
