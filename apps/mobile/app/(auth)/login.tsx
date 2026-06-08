import { View, Text, StyleSheet } from "react-native"

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>F.R.I.D.A.Y.</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      {/* TODO: Supabase email + Google OAuth */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000a14", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Orbitron", color: "#00d4ff", fontSize: 28, fontWeight: "900" },
  subtitle: { color: "#00d4ff88", marginTop: 8, fontFamily: "JetBrainsMono" },
})
