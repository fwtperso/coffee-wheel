import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WheelTypographic, generateProse } from './WheelTypographic';
import { FLAVOR_WHEEL } from '../../data/flavorWheel';
import type { TastingSession } from '../../types';

function makeSession(overrides: Partial<TastingSession> = {}): TastingSession {
  return {
    selectedNoteIds: [],
    guidedStep: 'aroma',
    reverseQuery: '',
    mode: 'type',
    ...overrides,
  };
}

describe('WheelTypographic', () => {
  it('renders step header "What do you smell?" on aroma step', () => {
    render(
      <WheelTypographic
        session={makeSession({ guidedStep: 'aroma' })}
        onToggleNote={vi.fn()}
        onSetGuidedStep={vi.fn()}
        onSetReverseQuery={vi.fn()}
      />,
    );
    expect(screen.getByText('What do you smell?')).toBeInTheDocument();
  });

  it('clicking a chip calls onToggleNote with correct noteId', () => {
    const onToggleNote = vi.fn();
    render(
      <WheelTypographic
        session={makeSession({ guidedStep: 'aroma' })}
        onToggleNote={onToggleNote}
        onSetGuidedStep={vi.fn()}
        onSetReverseQuery={vi.fn()}
      />,
    );
    const chip = screen.getByText('Blackberry');
    fireEvent.click(chip);
    expect(onToggleNote).toHaveBeenCalledWith('blackberry');
  });

  it('search input filters chips to matching notes only', () => {
    render(
      <WheelTypographic
        session={makeSession({ guidedStep: 'aroma', reverseQuery: 'lemon' })}
        onToggleNote={vi.fn()}
        onSetGuidedStep={vi.fn()}
        onSetReverseQuery={vi.fn()}
      />,
    );
    expect(screen.getByText('Lemon')).toBeInTheDocument();
    expect(screen.queryByText('Blackberry')).not.toBeInTheDocument();
  });

  it('reference panel opens and closes on toggle', () => {
    render(
      <WheelTypographic
        session={makeSession()}
        onToggleNote={vi.fn()}
        onSetGuidedStep={vi.fn()}
        onSetReverseQuery={vi.fn()}
      />,
    );
    const toggle = screen.getByText(/View flavor wheel/);
    const panel = toggle.parentElement!.querySelector('.wt-ref-panel')!;
    expect(panel).toHaveClass('wt-ref-panel--closed');
    fireEvent.click(toggle);
    expect(panel).toHaveClass('wt-ref-panel--open');
    fireEvent.click(toggle);
    expect(panel).toHaveClass('wt-ref-panel--closed');
  });
});

describe('generateProse', () => {
  it('returns correct sentence for 2 selected notes from different families', () => {
    const result = generateProse(['blackberry', 'jasmine'], FLAVOR_WHEEL);
    expect(result).toBe('Notes of blackberry, finishing with jasmine.');
  });

  it('returns empty string when no notes selected', () => {
    expect(generateProse([], FLAVOR_WHEEL)).toBe('');
  });

  it('returns single-family sentence for notes in same family', () => {
    const result = generateProse(['blackberry', 'raspberry'], FLAVOR_WHEEL);
    expect(result).toBe('Notes of blackberry and raspberry.');
  });
});
