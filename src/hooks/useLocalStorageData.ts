import { useState, useEffect, useCallback } from 'react';

export function useLocalStorageData<T>(key: string, initialValue: T, dateString?: string): [T, (value: T | ((prev: T) => T)) => void, boolean, boolean] {
  const [data, setData] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [docExists, setDocExists] = useState(false);

  useEffect(() => {
    const storageKey = dateString ? `dashboard_${dateString}_${key}` : `dashboard_global_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        setData(JSON.parse(stored));
        setDocExists(true);
      } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        setData(initialValue);
        setDocExists(false);
      }
    } else {
      setData(initialValue);
      setDocExists(false);
    }
    setIsInitialized(true);
  }, [key, dateString]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    setData((prev) => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      const storageKey = dateString ? `dashboard_${dateString}_${key}` : `dashboard_global_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      return valueToStore;
    });
  }, [key, dateString]);

  return [data, updateData, isInitialized, docExists];
}
