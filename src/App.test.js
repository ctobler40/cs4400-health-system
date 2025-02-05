import React from 'react';
import { render, screen, act } from '@testing-library/react';  // <--- Import act here
import axios from 'axios';
import App from './App';
import '@testing-library/jest-dom';

// Mock the axios get method
jest.mock('axios');

// TODO: Improve test cases and functioning
describe('App component', () => {
  test('handles API error', async () => {
    // Mock Axios to return an error
    axios.get.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<App />);
    });

    // You can add assertions here if you handle errors in the UI
    // For example, check for an error message or specific behavior
  });
});
