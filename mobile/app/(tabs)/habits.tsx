import { View, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FURNACE_HABITS } from '../../constants/furnace';
import { HabitCard } from '../../components/furnace/HabitCard';
import { useState } from 'react';

export default function HabitsScreen() {
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    const [streaks, setStreaks] = useState<Record<string, number>>({});

    const handleToggle = (id: string) => {
        setCompletedHabits(prev =>
            prev.includes(id)
                ? prev.filter(h => h !== id)
                : [...prev, id]
        );
        // TODO: Call API to toggle habit
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
            <View className="px-4 pt-4 pb-2">
                <Text className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Text className="text-furnace-primary">|</Text> Daily Protocol
                </Text>
            </View>

            <FlatList
                data={FURNACE_HABITS}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <HabitCard
                        id={item.id}
                        label={item.label}
                        iconName={item.icon} // Mapping string to icon component inside card
                        completed={completedHabits.includes(item.id)}
                        onClick={() => handleToggle(item.id)}
                        streak={streaks[item.id] || 0}
                    />
                )}
            />
        </SafeAreaView>
    );
}
