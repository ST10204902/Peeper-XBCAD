import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, ref, get, set, update, remove, Database } from "firebase/database";

import { firebaseConfig } from "../firebase/firebaseConfig";

export class DatabaseUtility {
  private static app: FirebaseApp;
  private static database: Database | null = null;

  static initialize() {
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
    } else {
      this.app = initializeApp(firebaseConfig);
    }
    this.database = getDatabase(this.app);
  }

  static getRef(path: string) {
    if (this.database === null) {
      this.initialize();
    }
    return ref(this.database!, path);
  }

  static async getData<T>(path: string): Promise<T | null> {
    try {
      const snapshot = await get(this.getRef(path));
      return snapshot.exists() ? (snapshot.val() as T) : null;
    } catch (error) {
      console.error(`Error fetching data from ${path}:`, error);
      return null;
    }
  }

  static async getAllData<T>(path: string): Promise<T[]> {
    try {
      const snapshot = await get(this.getRef(path));
      const data: T[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          data.push(childSnapshot.val());
        });
      }
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${path}:`, error);
      return [];
    }
  }

  static async setData<T>(path: string, data: T): Promise<void> {
    try {
      await set(this.getRef(path), data);
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error);
      throw error;
    }
  }

  static async updateData<T>(path: string, data: Partial<T>): Promise<void> {
    try {
      await update(this.getRef(path), data);
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error);
      throw error;
    }
  }

  static async deleteData(path: string): Promise<void> {
    try {
      await remove(this.getRef(path));
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error);
      throw error;
    }
  }

  /**
   * Generates a cryptographically secure UUID v4
   * Using bitwise operations is necessary for UUID v4 specification
   * @returns A UUID v4 string
   */
  /* eslint-disable no-bitwise */
  static generateUniqueId(): string {
    // Create a Uint8Array of 16 bytes (128 bits)
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Convert to UUID format
    return Array.from(bytes)
      .map((b, i) => {
        // Insert hyphens at positions 4, 6, 8, and 10
        const hyphen = i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "";
        // Handle version 4 UUID requirements
        if (i === 6) {
          return hyphen + ((b & 0x0f) | 0x40).toString(16);
        }
        if (i === 8) {
          return hyphen + ((b & 0x3f) | 0x80).toString(16);
        }
        return hyphen + b.toString(16).padStart(2, "0");
      })
      .join("");
  }
  /* eslint-enable no-bitwise */
}
