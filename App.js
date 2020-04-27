import React, {Component} from 'react';
import 'react-native-gesture-handler';

import AppContainer from './routes/index';
import Chat from './components/Chat';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: {
        name: '',
        email: '',
        avatar: ''
      },
    };
  }

  handleChangeLoginState = (user, loggedIn = false) => {
    if (loggedIn === false) {
      user = {
        name: '',
        email: '',
        avatar: ''
      }
    }
    this.setState({loggedIn});
    this.setState({user});
  };

  render() {
    return (
      <AppContainer
        screenProps={{
          user: this.state.user,
          loggedIn: this.state.loggedIn,
          changeLoginState: this.handleChangeLoginState,
        }}
      />
    );
  }
}

export default App;
