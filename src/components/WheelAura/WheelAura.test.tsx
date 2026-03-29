import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WheelAura from './WheelAura';
import type { TastingSession } from '../../types';

function makeSession(overrides: Partial<TastingSession> = {}): TastingSession {
  return {
    selectedNoteIds: [],
    guidedStep: 'aroma',
    reverseQuery: '',
    mode: 'aura',
    ...overrides,
  };
}

const noop = () => {};

describe('WheelAura', () => {
  it('renders all 10 family labels', () => {
    render(
      <WheelAura
        session={makeSession()}
        onToggleNote={noop}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    const expectedLabels = [
      'Fruity', 'Floral', 'Sweet', 'Nutty/Cocoa',
      'Spices', 'Roasted', 'Other', 'Green/Veg',
      'Sour/Fermented', 'Sour',
    ];

    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('selecting a note adds an aura element to the DOM', () => {
    const { container } = render(
      <WheelAura
        session={makeSession({ selectedNoteIds: ['blackberry'] })}
        onToggleNote={noop}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    const aura = container.querySelector('[data-testid="aura-blackberry"]');
    expect(aura).toBeInTheDocument();
  });

  it('signature bar shows "Your tasting signature" when notes are selected', () => {
    render(
      <WheelAura
        session={makeSession({ selectedNoteIds: ['blackberry'] })}
        onToggleNote={noop}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    expect(screen.getByText('Your tasting signature')).toBeInTheDocument();
  });

  it('guided step "flavor" dims fruity family', () => {
    const { container } = render(
      <WheelAura
        session={makeSession({ guidedStep: 'flavor', selectedNoteIds: ['vanilla'] })}
        onToggleNote={noop}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    const fruitySegment = container.querySelector('[data-testid="family-fruity"]');
    expect(fruitySegment).toHaveClass('wheel-aura__segment--dimmed');
  });

  it('calls onToggleNote when a leaf note is clicked', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <WheelAura
        session={makeSession()}
        onToggleNote={onToggle}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    const note = container.querySelector('[data-testid="note-blackberry"]');
    expect(note).toBeInTheDocument();
    fireEvent.click(note!);
    expect(onToggle).toHaveBeenCalledWith('blackberry');
  });

  it('shows empty signature message when no notes selected', () => {
    render(
      <WheelAura
        session={makeSession()}
        onToggleNote={noop}
        onSetGuidedStep={noop}
        onSetReverseQuery={noop}
      />,
    );

    expect(screen.getByText('Select notes to build your signature')).toBeInTheDocument();
  });
});
