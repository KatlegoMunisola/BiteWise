# BiteWise

## Running the app

```bash
npm install
npx expo start        # press w for web
npm test              # unit tests
npm run typecheck     # TypeScript check
```

## Testing on your phone (Android dev build)

This project uses a **development build** (`expo-dev-client`), not Expo Go.

One-time machine setup: JDK 17 + Android SDK (platform 34, platform-tools,
build-tools) with `ANDROID_HOME` set and `platform-tools` on `PATH`.

**USB:**
1. On the phone: Settings → About phone → tap Build number 7× to enable
   Developer options, then enable **USB debugging**.
2. Plug in the cable, accept the "Allow USB debugging?" prompt.
3. `adb devices` should list the phone as `device`.
4. `npx expo run:android` — first run generates `android/`, Gradle-builds and
   installs the BiteWise dev app, and starts Metro over the cable
   (`adb reverse tcp:8081`). Later runs: just `npx expo start` and open the
   app (rebuild only after native/config changes).

**Wireless (Android 11+):**
1. Developer options → **Wireless debugging** → *Pair device with pairing code*.
2. `adb pair <phone-ip>:<pair-port> <code>` (one-time), then
   `adb connect <phone-ip>:<port>`.
3. Same commands as USB from there — no cable needed.
   Shortcut once connected via USB: `adb tcpip 5555`, `adb connect <phone-ip>:5555`.

### Firebase setup (optional during development)

Copy `.env.example` to `.env` and fill in your Firebase web app config
(`EXPO_PUBLIC_FIREBASE_*`). Enable **Email/Password auth** and **Cloud
Firestore** in the Firebase console, and publish `firebase/firestore.rules`.
Without a `.env`, the app runs in local-only mode: any email/password signs
you in and data stays on the device.

> Windows + Node 24 note: Expo SDK 50's CLI crashes at startup
> (`mkdir 'node:sea'`). Either use Node ≤ 20, or re-apply the one-line filter
> patch in `node_modules/@expo/cli/build/src/start/server/metro/externals.js`
> after a fresh install (filter out builtin names containing `:`).

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

