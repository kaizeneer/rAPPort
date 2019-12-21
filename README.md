# Setup Guide

1. Get the latest version of Visual Studio Code: https://code.visualstudio.com/
   
2. Install "Cordova Tools" Extension inside Visual Studio Code (see: https://github.com/microsoft/vscode-cordova)
   
3. Install Java JDK 8 (required to run cordova tools!) and set the system variables:
    >a. JAVA_HOME: C:\Program Files\Java\jdk1.8.0_231
    >
    >b. PATH: ;C:\Program Files\Java\jdk1.8.0_231\bin

4. Install Android Studio to enable debugging within a device emulator and set the system variables:
    >a. ANDROID_SDK_ROOT: C:\Users\<user>\AppData\Local\Android\Sdk
    >
    >b. PATH: ;C:\Users\<user>\AppData\Local\Android\Sdk\emulator;C:\Users\<user>\AppData\Local\Android\Sdk\tools

5. Install Gradle and set the system variables:
    >a. GRADLE_HOME: C:\Program Files\Gradle\gradle-6.0.1\bin
    >
    >b. PATH: ;C:\Program Files\Gradle\gradle-6.0.1\bin

6. Restart Visual Studio Code to load the environment variables set above.

7. Install cordova and all required node modules:
    ```   
    npm install -g cordova
    npm install
    ```

8. Add the platforms that you would like to build for:
    ```    
    cordova platform add android
    cordova platform add browser
    ```

9.  Open a Terminal inside Visual Studio Code and install Plugins Updater:
    ```
    npm install -g cordova-check-plugins
    cordova-check-plugins --update=auto
    ```

10. Open a Terminal inside Visual Studio Code, generate an APK and deploy it on your Android device:
    ```
    cordova build android
    ```

11. If everything is running smoothly, commit your changes and create a Pull Request :-)