/* Low-cost field intelligence data: guide snapshots plus user-observed signals. */
(function () {
  const biomeMap = [
    { region: 'Mists', biome: 'Mistland', color: '#a78bfa', density: 78, pressure: 'Yüksek', hotspots: ['Mists Griffin', 'Rare chest', 'Mist Wisp'], zones: ['Mists girişleri', 'Brecilien çevresi'], note: 'Nadir yaratık ve chest arayan oyuncu yoğunluğu değişkendir.' },
    { region: 'Roads of Avalon', biome: 'Avalonian', color: '#38bdf8', density: 62, pressure: 'Yüksek', hotspots: ['Avalonian Soldier', 'Earthmother'], zones: ['Portal ağı', 'T8 kaynak odaları'], note: 'Portal bağlantısı ve scout bilgisi olmadan taşıma riski yükselir.' },
    { region: 'Black Zone', biome: 'Highland / Forest', color: '#ef4444', density: 54, pressure: 'Yüksek', hotspots: ['World Behemoth', 'Resource Guardian'], zones: ['Etkinlik bölgeleri', 'Geri dönüş yolları'], note: 'Yüksek ödül ile ölüm maliyetini birlikte değerlendirin.' },
    { region: 'Royal Kıtası', biome: 'Swamp / Steppe / Mountain', color: '#22c55e', density: 36, pressure: 'Orta', hotspots: ['Heretic Madencisi', 'Undead Reaper'], zones: ['Şehir çevreleri', 'Kaynak rotaları'], note: 'Daha güvenli başlangıç rotaları; rekabet şehirden şehre değişir.' },
    { region: 'Corrupted Dungeon', biome: 'Instance', color: '#fb7185', density: 48, pressure: 'Orta-Yüksek', hotspots: ['Corrupted Demon', 'Hunter invade'], zones: ['Solo instance', 'Boss odaları'], note: 'Oyuncu karşılaşması yoğunluğu build ve server saatine bağlıdır.' }
  ];
  const deathZones = [
    { zone: 'Mists girişleri', region: 'Mists', risk: 82, deaths: 14, cause: 'Dönüşte taşıma / pusu' },
    { zone: 'Avalonian portal çıkışları', region: 'Roads of Avalon', risk: 76, deaths: 9, cause: 'Portal kampı' },
    { zone: 'Black Zone etkinlik çevresi', region: 'Black Zone', risk: 91, deaths: 21, cause: 'Loot sonrası takip' },
    { zone: 'Corrupted boss odaları', region: 'Corrupted Dungeon', risk: 58, deaths: 6, cause: 'Build karşılaşması' },
    { zone: 'Royal kaynak rotaları', region: 'Royal Kıtası', risk: 31, deaths: 3, cause: 'Düşük yoğunluklu gank' }
  ];
  const patchChanges = [
    { version: 'Guide 2026.07', area: 'Bestiary', title: 'Loot doğrulama katmanı', detail: 'Kullanıcı doğrulaması ile rehber tahmini ayrıştırıldı.', status: 'Yeni' },
    { version: 'Guide 2026.07', area: 'Market', title: 'Fiyat yenileme kuyruğu', detail: 'Tekrarlı fiyat istekleri önbellekten okunur; aynı item iki kez çekilmez.', status: 'Düzeltildi' },
    { version: 'Guide 2026.07', area: 'Operations', title: 'Saha sinyalleri', detail: 'Yoğunluk ve ölüm gözlemleri artık yerel olarak saklanabilir.', status: 'Yeni' },
    { version: 'Game data check', area: 'External', title: 'Oyun verisini doğrula', detail: 'Oyun içi patch notları ve canlı fiyat tarihi ile manuel karşılaştırma önerilir.', status: 'Kontrol gerekli' }
  ];
  const buildTemplates = [
    { id: 'holy-healer', name: 'Holy Healer', role: 'Healer', items: [{ name: 'Holy Staff', id: 'T6_MAIN_HOLYSTAFF', fallback: 260000 }, { name: 'Cleric Robe', id: 'T6_ARMOR_CLOTH_SET1', fallback: 120000 }, { name: 'Scholar Sandals', id: 'T6_SHOES_CLOTH_SET1', fallback: 70000 }] },
    { id: 'heavy-tank', name: 'Heavy Tank', role: 'Tank', items: [{ name: 'Incubus Mace', id: 'T6_MAIN_MACE', fallback: 220000 }, { name: 'Guardian Armor', id: 'T6_ARMOR_PLATE_SET1', fallback: 180000 }, { name: 'Soldier Boots', id: 'T6_SHOES_PLATE_SET1', fallback: 80000 }] },
    { id: 'bow-dps', name: 'Bow DPS', role: 'DPS', items: [{ name: 'Bow', id: 'T6_MAIN_BOW', fallback: 160000 }, { name: 'Mercenary Jacket', id: 'T6_ARMOR_LEATHER_SET1', fallback: 150000 }, { name: 'Hunter Shoes', id: 'T6_SHOES_LEATHER_SET1', fallback: 75000 }] }
  ];
  window.AlbionOperationsIntelligence = { biomeMap, deathZones, patchChanges, buildTemplates };
})();
