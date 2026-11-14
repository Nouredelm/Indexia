interface HeaderProps {
  onAddPage: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Header({ onAddPage, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E5DFD5] bg-[#FBF9F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4 lg:px-10">
        {/* Zone 1: Single wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          Indexia
        </a>

        {/* Zone 2: 4 single-line navigation links */}
        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#a-la-une"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('a-la-une');
            }}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            À la une
          </a>
          <a
            href="#catalogue"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('catalogue');
            }}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Catalogue
          </a>
          <a
            href="#registre"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('registre');
            }}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Registre
          </a>
          <a
            href="#collections"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('collections');
            }}
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Collections
          </a>
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onAddPage}
            className="rounded-md bg-[#1E3A8A] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#172554] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ajouter une page
          </button>
        </div>
      </div>
    </header>
  );
}
