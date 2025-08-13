'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchSuggestion {
  id: number;
  text: string;
}

export interface ArtistSuggestion {
  id: number;
  name: string;
  tag: string;
  avatar?: string;
  isVerify:boolean
}

export interface CategorySuggestion {
  id: number;
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
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

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