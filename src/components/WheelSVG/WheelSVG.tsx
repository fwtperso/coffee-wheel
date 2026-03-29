import { useState, useMemo } from 'react';
import { FLAVOR_WHEEL, searchNotes } from '../../data/flavorWheel';
import type { TastingSession, GuidedStep } from '../../types';
import './WheelSVG.css';

interface WheelSVGProps {
  session: TastingSession;
  onToggleNote: (noteId: string) => void;
  onSetGuidedStep: (step: GuidedStep) => void;
  onSetReverseQuery: (q: string) => void;
}

const CX = 300;
const CY = 300;
const R_INNER_START = 80;
const R_INNER_END = 140;
const R_MID_START = 140;
const R_MID_END = 210;
const R_OUTER_START = 210;
const R_OUTER_END = 280;

const GUIDED_MAP: Record<GuidedStep, string[]> = {
  aroma: ['fruity', 'floral', 'green-vegetative'],
  flavor: ['sweet', 'nutty-cocoa', 'spices', 'roasted'],
  finish: ['fermented', 'other'],
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r1: number, r2: number, startDeg: number, endDeg: number) {
  const p1 = polarToCartesian(cx, cy, r2, startDeg);
  const p2 = polarToCartesian(cx, cy, r2, endDeg);
  const p3 = polarToCartesian(cx, cy, r1, endDeg);
  const p4 = polarToCartesian(cx, cy, r1, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r2} ${r2} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${r1} ${r1} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

function midAngle(startDeg: number, endDeg: number) {
  return (startDeg + endDeg) / 2;
}

function labelPos(cx: number, cy: number, r1: number, r2: number, startDeg: number, endDeg: number) {
  const r = (r1 + r2) / 2;
  const angle = midAngle(startDeg, endDeg);
  return polarToCartesian(cx, cy, r, angle);
}

function lightenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * factor));
  const lg = Math.min(255, Math.round(g + (255 - g) * factor));
  const lb = Math.min(255, Math.round(b + (255 - b) * factor));
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function truncateLabel(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '\u2026' : text;
}

export default function WheelSVG({ session, onToggleNote, onSetGuidedStep, onSetReverseQuery }: WheelSVGProps) {
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  const matchingNoteIds = useMemo(() => {
    if (!session.reverseQuery) return new Set<string>();
    return new Set(searchNotes(session.reverseQuery).map(n => n.id));
  }, [session.reverseQuery]);

  const hasSelection = session.selectedNoteIds.length > 0;
  const hasSearch = session.reverseQuery.length > 0;
  const relevantFamilies = GUIDED_MAP[session.guidedStep];

  const familyAngleSize = 360 / FLAVOR_WHEEL.length;

  return (
    <div>
      <div className="wheel-search">
        <input
          className="wheel-search__input"
          type="text"
          placeholder="Search flavors..."
          value={session.reverseQuery}
          onChange={e => onSetReverseQuery(e.target.value)}
        />
        {hasSearch && (
          <button className="wheel-search__clear" onClick={() => onSetReverseQuery('')}>
            Clear
          </button>
        )}
      </div>

      <svg viewBox="0 0 600 600" width="100%" style={{ maxWidth: 600, display: 'block', margin: '0 auto' }}>
        <defs>
          <filter id="glow-selected">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fff" floodOpacity="0.8" />
          </filter>
        </defs>

        {FLAVOR_WHEEL.map((family, fi) => {
          const startDeg = fi * familyAngleSize;
          const endDeg = startDeg + familyAngleSize;
          const isExpanded = expandedFamily === family.id;
          const guidedDim = !relevantFamilies.includes(family.id);
          const lp = labelPos(CX, CY, R_INNER_START, R_INNER_END, startDeg, endDeg);

          const subCategories = family.subCategories;
          const totalLeaves = subCategories.reduce((sum, sc) => sum + sc.notes.length, 0);

          let subAngleOffset = startDeg;

          return (
            <g key={family.id}>
              <path
                data-testid={`family-${family.id}`}
                className={`wheel-segment${guidedDim ? ' wheel-segment--guided-dim' : ''}`}
                d={arcPath(CX, CY, R_INNER_START, R_INNER_END, startDeg, endDeg)}
                fill={family.color}
                stroke="#fff"
                strokeWidth={2}
                onClick={() => setExpandedFamily(isExpanded ? null : family.id)}
              />
              <text
                className="wheel-label"
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontWeight="bold"
                fontSize={11}
              >
                {family.label}
              </text>

              {isExpanded && subCategories.map((sub) => {
                const subSpan = (sub.notes.length / totalLeaves) * familyAngleSize;
                const subStart = subAngleOffset;
                const subEnd = subAngleOffset + subSpan;
                subAngleOffset = subEnd;

                const subLp = labelPos(CX, CY, R_MID_START, R_MID_END, subStart, subEnd);
                const subColor = lightenColor(family.color, 0.25);

                const noteAngleSize = subSpan / sub.notes.length;

                return (
                  <g key={sub.id} className="wheel-ring-enter wheel-ring-enter--visible">
                    <path
                      data-testid={`sub-${sub.id}`}
                      className="wheel-segment"
                      d={arcPath(CX, CY, R_MID_START, R_MID_END, subStart, subEnd)}
                      fill={subColor}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <text
                      className="wheel-label"
                      x={subLp.x}
                      y={subLp.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={9}
                    >
                      {truncateLabel(sub.label, 12)}
                    </text>

                    {sub.notes.map((note, ni) => {
                      const noteStart = subStart + ni * noteAngleSize;
                      const noteEnd = noteStart + noteAngleSize;
                      const noteLp = labelPos(CX, CY, R_OUTER_START, R_OUTER_END, noteStart, noteEnd);
                      const noteColor = lightenColor(family.color, 0.4);
                      const isSelected = session.selectedNoteIds.includes(note.id);
                      const isMatch = hasSearch && matchingNoteIds.has(note.id);
                      const isDimmedBySelection = hasSelection && !isSelected;
                      const isDimmedBySearch = hasSearch && !isMatch;

                      let cls = 'wheel-segment';
                      if (isSelected) cls += ' wheel-segment--selected';
                      if (isDimmedBySelection || isDimmedBySearch) cls += ' wheel-segment--dimmed';
                      if (isMatch) cls += ' wheel-segment--highlighted';

                      return (
                        <g key={note.id}>
                          <path
                            data-testid={`note-${note.id}`}
                            className={cls}
                            d={arcPath(CX, CY, R_OUTER_START, R_OUTER_END, noteStart, noteEnd)}
                            fill={noteColor}
                            stroke="#fff"
                            strokeWidth={2}
                            filter={isSelected ? 'url(#glow-selected)' : undefined}
                            onClick={() => onToggleNote(note.id)}
                          />
                          <text
                            className="wheel-label"
                            x={noteLp.x}
                            y={noteLp.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#fff"
                            fontSize={7}
                          >
                            {truncateLabel(note.label, 10)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="wheel-guided-tabs">
        {(['aroma', 'flavor', 'finish'] as GuidedStep[]).map(step => (
          <button
            key={step}
            className={`wheel-guided-tabs__btn${session.guidedStep === step ? ' wheel-guided-tabs__btn--active' : ''}`}
            onClick={() => onSetGuidedStep(step)}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
