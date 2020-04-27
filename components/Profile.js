import React, {Component} from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { Asset } from 'expo-asset';
import { Constants, ImageStore, FileSystem } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import firebase from 'firebase';
import firebaseSvc from '../FirebaseSvc';
import uuid from 'uuid';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  onImageUpload = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    try {
      // only if user allows permission to camera roll
      if (cameraRollPerm === 'granted') {
        console.log('choosing image granted...');
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          base64: true
        });
        console.log(
          'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
        );

        var wantedMaxSize = 150;
        var rawheight = pickerResult.height;
        var rawwidth = pickerResult.width;

        var ratio = rawwidth / rawheight;
        var wantedwidth = wantedMaxSize;
        var wantedheight = wantedMaxSize/ratio;
        // check vertical or horizontal
        if(rawheight > rawwidth){
            wantedwidth = wantedMaxSize*ratio;
            wantedheight = wantedMaxSize;
        }
        console.log("scale image to x:" + wantedwidth + " y:" + wantedheight);
        console.log(pickerResult.uri);
        let resizedUri = await ImageManipulator.manipulateAsync(
          pickerResult.uri,
          [
            {
              crop: {
                originX: 0,
                originY: 0,
                width: pickerResult.width,
                height: pickerResult.height
              }
            }
          ]
        );

        this.setState({loading: true});

        const ref = await firebase
          .storage()
          .ref('avatar')
          .child(uuid.v4())

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', resizedUri.uri, true);
          xhr.send(null);ActivityIndicator
        });

        const metadata = {
          contentType: 'image/jpeg',
        };

        var downloadURL = await (downloadURL = await new Promise((resolve, reject) => {
          try {
            ref.put(blob, metadata).then(snapshot => {
              snapshot.ref.getDownloadURL().then(downloadURL => {
                resolve(downloadURL);
              });
            });
          } catch (err) {
            reject(err);
          }
        }));

        await firebaseSvc.updateAvatar(downloadURL);

        this.props.screenProps.changeLoginState(
          {
            name: this.props.screenProps.user.displayName,
            email: this.props.screenProps.user.email,
            avatar: downloadURL
          },
          true,
        );
        this.setState({loading: false});
      }
    } catch (err) {
      console.log('onImageUpload error:' + err.message);
      alert('Upload image error:' + err.message);
      this.setState({loading: false});
    }
  };

  render() {
    const {navigation} = this.props;
    const {email, name, avatar} = this.props.screenProps.user;
    const {loading} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.avatarContainer}>
            {loading ? (
              <View style={styles.activity}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <View>
                {avatar === '' ? (
                  <Image
                    style={styles.avatar}
                    source={require('../assets/BlankImage.jpg')}
                  />
                ) : (
                  <Image
                    style={styles.avatar}
                    source={{uri: avatar}}
                  />
                )}
              </View>
            )}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View style={styles.button}>
            <Button
              title="Update Avatar Image"
              onPress={this.onImageUpload}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  activity: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: offset,
    paddingHorizontal: offset,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  name: {
    fontSize: 22,
    color:"#000000",
    fontWeight: '600',
  },
  email: {
    fontSize: offset,
    color: "#778899",
    fontWeight: '600',
  },
  button: {
    padding: 2 * offset,
    backgroundColor: "#778899",
    height: 500,
  },
});

export default Profile;
