import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Globe,
  Maximize2,
  Minimize2,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { extractDomain, statusLabel } from '../data/initialCatalog';
import { PreviewViewportMode, WebCollection, WebPageEntry } from '../types/portal';
import { CoverVisual } from './CoverVisual';

interface LivePreviewModalProps {
  page: WebPageEntry | null;
  allPages: WebPageEntry[];
  collections: WebCollection[];
  initialFullscreen?: boolean;
  onSelectPage: (page: WebPageEntry) => void;
  onClose: () => void;
}

interface FrameCheckResponse {
  frameAllowed: boolean;
  finalUrl: string;
}

export function LivePreviewModal({
  page,
  allPages,
  collections,
  initialFullscreen = false,
  onSelectPage,
  onClose,
}: LivePreviewModalProps) {
  const [viewport, setViewport] = useState<PreviewViewportMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const [activeTab, setActiveTab] = useState<'live' | 'dossier'>('live');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [isProxied, setIsProxied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFullscreen(initialFullscreen);
    setActiveTab('live');
    setViewport('desktop');
    setCopied(false);
  }, [initialFullscreen]);

  useEffect(() => {
    if (!page) return;
    setIsIframeLoading(true);
    setIsProxied(false);
    setResolvedSrc('');

    let cancelled = false;
    fetch(`/api/frame-check?url=${encodeURIComponent(page.url)}`)
      .then((r) => r.json())
      .then((data: FrameCheckResponse) => {
        if (cancelled) return;
        if (data.frameAllowed) {
          setIsProxied(false);
          setResolvedSrc(data.finalUrl || page.url);
        } else {
          setIsProxied(true);
          setResolvedSrc(`/api/proxy-snapshot?url=${encodeURIComponent(page.url)}`);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsProxied(false);
          setResolvedSrc(page.url);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, reloadKey]);

  useEffect(() => {
    if (!page) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen && !document.fullscreenElement) {
          setIsFullscreen(false);
        } else if (!document.fullscreenElement) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page, isFullscreen, onClose]);

  if (!page) return null;

  const domain = extractDomain(page.url);
  const collectionName =
    collections.find((c) => c.id === page.collectionId)?.name ?? 'Archive';

  const currentIndex = allPages.findIndex((p) => p.id === page.id);
  const handlePrev = () => {
    if (allPages.length <= 1 || currentIndex === -1) return;
    const prev = allPages[(currentIndex - 1 + allPages.length) % allPages.length];
    onSelectPage(prev);
  };
  const handleNext = () => {
    if (allPages.length <= 1 || currentIndex === -1) return;
    const next = allPages[(currentIndex + 1) % allPages.length];
    onSelectPage(next);
  };

  const handleToggleFullscreen = async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (nextState && containerRef.current?.requestFullscreen) {
      try {
        await containerRef.current.requestFullscreen();
      } catch {
        // Fallback to full-viewport CSS mode
      }
    } else if (!nextState && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore
      }
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(page.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore
    }
  };

  const frameWidthClass =
    viewport === 'desktop'
      ? 'w-full'
      : viewport === 'tablet'
      ? 'w-full max-w-[768px]'
      : 'w-full max-w-[390px]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`Aperçu en direct de ${page.title}`}
    >
      <div
        ref={containerRef}
        className={`flex flex-col bg-[#FBF9F5] transition-all duration-200 ${
          isFullscreen
            ? 'h-screen w-screen rounded-none border-0'
            : 'h-[92vh] w-[95vw] max-w-[1440px] rounded-lg border border-[#E5DFD5] shadow-xl'
        }`}
      >
        {/* Inspection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD5] bg-white px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {allPages.length > 1 && (
              <div className="flex items-center gap-1 mr-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Site précédent"
                  title="Site précédent"
                  className="rounded border border-[#E5DFD5] bg-[#FBF9F5] p-1 text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Site suivant"
                  title="Site suivant"
                  className="rounded border border-[#E5DFD5] bg-[#FBF9F5] p-1 text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <select
              aria-label="Choisir un site à prévisualiser"
              value={page.id}
              onChange={(e) => {
                const found = allPages.find((p) => p.id === e.target.value);
                if (found) onSelectPage(found);
              }}
              className="max-w-[200px] sm:max-w-[240px] rounded-md border border-[#E5DFD5] bg-[#FBF9F5] px-2.5 py-1 font-serif text-sm font-medium text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none cursor-pointer"
            >
              {allPages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.archiveCode} — {item.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copier l'URL"
              className="hidden sm:inline-flex items-center gap-1.5 rounded border border-[#E5DFD5] bg-[#FBF9F5] px-2.5 py-1 font-mono text-xs text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[180px]">{domain}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#14532D]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switch: Live vs Dossier */}
            <div className="flex items-center rounded-md border border-[#E5DFD5] bg-[#F5F1E8] p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'live'
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                Aperçu en direct
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'dossier'
                    ? 'bg-white text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Fiche documentaire
              </button>
            </div>

            {/* Viewport Switcher (when live) */}
            {activeTab === 'live' && (
              <div className="hidden md:flex items-center rounded-md border border-[#E5DFD5] bg-[#F5F1E8] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  title="Format Bureau (100%)"
                  aria-label="Format Bureau"
                  className={`rounded p-1.5 transition-colors cursor-pointer ${
                    viewport === 'desktop'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  title="Format Tablette (768px)"
                  aria-label="Format Tablette"
                  className={`rounded p-1.5 transition-colors cursor-pointer ${
                    viewport === 'tablet'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  title="Format Mobile (390px)"
                  aria-label="Format Mobile"
                  className={`rounded p-1.5 transition-colors cursor-pointer ${
                    viewport === 'mobile'
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {activeTab === 'live' && (
              <button
                type="button"
                onClick={() => {
                  setIsIframeLoading(true);
                  setReloadKey((k) => k + 1);
                }}
                title="Recharger l'aperçu"
                aria-label="Recharger l'aperçu"
                className="rounded-md border border-[#E5DFD5] bg-white p-1.5 text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5DFD5] bg-white px-3 py-1.5 text-xs font-medium text-[#1C1917] hover:bg-[#F5F1E8] transition-colors whitespace-nowrap cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 text-[#1E3A8A]" />
                  Quitter plein écran
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-[#1E3A8A]" />
                  Plein écran
                </>
              )}
            </button>

            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#172554] transition-colors whitespace-nowrap"
            >
              Ouvrir le site
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                }
                onClose();
              }}
              aria-label="Fermer l'aperçu"
              className="rounded-md p-1.5 text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Viewer Body */}
        {activeTab === 'live' ? (
          <div className="relative flex flex-1 flex-col overflow-hidden bg-[#EBE6DF]/60">
            <div className="flex flex-1 items-stretch justify-center overflow-auto p-0 md:p-4">
              <div
                className={`relative flex h-full flex-col overflow-hidden bg-white shadow-sm transition-all duration-200 ${frameWidthClass} ${
                  viewport === 'desktop' && isFullscreen
                    ? 'border-0 rounded-none'
                    : 'border border-[#E5DFD5] rounded-md'
                }`}
              >
                {isIframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FBF9F5]/90 p-6 text-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E5DFD5] border-t-[#1E3A8A]" />
                    <p className="mt-3 font-serif text-base text-[#1C1917]">
                      Chargement de {domain}…
                    </p>
                    <p className="mt-1 text-xs text-[#57534E]">
                      Connexion à l’adresse {page.url}
                    </p>
                  </div>
                )}

                {resolvedSrc && (
                  <iframe
                    key={`${page.id}-${reloadKey}-${resolvedSrc}`}
                    src={resolvedSrc}
                    title={`Aperçu en direct de ${page.title}`}
                    onLoad={() => setIsIframeLoading(false)}
                    className="h-full w-full flex-1 border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5DFD5] bg-[#FBF9F5] px-4 py-2 text-xs text-[#57534E]">
              <span>
                {isProxied
                  ? `Rendu via passerelle d’aperçu (l’hôte ${domain} restreint l’iframe directe).`
                  : `Aperçu direct de ${page.url}. Utilisez les flèches pour passer d’un site à l’autre.`}
              </span>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('dossier')}
                  className="font-medium text-[#1C1917] hover:underline cursor-pointer"
                >
                  Voir la fiche documentaire
                </button>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1E3A8A] hover:underline"
                >
                  Ouvrir dans un onglet
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Editorial Dossier View */
          <div className="flex-1 overflow-y-auto bg-[#FBF9F5] p-6 lg:p-12">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[#E5DFD5] bg-[#F5F1E8]">
                  <CoverVisual
                    src={page.coverImage}
                    title={page.title}
                    url={page.url}
                    archiveCode={page.archiveCode}
                    className="h-full w-full"
                  />
                </div>
                <dl className="mt-6 divide-y divide-[#E5DFD5] border-y border-[#E5DFD5] text-sm">
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#57534E]">Cote d’archive</dt>
                    <dd className="font-mono text-[#1C1917] tabular-nums">
                      {page.archiveCode}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#57534E]">Collection</dt>
                    <dd className="text-[#1C1917]">{collectionName}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#57534E]">État</dt>
                    <dd className="text-[#1C1917]">{statusLabel(page.status)}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#57534E]">Année</dt>
                    <dd className="font-mono text-[#1C1917] tabular-nums">
                      {page.createdYear}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-[#57534E]">Mise à jour</dt>
                    <dd className="font-mono text-[#1C1917] tabular-nums">
                      {page.updatedAt}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-7">
                <p className="font-mono text-xs text-[#1E3A8A]">{page.url}</p>
                <h3 className="mt-2 font-serif text-3xl font-medium text-[#1C1917]">
                  {page.title}
                </h3>

                <p className="mt-5 text-base leading-relaxed text-[#1C1917]/90">
                  {page.summary}
                </p>

                {page.notes && (
                  <div className="mt-6 border-t border-[#E5DFD5] pt-5">
                    <h4 className="text-xs font-mono text-[#57534E]">
                      NOTES TECHNIQUES &amp; CONTEXTE
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                      {page.notes}
                    </p>
                  </div>
                )}

                {page.tags.length > 0 && (
                  <div className="mt-6 border-t border-[#E5DFD5] pt-5">
                    <h4 className="text-xs font-mono text-[#57534E]">MOTS-CLÉS</h4>
                    <p className="mt-2 text-sm text-[#1C1917]">
                      {page.tags.join(' · ')}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('live')}
                    className="inline-flex items-center gap-2 rounded-md border border-[#E5DFD5] bg-white px-4 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                  >
                    Revenir à l’aperçu en direct
                  </button>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#172554] transition-colors"
                  >
                    Ouvrir {domain}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
