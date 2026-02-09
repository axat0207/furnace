import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Dynamically determine the host API URL
const getBaseUrl = () => {
    // If we have a hostUri (e.g. from Expo Go), use the IP from there
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:3000`;
    }

    // Fallback for simulators if hostUri isn't available
    return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();

export const api = {
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${BASE_URL}/api${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`API GET Error ${endpoint}:`, error);
            throw error;
        }
    },
    post: async (endpoint: string, body: any) => {
        try {
            const response = await fetch(`${BASE_URL}/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return await response.json();
        } catch (error) {
            console.error(`API POST Error ${endpoint}:`, error);
            throw error;
        }
    }
}
