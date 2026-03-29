import { useMemo } from 'react';
import { FLAVOR_WHEEL, searchNotes } from '../../data/flavorWheel';
import type { TastingSession, GuidedStep } from '../../types';
import type { FlavorFamily } from '../../data/flavorWheel';
import './WheelAura.css';

interface WheelAuraProps {
  session: TastingSession;
  onToggleNote: (noteId: string) => void;
  onSetGuidedStep: (step: GuidedStep) => void;
  onSetReverseQuery: (q: string) => void;
}

const CX = 300;
const CY = 300;
const INNER_R = 100;
const MID_R = 160;
const OUTER_R = 220;
const AURA_RADIUS = 120;

const GUIDED_PHASES: Record<GuidedStep, string[]> = {
  aroma: ['floral', 'fruity', 'green-vegetative', 'spices'],
  flavor: ['sweet', 'nutty-cocoa', 'roasted', 'fermented'],
  finish: ['other', 'roasted', 'spices'],
};

const GUIDED_LABELS: { step: GuidedStep; label: string }[] = [
  { step: 'aroma', label: 'Aroma' },
  { step: 'flavor', label: 'Flavor' },
  { step: 'finish', label: 'Finish' },
];

interface ArcInfo {
  familyId: string;
  familyColor: string;
  noteId: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  midX: number;
  midY: number;
}

function describeArc(
  cx: number, cy: number,
  innerR: number, outerR: number,
  startAngle: number, endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  const x1o = cx + outerR * Math.cos(startRad);
  const y1o = cy + outerR * Math.sin(startRad);
  const x2o = cx + outerR * Math.cos(endRad);
  const y2o = cy + outerR * Math.sin(endRad);
  const x1i = cx + innerR * Math.cos(endRad);
  const y1i = cy + innerR * Math.sin(endRad);
  const x2i = cx + innerR * Math.cos(startRad);
  const y2i = cy + innerR * Math.sin(startRad);

  return [
    `M ${x1o} ${y1o}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
    'Z',
  ].join(' ');
}

function computeLayout(families: FlavorFamily[]) {
  const totalNotes = families.reduce(
    (sum, f) => sum + f.subCategories.reduce((s, sc) => s + sc.notes.length, 0),
    0,
  );

  const familyArcs: {
    family: FlavorFamily;
    startAngle: number;
    endAngle: number;
    midAngle: number;
  }[] = [];

  const noteArcs: ArcInfo[] = [];
  let angle = 0;

  for (const family of families) {
    const noteCount = family.subCategories.reduce((s, sc) => s + sc.notes.length, 0);
    const sweep = (noteCount / totalNotes) * 360;
    const familyStart = angle;
    const familyEnd = angle + sweep;

    familyArcs.push({
      family,
      startAngle: familyStart,
      endAngle: familyEnd,
      midAngle: (familyStart + familyEnd) / 2,
    });

    let noteAngle = familyStart;
    const noteSweep = sweep / noteCount;

    for (const sub of family.subCategories) {
      for (const note of sub.notes) {
        const nStart = noteAngle;
        const nEnd = noteAngle + noteSweep;
        const midA = (nStart + nEnd) / 2;
        const midRad = (midA * Math.PI) / 180;
        const midR = (MID_R + OUTER_R) / 2;

        noteArcs.push({
          familyId: family.id,
          familyColor: family.color,
          noteId: note.id,
          startAngle: nStart,
          endAngle: nEnd,
          midAngle: midA,
          midX: CX + midR * Math.cos(midRad),
          midY: CY + midR * Math.sin(midRad),
        });

        noteAngle = nEnd;
      }
    }

    angle = familyEnd;
  }

  return { familyArcs, noteArcs };
}

export default function WheelAura({
  session,
  onToggleNote,
  onSetGuidedStep,
  onSetReverseQuery,
}: WheelAuraProps) {
  const { familyArcs, noteArcs } = useMemo(
    () => computeLayout(FLAVOR_WHEEL),
    [],
  );

  const matchingNoteIds = useMemo(() => {
    if (!session.reverseQuery.trim()) return new Set<string>();
    return new Set(searchNotes(session.reverseQuery).map(n => n.id));
  }, [session.reverseQuery]);

  const selectedSet = useMemo(
    () => new Set(session.selectedNoteIds),
    [session.selectedNoteIds],
  );

  const phaseFamilies = useMemo(
    () => new Set(GUIDED_PHASES[session.guidedStep]),
    [session.guidedStep],
  );

  const selectedFamilyColors = useMemo(() => {
    const colors: string[] = [];
    for (const arc of noteArcs) {
      if (selectedSet.has(arc.noteId) && !colors.includes(arc.familyColor)) {
        colors.push(arc.familyColor);
      }
    }
    return colors;
  }, [noteArcs, selectedSet]);

  const hasGuidedActive = session.guidedStep !== 'aroma' ||
    session.selectedNoteIds.length > 0 ||
    session.reverseQuery.trim() !== '';

  return (
    <div className="wheel-aura">
      <div className="wheel-aura__controls">
        <input
          className="wheel-aura__search"
          type="text"
          placeholder="Search flavors..."
          value={session.reverseQuery}
          onChange={e => onSetReverseQuery(e.target.value)}
        />
        <div className="wheel-aura__guided-tabs">
          {GUIDED_LABELS.map(({ step, label }) => (
            <button
              key={step}
              className={`wheel-aura__guided-tab${
                session.guidedStep === step ? ' wheel-aura__guided-tab--active' : ''
              }`}
              onClick={() => onSetGuidedStep(step)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <svg
        className="wheel-aura__svg"
        viewBox="0 0 600 600"
        width={600}
        height={600}
      >
        <defs>
          {noteArcs
            .filter(arc => selectedSet.has(arc.noteId))
            .map(arc => (
              <radialGradient
                key={`grad-${arc.noteId}`}
                id={`aura-grad-${arc.noteId}`}
                cx={arc.midX / 600}
                cy={arc.midY / 600}
                r={AURA_RADIUS / 600}
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0%" stopColor={arc.familyColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={arc.familyColor} stopOpacity={0} />
              </radialGradient>
            ))}
          {noteArcs
            .filter(arc => matchingNoteIds.has(arc.noteId) && !selectedSet.has(arc.noteId))
            .map(arc => (
              <radialGradient
                key={`grad-preview-${arc.noteId}`}
                id={`aura-grad-preview-${arc.noteId}`}
                cx={arc.midX / 600}
                cy={arc.midY / 600}
                r={AURA_RADIUS / 600}
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0%" stopColor={arc.familyColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={arc.familyColor} stopOpacity={0} />
              </radialGradient>
            ))}
        </defs>

        {/* Family inner ring */}
        {familyArcs.map(({ family, startAngle, endAngle, midAngle }) => {
          const isDimmed = hasGuidedActive && !phaseFamilies.has(family.id);
          const midRad = (midAngle * Math.PI) / 180;
          const labelR = (INNER_R + MID_R) / 2;
          const lx = CX + labelR * Math.cos(midRad);
          const ly = CY + labelR * Math.sin(midRad);

          return (
            <g key={family.id}>
              <path
                className={`wheel-aura__segment${isDimmed ? ' wheel-aura__segment--dimmed' : ''}`}
                d={describeArc(CX, CY, INNER_R, MID_R, startAngle, endAngle)}
                fill={family.color}
                fillOpacity={0.25}
                stroke="#fff"
                strokeWidth={1}
                data-testid={`family-${family.id}`}
              />
              <text
                className="wheel-aura__family-label"
                x={lx}
                y={ly}
                data-testid={`family-label-${family.id}`}
              >
                {family.label}
              </text>
            </g>
          );
        })}

        {/* Leaf note outer ring */}
        {noteArcs.map(arc => {
          const isSelected = selectedSet.has(arc.noteId);
          const isMatching = matchingNoteIds.has(arc.noteId) && !isSelected;
          const isDimmed = hasGuidedActive && !phaseFamilies.has(arc.familyId);

          let className = 'wheel-aura__segment';
          if (isSelected) className += ' wheel-aura__segment--selected';
          if (isMatching) className += ' wheel-aura__segment--matching';
          if (isDimmed) className += ' wheel-aura__segment--dimmed';

          return (
            <path
              key={arc.noteId}
              className={className}
              d={describeArc(CX, CY, MID_R, OUTER_R, arc.startAngle, arc.endAngle)}
              fill={arc.familyColor}
              fillOpacity={isSelected ? 1.0 : 0.25}
              stroke={isSelected || isMatching ? '#fff' : '#fff'}
              strokeWidth={isSelected || isMatching ? 2 : 1}
              onClick={() => onToggleNote(arc.noteId)}
              data-testid={`note-${arc.noteId}`}
              style={isMatching ? { transformOrigin: `${arc.midX}px ${arc.midY}px` } : undefined}
            />
          );
        })}

        {/* Aura layer */}
        <g className="wheel-aura__aura-layer">
          {noteArcs
            .filter(arc => selectedSet.has(arc.noteId))
            .map(arc => (
              <rect
                key={`aura-${arc.noteId}`}
                className="wheel-aura__aura-circle"
                x={0}
                y={0}
                width={600}
                height={600}
                fill={`url(#aura-grad-${arc.noteId})`}
                data-testid={`aura-${arc.noteId}`}
              />
            ))}
          {noteArcs
            .filter(arc => matchingNoteIds.has(arc.noteId) && !selectedSet.has(arc.noteId))
            .map(arc => (
              <rect
                key={`aura-preview-${arc.noteId}`}
                x={0}
                y={0}
                width={600}
                height={600}
                fill={`url(#aura-grad-preview-${arc.noteId})`}
                opacity={0.3}
              />
            ))}
        </g>
      </svg>

      {/* Signature panel */}
      <div className="wheel-aura__signature" data-testid="signature-panel">
        {selectedFamilyColors.length > 0 ? (
          <>
            <div
              className="wheel-aura__signature-bar"
              style={{
                background: `linear-gradient(to right, ${selectedFamilyColors.join(', ')})`,
              }}
            />
            <span className="wheel-aura__signature-label">Your tasting signature</span>
          </>
        ) : (
          <span>Select notes to build your signature</span>
        )}
      </div>
    </div>
  );
}
