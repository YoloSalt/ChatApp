import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'
import MessagingScreen from '../screens/MessagingScreen'

const Stack = createStackNavigator();

const AuthStack = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ header: () => null }} name="Login" component={LoginScreen} />
      <Stack.Screen options={{ header: () => null }} name="MessagingScreen" component={MessagingScreen} />
    </Stack.Navigator>
  )
}

export default AuthStack;