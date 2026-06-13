// TranscriptPanel — scrollable conversation transcript
export default function TranscriptPanel() {
  return (
    <div style={{ maxHeight: 300, overflowY: "auto" }}>
      {/* TODO: render messages from useMessages hook */}
      <p style={{ color: "var(--accent-cyan)", opacity: 0.5 }}>
        Start talking to FRIDAY...
      </p>
    </div>
  )
}

