import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Dimensions } from 'react-native';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import Chat from '../components/Chat';
import Profile from '../components/Profile';
import NavigationDrawerStructure from '../components/Drawer/Structure';
import firebaseSvc from '../FirebaseSvc';

const ChatStack = createStackNavigator({
  Chat: {
    screen: Chat,
    navigationOptions: ({navigation, screenProps}) => {
      return {
        title: screenProps.user.name === '' ? 'Chat' : screenProps.user.name,
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerRight: (
          <View>
            <Button
              buttonStyle={{padding: 0, backgroundColor: 'transparent'}}
              icon={{name: 'exit-to-app', style: {marginRight: 0, fontSize: 28}}}
              onPress={() => {
                firebaseSvc.onLogout();
                screenProps.changeLoginState(false);
                navigation.navigate('Login');
              }}
            />
          </View>
        ),
      }
    }
  },
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({navigation, screenProps}) => {
      return {
        title: 'Profile',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerRight: (
          <View>
            <Button
              buttonStyle={{padding: 0, backgroundColor: 'transparent'}}
              icon={{name: 'exit-to-app', style: {marginRight: 0, fontSize: 28}}}
              onPress={() => {
                firebaseSvc.onLogout();
                screenProps.changeLoginState(false);
                navigation.navigate('Login');
              }}
            />
          </View>
        ),
      }
    }
  },
});

export default createDrawerNavigator(
  {
    Chat: {
      screen: ChatStack,
    },
    Profile: {
      screen: ProfileStack,
    },
  },
  {
    drawerPosition: 'left',
    drawerOpenRoute: 'DrawerLeftOpen',
    drawerWidth: (Dimensions.get('window').width / 3 * 2)
  }
);
