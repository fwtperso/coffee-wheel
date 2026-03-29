import { useState, useMemo } from 'react';
import { FLAVOR_WHEEL, searchNotes } from '../../data/flavorWheel';
import type { FlavorFamily } from '../../data/flavorWheel';
import type { TastingSession, GuidedStep } from '../../types';
import './WheelTypographic.css';

interface WheelTypographicProps {
  session: TastingSession;
  onToggleNote: (noteId: string) => void;
  onSetGuidedStep: (step: GuidedStep) => void;
  onSetReverseQuery: (q: string) => void;
}

const GUIDED_MAP: Record<GuidedStep, string[]> = {
  aroma: ['fruity', 'floral', 'green-vegetative'],
  flavor: ['sweet', 'nutty-cocoa', 'spices', 'roasted'],
  finish: ['sour-fermented', 'sour', 'other'],
};

const STEP_HEADERS: Record<GuidedStep, string> = {
  aroma: 'What do you smell?',
  flavor: 'What do you taste?',
  finish: 'How does it finish?',
};

const STEP_ORDER: GuidedStep[] = ['aroma', 'flavor', 'finish'];

export function generateProse(
  selectedNoteIds: string[],
  allFamilies: FlavorFamily[],
): string {
  if (selectedNoteIds.length === 0) return '';

  const notesByFamily: Record<string, string[]> = {};
  for (const family of allFamilies) {
    for (const sub of family.subCategories) {
      for (const note of sub.notes) {
        if (selectedNoteIds.includes(note.id)) {
          if (!notesByFamily[family.label]) notesByFamily[family.label] = [];
          notesByFamily[family.label].push(note.label.toLowerCase());
        }
      }
    }
  }

  const parts = Object.entries(notesByFamily).map(([, notes]) => {
    if (notes.length === 1) return notes[0];
    return notes.slice(0, -1).join(', ') + ' and ' + notes[notes.length - 1];
  });

  if (parts.length === 1) return `Notes of ${parts[0]}.`;
  return `Notes of ${parts.slice(0, -1).join(', ')}, finishing with ${parts[parts.length - 1]}.`;
}

export function WheelTypographic({
  session,
  onToggleNote,
  onSetGuidedStep,
  onSetReverseQuery,
}: WheelTypographicProps) {
  const [collapsedFamilies, setCollapsedFamilies] = useState<Set<string>>(
    new Set(),
  );
  const [refPanelOpen, setRefPanelOpen] = useState(false);

  const activeFamilyIds = GUIDED_MAP[session.guidedStep];

  const visibleFamilies = useMemo(
    () => FLAVOR_WHEEL.filter((f) => activeFamilyIds.includes(f.id)),
    [activeFamilyIds],
  );

  const searchMatchIds = useMemo(() => {
    if (!session.reverseQuery.trim()) return null;
    return new Set(searchNotes(session.reverseQuery).map((n) => n.id));
  }, [session.reverseQuery]);

  const prose = useMemo(
    () => generateProse(session.selectedNoteIds, FLAVOR_WHEEL),
    [session.selectedNoteIds],
  );

  function toggleFamily(familyId: string) {
    setCollapsedFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(familyId)) {
        next.delete(familyId);
      } else {
        next.add(familyId);
      }
      return next;
    });
  }

  return (
    <div className="wt-container">
      <input
        className="wt-search"
        type="text"
        placeholder="Search flavors..."
        value={session.reverseQuery}
        onChange={(e) => onSetReverseQuery(e.target.value)}
      />

      <h2 className="wt-step-header">
        {STEP_HEADERS[session.guidedStep]}
      </h2>

      <div className="wt-step-tabs">
        {STEP_ORDER.map((step) => (
          <button
            key={step}
            className={`wt-step-tab${session.guidedStep === step ? ' wt-step-tab--active' : ''}`}
            onClick={() => onSetGuidedStep(step)}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </button>
        ))}
      </div>

      <div className="wt-families-container">
        {visibleFamilies.map((family) => (
          <div key={family.id} className="wt-family-group">
            <span
              className="wt-family-label"
              onClick={() => toggleFamily(family.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleFamily(family.id);
              }}
            >
              {family.label} {collapsedFamilies.has(family.id) ? '+' : '-'}
            </span>
            {!collapsedFamilies.has(family.id) && (
              <div className="wt-chip-grid">
                {family.subCategories.flatMap((sub) =>
                  sub.notes
                    .filter((note) =>
                      searchMatchIds === null || searchMatchIds.has(note.id),
                    )
                    .map((note) => {
                      const selected = session.selectedNoteIds.includes(note.id);
                      const highlighted =
                        searchMatchIds !== null && searchMatchIds.has(note.id);
                      return (
                        <button
                          key={note.id}
                          className={`wt-chip${selected ? ' wt-chip--selected' : ''}${highlighted ? ' wt-chip--highlighted' : ''}`}
                          style={
                            selected
                              ? { background: family.color, borderColor: family.color }
                              : highlighted
                                ? { borderColor: family.color }
                                : undefined
                          }
                          onClick={() => onToggleNote(note.id)}
                        >
                          {note.label}
                        </button>
                      );
                    }),
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`wt-prose${!prose ? ' wt-prose--empty' : ''}`}>
        {prose || 'Start selecting notes above to build your tasting profile.'}
      </div>

      <div>
        <button
          className="wt-ref-toggle"
          onClick={() => setRefPanelOpen((o) => !o)}
        >
          View flavor wheel {refPanelOpen ? '\u25B2' : '\u25BC'}
        </button>
        <div
          className={`wt-ref-panel ${refPanelOpen ? 'wt-ref-panel--open' : 'wt-ref-panel--closed'}`}
        >
          <svg
            viewBox="0 0 300 300"
            width={300}
            height={300}
            style={{ marginTop: 12 }}
          >
            {FLAVOR_WHEEL.map((family, fi) => {
              const total = FLAVOR_WHEEL.length;
              const angle = 360 / total;
              const startAngle = fi * angle;
              const endAngle = startAngle + angle;
              const midAngle = startAngle + angle / 2;
              const hasSelected = family.subCategories.some((s) =>
                s.notes.some((n) =>
                  session.selectedNoteIds.includes(n.id),
                ),
              );
              return (
                <g key={family.id}>
                  <path
                    d={describeArc(150, 150, 50, 140, startAngle, endAngle)}
                    fill={family.color}
                    opacity={hasSelected ? 1 : 0.3}
                    stroke="white"
                    strokeWidth={1}
                  />
                  <text
                    x={
                      150 +
                      95 *
                        Math.cos(((midAngle - 90) * Math.PI) / 180)
                    }
                    y={
                      150 +
                      95 *
                        Math.sin(((midAngle - 90) * Math.PI) / 180)
                    }
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={9}
                    fontWeight={600}
                    fill="#333"
                  >
                    {family.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

function describeArc(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number,
): string {
  const s1 = polarToXY(cx, cy, rOuter, startAngle);
  const e1 = polarToXY(cx, cy, rOuter, endAngle);
  const s2 = polarToXY(cx, cy, rInner, endAngle);
  const e2 = polarToXY(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

function polarToXY(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
