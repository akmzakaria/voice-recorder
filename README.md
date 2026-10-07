# Voice Recorder App 🎙️

A simple and intuitive voice recording app built with Expo and React Native.

## Features

- **Record Audio**: High-quality audio recording with real-time duration display
- **Playback**: Play your recordings with a single tap
- **Delete Recordings**: Remove unwanted recordings with confirmation
- **Recording List**: View all your recordings with timestamps and durations
- **Persistent Storage**: Recordings are saved permanently to device storage
- **Auto-Load**: All recordings load automatically when you open the app
- **Cross-platform**: Works on iOS and Android
- **Modern Audio API**: Built with the new `expo-audio` package for Expo SDK 57

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. **Important**: Since this app uses native audio recording (`expo-audio`), you need a **development build**, not Expo Go.

### Option A: Local Development Build (Recommended)

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

This will build and install the app on your connected device or emulator.

### Option B: EAS Build (Cloud Build)

If you don't have Android Studio or Xcode installed:

```bash
# Install EAS CLI (one time)
npm install -g eas-cli

# Login
eas login

# Build for Android
eas build --profile development --platform android

# Build for iOS (requires Apple Developer account)
eas build --profile development --platform ios
```

After building, install the APK/IPA on your device and run `npx expo start --dev-client`.

### Testing on Web

The app works on web browsers for testing UI, but audio recording may have limitations:

```bash
npx expo start --web
```

## Usage

1. **Recording**: Tap the microphone button to start recording. The timer will show the current duration.
2. **Stop Recording**: Tap the red stop button to finish recording. Your recording will appear in the list below.
3. **Playback**: Tap on any recording in the list to play it. Tap again to pause.
4. **Delete**: Tap the trash icon to delete a recording (with confirmation).

## Permissions

The app requires microphone permissions to record audio. You'll be prompted for permission when you first try to record.

## Tech Stack

- **Expo SDK 57**: Modern Expo framework
- **React Native**: Cross-platform mobile development
- **expo-audio**: Audio recording and playback
- **TypeScript**: Type-safe development

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
