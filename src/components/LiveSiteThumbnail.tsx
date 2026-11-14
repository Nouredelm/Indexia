import { useEffect, useRef, useState } from 'react';
import { CoverVisual } from './CoverVisual';

interface LiveSiteThumbnailProps {
  url: string;
  title: string;
  archiveCode: string;
  fallbackSrc?: string;
  interactive?: boolean;
  virtualWidth?: number;
  virtualHeight?: number;
  className?: string;
}

interface FrameCheckResult {
  frameAllowed: boolean;
  finalUrl: string;
}

const clientFrameCache = new Map<string, FrameCheckResult>();

export function LiveSiteThumbnail({
  url,
  title,
  archiveCode,
  fallbackSrc,
  interactive = false,
  virtualWidth = 1280,
  virtualHeight = 960,
  className = '',
}: LiveSiteThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const cached = clientFrameCache.get(url);
    if (cached) {
      setFrameSrc(
        cached.frameAllowed
          ? cached.finalUrl
          : `/api/proxy-snapshot?url=${encodeURIComponent(url)}`
      );
      return;
    }

    let cancelled = false;
    fetch(`/api/frame-check?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data: FrameCheckResult) => {
        if (cancelled) return;
        const result: FrameCheckResult = {
          frameAllowed: Boolean(data.frameAllowed),
          finalUrl: data.finalUrl || url,
        };
        clientFrameCache.set(url, result);
        setFrameSrc(
          result.frameAllowed
            ? result.finalUrl
            : `/api/proxy-snapshot?url=${encodeURIComponent(url)}`
        );
      })
      .catch(() => {
        if (!cancelled) {
          setFrameSrc(url);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / virtualWidth);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [virtualWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#F5F1E8] ${className}`}
    >
      {/* Underlying fallback cover while live frame loads */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <CoverVisual
          src={fallbackSrc}
          title={title}
          url={url}
          archiveCode={archiveCode}
          className="h-full w-full"
        />
      </div>

      {/* Live scaled website preview */}
      {frameSrc && (
        <iframe
          src={frameSrc}
          title={`Aperçu miniature de ${title}`}
          loading="lazy"
          tabIndex={interactive ? 0 : -1}
          onLoad={() => setIsLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: `${virtualWidth}px`,
            height: `${virtualHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={`absolute top-0 left-0 border-0 bg-white transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${interactive ? '' : 'pointer-events-none select-none'}`}
        />
      )}
    </div>
  );
}
