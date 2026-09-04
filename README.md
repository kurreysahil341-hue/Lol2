# Dukaan Maths 📱

An Android application architecture template optimized for high-performance math utilities and calculations, built using **Kotlin**, **Jetpack Compose (Material 3)**, and robust software engineering guidelines.

---

## 🛠️ Project Specifications

- **Package Name**: `com.dukaan.maths`
- **Language**: Kotlin with Kotlin DSL (`.gradle.kts`)
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **UI Toolkit**: Jetpack Compose & Material 3

### Core Architecture & Libraries
- **Dependency Injection**: Dagger Hilt (`hilt-android`) with Navigation integration.
- **Local Database**: Room DB for local data persistence with Kotlin Symbol Processing (`KSP`).
- **Asynchronous Flow**: Kotlin Coroutines & Lifecycle components.
- **Navigation**: Type-safe Jetpack Navigation Compose.

---

## 📂 Project Structure

```text
DukaanMaths/
│
├── .github/
│   └── workflows/
│       ├── build.yml          # Push & PR build checks (CI)
│       └── release.yml        # Automates APK releases on Tag push (CD)
│
├── app/
│   ├── build.gradle.kts       # Module build configuration & dependencies
│   └── proguard-rules.pro     # Obfuscation guidelines for Room, Coroutines, Hilt
│
├── build.gradle.kts           # Top-level global plugins coordinator
├── settings.gradle.kts         # Multi-project structure configurations
├── gradle.properties          # JVM memory limit, AndroidX & Jetifier enablers
└── .gitignore                 # Pre-configured rules for standard Android development
```

---

## 🔑 Keystore Configuration Instructions

To sign your release APKs for production deployment (Google Play Store or private distribution), you must generate a Keystore file. Follow these simple steps.

### 1. Locally Generate the Keystore File

Open your terminal and run the following keytool utility command:

```bash
keytool -genkey -v -keystore dukaan-maths.jks -keyalg RSA -keysize 2048 -validity 10000 -alias dukaan_maths_alias
```

- **`-keystore dukaan-maths.jks`**: Specifies the name of the Keystore file to create.
- **`-alias dukaan_maths_alias`**: Represents the entry identifier you will reference during compilation.
- **`-validity 10000`**: Sets the certificate validity in days (~27 years).

Make sure to remember and secure your **Keystore Password** and **Key Password**.

---

### 2. Configure Local Build Signing (Optional)

Add your credentials inside your local `app/build.gradle.kts` file (never commit your actual passwords to a public repository):

```kotlin
android {
    ...
    signingConfigs {
        create("release") {
            storeFile = file("../dukaan-maths.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "your_store_password"
            keyAlias = System.getenv("KEY_ALIAS") ?: "dukaan_maths_alias"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "your_key_password"
        }
    }
    
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            ...
        }
    }
}
```

---

### 3. Setting Up GitHub Actions for Release Signing

For automatic release pipeline signing, encrypt your keystore and define it as secret variables within GitHub.

#### Step A: Convert Keystore to Base64
Run the following command to encode your `.jks` file to a Base64 string:

```bash
# On Linux/macOS
openssl base64 -in dukaan-maths.jks -out keystore-base64.txt

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("dukaan-maths.jks")) > keystore-base64.txt
```

#### Step B: Add GitHub Repository Secrets
Go to your **GitHub Repository ➔ Settings ➔ Secrets and variables ➔ Actions** and click **New repository secret** to add the following variables:

1. **`SIGNING_KEY`**: Paste the entire contents of `keystore-base64.txt`.
2. **`ALIAS`**: Set to your key alias (e.g., `dukaan_maths_alias`).
3. **`KEY_STORE_PASSWORD`**: Set to your Keystore file password.
4. **`KEY_PASSWORD`**: Set to your key entry password.
