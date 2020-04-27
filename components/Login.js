import React, {Component} from 'react';
import { Constants, ImagePicker, Permissions } from 'expo';
import {
  StyleSheet, Text,
  TextInput,  TouchableOpacity, View,
  ImageEditor, ScrollView, ActivityIndicator
} from 'react-native';
import {Button} from 'react-native-elements';
import firebaseSvc from '../FirebaseSvc';
import firebase from 'firebase';
import { auth, initializeApp, storage } from 'firebase';
import uuid from 'uuid';

class Login extends Component {
  static navigationOptions = {
    title: 'Firebase Chat App',
  };

  state = {
    email: 'example@example.com',
    password: 'example',
    loading: false,
  };

  // using Fire.js
  onPressLogin = async () => {
    this.setState({loading: true});
    console.log('pressing login... email:' + this.state.email);
    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    const response = firebaseSvc.login(
      user,
      this.loginSuccess,
      this.loginFailed
    );
  };

  loginSuccess = (response) => {
    const user = response.user.providerData[0]

    this.props.screenProps.changeLoginState(
      {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      },
      true,
    );

    this.setState({loading: false});
    this.props.navigation.navigate('Chat');
  };

  loginFailed = () => {
    this.setState({loading: false});
    console.log('login failed ***');
    alert('Login failure. Please tried again.');
  };

  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });

  render() {
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={styles.subContainer}>
            <Text style={styles.title}>Email:</Text>
            <TextInput
              style={styles.nameInput}
              placeHolder="test3@gmail.com"
              onChangeText={this.onChangeTextEmail}
              value={this.state.email}
              keyboardType="email-address"
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
              style={styles.nameInput}
              onChangeText={this.onChangeTextPassword}
              value={this.state.password}
              secureTextEntry
            />
            <View style={styles.button}>
              <Button
                title="Login"
                onPress={this.onPressLogin}
              />
            </View>

            <View style={styles.button}>
              <Button
                title="Create new account"
                onPress={() => this.props.navigation.navigate("Register")}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: offset,
    paddingVertical: 5*offset,
    backgroundColor: "#778899",
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    fontSize: offset,
  },
  button: {
    marginLeft: offset,
    marginRight: offset,
    marginBottom: offset,
  },
});

export default Login;
