import { useTastingSession } from './hooks/useTastingSession';
import WheelSVG from './components/WheelSVG';
import type { VisualMode } from './types';

const MODE_LABELS: Record<VisualMode, string> = {
  wheel: 'Animated Wheel',
  aura: 'Aura Effect',
  type: 'Typographic',
};

export default function App() {
  const { session, toggleNote, setGuidedStep, setReverseQuery, setMode } = useTastingSession();

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Coffee Flavor Wheel</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Explore, identify, and learn coffee tasting notes.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {(Object.keys(MODE_LABELS) as VisualMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '2px solid',
              borderColor: session.mode === m ? '#2C3E50' : '#ccc',
              background: session.mode === m ? '#2C3E50' : 'white',
              color: session.mode === m ? 'white' : '#333',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 32, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {session.mode === 'wheel' && <WheelSVG session={session} onToggleNote={toggleNote} onSetGuidedStep={setGuidedStep} onSetReverseQuery={setReverseQuery} />}
        {session.mode === 'aura' && <div style={{ color: '#999' }}>Aura Effect — coming soon</div>}
        {session.mode === 'type' && <div style={{ color: '#999' }}>Typographic Mode — coming soon</div>}
      </div>
    </div>
  );
}
