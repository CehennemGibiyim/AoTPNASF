/* AI Builds Live Search */
(function () {
  async function performLiveSearch(query) {
    if (query.trim().length < 3) return [];
    
    try {
      const targetUrl = `https://gameinfo.albiononline.com/api/gameinfo/search?q=${encodeURIComponent(query)}`;
      
      // Try multiple proxies
      const urls = [
        targetUrl,
        'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl),
        'https://corsproxy.io/?' + encodeURIComponent(targetUrl)
      ];
      
      let items = [];
      
      for (let url of urls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data && data.items) {
              items = data.items;
              break;
            }
          }
        } catch (err) {
          // Try next proxy
          continue;
        }
      }

      // Filter and format results
      const formattedItems = items
        .filter(i => i.Id && i.Id.match(/^T[4-8]_/))
        .map(i => ({
          id: i.Id,
          name: i.Name,
          tier: i.Id.match(/T([0-9])_/)?.[1] || '0',
          type: i.Type || 'weapon'
        }))
        .sort((a, b) => {
          // Sort by tier (descending) then name
          if (parseInt(b.tier) !== parseInt(a.tier)) {
            return parseInt(b.tier) - parseInt(a.tier);
          }
          return a.name.localeCompare(b.name);
        });

      return formattedItems;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  function renderSearchResults(items, container, onSelect, selectedId = null) {
    container.innerHTML = '';
    
    if (items.length === 0) {
      container.innerHTML = '<div class="col-span-full text-xs text-gray-500 py-2 text-center">Sonuç bulunamadı. Tam ismini yazmayı deneyin.</div>';
      return;
    }

    items.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `relative w-full aspect-square bg-[#0a0d14] border rounded p-0.5 hover:border-albion-accent hover:scale-105 transition-all group overflow-hidden shadow-inner flex items-center justify-center shrink-0 ${
        item.id === selectedId ? 'border-albion-accent shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-gray-700'
      }`;

      // Use ItemCard for image rendering
      const imgSrc = window.ItemCard?.image?.(item.id, 1) || '';
      const imgHtml = `<img loading="lazy" src="${imgSrc}" class="w-full h-full object-contain drop-shadow-md transition-opacity" alt="${item.name}" data-image-fallback="item">`;
      const titleHtml = `<div class="absolute bottom-0 left-0 right-0 bg-black/90 text-[6px] md:text-[7px] text-white font-bold leading-tight py-0.5 px-0.5 text-center truncate opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${item.name} (T${item.tier})</div>`;
      
      button.innerHTML = imgHtml + titleHtml;

      button.addEventListener('click', () => {
        onSelect(item);
      });

      container.appendChild(button);
    });
  }

  function createSearchInput(onSearch, placeholder = "İngilizce Silah adı yazın...") {
    const container = document.createElement('div');
    container.className = 'col-span-full mb-2 bg-[#0a0d14] border border-gray-700 p-2 rounded-lg shadow-inner';
    
    container.innerHTML = `
      <div class="text-[10px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider">
        <i class="fa-solid fa-cloud-arrow-down mr-1"></i> Albion Canlı Veritabanında Ara
      </div>
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500 text-sm"></i>
        <input type="text" class="search-input w-full bg-albion-900 border border-gray-600 rounded p-1.5 pl-8 text-sm text-white focus:border-albion-accent focus:outline-none transition-colors" placeholder="${placeholder}">
      </div>
      <div class="search-loading hidden text-xs text-albion-accent mt-2 font-bold">
        <i class="fa-solid fa-spinner fa-spin mr-1"></i> Sunucudan çekiliyor...
      </div>
      <div class="search-results mt-2 grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-14 gap-1 w-full max-h-[160px] overflow-y-auto custom-scroll pr-1"></div>
    `;

    const input = container.querySelector('.search-input');
    const loading = container.querySelector('.search-loading');
    const resultsContainer = container.querySelector('.search-results');
    
    let timeoutId = null;

    input.addEventListener('input', (event) => {
      clearTimeout(timeoutId);
      const query = event.target.value.trim();
      
      if (query.length < 3) {
        resultsContainer.innerHTML = '<div class="col-span-full text-xs text-gray-500 py-2 italic text-center">En az 3 karakter yazın.</div>';
        return;
      }

      timeoutId = setTimeout(async () => {
        loading.classList.remove('hidden');
        resultsContainer.innerHTML = '<div class="col-span-full text-xs text-gray-500 py-2 text-center">Aranıyor...</div>';
        
        const items = await performLiveSearch(query);
        
        loading.classList.add('hidden');
        
        if (typeof onSearch === 'function') {
          renderSearchResults(items, resultsContainer, onSearch);
        }
      }, 600);
    });

    return container;
  }

  // Export to global scope
  window.AISearch = {
    performLiveSearch,
    renderSearchResults,
    createSearchInput,
    debouncedSearch: function(query, callback, delay = 600) {
      let timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(query), delay);
    }
  };

  console.log('AI Search module loaded');
})();