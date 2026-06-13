import { View, Text, StyleSheet } from "react-native"

export default function StatusPill({ status }: { status: string }) {
  return (
    <View style={styles.pill}>
      <View style={styles.dot} />
      <Text style={styles.text}>FRIDAY - {status.toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "#00d4ff33" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#00ff88" },
  text: { color: "#00d4ff", fontSize: 10, letterSpacing: 2 },
})
