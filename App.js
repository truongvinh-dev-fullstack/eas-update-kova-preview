// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import App from "./app/app.tsx"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

let RootComponent = App
if (__DEV__ && SHOW_STORYBOOK) {
  // Only include Storybook if we're in dev mode
  const { StorybookUIRoot } = require("./storybook")
  const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');
  RootComponent = StorybookUIRoot
}
// import { LogBox } from 'react-native';

// // Ignore log notification by message
// LogBox.ignoreLogs(['Warning: ...']);

// //Ignore all log notifications
// LogBox.ignoreAllLogs();

export default RootComponent
