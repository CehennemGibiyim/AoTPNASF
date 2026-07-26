/* Voice Assistant - TTS ile pazar sorgulama, build önerme ve fırsat bildirimi */
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

  // TTS voice - Turkish male narrator
  const DEFAULT_VOICE_ID = 'cartesia:d9c2e0f3-8483-4717-9e5d-f9ca572d802e'; // Altay
  const AI_MODEL_ID = 'dc2db118-7888-466a-a8d1-bf9d96bab4b6'; // DeepSeek V4 Flash Instant

  let isSpeaking = false;
  let currentUtterance = null;

  async function speak(text, voiceId = DEFAULT_VOICE_ID) {
    if (!window.miniappsAI?.tts?.speak) return;
    
    try {
      if (isSpeaking) {
        await window.miniappsAI.tts.stop();
      }
      isSpeaking = true;
      currentUtterance = await window.miniappsAI.tts.speak({
        text,
        voiceId,
        timeoutMs: 30000
      });
      return currentUtterance;
    } catch (error) {
      console.warn('TTS error:', error.message);
      window.AoTToast?.warning(t('tts-error', 'Seslendirme başarısız oldu'));
      return null;
    } finally {
      isSpeaking = false;
    }
  }

  async function stopSpeaking() {
    if (!window.miniappsAI?.tts?.stop) return;
    try {
      await window.miniappsAI.tts.stop();
      isSpeaking = false;
    } catch (e) {}
  }

  // AI-powered market query
  async function queryMarket(question) {
    if (!window.miniappsAI?.callModel) return null;
    
    try {
      const domain = window.getAlbionApiDomain?.() || 'europe.albion-online-data.com';
      const server = window.AppConfig?.server || 'europe';
      
      const result = await window.miniappsAI.callModel({
        modelId: AI_MODEL_ID,
        messages: [
          {
            role: 'system',
            content: `Sen Albion Online pazar uzmanısın. ${server} sunucusu için analiz yap. 
            Kısa ve öz cevaplar ver. Fiyatları silver cinsinden söyle. 
            Eğer canlı veri yoksa, genel pazar trendlerine göre tahmin yap.
            Cevapların max 2-3 cümle olsun.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        timeoutMs: 15000
      });
      
      return window.miniappsAI.extractText(result) || null;
    } catch (error) {
      return null;
    }
  }

  // Voice command processor
  async function processVoiceCommand(command) {
    const lower = command.toLowerCase().trim();
    
    // Market price query
    if (lower.includes('fiyat') || lower.includes('kaç') || lower.includes('ne kadar') || lower.includes('price')) {
      const item = lower.replace(/fiyat|kaç|ne kadar|price|fiyatı|satılıyor|alınıyor/gi, '').trim();
      if (item) {
        const response = await queryMarket(`${item} iteminin Albion Online ${window.AppConfig?.server || 'EU'} sunucusundaki güncel fiyatı nedir?`);
        if (response) {
          await speak(response);
          window.AoTToast?.info(response, { type: 'info', duration: 8000 });
        }
      }
    }
    
    // Arbitrage query
    else if (lower.includes('arbitraj') || lower.includes('kar') || lower.includes('fırsat')) {
      const response = await queryMarket(`Albion Online'da şu an en karlı arbitraj fırsatları neler? Hangi şehirden alıp hangi şehirde satmalı?`);
      if (response) {
        await speak(response);
        window.AoTToast?.deal(response, { duration: 10000 });
      }
    }
    
    // Build suggestion
    else if (lower.includes('build') || lower.includes('set') || lower.includes('silah')) {
      const weapon = lower.replace(/build|set|silah|için|öner/gi, '').trim();
      const response = await queryMarket(`Albion Online'da ${weapon || 'en popüler'} silah için en iyi PvP build önerisi nedir? Başlık, göğüs, ayakkabı, pelerin ve yemek öner.`);
      if (response) {
        await speak(response);
        window.AoTToast?.info(response, { type: 'build', duration: 10000 });
      }
    }
    
    // Gold price
    else if (lower.includes('altın') || lower.includes('gold')) {
      const response = await queryMarket(`Albion Online ${window.AppConfig?.server || 'EU'} sunucusunda güncel altın fiyatı nedir?`);
      if (response) {
        await speak(response);
        window.AoTToast?.info(response, { type: 'gold', duration: 8000 });
      }
    }
    
    // General question
    else {
      const response = await queryMarket(command);
      if (response) {
        await speak(response);
        window.AoTToast?.info(response, { duration: 8000 });
      }
    }
  }

  // UI: Voice assistant button and panel - uses navbar button
  function createVoiceUI() {
    const navBtn = document.getElementById('voiceAssistantBtn');
    if (!navBtn) return;
    
    // Create panel (not the button - button is already in navbar)
    const panel = document.createElement('div');
    panel.id = 'voicePanel';
    panel.className = 'voice-panel hidden';
    panel.innerHTML = `
        <div class="voice-panel-header">
          <span class="voice-panel-title">
            <i class="fa-solid fa-robot"></i> ${t('voice-title', 'Sesli Asistan')}
          </span>
          <button id="voiceCloseBtn" class="voice-close-btn" aria-label="${t('voice-close', 'Kapat')}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="voice-panel-body">
          <div class="voice-status" id="voiceStatus">
            <span class="voice-status-dot"></span>
            <span>${t('voice-ready', 'Dinlemeye hazır')}</span>
          </div>
          <div class="voice-input-area">
            <input type="text" id="voiceTextInput" class="voice-text-input" 
              placeholder="${t('voice-placeholder', 'Pazar sorusu sor... (örn: T6 kılıç fiyatı)')}"
              aria-label="${t('voice-input-label', 'Sesli asistan sorusu')}">
            <button id="voiceAskBtn" class="voice-ask-btn" aria-label="${t('voice-ask', 'Sor')}">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <div class="voice-quick-actions">
            <button class="voice-quick-btn" data-query="${t('voice-q-gold', 'Altın fiyatı ne kadar?')}">
              <i class="fa-solid fa-coins"></i> ${t('voice-q-gold-label', 'Altın')}
            </button>
            <button class="voice-quick-btn" data-query="${t('voice-q-arb', 'En karlı arbitraj fırsatı nedir?')}">
              <i class="fa-solid fa-sack-dollar"></i> ${t('voice-q-arb-label', 'Arbitraj')}
            </button>
            <button class="voice-quick-btn" data-query="${t('voice-q-build', 'En iyi solo PvP build öner')}">
              <i class="fa-solid fa-khanda"></i> ${t('voice-q-build-label', 'Build')}
            </button>
          </div>
          <div class="voice-history" id="voiceHistory"></div>
        </div>
        <div class="voice-panel-footer">
          <button id="voiceStopBtn" class="voice-stop-btn hidden" aria-label="${t('voice-stop', 'Durdur')}">
            <i class="fa-solid fa-stop"></i> ${t('voice-stop', 'Durdur')}
          </button>
          <span class="voice-footer-text">AoT-PNASF AI</span>
        </div>
    `;
    
    // Wrap in a positioned container relative to navbar
    const wrapper = document.createElement('div');
    wrapper.id = 'voiceAssistant';
    wrapper.className = 'voice-assistant';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-flex';
    wrapper.appendChild(panel);
    navBtn.parentNode.insertBefore(wrapper, navBtn.nextSibling);
    
    // Click navbar button to toggle panel
    navBtn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
      navBtn.classList.toggle('active');
      if (!panel.classList.contains('hidden')) {
        document.getElementById('voiceTextInput')?.focus();
      }
    });

    const closeBtn = panel.querySelector('#voiceCloseBtn');
    const askBtn = panel.querySelector('#voiceAskBtn');
    const textInput = panel.querySelector('#voiceTextInput');
    const stopBtn = panel.querySelector('#voiceStopBtn');
    const historyEl = panel.querySelector('#voiceHistory');
    
    let history = [];

    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      navBtn.classList.remove('active');
      stopSpeaking();
    });

    async function handleQuery(query) {
      if (!query.trim()) return;
      
      history.unshift({ type: 'user', text: query, time: Date.now() });
      renderHistory();
      
      updateStatus('thinking', t('voice-thinking', 'Düşünüyor...'));
      
      await processVoiceCommand(query);
      
      updateStatus('ready', t('voice-ready', 'Dinlemeye hazır'));
      textInput.value = '';
    }

    askBtn.addEventListener('click', () => handleQuery(textInput.value));
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleQuery(textInput.value);
    });

    panel.querySelectorAll('.voice-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => handleQuery(btn.dataset.query));
    });

    stopBtn.addEventListener('click', () => {
      stopSpeaking();
      stopBtn.classList.add('hidden');
      updateStatus('ready', t('voice-ready', 'Dinlemeye hazır'));
    });

    function updateStatus(status, text) {
      const statusEl = panel.querySelector('#voiceStatus');
      statusEl.querySelector('span:last-child').textContent = text;
      statusEl.className = `voice-status voice-status-${status}`;
    }

    function renderHistory() {
      historyEl.innerHTML = history.slice(0, 10).map(item => `
        <div class="voice-history-item voice-history-${item.type}">
          <span class="voice-history-role">${item.type === 'user' ? '👤' : '🤖'}</span>
          <span class="voice-history-text">${item.text}</span>
        </div>
      `).join('');
    }

    // Listen for speak events to show stop button
    const originalSpeak = speak;
    window._voiceSpeak = async function(text) {
      const btn = document.getElementById('voiceStopBtn');
      if (btn) btn.classList.remove('hidden');
      const result = await originalSpeak(text);
      if (btn) btn.classList.add('hidden');
      return result;
    };
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('voice-assistant-styles')) return;
    const style = document.createElement('style');
    style.id = 'voice-assistant-styles';
    style.textContent = `
      .voice-assistant {
        position: relative;
        display: inline-flex;
        z-index: 99990;
      }
      .voice-panel {
        position: absolute;
        bottom: 68px;
        right: 0;
        width: 340px;
        max-height: 520px;
        background: #1a1d2e;
        border: 1px solid #2a2d3e;
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .voice-panel.hidden {
        display: none;
      }
      .voice-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        border-bottom: 1px solid #2a2d3e;
        background: #141726;
      }
      .voice-panel-title {
        color: #d4af37;
        font-weight: 700;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .voice-close-btn {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 16px;
      }
      .voice-close-btn:hover {
        color: #f1f5f9;
        background: rgba(255,255,255,0.05);
      }
      .voice-panel-body {
        padding: 14px;
        flex: 1;
        overflow-y: auto;
      }
      .voice-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #94a3b8;
        margin-bottom: 12px;
      }
      .voice-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
      }
      .voice-status-thinking .voice-status-dot {
        background: #fbbf24;
        animation: pulse 1s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      .voice-input-area {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .voice-text-input {
        flex: 1;
        background: #0f1119;
        border: 1px solid #2a2d3e;
        border-radius: 10px;
        padding: 10px 14px;
        color: #e2e8f0;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;
      }
      .voice-text-input:focus {
        border-color: #d4af37;
      }
      .voice-ask-btn {
        background: #d4af37;
        border: none;
        color: #0a0a0a;
        width: 42px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.2s;
      }
      .voice-ask-btn:hover {
        background: #e8c547;
      }
      .voice-quick-actions {
        display: flex;
        gap: 6px;
        margin-bottom: 14px;
        flex-wrap: wrap;
      }
      .voice-quick-btn {
        flex: 1;
        min-width: 80px;
        background: #141726;
        border: 1px solid #2a2d3e;
        color: #94a3b8;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        font-weight: 600;
      }
      .voice-quick-btn:hover {
        background: #1e2235;
        border-color: #d4af37;
        color: #d4af37;
      }
      .voice-history {
        max-height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .voice-history-item {
        display: flex;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.4;
      }
      .voice-history-user {
        background: #141726;
        color: #94a3b8;
      }
      .voice-history-assistant {
        background: rgba(212,175,55,0.08);
        color: #e2e8f0;
        border: 1px solid rgba(212,175,55,0.15);
      }
      .voice-history-role {
        flex-shrink: 0;
        font-size: 14px;
      }
      .voice-panel-footer {
        padding: 10px 16px;
        border-top: 1px solid #2a2d3e;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .voice-stop-btn {
        background: #ef4444;
        border: none;
        color: white;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .voice-stop-btn.hidden {
        display: none;
      }
      .voice-footer-text {
        font-size: 10px;
        color: #475569;
        margin-left: auto;
      }
      @media (max-width: 480px) {
        .voice-panel {
          width: calc(100vw - 32px);
          right: -8px;
          max-height: 420px;
        }
        .voice-assistant {
          position: relative;
          display: inline-flex;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createVoiceUI();
  });

  // Expose API
  window.VoiceAssistant = {
    speak,
    stopSpeaking,
    queryMarket,
    processVoiceCommand,
    get isSpeaking() { return isSpeaking; }
  };
})();
