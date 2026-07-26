/* Shared Albion catalog: craftable weapons, artifact lines, armour, offhands, tools, food, potions and refinables. */
(function () {
  const categoryKeys = {
    weapons: 'item-categoryWeapons',
    armor: 'item-categoryArmor',
    accessories: 'item-categoryAccessories',
    consumables: 'item-categoryConsumables',
    resources: 'item-categoryResources',
    tools: 'item-categoryTools',
    mounts: 'item-categoryMounts'
  };
  const make = (category, entries) => entries.map(([id, name]) => ({
    id, name, category, categoryKey: categoryKeys[category] || categoryKeys.weapons
  }));

  const items = [
    ...make('weapons', [
      ['MAIN_SWORD', 'Kılıç'], ['2H_CLAYMORE', 'Claymore'], ['2H_DUALSWORD', 'Çift Kılıç'], ['2H_CARVING_SWORD', 'Oyma Kılıcı'], ['2H_GALATINE_PAIR', 'Galatine Çifti'],
      ['MAIN_AXE', 'Tek Elli Balta'], ['2H_AXE', 'Balta'], ['2H_BATTLEAXE', 'Savaş Baltası'], ['2H_HALBERD', 'Teber'], ['2H_GREATAXE', 'Büyük Balta'], ['2H_BEARPAWS', 'Ayı Pençeleri'], ['2H_REALMBREAKER', 'Diyar Yıkıcı'], ['2H_INFERNAL_SCYTHE', 'Cehennem Tırpanı'],
      ['MAIN_MACE', 'Gürz'], ['2H_MACE', 'Büyük Gürz'], ['2H_FLAIL', 'Topuz'], ['2H_INCUBUS_MACE', 'İnkübüs Gürzü'], ['2H_MORGANAMACE', 'Morgana Gürzü'], ['2H_OATHKEEPERS', 'Yemin Muhafızları'],
      ['2H_HAMMER', 'Çekiç'], ['2H_POLEHAMMER', 'Sırıklı Çekiç'], ['2H_GREATHAMMER', 'Büyük Çekiç'], ['2H_FORGEHAMMER', 'Dövmehane Çekici'], ['2H_GROVEKEEPER', 'Koruluk Muhafızı'],
      ['MAIN_SPEAR', 'Mızrak'], ['2H_SPEAR', 'Büyük Mızrak'], ['2H_GLAIVE', 'Glaive'], ['2H_HARPOON', 'Zıpkın'], ['2H_TRINITY_SPEAR', 'Üçlü Mızrak'], ['2H_HERON_SPEAR', 'Balıkçıl Mızrağı'], ['2H_SPIRITHUNTER', 'Ruh Avcısı'], ['2H_DEMONFANG', 'İblis Dişi'],
      ['MAIN_BOW', 'Yay'], ['2H_BOW_LONGBOW', 'Uzun Yay'], ['2H_WARBOW', 'Savaş Yayı'], ['2H_WAILINGBOW', 'Ağıt Yayı'], ['2H_BOW_HELL', 'Cehennem Yayı'], ['2H_WILDFIREBOW', 'Yaban Ateşi Yayı'], ['2H_BOW_AVALON', 'Avalon Yayı'],
      ['MAIN_CROSSBOW', 'Arbalet'], ['2H_CROSSBOW', 'Büyük Arbalet'], ['2H_REPEATINGCROSSBOW', 'Tekrarlayan Arbalet'], ['2H_SIEGE_BOW', 'Kuşatma Yayı'], ['2H_BOLTCASTERS', 'Cıvata Atıcılar'], ['2H_ENIGMATICCROSSBOW', 'Gizemli Arbalet'],
      ['MAIN_DAGGER', 'Hançer'], ['2H_DAGGERPAIR', 'Çift Hançer'], ['2H_CLAWPAIR', 'Pençe Çifti'], ['2H_BLOODLETTER', 'Kan Harfi'], ['2H_DEATHGIVERS', 'Ölüm Getirenler'], ['2H_DAGGER_KATAR', 'Katar'],
      ['MAIN_FIRESTAFF', 'Ateş Asası'], ['2H_FIRESTAFF', 'Büyük Ateş Asası'], ['2H_INFERNOSTAFF', 'Cehennem Asası'], ['2H_BRIMSTONESTAFF', 'Kükürt Asası'], ['2H_WILDFIRESTAFF', 'Yaban Ateşi Asası'], ['2H_DEMONFIRESTAFF', 'İblis Ateş Asası'],
      ['MAIN_FROSTSTAFF', 'Buz Asası'], ['2H_FROSTSTAFF', 'Büyük Buz Asası'], ['2H_GLACIALSTAFF', 'Buzul Asası'], ['2H_PERMAFROSTPRISM', 'Sonsuz Don Prizması'], ['2H_ICEGAUNTLETS', 'Buz Eldivenleri'],
      ['MAIN_ARCANESTAFF', 'Gizem Asası'], ['2H_ARCANESTAFF', 'Büyük Gizem Asası'], ['2H_ENIGMATICSTAFF', 'Gizemli Asa'], ['2H_OCCULTSTAFF', 'Okült Asa'], ['2H_WARDENSTAFF', 'Muhafız Asası'],
      ['MAIN_HOLYSTAFF', 'Kutsal Asa'], ['2H_HOLYSTAFF', 'Büyük Kutsal Asa'], ['2H_DIVINESTAFF', 'İlahi Asa'], ['2H_HOLY_AVALON', 'Avalon Kutsal Asası'],
      ['MAIN_NATURESTAFF', 'Doğa Asası'], ['2H_NATURESTAFF', 'Büyük Doğa Asası'], ['2H_WILDSTAFF', 'Yaban Asası'], ['2H_BLIGHTSTAFF', 'Veba Asası'], ['2H_NATURE_AVALON', 'Avalon Doğa Asası'], ['2H_DRUIDICSTAFF', 'Druidik Asa'],
      ['MAIN_CURSEDSTAFF', 'Lanetli Asa'], ['2H_CURSEDSTAFF', 'Büyük Lanetli Asa'], ['2H_DARKSTAFF', 'Karanlık Asa'], ['2H_DEMONICSTAFF', 'İblis Asası'], ['2H_CURSED_AVALON', 'Avalon Lanetli Asası'],
      ['2H_QUARTERSTAFF', 'Çeyrek Asa'], ['2H_IRONCLADSTAFF', 'Demir Kaplı Asa'], ['2H_DOUBLEBLADEDSTAFF', 'Çift Bıçaklı Asa'], ['2H_BLACKMONKSTAFF', 'Kara Keşiş Asası'], ['2H_GRAILSEEKER', 'Kâse Arayıcı'], ['2H_SOULSCYTHE', 'Ruh Tırpanı'],
      ['OFF_TORCH', 'Meşale'], ['OFF_BOOK', 'Kitap'], ['OFF_TOME', 'Büyü Kitabı'], ['OFF_ORB', 'Küre'], ['OFF_HORN', 'Boynuz'], ['OFF_SHIELD', 'Kalkan'], ['OFF_KITE_SHIELD', 'Uçurtma Kalkanı'], ['OFF_TOWERSHIELD', 'Kule Kalkanı'], ['OFF_SARCOPHAGUS', 'Lahit'], ['OFF_FACEBREAKER', 'Yüz Kıran'], ['OFF_MISTCALLER', 'Sis Çağıran'], ['OFF_JUDICATOR', 'Yargıç'], ['OFF_DEMONSKULL', 'İblis Kafatası'], ['OFF_CENSER', 'Tütsülük'], ['OFF_TOTEM', 'Totem']
    ]),
    ...make('armor', [
      ['HEAD_CLOTH_SET1', 'Bilgin Kukuletası'], ['ARMOR_CLOTH_SET1', 'Bilgin Cübbesi'], ['SHOES_CLOTH_SET1', 'Bilgin Sandaleti'],
      ['HEAD_CLOTH_SET2', 'Ateş Büyücüsü Başlığı'], ['ARMOR_CLOTH_SET2', 'Ateş Büyücüsü Cübbesi'], ['SHOES_CLOTH_SET2', 'Ateş Büyücüsü Ayakkabısı'],
      ['HEAD_CLOTH_SET3', 'Rahip Başlığı'], ['ARMOR_CLOTH_SET3', 'Rahip Cübbesi'], ['SHOES_CLOTH_SET3', 'Rahip Sandaleti'],
      ['HEAD_CLOTH_SET4', 'Druid Başlığı'], ['ARMOR_CLOTH_SET4', 'Druid Cübbesi'], ['SHOES_CLOTH_SET4', 'Druid Ayakkabısı'],
      ['HEAD_CLOTH_SET5', 'Şeytan Başlığı'], ['ARMOR_CLOTH_SET5', 'Şeytan Cübbesi'], ['SHOES_CLOTH_SET5', 'Şeytan Ayakkabısı'],
      ['HEAD_CLOTH_SET6', 'Tarikatçı Başlığı'], ['ARMOR_CLOTH_SET6', 'Tarikatçı Cübbesi'], ['SHOES_CLOTH_SET6', 'Tarikatçı Ayakkabısı'],
      ['HEAD_LEATHER_SET1', 'Paralı Asker Kafalığı'], ['ARMOR_LEATHER_SET1', 'Paralı Asker Ceketi'], ['SHOES_LEATHER_SET1', 'Paralı Asker Ayakkabısı'],
      ['HEAD_LEATHER_SET2', 'Avcı Başlığı'], ['ARMOR_LEATHER_SET2', 'Avcı Ceketi'], ['SHOES_LEATHER_SET2', 'Avcı Ayakkabısı'],
      ['HEAD_LEATHER_SET3', 'Suikastçı Başlığı'], ['ARMOR_LEATHER_SET3', 'Suikastçı Ceketi'], ['SHOES_LEATHER_SET3', 'Suikastçı Ayakkabısı'],
      ['HEAD_LEATHER_SET4', 'Kraliyet Avcısı Başlığı'], ['ARMOR_LEATHER_SET4', 'Kraliyet Avcısı Ceketi'], ['SHOES_LEATHER_SET4', 'Kraliyet Avcısı Ayakkabısı'],
      ['HEAD_LEATHER_SET5', 'Cehennem Başlığı'], ['ARMOR_LEATHER_SET5', 'Cehennem Ceketi'], ['SHOES_LEATHER_SET5', 'Cehennem Ayakkabısı'],
      ['HEAD_LEATHER_SET6', 'Takipçi Başlığı'], ['ARMOR_LEATHER_SET6', 'Takipçi Ceketi'], ['SHOES_LEATHER_SET6', 'Takipçi Ayakkabısı'],
      ['HEAD_LEATHER_SET7', 'Hayalet Başlığı'], ['ARMOR_LEATHER_SET7', 'Hayalet Ceketi'], ['SHOES_LEATHER_SET7', 'Hayalet Ayakkabısı'],
      ['HEAD_PLATE_SET1', 'Asker Miğferi'], ['ARMOR_PLATE_SET1', 'Asker Zırhı'], ['SHOES_PLATE_SET1', 'Asker Çizmesi'],
      ['HEAD_PLATE_SET2', 'Şövalye Miğferi'], ['ARMOR_PLATE_SET2', 'Şövalye Zırhı'], ['SHOES_PLATE_SET2', 'Şövalye Çizmesi'],
      ['HEAD_PLATE_SET3', 'Muhafız Miğferi'], ['ARMOR_PLATE_SET3', 'Muhafız Zırhı'], ['SHOES_PLATE_SET3', 'Muhafız Çizmesi'],
      ['HEAD_PLATE_SET4', 'Mezar Muhafızı Miğferi'], ['ARMOR_PLATE_SET4', 'Mezar Muhafızı Zırhı'], ['SHOES_PLATE_SET4', 'Mezar Muhafızı Çizmesi'],
      ['HEAD_PLATE_SET5', 'Kraliyet Miğferi'], ['ARMOR_PLATE_SET5', 'Kraliyet Zırhı'], ['SHOES_PLATE_SET5', 'Kraliyet Çizmesi'],
      ['HEAD_PLATE_SET6', 'Yargıç Miğferi'], ['ARMOR_PLATE_SET6', 'Yargıç Zırhı'], ['SHOES_PLATE_SET6', 'Yargıç Çizmesi'],
      ['HEAD_PLATE_SET7', 'İblis Miğferi'], ['ARMOR_PLATE_SET7', 'İblis Zırhı'], ['SHOES_PLATE_SET7', 'İblis Çizmesi']
    ]),
    ...make('accessories', [
      ['BAG', 'Çanta'], ['CAPE', 'Pelerin'], ['CAPEITEM_FW_CAERLEON', 'Caerleon Pelerini'], ['CAPEITEM_FW_LYMHURST', 'Lymhurst Pelerini'], ['CAPEITEM_FW_MARTLOCK', 'Martlock Pelerini'], ['CAPEITEM_FW_BRIDGEWATCH', 'Bridgewatch Pelerini'], ['CAPEITEM_FW_FORTSTERLING', 'Fort Sterling Pelerini'], ['CAPEITEM_FW_THETFORD', 'Thetford Pelerini'], ['CAPEITEM_FW_BRECILIEN', 'Brecilien Pelerini']
    ]),
    ...make('tools', [
      ['2H_TOOL_AXE', 'Balta Aleti'], ['2H_TOOL_HAMMER', 'Çekiç Aleti'], ['2H_TOOL_KNIFE', 'Bıçak Aleti'], ['2H_TOOL_PICK', 'Kazma Aleti'], ['2H_TOOL_SICKLE', 'Orak Aleti'], ['2H_TOOL_FIBER', 'Lif Toplama Aleti'], ['2H_TOOL_FISHINGROD', 'Olta']
    ]),
    ...make('consumables', [
      ['MEAL_SOUP', 'Çorba'], ['MEAL_STEW', 'Yahni'], ['MEAL_OMELETTE', 'Omlet'], ['MEAL_PIE', 'Turta'], ['MEAL_SANDWICH', 'Sandviç'], ['MEAL_ROAST', 'Kızartma'], ['MEAL_SALAD', 'Salata'], ['MEAL_FISHSTEW', 'Balık Yahni'],
      ['POTION_HEAL', 'Sağlık İksiri'], ['POTION_ENERGY', 'Enerji İksiri'], ['POTION_POISON', 'Zehir İksiri'], ['POTION_RESISTANCE', 'Direnç İksiri'], ['POTION_GIGANTIFY', 'Devleştirme İksiri'], ['POTION_RECOVERY', 'İyileşme İksiri'], ['POTION_CLEANSE', 'Arındırma İksiri'], ['POTION_STONESKIN', 'Taş Deri İksiri']
    ]),
    ...make('resources', [
      ['WOOD', 'Ağaç'], ['PLANKS', 'Kalas'], ['HIDE', 'Ham Deri'], ['LEATHER', 'İşlenmiş Deri'], ['ORE', 'Cevher'], ['METALBAR', 'Metal Külçe'], ['FIBER', 'Lif'], ['CLOTH', 'Kumaş'], ['STONEBLOCK', 'Taş Blok']
    ]),
    ...make('mounts', [
      ['MOUNT_HORSE', 'At'], ['MOUNT_OX', 'Öküz'], ['MOUNT_DIREWOLF', 'Vahşi Kurt'], ['MOUNT_SWIFTCLAW', 'Çevik Pençe'], ['MOUNT_ARMORED_HORSE', 'Zırhlı At'], ['MOUNT_MAMMOTH', 'Mamut']
    ])
  ];

  const featured = ['MAIN_SWORD', 'MAIN_BOW', 'ARMOR_LEATHER_SET1', 'CAPE', 'MEAL_STEW', 'POTION_HEAL', 'HIDE', 'WOOD', 'METALBAR'];
  const tr = (key, fallback) => {
    const value = window.miniappI18n?.t?.(key) || window.__translations?.[key];
    return value && value !== key ? value : fallback;
  };
  const label = (item) => {
    if (typeof item === 'string') item = items.find((entry) => entry.id === item) || { id: item };
    return item.name || tr(item.nameKey, item.id.replace(/_/g, ' '));
  };
  const category = (item) => tr(item.categoryKey, 'Eşyalar');
  const buildId = (baseId, tier = 6, enchant = 0) => `T${Number(tier)}_${baseId}${Number(enchant) ? `@${Number(enchant)}` : ''}`;
  const parseId = (id) => {
    const match = String(id || '').toUpperCase().match(/^T(\d+)_([^@]+)(?:@(\d+))?$/);
    if (!match) return null;
    return { baseId: match[2], tier: Number(match[1]), enchant: Number(match[3] || 0) };
  };
  const find = (baseId) => items.find((item) => item.id === String(baseId || '').toUpperCase());
  /*
   * The market/render service uses a smaller, stricter set of art IDs than the
   * market API. Keep the craft/API ID untouched, but resolve known legacy or
   * renamed IDs to a stable family icon before creating an <img> request.
   * This prevents the picker from firing dozens of guaranteed 404 requests.
   */
  const renderAliases = {
    LOGS: 'WOOD',
    MAIN_CROSSBOW: 'MAIN_BOW',
    '2H_WAILINGBOW': 'MAIN_BOW',
    '2H_BEARPAWS': '2H_AXE',
    '2H_GREATAXE': '2H_AXE',
    '2H_INFERNAL_SCYTHE': '2H_AXE',
    '2H_HERON_SPEAR': 'MAIN_SPEAR',
    '2H_ICEGAUNTLETS': '2H_FROSTSTAFF',
    '2H_GALATINE_PAIR': '2H_CLAYMORE',
    '2H_ENIGMATICCROSSBOW': '2H_CROSSBOW',
    '2H_BOLTCASTERS': '2H_CROSSBOW',
    '2H_HOLY_AVALON': 'MAIN_HOLYSTAFF',
    '2H_CURSED_AVALON': 'MAIN_CURSEDSTAFF',
    '2H_NATURE_AVALON': 'MAIN_NATURESTAFF',
    '2H_IRONCLADSTAFF': '2H_QUARTERSTAFF',
    '2H_DRUIDICSTAFF': 'MAIN_NATURESTAFF',
    '2H_DEMONFIRESTAFF': 'MAIN_FIRESTAFF',
    '2H_DEMONFANG': 'MAIN_SPEAR',
    '2H_FORGEHAMMER': '2H_HAMMER',
    '2H_GREATHAMMER': '2H_HAMMER',
    '2H_REALMBREAKER': '2H_AXE',
    'OFF_TOME': 'OFF_BOOK',
    'OFF_HORN': 'OFF_BOOK',
    'OFF_DEMONSKULL': 'OFF_BOOK',
    'MEAL_FISHSTEW': 'MEAL_STEW',
    'MEAL_SOUP': 'MEAL_STEW',
    'POTION_CLEANSE': 'POTION_HEAL',
    'POTION_GIGANTIFY': 'POTION_HEAL',
    'POTION_RESISTANCE': 'POTION_HEAL',
    'MOUNT_SWIFTCLAW': 'MOUNT_HORSE'
  };
  const renderId = (id) => {
    const value = String(id || '').toUpperCase();
    const parsed = parseId(value);
    const base = parsed?.baseId || value.replace(/^T\d+_/, '').replace(/@\d+$/, '');
    let renderBase = renderAliases[base] || base;
    let isFallbackArt = Boolean(renderAliases[base]);
    /* Artifact armour render art is grouped under the first stable set. */
    if (/^(HEAD|ARMOR|SHOES)_(CLOTH|LEATHER|PLATE)_SET[4-7]$/.test(renderBase)) {
      renderBase = renderBase.replace(/SET[4-7]$/, 'SET1');
      isFallbackArt = true;
    }
    /* T5–T8 pie/omelette art is intermittently absent from the renderer. */
    if (/^MEAL_(PIE|OMELETTE)$/.test(renderBase) && parsed?.tier >= 5) isFallbackArt = true;
    const renderTier = /^MEAL_(PIE|OMELETTE)$/.test(renderBase) && parsed?.tier >= 5 ? 4 : (parsed?.tier || 4);
    const enchantSuffix = parsed?.enchant && !isFallbackArt ? `@${parsed.enchant}` : '';
    return `T${renderTier}_${renderBase}${enchantSuffix}`;
  };
  const iconUrl = (id) => window.ItemCard?.image?.(id) || window.ItemCard?.placeholder?.(id) || '';
  window.MarketItemCatalog = { items, featured, label, category, buildId, parseId, find, renderId, iconUrl };
})();
