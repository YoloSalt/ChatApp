import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';
import {firebase} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginManager from '../manager/LoginManager';
const LoginScreen = ({navigation}) => {
  const [fcmToken, setFcmToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passWord, setPassWord] = useState('');
  componentDidMount=() =>{
    AsyncStorage.getItem('usernameValue')
        .then((username) => {
            this.setState({username: username});
        });
    LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
    LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
    LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));

    // Workaround to navigate to the IncomingCallScreen if a push notification was received in 'killed' state
    if (Platform.OS === 'android') {
        if (CallManager.getInstance().showIncomingCallScreen) {
            this.props.navigation.navigate('IncomingCall', {
                callId: CallManager.getInstance().call.callId,
                isVideo: null,
                from: CallManager.getInstance().call.getEndpoints()[0].displayName,
            });
        }
    }
}
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        setFcmToken(token);
      });
  }, [])

  let data = {
    Phone: `${phoneNumber}`,
    Password: `${passWord}`,
    DeviceId: `${fcmToken}`,
  }

  const loginAPI = () => {
    axios
      .post('https://api.vaysieuutoc.com/appchat/login/user', data)
      .then(async function (response) {
        AsyncStorage.setItem('phone', phoneNumber)
        AsyncStorage.setItem('password', passWord)
        firebase.auth().signInWithCustomToken(response.data.firebaseToken)
        console.log(phoneNumber,' ||| ' , passWord);


        
        AsyncStorage.setItem('AccessToken', response.data.accessToken)

        const acToken = await AsyncStorage.getItem('AccessToken');
       
    axios
        .get('https://api.vaysieuutoc.com/appchat/myid', 
        {
          headers: {
            'Authorization':  acToken
          }
      } )
        .then (function (response) {
          LoginManager.getInstance().loginWithPassword(response.data.id + '@dev.ctuandz.n6.voximplant.com',passWord);
        })
      })
      .catch(function (err) {
        console.log(err);
      })

      
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View />
        <Text style={styles.headerTitle}>Đăng Nhập</Text>
        <View />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.textTitle}>Số điện thoại</Text>
        <TextInput
          placeholder="Nhập số điện thoại"
          placeholderTextColor="grey"
          color="#000"
          style={styles.input}
          value={phoneNumber}
          onChangeText={value => setPhoneNumber(value)}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.textTitle}>Mật khẩu</Text>
        <TextInput
          placeholder="Nhập mật khẩu"
          placeholderTextColor="grey"
          color="#000"
          style={styles.input}
          value={passWord}
          onChangeText={value => setPassWord(value)}
        />
      </View>
      <TouchableOpacity onPress={() => loginAPI()} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Đăng nhập</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  headerContainer: {
      margin: 30,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000'
  },
  fieldContainer: {
      margin: 40
  },
  textTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000'
  },
  input: {
      borderRadius: 10,
      backgroundColor:'#cccccc',
      color: '#000',
      fontSize: 16,
      paddingHorizontal: 10,
      marginTop: 5
  },
  confirmButton: {
      backgroundColor: '#6c63ff',
      width: '30%',
      alignItems: 'center',
      borderRadius: 10,
      alignSelf: 'center',
  },
  confirmText: {
      padding: 10,
      fontSize: 16,
      fontWeight: 'bold'
  },
  errorText: {
      color: '#ff0000',
  }
});
