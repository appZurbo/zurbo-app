import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Check if we're running on a native platform
export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

// Check if we're running on iOS
export const isIOS = () => {
  return Capacitor.getPlatform() === 'ios';
};

// Check if we're running on Android
export const isAndroid = () => {
  return Capacitor.getPlatform() === 'android';
};

// Initialize Capacitor plugins
export const initializeCapacitor = async () => {
  if (!isNativePlatform()) return;

  try {
    // Configure Status Bar
    await StatusBar.setStyle({
      style: Style.Dark
    });

    await StatusBar.setBackgroundColor({
      color: '#ea580c'
    });

    await StatusBar.setOverlaysWebView({
      overlay: false
    });

    // Hide splash screen after initialization
    await SplashScreen.hide();

    console.log('Capacitor plugins initialized');
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};

// Show splash screen
export const showSplashScreen = async () => {
  if (!isNativePlatform()) return;
  
  try {
    await SplashScreen.show({
      showDuration: 2000,
      fadeInDuration: 300,
      fadeOutDuration: 300,
      autoHide: true
    });
  } catch (error) {
    console.error('Error showing splash screen:', error);
  }
};

// Hide splash screen
export const hideSplashScreen = async () => {
  if (!isNativePlatform()) return;
  
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
};

// Update status bar style based on theme
export const updateStatusBarTheme = async (isDark: boolean) => {
  if (!isNativePlatform()) return;

  try {
    await StatusBar.setStyle({
      style: isDark ? Style.Light : Style.Dark
    });
  } catch (error) {
    console.error('Error updating status bar theme:', error);
  }
};