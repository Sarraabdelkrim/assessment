import { useEffect } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const CARD_SIZE = width / 3;

const iconDataSets = {
  set1: [
    { emoji: "🍕", color: "#FFE5CC" },
    { emoji: "🍔", color: "#F4D03F" },
    { emoji: "🍟", color: "#F8D7DA" },
    { emoji: "🌮", color: "#D5EDDA" },
    { emoji: "🍗", color: "#FADBD8" },
    { emoji: "🥪", color: "#FFF3CD" },
  ],
  set2: [
    { emoji: "🎮", color: "#D1ECF1" },
    { emoji: "🎧", color: "#E2E3E5" },
    { emoji: "☕", color: "#F4D03F" },
    { emoji: "🍿", color: "#FFE5CC" },
    { emoji: "🥤", color: "#F8D7DA" },
    { emoji: "🎵", color: "#D5EDDA" },
  ],
  set3: [
    { emoji: "🍰", color: "#FADBD8" },
    { emoji: "🍦", color: "#D1ECF1" },
    { emoji: "🍪", color: "#FFE5CC" },
    { emoji: "🎲", color: "#D5EDDA" },
    { emoji: "🕹️", color: "#E2E3E5" },
    { emoji: "🧁", color: "#F4D03F" },
  ],
};

type Props = {
  iconSet?: keyof typeof iconDataSets;
  duration?: number;
  reverse?: boolean;
};

export default function SmoothInfiniteScroll({
  iconSet = "set1",
  duration = 10000,
  reverse = false,
}: Props) {
  const data = iconDataSets[iconSet];
  const items = [...data, ...data, ...data];


  const loopHeight = data.length * CARD_SIZE;
  const translateY = useSharedValue(reverse ? -loopHeight : 0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(reverse ? 0 : -loopHeight, { duration }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.column, animatedStyle]}>
      {items.map((item, index) => (
        <Animated.View
          key={index}
          style={[styles.card, { backgroundColor: item.color }]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: CARD_SIZE,        
    flexDirection: "column", 
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,      
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,       
  },
  emoji: {
    fontSize: 34,
  },
});