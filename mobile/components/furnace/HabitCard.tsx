import { View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import clsx from 'clsx';

interface HabitCardProps {
    id: string;
    label: string;
    iconName?: string;
    completed: boolean;
    onClick: () => void;
    streak: number;
}

export function HabitCard({ label, iconName, completed, onClick, streak }: HabitCardProps) {
    const IconComponent = (iconName ? (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] : null) as LucideIcon | null;
    // Fallback icon if not found or mapped efficiently
    const DisplayIcon = IconComponent || Icons.Activity;

    return (
        <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.7}
            className={clsx(
                "flex-1 m-1 p-4 rounded-2xl border items-center justify-center space-y-3 min-h-[120px]",
                completed
                    ? "bg-furnace-primary border-furnace-primary"
                    : "bg-furnace-secondary/50 border-furnace-primary/20"
            )}
        >
            <View className={clsx(
                "w-10 h-10 rounded-full items-center justify-center",
                completed ? "bg-white/20" : "bg-furnace-secondary border border-furnace-primary/20"
            )}>
                <DisplayIcon
                    size={20}
                    color={completed ? "white" : "#FF5500"}
                />
            </View>

            <View className="items-center">
                <Text className={clsx(
                    "font-inter font-medium text-center text-xs mb-1",
                    completed ? "text-white" : "text-gray-400"
                )}>
                    {label}
                </Text>

                {streak > 0 && (
                    <Text className={clsx(
                        "text-[10px] font-mono",
                        completed ? "text-white/80" : "text-furnace-primary"
                    )}>
                        {streak}d
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
