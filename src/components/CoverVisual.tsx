import { Globe } from 'lucide-react';
import { useState } from 'react';
import { extractDomain } from '../data/initialCatalog';

interface CoverVisualProps {
  src?: string;
  title: string;
  url: string;
  archiveCode: string;
  className?: string;
}

export function CoverVisual({
  src,
  title,
  url,
  archiveCode,
  className = '',
}: CoverVisualProps) {
  const [hasError, setHasError] = useState(false);
  const domain = extractDomain(url);

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col justify-between overflow-hidden bg-[#F5F1E8] p-6 text-[#1C1917] border border-[#E5DFD5] ${className}`}
      >
        <div className="flex items-center justify-between text-xs font-mono text-[#57534E] tabular-nums">
          <span>{archiveCode}</span>
          <Globe className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
        </div>
        <div className="my-auto py-4">
          <p className="font-serif text-xl font-medium text-[#1C1917] leading-snug">
            {title}
          </p>
          <p className="mt-1 font-mono text-xs text-[#57534E] truncate">{domain}</p>
        </div>
        <div className="h-px w-12 bg-[#1E3A8A]/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Illustration documentaire pour ${title}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover w-full h-full ${className}`}
    />
  );
}
