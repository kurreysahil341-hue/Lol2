# J.A.R.V.I.S. Voice Assistant (v2 — Fixed)

Iron Man style AI voice assistant. Powered by **Google Gemini** for conversation
and **Capacitor + Android intents** for real system-app control (WhatsApp, YouTube,
Maps, Phone dialer, SMS, Settings, Camera, Contacts, and more) — all controllable
by voice in **Hindi, Hinglish or English**.

## ✨ Features

- 🎤 Voice input via Web Speech API (Hindi + English + Hinglish)
- 🔊 JARVIS-style speech output (system TTS)
- 🤖 Powered by **Gemini 2.5 Flash** (bring your own API key)
- 📱 Real Android intents — actually opens installed apps by voice
- 🔧 System permissions declared: mic, call, SMS, camera, storage, contacts
- 💾 API key stored securely on device using Capacitor Preferences
- 🎨 Arc-reactor UI inspired by Tony Stark

## 📋 What was fixed vs the old APK

| # | Problem in old build | Fix in v2 |
|---|---|---|
| 1 | Gemini API key not persisted / not loaded | `StorageService` + `ApiKeyModal` save the key locally the first time, auto-load on next launch |
| 2 | Voice commands only opened web URLs, not real apps | New `SystemAppLauncher` uses `@capacitor/app-launcher` + Android intent URIs (`tel:`, `sms:`, `geo:`, `vnd.youtube:`, `intent://…;package=…;end`) |
| 3 | Capacitor `plugins` array was empty (`[]`) | `package.json` installs `app-launcher`, `preferences`, `device`, `toast`, `haptics`, `status-bar`, `app` |
| 4 | Missing Android permissions | New `android-resources/AndroidManifest.xml` declares mic, call, SMS, camera, contacts, storage + `<queries>` for system-app visibility on Android 11+ |
| 5 | No CI to build APK | New `.github/workflows/build-apk.yml` builds a debug APK on every push and uploads it as an artifact |
| 6 | Hinglish commands not understood | New `CommandParser` with rule-based Hindi/Hinglish/English pattern matching |

## 🚀 Sample Voice Commands

- **English** — "Open WhatsApp", "Call 9876543210", "Search YouTube for lofi music", "Directions to Delhi Airport", "What's the battery status?"
- **Hinglish** — "WhatsApp kholo", "YouTube par Arijit Singh chalao", "Camera chalu karo", "Google par IPL score search karo"
- **Hindi (Devanagari)** — "कैमरा खोलो", "बैटरी कितनी है", "समय क्या है"
- **Conversational (falls back to Gemini)** — "Explain quantum computing in one line", "Write a haiku about Mumbai rain"

## 🛠 How to build the APK (two ways)

### Option A — GitHub Actions (recommended, zero setup)

1. Create a **new empty repo** on GitHub, e.g. `jarvis-voice-assistant`.
2. Upload every file from this project (or `git push` the whole folder).
3. Go to the **Actions** tab → the workflow **"Build Debug APK"** runs automatically.
4. When it finishes (~5 min), click the run → scroll down to **Artifacts** → download `jarvis-voice-assistant-debug-apk`.
5. Unzip → install `app-debug.apk` on your Android phone (enable *Install from unknown sources*).

To make a **GitHub Release** with the APK attached, push a tag:
```bash
git tag v2.0.0
git push origin v2.0.0
```

### Option B — Android Studio (local)

Prerequisites: Node 20+, JDK 17, Android Studio Giraffe+, Android SDK 34.

```bash
npm install
npm run build
npx cap add android         # only the first time
cp android-resources/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
mkdir -p android/app/src/main/res/xml
cp android-resources/file_paths.xml android/app/src/main/res/xml/file_paths.xml
npx cap sync android
npx cap open android        # opens Android Studio → click Run ▶
```

Or a fully headless debug build:
```bash
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔑 First launch

1. Install the APK, open the app.
2. The app asks for a **Gemini API key** — get a free one at
   <https://aistudio.google.com/apikey> and paste it in.
3. Grant **microphone** permission when prompted.
4. Tap the arc reactor and speak.

If commands like "Call Rahul" don't work, also grant **Phone**, **Contacts** and
**SMS** permissions from *Settings → Apps → Jarvis Voice Assistant → Permissions*.

## 📁 Project structure

```
jarvis-voice-assistant/
├─ src/
│  ├─ App.tsx                    # main React UI
│  ├─ components/ApiKeyModal.tsx # API key input
│  ├─ services/
│  │  ├─ gemini.ts               # Gemini 2.5 Flash chat wrapper
│  │  ├─ speech.ts               # Web Speech API + mic-permission handling
│  │  ├─ commandParser.ts        # Hindi/Hinglish/English intent parser
│  │  ├─ appLauncher.ts          # Android intent + app-launcher glue
│  │  └─ storage.ts              # Capacitor Preferences wrapper
│  └─ styles.css                 # Arc-reactor JARVIS theme
├─ android-resources/
│  ├─ AndroidManifest.xml        # fixed permissions + <queries>
│  └─ file_paths.xml
├─ .github/workflows/build-apk.yml
├─ capacitor.config.json
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

## 🧠 How it decides what to do

Every spoken sentence goes through:

1. **`CommandParser`** — regex + keyword rules for Hindi/Hinglish/English → returns an `Intent` (e.g. `{ type: 'youtube_search', query: 'lofi' }`).
2. If parsed → **`SystemAppLauncher`** turns it into a real Android intent URI and hands it to Capacitor's `AppLauncher` plugin.
3. If nothing matched → falls back to **Gemini 2.5 Flash** for a conversational reply, which is then read aloud.

## ⚠️ Known limitations

- Flashlight control needs a dedicated Cordova/Capacitor plugin — placeholder implemented, real control queued.
- SMS *sending* opens the system compose UI (user still taps Send) — required by Google Play policy for non-default SMS apps.
- The debug APK is not signed for Play Store; use it for personal side-loading only. To publish, sign it with your own keystore.

## 📄 License

MIT — do what you like, credit appreciated.
