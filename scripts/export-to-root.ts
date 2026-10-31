import fs from 'fs';
import path from 'path';
import {
  ACTIVITY_MAIN_XML,
  MAIN_ACTIVITY_KT,
  SHERI_VOICE_SERVICE_KT,
  LOCAL_LLM_MANAGER_KT,
  TTS_SPEECH_HELPER_KT,
  INTENT_ROUTER_KT,
  CONTACT_CALL_HELPER_KT,
  VOSK_SPEECH_MANAGER_KT,
  ANDROID_MANIFEST_XML,
  COLORS_XML,
  STRINGS_XML,
  DRAWABLES,
  BUILD_GRADLE_KTS
} from '../src/data/androidFiles';
import {
  ROOT_BUILD_GRADLE_KTS,
  SETTINGS_GRADLE_KTS,
  GRADLE_PROPERTIES
} from '../src/utils/zipExporter';

function writeFileSafe(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Wrote:', filePath);
}

// 1. Root Android Gradle files
writeFileSafe('./build.gradle.kts', ROOT_BUILD_GRADLE_KTS);
writeFileSafe('./settings.gradle.kts', SETTINGS_GRADLE_KTS);
writeFileSafe('./gradle.properties', GRADLE_PROPERTIES);

// 2. App Module
writeFileSafe('./app/build.gradle.kts', BUILD_GRADLE_KTS);
writeFileSafe('./app/src/main/AndroidManifest.xml', ANDROID_MANIFEST_XML);

// 3. Kotlin Sources
const kotlinBase = './app/src/main/java/com/heysheri/assistant';
writeFileSafe(`${kotlinBase}/MainActivity.kt`, MAIN_ACTIVITY_KT);
writeFileSafe(`${kotlinBase}/speech/SheriVoiceService.kt`, SHERI_VOICE_SERVICE_KT);
writeFileSafe(`${kotlinBase}/speech/VoskSpeechManager.kt`, VOSK_SPEECH_MANAGER_KT);
writeFileSafe(`${kotlinBase}/llm/LocalLlmManager.kt`, LOCAL_LLM_MANAGER_KT);
writeFileSafe(`${kotlinBase}/tts/TtsSpeechHelper.kt`, TTS_SPEECH_HELPER_KT);
writeFileSafe(`${kotlinBase}/router/IntentRouter.kt`, INTENT_ROUTER_KT);
writeFileSafe(`${kotlinBase}/calling/ContactCallHelper.kt`, CONTACT_CALL_HELPER_KT);

// 4. Resources
writeFileSafe('./app/src/main/res/layout/activity_main.xml', ACTIVITY_MAIN_XML);
writeFileSafe('./app/src/main/res/values/colors.xml', COLORS_XML);
writeFileSafe('./app/src/main/res/values/strings.xml', STRINGS_XML);

DRAWABLES.forEach(drawable => {
  writeFileSafe(`./app/src/main/res/drawable/${drawable.name}`, drawable.content);
});

console.log('All Android project files exported successfully to workspace root!');
