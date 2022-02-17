import React, { useEffect, useState, useContext } from "react";
import { BackHandler, Alert, View, SafeAreaView, StyleSheet, ActivityIndicator,Text, TouchableOpacity} from "react-native";
import { WebView, WebViewNavigation  } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../navigation/AuthProvider'
import { FloatingAction } from "react-native-floating-action";

const MessagingScreen = () => {

  const [URL, setURL] = useState('')
  const [Phone, setPhone] = useState('')
  const [PassWord,setPassWord] = useState('')

  const onNavigationStateChange = (navigationState) => {
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
      <View style ={styles.floatBtn}>
        <TouchableOpacity style ={styles.btnCall}>
        <Text style={styles.textBtn}>+</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
  
    
  },
  floatBtn: {
     
      backgroundColor:'red',
  },
  btnCall:{
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#ee6e73',                                    
    //position:"absolute",                            
    bottom: 10,                                                    
    right: 10, 
      
  }
  ,
  textBtn:{
    alignItems: "center",
    justifyContent: "center",
    textAlign:"center",
    fontSize:30,
    paddingTop:10,
  
  },
})