import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

export function useFirestoreData<T>(key: string, initialValue: T, userId: string | undefined, dateString?: string) {
  const [data, setData] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsInitialized(false);
      return;
    }

    const docId = dateString ? `dashboard_${dateString}` : 'dashboard';
    const docRef = doc(db, 'shared', docId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const docData = docSnap.data();
        if (docData[key] !== undefined) {
          try {
            setData(JSON.parse(docData[key]));
          } catch (e) {
            console.error(`Failed to parse ${key} from Firestore`, e);
          }
        } else {
          setData(initialValue);
        }
      } else {
        setData(initialValue);
      }
      setIsInitialized(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `shared/${docId}`);
    });

    return () => unsubscribe();
  }, [key, userId, dateString]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    setData((prev) => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      
      if (userId) {
        const docId = dateString ? `dashboard_${dateString}` : 'dashboard';
        const docRef = doc(db, 'shared', docId);
        setDoc(docRef, {
          uid: userId,
          [key]: JSON.stringify(valueToStore),
          updatedAt: new Date()
        }, { merge: true }).catch(error => {
          handleFirestoreError(error, OperationType.WRITE, `shared/${docId}`);
        });
      }
      
      return valueToStore;
    });
  }, [key, userId, dateString]);

  return [data, updateData, isInitialized] as const;
}
