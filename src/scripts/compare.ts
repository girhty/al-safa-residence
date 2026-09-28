/** Shared comparison store — persisted in localStorage so selection survives navigation & language switch */
const KEY = 'alsafa:compare';
export const MAX = 3;
let memory: string[] | null = null;

export function getSelection(): string[] {
  if (memory) return memory;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function setSelection(ids: string[]): void {
  const clean = Array.from(new Set(ids)).slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(clean));
    memory = null;
  } catch {
    memory = clean; // storage blocked (private mode) — keep in memory for this page
  }
  window.dispatchEvent(new CustomEvent('compare:change', { detail: clean }));
}

export function toggleUnit(id: string, on: boolean): boolean {
  const sel = getSelection();
  if (on) {
    if (sel.includes(id)) return true;
    if (sel.length >= MAX) return false;
    setSelection([...sel, id]);
    return true;
  }
  setSelection(sel.filter((x) => x !== id));
  return true;
}

function syncInputs() {
  const sel = getSelection();
  document.querySelectorAll<HTMLInputElement>('input[data-compare-id]').forEach((i) => {
    i.checked = sel.includes(i.dataset.compareId || '');
  });
}

let bound = false;
export function bindCompareInputs(): void {
  if (bound) return;
  bound = true;
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || !t.dataset.compareId) return;
    if (!toggleUnit(t.dataset.compareId, t.checked)) {
      t.checked = false;
      window.dispatchEvent(new CustomEvent('compare:max'));
    }
  });
  window.addEventListener('compare:change', syncInputs);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) window.dispatchEvent(new CustomEvent('compare:change'));
  });
  window.addEventListener('pageshow', syncInputs);
  syncInputs();
}