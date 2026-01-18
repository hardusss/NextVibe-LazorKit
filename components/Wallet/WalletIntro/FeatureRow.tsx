import React, { JSX, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import createIntroStyles from '@/styles/intro.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Props for the FeatureRow component
 */
type FeatureProps = {
    /** Ionicons icon name to display on the left */
    icon: keyof typeof Ionicons.glyphMap;
    /** Feature description text */
    text: string;
    /** Animation delay in milliseconds for staggered entrance */
    delay: number;
    /** Theme flag - true for dark mode, false for light mode */
    isDarkMode: boolean;
};

/**
 * Animated feature list item with icon and checkmark
 */
export default function FeatureRow({
    icon,
    text,
    delay,
    isDarkMode
}: FeatureProps): JSX.Element {
    const insets = useSafeAreaInsets();
    const styles = createIntroStyles(isDarkMode, insets);
    const iconColor = isDarkMode ? '#A78BFA' : '#5856D6';

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    friction: 6,   
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [delay, fadeAnim, translateY]);

    return (
        <Animated.View
            style={[
                styles.featureContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                },
            ]}
        >
            <BlurView
                intensity={isDarkMode ? 20 : 40}
                tint={isDarkMode ? 'dark' : 'light'}
                style={styles.featureBlur}
            >
                {/* Feature icon */}
                <View style={styles.featureIconBox}>
                    <Ionicons name={icon} size={22} color={iconColor} />
                </View>

                {/* Feature description */}
                <Text style={styles.featureText}>{text}</Text>

                {/* Checkmark indicator */}
                <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,0,0,0.3)'}
                />
            </BlurView>
        </Animated.View>
    );
}