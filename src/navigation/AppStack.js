import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagingScreen from '../screens/MessagingScreen'

const Stack = createStackNavigator();

const AppStack = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ header: () => null }} name="MessagingScreen" component={MessagingScreen} />
    </Stack.Navigator>
  );
};
export default AppStack;