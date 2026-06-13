import { FlatList, Text, View, StyleSheet } from "react-native"

interface Message {
  id: string
  role: string
  content: string
}

export default function TranscriptList({ messages }: { messages: Message[] }) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(message) => message.id}
      renderItem={({ item }) => (
        <View style={styles.bubble}>
          <Text style={styles.role}>{item.role.toUpperCase()}</Text>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Start talking to FRIDAY...</Text>}
    />
  )
}

const styles = StyleSheet.create({
  bubble: { marginVertical: 4, padding: 10, borderRadius: 8, backgroundColor: "#001a2e" },
  role: { color: "#00d4ff", fontSize: 10, marginBottom: 2, letterSpacing: 1 },
  content: { color: "#e0f0ff", fontSize: 14 },
  empty: { color: "#00d4ff44", textAlign: "center", marginTop: 40 },
})
