/* Discord Entegrasyonu: Fiyat sorgulama, alert gönderme, lonca komutları */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const STORAGE_KEY = 'aot_discord_config';

  const COMMANDS = [
    { cmd: '/fiyat T4_BAG', desc: 'T4 çanta fiyatını göster', icon: 'fa-coins' },
    { cmd: '/altin', desc: 'Güncel altın fiyatı', icon: 'fa-chart-line' },
    { cmd: '/arbitraj', desc: 'En iyi 5 arbitraj fırsatı', icon: 'fa-sack-dollar' },
    { cmd: '/build sword', desc: 'Kılıç build önerisi', icon: 'fa-khanda' },
    { cmd: '/etkinlik', desc: 'Yaklaşan etkinlikler', icon: 'fa-calendar' },
    { cmd: '/lonca-ozet', desc: 'Lonca haftalık özeti', icon: 'fa-chess-rook' },
    { cmd: '/alarm T4_BAG 50000', desc: 'Fiyat alarmı kur', icon: 'fa-bell' },
  ];

  const WEBHOOK_TEMPLATES = {
    price_alert: {
      title: '🚨 Fiyat Alarmı Tetiklendi',
      color: 0xd4af37,
      fields: ['item', 'targetPrice', 'currentPrice', 'city', 'timestamp']
    },
    arbitrage: {
      title: '💰 Arbitraj Fırsatı',
      color: 0x00d4aa,
      fields: ['item', 'buyCity', 'sellCity', 'profit', 'roi']
    },
    guild_summary: {
      title: '📊 Haftalık Lonca Özeti',
      color: 0x448aff,
      fields: ['totalMembers', 'activeMembers', 'totalProfit', 'topEarner']
    }
  };

  async function loadConfig() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' });
      return raw ? JSON.parse(raw) : { webhookUrl: '', alerts: [], guildId: '', enabled: false };
    } catch (e) { return { webhookUrl: '', alerts: [], guildId: '', enabled: false }; }
  }

  async function saveConfig(config) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(config), { area: 'persistent' });
    } catch (e) {}
  }

  async function sendWebhook(webhookUrl, payload) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  async function sendAlert(config, alertData) {
    if (!config.enabled || !config.webhookUrl) return false;

    const embed = {
      title: WEBHOOK_TEMPLATES.price_alert.title,
      color: WEBHOOK_TEMPLATES.price_alert.color,
      fields: [
        { name: 'Eşya', value: alertData.item || 'Bilinmiyor', inline: true },
        { name: 'Hedef Fiyat', value: (alertData.targetPrice || 0).toLocaleString() + ' 🥈', inline: true },
        { name: 'Güncel Fiyat', value: (alertData.currentPrice || 0).toLocaleString() + ' 🥈', inline: true },
        { name: 'Şehir', value: alertData.city || 'Bilinmiyor', inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'AoT-PNASF Market Bot' }
    };

    return sendWebhook(config.webhookUrl, { embeds: [embed] });
  }

  async function sendArbitrageAlert(config, data) {
    if (!config.enabled || !config.webhookUrl) return false;

    const embed = {
      title: WEBHOOK_TEMPLATES.arbitrage.title,
      color: WEBHOOK_TEMPLATES.arbitrage.color,
      fields: [
        { name: 'Eşya', value: data.item || 'Bilinmiyor', inline: true },
        { name: 'Alış', value: (data.buyCity || '?') + ' @ ' + (data.buyPrice || 0).toLocaleString(), inline: true },
        { name: 'Satış', value: (data.sellCity || '?') + ' @ ' + (data.sellPrice || 0).toLocaleString(), inline: true },
        { name: 'Kar', value: (data.profit || 0).toLocaleString() + ' 🥈', inline: true },
        { name: 'ROI', value: '%' + (data.roi || 0).toFixed(1), inline: true }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'AoT-PNASF Arbitraj Bot' }
    };

    return sendWebhook(config.webhookUrl, { embeds: [embed] });
  }

  function generateBotCode(config) {
    const webhook = config.webhookUrl || 'WEBHOOK_URL';
    return `// Albion Market Discord Bot - Node.js
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const WEBHOOK = '${webhook}';
const API = 'https://europe.albion-online-data.com/api/v2/stats/prices/';

client.on('ready', () => console.log('AoT Market Bot aktif!'));

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  
  if (msg.content === '/altin') {
    const gold = await axios.get(API + 'T3_GOLD.json');
    const price = gold.data[0]?.sell_price_min || 0;
    msg.reply('🪙 Güncel Altın: ' + price.toLocaleString() + ' 🥈');
  }
  
  if (msg.content.startsWith('/fiyat')) {
    const item = msg.content.split(' ')[1] || 'T4_BAG';
    const data = await axios.get(API + item + '.json');
    const prices = data.data.map(p => 
      p.city + ': Alış ' + (p.sell_price_min||0).toLocaleString() + 
      ' / Satış ' + (p.buy_price_max||0).toLocaleString()
    ).join('\\n');
    msg.reply('📊 **' + item + '** Fiyatları:\\n' + prices);
  }
});

client.login('BOT_TOKEN');`;
  }

  async function render(container) {
    if (!container) return;
    const config = await loadConfig();

    container.innerHTML = `
      <div class="discord-bridge max-w-4xl mx-auto p-4 space-y-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-[#5865F2]/20 border border-[#5865F2]/40 rounded-lg flex items-center justify-center">
            <i class="fa-brands fa-discord text-[#5865F2] text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">${t('discord-title', 'Discord Entegrasyonu')}</h2>
            <p class="text-xs text-gray-400">${t('discord-desc', 'Discord sunucunuzda fiyat sorgulama, alarm ve lonca komutları')}</p>
          </div>
        </div>

        <!-- Webhook Ayarları -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <h3 class="text-sm font-bold text-[#5865F2] flex items-center gap-2">
            <i class="fa-solid fa-plug"></i> ${t('discord-webhook', 'Webhook Ayarları')}
          </h3>
          <label class="block">
            <span class="text-xs text-gray-400">Discord Webhook URL</span>
            <input type="url" id="discordWebhook" value="${config.webhookUrl || ''}" placeholder="https://discord.com/api/webhooks/..." 
              class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm font-mono">
          </label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="discordEnabled" ${config.enabled ? 'checked' : ''} class="rounded accent-[#5865F2]">
              <span class="text-xs text-gray-300">Bildirimleri Aktifleştir</span>
            </label>
            <button id="discordSave" class="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
              <i class="fa-solid fa-floppy-disk mr-1.5"></i> Kaydet
            </button>
            <button id="discordTest" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
              <i class="fa-solid fa-paper-plane mr-1.5"></i> Test Gönder
            </button>
          </div>
          <div id="discordStatus" class="text-xs hidden"></div>
        </div>

        <!-- Komut Listesi -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-terminal"></i> ${t('discord-commands', 'Discord Bot Komutları')}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${COMMANDS.map(c => `
              <div class="bg-albion-900 rounded-lg p-3 border border-gray-700 flex items-start gap-3 hover:border-gray-500 transition-colors cursor-pointer copy-cmd" data-cmd="${c.cmd}">
                <i class="fa-solid ${c.icon} text-albion-accent text-sm mt-0.5"></i>
                <div>
                  <code class="text-xs text-white font-mono bg-black/30 px-1.5 py-0.5 rounded">${c.cmd}</code>
                  <div class="text-[10px] text-gray-500 mt-0.5">${c.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bot Kodu -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-code"></i> ${t('discord-botCode', 'Bot Kodu (Node.js)')}
          </h3>
          <div class="relative">
            <pre class="bg-[#0a0d14] rounded-lg p-4 text-xs text-gray-300 overflow-x-auto font-mono max-h-80 custom-scroll" id="discordBotCode">${generateBotCode(config)}</pre>
            <button id="copyBotCode" class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
              <i class="fa-solid fa-copy mr-1"></i> Kopyala
            </button>
          </div>
          <p class="text-[10px] text-gray-500 mt-2">
            <i class="fa-solid fa-circle-info mr-1"></i> 
            Bu kodu kendi Discord botunuza entegre edin. <code>BOT_TOKEN</code> ve <code>WEBHOOK_URL</code> değerlerini güncelleyin.
          </p>
        </div>
      </div>
    `;

    // Event listeners
    const statusEl = container.querySelector('#discordStatus');
    const showStatus = (msg, ok) => {
      if (!statusEl) return;
      statusEl.classList.remove('hidden');
      statusEl.className = 'text-xs mt-2 ' + (ok ? 'text-emerald-400' : 'text-red-400');
      statusEl.textContent = msg;
    };

    container.querySelector('#discordSave')?.addEventListener('click', async () => {
      config.webhookUrl = container.querySelector('#discordWebhook')?.value || '';
      config.enabled = container.querySelector('#discordEnabled')?.checked || false;
      await saveConfig(config);
      showStatus('✅ Ayarlar kaydedildi!', true);
    });

    container.querySelector('#discordTest')?.addEventListener('click', async () => {
      const url = container.querySelector('#discordWebhook')?.value || config.webhookUrl;
      if (!url) { showStatus('⚠️ Webhook URL gerekli!', false); return; }
      const ok = await sendWebhook(url, {
        content: '✅ **AoT-PNASF Discord Entegrasyonu** başarıyla kuruldu! 🎉\nArtık fiyat alarmlarını ve arbitraj fırsatlarını burada göreceksiniz.',
        embeds: [{
          title: '🪙 Test Bildirimi',
          color: 0xd4af37,
          fields: [
            { name: 'Altın Fiyatı', value: '5,234 🥈', inline: true },
            { name: 'Sunucu', value: 'EU', inline: true },
          ],
          footer: { text: 'AoT-PNASF Market Bot' }
        }]
      });
      showStatus(ok ? '✅ Test bildirimi gönderildi!' : '❌ Gönderilemedi. URL\'yi kontrol edin.', ok);
    });

    container.querySelector('#copyBotCode')?.addEventListener('click', () => {
      const code = container.querySelector('#discordBotCode')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        showStatus('✅ Bot kodu panoya kopyalandı!', true);
      });
    });

    container.querySelectorAll('.copy-cmd')?.forEach(el => {
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.cmd || '').then(() => {
          showStatus('✅ Komut kopyalandı: ' + el.dataset.cmd, true);
        });
      });
    });
  }

  window.DiscordBridge = { render, sendAlert, sendArbitrageAlert, sendWebhook, loadConfig, COMMANDS };
  console.log('DiscordBridge loaded');
})();
