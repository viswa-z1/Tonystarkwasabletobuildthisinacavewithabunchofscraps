import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

export type OrbState = "idle" | "listening" | "thinking" | "speaking"

interface Props {
  state: OrbState
  onPress: () => void
}

export default function VoiceOrb({ state, onPress }: Props) {
  const colors: Record<OrbState, string> = {
    idle: "#00d4ff44",
    listening: "#00d4ff88",
    thinking: "#ffb30088",
    speaking: "#00ff8888",
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.orb, { backgroundColor: colors[state] }]}>
        <Text style={styles.label}>{state.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  orb: { width: 140, height: 140, borderRadius: 70, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#00d4ff" },
  label: { color: "#00d4ff", fontSize: 11, letterSpacing: 2 },
})
