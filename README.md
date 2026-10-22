# BiteWise

A mobile app that helps people with food allergies and IBS track their symptoms, check food for allergens, and see how diet, stress and sleep relate to how they feel.

BiteWise is my final year project for a BSc in Computer Science and Software Engineering at BIUST. It is built with React Native and TypeScript, runs on Android, and works offline first.

> **Status:** working beta. Core tracking, barcode scanning and AI meal-photo analysis are built. Personalised recommendations, gamification and wearable integration are planned (see [Roadmap](#roadmap)).
> **Not medical advice.** BiteWise is a tracking aid. AI meal analysis is an estimate and should never replace reading a label or following your doctor's advice.

## The problem

IBS affects roughly 12% to 30% of people, and most people with IBS link their symptoms to what they eat. Food allergies add another layer: allergens hide on ingredient lists under unfamiliar names, such as casein for milk, tahini for sesame, albumen for egg or earthnut for peanut. Managing both means constantly tracking food, symptoms and stress, which is tiring to do on paper or in a generic notes app.

## Features

**Tracking**
- **Food log:** record meals with ingredients, meal type and portion size.
- **Symptom log:** record symptoms (abdominal pain, bloating, diarrhoea, constipation, nausea, gas, reflux, fatigue and more) with severity, plus the Bristol stool scale for bowel symptoms.
- **Daily factors:** record stress level and triggers, sleep hours and quality, water, exercise and the coping activities you used.
- **Profile:** set your allergens (the 14 major allergens in the EU labelling list), IBS subtype and dietary preferences.

**Allergen checking**
- **Barcode scanner:** scan a packaged food and the app looks up its ingredients and allergens in the [Open Food Facts](https://world.openfoodfacts.org/) database, then compares them with your profile and warns you about a match.
- **AI meal-photo analysis:** take a photo of a meal and get a best-effort description, ingredient list and possible-allergen tags, shown clearly as an estimate. The analysis is done by Google's Gemini model through a small proxy service (see below).

**Accounts and sync**
- **Local-first:** all data is stored on the device in SQLite, so the app works offline.
- **Cloud backup:** with Firebase configured, you can sign in with email and password and your data syncs to Cloud Firestore. Without Firebase, the app runs in local-only mode.

## How it works

```
React Native app (TypeScript)
  |-- SQLite (on device)          source of truth for the UI
  |-- Firebase Auth + Firestore   per-user backup, last-write-wins sync
  |-- Open Food Facts API         barcode lookups
  '-- Cloudflare Worker --> Gemini API    meal-photo analysis
```

- **Local-first sync:** rows are written to SQLite first and marked as not yet synced. Pending rows are pushed to Firestore under `users/{uid}/...`, and newer remote changes are pulled and merged by their `updatedAt` timestamp.
- **Allergen matching:** product ingredients and allergen tags are matched against your profile using a shared list of canonical allergen ids.
- **Meal-photo proxy:** the app never holds the Gemini API key. It sends the photo to a Cloudflare Worker (in `worker/`), which calls Gemini and returns a structured result (description, ingredients, allergen tags and a confidence level).

## Tech stack

- **App:** React Native 0.73 (bare workflow), TypeScript, React Navigation, Zustand, `expo-sqlite`, `react-native-vision-camera`
- **Backend services:** Firebase Authentication, Cloud Firestore, Firebase App Distribution
- **APIs:** Open Food Facts, Google Gemini (through a Cloudflare Worker)
- **Testing and CI:** Jest and React Native Testing Library, GitHub Actions (typecheck and tests on every push and pull request)

## Project structure

| Folder | Contents |
| --- | --- |
| `screens/` | App screens: onboarding, auth, logging, barcode scanning, meal-photo results, profile |
| `components/` | Reusable UI and form components |
| `db/` | Local SQLite data layer |
| `services/` | Open Food Facts lookup, meal-photo analysis client, Firebase and sync |
| `stores/` | Zustand state stores |
| `utils/`, `constants/` | Allergen matching, dates, allergen, symptom and meal definitions |
| `worker/` | Cloudflare Worker that proxies meal-photo requests to Gemini |
| `firebase/` | Firestore security rules |
| `__tests__/` | Unit tests |

## Getting started

This is a **bare React Native project** (not Expo-managed). It uses a few `expo-*` libraries as plain native modules, and builds go through the React Native CLI and Gradle. The native `android/` project is committed. There is no iOS project yet.

### Requirements
- Node.js 20 or later
- JDK 17 and the Android SDK (platform 34, platform-tools, build-tools), with `ANDROID_HOME` set and `platform-tools` on your `PATH`
- An Android phone with USB or wireless debugging enabled, or an Android emulator

### Run the app

```bash
npm install
npx react-native start           # starts the Metro bundler
```

In a second terminal, with a device or emulator connected (`adb devices` should list it):

```bash
npx react-native run-android     # builds, installs and launches the app
```

Run the checks:

```bash
npm test
npm run typecheck
```

### Test on a phone

1. On the phone, open Settings, About phone, and tap Build number seven times to enable Developer options. Turn on **USB debugging**.
2. Plug in the cable and accept the "Allow USB debugging?" prompt.
3. Run `adb devices` to confirm the phone is listed, then `npx react-native run-android`.

For wireless debugging (Android 11 or later): turn on **Wireless debugging** in Developer options, pair with `adb pair <phone-ip>:<pair-port> <code>`, then `adb connect <phone-ip>:<port>`.

### Firebase (optional)

Without Firebase the app runs in local-only mode, and any email and password signs you in with data kept on the device. To enable accounts and sync:

1. Copy `.env.example` to `.env` and fill in your Firebase web app config (`EXPO_PUBLIC_FIREBASE_*`).
2. In the Firebase console, enable **Email/Password** authentication and **Cloud Firestore**.
3. Publish the rules in `firebase/firestore.rules`.

### Meal-photo analysis (optional)

The meal-photo feature needs its own Cloudflare Worker. See [`worker/README.md`](worker/README.md) for setup. You will need a Cloudflare account and a Gemini API key, both with free tiers. Set the Worker URL and shared secret in your own configuration, and do not commit them to a public repository.

### Share a build with testers

Firebase App Distribution is set up to send a release build to testers without a Play Store listing:

```bash
cd android
./gradlew assembleRelease appDistributionUploadRelease
```

Edit `android/release-notes.txt` first. Its contents become the release notes testers see. A manual GitHub Actions workflow (`Deploy to testers`) does the same from CI.

### Troubleshooting (Windows)

If a Gradle task fails with `AccessDeniedException` or `Cannot snapshot <path>: not a regular file`, it is a file-lock race, usually when the project sits inside a OneDrive-synced folder. Delete the `android/build` directory of the module named in the error and run again, or move the project outside OneDrive.

## Roadmap

Built:
- [x] Food, symptom and daily factor logging
- [x] Allergen profile and barcode scanning with Open Food Facts
- [x] AI meal-photo analysis
- [x] Local-first storage with Firebase sync

Planned:
- [ ] Personalised recommendations from tracking data (diet, stress management, lifestyle)
- [ ] Stress management tools and educational resources
- [ ] Gamification to encourage consistent tracking
- [ ] Wearable device integration
- [ ] iOS build

## Limitations

- Barcode lookups depend on Open Food Facts, so products missing from its database are not found.
- AI meal analysis is an estimate and can miss or invent ingredients.
- The app has so far been built and tested on Android only.

## Author

Katlego Caangu Munisola, [katlego.tech](https://katlego.tech/)
