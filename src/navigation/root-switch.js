import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { rootSwitch } from 'src/config/navigator';

import MainStack from './main-stack';
import AuthStack from './auth-stack';

import Loading from 'src/screens/loading';
import GetStart from 'src/screens/get-start';

export default createAppContainer(
  createSwitchNavigator(
    {
      [rootSwitch.loading]: Loading,
      [rootSwitch.start]: GetStart,
      [rootSwitch.auth]: AuthStack,
      [rootSwitch.main]: MainStack,
    },
    {
      initialRouteName: rootSwitch.loading,
    }
  )
);
