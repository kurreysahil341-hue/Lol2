import JSZip from 'jszip';
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
  THEMES_XML,
  DRAWABLES,
  BUILD_GRADLE_KTS,
  SETUP_GUIDE_MD,
  BUILD_APK_YML
} from '../data/androidFiles';

export const ROOT_BUILD_GRADLE_KTS = `// Root build.gradle.kts
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.4.1")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24")
    }
}

plugins {
    id("com.android.application") version "8.4.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.layout.buildDirectory)
}
`;

export const SETTINGS_GRADLE_KTS = `// settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://alphacephei.com/maven/") }
    }
}

rootProject.name = "HeySheri"
include(":app")
`;

export const GRADLE_PROPERTIES = `# gradle.properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
`;

export const GRADLE_WRAPPER_PROPERTIES = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

export const GITIGNORE = `# .gitignore
*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
*.apk
*.aab
`;

export async function downloadAndroidProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  try {
    if (onProgress) onProgress(30);
    const response = await fetch('/HeySheri-Android-Native-Project.zip');
    if (response.ok) {
      if (onProgress) onProgress(80);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'HeySheri-Android-Native-Project.zip';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      if (onProgress) onProgress(100);
      return;
    }
  } catch (e) {
    console.warn('Direct zip fetch failed, falling back to dynamic generator', e);
  }

  const zip = new JSZip();

  // 1. Root Gradle & Project configs
  zip.file('build.gradle.kts', ROOT_BUILD_GRADLE_KTS);
  zip.file('settings.gradle.kts', SETTINGS_GRADLE_KTS);
  zip.file('gradle.properties', GRADLE_PROPERTIES);
  zip.file('.gitignore', GITIGNORE);
  zip.file('README.md', SETUP_GUIDE_MD);

  // Gradle Wrapper
  const wrapperFolder = zip.folder('gradle')?.folder('wrapper');
  wrapperFolder?.file('gradle-wrapper.properties', GRADLE_WRAPPER_PROPERTIES);

  // 2. GitHub Actions Workflow
  const githubWorkflows = zip.folder('.github')?.folder('workflows');
  githubWorkflows?.file('main.yml', BUILD_APK_YML);

  // 3. App Module
  const appFolder = zip.folder('app');
  appFolder?.file('build.gradle.kts', BUILD_GRADLE_KTS);

  // 4. App Manifest & Source
  const mainFolder = appFolder?.folder('src')?.folder('main');
  mainFolder?.file('AndroidManifest.xml', ANDROID_MANIFEST_XML);

  // 5. Kotlin Sources
  const kotlinBase = mainFolder?.folder('java')?.folder('com')?.folder('heysheri')?.folder('assistant');
  kotlinBase?.file('MainActivity.kt', MAIN_ACTIVITY_KT);

  const speechFolder = kotlinBase?.folder('speech');
  speechFolder?.file('SheriVoiceService.kt', SHERI_VOICE_SERVICE_KT);
  speechFolder?.file('VoskSpeechManager.kt', VOSK_SPEECH_MANAGER_KT);

  const llmFolder = kotlinBase?.folder('llm');
  llmFolder?.file('LocalLlmManager.kt', LOCAL_LLM_MANAGER_KT);

  const ttsFolder = kotlinBase?.folder('tts');
  ttsFolder?.file('TtsSpeechHelper.kt', TTS_SPEECH_HELPER_KT);

  const routerFolder = kotlinBase?.folder('router');
  routerFolder?.file('IntentRouter.kt', INTENT_ROUTER_KT);

  const callingFolder = kotlinBase?.folder('calling');
  callingFolder?.file('ContactCallHelper.kt', CONTACT_CALL_HELPER_KT);

  // 6. Resources (layout, values, drawables)
  const resFolder = mainFolder?.folder('res');
  resFolder?.folder('layout')?.file('activity_main.xml', ACTIVITY_MAIN_XML);
  resFolder?.folder('values')?.file('colors.xml', COLORS_XML);
  resFolder?.folder('values')?.file('strings.xml', STRINGS_XML);
  resFolder?.folder('values')?.file('themes.xml', THEMES_XML);

  const drawableFolder = resFolder?.folder('drawable');
  DRAWABLES.forEach(drawable => {
    drawableFolder?.file(drawable.name, drawable.content);
  });

  // 7. Assets placeholder directory
  mainFolder?.folder('assets')?.file('README.txt', 'Place unpacked Vosk model (model-en-us) and Gemma 2B model here if pre-bundling.');

  // Generate ZIP
  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger browser download
  const url = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'HeySheri-Android-Native-Project.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
