interface FooterProps {
  totalPages: number;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ totalPages, onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#E5DFD5] bg-[#FBF9F5] py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center lg:px-10">
        <div>
          <p className="font-serif text-lg font-medium text-[#1C1917]">Indexia</p>
          <p className="mt-1 text-xs text-[#57534E]">
            Portail de référence documentaire · {totalPages} créations Web répertoriées
          </p>
        </div>

        <nav
          aria-label="Liens de pied de page"
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#57534E]"
        >
          <a
            href="#a-la-une"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('a-la-une');
            }}
            className="hover:text-[#1C1917] transition-colors"
          >
            À la une
          </a>
          <a
            href="#catalogue"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('catalogue');
            }}
            className="hover:text-[#1C1917] transition-colors"
          >
            Catalogue
          </a>
          <a
            href="#registre"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('registre');
            }}
            className="hover:text-[#1C1917] transition-colors"
          >
            Registre
          </a>
          <a
            href="#collections"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('collections');
            }}
            className="hover:text-[#1C1917] transition-colors"
          >
            Collections
          </a>
        </nav>
      </div>
    </footer>
  );
}
