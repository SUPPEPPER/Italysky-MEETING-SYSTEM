import { useState, useEffect, useCallback, useRef } from 'react';
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
    let isMounted = true;
    setIsInitialized(false);
    setDocExists(false);

    if (!userId) {
      setData(initialValue);
      setIsInitialized(true);
      return;
    }

    const docId = dateString ? `dashboard_shared_${dateString}_${key}` : `dashboard_shared_global_${key}`;
    const collectionName = 'dashboard_data';

    const docRef = db.collection(collectionName).doc(docId);
    
    docRef.get().then((res: any) => {
      if (!isMounted) return;
      const data = res.data;
      if (data) {
        const value = Array.isArray(data) ? (data.length > 0 ? data[0].value : null) : data.value;
        if (value !== undefined && value !== null) {
          setData(value);
          setDocExists(true);
        } else {
          setData(initialValue);
          setDocExists(false);
        }
      } else {
        setData(initialValue);
        setDocExists(false);
      }
      setIsInitialized(true);
    }).catch((err: any) => {
      if (!isMounted) return;
      if (err.message === 'network request error' || err.code === 'NETWORK_ERROR') {
        console.error(`Failed to fetch ${key} from CloudBase.`, err);
        if (!hasShownDbError && dbErrorCallback) {
          hasShownDbError = true;
          dbErrorCallback(true);
          setTimeout(() => {
            if (dbErrorCallback) dbErrorCallback(false);
          }, 10000);
        }
      }
      setData(initialValue);
      setDocExists(false);
      setIsInitialized(true);
    });

    return () => {
      isMounted = false;
    };
  }, [key, dateString, userId, initialValue]);

  const dataRef = useRef<T>(initialValue);
  
  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    if (!userId) return;

    // Set docExists to true immediately to prevent carry-over logic from re-triggering
    setDocExists(true);

    const finalValue = newValue instanceof Function ? newValue(dataRef.current) : newValue;
    
    // Update local state
    setData(finalValue);
    dataRef.current = finalValue;

    // Side effect: update CloudBase
    const docId = dateString ? `dashboard_shared_${dateString}_${key}` : `dashboard_shared_global_${key}`;
    const docRef = db.collection('dashboard_data').doc(docId);
    
    docRef.set({ value: finalValue })
      .then(() => console.log(`[CloudBase] Successfully saved ${key} for ${dateString || 'global'}`))
      .catch(err => console.error(`[CloudBase] Error saving ${key}:`, err));
  }, [key, dateString, userId]);

  return [data, updateData, isInitialized, docExists];
}
