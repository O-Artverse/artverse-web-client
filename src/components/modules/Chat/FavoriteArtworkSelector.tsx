'use client'

import React, { useState } from 'react';
import { FavoriteArtwork } from '@/types/chat';
import { X, Check, XIcon, CheckIcon } from '@phosphor-icons/react';
import Image from 'next/image';

interface Props {
  artworks: FavoriteArtwork[];
  onSendArtwork: (artwork: FavoriteArtwork) => void;
  onClose: () => void;
}

export default function FavoriteArtworkSelector({ artworks, onSendArtwork, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const send = () => {
    const selectedArtworks = artworks.filter(a => selected.includes(a.id));
    selectedArtworks.forEach((artwork, index) => {
      setTimeout(() => {
        onSendArtwork(artwork);
      }, index * 100);
    });
    onClose();
  };

  return (
    <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-[#1E1B26] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[14px] text-gray-800 dark:text-white">Send your favorite</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <XIcon size={12} className="text-gray-800 dark:text-white" />
        </button>
      </div>

    

      {/* Grid layout với scrollbar đẹp */}
      <div className="grid grid-cols-3 gap-3 mb-4 max-h-80 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {artworks.length > 0 ? (
          artworks.map((a, index) => {
            console.log(`Rendering artwork ${index}:`, a.title); // Debug each item
            return (
              <div
                key={a.id}
                className="relative rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggle(a.id)}
                  className="relative block w-full"
                  style={{ aspectRatio: a.ratio }}
                >
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  {/* Overlay with title */}
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-white text-xs font-medium truncate">{a.title}</span>
                  </div>
                  {selected.includes(a.id) && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full grid place-items-center">
                      <CheckIcon size={12} className="text-white" weight="bold" />
                    </span>
                  )}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">
            No artworks available
          </div>
        )}
      
      </div>
      {selected.length > 0 && (
        <button onClick={send} className="w-full bg-[#9C27B0] text-white py-1 rounded-lg hover:bg-purple-700 text-[14px]">
          Send {selected.length} artwork{selected.length > 1 ? 's' : ''}
        </button>
      )}
     
    </div>
  );
}

