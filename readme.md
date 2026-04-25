# AoT-PNASF | Albion Online AI Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Albion Online](https://img.shields.io/badge/Albion%20Online-Companion%20App-blue)](https://albiononline.com/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://miniapps.ai/)

**Türkiye'nin 1 Numaralı AI Destekli Albion Online Platformu**

AoT-PNASF, Albion Online oyuncuları için geliştirilmiş kapsamlı bir companion (yardımcı) uygulamadır. Yapay zeka destekli build önerileri, piyasa arbitrajı, etkinlik takibi ve daha birçok özelliği tek bir平台上da sunar.

## 🌟 Özellikler

### 🏠 Ana Sayfa
- **Canlı Altın Fiyatları**: Gerçek zamanlı piyasa verileri ve grafikler
- **Piyasa Eşleşmesi Geri Sayımı**: Sunucu sıfırlama zamanlayıcısı
- **Haber Kaydırıcısı**: Önemli güncellemeler ve duyurular
- **Oyuncu Arama**: Hızlı oyuncu profiline erişim

### ⏰ Etkinlikler
- **Sunucu Bazlı Prime Time Takvimi**: EU, NA, ASIA sunucuları için optimize edilmiş
- **Kale ve Outpost Listesi**: Hedeflenecek stratejik noktalar
- **Deploy Önerileri**: Toplanma noktaları ve taktiksel bilgiler
- **Dinamik Geri Sayım**: Sıradaki etkinliğe kalan süre

### ⚒️ Crafting & Üretim
- **Kraliyet Kıtası Haritası**: Şehir üretim bonusları
- **Black Zone Hideout Planlayıcısı**: Kaynak bazlı optimize edilmiş yerleşim
- **İnteraktif Arama**: Eşya ve harita bazlı filtreleme
- **Geri Dönüş Tablosu**: Hideout kalite bonusları

### ⚔️ PvP & İstatistik
- **Detaylı Oyuncu Profili**: Kill/Death ratio, fame dağılımı
- **Ekipman Görüntüleme**: Son görülen set ve yetenekler
- **Savaş Geçmişi**: Killboard entegrasyonu
- **Gerçek Zamanlı Veri**: Albion API'sinden canlı çekim

### 🛤️ Avalon Roads
- **Harita Sağlayıcıları**: Albion Roads, Albion Maps, Avalon Tracker
- **Iframe Entegrasyonu**: Sekme değiştirmeden erişim
- **Çoklu Platform Desteği**: En popüler harita araçları

### 🌿 Toplayıcılık
- **Biyom Rehberi**: 5 ana biyom ve kaynak dağılımları
- **Gelişmiş Harita Bulucu**: Kaynak, tier ve bölge filtreleme
- **Node Tahmin Sistemi**: AO2D benzeri detaylı kaynak analizi
- **Radar Görseli**: İnteraktif harita istihbaratı

### 📦 Loot Logger
- **Entegre Loot Takibi**: Dış araç entegrasyonu
- **Anlık Görüntüleme**: Iframe ile doğrudan erişim

### 💰 Karaborsa & Fırsatlar
- **Kâr Fırsatları**: Royal şehirler → Black Market arbitrajı
- **Şehir Kıyaslama**: 6 şehir fiyat karşılaştırma tablosu
- **Black Market Talepleri**: En yüksek alım emirleri
- **Sarf & Ekonomi**: Yiyecek, iksir ve token arbitrajı
- **Akıllı Vergi Hesaplama**: Emir kur ve anında satış modları

### 🤖 AI Rehber
- **Kişisel Build Oluşturucu**: PvE & PvP çift set önerisi
- **Grup Kompozisyonu**: 9 farklı content türü için meta
- **Canlı Silah Veritabanı**: Albion API'den gerçek zamanlı arama
- **Görsel Dışa Aktarma**: html2canvas ile build görseli kaydetme
- **Cache Sistemi**: Aynı build'i tekrar tekrar oluşturmama

## 🎨 Tema Sistemi

8 farklı hazır tema + AI ile özel renk üretimi:

1. **Obsidian Gold** (Varsayılan) - Siyah & Altın
2. **Void Purple** - Mor tonları
3. **Blood Moon** - Kırmızı tonları
4. **Arctic Cyan** - Mavi tonları
5. **Forest Keeper** - Yeşil tonları
6. **Amber Fire** - Turuncu tonları
7. **Silver Knight** - Gri tonları
8. **Neon Nexus** - Neon mor

## 🌍 Çoklu Dil Desteği

- 🇹🇷 Türkçe (Varsayılan)
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇫🇷 Français
- 🇪🇸 Español
- 🇧🇷 Português
- 🇷🇺 Русский
- 🇵🇱 Polski
- 🇨🇳 Çince (Basitleştirilmiş)

## 🛠️ Teknoloji Yığını

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS (CDN), Özel CSS Variables
- **Grafikler**: Chart.js
- **AI Entegrasyonu**: MiniApps AI API
- **Görsel Export**: html2canvas
- **İkonlar**: Font Awesome 6
- **Veri Kaynakları**: 
  - Albion Online Data API (Piyasa verileri)
  - Albion Online Gameinfo API (Oyuncu istatistikleri)
  - CORS Proxy'ler (Codetabs, corsproxy.io)

## 📦 Kurulum

### Gereksinimler
- Modern bir web tarayıcısı (Chrome, Firefox, Edge, Safari)
- İnternet bağlantısı (API çağrıları için)

### Çalıştırma

1. **Repository'yi Klonlayın**
```bash
git clone https://github.com/KULLANICI_ADINIZ/AoTPNASF.git
cd AoTPNASF
```

2. **Tarayıcıda Açın**
```bash
# Basit HTTP Server (Python)
python -m http.server 8000

# veya Node.js ile
npx http-server -p 8000
```

3. **Tarayıcıdan Erişin**
```
http://localhost:8000
```

### Veya Direkt Kullanım
`index.html` dosyasını doğrudan tarayıcınızda açabilirsiniz.

## 📁 Proje Yapısı

```
AoTPNASF/
├── index.html              # Ana HTML dosyası
├── styles.css              # Özel CSS ve tema tanımları
├── js/
│   ├── main.js            # Ana uygulama mantığı, ayarlar, tema
│   ├── events.js          # Etkinlik takvimi modülü
│   ├── crafting.js        # Crafting ve üretim planlayıcı
│   ├── pvp.js             # PvP istatistik ve killboard
│   ├── avalon.js          # Avalon Roads harita platformları
│   ├── gathering.js       # Toplayıcılık rehberi ve harita bulucu
│   ├── loot.js            # Loot Logger entegrasyonu
│   ├── arbitrage.js       # Piyasa arbitrajı ve kıyaslama
│   └── ai-build.js        # AI destekli build öneri sistemi
└── locates/
    └── tr.json            # Türkçe localization dosyası
```

## 🔌 API Entegrasyonları

### Albion Online Data API
- **Piyasa Fiyatları**: `/api/v2/stats/prices/`
- **Altın Fiyatları**: `/api/v2/stats/gold`
- **Sunucular**: Europe, Americas, Asia

### Albion Gameinfo API
- **Oyuncu Arama**: `/api/gameinfo/search`
- **Oyuncu Detay**: `/api/gameinfo/players/{id}`
- **Killboard**: `/api/gameinfo/players/{id}/kills` ve `/deaths`

### CORS Proxy'ler
API çağrıları için otomatik fallback sistemi:
1. Direkt erişim
2. `api.codetabs.com`
3. `corsproxy.io`

## ⚙️ Yapılandırma

### Ayarlar Modal
- **Dil**: Platform locale desteğine göre otomatik filtreleme
- **Sunucu**: Europe / Americas / Asia seçimi
- **Metin Boyutu**: 12px - 16px arası
- **Özel Renkler**: AI destekli veya manuel renk seçimi

### Veri Saklama
- `miniappsAI.storage` ile persistent storage
- Build önbellekleme (tekrar hesaplamayı önler)
- Kullanıcı tercihleri kaydedilir

## 🎯 Kullanım Senaryoları

### 1. Arbitrajcı
```
Karaborsa sekmesi → Kâr Fırsatları → T6 .0 → Tara
→ Bridgewatch'tan ucuza al → Black Market'te pahalıya sat
```

### 2. Toplayıcı
```
Toplayıcılık sekmesi → Harita Bulucu
→ Kaynak: Maden, Tier: T8, Bölge: Black Zone
→ Everwinter Peak detaylarını incele
```

### 3. PvP Oyuncu
```
Ana Sayfa → Arama çubuğuna oyuncu adı yaz
→ PvP istatistiklerini gör
→ Son kullanılan set ve yetenekleri analiz et
```

### 4. Build Oluşturucu
```
AI Rehber sekmesi → Kişisel Set
→ Crystal Sword seç → Çift Set Oluştur
→ PvE ve PvP build'lerini görsel olarak kaydet
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## ⚠️ Sorumluluk Reddi

Bu uygulama Albion Online'ın resmi bir parçası değildir. Sandbox Interactive GmbH ile bir bağlantısı yoktur. Tüm oyun verileri ve görselleri ilgili sahiplerine aittir.

## 🙏 Teşekkürler

- **Albion Online Community**: Harika oyuncu topluluğu
- **Albion Online Data Project**: Piyasa verileri API'si
- **MiniApps AI**: Yapay zeka altyapısı
- **Chart.js**: Grafik kütüphanesi
- **Tailwind CSS**: Utility-first CSS framework

## 📞 İletişim

- **GitHub Issues**: Hata bildirimleri ve özellik talepleri
- **Discord**: Topluluk sohbeti (yakında)

---

**AoT-PNASF** - Albion Online deneyiminizi bir üst seviyeye taşıyın! 🎮✨
