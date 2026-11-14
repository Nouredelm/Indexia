import { useMemo, useState } from 'react';
import { CatalogSection } from './components/CatalogSection';
import { CollectionsSection } from './components/CollectionsSection';
import { FeaturedHero } from './components/FeaturedHero';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LivePreviewModal } from './components/LivePreviewModal';
import { PageEditorModal } from './components/PageEditorModal';
import { extractDomain } from './data/initialCatalog';
import { usePortalStore } from './hooks/usePortalStore';
import { ViewMode, WebPageEntry } from './types/portal';

export default function App() {
  const {
    pages,
    collections,
    isEditorMode,
    setIsEditorMode,
    addPage,
    updatePage,
    deletePage,
    togglePin,
    setFeatured,
    toggleVisibility,
    addCollection,
    deleteCollection,
    exportBackup,
    importBackup,
    resetToDefaults,
  } = usePortalStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [heroPageId, setHeroPageId] = useState<string | null>(null);

  const [previewState, setPreviewState] = useState<{
    page: WebPageEntry | null;
    fullscreen: boolean;
  }>({ page: null, fullscreen: false });

  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    editingPage: WebPageEntry | null;
  }>({ isOpen: false, editingPage: null });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Pages visible depending on Showcase vs Editor mode
  const visiblePages = useMemo(() => {
    return pages
      .filter((page) => isEditorMode || page.visibility === 'public')
      .sort((a, b) =>
        a.archiveCode.localeCompare(b.archiveCode, undefined, { numeric: true })
      );
  }, [pages, isEditorMode]);

  const featuredPage = useMemo(() => {
    if (heroPageId) {
      const selected = visiblePages.find((p) => p.id === heroPageId);
      if (selected) return selected;
    }
    return visiblePages.find((p) => p.isFeatured) ?? visiblePages[0];
  }, [visiblePages, heroPageId]);

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = visiblePages.filter((page) => {
      if (activeCollectionId !== 'all' && page.collectionId !== activeCollectionId) {
        return false;
      }
      if (onlyPinned && !page.isPinned) {
        return false;
      }
      if (!query) return true;

      const domain = extractDomain(page.url).toLowerCase();
      const haystack = [
        page.title,
        page.archiveCode,
        page.summary,
        page.notes ?? '',
        domain,
        ...page.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    return [...list].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return a.archiveCode.localeCompare(b.archiveCode, undefined, { numeric: true });
    });
  }, [visiblePages, activeCollectionId, onlyPinned, searchQuery]);

  const onlinePagesCount = useMemo(
    () => visiblePages.filter((p) => p.status === 'en_ligne').length,
    [visiblePages]
  );

  const latestUpdate = useMemo(() => {
    if (visiblePages.length === 0) return '—';
    const sorted = [...visiblePages].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
    return sorted[0].updatedAt;
  }, [visiblePages]);

  const nextArchiveCode = useMemo(() => {
    const nextNum = pages.length + 1;
    return `ARC-${String(nextNum).padStart(2, '0')}`;
  }, [pages.length]);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'registre') {
      setViewMode('register');
      const el = document.getElementById('catalogue');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (sectionId === 'catalogue') {
      setViewMode('grid');
    }
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExportJson = () => {
    const payload = exportBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indexia-archive-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archive JSON exportée.');
  };

  const handleImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = importBackup(parsed);
      showToast(result.message);
    } catch {
      showToast('Impossible de lire ce fichier JSON.');
    }
  };

  const handleResetDefaults = () => {
    resetToDefaults();
    setHeroPageId(null);
    setActiveCollectionId('all');
    setOnlyPinned(false);
    setSearchQuery('');
    showToast('Catalogue restauré avec vos 7 sites de référence.');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header
        onAddPage={() => {
          setIsEditorMode(true);
          setEditorState({ isOpen: true, editingPage: null });
        }}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        <FeaturedHero
          featuredPage={featuredPage}
          allPages={visiblePages}
          collections={collections}
          totalPages={visiblePages.length}
          onlinePages={onlinePagesCount}
          latestUpdate={latestUpdate}
          onSelectHeroPage={(page) => setHeroPageId(page.id)}
          onPreview={(page, startFullscreen = false) =>
            setPreviewState({ page, fullscreen: startFullscreen })
          }
        />

        <CatalogSection
          pages={filteredPages}
          collections={collections}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCollectionId={activeCollectionId}
          onCollectionChange={setActiveCollectionId}
          onlyPinned={onlyPinned}
          onToggleOnlyPinned={() => setOnlyPinned((v) => !v)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isEditorMode={isEditorMode}
          onToggleEditorMode={() => setIsEditorMode((v) => !v)}
          onPreview={(page, startFullscreen = false) =>
            setPreviewState({ page, fullscreen: startFullscreen })
          }
          onEdit={(page) => setEditorState({ isOpen: true, editingPage: page })}
          onDelete={(id) => {
            deletePage(id);
            showToast('Fiche supprimée du portail.');
          }}
          onTogglePin={togglePin}
          onSetFeatured={(id) => {
            setFeatured(id);
            setHeroPageId(id);
            showToast('Pièce mise à la une.');
          }}
          onToggleVisibility={toggleVisibility}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetDefaults={handleResetDefaults}
          onAddPage={() => {
            setIsEditorMode(true);
            setEditorState({ isOpen: true, editingPage: null });
          }}
        />

        <CollectionsSection
          collections={collections}
          pages={visiblePages}
          activeCollectionId={activeCollectionId}
          isEditorMode={isEditorMode}
          onSelectCollection={(id) => {
            setActiveCollectionId((curr) => (curr === id ? 'all' : id));
            document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onAddCollection={(name, desc) => {
            const created = addCollection(name, desc);
            if (created) showToast(`Collection « ${created.name} » créée.`);
          }}
          onDeleteCollection={(id) => {
            deleteCollection(id);
            if (activeCollectionId === id) setActiveCollectionId('all');
            showToast('Collection supprimée.');
          }}
        />
      </main>

      <Footer totalPages={visiblePages.length} onNavigate={handleNavigate} />

      <LivePreviewModal
        page={previewState.page}
        allPages={visiblePages}
        collections={collections}
        initialFullscreen={previewState.fullscreen}
        onSelectPage={(page) =>
          setPreviewState((prev) => ({ ...prev, page }))
        }
        onClose={() => setPreviewState({ page: null, fullscreen: false })}
      />

      <PageEditorModal
        isOpen={editorState.isOpen}
        editingPage={editorState.editingPage}
        collections={collections}
        nextArchiveCode={nextArchiveCode}
        onClose={() => setEditorState({ isOpen: false, editingPage: null })}
        onSave={(data, existingId) => {
          if (existingId) {
            updatePage(existingId, data);
            showToast(`Fiche « ${data.title} » mise à jour.`);
          } else {
            addPage(data);
            showToast(`Page « ${data.title} » ajoutée au portail.`);
          }
        }}
      />

      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-md border border-[#E5DFD5] bg-[#1C1917] px-4 py-2.5 text-xs font-medium text-white shadow-lg"
        >
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
