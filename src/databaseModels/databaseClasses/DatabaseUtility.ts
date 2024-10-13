import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  Database,
} from "firebase/database";

import { firebaseConfig } from "../../firebase/firebaseConfig";

export class DatabaseUtility {
  private static app: FirebaseApp;
  private static database: Database;

  static initialize() {
    if (!getApps().length) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    this.database = getDatabase(this.app);
  }

  static getRef(path: string) {
    if (!this.database) {
      this.initialize();
    }
    return ref(this.database, path);
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
        snapshot.forEach((childSnapshot) => {
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
}
