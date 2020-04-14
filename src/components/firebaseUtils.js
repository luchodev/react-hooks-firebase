import firebase, { firestore } from "firebase";

const handleAuth = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => console.log(`${result.user.email} has logged In`))
    .catch((error) => console.log(`Error: ${error.code}: ${error.message}`));
};

const handleLogout = () => {
  console.log(`hola mundo`);
};

const uploadPicture = (file) => {
  const storageRef = firebase.storage().ref(`/pictures/${file.name}`);

  const result = new Promise((resolve, reject) => {
    storageRef
      .put(file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadUrl) => {
          resolve(downloadUrl);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });

  return result;
};

const createPicture = (picture) => {
  const result = new Promise((resolve, reject) => {
    firestore()
      .collection("pictures")
      .add(picture)
      .then(
        () => {
          resolve(picture);
        },
        (error) => reject(error)
      );
  });

  return result;
};

export { handleAuth, handleLogout, uploadPicture, createPicture };
