import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoodSelector from './MoodSelector';

describe('MoodSelector', () => {
  describe('Rendering', () => {
    it('should render all 5 mood options', () => {
      render(<MoodSelector />);

      expect(screen.getByRole('button', { name: /energetic mood/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /romantic mood/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /happy mood/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calming mood/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /partying mood/i })).toBeInTheDocument();
    });

    it('should render with tablist role for accessibility', () => {
      render(<MoodSelector />);

      const tablist = screen.getByRole('tablist', { name: /mood selector/i });
      expect(tablist).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
      const { container } = render(<MoodSelector className="custom-class" />);

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should select a mood when clicked', () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });
      fireEvent.click(energeticButton);

      expect(energeticButton).toHaveAttribute('aria-selected', 'true');
    });

    it('should call onMoodChange callback when mood is selected', () => {
      const handleMoodChange = jest.fn();
      render(<MoodSelector onMoodChange={handleMoodChange} />);

      const happyButton = screen.getByRole('button', { name: /happy mood/i });
      fireEvent.click(happyButton);

      expect(handleMoodChange).toHaveBeenCalledWith('happy');
      expect(handleMoodChange).toHaveBeenCalledTimes(1);
    });

    it('should change selection when clicking different moods', () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });
      const calmingButton = screen.getByRole('button', { name: /calming mood/i });

      fireEvent.click(energeticButton);
      expect(energeticButton).toHaveAttribute('aria-selected', 'true');
      expect(calmingButton).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(calmingButton);
      expect(energeticButton).toHaveAttribute('aria-selected', 'false');
      expect(calmingButton).toHaveAttribute('aria-selected', 'true');
    });

    it('should set default mood when provided', () => {
      render(<MoodSelector defaultMood="romantic" />);

      const romanticButton = screen.getByRole('button', { name: /romantic mood/i });
      expect(romanticButton).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should select mood when Enter key is pressed', () => {
      const handleMoodChange = jest.fn();
      render(<MoodSelector onMoodChange={handleMoodChange} />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });
      energeticButton.focus();
      fireEvent.keyDown(energeticButton, { key: 'Enter', code: 'Enter' });

      expect(handleMoodChange).toHaveBeenCalledWith('energetic');
      expect(energeticButton).toHaveAttribute('aria-selected', 'true');
    });

    it('should select mood when Space key is pressed', () => {
      const handleMoodChange = jest.fn();
      render(<MoodSelector onMoodChange={handleMoodChange} />);

      const calmingButton = screen.getByRole('button', { name: /calming mood/i });
      calmingButton.focus();
      fireEvent.keyDown(calmingButton, { key: ' ', code: 'Space' });

      expect(handleMoodChange).toHaveBeenCalledWith('calming');
      expect(calmingButton).toHaveAttribute('aria-selected', 'true');
    });

    it('should have tabIndex 0 for all mood buttons', () => {
      render(<MoodSelector />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Hover Behavior', () => {
    it('should show BPM info on hover', async () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });

      // Initially, BPM might not be visible
      fireEvent.mouseEnter(energeticButton);

      // BPM should appear on hover
      await waitFor(() => {
        expect(screen.getByText('120-140 BPM')).toBeInTheDocument();
      });
    });

    it('should hide BPM info when mouse leaves', async () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });

      fireEvent.mouseEnter(energeticButton);
      await waitFor(() => {
        expect(screen.getByText('120-140 BPM')).toBeInTheDocument();
      });

      fireEvent.mouseLeave(energeticButton);
      await waitFor(() => {
        expect(screen.queryByText('120-140 BPM')).not.toBeInTheDocument();
      });
    });
  });

  describe('Visual States', () => {
    it('should display color indicator for each mood', () => {
      const { container } = render(<MoodSelector />);

      // Check that color dots are rendered (5 moods = 5 dots)
      const colorDots = container.querySelectorAll('span[style*="background-color"]');
      expect(colorDots).toHaveLength(5);
    });

    it('should apply correct colors to mood indicators', () => {
      const { container } = render(<MoodSelector />);

      const colorDots = container.querySelectorAll('span[style*="background-color"]');

      expect(colorDots[0]).toHaveStyle('background-color: #FF6B35'); // Energetic
      expect(colorDots[1]).toHaveStyle('background-color: #8B4513'); // Romantic
      expect(colorDots[2]).toHaveStyle('background-color: #FFD700'); // Happy
      expect(colorDots[3]).toHaveStyle('background-color: #00bbe4'); // Calming
      expect(colorDots[4]).toHaveStyle('background-color: #d59ec9'); // Partying
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels with BPM info', () => {
      render(<MoodSelector />);

      expect(screen.getByRole('button', { name: 'Energetic mood, 120-140 BPM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Romantic mood, 60-80 BPM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Happy mood, 100-120 BPM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Calming mood, 50-80 BPM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Partying mood, 120-140 BPM' })).toBeInTheDocument();
    });

    it('should update aria-selected when mood changes', () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });
      const happyButton = screen.getByRole('button', { name: /happy mood/i });

      // Initially, no mood is selected
      expect(energeticButton).toHaveAttribute('aria-selected', 'false');
      expect(happyButton).toHaveAttribute('aria-selected', 'false');

      // Select energetic
      fireEvent.click(energeticButton);
      expect(energeticButton).toHaveAttribute('aria-selected', 'true');
      expect(happyButton).toHaveAttribute('aria-selected', 'false');

      // Select happy
      fireEvent.click(happyButton);
      expect(energeticButton).toHaveAttribute('aria-selected', 'false');
      expect(happyButton).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-live region for BPM announcements', async () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });
      fireEvent.mouseEnter(energeticButton);

      await waitFor(() => {
        const bpmText = screen.getByText('120-140 BPM');
        expect(bpmText).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mood changes', () => {
      const handleMoodChange = jest.fn();
      render(<MoodSelector onMoodChange={handleMoodChange} />);

      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        fireEvent.click(button);
      });

      expect(handleMoodChange).toHaveBeenCalledTimes(5);
    });

    it('should not break when no callback is provided', () => {
      render(<MoodSelector />);

      const energeticButton = screen.getByRole('button', { name: /energetic mood/i });

      expect(() => {
        fireEvent.click(energeticButton);
      }).not.toThrow();
    });

    it('should handle invalid defaultMood gracefully', () => {
      render(<MoodSelector defaultMood="invalid-mood" />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-selected', 'false');
      });
    });
  });
});
