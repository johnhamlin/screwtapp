import React from 'react';
import { act } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test/renderWithProviders';

// Mock expo-router
jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    Stack: {
      Screen: ({ options }: { options: { title: string } }) =>
        React.createElement(Text, {}, options?.title),
    },
    Link: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, {}, children),
    useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  };
});

import Home from '../index';

describe('Home screen', () => {
  test('success state: renders mixtape items from API', async () => {
    const { findByText } = renderWithProviders(<Home />);

    // Transformed titles: "DJ Screw - X (YYYY)" → "X"
    expect(await findByText('Chapter 001: Tha Originator')).toBeOnTheScreen();
    expect(await findByText('Chapter 012: June 27th')).toBeOnTheScreen();
    expect(await findByText('All Screwed Up')).toBeOnTheScreen();
  });

  test('loading state: shows ActivityIndicator', async () => {
    const { getByRole } = renderWithProviders(<Home />);

    // ActivityIndicator has role 'progressbar' in react-native-paper
    expect(getByRole('progressbar')).toBeOnTheScreen();

    // Drain pending RTK Query microtasks within act() to prevent warnings
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
  });

  test('error state: shows error message on server error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    server.use(
      http.get('https://archive.org/services/search/v1/scrape', () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    const { findByText } = renderWithProviders(<Home />);

    expect(await findByText('Oh no! Error')).toBeOnTheScreen();

    consoleSpy.mockRestore();
  });

  test('empty state: renders nothing when items are empty', async () => {
    server.use(
      http.get('https://archive.org/services/search/v1/scrape', () => {
        return HttpResponse.json({ items: [], count: 0, total: 0 });
      }),
    );

    const { findByText, queryByText } = renderWithProviders(<Home />);

    // Wait for loading to finish — the ScrewTapp title is always present from Stack.Screen
    await findByText('ScrewTapp');

    // With empty items, the transform returns [], so no mixtape titles
    expect(queryByText('Chapter 001: Tha Originator')).not.toBeOnTheScreen();
    expect(queryByText('All Screwed Up')).not.toBeOnTheScreen();
  });
});
