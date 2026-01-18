import React, { JSX, useEffect, useRef } from 'react';
import { Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createIntroStyles from '@/styles/intro.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Props for the HeaderSection component
 */
type HeaderSectionProps = {
    /** Theme flag - true for dark mode, false for light mode */
    isDarkMode: boolean;
};

/**
 * Animated header section for intro/onboarding screen
 * * Displays the app branding with:
 * - Large shield icon with subtle breathing animation (scale pulse)
 * - App name (NextVibe Wallet)
 * - Tagline/subtitle
 * - Fade-in entrance animation
 * * The shield icon continuously pulses between 100% and 105% scale to create
 * a subtle, engaging visual effect that draws attention without being distracting.
 * * @param props - Component properties
 * @returns Rendered header section with animated branding
 */
export default function HeaderSection({
    isDarkMode
}: HeaderSectionProps): JSX.Element {
    const insets = useSafeAreaInsets();
    const styles = createIntroStyles(isDarkMode, insets);
    const iconColor = isDarkMode ? '#A78BFA' : '#5856D6';

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current; // Simulating FadeInDown start position
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // 1. Entrance Animation (FadeInDown)
        Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 90
                })
            ])
        ]).start();

        // 2. Breathing Animation (Infinite Loop)
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [fadeAnim, translateY, scaleAnim]);

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }]
                }
            ]}
        >
            {/* Animated shield icon */}
            <Animated.View 
                style={[
                    styles.iconWrapper, 
                    { transform: [{ scale: scaleAnim }] }
                ]}
            >
                <Ionicons name="shield-checkmark" size={64} color={iconColor} />
            </Animated.View>

            {/* App name */}
            <Text style={styles.title}>NextVibe Wallet</Text>

            {/* Tagline */}
            <Text style={styles.subtitle}>
                The secure vault for your social assets.
            </Text>
        </Animated.View>
    );
}