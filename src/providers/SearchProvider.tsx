'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchSuggestion {
  id: number;
  text: string;
}

export interface ArtistSuggestion {
  id: string | number;
  name: string;
  tag: string;
  avatar?: string;
  isVerify:boolean
}

export interface CategorySuggestion {
  id: string | number;
  title: string;
  image: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  showRecentSearches: boolean;
  setShowRecentSearches: (show: boolean) => void;
  searchSuggestions: SearchSuggestion[];
  setSearchSuggestions: (suggestions: SearchSuggestion[]) => void;
  artistSuggestions: ArtistSuggestion[];
  setArtistSuggestions: (suggestions: ArtistSuggestion[]) => void;
  categorySuggestions: CategorySuggestion[];
  setCategorySuggestions: (suggestions: CategorySuggestion[]) => void;
  recentSearchTags: string[];
  setRecentSearchTags: (tags: string[]) => void;
  recommendedCategories: CategorySuggestion[];
  setRecommendedCategories: (categories: CategorySuggestion[]) => void;
  popularCategories: CategorySuggestion[];
  setPopularCategories: (categories: CategorySuggestion[]) => void;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

const RECENT_SEARCHES_KEY = 'artverse_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [artistSuggestions, setArtistSuggestions] = useState<ArtistSuggestion[]>([]);
  const [recentSearchTags, setRecentSearchTags] = useState<string[]>([]);
  const [recommendedCategories, setRecommendedCategories] = useState<CategorySuggestion[]>([]);
  const [popularCategories, setPopularCategories] = useState<CategorySuggestion[]>([]);

  const clearSearch = () => {
    setSearchQuery('');
    setShowRecentSearches(true);
  };

  const addRecentSearch = (query: string) => {
    if (!query || query.trim().length < 2) return;

    const trimmedQuery = query.trim();
    const existing = recentSearchTags.filter(tag => tag !== trimmedQuery);
    const updated = [trimmedQuery, ...existing].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearchTags(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = (query: string) => {
    const updated = recentSearchTags.filter(tag => tag !== query);
    setRecentSearchTags(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const contextValue: SearchContextType = {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    showRecentSearches,
    setShowRecentSearches,
    searchSuggestions,
    setSearchSuggestions,
    artistSuggestions,
    setArtistSuggestions,
    categorySuggestions: recommendedCategories,
    setCategorySuggestions: setRecommendedCategories,
    recentSearchTags,
    setRecentSearchTags,
    recommendedCategories,
    setRecommendedCategories,
    popularCategories,
    setPopularCategories,
    clearSearch,
    addRecentSearch,
    removeRecentSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 