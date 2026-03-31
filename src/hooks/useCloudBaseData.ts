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

    // 使用固定的前缀 shared_ 代替 userId，这样所有人看到的数据都是一样的
    const docId = dateString ? `dashboard_shared_${dateString}_${key}` : `dashboard_shared_global_${key}`;
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
      // Only show error if it's a real network error and we haven't shown it yet
      if (err.message === 'network request error' || err.code === 'NETWORK_ERROR') {
        console.error(`Failed to fetch ${key} from CloudBase.`, err);
        if (!hasShownDbError && dbErrorCallback) {
          hasShownDbError = true;
          dbErrorCallback(true);
          // Auto-hide after 10 seconds to avoid annoying the user if it's transient
          setTimeout(() => {
            if (dbErrorCallback) dbErrorCallback(false);
          }, 10000);
        }
      }
      setData(initialValue);
      setDocExists(false);
      setIsInitialized(true);
    });

  }, [key, dateString, userId, initialValue]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    if (!userId) return;

    setData((prev) => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      const docId = dateString ? `dashboard_shared_${dateString}_${key}` : `dashboard_shared_global_${key}`;
      const collectionName = 'dashboard_data';
      
      const docRef = db.collection(collectionName).doc(docId);
      
      docRef.get().then((res: any) => {
        if (res.data && res.data.length > 0) {
          docRef.update({ value: valueToStore })
            .then(() => setDocExists(true))
            .catch(console.error);
        } else {
          docRef.set({ value: valueToStore })
            .then(() => setDocExists(true))
            .catch(console.error);
        }
      }).catch(console.error);

      return valueToStore;
    });
  }, [key, dateString, userId]);

  return [data, updateData, isInitialized, docExists];
}
