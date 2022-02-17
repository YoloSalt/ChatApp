/*
 * Copyright (c) 2011-2021, Zingaya, Inc. All rights reserved.
 */

'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Voximplant } from 'react-native-voximplant';
import PushManager from './PushManager';
import CallManager from './CallManager';

const handlersGlobal = {};

export default class LoginManager {
    static myInstance = null;
    client = null;
    displayName = '';
    fullUserName = '';
    myuser = '';
    phoneNumber = '';
    password = '';

    static getInstance() {
        if (this.myInstance === null) {
            this.myInstance = new LoginManager();
        }
        return this.myInstance;
    }

    constructor() {
        this.client = Voximplant.getInstance();
        // Connection to the Voximplant Cloud is stayed alive on reloading of the app's
        // JavaScript code. Calling "disconnect" API here makes the SDK and app states
        // synchronized.
        PushManager.init();
        (async() => {
            try {
                this.client.disconnect();
            } catch (e) {

            }
        })();
        this.client.on(Voximplant.ClientEvents.ConnectionClosed, this._connectionClosed);
    }
    

    async loginWithPassword(user, password) {
        this.phoneNumber = user;
        this.password = password;
        console.log('First step :(',user,'|||',password, ')');
     
        try {
            let state = await this.client.getClientState();
            console.log('2nd step');
            if (state === Voximplant.ClientState.DISCONNECTED) {
                await this.client.connect();
                console.log('31 step');
            }
            if (state === Voximplant.ClientState.CONNECTING || state === Voximplant.ClientState.LOGGING_IN) {
                console.log('LoginManager: loginWithPassword: login is in progress');
                console.log('32 step');
                return;
            }
            console.log('4 step');
            let authResult = await this.client.login(user, password);
            await this._processLoginSuccess(authResult);
            console.log('5 step');
        } catch (e) {
            console.log('6 step');
            console.log('LoginManager: loginWithPassword ' + e.name + e.message);
            switch (e.name) {
                case Voximplant.ClientEvents.ConnectionFailed:
                    this._emit('onConnectionFailed', e.message);
                    break;
                case Voximplant.ClientEvents.AuthResult:
                    this._emit('onLoginFailed', e.code);
                    break;
            }
        }
    }

    
    async loginWithToken() {
        try {
            let state = await this.client.getClientState();
            if (state === Voximplant.ClientState.DISCONNECTED) {
                await this.client.connect();
            }
            if (state !== Voximplant.ClientState.LOGGED_IN) {
                const phoneNumber = await AsyncStorage.getItem('usernameValue');
                const accessToken = await AsyncStorage.getItem('accessToken');
                console.log('LoginManager: loginWithToken: user: ' + phoneNumber + ', token: ' + accessToken );
                const authResult = await this.client.loginWithToken(phoneNumber + '@dev.ctuandz.n6.voximplant.com', accessToken);
                await this._processLoginSuccess(authResult);
            }
        } catch (e) {
            console.log('LoginManager: loginWithToken: ' + e.name);
            if (e.name === Voximplant.ClientEvents.AuthResult) {
                console.log('LoginManager: loginWithToken: error code: ' + e.code);
            }
        }
    }

    async logout() {
        this.unregisterPushToken();
        await this.client.disconnect();
        this._emit('onConnectionClosed');
    }
    registerPushToken() {
        this.client.registerPushNotificationsToken(PushManager.getPushToken());
    }

    unregisterPushToken() {
        this.client.unregisterPushNotificationsToken(PushManager.getPushToken());
    }

    pushNotificationReceived(notification) {
        (async() => {
            await this.loginWithToken();
            this.client.handlePushNotification(notification);
        })();
    }

    on(event, handler) {
        if (!handlersGlobal[event]) {
            handlersGlobal[event] = [];
        }
        handlersGlobal[event].push(handler);
    }

    off(event, handler) {
        if (handlersGlobal[event]) {
            handlersGlobal[event] = handlersGlobal[event].filter(v => v !== handler);
        }
    }

    _emit(event, ...args) {
        const handlers = handlersGlobal[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _connectionClosed = () => {
        this._emit('onConnectionClosed');
    };

    async _processLoginSuccess(authResult) {
        this.displayName = authResult.displayName;

        // save acceess and refresh token to default preferences to login using
        // access token on push notification, if the connection to Voximplant Cloud
        // is closed
        const loginTokens = authResult.tokens;
        if (loginTokens !== null) {
            await AsyncStorage.setItem('accessToken', loginTokens.accessToken);
            await AsyncStorage.setItem('refreshToken', loginTokens.refreshToken);
            await AsyncStorage.setItem('accessExpire', loginTokens.accessExpire.toString());
            await AsyncStorage.setItem('refreshExpire', loginTokens.refreshExpire.toString());
        } else {
            console.error('LoginSuccessful: login tokens are invalid');
        }
        this.registerPushToken();
        CallManager.getInstance().init();
        this._emit('onLoggedIn', authResult.displayName);
    }
}

const loginManagerGlobal = LoginManager.getInstance();
