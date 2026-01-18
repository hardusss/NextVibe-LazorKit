import React, { useState, useRef, JSX } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Animated,
    PanResponder,
    PanResponderGestureState
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import createIntroStyles, { BUTTON_CONSTANTS } from '@/styles/intro.styles';

/**
 * Props for the SwipeButton component
 */
interface SwipeButtonProps {
    /** Callback fired when swipe gesture is completed successfully */
    onTrigger: () => Promise<void> | void;
    /** Theme flag - true for dark mode, false for light mode */
    isDarkMode: boolean;
}

/**
 * Interactive swipe-to-activate button with haptic feedback
 */
export default function SwipeButton({
    onTrigger,
    isDarkMode
}: SwipeButtonProps): JSX.Element {
    const styles = createIntroStyles(isDarkMode);
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Animated value for the knob position
    const translateX = useRef(new Animated.Value(0)).current;

    const gradientColors = isDarkMode
        ? ['#A78BFA', '#7C3AED']
        : ['#5856D6', '#7C3AED'];

    /**
     * Handles completion of the swipe gesture
     */
    const handleComplete = async () => {
        setIsLoading(true);
        setIsComplete(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            await onTrigger();
        } catch (error) {
            console.log("Action cancelled, resetting button");
            resetButton();
        } finally {
            // Even on success, if the component stays mounted, we might want to reset state
            // or keep it completed depending on logic. Here we reset for safety.
            resetButton();
        }
    };

    const resetButton = () => {
        setIsLoading(false);
        setIsComplete(false);
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 10
        }).start();
    };

    /**
     * PanResponder configuration for swipe interaction
     */
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                // Initial haptic feedback
                if (!isLoading && !isComplete) {
                    Haptics.selectionAsync();
                }
            },

            onPanResponderMove: (_: any, gestureState: PanResponderGestureState) => {
                if (isLoading || isComplete) return;

                // Constrain movement between 0 and MAX_SLIDE
                let newX = gestureState.dx;
                if (newX < 0) newX = 0;
                if (newX > BUTTON_CONSTANTS.MAX_SLIDE) newX = BUTTON_CONSTANTS.MAX_SLIDE;

                translateX.setValue(newX);
            },

            onPanResponderRelease: (_: any, gestureState: PanResponderGestureState) => {
                if (isLoading || isComplete) return;

                // Check if threshold (85%) is met using the current gesture distance (clamped logic)
                // We use the last set value or clamp gestureState.dx manually for the check
                const effectiveX = Math.min(Math.max(gestureState.dx, 0), BUTTON_CONSTANTS.MAX_SLIDE);

                if (effectiveX > BUTTON_CONSTANTS.MAX_SLIDE * 0.85) {
                    // Snap to end and trigger action
                    Animated.spring(translateX, {
                        toValue: BUTTON_CONSTANTS.MAX_SLIDE,
                        useNativeDriver: true,
                        bounciness: 0
                    }).start(handleComplete);
                } else {
                    // Spring back to start
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 10
                    }).start();
                }
            }
        })
    ).current;

    // Interpolations for animations
    const textOpacity = translateX.interpolate({
        inputRange: [0, BUTTON_CONSTANTS.MAX_SLIDE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const textTranslateX = translateX.interpolate({
        inputRange: [0, BUTTON_CONSTANTS.MAX_SLIDE],
        outputRange: [0, 20],
        extrapolate: 'clamp'
    });

    const arrowOpacity = translateX.interpolate({
        inputRange: [0, BUTTON_CONSTANTS.MAX_SLIDE * 0.1],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.swipeTrack}>
            {/* Instruction text with fade animation */}
            <Animated.View
                style={[
                    styles.swipeTextContainer,
                    {
                        opacity: textOpacity,
                        transform: [{ translateX: textTranslateX }]
                    }
                ]}
            >
                <Text style={styles.swipeText}>Swipe to Activate</Text>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
                    style={{ marginLeft: 4 }}
                />
            </Animated.View>

            {/* Draggable knob with gradient background */}
            <Animated.View
                style={[
                    styles.swipeKnob,
                    { transform: [{ translateX }] }
                ]}
                {...panResponder.panHandlers}
            >
                <LinearGradient
                    colors={gradientColors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.knobGradient}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Animated.View style={{ opacity: arrowOpacity }}>
                            <Ionicons name="arrow-forward" size={24} color="#FFF" />
                        </Animated.View>
                    )}
                </LinearGradient>
            </Animated.View>
        </View>
    );
}