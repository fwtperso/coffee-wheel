import { useTastingSession } from './hooks/useTastingSession';
import WheelSVG from './components/WheelSVG';
import WheelAura from './components/WheelAura';
import { WheelTypographic } from './components/WheelTypographic';
import type { VisualMode, GuidedStep } from './types';

const MODE_LABELS: Record<VisualMode, string> = {
  wheel: 'Animated Wheel',
  aura: 'Aura Effect',
  type: 'Typographic',
};

const GUIDED_STEPS: GuidedStep[] = ['aroma', 'flavor', 'finish'];

export default function App() {
  const { session, toggleNote, setGuidedStep, setReverseQuery, setMode } = useTastingSession();

  return (
    <div style={{ fontFamily: 'sans-serif', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          padding: '24px 16px',
          borderRight: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          overflowY: 'auto',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700 }}>Coffee Flavor Wheel</div>

        {/* Mode switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(Object.keys(MODE_LABELS) as VisualMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: '2px solid',
                borderColor: session.mode === m ? '#2C3E50' : '#ccc',
                background: session.mode === m ? '#2C3E50' : 'white',
                color: session.mode === m ? 'white' : '#333',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search flavors..."
          value={session.reverseQuery}
          onChange={e => setReverseQuery(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '2px solid #ccc',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        {/* Guided step buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999' }}>
            Guided phase
          </span>
          {GUIDED_STEPS.map(step => (
            <button
              key={step}
              onClick={() => setGuidedStep(step)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '2px solid',
                borderColor: session.guidedStep === step ? '#2C3E50' : '#ccc',
                background: session.guidedStep === step ? '#2C3E50' : 'white',
                color: session.guidedStep === step ? 'white' : '#333',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {session.mode === 'wheel' && <WheelSVG session={session} onToggleNote={toggleNote} onSetGuidedStep={setGuidedStep} onSetReverseQuery={setReverseQuery} />}
        {session.mode === 'aura' && <WheelAura session={session} onToggleNote={toggleNote} onSetGuidedStep={setGuidedStep} onSetReverseQuery={setReverseQuery} />}
        {session.mode === 'type' && <WheelTypographic session={session} onToggleNote={toggleNote} onSetGuidedStep={setGuidedStep} onSetReverseQuery={setReverseQuery} />}
      </div>
    </div>
  );
}
