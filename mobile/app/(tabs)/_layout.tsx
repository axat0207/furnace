import { Tabs } from "expo-router";
import { Home, CheckSquare, BookOpen, Wallet } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0F0F0F",
                    borderTopColor: "rgba(255, 85, 0, 0.2)",
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: "#FF5500",
                tabBarInactiveTintColor: "#52525b",
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontFamily: "InterMedium",
                    fontSize: 10,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Bridge",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="habits"
                options={{
                    title: "Habits",
                    tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="learning"
                options={{
                    title: "Learning",
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="money"
                options={{
                    title: "Money",
                    tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
