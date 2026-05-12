import Device from './components/Device'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px 120px',
      background: 'var(--body-bg)',
    }}>
      <Device />
    </div>
  )
}
