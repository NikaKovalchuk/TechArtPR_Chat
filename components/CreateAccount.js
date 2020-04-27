import React, {Component} from 'react';
import {
  StyleSheet, Text,
  TextInput, View,
  ScrollView, ActivityIndicator
} from 'react-native';
import {Button} from 'react-native-elements';
import firebaseSvc from '../FirebaseSvc';

class CreateAccount extends Component {
  static navigationOptions = {
    title: 'Firebase Chat App',
  };

  state = {
    name: 'Igor P',
    email: 'example@example.com',
    password: 'example',
    loading: false,
  };

  onPressCreate = async () => {
    this.setState({loading: true});
    console.log('create account... email:' + this.state.email);
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };

    const response = await firebaseSvc.createAccount(user);
    this.setState({loading: false});
    if (response.success) {
      this.registrationSuccess(response.user);
    }
  };

  registrationSuccess = (user) => {
    this.props.screenProps.changeLoginState(
      {
        name: user.displayName,
        email: user.avatar,
        avatar: user.photoURL
      },
      true,
    );

    this.props.navigation.navigate('Chat');
  };

  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });
  onChangeTextName = name => this.setState({ name });

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
              onChangeText={this.onChangeTextEmail}
              value={this.state.email}
            />
            <Text style={styles.title}>Password:</Text>
            <TextInput
              style={styles.nameInput}
              onChangeText={this.onChangeTextPassword}
              value={this.state.password}
            />
            <Text style={styles.title}>Name:</Text>
            <TextInput
              style={styles.nameInput}
              onChangeText={this.onChangeTextName}
              value={this.state.name}
            />
            <View style={styles.button}>
              <Button
                title="Create Account"
                style={styles.buttonText}
                onPress={this.onPressCreate}
              />
            </View>

            <View style={styles.button}>
              <Button
                title="Back to Login"
                onPress={() => this.props.navigation.navigate("Login")}
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
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: offset,
    paddingVertical: 4*offset,
    backgroundColor: "#778899",
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

export default CreateAccount;
