import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearningScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
            <Text className="text-white font-inter">Learning Coming Soon</Text>
        </SafeAreaView>
    );
}
