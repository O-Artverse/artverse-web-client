'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useSearch } from '@/providers/SearchProvider';
import { MagnifyingGlassIcon, TicketIcon, CaretDown } from '@phosphor-icons/react/dist/ssr';
import { ShoppingBagOpenIcon } from '@phosphor-icons/react';
import { DeleteIcon } from '@/components/common/icons/DeleteIcon';
import SealCheckUrl from "@/components/common/icons/SealCheck.svg";

const useSearchData = () => {
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

interface TopbarLinkProps {
  href: string;
  title: string;
}

const TopbarLink = ({ href, title }: TopbarLinkProps) => {
  return (
    <Link
      href={href}
      className='text-[14px] flex justify-center items-center font-normal hover:text-purple-600 dark:text-white dark:hover:text-purple-400'
    >
      {title}
    </Link>
  );
};

export default function Topbar() {
  useSearchData();

  const searchRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const topbarRef = useRef<HTMLDivElement | null>(null);

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

      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchFocused]);

  return (
    <div className='w-full h-[88px] relative p-3 pl-0' ref={topbarRef}>
      <div className='bg-white dark:bg-[#1E1B26] rounded-[14px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] flex flex-row items-center justify-between h-full w-full gap-[20px] p-[8px]'>
        <div className='flex-1' ref={searchRef}>
          <div >
            <MagnifyingGlassIcon
              className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9C27B0]'
              size={20}
            />
            <input
              type='text'
              placeholder='Search'
              className='w-full pl-10 rounded-md bg-white dark:bg-opacity-10 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C27B0]  text-xs px-[16px] py-[12px]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
          </div>


        </div>

        <div className='flex gap-[20px] justify-center items-center'>
          <TopbarLink href="/artists" title="Artists" />
          <TopbarLink href="/exhibitions" title="Exhibitions" />
          <TopbarLink href="/events" title="Events" />

          <button className='p-1 hover:bg-gray-200 dark:hover:bg-[#1B1F26] rounded-full w-8 h-8 flex items-center justify-center relative'>
            <TicketIcon size={20} weight="light" className='dark:text-white' />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>

          <button className=' p-1 hover:bg-gray-200 dark:hover:bg-[#1B1F26]  rounded-full w-8 h-8 flex items-center justify-center relative'>
            <ShoppingBagOpenIcon size={20} weight="light" className='dark:text-white' />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>

          <div className='' ref={avatarRef}>
            <button
              className='flex items-center gap-2 focus:outline-none'
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className='w-[32px] h-[32px] rounded-sm overflow-hidden '>
                <Image
                  src="/images/avatar.png"
                  alt="User"
                  width={40}
                  height={40}
                  className='w-full h-full object-cover'
                />
              </div>
              <CaretDown
                size={16}
                weight="bold"
                className={`text-black dark:text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

          </div>
        </div>
      </div>

      {showUserMenu && (
        <div className='
         top-full  bg-[#FFFFFF]/90 dark:bg-[#1E1B26]/90 
        absolute right-3 w-[338px]  shadow-lg py-2 z-50 rounded-xl flex flex-col gap-[8px] p-[12px]'>
          <div className='flex items-center gap-[8px] p-[12px] bg-white dark:bg-[#121212] rounded-lg '>
            <div className='w-[48px] h-[48px] rounded-none overflow-hidden'>
              <Image
                src={'/images/avatar.png'}
                alt="artist"
                width={48}
                height={48}
                className='object-cover w-full h-full '
              />
            </div>
            <div className='flex flex-col gap-[2px]'>
              <h3 className='text-[16px] text-black font-bold dark:text-white'>James Anderson</h3>
              <p className=' text-gray-500 text-[12px] dark:text-gray-400'>Personal</p>
              <p className=' text-gray-500 text-[12px] dark:text-gray-400'>james@gmail.com</p>
            </div>
          </div>
          <Link href="/profile" className='block px-3 py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-gray-700'>
          Switch to an artist account
          </Link>
          <p className='text-[8px]  px-3 py-2 text-black/60 dark:text-white/60'>Your account</p>
          <Link href="/profile" className='block px-3  py-[8px] font-bold text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-gray-700'>
          Add more accounts
          </Link> <Link href="/profile" className='block font-bold px-3 py-[8px] text-sm text-gray-700 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-gray-700'>
        Sign out
          </Link>
          
        </div>
      )}
      {isSearchFocused && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 bg-[#FFFFFF]/90 dark:bg-[#1E1B26]/90 rounded-[14px] [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] z-50 overflow-hidden'
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
                        className='flex items-center w-full text-left px-[11px] py-[11px] hover:bg-gray-200 dark:hover:bg-black rounded-md dark:text-white'
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
                    className='flex items-center px-[11px] py-[12px] hover:bg-gray-200 dark:hover:bg-black rounded-md '
                  >
                    <div className='w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 mr-[11px] overflow-hidden'>
                      {artist.avatar ?
                        <Image
                          src={`${artist.avatar}`}
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
}
