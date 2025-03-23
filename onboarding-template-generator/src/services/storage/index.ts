// src/services/storage/index.ts
/**
 * Storage Service
 * Abstraction layer over Chrome Storage API
 */

// Define return type for getAll
type StorageData = { [key: string]: any };

export class StorageService {
  /**
   * Save data to Chrome's sync storage
   */
  static set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        // Handle errors in environments where chrome is not available (like tests)
        console.error('Storage service error:', error);
        reject(error);
      }
    });
  }

  /**
   * Get data from Chrome's sync storage
   */
  static get<T>(key: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key] as T);
          }
        });
      } catch (error) {
        // Handle errors in environments where chrome is not available
        console.error('Storage service error:', error);
        reject(error);
      }
    });
  }

  /**
   * Get multiple data items from Chrome's sync storage
   */
  static getAll(keys: string[]): Promise<StorageData | undefined> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        // Handle errors in environments where chrome is not available
        console.error('Storage service error:', error);
        reject(error);
      }
    });
  }

  /**
   * Remove data from Chrome's sync storage
   */
  static remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.remove(key, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        // Handle errors in environments where chrome is not available
        console.error('Storage service error:', error);
        reject(error);
      }
    });
  }

  /**
   * Clear all data from Chrome's sync storage
   */
  static clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        // Handle errors in environments where chrome is not available
        console.error('Storage service error:', error);
        reject(error);
      }
    });
  }
}