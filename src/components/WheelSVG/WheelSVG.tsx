import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { FLAVOR_WHEEL, searchNotes } from '../../data/flavorWheel';
import type { TastingSession, GuidedStep } from '../../types';
import './WheelSVG.css';

interface WheelSVGProps {
  session: TastingSession;
  onToggleNote: (noteId: string) => void;
  onSetGuidedStep: (step: GuidedStep) => void;
  onSetReverseQuery: (q: string) => void;
}

const CX = 350;
const CY = 350;
const R_INNER_START = 80;
const R_INNER_END = 150;
const R_MID_START = 150;
const R_MID_END = 220;
const R_OUTER_START = 220;
const R_OUTER_END = 290;
const R_LABEL = 310;

const GUIDED_MAP: Record<GuidedStep, string[]> = {
  aroma: ['fruity', 'floral', 'green-vegetative'],
  flavor: ['sweet', 'nutty-cocoa', 'spices', 'roasted'],
  finish: ['sour-fermented', 'sour', 'other'],
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

function lightenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * factor));
  const lg = Math.min(255, Math.round(g + (255 - g) * factor));
  const lb = Math.min(255, Math.round(b + (255 - b) * factor));
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function labelRotation(angleDeg: number): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  if (normalized > 90 && normalized < 270) {
    return angleDeg + 180;
  }
  return angleDeg;
}

const DECAY_FACTOR = 0.95;
const MIN_VELOCITY = 0.05;
const CLICK_THRESHOLD_DEG = 3;
const VELOCITY_HISTORY_SIZE = 5;
const MS_PER_FRAME_60FPS = 16;

interface VelocitySample {
  deg: number;
  dt: number;
}

function svgAngle(e: PointerEvent, svg: SVGSVGElement): number {
  const ctm = svg.getScreenCTM?.();
  if (!ctm || !svg.createSVGPoint) {
    return Math.atan2(e.clientY - CY, e.clientX - CX) * (180 / Math.PI);
  }
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const p = pt.matrixTransform(ctm.inverse());
  return Math.atan2(p.y - CY, p.x - CX) * (180 / Math.PI);
}

function wrapDelta(delta: number): number {
  return ((delta + 540) % 360) - 180;
}

function useWheelSpin() {
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const rotationRef = useRef(0);
  const dragStartRotation = useRef(0);
  const lastAngle = useRef(0);
  const lastTimestamp = useRef(0);
  const velocityHistory = useRef<VelocitySample[]>([]);
  const rafRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const wasDragSignificant = useRef(false);

  const cancelCoast = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const startCoast = useCallback((initialVelocity: number) => {
    let vel = initialVelocity;
    let currentRot = rotationRef.current;
    function frame() {
      vel *= DECAY_FACTOR;
      currentRot += vel;
      rotationRef.current = currentRot;
      setRotationDeg(currentRot);
      if (Math.abs(vel) > MIN_VELOCITY) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rafRef.current = 0;
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => cancelCoast, [cancelCoast]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    cancelCoast();
    if (svg.setPointerCapture) svg.setPointerCapture(e.pointerId);
    const angle = svgAngle(e.nativeEvent, svg);
    dragStartRotation.current = rotationRef.current;
    lastAngle.current = angle;
    lastTimestamp.current = e.timeStamp;
    velocityHistory.current = [];
    draggingRef.current = true;
    wasDragSignificant.current = false;
    setIsDragging(true);
  }, [cancelCoast]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    const currentAngle = svgAngle(e.nativeEvent, svg);
    const delta = wrapDelta(currentAngle - lastAngle.current);
    const newRot = rotationRef.current + delta;
    rotationRef.current = newRot;
    setRotationDeg(newRot);
    const dt = e.timeStamp - lastTimestamp.current;
    velocityHistory.current.push({ deg: delta, dt });
    if (velocityHistory.current.length > VELOCITY_HISTORY_SIZE) {
      velocityHistory.current.shift();
    }
    lastAngle.current = currentAngle;
    lastTimestamp.current = e.timeStamp;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const totalDelta = Math.abs(
      rotationRef.current - dragStartRotation.current,
    );
    if (totalDelta >= CLICK_THRESHOLD_DEG) {
      wasDragSignificant.current = true;
      const hist = velocityHistory.current;
      if (hist.length > 0) {
        const avgVel =
          hist.reduce((s, v) => s + v.deg / (v.dt || MS_PER_FRAME_60FPS), 0) /
          hist.length;
        startCoast(avgVel * MS_PER_FRAME_60FPS);
      }
    }
  }, [startCoast]);

  const shouldSuppressClick = useCallback(() => {
    const was = wasDragSignificant.current;
    wasDragSignificant.current = false;
    return was;
  }, []);

  return {
    rotationDeg,
    isDragging,
    svgRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shouldSuppressClick,
  };
}

export default function WheelSVG({ session, onToggleNote, onSetGuidedStep, onSetReverseQuery }: WheelSVGProps) {
  const {
    rotationDeg,
    isDragging,
    svgRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shouldSuppressClick,
  } = useWheelSpin();

  const matchingNoteIds = useMemo(() => {
    if (!session.reverseQuery) return new Set<string>();
    return new Set(searchNotes(session.reverseQuery).map(n => n.id));
  }, [session.reverseQuery]);

  const hasSelection = session.selectedNoteIds.length > 0;
  const hasSearch = session.reverseQuery.length > 0;
  const relevantFamilies = GUIDED_MAP[session.guidedStep];

  const totalNotes = FLAVOR_WHEEL.reduce(
    (sum, f) => sum + f.subCategories.reduce((s2, sc) => s2 + sc.notes.length, 0),
    0,
  );

  const handleNoteClick = useCallback((noteId: string) => {
    if (shouldSuppressClick()) return;
    onToggleNote(noteId);
  }, [shouldSuppressClick, onToggleNote]);

  let familyAngleOffset = 0;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 700 700"
        width="100%"
        height="100%"
        className={isDragging ? 'wheel-svg--grabbing' : 'wheel-svg--grab'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-testid="wheel-svg"
      >
        <defs>
          <filter id="glow-selected">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fff" floodOpacity="0.8" />
          </filter>
        </defs>

        <g transform={`rotate(${rotationDeg}, ${CX}, ${CY})`}>
        {/* White center circle */}
        <circle cx={CX} cy={CY} r={R_INNER_START} fill="#fff" />

        {FLAVOR_WHEEL.map((family) => {
          const familyNoteCount = family.subCategories.reduce((s, sc) => s + sc.notes.length, 0);
          const familySpan = (familyNoteCount / totalNotes) * 360;
          const familyStart = familyAngleOffset;
          const familyEnd = familyAngleOffset + familySpan;
          familyAngleOffset = familyEnd;

          const guidedDim = !relevantFamilies.includes(family.id);
          const familyMidAngle = midAngle(familyStart, familyEnd);
          const familyLabelPos = polarToCartesian(CX, CY, (R_INNER_START + R_INNER_END) / 2, familyMidAngle);

          let subAngleOffset = familyStart;

          return (
            <g key={family.id}>
              {/* Inner ring: family segment */}
              <path
                data-testid={`family-${family.id}`}
                className={`wheel-segment${guidedDim ? ' wheel-segment--guided-dim' : ''}`}
                d={arcPath(CX, CY, R_INNER_START, R_INNER_END, familyStart, familyEnd)}
                fill={family.color}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                className="wheel-label"
                x={familyLabelPos.x}
                y={familyLabelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontWeight="bold"
                fontSize={12}
                transform={`rotate(${labelRotation(familyMidAngle - 90)}, ${familyLabelPos.x}, ${familyLabelPos.y})`}
              >
                {family.label}
              </text>

              {/* Middle ring: sub-category segments */}
              {family.subCategories.map((sub) => {
                const subSpan = (sub.notes.length / totalNotes) * 360;
                const subStart = subAngleOffset;
                const subEnd = subAngleOffset + subSpan;
                subAngleOffset = subEnd;

                const subMidAngle = midAngle(subStart, subEnd);
                const subLabelPos = polarToCartesian(CX, CY, (R_MID_START + R_MID_END) / 2, subMidAngle);
                const subColor = lightenColor(family.color, 0.25);

                const noteAngleSize = subSpan / sub.notes.length;

                return (
                  <g key={sub.id}>
                    <path
                      data-testid={`sub-${sub.id}`}
                      className={`wheel-segment${guidedDim ? ' wheel-segment--guided-dim' : ''}`}
                      d={arcPath(CX, CY, R_MID_START, R_MID_END, subStart, subEnd)}
                      fill={subColor}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <text
                      className="wheel-label wheel-label--sub"
                      x={subLabelPos.x}
                      y={subLabelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={9}
                      transform={`rotate(${labelRotation(subMidAngle - 90)}, ${subLabelPos.x}, ${subLabelPos.y})`}
                    >
                      {sub.label}
                    </text>

                    {/* Outer ring: note segments + external labels */}
                    {sub.notes.map((note, ni) => {
                      const noteStart = subStart + ni * noteAngleSize;
                      const noteEnd = noteStart + noteAngleSize;
                      const noteMidAngle = midAngle(noteStart, noteEnd);
                      const noteColor = lightenColor(family.color, 0.4);
                      const isSelected = session.selectedNoteIds.includes(note.id);
                      const isMatch = hasSearch && matchingNoteIds.has(note.id);
                      const isDimmedBySelection = hasSelection && !isSelected;
                      const isDimmedBySearch = hasSearch && !isMatch;

                      let cls = 'wheel-segment';
                      if (isSelected) cls += ' wheel-segment--selected';
                      if (isDimmedBySelection || isDimmedBySearch) cls += ' wheel-segment--dimmed';
                      if (isMatch) cls += ' wheel-segment--highlighted';
                      if (guidedDim) cls += ' wheel-segment--guided-dim';

                      const externalLabelPos = polarToCartesian(CX, CY, R_LABEL, noteMidAngle);
                      const rawRotation = noteMidAngle - 90;
                      const normalized = ((noteMidAngle % 360) + 360) % 360;
                      const flipLabel = normalized > 90 && normalized < 270;
                      const textRotation = flipLabel ? rawRotation + 180 : rawRotation;
                      const textAnchor = flipLabel ? 'end' : 'start';

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
                            onClick={() => handleNoteClick(note.id)}
                          />
                          <text
                            className="wheel-label wheel-label--external"
                            x={externalLabelPos.x}
                            y={externalLabelPos.y}
                            textAnchor={textAnchor}
                            dominantBaseline="central"
                            fill={family.color}
                            fontSize={10}
                            transform={`rotate(${textRotation}, ${externalLabelPos.x}, ${externalLabelPos.y})`}
                          >
                            {note.label}
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
        </g>
      </svg>
    </div>
  );
}
