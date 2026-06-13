// WorldMapPanel — triggered by send_dashboard_event MCP tool
// TODO: implement with react-simple-maps
export default function WorldMapPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ background: "var(--glass-bg)", padding: 24, borderRadius: 8 }}>
      <button onClick={onClose}>✕ Close</button>
      <p>World Monitor — Map coming soon</p>
    </div>
  )
}

