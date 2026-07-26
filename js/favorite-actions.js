/* Adds one-tap watch buttons to dynamic market result cards without owning their rendering. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  function itemIdFromImage(img) {
    const match = img?.src?.match(/\/item\/([^.?]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }
  function decorate(root = document) {
    root.querySelectorAll('#oppTableBody img, #manualSearchResults img, #bmTableBody img, #cityTableBody img').forEach((img) => {
      const id = itemIdFromImage(img);
      const cell = img.closest('td, .bg-albion-800');
      if (!id || !cell || cell.querySelector(`[data-inline-favorite="${id}"]`)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'market-favorite-inline';
      button.dataset.inlineFavorite = id;
      button.title = t('market-addWatch', 'Takibe ekle');
      button.setAttribute('aria-label', `${t('market-addWatch', 'Takibe ekle')}: ${id}`);
      button.innerHTML = '<i class="fa-solid fa-star"></i>';
      button.addEventListener('click', async () => {
        await window.MarketFavorites?.addFavorite({ id });
        button.classList.add('is-added');
        button.title = t('market-added', 'Eşya takibe alındı.');
      });
      cell.appendChild(button);
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    decorate();
    const observer = new MutationObserver(() => decorate());
    ['oppTableBody', 'manualSearchResults', 'bmTableBody', 'cityTableBody'].forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node, { childList: true, subtree: true });
    });
  });
})();
