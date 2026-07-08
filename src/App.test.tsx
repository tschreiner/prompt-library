import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Prompt Hub overview without filter controls', () => {
    render(<App />);
    expect(screen.getByText(/templates in der bibliothek/i)).toBeInTheDocument();
    expect(screen.queryByText(/yaml source of truth/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/in pruefung/i)).not.toBeInTheDocument();
  });

  it('renders the github release preparation prompt', () => {
    render(<App />);
    expect(
      screen.getByText(/repository fuer github-veroeffentlichung vorbereiten/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/templates in der bibliothek/i)).toBeInTheDocument();
  });
});
