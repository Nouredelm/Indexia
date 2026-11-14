import {
  Download,
  LayoutGrid,
  List,
  Lock,
  Pin,
  RotateCcw,
  Search,
  Unlock,
  Upload,
} from 'lucide-react';
import { useRef } from 'react';
import { ViewMode, WebCollection, WebPageEntry } from '../types/portal';
import { PageCard } from './PageCard';
import { RegisterTable } from './RegisterTable';

interface CatalogSectionProps {
  pages: WebPageEntry[];
  collections: WebCollection[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCollectionId: string;
  onCollectionChange: (id: string) => void;
  onlyPinned: boolean;
  onToggleOnlyPinned: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isEditorMode: boolean;
  onToggleEditorMode: () => void;
  onPreview: (page: WebPageEntry, startFullscreen?: boolean) => void;
  onEdit: (page: WebPageEntry) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSetFeatured: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetDefaults: () => void;
  onAddPage: () => void;
}

export function CatalogSection({
  pages,
  collections,
  searchQuery,
  onSearchChange,
  activeCollectionId,
  onCollectionChange,
  onlyPinned,
  onToggleOnlyPinned,
  viewMode,
  onViewModeChange,
  isEditorMode,
  onToggleEditorMode,
  onPreview,
  onEdit,
  onDelete,
  onTogglePin,
  onSetFeatured,
  onToggleVisibility,
  onExportJson,
  onImportJson,
  onResetDefaults,
  onAddPage,
}: CatalogSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section id="catalogue" className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10">
      {/* Section Header + Workspace Mode Switch */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E5DFD5] pb-6">
        <div>
          <p className="text-xs font-mono text-[#57534E]">RÉPERTOIRE COMPLET</p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#1C1917]">
            Catalogue des sites Web
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hybrid Showcase / Editor Switch */}
          <div className="flex items-center rounded-md border border-[#E5DFD5] bg-[#F5F1E8] p-1">
            <button
              type="button"
              onClick={() => isEditorMode && onToggleEditorMode()}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                !isEditorMode
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Vitrine publique
            </button>
            <button
              type="button"
              onClick={() => !isEditorMode && onToggleEditorMode()}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isEditorMode
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
              Mode Éditeur
            </button>
          </div>

          {/* Grid / Register View Switcher */}
          <div className="flex items-center rounded-md border border-[#E5DFD5] bg-[#F5F1E8] p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Affichage en grille"
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              Grille
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('register')}
              aria-label="Affichage en registre tabulaire"
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'register'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              Registre
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Collection Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onCollectionChange('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeCollectionId === 'all'
                ? 'bg-[#1C1917] text-white'
                : 'border border-[#E5DFD5] bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Toutes
          </button>
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => onCollectionChange(collection.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeCollectionId === collection.id
                  ? 'bg-[#1C1917] text-white'
                  : 'border border-[#E5DFD5] bg-white text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {collection.name}
            </button>
          ))}
          <button
            type="button"
            onClick={onToggleOnlyPinned}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              onlyPinned
                ? 'bg-[#1E3A8A] text-white'
                : 'border border-[#E5DFD5] bg-white text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
            Épinglés
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#57534E]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un titre, domaine, cote..."
            aria-label="Rechercher dans le catalogue"
            className="w-full rounded-md border border-[#E5DFD5] bg-white py-2 pl-9 pr-3 text-sm text-[#1C1917] placeholder:text-[#57534E]/70 focus:border-[#1E3A8A] focus:outline-none"
          />
        </div>
      </div>

      {/* Editor Backup Toolbar */}
      {isEditorMode && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E5DFD5] bg-[#F5F1E8]/80 px-4 py-2.5 text-xs">
          <span className="text-[#57534E]">
            Mode Éditeur actif — les modifications sont enregistrées localement dans votre navigateur.
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 rounded border border-[#E5DFD5] bg-white px-2.5 py-1 font-medium text-[#1C1917] hover:bg-[#FBF9F5] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Exporter JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded border border-[#E5DFD5] bg-white px-2.5 py-1 font-medium text-[#1C1917] hover:bg-[#FBF9F5] transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Importer JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportJson(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 rounded border border-[#E5DFD5] bg-white px-2.5 py-1 font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FBF9F5] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {pages.length === 0 ? (
          <div className="rounded-lg border border-[#E5DFD5] bg-white px-6 py-16 text-center">
            <p className="font-serif text-xl text-[#1C1917]">
              Aucune page Web ne correspond à ces critères.
            </p>
            <p className="mt-2 text-sm text-[#57534E]">
              Modifiez votre recherche, réinitialisez les filtres ou ajoutez une nouvelle référence.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  onCollectionChange('all');
                }}
                className="rounded-md border border-[#E5DFD5] bg-[#FBF9F5] px-4 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#F5F1E8] cursor-pointer"
              >
                Tout afficher
              </button>
              <button
                type="button"
                onClick={onAddPage}
                className="rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white hover:bg-[#172554] cursor-pointer"
              >
                Ajouter une page
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                collections={collections}
                isEditorMode={isEditorMode}
                onPreview={onPreview}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onSetFeatured={onSetFeatured}
                onToggleVisibility={onToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <RegisterTable
            pages={pages}
            collections={collections}
            isEditorMode={isEditorMode}
            onPreview={onPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </section>
  );
}
