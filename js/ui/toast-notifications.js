/* Toast notification system with queue, types, and PWA push support */
(function () {
  const t = (key, fallback) => {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (e) {}
    return fallback || key;
  };

  let container = null;
  let queue = [];
  let activeTimer = null;
  let pushSupported = false;

  const ICONS = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
    deal: 'fa-sack-dollar',
    gold: 'fa-coins',
    event: 'fa-clock',
    build: 'fa-robot',
    craft: 'fa-hammer',
    pvp: 'fa-skull',
    gathering: 'fa-leaf',
    alert: 'fa-bell'
  };

  const COLORS = {
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    deal: '#d4af37',
    gold: '#facc15',
    event: '#c084fc',
    build: '#38bdf8',
    craft: '#fb923c',
    pvp: '#f87171',
    gathering: '#4ade80',
    alert: '#fbbf24'
  };

  function ensureContainer() {
    if (container && document.body.contains(container)) return;
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }

  function createToastElement(message, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', 'status');
    
    const icon = ICONS[type] || ICONS.info;
    const color = COLORS[type] || COLORS.info;
    
    toast.innerHTML = `
      <div class="toast-icon" style="color:${color}">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="toast-body">
        <p class="toast-message">${message}</p>
        ${duration > 0 ? `<div class="toast-progress"><div class="toast-progress-bar" style="animation-duration:${duration}ms"></div></div>` : ''}
      </div>
      <button class="toast-close" aria-label="${t('toast-close', 'Kapat')}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));
    
    if (duration > 0) {
      toast.dataset.timer = setTimeout(() => dismissToast(toast), duration);
    }

    toast.addEventListener('mouseenter', () => {
      if (toast.dataset.timer) clearTimeout(Number(toast.dataset.timer));
    });
    toast.addEventListener('mouseleave', () => {
      if (duration > 0) {
        toast.dataset.timer = setTimeout(() => dismissToast(toast), duration);
      }
    });

    return toast;
  }

  function dismissToast(toast) {
    if (toast.dataset.timer) clearTimeout(Number(toast.dataset.timer));
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) toast.remove();
      processQueue();
    }, { once: true });
  }

  function processQueue() {
    if (!container) return;
    const visible = container.querySelectorAll('.toast-item:not(.toast-exit)');
    if (visible.length >= 5 || queue.length === 0) return;
    
    const next = queue.shift();
    const toast = createToastElement(next.message, next.type, next.duration);
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('toast-enter');
    });
  }

  function show(message, options = {}) {
    const type = options.type || 'info';
    const duration = options.duration ?? 4000;
    const priority = options.priority ?? 0;

    ensureContainer();

    const item = { message, type, duration, priority };
    if (priority > 0) {
      queue.unshift(item);
    } else {
      queue.push(item);
    }

    processQueue();
    return { dismiss: () => {} };
  }

  // Price alert notification
  async function sendPriceAlert(itemName, oldPrice, newPrice, threshold) {
    const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
    const direction = change > 0 ? '⬆️' : '⬇️';
    const msg = t('alert-priceMsg', '{item}: {old} → {new} ({change}%)')
      .replace('{item}', itemName)
      .replace('{old}', oldPrice.toLocaleString())
      .replace('{new}', newPrice.toLocaleString())
      .replace('{change}', change);
    
    show(`${direction} ${msg}`, {
      type: change > 0 ? 'gold' : 'deal',
      duration: 8000,
      priority: 2
    });

    // Push notification if supported
    if (pushSupported && Notification.permission === 'granted') {
      try {
        const reg = await navigator.serviceWorker?.ready;
        if (reg) {
          reg.showNotification('AoT-PNASF | Fiyat Alarmı', {
            body: msg,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4af37"/></svg>',
            vibrate: [200, 100, 200],
            tag: `price-${itemName}`,
          });
        }
      } catch (e) {}
    }
  }

  // Event reminder
  function sendEventReminder(eventName, timeLeft) {
    const msg = t('alert-eventMsg', '{event} başlamasına {time} kaldı!')
      .replace('{event}', eventName)
      .replace('{time}', timeLeft);
    
    show(`⏰ ${msg}`, {
      type: 'event',
      duration: 10000,
      priority: 3
    });
  }

  // Arbitrage opportunity
  function sendArbitrageAlert(itemName, buyCity, sellCity, profit) {
    const msg = t('alert-arbMsg', '{item}: {buy} → {sell} = {profit} kar')
      .replace('{item}', itemName)
      .replace('{buy}', buyCity)
      .replace('{sell}', sellCity)
      .replace('{profit}', profit.toLocaleString() + ' 🥈');
    
    show(`💰 ${msg}`, {
      type: 'deal',
      duration: 12000,
      priority: 2
    });
  }

  // Initialize push support
  async function initPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        pushSupported = true;
        return true;
      }
    } catch (e) {}
    return false;
  }

  // Register SW safely
  async function registerSW() {
    if (!('serviceWorker' in navigator) || window.self !== window.top) return;
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      return reg;
    } catch (e) {}
  }

  window.AoTToast = {
    show,
    success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, type: 'error', duration: (opts?.duration || 6000) }),
    warning: (msg, opts) => show(msg, { ...opts, type: 'warning' }),
    info: (msg, opts) => show(msg, { ...opts, type: 'info' }),
    deal: (msg, opts) => show(msg, { ...opts, type: 'deal' }),
    sendPriceAlert,
    sendEventReminder,
    sendArbitrageAlert,
    initPushNotifications,
    registerSW,
    get pushReady() { return pushSupported; }
  };

  // Inject toast styles
  function injectStyles() {
    if (document.getElementById('toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-container {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 380px;
        width: calc(100% - 32px);
        pointer-events: none;
      }
      .toast-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        background: #1a1d2e;
        border: 1px solid #2a2d3e;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        pointer-events: auto;
        transform: translateX(120%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .toast-item.toast-enter {
        transform: translateX(0);
        opacity: 1;
      }
      .toast-item.toast-exit {
        transform: translateX(120%);
        opacity: 0;
      }
      .toast-icon {
        flex-shrink: 0;
        font-size: 20px;
        margin-top: 1px;
      }
      .toast-body {
        flex: 1;
        min-width: 0;
      }
      .toast-message {
        margin: 0;
        font-size: 13px;
        color: #e2e8f0;
        line-height: 1.4;
        word-break: break-word;
      }
      .toast-progress {
        height: 3px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        margin-top: 8px;
        overflow: hidden;
      }
      .toast-progress-bar {
        height: 100%;
        background: currentColor;
        border-radius: 2px;
        animation: toastProgress linear forwards;
      }
      @keyframes toastProgress {
        from { width: 100%; }
        to { width: 0%; }
      }
      .toast-close {
        flex-shrink: 0;
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 2px 4px;
        font-size: 14px;
        border-radius: 4px;
        transition: color 0.2s;
        min-width: 28px;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .toast-close:hover {
        color: #f1f5f9;
        background: rgba(255,255,255,0.05);
      }
      @media (max-width: 480px) {
        .toast-container {
          top: 8px;
          right: 8px;
          left: 8px;
          max-width: none;
          width: auto;
        }
        .toast-item {
          padding: 10px 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    registerSW().then(() => {
      initPushNotifications();
    });
  });
})();
