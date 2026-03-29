import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App mode switcher', () => {
  it('renders all three mode buttons', () => {
    render(<App />);
    expect(screen.getByText('Animated Wheel')).toBeTruthy();
    expect(screen.getByText('Aura Effect')).toBeTruthy();
    expect(screen.getByText('Typographic')).toBeTruthy();
  });

  it('switches to aura mode on click', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Aura Effect'));
    expect(screen.getByText('Aura Effect — coming soon')).toBeTruthy();
  });
});
