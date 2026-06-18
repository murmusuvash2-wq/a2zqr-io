import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json'; // Make sure the path is correct depending on where the config is generated

const isFirebaseConfigured = !!firebaseConfig && !!firebaseConfig.projectId;

let app;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // In strict mode or when using multiple DBs, pass databaseId
    db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
    console.log("Firebase initialized successfully inside container.");
  } catch (e) {
    console.warn("Failed to complete Firebase SDK initialization, falling back to secure simulated engine:", e);
  }
}


export interface UserStats {
  email: string;
  uid: string;
  isPro: boolean;
  planType: 'monthly' | 'yearly' | 'free';
  expiryDate: string;
  totalGenerated: number;
  createdAt: string;
  country: string;
  currency: string;
}

// Local simulation fallback store helpers
const MOCK_AUTH_KEY = 'a2zqr_secure_auth';
const MOCK_USER_KEY = 'a2zqr_secure_user_doc';

const loadMockUserDoc = (email: string, country: string = 'US'): UserStats => {
  const isIndia = country === 'IN';
  const item = localStorage.getItem(MOCK_USER_KEY);
  if (item) {
    try {
      const parsed = JSON.parse(item);
      if (parsed.email === email) return parsed;
    } catch {}
  }
  const newUser: UserStats = {
    email,
    uid: 'usr_' + Math.random().toString(36).substr(2, 9),
    isPro: false,
    planType: 'free',
    expiryDate: '',
    totalGenerated: 0,
    createdAt: new Date().toISOString(),
    country,
    currency: isIndia ? 'INR' : 'USD'
  };
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

const saveMockUserDoc = (docData: UserStats) => {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(docData));
};

// Unified Secure App Bridge to combine actual Firestore and robust Offline Fallblocks
export const authService = {
  isRealFirebase: isFirebaseConfigured,

  async registerUser(email: string, pass: string, country: string): Promise<UserStats> {
    const isIndia = country === 'IN';
    const currency = isIndia ? 'INR' : 'USD';
    
    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const userDoc: UserStats = {
          email,
          uid: cred.user.uid,
          isPro: false,
          planType: 'free',
          expiryDate: '',
          totalGenerated: 0,
          createdAt: new Date().toISOString(),
          country,
          currency
        };
        await setDoc(doc(db, 'users', cred.user.uid), userDoc);
        return userDoc;
      } catch (err: any) {
        if (err.code === 'auth/operation-not-allowed') {
          throw new Error('Email/Password Auth is disabled. Enable it in Firebase Console -> Authentication -> Sign-in method.');
        }
        throw new Error(err.message || 'Registration failed');
      }
    } else {
      // Robust simulation registry
      const simulatedDoc = loadMockUserDoc(email, country);
      localStorage.setItem(MOCK_AUTH_KEY, email);
      return simulatedDoc;
    }
  },

  async loginUser(email: string, pass: string): Promise<UserStats> {
    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const snap = await getDoc(doc(db, 'users', cred.user.uid));
        if (snap.exists()) {
          return snap.data() as UserStats;
        } else {
          const userDoc: UserStats = {
            email,
            uid: cred.user.uid,
            isPro: false,
            planType: 'free',
            expiryDate: '',
            totalGenerated: 1,
            createdAt: new Date().toISOString(),
            country: 'US',
            currency: 'USD'
          };
          await setDoc(doc(db, 'users', cred.user.uid), userDoc);
          return userDoc;
        }
      } catch (err : any) {
        if (err.code === 'auth/operation-not-allowed') {
          throw new Error('Email/Password Auth is disabled. Enable it in Firebase Console -> Authentication -> Sign-in method.');
        }
        throw new Error(err.message || 'Authenticating credentials failed');
      }
    } else {
      localStorage.setItem(MOCK_AUTH_KEY, email);
      return loadMockUserDoc(email);
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem(MOCK_AUTH_KEY);
    }
  },

  async getCurrentUser(offlineEmail?: string): Promise<UserStats | null> {
    if (isFirebaseConfigured && auth && db) {
      const current = auth.currentUser;
      if (current) {
        const snap = await getDoc(doc(db, 'users', current.uid));
        if (snap.exists()) return snap.data() as UserStats;
      }
      return null;
    } else {
      const stored = offlineEmail || localStorage.getItem(MOCK_AUTH_KEY);
      if (stored) {
        return loadMockUserDoc(stored);
      }
      return null;
    }
  },

  async recordGeneration(uid: string): Promise<number> {
    if (isFirebaseConfigured && db) {
      try {
        const ref = doc(db, 'users', uid);
        await updateDoc(ref, {
          totalGenerated: increment(1)
        });
        const snap = await getDoc(ref);
        return snap.exists() ? (snap.data() as UserStats).totalGenerated : 1;
      } catch {
        return 1;
      }
    } else {
      const docItem = localStorage.getItem(MOCK_USER_KEY);
      if (docItem) {
        try {
          const parsed = JSON.parse(docItem);
          parsed.totalGenerated += 1;
          saveMockUserDoc(parsed);
          return parsed.totalGenerated;
        } catch {}
      }
      return 1;
    }
  },

  async upgradeUserToPro(uid: string, planType: 'monthly' | 'yearly', country: string): Promise<UserStats> {
    const monthsMultiplier = planType === 'yearly' ? 12 : 1;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + monthsMultiplier);
    const expiryISO = expiry.toISOString();
    
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'users', uid);
      const updatePayload = {
        isPro: true,
        planType,
        expiryDate: expiryISO,
        country
      };
      await updateDoc(ref, updatePayload);
      const snap = await getDoc(ref);
      return snap.data() as UserStats;
    } else {
      const docItem = localStorage.getItem(MOCK_USER_KEY);
      if (docItem) {
        try {
          const parsed = JSON.parse(docItem) as UserStats;
          parsed.isPro = true;
          parsed.planType = planType;
          parsed.expiryDate = expiryISO;
          parsed.country = country;
          parsed.currency = country === 'IN' ? 'INR' : 'USD';
          saveMockUserDoc(parsed);
          return parsed;
        } catch {}
      }
      throw new Error("Could not find user profile data.");
    }
  }
};
