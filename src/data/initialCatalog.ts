import coverAugmentiverse from '../assets/images/cover_augmentiverse_1794659908393.jpg';
import coverSpatial from '../assets/images/cover_spatial_computing_1794659908712.jpg';
import coverAiSystems from '../assets/images/cover_ai_systems_1794659909803.jpg';
import coverEducationDocs from '../assets/images/cover_education_docs_1794659909631.jpg';
import { WebCollection, WebPageEntry } from '../types/portal';

export const COVER_PRESETS: { id: string; label: string; src: string }[] = [
  { id: 'augmentiverse', label: 'Galerie spatiale', src: coverAugmentiverse },
  { id: 'spatial', label: 'Prisme & géométrie', src: coverSpatial },
  { id: 'ai', label: 'Fiches & diagrammes', src: coverAiSystems },
  { id: 'education', label: 'Bibliothèque & manuscrits', src: coverEducationDocs },
];

export const INITIAL_COLLECTIONS: WebCollection[] = [
  {
    id: 'spatial',
    name: 'Informatique spatiale & AR',
    description:
      'Architectures de réalité augmentée partagée, standards ouverts WebXR et environnements immersifs.',
    order: 1,
  },
  {
    id: 'ia',
    name: 'Intelligence artificielle & Web',
    description:
      'Modèles d’intelligence artificielle embarqués sur le Web, pipelines RAG et recherche sémantique.',
    order: 2,
  },
  {
    id: 'education',
    name: 'Éducation & Documents structurés',
    description:
      'Plateformes pédagogiques autour de l’IA et bacs à sable pour les langages de documents structurés.',
    order: 3,
  },
];

export const INITIAL_PAGES: WebPageEntry[] = [
  {
    id: 'page-augmentiverse',
    title: 'Augmentiverse',
    url: 'https://augmentiverse.org',
    archiveCode: 'ARC-01',
    summary:
      'Cadre conceptuel et architectural orienté réalité augmentée (AR-first) pour des standards ouverts, une présence spatiale persistante et une réalité physique partagée.',
    notes:
      '« The world is the interface » — Référence fondatrice sur l’interopérabilité AR et les couches numériques persistantes.',
    collectionId: 'spatial',
    tags: ['Réalité augmentée', 'Standards ouverts', 'Spatial'],
    coverImage: coverAugmentiverse,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: true,
    isPinned: true,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-spatial-computing',
    title: 'Spatial Computing Hub',
    url: 'https://spatial-computing.online',
    archiveCode: 'ARC-02',
    summary:
      'Portail indépendant de référence pour le WebXR, le WebAR, la VR/AR, les outils 3D, les standards immersifs, les convertisseurs et les parcours d’apprentissage.',
    notes:
      'Carrefour technique consacré au Web immersif avec expérimentations interactives et annuaire d’outils.',
    collectionId: 'spatial',
    tags: ['WebXR', 'WebAR', '3D temps réel'],
    coverImage: coverSpatial,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: true,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-web-ai',
    title: 'WebAI',
    url: 'https://web-ai.site',
    archiveCode: 'ARC-03',
    summary:
      'Portail dédié à l’intelligence artificielle directement intégrée aux environnements Web, à l’inférence dans le navigateur et aux applications Web intelligentes.',
    notes:
      'Exploration des capacités IA côté client (WebGPU, WebAssembly) et architectures d’interfaces assistées.',
    collectionId: 'ia',
    tags: ['WebAI', 'Navigateur', 'Interfaces'],
    coverImage: coverAiSystems,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: false,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-ai-rag',
    title: 'RAG Reference Hub',
    url: 'https://ai-rag.space',
    archiveCode: 'ARC-04',
    summary:
      'Centre de référence pédagogique sur la génération augmentée par récupération (RAG) : outils, workflows Dify, architectures, comparatifs et cas d’usage.',
    notes:
      'Documentation des systèmes de connaissances ancrés dans les données vérifiables et la recherche vectorielle.',
    collectionId: 'ia',
    tags: ['RAG', 'Dify', 'Base vectorielle'],
    coverImage: coverAiSystems,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: false,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-scolaria',
    title: 'SCOLAR·IA',
    url: 'https://scolaria.site',
    archiveCode: 'ARC-05',
    summary:
      'Enseigner avec l’IA avec méthode : parcours de formation (Academy, Diagnostic, Lab), repères de vérification des réponses et veille éducative vérifiable.',
    notes:
      'Conçu pour accompagner les enseignants dans un usage structuré, critique et responsable de l’intelligence artificielle.',
    collectionId: 'education',
    tags: ['Enseignement', 'Méthode IA', 'Veille'],
    coverImage: coverEducationDocs,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: false,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-universia',
    title: 'UNIVERS·IA',
    url: 'https://universia.site',
    archiveCode: 'ARC-06',
    summary:
      'L’IA au service de l’université : ressources, formations et outils dédiés à une intelligence artificielle responsable dans l’enseignement supérieur et la recherche.',
    notes:
      'Plateforme académique dédiée aux pratiques universitaires, aux travaux de recherche et à l’éthique documentaire.',
    collectionId: 'education',
    tags: ['Université', 'Recherche', 'IA responsable'],
    coverImage: coverEducationDocs,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: false,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
  {
    id: 'page-documents-structures',
    title: 'Structura — Documents Structurés',
    url: 'https://documents-structures.site',
    archiveCode: 'ARC-07',
    summary:
      'Fiches détaillées, bacs à sable interactifs, quiz d’entraînement, comparateur et flashcards de révision pour HTML, XML, JSON, Markdown, LaTeX et CSS.',
    notes:
      'Laboratoire pratique pour maîtriser les langages de contenus et la modélisation documentaire hiérarchique.',
    collectionId: 'education',
    tags: ['HTML / XML', 'JSON / Markdown', 'LaTeX'],
    coverImage: coverEducationDocs,
    status: 'en_ligne',
    visibility: 'public',
    isFeatured: false,
    isPinned: false,
    createdYear: 2026,
    updatedAt: '2026-11-14',
  },
];

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function statusLabel(status: WebPageEntry['status']): string {
  switch (status) {
    case 'en_ligne':
      return 'En ligne';
    case 'en_cours':
      return 'En cours';
    case 'archive':
      return 'Archivé';
  }
}
