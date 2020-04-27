import firebase from 'firebase';
import uuid from 'uuid';

const config = {
  apiKey: "AIzaSyAVcaalYnVJY6B4_MFc7W1Eeihb00xpjGA",
  authDomain: "simplechat-b5430.firebaseapp.com",
  databaseURL: "https://simplechat-b5430.firebaseio.com",
  projectId: "simplechat-b5430",
  storageBucket: "simplechat-b5430.appspot.com",
  messagingSenderId: "805397930958",
  appId: "1:805397930958:web:2f387a60f024cad061819f"
}

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }

  login = async(user, success_callback, failed_callback) => {
    console.log("logging in");
    const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  createAccount = async (user) => {
    var response = {success: false};
    await firebase.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async function() {
        console.log("created user successfully. User email:" + user.email + " name:" + user.name);
        var userf = firebase.auth().currentUser;
        await userf.updateProfile({ displayName: user.name})
        .then(async function() {
          console.log("Updated displayName successfully. name:" + user.name);
          await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(async function(signInResponse) {
            response = {success: true, user: signInResponse.user.providerData[0]}
          }, function() {
            console.log('login failed ***');
            alert('Your Account was created, but we unable to Login. Please do it manually.');
          });
        }, function(error) {
          console.warn("Error update displayName.");
        });
      }, function(error) {
        console.warn("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });

    return response;
  }

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const blob = this._urlToBlob(uri);
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const metadata = { contentType: 'image/jpeg' };

      return new Promise((resolve, reject) => {
        ref.put(blob, metadata).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            resolve(downloadURL);
          });
        });
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  _urlToBlob(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', url, true);
      xhr.send(null);
    });
  }

  updateAvatar = (url) => {
    console.log(url);
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ photoURL: url})
      .then(function() {
        console.log(firebase.auth().currentUser);
        console.log("Updated avatar successfully. url:" + url);
      }, function(error) {
        console.warn("Error update avatar.");
        alert("Error update avatar. Error:" + error.message);
      });
    } else {
      console.log("can't update avatar, user is not login.");
      alert("Unable to update avatar. You must login first.");
    }
  }

  onLogout = () => {
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
    }).catch(function(error) {
      console.log("An error happened when signing out");
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
