/* Icons always need explicit size to avoid inheriting 100% */
const sz = { width: "1em", height: "1em", display: "inline-block", verticalAlign: "middle", flexShrink: 0 } as const;

export const FolderIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

export const FolderOpenIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V8h16v10z" />
  </svg>
);

export const ImageIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

export const GridIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const ListIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export const UploadIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const PlusIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ChevronIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const SearchIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const XIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const CheckIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const TrashIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export const CopyIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const MoveIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
  </svg>
);

export const EyeIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const DownloadIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const LogOutIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const HomeIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const InfoIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={{ ...sz, ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
