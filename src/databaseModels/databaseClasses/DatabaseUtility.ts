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

  static generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }

  /**
 * Calculate the distance between two latitude and longitude coordinates using the Haversine formula.
 * @param lat1 - The latitude of the first point.
 * @param lon1 - The longitude of the first point.
 * @param lat2 - The latitude of the second point.
 * @param lon2 - The longitude of the second point.
 * @returns Distance in kilometers between the two points.
 */
 static haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};

}
