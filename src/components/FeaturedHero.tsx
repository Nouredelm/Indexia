import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, Maximize2 } from 'lucide-react';
import { extractDomain, statusLabel } from '../data/initialCatalog';
import { WebCollection, WebPageEntry } from '../types/portal';
import { LiveSiteThumbnail } from './LiveSiteThumbnail';

interface FeaturedHeroProps {
  featuredPage: WebPageEntry | undefined;
  allPages: WebPageEntry[];
  collections: WebCollection[];
  totalPages: number;
  onlinePages: number;
  latestUpdate: string;
  onSelectHeroPage: (page: WebPageEntry) => void;
  onPreview: (page: WebPageEntry, startFullscreen?: boolean) => void;
}

export function FeaturedHero({
  featuredPage,
  allPages,
  collections,
  totalPages,
  onlinePages,
  latestUpdate,
  onSelectHeroPage,
  onPreview,
}: FeaturedHeroProps) {
  if (!featuredPage) {
    return null;
  }

  const collectionName =
    collections.find((c) => c.id === featuredPage.collectionId)?.name ?? 'Archive';
  const domain = extractDomain(featuredPage.url);

  const currentIdx = Math.max(
    0,
    allPages.findIndex((p) => p.id === featuredPage.id)
  );

  const handlePrev = () => {
    if (allPages.length === 0) return;
    const prevIdx = (currentIdx - 1 + allPages.length) % allPages.length;
    onSelectHeroPage(allPages[prevIdx]);
  };

  const handleNext = () => {
    if (allPages.length === 0) return;
    const nextIdx = (currentIdx + 1) % allPages.length;
    onSelectHeroPage(allPages[nextIdx]);
  };

  return (
    <section id="a-la-une" className="border-b border-[#E5DFD5] bg-[#FBF9F5]">
      <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left editorial column */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#57534E] tabular-nums">
                <span>APERÇU EN DIRECT</span>
                <span aria-hidden="true">·</span>
                <span>{featuredPage.archiveCode}</span>
                <span aria-hidden="true">·</span>
                <span>{collectionName}</span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.75rem] leading-[1.12]">
                {featuredPage.title}
              </h1>

              <p className="mt-2.5 font-mono text-sm text-[#1E3A8A]">
                {domain}
                <span className="mx-2 text-[#57534E]" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#57534E]">
                  {statusLabel(featuredPage.status)}
                </span>
              </p>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#1C1917]/85">
                {featuredPage.summary}
              </p>

              {featuredPage.notes && (
                <p className="mt-4 max-w-xl border-t border-[#E5DFD5] pt-4 text-sm leading-relaxed text-[#57534E]">
                  {featuredPage.notes}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPreview(featuredPage, false)}
                className="inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#172554] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Ouvrir le lecteur
              </button>

              <button
                type="button"
                onClick={() => onPreview(featuredPage, true)}
                className="inline-flex items-center gap-2 rounded-md border border-[#E5DFD5] bg-white px-4 py-2.5 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F5F1E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Maximize2 className="h-4 w-4 text-[#57534E]" aria-hidden="true" />
                Plein écran
              </button>

              <a
                href={featuredPage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#1E3A8A] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                Ouvrir le site
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right live interactive preview container */}
          <div className="flex flex-col lg:col-span-7">
            <div className="relative flex-1 overflow-hidden rounded-lg border border-[#E5DFD5] bg-white min-h-[300px] lg:min-h-[380px]">
              <LiveSiteThumbnail
                url={featuredPage.url}
                title={featuredPage.title}
                archiveCode={featuredPage.archiveCode}
                fallbackSrc={featuredPage.coverImage}
                interactive
                virtualWidth={1280}
                virtualHeight={820}
                className="h-full w-full"
              />
            </div>

            {/* Site switcher bar under hero preview */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-serif italic text-[#57534E]">
                Aperçu en direct — {featuredPage.title} ({domain})
              </p>

              {allPages.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Site précédent"
                    className="inline-flex items-center justify-center rounded border border-[#E5DFD5] bg-white p-1.5 text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-mono text-xs text-[#57534E] tabular-nums">
                    {String(currentIdx + 1).padStart(2, '0')} /{' '}
                    {String(allPages.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Site suivant"
                    className="inline-flex items-center justify-center rounded border border-[#E5DFD5] bg-white p-1.5 text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Site Selector Strip for all indexed websites */}
        {allPages.length > 1 && (
          <div className="mt-8 border-t border-[#E5DFD5] pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-mono text-[#57534E]">
                ACCÈS DIRECT AUX SITES :
              </span>
              {allPages.map((p) => {
                const isSelected = p.id === featuredPage.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectHeroPage(p)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1917] text-white'
                        : 'border border-[#E5DFD5] bg-white text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F1E8]'
                    }`}
                  >
                    {p.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Full-width 4-column operational index strip below split */}
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-[#E5DFD5] pt-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-[#57534E]">Pages indexées</dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-[#1C1917] tabular-nums">
              {String(totalPages).padStart(2, '0')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#57534E]">Collections thématiques</dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-[#1C1917] tabular-nums">
              {String(collections.length).padStart(2, '0')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#57534E]">Sites actifs en ligne</dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-[#14532D] tabular-nums">
              {String(onlinePages).padStart(2, '0')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#57534E]">Dernière révision</dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-[#1C1917] tabular-nums">
              {latestUpdate}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
