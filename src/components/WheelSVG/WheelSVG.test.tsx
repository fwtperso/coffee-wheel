import { render, screen } from '@testing-library/react';
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
