import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

export async function GetFCMToken() {
    let fcmToken = AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {

        try {
            let fcmToken = messaging().getToken();
            if (fcmToken) {
                AsyncStorage.setItem('fcmToken', fcmToken);
                console.log('fcmToken', fcmToken);
            }
        } catch (error) {
            console.log(error);
            console.log('error in fcm');

        }
    }

    return fcmToken;
}

export const NotificationListener = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });


    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
            }
        });
    
    messaging().onMessage(async remoteMessage => {
        console.log("Notification on forgroundstate...", remoteMessage);
    });
}


