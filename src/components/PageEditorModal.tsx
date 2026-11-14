import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COVER_PRESETS, isValidHttpUrl } from '../data/initialCatalog';
import {
  PageStatus,
  PageVisibility,
  WebCollection,
  WebPageEntry,
} from '../types/portal';

interface PageEditorModalProps {
  isOpen: boolean;
  editingPage: WebPageEntry | null;
  collections: WebCollection[];
  nextArchiveCode: string;
  onClose: () => void;
  onSave: (
    data: Omit<WebPageEntry, 'id' | 'updatedAt'>,
    existingId?: string
  ) => void;
}

export function PageEditorModal({
  isOpen,
  editingPage,
  collections,
  nextArchiveCode,
  onClose,
  onSave,
}: PageEditorModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('https://');
  const [archiveCode, setArchiveCode] = useState(nextArchiveCode);
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? 'spatial');
  const [tagsText, setTagsText] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].src);
  const [status, setStatus] = useState<PageStatus>('en_ligne');
  const [visibility, setVisibility] = useState<PageVisibility>('public');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [createdYear, setCreatedYear] = useState(2026);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    if (editingPage) {
      setTitle(editingPage.title);
      setUrl(editingPage.url);
      setArchiveCode(editingPage.archiveCode);
      setSummary(editingPage.summary);
      setNotes(editingPage.notes ?? '');
      setCollectionId(editingPage.collectionId);
      setTagsText(editingPage.tags.join(', '));
      setCoverImage(editingPage.coverImage ?? COVER_PRESETS[0].src);
      setStatus(editingPage.status);
      setVisibility(editingPage.visibility);
      setIsFeatured(editingPage.isFeatured);
      setIsPinned(editingPage.isPinned);
      setCreatedYear(editingPage.createdYear);
    } else {
      setTitle('');
      setUrl('https://');
      setArchiveCode(nextArchiveCode);
      setSummary('');
      setNotes('');
      setCollectionId(collections[0]?.id ?? 'spatial');
      setTagsText('');
      setCoverImage(COVER_PRESETS[0].src);
      setStatus('en_ligne');
      setVisibility('public');
      setIsFeatured(false);
      setIsPinned(false);
      setCreatedYear(new Date().getFullYear());
    }
  }, [isOpen, editingPage, collections, nextArchiveCode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    const cleanSummary = summary.trim();

    if (!cleanTitle) {
      setErrorMsg('Le titre est obligatoire.');
      return;
    }
    if (!isValidHttpUrl(cleanUrl)) {
      setErrorMsg('Veuillez saisir une URL valide commençant par http:// ou https://.');
      return;
    }
    if (!cleanSummary) {
      setErrorMsg('Veuillez ajouter une description courte.');
      return;
    }

    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);

    onSave(
      {
        title: cleanTitle.slice(0, 120),
        url: cleanUrl.slice(0, 500),
        archiveCode: archiveCode.trim().slice(0, 24) || nextArchiveCode,
        summary: cleanSummary.slice(0, 400),
        notes: notes.trim().slice(0, 2000) || undefined,
        collectionId,
        tags,
        coverImage: coverImage.trim() || undefined,
        status,
        visibility,
        isFeatured,
        isPinned,
        createdYear: Number(createdYear) || new Date().getFullYear(),
      },
      editingPage?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={editingPage ? 'Modifier la fiche' : 'Ajouter une page Web'}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#E5DFD5] bg-[#FBF9F5] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5DFD5] bg-white px-6 py-4">
          <h2 className="font-serif text-xl font-medium text-[#1C1917]">
            {editingPage ? `Modifier « ${editingPage.title} »` : 'Indexer une nouvelle page Web'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le formulaire"
            className="rounded p-1 text-[#57534E] hover:bg-[#F5F1E8] hover:text-[#1C1917] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {errorMsg && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="page-title" className="block text-xs font-medium text-[#57534E]">
                Titre de la page
              </label>
              <input
                id="page-title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Mon Nouveau Projet"
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="page-code" className="block text-xs font-medium text-[#57534E]">
                Cote d’archive
              </label>
              <input
                id="page-code"
                type="text"
                maxLength={24}
                value={archiveCode}
                onChange={(e) => setArchiveCode(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 font-mono text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="page-url" className="block text-xs font-medium text-[#57534E]">
              Adresse URL complète
            </label>
            <input
              id="page-url"
              type="url"
              required
              maxLength={500}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.site"
              className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 font-mono text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="page-collection" className="block text-xs font-medium text-[#57534E]">
                Collection
              </label>
              <select
                id="page-collection"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="page-status" className="block text-xs font-medium text-[#57534E]">
                État
              </label>
              <select
                id="page-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PageStatus)}
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="en_ligne">En ligne</option>
                <option value="en_cours">En cours</option>
                <option value="archive">Archivé</option>
              </select>
            </div>

            <div>
              <label htmlFor="page-visibility" className="block text-xs font-medium text-[#57534E]">
                Visibilité
              </label>
              <select
                id="page-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as PageVisibility)}
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              >
                <option value="public">Public (Vitrine)</option>
                <option value="private">Privé (Personnel)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="page-summary" className="block text-xs font-medium text-[#57534E]">
              Description éditoriale courte
            </label>
            <textarea
              id="page-summary"
              required
              rows={3}
              maxLength={400}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Résumez l'objet de cette page Web..."
              className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="page-notes" className="block text-xs font-medium text-[#57534E]">
              Notes techniques (optionnel)
            </label>
            <textarea
              id="page-notes"
              rows={2}
              maxLength={2000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Architecture, stack, points d'attention..."
              className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="page-tags" className="block text-xs font-medium text-[#57534E]">
                Mots-clés (séparés par des virgules)
              </label>
              <input
                id="page-tags"
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="WebXR, RAG, Documentation"
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="page-year" className="block text-xs font-medium text-[#57534E]">
                Année
              </label>
              <input
                id="page-year"
                type="number"
                min={1995}
                max={2035}
                value={createdYear}
                onChange={(e) => setCreatedYear(Number(e.target.value))}
                className="mt-1.5 w-full rounded-md border border-[#E5DFD5] bg-white px-3 py-2 font-mono text-sm text-[#1C1917] focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-[#57534E]">
              Visuel de référence
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COVER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCoverImage(preset.src)}
                  className={`overflow-hidden rounded border text-left transition-all cursor-pointer ${
                    coverImage === preset.src
                      ? 'border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                      : 'border-[#E5DFD5] hover:border-[#1C1917]/40'
                  }`}
                >
                  <img
                    src={preset.src}
                    alt={preset.label}
                    className="h-14 w-full object-cover"
                  />
                  <span className="block truncate px-2 py-1 text-[11px] text-[#57534E]">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t border-[#E5DFD5] pt-4 text-sm text-[#1C1917]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5DFD5] text-[#1E3A8A]"
              />
              Épingler en priorité
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5DFD5] text-[#1E3A8A]"
              />
              Mettre à la une du portail
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#E5DFD5] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#E5DFD5] bg-white px-4 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#1E3A8A] px-5 py-2 text-sm font-medium text-white hover:bg-[#172554] transition-colors cursor-pointer"
            >
              {editingPage ? 'Enregistrer' : 'Ajouter au portail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
