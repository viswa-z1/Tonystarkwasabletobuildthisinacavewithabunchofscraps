export interface Session {
  id: string
  created_at: string
  ended_at?: string
  message_count: number
  summary?: string
}

export interface Message {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

