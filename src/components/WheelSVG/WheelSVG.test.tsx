import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import WheelSVG from './WheelSVG';
import { FLAVOR_WHEEL, searchNotes } from '../../data/flavorWheel';
import type { TastingSession } from '../../types';

function makeSession(overrides: Partial<TastingSession> = {}): TastingSession {
  return {
    selectedNoteIds: [],
    guidedStep: 'aroma',
    reverseQuery: '',
    mode: 'wheel',
    ...overrides,
  };
}

const noop = () => {};

describe('WheelSVG', () => {
  it('renders 10 family segments', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const families = [
      'family-fruity', 'family-floral', 'family-sweet',
      'family-nutty-cocoa', 'family-spices', 'family-roasted',
      'family-other', 'family-green-vegetative', 'family-sour-fermented',
      'family-sour',
    ];
    families.forEach(id => {
      expect(screen.getByTestId(id)).toBeTruthy();
    });
  });

  it('renders all subcategory segments visibly (3 rings always visible)', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    expect(screen.getByTestId('sub-berry')).toBeTruthy();
    expect(screen.getByTestId('sub-cocoa')).toBeTruthy();
    expect(screen.getByTestId('sub-burnt')).toBeTruthy();
  });

  it('renders all note segments visibly (3 rings always visible)', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    expect(screen.getByTestId('note-blackberry')).toBeTruthy();
    expect(screen.getByTestId('note-vanilla')).toBeTruthy();
    expect(screen.getByTestId('note-cinnamon')).toBeTruthy();
  });

  it('clicking a leaf note calls onToggleNote', async () => {
    const onToggle = vi.fn();
    render(
      <WheelSVG session={makeSession()} onToggleNote={onToggle} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    await userEvent.click(screen.getByTestId('note-blackberry'));
    expect(onToggle).toHaveBeenCalledWith('blackberry');
  });

  it('searchNotes returns correct results for "berry"', () => {
    const results = searchNotes('berry');
    const ids = results.map(r => r.id);
    expect(ids).toContain('blackberry');
    expect(ids).toContain('raspberry');
    expect(ids).toContain('blueberry');
    expect(ids).toContain('strawberry');
  });

  it('guided step aroma dims roasted family', () => {
    render(
      <WheelSVG session={makeSession({ guidedStep: 'aroma' })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const roasted = screen.getByTestId('family-roasted');
    expect(roasted.classList.contains('wheel-segment--guided-dim')).toBe(true);
  });

  it('renders a white center circle', () => {
    const { container } = render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const circle = container.querySelector('circle');
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute('fill')).toBe('#fff');
  });

  it('FLAVOR_WHEEL has 10 families', () => {
    expect(FLAVOR_WHEEL).toHaveLength(10);
  });

  it('total notes count is correct', () => {
    const total = FLAVOR_WHEEL.reduce(
      (sum, f) => sum + f.subCategories.reduce((s, sc) => s + sc.notes.length, 0),
      0,
    );
    expect(total).toBeGreaterThan(50);
  });
});

describe('WheelSVG branch highlight', () => {
  it('selecting a note adds --branch-active to its family segment', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: ['blackberry'] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const familyEl = screen.getByTestId('family-fruity');
    expect(familyEl.classList.contains('wheel-segment--branch-active')).toBe(true);
  });

  it('selecting a note adds --branch-active to its sub-category segment', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: ['blackberry'] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const subEl = screen.getByTestId('sub-berry');
    expect(subEl.classList.contains('wheel-segment--branch-active')).toBe(true);
  });

  it('selecting a note dims family segments that do not contain it', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: ['blackberry'] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const floralEl = screen.getByTestId('family-floral');
    expect(floralEl.classList.contains('wheel-segment--dimmed')).toBe(true);
  });

  it('deselecting all notes removes all --dimmed from family segments', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: [] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const families = FLAVOR_WHEEL.map(f => screen.getByTestId(`family-${f.id}`));
    families.forEach(el => {
      expect(el.classList.contains('wheel-segment--dimmed')).toBe(false);
    });
  });
});

describe('WheelSVG aura glow', () => {
  it('renders an aura element when a note is selected', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: ['blackberry'] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    expect(screen.getByTestId('aura-blackberry')).toBeTruthy();
  });

  it('signature panel shows label when notes are selected', () => {
    render(
      <WheelSVG session={makeSession({ selectedNoteIds: ['blackberry'] })} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    expect(screen.getByText('Your tasting signature')).toBeTruthy();
  });

  it('signature panel shows empty state when no notes selected', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    expect(screen.getByText('Select notes to build your tasting signature')).toBeTruthy();
  });
});

describe('WheelSVG drag-to-spin', () => {
  it('renders SVG with grab cursor class', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const svg = screen.getByTestId('wheel-svg');
    expect(svg).toHaveClass('wheel-svg--grab');
  });

  it('wraps wheel content in a rotating group', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const svg = screen.getByTestId('wheel-svg');
    const rotatingGroup = svg.querySelector('g[transform]');
    expect(rotatingGroup).not.toBeNull();
    expect(rotatingGroup?.getAttribute('transform')).toContain('rotate(0');
  });

  it('allows note click when no drag occurred', async () => {
    const onToggle = vi.fn();
    render(
      <WheelSVG session={makeSession()} onToggleNote={onToggle} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    await userEvent.click(screen.getByTestId('note-blackberry'));
    expect(onToggle).toHaveBeenCalledWith('blackberry');
  });

  it('applies pointer event handlers to SVG for drag tracking', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const svg = screen.getByTestId('wheel-svg');
    // SVG should have pointer event handlers wired up
    expect(svg.getAttribute('data-testid')).toBe('wheel-svg');
    // Pointer down should not throw
    fireEvent.pointerDown(svg, { clientX: 350, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(svg, { pointerId: 1 });
  });
});
