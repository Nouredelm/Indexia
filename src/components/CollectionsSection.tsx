import { FolderPlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { WebCollection, WebPageEntry } from '../types/portal';

interface CollectionsSectionProps {
  collections: WebCollection[];
  pages: WebPageEntry[];
  activeCollectionId: string;
  isEditorMode: boolean;
  onSelectCollection: (collectionId: string) => void;
  onAddCollection: (name: string, description: string) => void;
  onDeleteCollection: (id: string) => void;
}

export function CollectionsSection({
  collections,
  pages,
  activeCollectionId,
  isEditorMode,
  onSelectCollection,
  onAddCollection,
  onDeleteCollection,
}: CollectionsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCollection(name, description);
    setName('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <section
      id="collections"
      className="border-t border-[#E5DFD5] bg-[#F5F1E8]/60 py-14"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-[#57534E]">ORGANISATION CURATORIALE</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#1C1917]">
              Collections thématiques
            </h2>
          </div>

          {isEditorMode && (
            <button
              type="button"
              onClick={() => setIsAdding((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-[#E5DFD5] bg-white px-4 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#FBF9F5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FolderPlus className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
              {isAdding ? 'Annuler' : 'Nouvelle collection'}
            </button>
          )}
        </div>

        {isEditorMode && isAdding && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-[#E5DFD5] bg-white p-6 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <label
                htmlFor="new-col-name"
                className="block text-xs font-medium text-[#57534E]"
              >
                Nom de la collection
              </label>
              <input
                id="new-col-name"
                type="text"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Outils expérimentaux"
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>
            <div className="md:col-span-6">
              <label
                htmlFor="new-col-desc"
                className="block text-xs font-medium text-[#57534E]"
              >
                Description courte
              </label>
              <input
                id="new-col-desc"
                type="text"
                maxLength={240}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Objet et périmètre des pages regroupées..."
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>
            <div className="flex items-end md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#172554] transition-colors cursor-pointer"
              >
                Créer
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((collection, index) => {
            const count = pages.filter((p) => p.collectionId === collection.id).length;
            const isSelected = activeCollectionId === collection.id;

            return (
              <div
                key={collection.id}
                className={`flex flex-col justify-between rounded-lg border p-6 transition-colors ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-white'
                    : 'border-[#E5DFD5] bg-[#FBF9F5] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#57534E] tabular-nums">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      {count} {count > 1 ? 'pages' : 'page'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-medium text-[#1C1917]">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#57534E]">
                    {collection.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#E5DFD5] pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectCollection(collection.id)}
                    className="text-xs font-medium text-[#1E3A8A] hover:underline underline-offset-4 cursor-pointer"
                  >
                    {isSelected ? 'Affichée dans le catalogue' : 'Filtrer cette collection'}
                  </button>

                  {isEditorMode && collections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteCollection(collection.id)}
                      aria-label={`Supprimer la collection ${collection.name}`}
                      className="rounded p-1.5 text-[#57534E] hover:bg-[#F5F1E8] hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
