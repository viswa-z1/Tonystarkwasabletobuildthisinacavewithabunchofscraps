import { View, StyleSheet } from "react-native"
import VoiceOrb from "../../components/VoiceOrb"
import TranscriptList from "../../components/TranscriptList"
import StatusPill from "../../components/StatusPill"

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <StatusPill status="idle" />
      <VoiceOrb state="idle" onPress={() => {}} />
      <TranscriptList messages={[]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000a14", alignItems: "center", justifyContent: "space-around", padding: 24 },
})
