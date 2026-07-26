/* Stable, accessible navigation behavior for the permanent left rail. */
(function () {
  const STORAGE_KEY = 'aot-last-tab';
  const sidebar = () => document.getElementById('navMenu');
  const buttons = () => Array.from(document.querySelectorAll('#navMenu .tab-btn[data-tab]'));

  function syncActiveState(activeButton) {
    buttons().forEach((button) => {
      const active = button === activeButton;
      button.setAttribute('aria-current', active ? 'page' : 'false');
      button.classList.toggle('active', active);
    });
    if (activeButton) {
      activeButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  async function saveLastTab(tabId) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, tabId, { sync: false });
    } catch (error) {
      // Navigation must remain usable if isolated storage is unavailable.
    }
  }

  async function restoreLastTab() {
    try {
      const saved = await window.miniappsAI?.storage?.getItem(STORAGE_KEY);
      const button = buttons().find((item) => item.dataset.tab === saved);
      if (button && saved !== 'tab-home') button.click();
    } catch (error) {
      // The default home screen is a safe fallback.
    }
  }

  function wireKeyboardNavigation() {
    buttons().forEach((button, index, allButtons) => {
      button.addEventListener('click', () => {
        syncActiveState(button);
        saveLastTab(button.dataset.tab);
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? allButtons.length - 1 : (index + direction + allButtons.length) % allButtons.length;
        allButtons[nextIndex]?.focus();
      });
    });
  }

  function init() {
    if (!sidebar() || !buttons().length) return;
    const active = buttons().find((button) => button.classList.contains('border-albion-accent')) || buttons()[0];
    syncActiveState(active);
    wireKeyboardNavigation();
    restoreLastTab();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
