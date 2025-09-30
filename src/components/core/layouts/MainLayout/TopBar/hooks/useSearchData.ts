'use client';

import { useSearch } from '@/providers/SearchProvider';
import { useEffect } from 'react';
import artworkService from '@/services/artwork.service';

const RECENT_SEARCHES_KEY = 'artverse_recent_searches';

export const useSearchData = () => {
  const {
    searchQuery,
    setSearchSuggestions,
    setArtistSuggestions,
    setRecentSearchTags,
    setRecommendedCategories,
    setPopularCategories
  } = useSearch();

  // Load initial data (categories and recent searches from localStorage)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load categories from backend
        const categories = await artworkService.getCategories();

        // Filter out categories without thumbnails (no artworks)
        const categoriesWithThumbnails = categories.filter(cat => cat.thumbnail);

        // Sort by artwork count for recommended (descending)
        const sortedByCount = [...categoriesWithThumbnails].sort((a, b) =>
          (b._count?.artworks || 0) - (a._count?.artworks || 0)
        );

        // Map to UI format (keep string IDs for proper routing, use real thumbnails)
        const recommendedCategories = sortedByCount.slice(0, 13).map(cat => ({
          id: cat.id,
          title: cat.name,
          image: cat.thumbnail || '/images/recommend/rcm-life.png',
        }));

        const popularCategories = sortedByCount.slice(0, 8).map(cat => ({
          id: cat.id,
          title: cat.name,
          image: cat.thumbnail || '/images/recommend/rcm-life.png',
        }));

        setRecommendedCategories(recommendedCategories);
        setPopularCategories(popularCategories);

        // Load recent searches from localStorage
        const recentSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (recentSearches) {
          const parsed = JSON.parse(recentSearches);
          setRecentSearchTags(parsed);
        }
      } catch (error) {
        console.error('Error loading initial search data:', error);
      }
    };

    loadInitialData();
  }, [setRecommendedCategories, setPopularCategories, setRecentSearchTags]);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        setArtistSuggestions([]);
        return;
      }

      try {
        // Fetch suggestions from backend
        const [suggestions, searchResults] = await Promise.all([
          artworkService.getSearchSuggestions({ q: searchQuery, limit: 5 }),
          artworkService.search({ q: searchQuery, limit: 3 })
        ]);

        // Map suggestions to UI format (filter out empty titles)
        const mappedSuggestions = suggestions
          .filter(s => s.title && s.title.trim())
          .map((s, idx) => ({
            id: idx + 1,
            text: s.title,
          }));

        // Map artists to UI format (keep string IDs for proper routing)
        const mappedArtists = searchResults.artists.map((artist) => ({
          id: artist.id,
          name: `${artist.firstName} ${artist.lastName}`,
          tag: 'Artist',
          avatar: artist.avatar || '/images/default-avatar.png',
          isVerify: true,
        }));

        setSearchSuggestions(mappedSuggestions);
        setArtistSuggestions(mappedArtists);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, setSearchSuggestions, setArtistSuggestions]);
} 