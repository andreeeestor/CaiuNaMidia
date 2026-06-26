"use client";
import { DriveImage, Folder, ViewMode, ContextMenuState } from "./types";
import { GridIcon, ListIcon, SearchIcon } from "./icons";

/* ══════════════════════════════════════════
   BREADCRUMB
══════════════════════════════════════════ */
export function BreadcrumbNav({
  folders,
  currentFolderId,
  onNavigate,
}: {
  folders: Folder[];
  currentFolderId: string | null;
  onNavigate: (id: string | null) => void;
}) {
  const crumbs: Folder[] = [];
  let id: string | null = currentFolderId;
  while (id) {
    const f = folders.find((x) => x.id === id);
    if (!f) break;
    crumbs.unshift(f);
    id = f.parentId;
  }

  return (
    <div className="drive-breadcrumb">
      <span
        className={`drive-breadcrumb-item ${currentFolderId === null ? "last" : ""}`}
        onClick={() => onNavigate(null)}
      >
        Início
      </span>
      {crumbs.map((c, i) => (
        <span key={c.id} style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span className="drive-breadcrumb-sep">›</span>
          <span
            className={`drive-breadcrumb-item ${i === crumbs.length - 1 ? "last" : ""}`}
            onClick={() => i < crumbs.length - 1 && onNavigate(c.id)}
          >
            {c.name}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   VIEW TOGGLE
══════════════════════════════════════════ */
export function ViewToggle({ view, onToggle }: { view: ViewMode; onToggle: () => void }) {
  return (
    <button
      className="tb-btn icon-only"
      onClick={onToggle}
      title={view === "grid" ? "Visualização em lista" : "Visualização em grade"}
    >
      {view === "grid" ? <ListIcon /> : <GridIcon />}
    </button>
  );
}

/* ══════════════════════════════════════════
   SEARCH BAR
══════════════════════════════════════════ */
export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="drive-search">
      <SearchIcon />
      <input
        placeholder="Buscar arquivos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function fmtSize(bytes: number) {
  if (!bytes) return "—";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function imgName(img: DriveImage) {
  return img.name ?? img.key.split("/").pop() ?? img.key;
}

/* ══════════════════════════════════════════
   SVG ICONS (inline, tamanho fixo)
══════════════════════════════════════════ */
const IcoFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#005BAC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IcoImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#6b7280" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IcoChevron = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round"
    style={{ flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IcoCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ══════════════════════════════════════════
   CHECKBOX BUTTON (para seleção)
══════════════════════════════════════════ */
function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      className={`item-checkbox ${checked ? "item-checkbox--on" : ""}`}
      onClick={onChange}
      title="Selecionar"
    >
      {checked && <IcoCheck />}
    </button>
  );
}

/* ══════════════════════════════════════════
   GRID: FOLDER CARD
══════════════════════════════════════════ */
function FolderCard({
  folder,
  onNavigate,
  onContextMenu,
}: {
  folder: Folder;
  onNavigate: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, item: Folder) => void;
}) {
  return (
    <div
      className="file-card file-card--folder"
      onClick={() => onNavigate(folder.id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, folder); }}
    >
      <div className="file-card-folder-thumb">
        <IcoFolder />
      </div>
      <div className="file-card-info">
        <div className="file-card-name">{folder.name}</div>
        <div className="file-card-meta">Pasta</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   GRID: IMAGE CARD
   - Click → abre preview
   - Checkbox → seleciona
══════════════════════════════════════════ */
function ImageCard({
  image,
  selected,
  onSelect,
  onPreview,
  onContextMenu,
}: {
  image: DriveImage;
  selected: boolean;
  onSelect: (e: React.MouseEvent, key: string) => void;
  onPreview: (img: DriveImage) => void;
  onContextMenu: (e: React.MouseEvent, img: DriveImage) => void;
}) {
  const name = imgName(image);
  const size = fmtSize(image.size);

  return (
    <div
      className={`file-card ${selected ? "selected" : ""}`}
      onClick={() => onPreview(image)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, image); }}
    >
      {/* Checkbox — click separado, não propaga para o card */}
      <Checkbox
        checked={selected}
        onChange={(e) => { e.stopPropagation(); onSelect(e, image.key); }}
      />

      <div className="file-card-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={name} />
      </div>
      <div className="file-card-info">
        <div className="file-card-name">{name}</div>
        <div className="file-card-meta">{size}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LIST ROW — estilo da referência
   chevron | ícone | nome | tipo | tamanho | data | checkbox
══════════════════════════════════════════ */
function ListRow({
  item,
  type,
  selected,
  onSelect,
  onNavigate,
  onPreview,
  onContextMenu,
}: {
  item: DriveImage | Folder;
  type: "image" | "folder";
  selected?: boolean;
  onSelect?: (e: React.MouseEvent, key: string) => void;
  onNavigate?: (id: string) => void;
  onPreview?: (img: DriveImage) => void;
  onContextMenu: (e: React.MouseEvent, item: DriveImage | Folder) => void;
}) {
  const isFolder = type === "folder";
  const folder = item as Folder;
  const image = item as DriveImage;
  const name = isFolder ? folder.name : imgName(image);
  const size = isFolder ? "—" : fmtSize(image.size);
  const date = isFolder ? fmtDate(folder.createdAt) : fmtDate(image.uploadedAt);

  return (
    <div
      className={`explorer-row ${selected ? "explorer-row--selected" : ""}`}
      onClick={() => isFolder ? onNavigate?.(folder.id) : onPreview?.(image)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, item); }}
    >
      {/* Chevron — pastas têm seta, imagens não */}
      <div className="explorer-row__chevron">
        {isFolder ? <IcoChevron open={false} /> : null}
      </div>

      {/* Ícone + thumb */}
      <div className="explorer-row__icon">
        {isFolder ? (
          <IcoFolder />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={name}
            className="explorer-row__thumb"
          />
        )}
      </div>

      {/* Nome */}
      <div className="explorer-row__name">{name}</div>

      {/* Tipo */}
      <div className="explorer-row__meta">{isFolder ? "Pasta" : "Imagem"}</div>

      {/* Tamanho */}
      <div className="explorer-row__meta">{size}</div>

      {/* Data */}
      <div className="explorer-row__meta explorer-row__date">{date}</div>

      {/* Checkbox (apenas imagens) */}
      <div className="explorer-row__action" onClick={(e) => e.stopPropagation()}>
        {!isFolder && onSelect && (
          <Checkbox
            checked={!!selected}
            onChange={(e) => { e.stopPropagation(); onSelect(e, image.key); }}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN CONTENT AREA
══════════════════════════════════════════ */
interface ContentAreaProps {
  folders: Folder[];
  images: DriveImage[];
  currentFolderId: string | null;
  view: ViewMode;
  search: string;
  selected: Set<string>;
  loading: boolean;
  onNavigate: (id: string | null) => void;
  onSelect: (key: string) => void;
  onPreview: (img: DriveImage) => void;
  onContextMenu: (e: React.MouseEvent, target: ContextMenuState["target"]) => void;
}

export function ContentArea({
  folders,
  images,
  currentFolderId,
  view,
  search,
  selected,
  loading,
  onNavigate,
  onSelect,
  onPreview,
  onContextMenu,
}: ContentAreaProps) {
  const subFolders = folders.filter((f) => f.parentId === currentFolderId);
  const currentImages = images.filter((img) => (img.folderId ?? null) === currentFolderId);

  const q = search.toLowerCase();
  const filteredFolders = q
    ? folders.filter((f) => f.name.toLowerCase().includes(q))
    : subFolders;
  const filteredImages = q
    ? images.filter((img) => imgName(img).toLowerCase().includes(q))
    : currentImages;

  /* Wrapper para adaptar onSelect (key: string) → (e, key) */
  const handleSelect = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    onSelect(key);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
        <p style={{ marginTop: 16, color: "#9ca3af" }}>Carregando...</p>
      </div>
    );
  }

  /* ── Empty ── */
  const isEmpty = filteredFolders.length === 0 && filteredImages.length === 0;
  if (isEmpty) {
    return (
      <div className="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <h3>{search ? "Nenhum resultado" : "Pasta vazia"}</h3>
        <p>{search ? `Nenhum arquivo corresponde a "${search}"` : "Envie imagens ou crie uma pasta para começar"}</p>
      </div>
    );
  }

  /* ══════════ GRID VIEW ══════════ */
  if (view === "grid") {
    return (
      <>
        {filteredFolders.length > 0 && (
          <>
            {!search && <div className="drive-section-title">Pastas</div>}
            <div className="drive-grid">
              {filteredFolders.map((f) => (
                <FolderCard
                  key={f.id}
                  folder={f}
                  onNavigate={onNavigate}
                  onContextMenu={(e, item) => onContextMenu(e, { type: "folder", item })}
                />
              ))}
            </div>
          </>
        )}
        {filteredImages.length > 0 && (
          <>
            {!search && filteredFolders.length > 0 && (
              <div className="drive-section-title">Imagens</div>
            )}
            <div className="drive-grid">
              {filteredImages.map((img) => (
                <ImageCard
                  key={img.key}
                  image={img}
                  selected={selected.has(img.key)}
                  onSelect={handleSelect}
                  onPreview={onPreview}
                  onContextMenu={(e, item) => onContextMenu(e, { type: "image", item })}
                />
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  /* ══════════ LIST VIEW — estilo referência ══════════ */
  return (
    <div className="explorer-table">
      {/* Header */}
      <div className="explorer-header">
        <div className="explorer-header__chevron" />
        <div className="explorer-header__icon" />
        <div className="explorer-header__name">Nome</div>
        <div className="explorer-header__meta">Tipo</div>
        <div className="explorer-header__meta">Tamanho</div>
        <div className="explorer-header__meta explorer-header__date">Data</div>
        <div className="explorer-header__action" />
      </div>

      {/* Folders */}
      {filteredFolders.map((f) => (
        <ListRow
          key={f.id}
          item={f}
          type="folder"
          onNavigate={onNavigate}
          onContextMenu={(e, item) => onContextMenu(e, { type: "folder", item: item as Folder })}
        />
      ))}

      {/* Images */}
      {filteredImages.map((img) => (
        <ListRow
          key={img.key}
          item={img}
          type="image"
          selected={selected.has(img.key)}
          onSelect={handleSelect}
          onPreview={onPreview}
          onContextMenu={(e, item) => onContextMenu(e, { type: "image", item: item as DriveImage })}
        />
      ))}
    </div>
  );
}
