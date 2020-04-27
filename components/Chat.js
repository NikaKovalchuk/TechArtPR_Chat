import React, {Component} from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {StyleSheet, KeyboardAvoidingView, View, ActivityIndicator} from 'react-native';

import firebaseSvc from '../FirebaseSvc';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  state = {
    messages: [],
  };

  get user() {
    return {
      name: this.props.screenProps.user.name,
      email: this.props.screenProps.user.email,
      avatar: this.props.screenProps.user.avatar,
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }

  render() {
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.container}>
          <GiftedChat
            messages={this.state.messages}
            onSend={firebaseSvc.send}
            user={this.user}
          />
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
        </View>
      </View>
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
        loading: false,
      }))
    );
  }

  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // view under GiftedChat mast have flex: 1 style!!!
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
});

export default Chat;
