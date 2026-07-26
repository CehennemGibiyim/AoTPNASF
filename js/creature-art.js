/* Albion Online Real Mob & Boss Visual Resolver.
   Loads real game images from official MediaWiki CDN with graceful multi-tier fallback & valid item badges. */
(function () {
  const RESOLVED = new Map();

  // Gerçek Albion Online Mob ve Boss Görsel Veritabanı (Wiki / CDN)
  const REAL_CREATURE_IMAGES = {
    'mists-griffin': ['https://albiononline.fandom.com/wiki/Special:FilePath/Griffin.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Griffin.png'],
    'mists-griffin-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Griffin.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Griffin.png'],
    'mists-mist-stalker': ['https://albiononline.fandom.com/wiki/Special:FilePath/Mist_Stalker.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Mist_Stalker.png'],
    'mists-rare-beast': ['https://albiononline.fandom.com/wiki/Special:FilePath/Mist_Stalker.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Mist_Stalker.png'],
    'mists-wisp': ['https://albiononline.fandom.com/wiki/Special:FilePath/Mist_Wisp.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Wisp.png'],
    'mists-lich': ['https://albiononline.fandom.com/wiki/Special:FilePath/Mist_Lich.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Mist_Lich.png'],
    
    'royal-heretic-miner': ['https://albiononline.fandom.com/wiki/Special:FilePath/Heretic_Miner.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Heretic_Miner.png'],
    'royal-heretic-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Heretic_Miner.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Heretic_Miner.png'],
    'royal-undead-reaper': ['https://albiononline.fandom.com/wiki/Special:FilePath/Undead_Reaper.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Undead_Reaper.png'],
    'royal-undead-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Undead_Reaper.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Undead_Reaper.png'],
    
    'roads-avalonian-construct': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Construct.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Construct.png'],
    'avalonian-construct-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Construct.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Construct.png'],
    'roads-avalonian-earthmother': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Earthmother.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Earthmother.png'],
    'avalonian-earthmother-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Earthmother.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Earthmother.png'],
    'roads-ancient-guardian': ['https://albiononline.fandom.com/wiki/Special:FilePath/Ancient_Guardian.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Ancient_Guardian.png'],
    'roads-avalonian-soldier': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Soldier.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Soldier.png'],
    'avalonian-soldier-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Avalonian_Soldier.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Avalonian_Soldier.png'],
    
    'static-keeper-elder': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Elder.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Elder.png'],
    'static-keeper-elder-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Elder.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Elder.png'],
    'static-keeper-warrior': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Warrior.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Warrior.png'],
    'keeper-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Warrior.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Warrior.png'],
    'static-keeper-guardian': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Guardian.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Guardian.png'],
    'keeper-elder-guardian': ['https://albiononline.fandom.com/wiki/Special:FilePath/Keeper_Guardian.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Keeper_Guardian.png'],
    
    'morgana-demon': ['https://albiononline.fandom.com/wiki/Special:FilePath/Morgana_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Morgana_Demon.png'],
    'morgana-demon-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Morgana_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Morgana_Demon.png'],
    'morgana-warlock': ['https://albiononline.fandom.com/wiki/Special:FilePath/Morgana_Warlock.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Morgana_Warlock.png'],
    'morgana-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Morgana_Warlock.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Morgana_Warlock.png'],
    
    'corrupted-hunter': ['https://albiononline.fandom.com/wiki/Special:FilePath/Corrupted_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Corrupted_Demon.png'],
    'corrupted-demon': ['https://albiononline.fandom.com/wiki/Special:FilePath/Corrupted_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Corrupted_Demon.png'],
    'corrupted-demon-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Corrupted_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Corrupted_Demon.png'],
    'corrupted-stalker': ['https://albiononline.fandom.com/wiki/Special:FilePath/Corrupted_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Corrupted_Demon.png'],
    
    'hellgate-demon': ['https://albiononline.fandom.com/wiki/Special:FilePath/Hellgate_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Hellgate_Demon.png'],
    'hellgate-demon-family': ['https://albiononline.fandom.com/wiki/Special:FilePath/Hellgate_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Hellgate_Demon.png'],
    'hellgate-guardian': ['https://albiononline.fandom.com/wiki/Special:FilePath/Hellgate_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Hellgate_Demon.png'],
    'hellgate-guardian-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Hellgate_Demon.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Hellgate_Demon.png'],
    
    'world-boss-behemoth': ['https://albiononline.fandom.com/wiki/Special:FilePath/Behemoth.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Behemoth.png'],
    'world-behemoth-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Behemoth.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Behemoth.png'],
    'faction-general': ['https://albiononline.fandom.com/wiki/Special:FilePath/Faction_General.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Faction_General.png'],
    'faction-general-ops': ['https://albiononline.fandom.com/wiki/Special:FilePath/Faction_General.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Faction_General.png'],
    'faction-war-chief': ['https://albiononline.fandom.com/wiki/Special:FilePath/Faction_General.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Faction_General.png'],
    'open-world-giant': ['https://albiononline.fandom.com/wiki/Special:FilePath/Giant.png', 'https://wiki.albiononline.com/wiki/Special:FilePath/Giant.png']
  };

  // Faction / Creature -> Gerçek Albion Item Render ID (Ganimet/Temsili Rozet)
  const ITEM_REPRESENTATION = {
    'mists-griffin': 'T6_OFF_TOTEM_KEEPER',
    'mists-griffin-ops': 'T6_OFF_TOTEM_KEEPER',
    'mists-mist-stalker': 'T5_MAIN_CURSEDSTAFF',
    'mists-rare-beast': 'T6_HIDE',
    'mists-wisp': 'QUESTITEM_TOKEN_ROYAL',
    'mists-lich': 'T7_MAIN_FROSTSTAFF',
    'royal-heretic-miner': 'T4_ORE',
    'royal-heretic-family': 'T4_SKILLBOOK',
    'royal-undead-reaper': 'T5_SOUL',
    'royal-undead-family': 'T5_RUNE',
    'roads-avalonian-construct': 'T7_SHARD_AVALONIAN',
    'avalonian-construct-ops': 'T8_SHARD_AVALONIAN',
    'roads-avalonian-earthmother': 'T8_ARTEFACT_ARMOR_PLATE_HELL',
    'avalonian-earthmother-ops': 'T8_ARTEFACT_ARMOR_PLATE_HELL',
    'roads-ancient-guardian': 'T6_SHARD_AVALONIAN',
    'roads-avalonian-soldier': 'T7_BAG',
    'static-keeper-elder': 'T8_ARTEFACT_ARMOR_CLOTH_KEEPER',
    'static-keeper-elder-ops': 'T8_ARTEFACT_ARMOR_CLOTH_KEEPER',
    'static-keeper-warrior': 'T6_RUNE',
    'keeper-family': 'T6_BAG',
    'keeper-elder-guardian': 'T7_ARTEFACT_ARMOR_PLATE_HELL',
    'morgana-demon': 'T6_ARTEFACT_ARMOR_PLATE_MORGANA',
    'morgana-demon-ops': 'T7_ARTEFACT_ARMOR_PLATE_MORGANA',
    'morgana-warlock': 'T6_ARTEFACT_ARMOR_CLOTH_MORGANA',
    'morgana-family': 'T6_ARTEFACT_ARMOR_CLOTH_MORGANA',
    'corrupted-hunter': 'T6_ARTEFACT_ARMOR_LEATHER_UNDEAD',
    'corrupted-demon': 'T7_2H_AXE',
    'corrupted-stalker': 'T7_ARTEFACT_ARMOR_LEATHER_UNDEAD',
    'hellgate-demon': 'T7_2H_AXE',
    'hellgate-guardian': 'T6_OFF_DEMONIC',
    'hellgate-guardian-ops': 'T6_OFF_DEMONIC',
    'world-boss-behemoth': 'T8_ARTEFACT_MAIN_SPEAR_KEEPER',
    'world-behemoth-ops': 'T8_ARTEFACT_MAIN_SPEAR_KEEPER',
    'faction-general': 'T6_OFF_SHIELD',
    'faction-general-ops': 'T6_OFF_SHIELD',
    'faction-war-chief': 'T7_OFF_SHIELD',
    'world-tree-event': 'T8_FIBER',
    'world-tree-event-ops': 'T8_FIBER',
    'open-world-giant': 'T7_OFF_TOTEM_KEEPER'
  };

  // Faction renk temaları
  const FACTION_THEMES = {
    Mists: { bg1: '#1e1035', bg2: '#0b0518', border: '#a78bfa', text: '#c084fc', icon: '🦅' },
    Roads: { bg1: '#0f2b3c', bg2: '#05111a', border: '#38bdf8', text: '#7dd3fc', icon: '🤖' },
    Royal: { bg1: '#2a1a08', bg2: '#0d0702', border: '#f59e0b', text: '#fbbf24', icon: '⛏️' },
    Keeper: { bg1: '#261b0a', bg2: '#0d0802', border: '#eab308', text: '#fde047', icon: '🪓' },
    Morgana: { bg1: '#280c2f', bg2: '#0e0212', border: '#a855f7', text: '#c084fc', icon: '🔥' },
    Corrupted: { bg1: '#2f0c1a', bg2: '#120208', border: '#fb7185', text: '#fda4af', icon: '👁️' },
    Hellgate: { bg1: '#310808', bg2: '#120202', border: '#ef4444', text: '#fca5a5', icon: '😈' },
    Default: { bg1: '#121624', bg2: '#080a12', border: '#d4af37', text: '#f3e8ff', icon: '💀' }
  };

  function getFactionTheme(id) {
    if (id.includes('mists')) return FACTION_THEMES.Mists;
    if (id.includes('avalon') || id.includes('roads')) return FACTION_THEMES.Roads;
    if (id.includes('heretic') || id.includes('royal') || id.includes('undead')) return FACTION_THEMES.Royal;
    if (id.includes('keeper')) return FACTION_THEMES.Keeper;
    if (id.includes('morgana')) return FACTION_THEMES.Morgana;
    if (id.includes('corrupted')) return FACTION_THEMES.Corrupted;
    if (id.includes('hellgate') || id.includes('demon')) return FACTION_THEMES.Hellgate;
    return FACTION_THEMES.Default;
  }

  // Yüksek kaliteli SVG Yaratık / Boss Portresi (Son aşama fallback)
  function generateCreatureAvatarSvg(creatureId, displayName) {
    const theme = getFactionTheme(creatureId);
    const safeName = String(displayName || creatureId).toUpperCase();
    const isBoss = creatureId.includes('boss') || creatureId.includes('elder') || creatureId.includes('earthmother') || creatureId.includes('behemoth');
    const badgeText = isBoss ? 'BOSS' : 'ELITE';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad_${creatureId.replace(/[^a-zA-Z0-9]/g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bg1}"/>
          <stop offset="100%" stop-color="${theme.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="16" fill="url(#bgGrad_${creatureId.replace(/[^a-zA-Z0-9]/g, '_')})" stroke="${theme.border}" stroke-width="3"/>
      <circle cx="100" cy="85" r="50" fill="none" stroke="${theme.border}" stroke-width="2" stroke-dasharray="4,4" opacity="0.5"/>
      <text x="100" y="102" text-anchor="middle" font-size="52">${theme.icon}</text>
      <rect x="20" y="150" width="160" height="32" rx="6" fill="#090a0f" stroke="${theme.border}" stroke-width="1.5"/>
      <text x="100" y="171" text-anchor="middle" fill="${theme.text}" font-size="11" font-weight="bold" font-family="system-ui, sans-serif">${safeName.substring(0, 18)}</text>
      <rect x="135" y="12" width="50" height="20" rx="4" fill="${isBoss ? '#d4af37' : theme.border}"/>
      <text x="160" y="26" text-anchor="middle" fill="#000000" font-size="9" font-weight="900" font-family="system-ui, sans-serif">${badgeText}</text>
    </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Albion Render Service - Item URL (100% Geçerli Eşya Render'ı)
  function albionItemUrl(itemId) {
    if (!itemId) return null;
    return `https://render.albiononline.com/v1/item/${encodeURIComponent(itemId)}.png?quality=1`;
  }

  // Görsel elementi oluştur
  function createImageElement(creatureId, displayName, className = 'creature-art', alt = '') {
    const container = document.createElement('div');
    container.className = `${className} relative flex items-center justify-center overflow-hidden rounded-xl border border-albion-700 bg-black/80 shadow-md group`;
    
    const imageCandidates = REAL_CREATURE_IMAGES[creatureId] || [];
    const svgFallback = generateCreatureAvatarSvg(creatureId, displayName);

    const mainImg = document.createElement('img');
    mainImg.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';
    mainImg.loading = 'lazy';
    mainImg.alt = alt || displayName || 'Albion Creature';

    let attemptIndex = 0;
    const loadNext = () => {
      if (attemptIndex < imageCandidates.length) {
        const candidateUrl = imageCandidates[attemptIndex];
        attemptIndex++;
        mainImg.src = candidateUrl;
      } else {
        // Hepsi başarısız olursa SVG avatar çizimi yükle
        mainImg.src = svgFallback;
        mainImg.onerror = null; // Sonsuz döngüyü kır
      }
    };

    mainImg.onerror = loadNext;
    loadNext(); // İlk görseli dene
    container.appendChild(mainImg);

    // Temsili Albion Eşyası Köşe Rozeti
    const repItemId = ITEM_REPRESENTATION[creatureId];
    if (repItemId) {
      const itemBadge = document.createElement('img');
      itemBadge.className = 'absolute bottom-1 right-1 w-8 h-8 rounded bg-black/80 border border-albion-accent p-0.5 shadow-md pointer-events-none transition-transform group-hover:scale-110';
      itemBadge.src = albionItemUrl(repItemId);
      itemBadge.title = `Ganimet: ${repItemId}`;
      itemBadge.loading = 'lazy';
      itemBadge.onerror = () => { itemBadge.style.display = 'none'; };
      container.appendChild(itemBadge);
    }

    return container;
  }

  function bestiaryArt(creatureId, displayName) {
    return createImageElement(creatureId, displayName, 'bestiary-creature-art w-full h-48', displayName);
  }

  function operationsArt(creatureId, displayName) {
    return createImageElement(creatureId, displayName, 'ops-creature-art w-full h-40', displayName);
  }

  function heroArt(creatureId, displayName) {
    return createImageElement(creatureId, displayName, 'ops-encounter-hero w-full h-56', displayName);
  }

  // Window API
  window.CreatureArt = {
    bestiaryArt,
    operationsArt,
    heroArt,
    albionItemUrl,
    generateCreatureAvatarSvg,
    ITEM_REPRESENTATION,
    REAL_CREATURE_IMAGES
  };

  console.log('✅ CreatureArt v3 loaded - Real Albion Mob/Boss Images & Multi-tier Fallbacks Active.');
})();
