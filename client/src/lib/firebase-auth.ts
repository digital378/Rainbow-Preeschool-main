import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let recaptchaVerifier: RecaptchaVerifier | null = null;

export async function initRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      // Ignore clear errors
    }
    recaptchaVerifier = null;
  }
  
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container ${containerId} not found`);
  }
  
  // Firebase v9+ modular API: new RecaptchaVerifier(auth, container, options)
  recaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
  
  // Render the reCAPTCHA widget
  await recaptchaVerifier.render();
  
  return recaptchaVerifier;
}

export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber.replace(/^0+/, '')}`;
  
  if (!recaptchaVerifier) {
    throw new Error('reCAPTCHA not initialized');
  }
  
  const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
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
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
}
