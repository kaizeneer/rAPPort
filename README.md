# Setup Guide for Contributors

The following steps will help you setting up your development environment.

1. Download and install the LTS version of Node.js: https://nodejs.org/

2. Download and install the latest version of git: https://git-scm.com/

3. Switch to a directory you want to clone the git repo to, open a PowerShell and type in the following command:

    ```
    git clone https://github.com/kaizeneer/rAPPort.git
    ```

4. Download and install the latest version of Visual Studio Code: https://code.visualstudio.com/

5. Open Visual Studio Code and open the folder with the cloned git repository

6. Install "Cordova Tools" (Microsoft) extension inside Visual Studio Code (see: https://github.com/microsoft/vscode-cordova)
   
7. Download and install Java JDK 8 (required to run Cordova Tools!) and set the Environment Variables: https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
   
    >a. create new system variable JAVA_HOME: C:\Program Files\Java\jdk1.8.0_231
    >
    >b. append to PATH: C:\Program Files\Java\jdk1.8.0_231\bin

8. Download and install Android Studio. Run it and ensure to install the Android SDK Platform 28 (= Android 9) and a device emulator! Then set the Environment Variables: https://developer.android.com/studio/
   
    >a. create new system variable ANDROID_SDK_ROOT: C:\Users\<user>\AppData\Local\Android\Sdk
    >
    >b. append to PATH: C:\Users\<user>\AppData\Local\Android\Sdk\emulator;C:\Users\<user>\AppData\Local\Android\Sdk\tools

9.  Download Gradle, unzip it into "C:\Program Files\Gradle" and set the Environment Variables: https://gradle.org/releases/
   
    >a. create new system variable GRADLE_HOME: C:\Program Files\Gradle\gradle-6.0.1\bin
    >
    >b. append to PATH: C:\Program Files\Gradle\gradle-6.0.1\bin

10.  Restart Visual Studio Code to load the Environment Variables set above.

11. Open a new terminal inside Visual Studio Code and install cordova and all required node modules:
   
    ```   
    npm install -g cordova
    npm install
    ```

12. Add the platforms that you would like to build for using the open terminal in Visual Studio Code:
   
    ```    
    cordova platform add android
    cordova platform add browser
    ```

13. Open a Terminal inside Visual Studio Code, generate an APK and deploy it on your Android device:
    
    ```
    cordova build android
    ```

14. Alternatively you may also use the debugger tools, e.g. "Run Android on device" or "Simulate Android in browser" (requires Google Chrome: https://www.google.com/chrome/). Just accept the offer of Visual Studio Code and add a lauch.json and you are ready to go!

15. If everything is running smoothly, commit your changes and create a Pull Request :-)