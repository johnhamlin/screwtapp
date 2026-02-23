import type { MixtapeListResponse } from '@/features/mixtapeList/@types/mixtapeListApi';

export const mixtapeListFixture: MixtapeListResponse = {
  items: [
    {
      title: 'DJ Screw - Chapter 001: Tha Originator (1993)',
      date: '1993-01-01T00:00:00Z',
      creator: 'DJ Screw',
      identifier: 'dj-screw-chapter-001',
      downloads: 15000,
    },
    {
      title: 'DJ Screw - Chapter 012: June 27th (1996)',
      date: '1996-06-27T00:00:00Z',
      creator: 'DJ Screw',
      identifier: 'dj-screw-chapter-012',
      downloads: 42000,
    },
    {
      title: 'DJ Screw - All Screwed Up (1995)',
      date: '1995-01-01T00:00:00Z',
      creator: 'DJ Screw',
      identifier: 'dj-screw-all-screwed-up',
      downloads: 28000,
    },
  ],
  count: 3,
  total: 350,
};
