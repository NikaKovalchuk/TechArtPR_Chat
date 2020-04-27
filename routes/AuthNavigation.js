import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Dimensions } from 'react-native';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import Login from '../components/Login';
import CreateAccount from '../components/CreateAccount';
import NavigationDrawerStructure from '../components/Drawer/Structure';

const LoginStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({navigation}) => {
      return {
        title: 'Log In',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      }
    }
  },
});

const RegisterStack = createStackNavigator({
  Register: {
    screen: CreateAccount,
    navigationOptions: ({navigation}) => {
      return {
        title: 'Register',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      }
    },
  },
});

export default createDrawerNavigator(
  {
    Login: {
      screen: LoginStack,
    },
    Register: {
      screen: RegisterStack,
    },
  },
  {
    drawerPosition: 'left',
    drawerOpenRoute: 'DrawerLeftOpen',
    drawerWidth: (Dimensions.get('window').width / 3 * 2)
  }
);
