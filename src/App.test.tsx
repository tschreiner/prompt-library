import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Prompt Hub overview with search and sorting controls', () => {
    render(<App />);
    expect(screen.getByText(/templates in der bibliothek/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/suche in titel, beschreibung, tags oder prompt-inhalt/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the github release preparation prompt', () => {
    render(<App />);
    expect(
      screen.getByText(/repository fuer github-veroeffentlichung vorbereiten/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/templates in der bibliothek/i)).toBeInTheDocument();
  });

  it('filters templates via the search field', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByPlaceholderText(/suche in titel, beschreibung, tags oder prompt-inhalt/i),
      'suno',
    );

    expect(screen.getByRole('heading', { name: /songwriting/i })).toBeInTheDocument();
    expect(screen.queryByText(/business-ideen-validierung/i)).not.toBeInTheDocument();
  });
});
