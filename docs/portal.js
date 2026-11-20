/* Soft Wild / Portal — melhoria progressiva: sem JavaScript, o catálogo e os detalhes continuam disponíveis. */
(() => {
  'use strict';
  document.documentElement.classList.add('sw-enhanced');

  const nav = document.querySelector('[data-sw-nav]');
  const menu = document.querySelector('[data-sw-menu]');
  if (nav && menu) {
    const close = () => {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
    };
    menu.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  const root = document.querySelector('[data-sw-catalog]');
  if (!root) return;
  const cards = [...root.querySelectorAll('.sw-card[data-category]')];
  const search = document.querySelector('[data-sw-search]');
  const stage = document.querySelector('[data-sw-stage]');
  const chips = [...document.querySelectorAll('[data-sw-filter]')];
  const results = document.querySelector('[data-sw-results]');
  const empty = document.querySelector('[data-sw-empty]');
  const clear = document.querySelector('[data-sw-clear]');
  const sections = [...root.querySelectorAll('[data-sw-section]')];
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

  let activeCategory = 'todos';
  function apply() {
    const query = normalize(search?.value?.trim() || '');
    const activeStage = stage?.value || 'todos';
    let visible = 0;
    for (const card of cards) {
      const categories = (card.dataset.category || '').split(/\s+/);
      const matchesCategory = activeCategory === 'todos' || categories.includes(activeCategory);
      const matchesStage = activeStage === 'todos' || (card.dataset.phase || '') === activeStage;
      const matchesQuery = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesCategory && matchesStage && matchesQuery);
      if (!card.hidden) visible++;
    }
    for (const section of sections) {
      section.hidden = !section.querySelector('.sw-card:not([hidden])');
    }
    if (results) results.textContent = visible === 1 ? '1 resultado' : visible + ' resultados';
    if (empty) empty.hidden = visible !== 0;
    chips.forEach((button) => {
      const current = button.dataset.swFilter === activeCategory;
      button.setAttribute('aria-pressed', String(current));
    });
  }
  chips.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.swFilter;
    apply();
  }));
  search?.addEventListener('input', apply);
  stage?.addEventListener('change', apply);
  function reset() {
    activeCategory = 'todos';
    if (search) search.value = '';
    if (stage) stage.value = 'todos';
    apply();
  }
  clear?.addEventListener('click', reset);

  function resolveHash() {
    if (!location.hash || location.hash.length < 2) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('sw-card')) return;
    if (target.hidden) reset();
    const details = target.querySelector('details');
    if (details) details.open = true;
    requestAnimationFrame(() => target.scrollIntoView({behavior:'instant',block:'start'}));
  }
  window.addEventListener('hashchange', resolveHash);
  root.addEventListener('click', (event) => {
    if (event.target.closest('.sw-anchor')) {
      requestAnimationFrame(resolveHash);
    }
  });
  apply();
  resolveHash();
})();
