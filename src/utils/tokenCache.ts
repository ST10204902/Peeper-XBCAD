import * as SecureStore from 'expo-secure-store';
import {} from '@clerk/clerk-expo';

export interface TokenCache{
    getToken: (key: string) => Promise<string | undefined | null>;
    saveToken: (key: string, token: string) => Promise<void>;
    clearToken?: (key: string) => void
}

