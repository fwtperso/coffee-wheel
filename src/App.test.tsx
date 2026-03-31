import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App mode switcher', () => {
  it('renders mode buttons without aura', () => {
    render(<App />);
    expect(screen.getByText('Animated Wheel')).toBeTruthy();
    expect(screen.getByText('Typographic')).toBeTruthy();
    expect(screen.queryByText('Aura Effect')).toBeNull();
  });
});
