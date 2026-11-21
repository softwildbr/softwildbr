/* Soft Wild — somente melhorias de âncoras do arquivo de personagens.
   Busca, filtros, perfis e menu reutilizam portal.js. */
(() => {
  'use strict';
  const archive = document.getElementById('historias-descontinuadas');
  if (!archive) return;
  function openArchiveFromHash() {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target || (target !== archive && !archive.contains(target))) return;
    archive.open = true;
    if (target !== archive) {
      const details = target.querySelector('details');
      if (details) details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({behavior:'instant',block:'start'}));
    }
  }
  window.addEventListener('hashchange', openArchiveFromHash);
  openArchiveFromHash();
})();
