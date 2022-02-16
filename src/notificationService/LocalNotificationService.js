import PushNotification, { Importance } from "react-native-push-notification";
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from 'react-native';
import { Vibration, } from 'react-native';

class LocalNotificationService {

    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                // console.log("[LocalNotificationService] onRegister:", token);
            },
            onNotification: function (notification) {
                console.log("[LocalNotificationService] onNotification:", notification);
                if (!notification?.data) {
                    return
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                if (Platform.OS === 'ios') {
                    // (required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        })
    }

    unregister = () => {
        PushNotification.unregister()
    }

    showNotification = (id, title, message, data = {}, options = {}) => {
        console.log("[channelId] ",options.channelId);

        if(options.channelId === "chat_noti") {
            PushNotification.createChannel({
                channelId: "chat_noti", // (required)
                channelName: "chat noti", // (required)
                playSound: true,
                soundName: 'notisound',
            });
            Vibration.vibrate(1 * 5000)
            PushNotification.localNotification({
                /* Android Only Properties */
                ...this.buildAndroidNotification(id, title, message, data, options),
                /* iOS and Android properties */
                ...this.buildIOSNotification(id, title, message, data, options),
                /* iOS and Android properties */
                channelId: 'chat_noti',
                title: title || "",
                message: `${message}` || "",
                userInteraction: false,
                timeoutAfter: 5000,
                actions: ["Yes", "No"]
            });

        } else if(options.channelId === "call_noti") {
            PushNotification.createChannel({
                channelId: "call_noti", // (required)
                channelName: "call noti", // (required)
                playSound: true,
                soundName: 'notisound',
            });
            Vibration.vibrate(1 * 12000)
            PushNotification.localNotification({
                /* Android Only Properties */
                ...this.buildAndroidNotification(id, title, message, data, options),
                /* iOS and Android properties */
                ...this.buildIOSNotification(id, title, message, data, options),
                /* iOS and Android properties */
                channelId: 'call_noti',
                title: title || "",
                message: `${message}` || "",
                userInteraction: false,
                timeoutAfter: 12000,
                actions: ["Yes", "No"]
            });
        }
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_notification",
            bigText: message || '',
            subText: title || '',
            priority: options.priority || "high",
            importance: options.importance || "high",
            data: data,
        }
    }

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || "",
            userInfo: {
                id: id,
                item: data
            }
        }
    }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) => {
        // console.log("[LocalNotificationService] removeDeliveredNotificationByID: ", notificationId);
        PushNotification.cancelAllLocalNotifications({ id: `${notificationId}` })
    }
}

export const localNotificationService = new LocalNotificationService()
