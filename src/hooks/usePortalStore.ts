import { useCallback, useEffect, useState } from 'react';
import { INITIAL_COLLECTIONS, INITIAL_PAGES } from '../data/initialCatalog';
import { PortalBackupPayload, WebCollection, WebPageEntry } from '../types/portal';

const PAGES_STORAGE_KEY = 'indexia_portal_pages_v2';
const COLLECTIONS_STORAGE_KEY = 'indexia_portal_collections_v2';
const EDITOR_MODE_STORAGE_KEY = 'indexia_portal_editor_mode_v1';

function loadStoredPages(): WebPageEntry[] {
  try {
    const raw = localStorage.getItem(PAGES_STORAGE_KEY);
    if (!raw) return INITIAL_PAGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PAGES;
  } catch {
    return INITIAL_PAGES;
  }
}

function loadStoredCollections(): WebCollection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!raw) return INITIAL_COLLECTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COLLECTIONS;
  } catch {
    return INITIAL_COLLECTIONS;
  }
}

function loadEditorMode(): boolean {
  try {
    return localStorage.getItem(EDITOR_MODE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function usePortalStore() {
  const [pages, setPages] = useState<WebPageEntry[]>(loadStoredPages);
  const [collections, setCollections] = useState<WebCollection[]>(loadStoredCollections);
  const [isEditorMode, setIsEditorMode] = useState<boolean>(loadEditorMode);

  useEffect(() => {
    try {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
    } catch {
      // Ignore quota errors
    }
  }, [pages]);

  useEffect(() => {
    try {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
    } catch {
      // Ignore quota errors
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(EDITOR_MODE_STORAGE_KEY, String(isEditorMode));
    } catch {
      // Ignore quota errors
    }
  }, [isEditorMode]);

  const addPage = useCallback(
    (entry: Omit<WebPageEntry, 'id' | 'updatedAt'>) => {
      const today = new Date().toISOString().slice(0, 10);
      const id = `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newPage: WebPageEntry = {
        ...entry,
        id,
        updatedAt: today,
      };
      setPages((prev) => {
        const cleaned = entry.isFeatured
          ? prev.map((p) => ({ ...p, isFeatured: false }))
          : prev;
        return [newPage, ...cleaned];
      });
      return newPage;
    },
    []
  );

  const updatePage = useCallback((id: string, patch: Partial<WebPageEntry>) => {
    const today = new Date().toISOString().slice(0, 10);
    setPages((prev) =>
      prev.map((page) => {
        if (page.id === id) {
          return { ...page, ...patch, updatedAt: today };
        }
        if (patch.isFeatured) {
          return { ...page, isFeatured: false };
        }
        return page;
      })
    );
  }, []);

  const deletePage = useCallback((id: string) => {
    setPages((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (remaining.length > 0 && !remaining.some((p) => p.isFeatured)) {
        remaining[0] = { ...remaining[0], isFeatured: true };
      }
      return remaining;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, isPinned: !page.isPinned } : page
      )
    );
  }, []);

  const setFeatured = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        isFeatured: page.id === id,
      }))
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id
          ? {
              ...page,
              visibility: page.visibility === 'public' ? 'private' : 'public',
            }
          : page
      )
    );
  }, []);

  const addCollection = useCallback(
    (name: string, description: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const newCol: WebCollection = {
        id: `col-${Date.now()}`,
        name: trimmed,
        description: description.trim() || 'Collection personnalisée de pages Web.',
        order: collections.length + 1,
      };
      setCollections((prev) => [...prev, newCol]);
      return newCol;
    },
    [collections.length]
  );

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setPages((prev) =>
      prev.map((p) =>
        p.collectionId === id ? { ...p, collectionId: 'spatial' } : p
      )
    );
  }, []);

  const exportBackup = useCallback((): PortalBackupPayload => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      collections,
      pages,
    };
  }, [collections, pages]);

  const importBackup = useCallback((payload: unknown): { ok: boolean; message: string } => {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, message: 'Format JSON invalide.' };
    }
    const data = payload as Partial<PortalBackupPayload>;
    if (!Array.isArray(data.pages) || !Array.isArray(data.collections)) {
      return { ok: false, message: 'Le fichier doit contenir pages et collections.' };
    }
    const validPages = data.pages.filter(
      (p): p is WebPageEntry =>
        Boolean(p && typeof p.id === 'string' && typeof p.title === 'string' && typeof p.url === 'string')
    );
    const validCollections = data.collections.filter(
      (c): c is WebCollection =>
        Boolean(c && typeof c.id === 'string' && typeof c.name === 'string')
    );
    if (validPages.length === 0) {
      return { ok: false, message: 'Aucune fiche de page Web valide trouvée.' };
    }
    if (validCollections.length > 0) {
      setCollections(validCollections);
    }
    setPages(validPages);
    return {
      ok: true,
      message: `${validPages.length} fiche(s) importée(s) avec succès.`,
    };
  }, []);

  const resetToDefaults = useCallback(() => {
    setCollections(INITIAL_COLLECTIONS);
    setPages(INITIAL_PAGES);
  }, []);

  return {
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
  };
}
