import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, MessageSquare, Wallet, Target, TrendingUp, Bot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';

export default function BridgeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <View className="flex-row items-center gap-3">
                        <LinearGradient
                            colors={['#FF5500', '#EF4444']}
                            className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-furnace-primary/40"
                        >
                            <Flame size={28} color="white" fill="white" />
                        </LinearGradient>
                        <View>
                            <Text className="font-orbitron font-black text-2xl text-white tracking-tighter">FURNACE</Text>
                            <Text className="text-[10px] text-furnace-primary font-mono tracking-[0.2em] uppercase">OS v3.0 Mobile</Text>
                        </View>
                    </View>

                    {/* AI Coach Trigger (Small) */}
                    <TouchableOpacity className="bg-furnace-secondary border border-furnace-primary/30 p-2 rounded-full">
                        <Bot size={20} color="#FF5500" />
                    </TouchableOpacity>
                </View>

                {/* Modules Grid */}
                <View className="flex-row gap-4 mb-8">
                    {/* Speech Dojo Card */}
                    <TouchableOpacity
                        className="flex-1 bg-zinc-900 border border-indigo-500/30 rounded-3xl overflow-hidden h-40 relative p-4 justify-end active:scale-95 transition-transform"
                        onPress={() => router.push('/learning')}
                    >
                        <LinearGradient
                            colors={['rgba(79, 70, 229, 0.1)', 'transparent']}
                            className="absolute inset-0"
                        />
                        <MessageSquare size={48} color="rgba(99, 102, 241, 0.2)" style={{ position: 'absolute', top: 10, right: 10 }} />
                        <Text className="text-white font-bold text-lg leading-none mb-1">Speech Dojo</Text>
                        <Text className="text-zinc-500 text-xs">Master your comms</Text>
                    </TouchableOpacity>

                    {/* Money Manager Card */}
                    <TouchableOpacity
                        className="flex-1 bg-zinc-900 border border-emerald-500/30 rounded-3xl overflow-hidden h-40 relative p-4 justify-end active:scale-95 transition-transform"
                        onPress={() => router.push('/money')}
                    >
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.1)', 'transparent']}
                            className="absolute inset-0"
                        />
                        <Wallet size={48} color="rgba(16, 185, 129, 0.2)" style={{ position: 'absolute', top: 10, right: 10 }} />
                        <Text className="text-white font-bold text-lg leading-none mb-1">Money</Text>
                        <Text className="text-zinc-500 text-xs">Track expenses</Text>
                    </TouchableOpacity>
                </View>

                {/* Analytics Section */}
                <Text className="text-white font-bold text-lg mb-4 flex-row items-center">
                    <TrendingUp size={18} color="#FF5500" />  Analytics
                </Text>

                <View className="flex-row gap-3 overflow-visible">
                    {/* Daily Completion */}
                    <View className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-zinc-500 text-xs font-medium">Daily</Text>
                            <Target size={14} color="#FF5500" />
                        </View>
                        <Text className="text-2xl font-bold text-white">0%</Text>
                        <View className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                            <View className="h-full bg-furnace-primary w-0" />
                        </View>
                    </View>

                    {/* Streaks */}
                    <View className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-zinc-500 text-xs font-medium">Streaks</Text>
                            <Flame size={14} color="#FFD700" />
                        </View>
                        <Text className="text-2xl font-bold text-white">0</Text>
                        <Text className="text-zinc-600 text-[10px] mt-1">Total days</Text>
                    </View>

                    {/* Avg */}
                    <View className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-zinc-500 text-xs font-medium">Avg</Text>
                            <TrendingUp size={14} color="#10b981" />
                        </View>
                        <Text className="text-2xl font-bold text-white">0</Text>
                        <Text className="text-zinc-600 text-[10px] mt-1">Per habit</Text>
                    </View>
                </View>

                {/* Quick Review / Journal Area Placeholder */}
                <View className="mt-8 bg-zinc-900/30 p-6 rounded-3xl border border-dashed border-zinc-800 items-center justify-center">
                    <Text className="text-zinc-600 font-mono text-center">
                        "The fire refines."
                    </Text>
                </View>

            </ScrollView>

            {/* Floating AI Coach Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-furnace-primary rounded-full items-center justify-center shadow-lg shadow-furnace-primary/40 border-2 border-white/10"
                activeOpacity={0.8}
            >
                <Bot size={28} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
