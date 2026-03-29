import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import WheelSVG from './WheelSVG';
import { searchNotes } from '../../data/flavorWheel';
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
  it('renders 9 family segments', () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    const families = [
      'family-fruity', 'family-floral', 'family-sweet',
      'family-nutty-cocoa', 'family-spices', 'family-roasted',
      'family-green-vegetative', 'family-other', 'family-fermented',
    ];
    families.forEach(id => {
      expect(screen.getByTestId(id)).toBeTruthy();
    });
  });

  it('clicking a family expands it', async () => {
    render(
      <WheelSVG session={makeSession()} onToggleNote={noop} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    // Before click, no subcategory visible
    expect(screen.queryByTestId('sub-berry')).toBeNull();
    // Click fruity family
    await userEvent.click(screen.getByTestId('family-fruity'));
    // Now subcategory should be visible
    expect(screen.getByTestId('sub-berry')).toBeTruthy();
  });

  it('clicking a leaf note calls onToggleNote', async () => {
    const onToggle = vi.fn();
    render(
      <WheelSVG session={makeSession()} onToggleNote={onToggle} onSetGuidedStep={noop} onSetReverseQuery={noop} />
    );
    // Expand fruity family first
    await userEvent.click(screen.getByTestId('family-fruity'));
    // Click a leaf note
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
});
