import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Maximize2,
  Pencil,
  Pin,
  Star,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { extractDomain, statusLabel } from '../data/initialCatalog';
import { WebCollection, WebPageEntry } from '../types/portal';
import { LiveSiteThumbnail } from './LiveSiteThumbnail';

interface PageCardProps {
  page: WebPageEntry;
  collections: WebCollection[];
  isEditorMode: boolean;
  onPreview: (page: WebPageEntry, startFullscreen?: boolean) => void;
  onEdit: (page: WebPageEntry) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSetFeatured: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export function PageCard({
  page,
  collections,
  isEditorMode,
  onPreview,
  onEdit,
  onDelete,
  onTogglePin,
  onSetFeatured,
  onToggleVisibility,
}: PageCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const collectionName =
    collections.find((c) => c.id === page.collectionId)?.name ?? 'Archive';
  const domain = extractDomain(page.url);

  return (
    <article className="group flex flex-col justify-between rounded-lg border border-[#E5DFD5] bg-white transition-colors hover:border-[#1C1917]/30">
      <div>
        {/* 4:3 live miniature preview */}
        <div
          onClick={() => onPreview(page, false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPreview(page, false);
            }
          }}
          aria-label={`Ouvrir l'aperçu en direct de ${page.title}`}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[7px] border-b border-[#E5DFD5] bg-[#F5F1E8] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          <LiveSiteThumbnail
            url={page.url}
            title={page.title}
            archiveCode={page.archiveCode}
            fallbackSrc={page.coverImage}
            className="h-full w-full"
          />
        </div>

        <div className="p-6">
          {/* Zero-pill metadata line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#57534E] tabular-nums">
            <span>{page.archiveCode}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[160px]">{collectionName}</span>
            {page.isPinned && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1E3A8A] font-medium">Épinglé</span>
              </>
            )}
            {page.visibility === 'private' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#78350F] font-medium">Privé</span>
              </>
            )}
          </div>

          <h3 className="mt-2.5 font-serif text-xl font-medium tracking-tight text-[#1C1917]">
            {page.title}
          </h3>

          <p className="mt-1 font-mono text-xs text-[#1E3A8A] truncate">
            {domain}
            <span className="mx-1.5 text-[#57534E]" aria-hidden="true">
              ·
            </span>
            <span className="text-[#57534E]">{statusLabel(page.status)}</span>
          </p>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#57534E]">
            {page.summary}
          </p>

          {page.tags.length > 0 && (
            <p className="mt-3 text-xs text-[#57534E]/85 truncate">
              {page.tags.join(' / ')}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-[#E5DFD5] px-6 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(page, false)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#172554] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Aperçu
            </button>

            <button
              type="button"
              onClick={() => onPreview(page, true)}
              title="Aperçu en plein écran"
              aria-label={`Ouvrir ${page.title} en plein écran`}
              className="inline-flex items-center justify-center rounded-md border border-[#E5DFD5] bg-[#FBF9F5] p-1.5 text-[#1C1917] transition-colors hover:bg-[#F5F1E8] cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1C1917] hover:text-[#1E3A8A] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Ouvrir
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {isEditorMode && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5DFD5] pt-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onTogglePin(page.id)}
                title={page.isPinned ? 'Désépingler' : 'Épingler'}
                className={`rounded p-1.5 text-xs transition-colors cursor-pointer ${
                  page.isPinned
                    ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
                    : 'text-[#57534E] hover:bg-[#F5F1E8]'
                }`}
              >
                <Pin className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSetFeatured(page.id)}
                title={page.isFeatured ? 'À la une actuellement' : 'Mettre à la une'}
                className={`rounded p-1.5 text-xs transition-colors cursor-pointer ${
                  page.isFeatured
                    ? 'bg-[#78350F]/10 text-[#78350F]'
                    : 'text-[#57534E] hover:bg-[#F5F1E8]'
                }`}
              >
                <Star className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onToggleVisibility(page.id)}
                title={
                  page.visibility === 'public'
                    ? 'Passer en mode privé'
                    : 'Rendre public'
                }
                className="rounded p-1.5 text-xs text-[#57534E] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
              >
                {page.visibility === 'public' ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-[#78350F]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onEdit(page)}
                title="Modifier la fiche"
                className="rounded p-1.5 text-xs text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {confirmDelete ? (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onDelete(page.id)}
                  className="rounded bg-red-700 px-2 py-1 font-medium text-white hover:bg-red-800 cursor-pointer"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded px-2 py-1 text-[#57534E] hover:bg-[#F5F1E8] cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                title="Supprimer la fiche"
                className="rounded p-1.5 text-xs text-[#57534E] hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
