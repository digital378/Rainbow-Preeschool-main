import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is missing. Please check environment variables.');
    }
    app = initializeApp(firebaseConfig);
  }
  return app;
}

function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export async function initRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
    }
    recaptchaVerifier = null;
  }
  
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container ${containerId} not found`);
  }
  
  const firebaseAuth = getFirebaseAuth();
  
  recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, container, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
  
  await recaptchaVerifier.render();
  
  return recaptchaVerifier;
}

export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber.replace(/^0+/, '')}`;
  
  if (!recaptchaVerifier) {
    throw new Error('reCAPTCHA not initialized');
  }
  
  const firebaseAuth = getFirebaseAuth();
  const confirmationResult = await signInWithPhoneNumber(firebaseAuth, formattedPhone, recaptchaVerifier);
  return confirmationResult;
}

export async function verifyOTP(confirmationResult: ConfirmationResult, otp: string): Promise<boolean> {
  try {
    await confirmationResult.confirm(otp);
    return true;
  } catch (error) {
    console.error('OTP verification failed:', error);
    return false;
  }
}

export function resetRecaptcha() {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
    }
    recaptchaVerifier = null;
  }
}
