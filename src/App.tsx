import {
  ArrowLeft,
  ArrowUpDown,
  Briefcase,
  Check,
  ClipboardList,
  Code2,
  Copy,
  Eraser,
  FileText,
  Library,
  Megaphone,
  Music2,
  Package,
  Palette,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { loadTemplates } from './data/templateStore';
import {
  renderTemplate,
  sortPromptTemplates,
  type PromptSort,
  type PromptTemplate,
} from './domain/prompt';

const variableLabels: Record<string, string> = {
  notes: 'Rohnotizen',
  review_notes: 'Review-Notizen',
  topic: 'Thema',
  meeting_notes: 'Meeting-Notizen',
  copy_draft: 'Kampagnen-Draft',
  task: 'Aufgabe',
};

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'de'));
}

function iconForCategory(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes('business')) return Briefcase;
  if (normalized.includes('coding')) return Code2;
  if (normalized.includes('design')) return Palette;
  if (normalized.includes('meta')) return Sparkles;
  if (normalized.includes('music')) return Music2;
  if (normalized.includes('operation')) return ClipboardList;
  if (normalized.includes('product')) return Package;
  if (normalized.includes('writing')) return FileText;
  if (normalized.includes('automation')) return Workflow;
  if (normalized.includes('marketing')) return Megaphone;
  return Library;
}

function variablePlaceholder(name: string) {
  const label = variableLabels[name] ?? name.replaceAll('_', ' ');
  return `${label} hier einfuegen. Die Eingabe bleibt nur in dieser Browser-Sitzung.`;
}

export function App() {
  const [templates] = useState<PromptTemplate[]>(() => loadTemplates());
  const [sort, setSort] = useState<PromptSort>('title');
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? '');
  const [page, setPage] = useState<'library' | 'category' | 'detail'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [valuesByTemplate, setValuesByTemplate] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const visibleTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const matchesCategory = !selectedCategory || template.category === selectedCategory;
      const matchesTags =
        !activeTags.length || activeTags.every((tag) => template.tags.includes(tag));
      return matchesCategory && matchesTags;
    });
    return sortPromptTemplates(filtered, sort);
  }, [activeTags, selectedCategory, sort, templates]);

  useEffect(() => {
    if (!visibleTemplates.length) {
      setSelectedId('');
      return;
    }
    if (!visibleTemplates.some((item) => item.id === selectedId)) {
      setSelectedId(visibleTemplates[0].id);
    }
  }, [selectedId, visibleTemplates]);

  const selected = templates.find((item) => item.id === selectedId) ?? visibleTemplates[0];
  const selectedValues = selected ? (valuesByTemplate[selected.id] ?? {}) : {};
  const generatedPrompt = selected ? renderTemplate(selected.template, selectedValues) : '';

  function openTemplate(templateId: string) {
    setSelectedId(templateId);
    setPage('detail');
  }

  function openLibrary() {
    setSelectedCategory(null);
    setActiveTags([]);
    setPage('library');
  }

  function openCategory(category: string) {
    setSelectedCategory(category);
    setActiveTags([]);
    setPage('category');
  }

  function updateVariable(name: string, value: string) {
    if (!selected) return;
    setValuesByTemplate((current) => ({
      ...current,
      [selected.id]: { ...(current[selected.id] ?? {}), [name]: value },
    }));
  }

  async function copyGeneratedPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    } finally {
      window.setTimeout(() => setCopyState('idle'), 1600);
    }
  }

  const categories = unique(templates.map((item) => item.category));
  const tags = unique(templates.flatMap((item) => item.tags));
  const pageTitle = page === 'category' && selectedCategory ? selectedCategory : 'Prompt-Bestand';
  const pageDescription =
    page === 'category' && selectedCategory
      ? `Alle Prompt-Templates aus der Kategorie ${selectedCategory}.`
      : 'Prompt-Templates fuer wiederkehrende Aufgaben. Alle Eingaben bleiben in dieser statischen Browser-Ansicht.';

  function toggleTag(tag: string) {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  return (
    <div className="app-shell library-layout">
      <aside className="rail" aria-label="Navigation">
        <div className="brand">
          <div className="brand-mark">
            <Library aria-hidden="true" />
          </div>
          <div>
            <h1>Prompt Hub</h1>
            <p className="tiny">Static-first</p>
          </div>
        </div>

        <section className="rail-section">
          <p className="rail-title">Ansicht</p>
          <div className="filter-list">
            <button
              className={`filter-pill ${page === 'library' && !selectedCategory ? 'active' : ''}`}
              type="button"
              onClick={openLibrary}
            >
              <span>
                <Library aria-hidden="true" />
                Alle Prompts
              </span>
              <span className="count">{templates.length}</span>
            </button>
          </div>
        </section>

        <section className="rail-section">
          <p className="rail-title">Kategorien</p>
          <div className="filter-list">
            {categories.map((category) => (
              <CategoryFilter
                active={selectedCategory === category}
                category={category}
                count={templates.filter((item) => item.category === category).length}
                key={category}
                onClick={() => openCategory(category)}
              />
            ))}
          </div>
        </section>

        <section className="rail-section">
          <p className="rail-title">Tags</p>
          <div className="filter-list">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`filter-pill ${activeTags.includes(tag) ? 'active' : ''}`}
                type="button"
                onClick={() => toggleTag(tag)}
              >
                <span>{tag}</span>
                <span className="count">
                  {templates.filter((item) => item.tags.includes(tag)).length}
                </span>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <main className="main">
        {page === 'library' || page === 'category' ? (
          <>
            <header className="topbar">
              <div>
                <h2>{pageTitle}</h2>
                <p className="topbar-sub">{pageDescription}</p>
              </div>
            </header>

            <section className="workspace" aria-label="Prompt Templates">
              <section className="workspace-hero">
                <div className="toolbar">
                  <div className="collection-intro">
                    <span className="eyebrow">Uebersicht</span>
                    <strong>
                      {visibleTemplates.length} Templates
                      {selectedCategory ? ` in ${selectedCategory}` : ' in der Bibliothek'}
                    </strong>
                    <p className="collection-sub">
                      {selectedCategory
                        ? `Sammlung fuer ${selectedCategory} mit schnellen Vorlagen fuer wiederkehrende Aufgaben.`
                        : 'Freigegebene Vorlagen fuer wiederkehrende Aufgaben in einer kompakten Arbeitsansicht.'}
                    </p>
                  </div>
                  <label className="select-wrap" htmlFor="sortSelect">
                    <ArrowUpDown aria-hidden="true" />
                    <select
                      id="sortSelect"
                      value={sort}
                      onChange={(event) => setSort(event.target.value as PromptSort)}
                    >
                      <option value="title">Titel A-Z</option>
                      <option value="category">Nach Kategorie</option>
                    </select>
                  </label>
                </div>

                <div className="active-filter-row" aria-label="Aktive Filter">
                  {selectedCategory ? <Chip color="green">{selectedCategory}</Chip> : null}
                  {activeTags.map((tag) => (
                    <Chip color="blue" key={tag}>
                      {tag}
                    </Chip>
                  ))}
                  {selectedCategory ? (
                    <button
                      className="secondary-button compact"
                      type="button"
                      onClick={openLibrary}
                    >
                      Alle Prompts
                    </button>
                  ) : null}
                  {activeTags.length ? (
                    <button
                      className="secondary-button compact"
                      type="button"
                      onClick={() => setActiveTags([])}
                    >
                      Tags zuruecksetzen
                    </button>
                  ) : null}
                </div>
              </section>

              <section className="prompt-list" aria-label="Templates">
                {visibleTemplates.length ? (
                  visibleTemplates.map((template) => (
                    <PromptCard
                      key={template.id}
                      template={template}
                      onSelect={() => openTemplate(template.id)}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <strong>Keine Templates vorhanden</strong>
                    <p>Fuege ein neues Template hinzu, damit es hier erscheint.</p>
                  </div>
                )}
              </section>
            </section>
          </>
        ) : selected ? (
          <>
            <header className="topbar detail-topbar">
              <div>
                <button
                  className="back-link"
                  type="button"
                  onClick={() => setPage(selectedCategory ? 'category' : 'library')}
                >
                  <ArrowLeft />
                  {selectedCategory ? `Zur Kategorie ${selectedCategory}` : 'Zur Bibliothek'}
                </button>
                <h2>{selected.title}</h2>
                <p className="topbar-sub">{selected.description}</p>
              </div>
            </header>

            <section className="detail-page" aria-label="Template Details">
              <div
                className={`detail-page-grid${selected.variables.length ? '' : ' detail-page-grid--no-variables'}`}
              >
                <section className="detail-card detail-hero">
                  <div className="tag-row">
                    <Chip color="green">{selected.category}</Chip>
                  </div>
                  <div className="detail-meta-grid">
                    {selected.tags.map((tag) => (
                      <Chip color="blue" key={tag}>
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </section>

                {selected.variables.length > 0 ? (
                  <section className="detail-card detail-card-form">
                    <div className="template-toolbar">
                      <h4>Template Variablen</h4>
                      <span className="badge warn">{selected.variables.length} Felder</span>
                    </div>
                    <div className="template-fields">
                      {selected.variables.map((variable) => (
                        <label className="template-field" key={variable}>
                          <span>{variableLabels[variable] ?? variable.replaceAll('_', ' ')}</span>
                          <textarea
                            value={selectedValues[variable] ?? ''}
                            onChange={(event) => updateVariable(variable, event.target.value)}
                            placeholder={variablePlaceholder(variable)}
                          />
                        </label>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="detail-card detail-card-output">
                  <div className="template-toolbar">
                    <h4>{selected.variables.length > 0 ? 'Generierter Gesamtprompt' : 'Prompt'}</h4>
                    <div className="top-actions">
                      <button
                        className="secondary-button compact"
                        type="button"
                        onClick={() =>
                          setValuesByTemplate((current) => ({ ...current, [selected.id]: {} }))
                        }
                      >
                        <Eraser /> Leeren
                      </button>
                      <button
                        className="primary-button compact"
                        type="button"
                        onClick={copyGeneratedPrompt}
                      >
                        {copyState === 'copied' ? <Check /> : <Copy />}
                        {copyState === 'copied'
                          ? 'Kopiert'
                          : copyState === 'failed'
                            ? 'Manuell kopieren'
                            : 'Kopieren'}
                      </button>
                    </div>
                  </div>
                  <pre className="prompt-code generated">{generatedPrompt}</pre>
                </section>

                {selected.variables.length > 0 ? (
                  <section className="detail-card detail-card-template">
                    <h4>Template Vorlage</h4>
                    <pre className="prompt-code">{selected.template}</pre>
                  </section>
                ) : null}
              </div>
            </section>
          </>
        ) : (
          <section className="workspace">
            <div className="empty-state">
              <strong>Kein Template ausgewaehlt</strong>
              <p>Waehle ein Template aus der Bibliothek aus.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Chip({
  color,
  children,
}: {
  color: 'green' | 'gold' | 'blue' | 'red';
  children: ReactNode;
}) {
  return <span className={`chip ${color}`}>{children}</span>;
}

function PromptCard({ template, onSelect }: { template: PromptTemplate; onSelect: () => void }) {
  return (
    <article className="prompt-card">
      <button className="card-select" type="button" onClick={onSelect}>
        <div className="card-head">
          <div>
            <div className="tag-row">
              <Chip color="green">{template.category}</Chip>
            </div>
            <h3>{template.title}</h3>
          </div>
        </div>
        <p>{template.description}</p>
        <div className="card-meta-grid">
          {template.tags.map((tag) => (
            <Chip color="blue" key={tag}>
              {tag}
            </Chip>
          ))}
        </div>
      </button>
    </article>
  );
}

function CategoryFilter({
  active,
  category,
  count,
  onClick,
}: {
  active: boolean;
  category: string;
  count: number;
  onClick: () => void;
}) {
  const Icon = iconForCategory(category);

  return (
    <button className={`filter-pill ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      <span>
        <Icon aria-hidden="true" />
        {category}
      </span>
      <span className="count">{count}</span>
    </button>
  );
}
