package com.chatappproject;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.app.NotificationChannel;
import android.os.Build;
import android.media.AudioAttributes;
import android.net.Uri;
import android.content.ContentResolver;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;

public class MainActivity extends ReactActivity {

@Override
  protected void onCreate(Bundle savedInstanceState) {

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel(
        "chat_noti", 
        "APPCHAT", 
        NotificationManager.IMPORTANCE_HIGH
      );
      notificationChannel.setShowBadge(true);
      notificationChannel.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannel.setSound(Uri.parse(
        ContentResolver.SCHEME_ANDROID_RESOURCE + "://" 
        + getPackageName() 
        + "/raw/notisound"
      ), att);
      notificationChannel.enableVibration(true);
      notificationChannel.setVibrationPattern(new long[]{400, 400});
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannel);
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel notificationChannel = new NotificationChannel(
        "call_noti", 
        "APPCHAT", 
        NotificationManager.IMPORTANCE_HIGH
      );
      notificationChannel.setShowBadge(true);
      notificationChannel.setDescription("");
      AudioAttributes att = new AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
              .build();
      notificationChannel.setSound(Uri.parse(
        ContentResolver.SCHEME_ANDROID_RESOURCE + "://" 
        + getPackageName() 
        + "/raw/notisound"
      ), att);
      notificationChannel.enableVibration(true);
      notificationChannel.setVibrationPattern(new long[]{400, 400});
      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      NotificationManager manager = getSystemService(NotificationManager.class);
      manager.createNotificationChannel(notificationChannel);
    }

    super.onCreate(savedInstanceState); // or super.onCreate(null) with react-native-screens
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ChatAppProject";
  }
}
