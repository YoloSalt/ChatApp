import React, { useEffect, useState, useContext } from "react";
import { BackHandler, Alert, View, SafeAreaView, StyleSheet, ActivityIndicator} from "react-native";
import { WebView, WebViewNavigation  } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../navigation/AuthProvider'

const MessagingScreen = () => {

  const [URL, setURL] = useState('')
  const [Phone, setPhone] = useState('')
  const [PassWord,setPassWord] = useState('')

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    const url = navigationState.url;
  
    // parseURLParams is a pseudo function.
    // Make sure to write your own function or install a package
    AsyncStorage.setItem("url", url)


  };

  

  useEffect(() => {
    AsyncStorage.getItem('url')
    .then((value) => {
      setURL(value)
    })

    AsyncStorage.getItem('phone')
    .then((value) => {
      setPhone(value)
    })

    AsyncStorage.getItem('password')
    .then((value) => {
      setPassWord(value)
    })
  }, [])
  
  
  return(
    <SafeAreaView style={styles.container}>
        <WebView 
          styles={{ flex: 1 }}
          source={{ 
            uri: URL != null ? URL : 'https://home.vaysieuutoc.com/loginmobile.html?user='+ Phone + '&password='+ PassWord
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={onNavigationStateChange}
        />
    </SafeAreaView>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})