'use client';

import { useSearch } from '@/providers/SearchProvider';
import { useEffect } from 'react';

export const useSearchData = () => {
  const {
    setSearchSuggestions,
    setArtistSuggestions,
    setRecentSearchTags,
    setRecommendedCategories,
    setPopularCategories
  } = useSearch();

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setSearchSuggestions([
          { id: 1, text: 'Princess and prince' },
          { id: 2, text: 'Princess and prince something more here' },
          { id: 3, text: 'Princess and prince something more here lorem ipsum' },
          { id: 4, text: 'Princess and prince on the forest' },
          { id: 5, text: 'Princess and prince on river' },
        ]);

        setArtistSuggestions([
          {
            id: 101,
            name: 'Princess Anna',
            tag: 'Artist',
            avatar: '/images/artAnna.png',
            isVerify: true,
          },
          {
            id: 102,
            name: 'Princess Anna',
            tag: 'Artist',
            avatar: '/images/artAnna.png',
            isVerify: true,
          },
        ]);

        setRecentSearchTags([
          'Search Tag', 'Search Tag', 'Search Tag', 'Search Tag', 'Search Tag'
        ]);

        setRecommendedCategories([
          { id: 1, title: 'Still life artwork', image: '/images/recommend/rcm-life.png' },
          { id: 2, title: 'Classic', image: '/images/recommend/rcm-classic.png' },
          { id: 3, title: 'City arts', image: '/images/recommend/rcm-classic.png' },
          { id: 4, title: 'Strange', image: '/images/recommend/rcm-life.png' },
          { id: 5, title: 'Space arts', image: '/images/recommend/rcm-life.png' },
          { id: 6, title: 'Nature mom', image: '/images/recommend/rcm-life.png' },
          { id: 7, title: 'Today trend', image: '/images/recommend/rcm-life.png' },
          { id: 8, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 9, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 10, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 11, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 12, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 13, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
        ]);

        setPopularCategories([
          { id: 1, title: 'Classic', image: '/images/recommend/rcm-life.png' },
          { id: 2, title: 'City arts', image: '/images/recommend/rcm-life.png' },
          { id: 3, title: 'Robot artwork', image: '/images/recommend/rcm-life.png' },
          { id: 4, title: 'Strange', image: '/images/recommend/rcm-life.png' },
          { id: 5, title: 'Space arts', image: '/images/recommend/rcm-life.png' },
          { id: 6, title: 'Today trend', image: '/images/recommend/rcm-life.png' },
          { id: 7, title: 'Still life artwork', image: '/images/recommend/rcm-life.png' },
          { id: 8, title: 'Nature mom', image: '/images/recommend/rcm-life.png' },
        ]);

      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };

    fetchSearchData();
  }, [setSearchSuggestions, setArtistSuggestions, setRecentSearchTags, setRecommendedCategories, setPopularCategories]);
} 