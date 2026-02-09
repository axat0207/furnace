import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Orbitron_900Black,
} from "@expo-google-fonts/orbitron";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [loaded, error] = useFonts({
        Inter: Inter_400Regular,
        InterMedium: Inter_500Medium,
        InterSemiBold: Inter_600SemiBold,
        InterBold: Inter_700Bold,
        Orbitron: Orbitron_400Regular,
        OrbitronMedium: Orbitron_500Medium,
        OrbitronBold: Orbitron_700Bold,
        OrbitronBlack: Orbitron_900Black,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View className="flex-1 bg-background">
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#050505" },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}
