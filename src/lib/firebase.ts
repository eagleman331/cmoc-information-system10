import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Error Handling Spec for Firestore Operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection
async function testConnection() {
  try {
    console.log("Testing Firestore connection...");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("Database ID:", firebaseConfig.firestoreDatabaseId);
    
    // Use getDocFromServer to bypass cache and force a network request
    const testDoc = doc(db, 'test', 'connection');
    await getDocFromServer(testDoc);
    console.log("Firestore connection successful.");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('unavailable')) {
        console.error("Firestore backend is unreachable. This may be due to a network issue, an incorrect configuration, or the database not being fully provisioned.");
        console.error("If this persists, try re-provisioning Firebase in the Settings menu or check your internet connection.");
      } else if (error.message.includes('permission-denied')) {
        console.error("Firestore permission denied. Check your security rules.");
      }
    }
  }
}
testConnection();

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    console.log(`Attempting to upload file: ${file.name} to path: ${path}`);
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    console.log(`Storage reference created: ${storageRef.fullPath}`);
    
    const uploadTask = await uploadBytes(storageRef, file);
    console.log('Upload successful, getting download URL...');
    
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(`Download URL obtained: ${downloadUrl}`);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const moveFile = async (sourceUrl: string, destinationPath: string): Promise<string> => {
  try {
    if (!sourceUrl || !sourceUrl.includes('firebasestorage.googleapis.com')) {
      return sourceUrl;
    }

    // 1. Get the blob from the source URL
    const response = await fetch(sourceUrl);
    const blob = await response.blob();
    
    // 2. Create destination reference
    const destinationRef = ref(storage, destinationPath);
    
    // 3. Upload to new location
    await uploadBytes(destinationRef, blob);
    const newUrl = await getDownloadURL(destinationRef);
    
    // 4. Delete the old file
    const sourceRef = ref(storage, sourceUrl);
    await deleteObject(sourceRef);
    
    return newUrl;
  } catch (error) {
    console.error('Error in moveFile:', error);
    return sourceUrl;
  }
};

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
export type { FirebaseUser };
