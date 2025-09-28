'use client';

import React from 'react';

interface DefaultSectionProps {
  title: string;
  description?: string;
}

export const DefaultSection: React.FC<DefaultSectionProps> = ({
  title,
  description = "Content for this section is coming soon..."
}) => {
  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <p className="text-default-600">
        {description}
      </p>
    </div>
  );
};