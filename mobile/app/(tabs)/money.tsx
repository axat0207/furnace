import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Split, PieChart, Plus, DollarSign } from 'lucide-react-native';
import { Link } from 'expo-router';

// Mock data for UI development
const MOCK_TRANSACTIONS = [
    { id: '1', date: '2024-02-02', amount: 500, type: 'EXPENSE', category: { name: 'Food', color: '#F59E0B' }, description: 'Lunch' },
    { id: '2', date: '2024-02-01', amount: 1500, type: 'EXPENSE', category: { name: 'Transport', color: '#3B82F6' }, description: 'Uber' },
    { id: '3', date: '2024-01-31', amount: 50000, type: 'INCOME', category: { name: 'Salary', color: '#10B981' }, description: 'January Salary' },
];

export default function MoneyScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header / Nav */}
                <View className="flex-row items-center justify-between p-4">
                    <View>
                        <Text className="text-2xl font-orbitron text-white">Money</Text>
                        <Text className="text-xs text-zinc-500 font-mono">TRACK & OPTIMIZE</Text>
                    </View>

                    <View className="flex-row gap-3">
                        <TouchableOpacity className="p-3 bg-zinc-900 rounded-2xl border border-white/5">
                            <Split size={20} color="#14b8a6" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-3 bg-zinc-900 rounded-2xl border border-white/5">
                            <PieChart size={20} color="#a1a1aa" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Add Card */}
                <View className="m-4 mt-2 p-5 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                    <Text className="text-white font-bold text-lg">Quick Add</Text>

                    <View className="space-y-3">
                        <View className="flex-row bg-black/40 border border-white/5 rounded-xl p-3 items-center">
                            <DollarSign size={16} color="#71717a" />
                            <TextInput
                                placeholder="Amount"
                                placeholderTextColor="#52525b"
                                keyboardType="numeric"
                                className="flex-1 ml-2 text-white font-mono text-lg"
                            />
                        </View>

                        <View className="flex-row bg-black/40 border border-white/5 rounded-xl p-3 items-center">
                            <TextInput
                                placeholder="Description"
                                placeholderTextColor="#52525b"
                                className="flex-1 text-white"
                            />
                        </View>

                        <TouchableOpacity className="bg-furnace-primary w-full p-4 rounded-xl items-center flex-row justify-center gap-2">
                            <Plus size={20} color="white" />
                            <Text className="text-white font-bold">Add Transaction</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* History List */}
                <View className="px-4 space-y-4">
                    <View className="flex-row items-end justify-between border-b border-white/5 pb-2">
                        <Text className="text-white font-bold text-lg">History</Text>
                        <Text className="text-furnace-primary text-xs font-bold">VIEW ALL</Text>
                    </View>

                    <View className="space-y-3">
                        {MOCK_TRANSACTIONS.map(t => (
                            <View key={t.id} className="flex-row items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-2xl">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-full items-center justify-center bg-zinc-800">
                                        <Text className="text-lg">{t.type === 'EXPENSE' ? '💸' : '💰'}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white font-medium">{t.description}</Text>
                                        <Text className="text-zinc-500 text-xs" style={{ color: t.category.color }}>{t.category.name}</Text>
                                    </View>
                                </View>
                                <Text className={`font-mono font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-white'}`}>
                                    {t.type === 'EXPENSE' ? '-' : '+'}{t.amount}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
