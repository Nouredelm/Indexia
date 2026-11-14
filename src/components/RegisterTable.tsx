import { ArrowUpRight, Eye, Maximize2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { extractDomain, statusLabel } from '../data/initialCatalog';
import { WebCollection, WebPageEntry } from '../types/portal';

interface RegisterTableProps {
  pages: WebPageEntry[];
  collections: WebCollection[];
  isEditorMode: boolean;
  onPreview: (page: WebPageEntry, startFullscreen?: boolean) => void;
  onEdit: (page: WebPageEntry) => void;
  onDelete: (id: string) => void;
}

export function RegisterTable({
  pages,
  collections,
  isEditorMode,
  onPreview,
  onEdit,
  onDelete,
}: RegisterTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div id="registre" className="overflow-x-auto rounded-lg border border-[#E5DFD5] bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E5DFD5] bg-[#F5F1E8]/70 text-xs font-medium text-[#57534E]">
            <th className="px-4 py-3.5 font-mono">Cote</th>
            <th className="px-4 py-3.5">Titre</th>
            <th className="px-4 py-3.5">Domaine</th>
            <th className="px-4 py-3.5 hidden md:table-cell">Collection</th>
            <th className="px-4 py-3.5 hidden sm:table-cell">État</th>
            <th className="px-4 py-3.5 hidden lg:table-cell font-mono">Année</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5DFD5]">
          {pages.map((page) => {
            const collectionName =
              collections.find((c) => c.id === page.collectionId)?.name ?? 'Archive';
            const domain = extractDomain(page.url);

            return (
              <tr
                key={page.id}
                className="transition-colors hover:bg-[#FBF9F5]"
              >
                <td className="px-4 py-3.5 font-mono text-xs text-[#57534E] tabular-nums whitespace-nowrap">
                  {page.archiveCode}
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onPreview(page, false)}
                    className="font-serif text-base font-medium text-[#1C1917] hover:text-[#1E3A8A] hover:underline underline-offset-4 text-left cursor-pointer"
                  >
                    {page.title}
                  </button>
                  {page.visibility === 'private' && (
                    <span className="ml-2 text-xs font-mono text-[#78350F]">
                      Privé
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-[#1E3A8A] whitespace-nowrap">
                  {domain}
                </td>
                <td className="px-4 py-3.5 text-xs text-[#57534E] hidden md:table-cell">
                  {collectionName}
                </td>
                <td className="px-4 py-3.5 text-xs text-[#1C1917] hidden sm:table-cell whitespace-nowrap">
                  {statusLabel(page.status)}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-[#57534E] tabular-nums hidden lg:table-cell">
                  {page.createdYear}
                </td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onPreview(page, false)}
                      title="Aperçu en direct"
                      className="inline-flex items-center gap-1 rounded border border-[#E5DFD5] bg-[#FBF9F5] px-2.5 py-1 text-xs font-medium text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#1E3A8A]" />
                      Aperçu
                    </button>
                    <button
                      type="button"
                      onClick={() => onPreview(page, true)}
                      title="Mode plein écran"
                      aria-label={`Plein écran pour ${page.title}`}
                      className="rounded border border-[#E5DFD5] bg-[#FBF9F5] p-1.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ouvrir dans un nouvel onglet"
                      aria-label={`Ouvrir ${page.title} dans un nouvel onglet`}
                      className="rounded border border-[#E5DFD5] bg-[#FBF9F5] p-1.5 text-[#57534E] hover:text-[#1E3A8A] hover:bg-[#F5F1E8] transition-colors"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>

                    {isEditorMode && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(page)}
                          title="Modifier"
                          aria-label={`Modifier ${page.title}`}
                          className="rounded p-1.5 text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#1C1917] cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {confirmId === page.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              onDelete(page.id);
                              setConfirmId(null);
                            }}
                            className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-800 cursor-pointer"
                          >
                            Supprimer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmId(page.id)}
                            title="Supprimer"
                            aria-label={`Supprimer ${page.title}`}
                            className="rounded p-1.5 text-[#57534E] hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
