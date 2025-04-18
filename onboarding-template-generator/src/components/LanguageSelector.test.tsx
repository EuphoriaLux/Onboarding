import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from './LanguageSelector';
import { Language } from '../services/i18n'; // Adjusted path based on component

describe('LanguageSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    // Reset mock function calls before each test
    mockOnChange.mockClear();
  });

  it('should render the label and select dropdown', () => {
    render(<LanguageSelector selectedLanguage="en" onChange={mockOnChange} />);

    // Check if the label exists
    expect(screen.getByLabelText(/Template Language:/i)).toBeInTheDocument();

    // Check if the select dropdown exists
    const selectElement = screen.getByRole('combobox', { name: /Template Language:/i });
    expect(selectElement).toBeInTheDocument();
  });

  it('should display the correct initial selected language', () => {
    render(<LanguageSelector selectedLanguage="fr" onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox', { name: /Template Language:/i }) as HTMLSelectElement;
    expect(selectElement.value).toBe('fr');
    
    // Check the selected option text
    const selectedOption = screen.getByRole('option', { name: 'Français' }) as HTMLOptionElement;
    expect(selectedOption.selected).toBe(true);
  });

  it('should list all available language options', () => {
    render(<LanguageSelector selectedLanguage="en" onChange={mockOnChange} />);

    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Français' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Deutsch' })).toBeInTheDocument();
  });

  it('should call the onChange handler when a different language is selected', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector selectedLanguage="en" onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox', { name: /Template Language:/i });

    // Simulate user selecting 'Deutsch'
    await user.selectOptions(selectElement, 'de');

    // Check if onChange was called correctly
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('de');
  });
});
