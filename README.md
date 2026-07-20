# BiteWise

This is a **bare React Native project** (not Expo-managed). It uses some
`expo-*` libraries (expo-sqlite, expo-crypto, expo-secure-store,
expo-status-bar) as plain autolinked native modules, but building, running,
and bundling all go through the standard React Native CLI + Gradle + adb —
no `expo` CLI commands anywhere in the loop. The native `android/` project is
committed and is the source of truth; it isn't regenerated on each run.

There is currently no web target (dropped along with `expo start --web`) and
no `ios/` project yet (this has only been built for Android so far).

## One-time machine setup

- **JDK 17** and the **Android SDK** (platform 34, platform-tools,
  build-tools), with `ANDROID_HOME` set and `platform-tools` on `PATH`.
- Either a physical Android device with USB/wireless debugging enabled, or an
  emulator (see below).

## Running the app

```bash
npm install
npx react-native start          # Metro bundler
```

In a second terminal, with a device/emulator connected (`adb devices` shows it):

```bash
npx react-native run-android    # builds, installs, and launches
```

After the first build, you can leave Metro running and just relaunch the app
on the device — it reconnects automatically. Rebuild (`run-android`) again
only after native/config changes.

```bash
npm test          # unit tests
npm run typecheck # TypeScript check
```

> **Windows note:** if a Gradle task fails with
> `java.nio.file.AccessDeniedException` on a freshly-created
> `.../build/generated/...` path, it's a one-time file-lock race (this repo
> lives inside a OneDrive-synced folder, which sometimes very briefly locks
> newly-created build output). Delete the specific `<module>/android/build`
> directory mentioned in the error and rerun — it succeeds immediately on
> retry and won't recur for that module.

## Testing on your phone

**USB:**
1. On the phone: Settings → About phone → tap Build number 7× to enable
   Developer options, then enable **USB debugging**.
2. Plug in the cable, accept the "Allow USB debugging?" prompt.
3. `adb devices` should list the phone as `device`.
4. `npx react-native run-android`.

**Wireless (Android 11+):**
1. Developer options → **Wireless debugging** → *Pair device with pairing code*.
2. `adb pair <phone-ip>:<pair-port> <code>` (one-time), then
   `adb connect <phone-ip>:<port>`.
3. Same commands as USB from there — no cable needed.
   Shortcut once connected via USB: `adb tcpip 5555`, `adb connect <phone-ip>:5555`.

## Testing on an emulator

Create an AVD once via Android Studio's Device Manager, or `avdmanager`, then:

```bash
emulator -avd <avd-name>       # boots the emulator
npx react-native run-android   # builds/installs to whichever device/emulator adb sees
```

If both a phone and an emulator are connected, pick one with
`npx react-native run-android --deviceId <id>` (see `adb devices` for ids).

### Firebase setup (optional during development)

Copy `.env.example` to `.env` and fill in your Firebase web app config
(`EXPO_PUBLIC_FIREBASE_*`). Enable **Email/Password auth** and **Cloud
Firestore** in the Firebase console, and publish `firebase/firestore.rules`.
Without a `.env`, the app runs in local-only mode: any email/password signs
you in and data stays on the device.

---

Project Overview:

This project proposes the development of a mobile app that combines symptom tracking, allergen analysis, dietary guidance, and stress management tools to help individuals with food allergies and IBS manage their conditions. 

Problem Statement:

Food allergies and IBS are two prevalent and often chronic health conditions that significantly impact millions of individuals' daily lives, all around the world. IBS is one of the most prevalent gastrointestinal illnesses, with a general population frequency of 12%-30%. The majority of IBS patients relate their symptoms to unfavourable dietary responses. Managing these conditions can be very challenging for several reasons, as they require constant monitoring of dietary choices, symptom tracking, and stress management. It’s easy to miss allergens hiding out on ingredient lists under unfamiliar names (like ‘casein’ for milk, or ‘tahini’ for sesame, or ‘albumen’ for egg, or ‘earthnut’ for peanut, etc.) Symptom tracking for individuals with IBS tends to be a complicated process and this makes it harder for affected individuals to improve their quality of life. Affected individuals need a convenient and easy to use solution that helps them to track their symptoms, easily identify hidden allergens in food, and make informed dietary choices.

Solution:

The proposed mobile app will address these challenges by providing users with a convenient and easy-to-use platform to track their symptoms, identify allergens, and make informed dietary decisions. The app will also provide users with stress management tools and educational resources to help them manage their conditions.

Objectives:

The primary objectives of the proposed mobile app are as follows:

-To create a user-friendly platform that allows individuals to track their daily symptoms, food intake, stress levels, and other relevant factors.
-To provide personalized recommendations based on symptom tracking data, including dietary adjustments, stress management techniques, and lifestyle changes.
-To offer a barcode scanner feature for instant allergen analysis, helping users identify potential allergens in food products.
-To incorporate gamification elements to motivate users to adhere to their symptom tracking, dietary changes, and stress reduction activities.
-To integrate with wearable devices for the collection of additional health-related data.

