# 📘 पूरी योजना — Jarvis Voice Assistant को Working APK कैसे बनायें

यह guide आपको step-by-step बताएगा कि GitHub, Android Studio, या दोनों से यह app कैसे build करें।

---

## 🎯 दो सबसे आसान रास्ते

| तरीका | कठिनाई | समय | कुछ install करना है? |
|---|---|---|---|
| **A. GitHub Actions (सिफारिश)** | ⭐ बहुत आसान | ~5 min | कुछ नहीं — सिर्फ browser |
| **B. Android Studio (local)** | ⭐⭐⭐ मध्यम | ~30 min setup + 5 min build | JDK 17, Android Studio, Node.js |

---

## 🅰️ रास्ता A — GitHub Actions से Automatic APK Build

### Step 1 — GitHub account
अगर नहीं है तो <https://github.com> पर free account बनायें।

### Step 2 — नया repository बनायें
1. GitHub पर login करें → top-right पर **"+" → "New repository"**
2. Name: `jarvis-voice-assistant`
3. Visibility: **Public** (Actions free में चलता है)
4. **Create repository** दबायें (README/gitignore add मत करें, हम अपनी files upload करेंगे)

### Step 3 — Files upload करें
आपको मिलेगी `jarvis-voice-assistant-v2.zip` (नीचे download link)। इसे extract करें और सारी files/folders को नये GitHub repo में **"Add file → Upload files"** से drag-drop कर दें। फिर **Commit changes** दबायें।

**या** git command line से:
```bash
git clone https://github.com/YOUR_USERNAME/jarvis-voice-assistant.git
cd jarvis-voice-assistant
# extracted files को यहाँ copy करें
git add .
git commit -m "Initial commit - Jarvis v2"
git push
```

### Step 4 — Workflow अपने-आप चलेगा
1. Repository में **Actions** tab पर जायें
2. **"Build Debug APK"** workflow दिखेगा — पहले run में ~5 मिनट लगेंगे
3. जब हरा ✅ tick आ जाये, उस run पर click करें
4. सबसे नीचे **Artifacts** section में **`jarvis-voice-assistant-debug-apk`** दिखेगा
5. Download करें → ZIP extract करें → अंदर मिलेगी **`app-debug.apk`**

### Step 5 — Phone पर install करें
1. APK फ़ाइल phone में transfer करें (email/WhatsApp/USB)
2. Phone Settings → *Install from unknown sources* enable करें
3. APK install करें
4. पहली बार open करते ही Gemini API key माँगेगी → <https://aistudio.google.com/apikey> से free key लेकर paste करें
5. Microphone permission grant करें
6. Arc reactor tap करके बोलिये: *"WhatsApp kholo"*

---

## 🅱️ रास्ता B — Android Studio से Local Build

### Requirements (एक बार install करें)

1. **Node.js 20+** — <https://nodejs.org>
2. **JDK 17** — <https://adoptium.net> (Temurin 17 recommended)
3. **Android Studio** — <https://developer.android.com/studio>
   - Install करते समय Android SDK 34, Build-tools 34.0.0, Platform-tools tick करें

### Build steps

```bash
# 1) Project extract करके folder में जायें
cd jarvis-voice-assistant

# 2) Dependencies install करें
npm install

# 3) Web app build करें
npm run build

# 4) Android platform जोड़ें (सिर्फ पहली बार)
npx cap add android

# 5) हमारी fixed manifest file copy करें
cp android-resources/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
mkdir -p android/app/src/main/res/xml
cp android-resources/file_paths.xml android/app/src/main/res/xml/file_paths.xml

# 6) Capacitor sync
npx cap sync android

# 7) Android Studio में खोलें
npx cap open android
# → Android Studio खुलेगा → Run ▶ button दबायें (phone connected हो या emulator)
```

**या** command line से सीधा APK बनायें:
```bash
cd android
./gradlew assembleDebug
# APK यहाँ मिलेगी: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🐛 पुरानी APK में क्या-क्या Problems थीं (और अब कैसे Fix हैं)

| # | पुरानी problem | नया fix |
|---|---|---|
| 1 | Gemini API key काम नहीं कर रही थी — hardcode / save नहीं होती थी | `StorageService` (Capacitor Preferences) + `ApiKeyModal` — पहली बार key डालो, अगली बार से auto-load |
| 2 | Voice command सिर्फ web page खोलती थी (जैसे `api.whatsapp.com/send`), असली WhatsApp app नहीं | `SystemAppLauncher` अब real Android intents use करता है: `tel:`, `sms:`, `geo:`, `vnd.youtube:`, `intent://…;package=com.whatsapp;end` |
| 3 | Capacitor plugins array खाली था (`[]`) — mic/app-launcher plugin install ही नहीं थे | `package.json` में सारे ज़रूरी plugins: `@capacitor/app-launcher`, `preferences`, `device`, `haptics`, `toast`, `status-bar` |
| 4 | AndroidManifest में सारी permissions declared नहीं थीं | नया manifest: `RECORD_AUDIO`, `CALL_PHONE`, `SEND_SMS`, `READ_CONTACTS`, `CAMERA`, `FLASHLIGHT`, `VIBRATE`, `QUERY_ALL_PACKAGES` + Android 11+ के लिए `<queries>` block |
| 5 | Hindi/Hinglish command समझ नहीं आती थी | नया `CommandParser` — regex rules Hindi (Devanagari), Hinglish, और English तीनों handle करते हैं |
| 6 | कोई CI/build automation नहीं थी | `.github/workflows/build-apk.yml` — हर push पर APK auto-build होती है |

---

## 🎤 अब कौन-कौन से Voice Commands काम करेंगे

### System apps खोलना
- "WhatsApp kholo" / "Open WhatsApp"
- "YouTube kholo"
- "Camera chalu karo" / "कैमरा खोलो"
- "Settings kholo" / "Instagram kholo" / "Chrome kholo"
- "Calculator kholo" / "Gallery dikhao"

### Call / SMS
- "9876543210 par call karo"
- "Rahul ko call karo" (contacts search में जायेगा)
- "SMS bhejo 9876543210 ko kaho ki main aa raha hun"

### Search
- "YouTube par lofi music chalao"
- "Google par IPL 2026 score search karo"
- "Delhi ka mausam batao" (Gemini से जवाब)

### Maps / navigation
- "Delhi Airport ka rasta dikhao"
- "Maps par nearby restaurants dikhao"

### System info
- "Battery kitni hai"
- "Time kya hai" / "Samay kya hai"
- "Aaj ki date kya hai"

### General AI conversation (Gemini fallback)
- "Ek shayari sunao Mumbai barish par"
- "Explain black holes in 2 lines"
- "Meri diet plan banao"

---

## 🔐 Permissions जो App install के बाद देनी हैं

Settings → Apps → **Jarvis Voice Assistant** → Permissions → सब **Allow**:

- ✅ Microphone (voice command सुनने के लिए)
- ✅ Phone (call करने के लिए)
- ✅ Contacts (नाम से call करने के लिए)
- ✅ SMS (message भेजने के लिए)
- ✅ Camera (camera command के लिए)
- ✅ Storage (gallery/photos के लिए)

---

## 🆘 Troubleshooting

**Q: APK install नहीं हो रही "Parse error" आ रहा है**
A: Android version 7+ चाहिए। पुराने phone पर काम नहीं करेगा।

**Q: "Gemini API error 403 / Invalid API key"**
A: <https://aistudio.google.com/apikey> से नयी key बनायें। App में **API KEY** button दबाकर बदलें।

**Q: Voice command सुनती नहीं है**
A: Microphone permission dें। अगर फिर भी नहीं तो phone में Google app / Speech Services से Hindi language pack download करें।

**Q: "WhatsApp kholo" पर WhatsApp नहीं खुलता**
A: WhatsApp installed होना चाहिए। अगर installed है फिर भी नहीं खुल रहा तो phone Settings → Apps → Jarvis → Open by default → "Open supported links" enable करें।

**Q: GitHub Actions build fail हो रहा है**
A: Actions tab में उस failed run को click करके log देखें। सबसे common issue — repo में files upload करते समय folder structure टूट जाता है। ZIP से सारी files repo के **root** में होनी चाहियें (`package.json` root पर, `src/` folder root पर)।

---

## 📈 आगे क्या-क्या add कर सकते हैं (roadmap)

- 🔦 Real flashlight control (Cordova plugin)
- 🚨 "Hey Jarvis" wake word detection (Porcupine या custom TensorFlow Lite model)
- 🌐 Realtime weather/news (OpenWeather + NewsAPI integration)
- 📅 Google Calendar events add करना
- 🎵 Local music player control (MediaSession API)
- 🏠 Smart-home integration (Google Home / Alexa bridges)
- 🔐 Biometric lock — face/fingerprint से app unlock

अगर इनमें से कुछ चाहिये तो बतायें, main अगले version में add कर दूंगा।
