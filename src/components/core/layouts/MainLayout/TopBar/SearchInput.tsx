'use client';

import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';
import { useRef, useEffect } from 'react';
import { useSearch } from '@/providers/SearchProvider';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteIcon } from '@/components/common/icons/DeleteIcon';
import SealCheckUrl from "@/components/common/icons/SealCheck.svg";
import { getUserAvatarUrl } from '@/utils/imageUtils';

export const SearchInput = () => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    searchSuggestions,
    artistSuggestions,
    recentSearchTags,
    recommendedCategories,
    popularCategories,
  } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchFocused]);

  return (
    <div className='flex-1' ref={searchRef}>
      <div className='relative'>
        <MagnifyingGlassIcon
          className='absolute left-4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#9C27B0]'
          size={20}
        />
        <input
          type='text'
          placeholder='Search'
          className='w-full pl-10 rounded-md bg-[#F5F5F5] dark:bg-opacity-10 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C27B0] text-md px-[16px] py-[12px]'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
        />
      </div>

      {isSearchFocused && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 mt-3 bg-[#FFFFFF]/70 dark:bg-[#1E1B26]/90 rounded-[12px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] z-50 overflow-hidden backdrop-blur-sm'
          style={{
            width: 'calc(100% - 12px)',
            marginRight: '12px'
          }}
        >
          {searchQuery && (
            <div>
              <div className='p-[11px] gap-[11px] flex flex-col'>
                {searchSuggestions.map((suggestion) => {
                  const text = suggestion.text;
                  const searchLower = searchQuery.toLowerCase();
                  const textLower = text.toLowerCase();
                  const matchIndex = textLower.indexOf(searchLower);

                  if (matchIndex !== -1) {
                    const beforeMatch = text.substring(0, matchIndex);
                    const match = text.substring(matchIndex, matchIndex + searchQuery.length);
                    const afterMatch = text.substring(matchIndex + searchQuery.length);

                    return (
                      <button
                        key={suggestion.id}
                        className='flex items-center w-full text-left px-[11px] py-[11px] hover:bg-gray-200 dark:hover:bg-black rounded-md dark:text-white transition-all'
                        onClick={() => setSearchQuery(suggestion.text)}
                      >
                        <MagnifyingGlassIcon className='mr-[11px] text-black dark:text-white' size={16} />
                        <div className="flex-1 text-black dark:text-white">
                          {beforeMatch}
                          <span className='text-purple-600 dark:text-purple-400 font-medium'>{match}</span>
                          {afterMatch}
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={suggestion.id}
                      className='flex items-center w-full text-left px-[11px] py-[11px] hover:bg-gray-200 dark:hover:bg-black rounded-md dark:text-white'
                      onClick={() => setSearchQuery(suggestion.text)}
                    >
                      <MagnifyingGlassIcon className='mr-[11px] text-black dark:text-white' size={16} />
                      <div className="flex-1 text-black dark:text-white">{text}</div>
                    </button>
                  );
                })}
              </div>

              <div className='p-[11px] gap-[11px] flex flex-col'>
                {artistSuggestions.map((artist) => (
                  <Link
                    href={`/artist/${artist.id}`}
                    key={artist.id}
                    className='flex items-center px-[11px] py-[12px] hover:bg-gray-200 dark:hover:bg-black rounded-md transition-all'
                  >
                    <div className='w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 mr-[11px] overflow-hidden'>
                      {getUserAvatarUrl(artist.avatar) ?
                        <Image
                          src={getUserAvatarUrl(artist.avatar)!}
                          alt="artist"
                          width={38}
                          height={38}
                          className='object-cover w-full h-full'
                        />
                        :
                        <div className='w-full h-full flex items-center justify-center text-xs dark:text-white'>
                          {artist.name.charAt(0)}
                        </div>
                      }
                    </div>
                    <div>
                      <div className='text-black dark:text-white font-bold'>{artist.name}</div>
                      <div className='text-sm items-center text-black dark:text-white flex gap-[11px]'>{artist.tag}
                        {artist.isVerify && (
                          <Image src={SealCheckUrl} alt="Play" className="w-[14px] h-[14px]" />
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && (
            <div className='p-[11px]'>
              {recentSearchTags &&
                <div className='mb-[11px]'>
                  <h3 className='text-sm font-medium mb-[11px] dark:text-white'>Recent search</h3>
                  <div className='flex flex-wrap gap-[11px]'>
                    {recentSearchTags.map((tag, index) => (
                      <button
                        key={index}
                        className='px-[11px] py-[6px] bg-gray-100 dark:bg-[#121212] dark:text-gray-200 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center'
                      >
                        {tag}
                        <DeleteIcon className='dark:text-white text-black ml-[11px]' />
                      </button>
                    ))}
                  </div>
                </div>}
              {recommendedCategories &&
                <div className='mb-[11px]'>
                  <h3 className='text-sm font-medium mb-[11px] dark:text-white'>Recommend for you</h3>
                  <div className='grid grid-cols-8 gap-[11px]'>
                    {recommendedCategories.map((category) => (
                      <Link
                        href={`/category/${category.id}`}
                        key={category.id}
                        className='group'
                      >
                        <div className='relative h-24 rounded-xl overflow-hidden'>
                          <div className='absolute inset-0 bg-white dark:bg-black transition-colors'>
                            <Image
                              src={`${category.image}`}
                              alt="User"
                              width={100}
                              height={100}
                              className='w-full h-[71px] rounded-sm text-white object-cover'
                            />
                          </div>
                          <div className='absolute bottom-1 left-0 right-0 flex items-center justify-center'>
                            <span className='text-black dark:text-white text-xs font-medium text-center px-[11px]'>{category.title}</span>
                          </div>
                          <div className='w-full h-full bg-white dark:bg-black'></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>}
              {popularCategories &&
                <div>
                  <h3 className='text-sm font-medium mb-[11px] dark:text-white'>People often search on Artverse</h3>
                  <div className='grid grid-cols-8 gap-[11px]'>
                    {popularCategories.map((category) => (
                      <Link
                        href={`/category/${category.id}`}
                        key={category.id}
                        className='group'
                      >
                        <div className='relative h-24 rounded-xl overflow-hidden'>
                          <div className='absolute inset-0 bg-white dark:bg-black transition-colors'>
                            <Image
                              src={`${category.image}`}
                              alt="User"
                              width={100}
                              height={100}
                              className='w-full h-[71px] rounded-sm text-white object-cover'
                            />
                          </div>
                          <div className='absolute bottom-1 left-0 right-0 flex items-center justify-center'>
                            <span className='text-black dark:text-white text-xs font-medium text-center px-[11px]'>{category.title}</span>
                          </div>
                          <div className='w-full h-full bg-white dark:bg-black'></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 