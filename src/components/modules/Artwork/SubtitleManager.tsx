'use client';

import React, { useState } from 'react';
import { Button, Input, Select, SelectItem, Chip } from '@heroui/react';
import { Upload, Plus, X, Trash } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';
import artworkService, { type AudioSubtitle } from '@/services/artwork.service';

interface SubtitleManagerProps {
  artworkId?: string; // For edit mode
  subtitles?: AudioSubtitle[]; // For edit mode - existing subtitles
  onSubtitlesChange?: (subtitles: AudioSubtitle[]) => void;
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
];

export default function SubtitleManager({ artworkId, subtitles = [], onSubtitlesChange }: SubtitleManagerProps) {
  const [localSubtitles, setLocalSubtitles] = useState<AudioSubtitle[]>(subtitles);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file extension
      if (!file.name.endsWith('.vtt')) {
        toast.error('Please select a .vtt file');
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast.error('VTT file must be less than 1MB');
        return;
      }

      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleAddSubtitle = async () => {
    if (!selectedLanguage) {
      toast.error('Please select a language');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a VTT file');
      return;
    }

    // Check if language already exists
    if (localSubtitles.some(s => s.language === selectedLanguage)) {
      toast.error('Subtitle for this language already exists. Delete it first to replace.');
      return;
    }

    try {
      setIsUploading(true);

      // Upload VTT file
      toast.loading('Uploading subtitle...');
      const uploadResult = await artworkService.uploadVtt(selectedFile);
      toast.dismiss();

      const languageOption = LANGUAGE_OPTIONS.find(opt => opt.code === selectedLanguage);

      // If artworkId exists (edit mode), call API to add subtitle
      if (artworkId) {
        const newSubtitle = await artworkService.upsertSubtitle(artworkId, {
          language: selectedLanguage,
          label: languageOption?.label || selectedLanguage,
          vttUrl: uploadResult.url,
        });

        const updatedSubtitles = [...localSubtitles, newSubtitle];
        setLocalSubtitles(updatedSubtitles);
        onSubtitlesChange?.(updatedSubtitles);
        toast.success(`Subtitle added for ${languageOption?.label}`);
      } else {
        // Create mode - just store locally, will be added after artwork creation
        const tempSubtitle: AudioSubtitle = {
          id: `temp-${Date.now()}`,
          language: selectedLanguage,
          label: languageOption?.label || selectedLanguage,
          vttUrl: uploadResult.url,
          artworkId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedSubtitles = [...localSubtitles, tempSubtitle];
        setLocalSubtitles(updatedSubtitles);
        onSubtitlesChange?.(updatedSubtitles);
        toast.success(`Subtitle prepared for ${languageOption?.label} (will be saved with artwork)`);
      }

      // Reset form
      setSelectedLanguage('');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('vtt-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload subtitle');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSubtitle = async (subtitle: AudioSubtitle) => {
    if (!confirm(`Delete subtitle for ${subtitle.label}?`)) {
      return;
    }

    try {
      // If artworkId exists (edit mode), call API to delete
      if (artworkId && !subtitle.id.startsWith('temp-')) {
        await artworkService.deleteSubtitle(artworkId, subtitle.language);
        toast.success(`Deleted subtitle for ${subtitle.label}`);
      }

      const updatedSubtitles = localSubtitles.filter(s => s.id !== subtitle.id);
      setLocalSubtitles(updatedSubtitles);
      onSubtitlesChange?.(updatedSubtitles);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subtitle');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
        VTT Subtitles for Audio Description
      </h4>

      {/* Add Subtitle Form */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-3">
        <Select
          label="Language"
          placeholder="Select language"
          selectedKeys={selectedLanguage ? [selectedLanguage] : []}
          onSelectionChange={(keys) => setSelectedLanguage(Array.from(keys)[0] as string)}
          size="sm"
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <SelectItem key={lang.code}>
              {lang.label}
            </SelectItem>
          ))}
        </Select>

        <div className="flex items-end gap-2">
          <input
            type="file"
            accept=".vtt"
            onChange={handleFileSelect}
            className="hidden"
            id="vtt-file-upload"
          />
          <label
            htmlFor="vtt-file-upload"
            className="flex-1 cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary-400 transition-colors bg-white dark:bg-gray-800/20 min-h-[40px]"
          >
            <Upload size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {selectedFile ? selectedFile.name : 'Select .vtt file'}
            </span>
          </label>
          {selectedFile && (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              isIconOnly
              onPress={() => {
                setSelectedFile(null);
                const fileInput = document.getElementById('vtt-file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <Button
          color="primary"
          size="sm"
          startContent={<Plus size={16} />}
          onPress={handleAddSubtitle}
          isLoading={isUploading}
          isDisabled={!selectedLanguage || !selectedFile}
          className="self-end"
        >
          Add
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        VTT subtitle files (.vtt) for audio transcription. Max 1MB per file.
      </p>

      {/* Existing Subtitles List */}
      {localSubtitles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Added Subtitles ({localSubtitles.length}):
          </p>
          <div className="space-y-2">
            {localSubtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Chip size="sm" color="primary" variant="flat">
                    {subtitle.language.toUpperCase()}
                  </Chip>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {subtitle.label}
                  </span>
                  {subtitle.id.startsWith('temp-') && (
                    <Chip size="sm" color="warning" variant="flat">
                      Pending
                    </Chip>
                  )}
                </div>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  isIconOnly
                  onPress={() => handleDeleteSubtitle(subtitle)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {localSubtitles.length === 0 && (
        <div className="text-center p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subtitles added yet. Add VTT files for multiple languages.
          </p>
        </div>
      )}
    </div>
  );
}
