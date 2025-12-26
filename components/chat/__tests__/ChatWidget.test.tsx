/**
 * ChatWidget Component Tests
 *
 * Unit tests for the AI chat widget component
 * Tests user interactions, API integration, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from '../ChatWidget';
import { getRandomOpeningPrompt } from '@/lib/api/system-prompts';

// Mock the system prompts module
jest.mock('@/lib/api/system-prompts', () => ({
  getRandomOpeningPrompt: jest.fn(() => 'What color lives between silence and sound?')
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ChatWidget', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    (fetch as jest.Mock).mockClear();
  });

  describe('Rendering', () => {
    test('renders FAB button on mount', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      expect(fabButton).toBeInTheDocument();
    });

    test('FAB button has correct styling and animation', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      expect(fabButton).toHaveClass('bg-brand-cyan');
      expect(fabButton).toHaveClass('rounded-full');
    });

    test('modal is hidden by default', () => {
      render(<ChatWidget />);
      const modal = screen.queryByRole('dialog');
      expect(modal).not.toBeInTheDocument();
    });

    test('modal opens when FAB is clicked', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Initial Greeting', () => {
    test('displays initial greeting message on first visit', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      expect(screen.getByText(/What color lives between silence and sound?/i)).toBeInTheDocument();
    });

    test('calls getRandomOpeningPrompt on first mount', () => {
      render(<ChatWidget />);
      expect(getRandomOpeningPrompt).toHaveBeenCalledTimes(1);
    });
  });

  describe('Message Input', () => {
    test('message input field is present when modal opens', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      expect(input).toBeInTheDocument();
    });

    test('user can type in the message input', async () => {
      const user = userEvent.setup();
      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
      await user.type(input, 'Hello AI');

      expect(input.value).toBe('Hello AI');
    });

    test('send button is disabled when input is empty', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const sendButton = screen.getByLabelText(/send message/i);
      expect(sendButton).toBeDisabled();
    });

    test('send button is enabled when input has text', async () => {
      const user = userEvent.setup();
      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      await user.type(input, 'Hello');

      const sendButton = screen.getByLabelText(/send message/i);
      expect(sendButton).not.toBeDisabled();
    });

    test('character counter updates as user types', async () => {
      const user = userEvent.setup();
      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      await user.type(input, 'Hello');

      expect(screen.getByText('5/500')).toBeInTheDocument();
    });
  });

  describe('Sending Messages', () => {
    test('displays user message after sending', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Test message');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });

    test('shows typing indicator while waiting for response', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ response: 'AI response', timestamp: Date.now() })
        }), 100))
      );

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Test');
      fireEvent.click(sendButton);

      // Check for typing indicator (animated dots)
      const typingDots = screen.getAllByRole('presentation', { hidden: true });
      expect(typingDots.length).toBeGreaterThan(0);
    });

    test('displays AI response after API call', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 'What texture does that feeling have?',
          timestamp: Date.now()
        })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'I feel blue');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/What texture does that feeling have?/i)).toBeInTheDocument();
      });
    });

    test('clears input field after sending message', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Test');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('API Integration', () => {
    test('makes POST request to /api/conversation/send', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Hello');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/conversation/send',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        );
      });
    });

    test('sends conversation history with message', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      // Send first message
      await user.type(input, 'First message');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('First message')).toBeInTheDocument();
      });

      // Send second message
      await user.type(input, 'Second message');
      fireEvent.click(sendButton);

      await waitFor(() => {
        const calls = (fetch as jest.Mock).mock.calls;
        const lastCall = calls[calls.length - 1];
        const body = JSON.parse(lastCall[1].body);
        expect(body.conversationHistory).toBeDefined();
        expect(body.conversationHistory.length).toBeGreaterThan(0);
      });
    });

    test('handles API errors gracefully', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Rate limit exceeded' })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Test');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/The resonance falters/i)).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    test('saves messages to localStorage', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      const sendButton = screen.getByLabelText(/send message/i);

      await user.type(input, 'Save this');
      fireEvent.click(sendButton);

      await waitFor(() => {
        const stored = localStorageMock.getItem('brightears-chat-history');
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.some((msg: any) => msg.content === 'Save this')).toBe(true);
      });
    });

    test('loads messages from localStorage on mount', () => {
      const mockMessages = [
        { role: 'assistant', content: 'Previous greeting', timestamp: Date.now() - 1000 },
        { role: 'user', content: 'Previous message', timestamp: Date.now() }
      ];
      localStorageMock.setItem('brightears-chat-history', JSON.stringify(mockMessages));

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      expect(screen.getByText('Previous greeting')).toBeInTheDocument();
      expect(screen.getByText('Previous message')).toBeInTheDocument();
    });

    test('clear history button removes all messages', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => true);

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const clearButton = screen.getByText(/clear history/i);
      await user.click(clearButton);

      await waitFor(() => {
        const stored = localStorageMock.getItem('brightears-chat-history');
        const parsed = JSON.parse(stored!);
        expect(parsed.length).toBe(1); // Only new greeting remains
      });
    });
  });

  describe('Accessibility', () => {
    test('modal has correct ARIA attributes', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'chat-title');
    });

    test('FAB has accessible label', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      expect(fabButton).toHaveAttribute('aria-label', 'Open AI chat');
    });

    test('input field has accessible label', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByLabelText(/message input/i);
      expect(input).toBeInTheDocument();
    });

    test('close button has accessible label', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const closeButton = screen.getByLabelText(/close chat/i);
      expect(closeButton).toBeInTheDocument();
    });

    test('modal closes on Escape key press', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('Enter key sends message', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'AI response', timestamp: Date.now() })
      });

      render(<ChatWidget />);

      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const input = screen.getByPlaceholderText(/type your message/i);
      await user.type(input, 'Test{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('modal has responsive classes', () => {
      render(<ChatWidget />);
      const fabButton = screen.getByLabelText(/open ai chat/i);
      fireEvent.click(fabButton);

      const modalContent = screen.getByRole('dialog').firstChild;
      expect(modalContent).toHaveClass('w-full');
      expect(modalContent).toHaveClass('md:w-[360px]');
    });
  });
});
