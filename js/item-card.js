/* Shared item art resolver: one canonical URL, one failure cache and a local fallback. */
(function () {
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const clean = (value) => String(value || '').trim().toUpperCase();
  const failedIds = new Set();
  const failedUrls = new Set();
  const syntheticIds = new Set(['MIST_CHEST', 'MOB_MIST_GRIFFIN_FEATHER', 'AVALONIAN_SHARD', 'AVALONIAN_BAG', 'ARTEFACT_ARMOR_LEATHER', 'CORRUPTED_CHEST', 'FACTION_CHEST', 'DEMONIC_CHEST', 'BAG']);
  const resourceBases = {
    'FIBER (LIF)': 'FIBER', 'WOOD (ODUN)': 'WOOD', 'HIDE (DERI)': 'HIDE', 'ORE (MADEN)': 'ORE', 'ROCK (TAS)': 'STONEBLOCK',
    FIBER: 'FIBER', WOOD: 'WOOD', HIDE: 'HIDE', ORE: 'ORE', ROCK: 'STONEBLOCK'
  };
  const aliases = [
    ['kılıç', 'MAIN_SWORD'], ['sword', 'MAIN_SWORD'], ['yay', 'MAIN_BOW'], ['bow', 'MAIN_BOW'], ['mızrak', 'MAIN_SPEAR'], ['spear', 'MAIN_SPEAR'],
    ['hançer', 'MAIN_DAGGER'], ['dagger', 'MAIN_DAGGER'], ['balta', '2H_AXE'], ['axe', '2H_AXE'], ['asa', '2H_QUARTERSTAFF'], ['quarterstaff', '2H_QUARTERSTAFF'], ['asa', '2H_STAFF'],
    ['kutsal asa', 'MAIN_HOLYSTAFF'], ['holy staff', 'MAIN_HOLYSTAFF'], ['çekiç', '2H_HAMMER'], ['hammer', '2H_HAMMER'], ['arbalet', 'MAIN_CROSSBOW'],
    ['crossbow', 'MAIN_CROSSBOW'], ['gürz', 'MAIN_MACE'], ['mace', 'MAIN_MACE'], ['ateş asası', 'MAIN_FIRESTAFF'], ['fire staff', 'MAIN_FIRESTAFF'], ['frost staff', 'MAIN_FROSTSTAFF'],
    ['doğa asası', 'MAIN_NATURESTAFF'], ['nature staff', 'MAIN_NATURESTAFF'], ['lanetli asa', 'MAIN_CURSEDSTAFF'], ['cursed staff', 'MAIN_CURSEDSTAFF'],
    ['pelerin', 'CAPE'], ['cape', 'CAPE'], ['çanta', 'BAG'], ['bag', 'BAG'], ['iksir', 'POTION_HEAL'], ['potion', 'POTION_HEAL'], ['güveç', 'MEAL_STEW'],
    ['stew', 'MEAL_STEW'], ['deri zırh', 'ARMOR_LEATHER_SET1'], ['mercenary jacket', 'ARMOR_LEATHER_SET1'], ['kumaş zırh', 'ARMOR_CLOTH_SET1'],
    ['scholar robe', 'ARMOR_CLOTH_SET1'], ['plaka zırh', 'ARMOR_PLATE_SET1'], ['soldier armor', 'ARMOR_PLATE_SET1']
  ];
  const renderAliases = {
    LOGS: 'WOOD', MAIN_CROSSBOW: 'MAIN_BOW', '2H_WAILINGBOW': 'MAIN_BOW', '2H_BEARPAWS': '2H_AXE', '2H_GREATAXE': '2H_AXE',
    '2H_INFERNAL_SCYTHE': '2H_AXE', '2H_HERON_SPEAR': 'MAIN_SPEAR', '2H_ICEGAUNTLETS': '2H_FROSTSTAFF', '2H_GALATINE_PAIR': '2H_CLAYMORE',
    '2H_ENIGMATICCROSSBOW': '2H_CROSSBOW', '2H_BOLTCASTERS': '2H_CROSSBOW', '2H_HOLY_AVALON': 'MAIN_HOLYSTAFF', '2H_CURSED_AVALON': 'MAIN_CURSEDSTAFF',
    '2H_NATURE_AVALON': 'MAIN_NATURESTAFF', '2H_IRONCLADSTAFF': '2H_QUARTERSTAFF', '2H_DRUIDICSTAFF': 'MAIN_NATURESTAFF', 'MAIN_FROSTSTAFF': '2H_FROSTSTAFF',
    '2H_DEMONFIRESTAFF': 'MAIN_FIRESTAFF', '2H_DEMONFANG': 'MAIN_SPEAR', '2H_FORGEHAMMER': '2H_HAMMER', '2H_GREATHAMMER': '2H_HAMMER',
    '2H_REALMBREAKER': '2H_AXE', OFF_TOME: 'OFF_BOOK', OFF_HORN: 'OFF_BOOK', OFF_DEMONSKULL: 'OFF_BOOK', MEAL_FISHSTEW: 'MEAL_STEW',
    MEAL_SOUP: 'MEAL_STEW', POTION_CLEANSE: 'POTION_HEAL', POTION_GIGANTIFY: 'POTION_HEAL', POTION_RESISTANCE: 'POTION_HEAL', MOUNT_SWIFTCLAW: 'MOUNT_HORSE'
  };
  function parse(id) { const match = String(id || '').toUpperCase().match(/^T(\d+)_([^@]+)(?:@(\d+))?$/); return match ? { baseId: match[2], tier: Number(match[1]), enchant: Number(match[3] || 0) } : null; }
  function baseId(id) { const parsed = parse(id); return parsed?.baseId || clean(id).replace(/^T\d+_/, '').replace(/@\d+$/, ''); }
  function isSynthetic(id) { const base = baseId(id); return syntheticIds.has(base) || /(?:CHEST|ARTEFACT|AVALONIAN|MOB_|_TOKEN|_SHARD|GIANT_HEART|DEMONIC)/.test(base); }
  function renderId(id) {
    const value = clean(id);
    if (window.MarketItemCatalog?.renderId) return window.MarketItemCatalog.renderId(value);
    const parsed = parse(value); const base = parsed?.baseId || value; const mapped = renderAliases[base] || base;
    const fallback = Boolean(renderAliases[base]) || /^MEAL_(PIE|OMELETTE)$/.test(mapped) && parsed?.tier >= 5;
    const tier = /^MEAL_(PIE|OMELETTE)$/.test(mapped) && parsed?.tier >= 5 ? 4 : parsed?.tier || 4;
    return `T${tier}_${mapped}${parsed?.enchant && !fallback ? `@${parsed.enchant}` : ''}`;
  }
  function placeholder(label) {
    const safe = esc(label || 'Eşya');
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="12" fill="#151922"/><path d="M28 68 48 26l20 42H28Z" fill="none" stroke="#8b93a7" stroke-width="5"/><text x="48" y="84" text-anchor="middle" fill="#c8a64b" font-size="9" font-family="Arial">${safe.slice(0, 16)}</text></svg>`)}`;
  }
  function image(id) {
    const value = clean(id);
    if (!value || value === 'NULL' || isSynthetic(value) || failedIds.has(value) || failedIds.has(renderId(value))) return placeholder(value || 'Eşya');
    return `https://render.albiononline.com/v1/item/${encodeURIComponent(renderId(value))}.png?quality=1`;
  }
  function name(id, fallback) {
    const value = clean(id); const parsed = window.MarketItemCatalog?.parseId?.(value) || parse(value); const base = parsed && window.MarketItemCatalog?.find?.(parsed.baseId);
    if (base) return window.MarketItemCatalog.label(base);
    return fallback || value.replace(/^T\d+_/, '').replace(/@\d+$/, '').replace(/_/g, ' ').toLocaleLowerCase('tr-TR').replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase('tr-TR'));
  }
  function resourceId(type, tier = 6) { const key = String(type || '').toLocaleUpperCase('tr-TR').replace(/İ/g, 'I'); return `T${Math.max(2, Number(tier) || 6)}_${resourceBases[key] || 'FIBER'}`; }
  function guessId(value, tier = 6) {
    const text = String(value || '').toLocaleLowerCase('tr-TR').replace(/\([^)]*\)/g, '').trim(); const match = aliases.find(([alias]) => text.includes(alias));
    if (match) return `T${Number(tier) || 6}_${match[1]}`;
    return resourceBases[text.toLocaleUpperCase('tr-TR')] ? resourceId(text, tier) : `T${Number(tier) || 6}_BAG`;
  }
  function idFromImage(img) { const raw = img?.dataset?.itemId || img?.src?.match(/\/item\/([^.?]+)/)?.[1]; return raw ? decodeURIComponent(raw).toUpperCase() : ''; }
  function handleError(img) {
    if (!img) return;
    const id = idFromImage(img); const url = img.currentSrc || img.src;
    if (id) { failedIds.add(id); failedIds.add(renderId(id)); }
    if (url) failedUrls.add(url);
    if (img.dataset.fallbackTried) return;
    img.dataset.fallbackTried = '1'; img.src = placeholder(img.alt || id || 'Eşya');
  }
  function imgAttrs(id) { return `data-item-id="${esc(id)}" data-image-fallback="item"`; }
  function inline(id, labelOverride) { const value = clean(id); const label = labelOverride || name(value); return `<span class="item-inline"><img class="item-inline-image" ${imgAttrs(value)} src="${esc(image(value))}" alt="${esc(label)}" loading="lazy"><span>${esc(label)}</span></span>`; }
  function card(id, options = {}) { const value = clean(id); const label = options.label || name(value); const meta = options.meta ? `<span class="item-card-meta">${options.meta}</span>` : ''; return `<div class="item-card ${options.compact ? 'is-compact' : ''}"><img class="item-card-image" ${imgAttrs(value)} src="${esc(image(value))}" alt="${esc(label)}" loading="lazy"><div class="item-card-copy"><strong>${esc(label)}</strong>${meta}<code>${esc(value)}</code></div></div>`; }
  window.ItemCard = { image, name, parse, resourceId, guessId, inline, card, escape: esc, placeholder, handleError, renderId, failedIds };
  window.addEventListener('error', (event) => { const img = event.target; if (img instanceof HTMLImageElement && (img.src.includes('render.albiononline.com') || img.dataset.imageFallback)) window.ItemCard.handleError(img); }, true);
})();
