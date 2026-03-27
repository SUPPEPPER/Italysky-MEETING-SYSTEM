import { useState, useEffect, useCallback } from 'react';
import { db } from '../cloudbase';

// Global state to track if we've shown the error banner
let hasShownDbError = false;
let dbErrorCallback: ((show: boolean) => void) | null = null;

export const setDbErrorCallback = (cb: (show: boolean) => void) => {
  dbErrorCallback = cb;
};

export function useCloudBaseData<T>(
  key: string,
  initialValue: T,
  userId?: string,
  dateString?: string
): [T, (value: T | ((prev: T) => T)) => void, boolean, boolean] {
  const [data, setData] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [docExists, setDocExists] = useState(false);

  useEffect(() => {
    if (!userId) {
      setData(initialValue);
      setIsInitialized(true);
      return;
    }

    const docId = dateString ? `dashboard_${userId}_${dateString}_${key}` : `dashboard_global_${userId}_${key}`;
    const collectionName = 'dashboard_data';

    const docRef = db.collection(collectionName).doc(docId);
    
    docRef.get().then((res: any) => {
      if (res.data && res.data.length > 0) {
        setData(res.data[0].value ?? initialValue);
        setDocExists(true);
      } else {
        setData(initialValue);
        setDocExists(false);
      }
      setIsInitialized(true);
    }).catch((err: any) => {
      console.error(`Failed to fetch ${key} from CloudBase.`, err);
      if (err.message === 'network request error') {
        if (!hasShownDbError && dbErrorCallback) {
          hasShownDbError = true;
          dbErrorCallback(true);
        }
        console.error(`
[CloudBase Database Error] "network request error" usually means:
1. The VITE_TCB_REGION in your .env file is incorrect (default is ap-shanghai, but yours might be ap-guangzhou, ap-beijing, etc.).
2. The Database service is not enabled in your CloudBase environment.
3. Your web domain (e.g., localhost:3000) is not added to the "Web Security Domains" (安全应用来源) in the CloudBase console.
        `);
      }
      setData(initialValue);
      setDocExists(false);
      setIsInitialized(true);
    });

  }, [key, dateString, userId]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    if (!userId) return;

    setData((prev) => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      const docId = dateString ? `dashboard_${userId}_${dateString}_${key}` : `dashboard_global_${userId}_${key}`;
      const collectionName = 'dashboard_data';
      
      const docRef = db.collection(collectionName).doc(docId);
      
      docRef.get().then((res: any) => {
        if (res.data && res.data.length > 0) {
          docRef.update({ value: valueToStore }).catch(console.error);
        } else {
          docRef.set({ value: valueToStore }).catch(console.error);
        }
      }).catch(console.error);

      return valueToStore;
    });
  }, [key, dateString, userId]);

  return [data, updateData, isInitialized, docExists];
}
