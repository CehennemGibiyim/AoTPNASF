/* AI Builds Weapon Database */
(function () {
  const exhaustiveWeaponDB = [
    // Swords
    {id: "T8_MAIN_SWORD", name: "Broadsword", subCat: "sword"},
    {id: "T8_2H_CLAYMORE", name: "Claymore", subCat: "sword"},
    {id: "T8_2H_DUALSWORD", name: "Dual Swords", subCat: "sword"},
    {id: "T8_MAIN_SCIMITAR_MORGANA", name: "Clarent Blade", subCat: "sword"},
    {id: "T8_2H_CLEAVER_HELL", name: "Carving Sword", subCat: "sword"},
    {id: "T8_2H_DUALSCIMITAR_UNDEAD", name: "Galatine Pair", subCat: "sword"},
    {id: "T8_2H_CLAYMORE_AVALON", name: "Kingmaker", subCat: "sword"},
    {id: "T8_MAIN_SWORD_CRYSTAL", name: "Crystal Sword", subCat: "sword"},
    {id: "T8_2H_SWORD_CRYSTAL", name: "Infinity Blade", subCat: "sword"},

    // Axes
    {id: "T8_MAIN_AXE", name: "Battleaxe", subCat: "axe"},
    {id: "T8_2H_AXE", name: "Greataxe", subCat: "axe"},
    {id: "T8_2H_HALBERD", name: "Halberd", subCat: "axe"},
    {id: "T8_2H_HALBERD_MORGANA", name: "Carrioncaller", subCat: "axe"},
    {id: "T8_2H_SCYTHE_HELL", name: "Infernal Scythe", subCat: "axe"},
    {id: "T8_2H_DUALAXE_KEEPER", name: "Bear Paws", subCat: "axe"},
    {id: "T8_2H_AXE_AVALON", name: "Realmbreaker", subCat: "axe"},
    {id: "T8_MAIN_AXE_CRYSTAL", name: "Crystal Battleaxe", subCat: "axe"},

    // Maces
    {id: "T8_MAIN_MACE", name: "Mace", subCat: "mace"},
    {id: "T8_2H_MACE", name: "Heavy Mace", subCat: "mace"},
    {id: "T8_2H_FLAIL", name: "Morning Star", subCat: "mace"},
    {id: "T8_MAIN_ROCKMACE_KEEPER", name: "Bedrock Mace", subCat: "mace"},
    {id: "T8_MAIN_MACE_HELL", name: "Incubus Mace", subCat: "mace"},
    {id: "T8_2H_MACE_MORGANA", name: "Camlann Mace", subCat: "mace"},
    {id: "T8_2H_DUALMACE_AVALON", name: "Oathkeepers", subCat: "mace"},

    // Hammers
    {id: "T8_MAIN_HAMMER", name: "Hammer", subCat: "hammer"},
    {id: "T8_2H_POLEHAMMER", name: "Polehammer", subCat: "hammer"},
    {id: "T8_2H_HAMMER", name: "Great Hammer", subCat: "hammer"},
    {id: "T8_2H_HAMMER_UNDEAD", name: "Tombhammer", subCat: "hammer"},
    {id: "T8_2H_DUALHAMMER_HELL", name: "Forge Hammers", subCat: "hammer"},
    {id: "T8_2H_RAM_KEEPER", name: "Grovekeeper", subCat: "hammer"},
    {id: "T8_2H_HAMMER_AVALON", name: "Hand of Justice", subCat: "hammer"},

    // Gloves (Knuckles)
    {id: "T8_2H_KNUCKLES_SET1", name: "Brawler Gloves", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_SET2", name: "Battle Bracers", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_SET3", name: "Spiked Gauntlets", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_KEEPER", name: "Ursine Maulers", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_HELL", name: "Hellfire Hands", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_MORGANA", name: "Ravenstrike Cestus", subCat: "knuckles"},
    {id: "T8_2H_KNUCKLES_AVALON", name: "Fists of Avalon", subCat: "knuckles"},

    // Daggers
    {id: "T8_MAIN_DAGGER", name: "Dagger", subCat: "dagger"},
    {id: "T8_2H_DAGGERPAIR", name: "Dagger Pair", subCat: "dagger"},
    {id: "T8_2H_CLAW", name: "Claws", subCat: "dagger"},
    {id: "T8_MAIN_DAGGER_HELL", name: "Bloodletter", subCat: "dagger"},
    {id: "T8_MAIN_DAGGER_MORGANA", name: "Demon Fang", subCat: "dagger"},
    {id: "T8_2H_DAGGERPAIR_UNDEAD", name: "Deathgivers", subCat: "dagger"},
    {id: "T8_2H_DAGGER_KATAR_AVALON", name: "Bridled Fury", subCat: "dagger"},

    // Spears
    {id: "T8_MAIN_SPEAR", name: "Spear", subCat: "spear"},
    {id: "T8_2H_SPEAR", name: "Pike", subCat: "spear"},
    {id: "T8_2H_GLAIVE", name: "Glaive", subCat: "spear"},
    {id: "T8_MAIN_SPEAR_KEEPER", name: "Heron Spear", subCat: "spear"},
    {id: "T8_2H_HARPOON_HELL", name: "Spirithunter", subCat: "spear"},
    {id: "T8_2H_TRIDENT_UNDEAD", name: "Trinity Spear", subCat: "spear"},
    {id: "T8_MAIN_SPEAR_AVALON", name: "Daybreaker", subCat: "spear"},
    {id: "T8_MAIN_SPEAR_CRYSTAL", name: "Crystal Spear", subCat: "spear"},

    // Bows
    {id: "T8_2H_BOW", name: "Bow", subCat: "bow"},
    {id: "T8_2H_WARBOW", name: "Warbow", subCat: "bow"},
    {id: "T8_2H_LONGBOW", name: "Longbow", subCat: "bow"},
    {id: "T8_2H_BOW_UNDEAD", name: "Whispering Bow", subCat: "bow"},
    {id: "T8_2H_BOW_HELL", name: "Wailing Bow", subCat: "bow"},
    {id: "T8_2H_BOW_KEEPER", name: "Mist Piercer", subCat: "bow"},
    {id: "T8_2H_BOW_AVALON", name: "Bow of Badon", subCat: "bow"},

    // Crossbows
    {id: "T8_2H_CROSSBOW", name: "Crossbow", subCat: "crossbow"},
    {id: "T8_MAIN_1HCROSSBOW", name: "Light Crossbow", subCat: "crossbow"},
    {id: "T8_2H_CROSSBOWLARGE", name: "Heavy Crossbow", subCat: "crossbow"},
    {id: "T8_2H_REPEATINGCROSSBOW_UNDEAD", name: "Weeping Repeater", subCat: "crossbow"},
    {id: "T8_2H_DUALCROSSBOW_HELL", name: "Boltcasters", subCat: "crossbow"},
    {id: "T8_2H_CROSSBOWLARGE_MORGANA", name: "Siegebow", subCat: "crossbow"},
    {id: "T8_2H_CROSSBOW_AVALON", name: "Energy Shaper", subCat: "crossbow"},

    // Quarterstaffs
    {id: "T8_2H_QUARTERSTAFF", name: "Quarterstaff", subCat: "quarterstaff"},
    {id: "T8_2H_IRONCLADEDSTAFF", name: "Iron-clad Staff", subCat: "quarterstaff"},
    {id: "T8_2H_DOUBLEBLADEDSTAFF", name: "Double Bladed Staff", subCat: "quarterstaff"},
    {id: "T8_2H_COMBATSTAFF_MORGANA", name: "Black Monk Stave", subCat: "quarterstaff"},
    {id: "T8_2H_TWINSCYTHE_HELL", name: "Soulscythe", subCat: "quarterstaff"},
    {id: "T8_2H_ROCKSTAFF_KEEPER", name: "Staff of Balance", subCat: "quarterstaff"},
    {id: "T8_2H_QUARTERSTAFF_AVALON", name: "Grailseeker", subCat: "quarterstaff"},

    // Fire Staffs
    {id: "T8_MAIN_FIRESTAFF", name: "Fire Staff", subCat: "firestaff"},
    {id: "T8_2H_FIRESTAFF", name: "Great Fire Staff", subCat: "firestaff"},
    {id: "T8_2H_INFERNOSTAFF", name: "Infernal Staff", subCat: "firestaff"},
    {id: "T8_MAIN_FIRESTAFF_KEEPER", name: "Wildfire Staff", subCat: "firestaff"},
    {id: "T8_2H_FIRESTAFF_HELL", name: "Brimstone Staff", subCat: "firestaff"},
    {id: "T8_2H_FIRESTAFF_MORGANA", name: "Blazing Staff", subCat: "firestaff"},
    {id: "T8_2H_FIRE_RINGPAIR_AVALON", name: "Dawnsong", subCat: "firestaff"},

    // Frost Staffs
    {id: "T8_MAIN_FROSTSTAFF", name: "Frost Staff", subCat: "froststaff"},
    {id: "T8_2H_FROSTSTAFF", name: "Great Frost Staff", subCat: "froststaff"},
    {id: "T8_2H_GLACIALSTAFF", name: "Glacial Staff", subCat: "froststaff"},
    {id: "T8_MAIN_FROSTSTAFF_KEEPER", name: "Hoarfrost Staff", subCat: "froststaff"},
    {id: "T8_2H_ICEGAUNTLETS_HELL", name: "Icicle Staff", subCat: "froststaff"},
    {id: "T8_2H_ICECRYSTAL_UNDEAD", name: "Permafrost Prism", subCat: "froststaff"},
    {id: "T8_MAIN_FROSTSTAFF_AVALON", name: "Chillhowl", subCat: "froststaff"},

    // Arcane Staffs
    {id: "T8_MAIN_ARCANESTAFF", name: "Arcane Staff", subCat: "arcanestaff"},
    {id: "T8_2H_ARCANESTAFF", name: "Great Arcane Staff", subCat: "arcanestaff"},
    {id: "T8_2H_ENIGMATICSTAFF", name: "Enigmatic Staff", subCat: "arcanestaff"},
    {id: "T8_MAIN_ARCANESTAFF_UNDEAD", name: "Witchwork Staff", subCat: "arcanestaff"},
    {id: "T8_2H_ARCANESTAFF_HELL", name: "Occult Staff", subCat: "arcanestaff"},
    {id: "T8_2H_ENIGMATICORB_MORGANA", name: "Malevolent Locus", subCat: "arcanestaff"},
    {id: "T8_MAIN_ARCANESTAFF_AVALON", name: "Evensong", subCat: "arcanestaff"},

    // Cursed Staffs
    {id: "T8_MAIN_CURSEDSTAFF", name: "Cursed Staff", subCat: "cursedstaff"},
    {id: "T8_2H_CURSEDSTAFF", name: "Great Cursed Staff", subCat: "cursedstaff"},
    {id: "T8_2H_DEMONICSTAFF", name: "Demonic Staff", subCat: "cursedstaff"},
    {id: "T8_MAIN_CURSEDSTAFF_UNDEAD", name: "Lifecurse Staff", subCat: "cursedstaff"},
    {id: "T8_2H_SKULLORB_HELL", name: "Cursed Skull", subCat: "cursedstaff"},
    {id: "T8_2H_CURSEDSTAFF_MORGANA", name: "Damnation Staff", subCat: "cursedstaff"},
    {id: "T8_MAIN_CURSEDSTAFF_AVALON", name: "Shadowcaller", subCat: "cursedstaff"},

    // Nature Staffs
    {id: "T8_MAIN_NATURESTAFF", name: "Nature Staff", subCat: "naturestaff"},
    {id: "T8_2H_NATURESTAFF", name: "Great Nature Staff", subCat: "naturestaff"},
    {id: "T8_2H_WILDSTAFF", name: "Wild Staff", subCat: "naturestaff"},
    {id: "T8_MAIN_NATURESTAFF_KEEPER", name: "Druidic Staff", subCat: "naturestaff"},
    {id: "T8_2H_NATURESTAFF_HELL", name: "Blight Staff", subCat: "naturestaff"},
    {id: "T8_2H_NATURESTAFF_UNDEAD", name: "Rampant Staff", subCat: "naturestaff"},
    {id: "T8_MAIN_NATURESTAFF_MORGANA", name: "Ironroot Staff", subCat: "naturestaff"},

    // Holy Staffs
    {id: "T8_MAIN_HOLYSTAFF", name: "Holy Staff", subCat: "holystaff"},
    {id: "T8_2H_HOLYSTAFF", name: "Great Holy Staff", subCat: "holystaff"},
    {id: "T8_2H_DIVINESTAFF", name: "Divine Staff", subCat: "holystaff"},
    {id: "T8_MAIN_HOLYSTAFF_MORGANA", name: "Lifetouch Staff", subCat: "holystaff"},
    {id: "T8_2H_HOLYSTAFF_HELL", name: "Fallen Staff", subCat: "holystaff"},
    {id: "T8_2H_HOLYSTAFF_UNDEAD", name: "Redemption Staff", subCat: "holystaff"},
    {id: "T8_MAIN_HOLYSTAFF_AVALON", name: "Hallowfall", subCat: "holystaff"},

    // Shapeshifter Staffs
    {id: "T8_2H_SHAPESHIFTER_PANTHER", name: "Prowling Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_WEREWOLF", name: "Bloodmoon Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_BEAR", name: "Primal Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_ENT", name: "Rootbound Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_GOLEM", name: "Earthrune Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_EAGLE", name: "Lightcaller Staff", subCat: "shapeshifterstaff"},
    {id: "T8_2H_SHAPESHIFTER_IMP", name: "Hellspawn Staff", subCat: "shapeshifterstaff"}
  ];

  // Category mapping
  const categoryMap = {
    sword: "Kılıçlar", axe: "Baltalar", mace: "Gürzler", hammer: "Çekiçler",
    dagger: "Hançerler", spear: "Mızraklar", knuckles: "Eldivenler",
    bow: "Yaylar", crossbow: "Arbaletler", quarterstaff: "Asalar",
    firestaff: "Ateş Asaları", froststaff: "Buz Asaları", arcanestaff: "Gizem Asaları",
    cursedstaff: "Lanetli Asalar", naturestaff: "Doğa Asaları", holystaff: "Kutsal Asalar",
    shapeshifterstaff: "Şekil Değiştirenler"
  };

  function getCategoryName(subCat) {
    return categoryMap[subCat] || (subCat.charAt(0).toUpperCase() + subCat.slice(1));
  }

  function getWeaponDB() {
    return exhaustiveWeaponDB;
  }

  function getWeaponById(id) {
    return exhaustiveWeaponDB.find(w => w.id === id);
  }

  function getWeaponsByCategory(subCat) {
    return exhaustiveWeaponDB.filter(w => w.subCat === subCat);
  }

  function categorizeWeapons(weapons) {
    const categorized = {};
    weapons.forEach(weapon => {
      if (!categorized[weapon.subCat]) {
        categorized[weapon.subCat] = [];
      }
      categorized[weapon.subCat].push(weapon);
    });
    return categorized;
  }

  // Export to global scope
  window.AIWeaponDB = {
    getWeaponDB,
    getWeaponById,
    getWeaponsByCategory,
    getCategoryName,
    categorizeWeapons
  };

  console.log('AI Weapon Database loaded');
})();