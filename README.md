# 🏆 AoT-PNASF — Albion Online AI Destekli Platform

**Türkiye'nin 1 numaralı AI destekli Albion Online platformu.** Canlı piyasa fiyatları, arbitraj fırsatları, crafting kâr hesaplama, build önerileri, PvP istatistikleri, etkinlik takvimi ve 30+ gelişmiş modül.

![Albion Platform](https://img.shields.io/badge/Status-Aktif-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![Miniapp](https://img.shields.io/badge/Platform-Miniapp-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Canlı Demo

- **Miniapp Preview:** [AoT-PNASF Preview](https://preview.miniapps.ai/miniapps/draft/7245bb16-2477-46cf-9292-379c0f1fe22c)
- **GitHub Pages:** [GitHub Pages Linki](https://kullaniciadiniz.github.io/albion-market-tools)

## ✨ Ana Özellikler

### 📊 **Pazar & Ekonomi**
- **Canlı Altın Takibi** — Grafikler, günlük/haftalık/aylık analiz
- **Eşya Fiyatları** — Tüm tier/enchant kombinasyonları
- **Arbitraj Fırsatları** — Şehirler arası fiyat farkları
- **Market Uyarıları** — Fiyat düşüş/yükseliş bildirimleri
- **Crafting Kâr Hesaplama** — Gerçek zamanlı malzeme maliyeti

### ⚔️ **Savaş & Build**
- **AI Build Rehberi** — Silah seç, AI sana PvE ve PvP build önersin
- **PvP İstatistikleri** — Meta analizi, killboard, zayıf noktalar
- **Grup Kompozisyonları** — Dungeon, HCE, Avalon için ideal takım
- **Build Lab** — Detaylı build simülatörü

### 🗺️ **Harita & Keşif**
- **Avalon Roads** — Yol planlayıcı, risk ve gelir tahmini
- **Etkinlik Takvimi** — Günlük/haftalık etkinlik zamanlayıcısı
- **Toplayıcılık** — Kaynak lokasyonları, enchant oranları
- **İnteraktif Harita** — Zonlar, kaynaklar, spawn noktaları

### 🧠 **AI & Akıllı Sistemler**
- **Sesli Asistan** — Sesli komutlarla fiyat sorgulama
- **AI Tema Üreticisi** — Prompt ile özel tema oluşturma
- **Strateji Koçu** — Oyun içi karar destek sistemi
- **Market Simülatörü** — Fiyat tahmini ve simülasyon

### 🏢 **Operasyon & Lonca**
- **Operasyon Merkezi** — Lonca operasyon planlama
- **Spawn Noktaları** — Mob spawn zamanları
- **Risk Haritası** — Bölge risk analizi
- **Guild Operations** — Lonca yönetim araçları

### 🎮 **Araçlar & Oyunlar**
- **Loot Simülatörü** — RNG loot simülasyonu
- **Crafting RNG** — Kalite şansı hesaplama
- **Fame Hesaplayıcı** — Fame kazanma optimizasyonu
- **Mini Oyunlar** — Albion temalı mini oyunlar

## 🌐 Dil Desteği

- 🇹🇷 **Türkçe** (Varsayılan)
- 🇺🇸 **İngilizce**
- 🇩🇪 **Almanca**
- 🇪🇸 **İspanyolca**
- 🇷🇺 **Rusça**

## 🛠️ Teknolojiler

| Teknoloji | Amaç |
|-----------|------|
| **HTML5** | Semantic yapı, responsive tasarım |
| **CSS3** | Modern animasyonlar, grid/flexbox |
| **Vanilla JS (ES6+)** | Tüm iş mantığı, modüler yapı |
| **Tailwind CSS** | Utility-first CSS framework |
| **Chart.js** | Grafikler ve veri görselleştirme |
| **Miniapps AI SDK** | AI modelleri, TTS, storage |
| **Miniapps i18n** | Çoklu dil desteği |
| **Font Awesome 6** | İkonlar ve UI elemanları |
| **Service Worker** | Offline çalışma, bildirimler |

## 📁 Proje Yapısı

```
albion-market-tools/
├── index.html              # Ana uygulama shell
├── styles.css              # Global stiller
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── .github/workflows/      # CI/CD pipeline
├── locales/                # Çoklu dil dosyaları (5 dil)
├── js/                     # Tüm JavaScript modülleri
│   ├── main.js             # Bootstrap ve routing
│   ├── core/               # Çekirdek sistemler
│   │   ├── api.js          # API entegrasyonu
│   │   ├── auth.js         # Kimlik doğrulama
│   │   ├── dashboard.js    # Dashboard sistemi
│   │   └── storage.js      # Storage yönetimi
│   ├── ui/                 # UI bileşenleri (20+ modül)
│   │   ├── ai-assistant.js # AI asistan
│   │   ├── voice-assistant.js # Sesli asistan
│   │   ├── build-simulator.js # Build simülatörü
│   │   └── ...             # 20+ UI modülü
│   ├── market/             # Pazar modülleri
│   ├── crafting/           # Crafting modülleri
│   ├── pvp/                # PvP modülleri
│   └── operations/         # Operasyon modülleri
└── README.md               # Bu dosya
```

## 🚀 Kurulum

### Yerel Geliştirme

1. **Repoyu klonlayın:**
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/albion-market-tools.git
   cd albion-market-tools
   ```

2. **Web sunucusu başlatın:**
   - VS Code Live Server eklentisi
   - veya `python3 -m http.server 8000`
   - veya `npx serve .`

3. **Tarayıcıda açın:**
   - `http://localhost:8000` veya `http://localhost:5500`

### GitHub Pages Deployment

Proje otomatik olarak GitHub Pages'e deploy edilir:

1. **Settings → Pages → Build and deployment**
2. **Source:** GitHub Actions
3. **Workflow:** `.github/workflows/deploy.yml`

Her push'ta otomatik deploy çalışır.

## 🔧 Geliştirme

### Modül Ekleme
1. Yeni JS dosyası oluştur: `js/ui/yeni-modul.js`
2. `index.html`'de script tag'i ekle
3. `main.js`'de routing ekle (gerekirse)
4. İ18n desteği için locale dosyalarına key ekle

### İ18n (Çoklu Dil)
- `locales/` klasöründeki JSON dosyalarını düzenle
- HTML'de: `data-i18n="key"`
- JS'de: `window.miniappI18n?.t('key')`

### AI Entegrasyonu
- `miniapp_list_ai_models()` ile model bul
- `miniappsAI.callModel()` ile çağrı yap
- TTS için: `miniappsAI.tts.speak()`

## 📱 Responsive Tasarım

- **Mobil:** 320px - 767px
- **Tablet:** 768px - 1023px  
- **Desktop:** 1024px+
- **Touch-friendly:** 44px+ tıklama alanları

## 🎨 Tema Sistemi

4 built-in tema:
1. **Obsidian Gold** (Varsayılan) — Koyu altın
2. **Deep Ocean** — Koyu mavi
3. **Blood Moon** — Kırmızı siyah
4. **Emerald Forest** — Yeşil

**AI Tema Üreticisi:** Prompt yaz, AI renk paleti oluştursun.

## 🔒 Güvenlik & Performans

- **CSP Headers** — XSS koruması
- **Service Worker** — Offline çalışma
- **Lazy Loading** — Modüller gerektikçe yüklenir
- **Storage Limit** — 1MB/user, 100 key limit
- **Error Boundaries** — Hata yönetimi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim & Destek

- **GitHub Issues:** [Sorun Bildir](https://github.com/KULLANICI_ADINIZ/albion-market-tools/issues)
- **Discord:** [Sunucumuz](https://discord.gg/albion) (Entegre)
- **Email:** destek@albion-platform.com

## 🙏 Teşekkürler

- **Albion Online** — Sandbox Interactive
- **Miniapps.ai** — Platform ve SDK
- **GitHub** — Hosting ve CI/CD
- **Tüm katkıda bulunanlar**

---

**⭐ Star atın ve takip edin!** Geliştirmeler devam ediyor...