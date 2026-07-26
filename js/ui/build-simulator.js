/* Build Simulator - Interactive skill testing tool */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  
  const weapons = {
    swords: ['T4_MAIN_SWORD', 'T5_MAIN_SWORD', 'T6_MAIN_SWORD', 'T7_MAIN_SWORD', 'T8_MAIN_SWORD'],
    axes: ['T4_2H_AXE', 'T5_2H_AXE', 'T6_2H_AXE', 'T7_2H_AXE', 'T8_2H_AXE'],
    daggers: ['T4_MAIN_DAGGER', 'T5_MAIN_DAGGER', 'T6_MAIN_DAGGER', 'T7_MAIN_DAGGER', 'T8_MAIN_DAGGER'],
    spears: ['T4_MAIN_SPEAR', 'T5_MAIN_SPEAR', 'T6_MAIN_SPEAR', 'T7_MAIN_SPEAR', 'T8_MAIN_SPEAR'],
    maces: ['T4_MAIN_MACE', 'T5_MAIN_MACE', 'T6_MAIN_MACE', 'T7_MAIN_MACE', 'T8_MAIN_MACE'],
    bows: ['T4_2H_BOW', 'T5_2H_BOW', 'T6_2H_BOW', 'T7_2H_BOW', 'T8_2H_BOW'],
    crossbows: ['T4_2H_CROSSBOW', 'T5_2H_CROSSBOW', 'T6_2H_CROSSBOW', 'T7_2H_CROSSBOW', 'T8_2H_CROSSBOW'],
    curses: ['T4_MAIN_CURSEDSTAFF', 'T5_MAIN_CURSEDSTAFF', 'T6_MAIN_CURSEDSTAFF', 'T7_MAIN_CURSEDSTAFF', 'T8_MAIN_CURSEDSTAFF'],
    frost: ['T4_MAIN_FROSTSTAFF', 'T5_MAIN_FROSTSTAFF', 'T6_MAIN_FROSTSTAFF', 'T7_MAIN_FROSTSTAFF', 'T8_MAIN_FROSTSTAFF'],
    fire: ['T4_MAIN_FIRESTAFF', 'T5_MAIN_FIRESTAFF', 'T6_MAIN_FIRESTAFF', 'T7_MAIN_FIRESTAFF', 'T8_MAIN_FIRESTAFF'],
    arcane: ['T4_MAIN_ARCANESTAFF', 'T5_MAIN_ARCANESTAFF', 'T6_MAIN_ARCANESTAFF', 'T7_MAIN_ARCANESTAFF', 'T8_MAIN_ARCANESTAFF'],
    holy: ['T4_MAIN_HOLYSTAFF', 'T5_MAIN_HOLYSTAFF', 'T6_MAIN_HOLYSTAFF', 'T7_MAIN_HOLYSTAFF', 'T8_MAIN_HOLYSTAFF'],
    nature: ['T4_MAIN_NATURESTAFF', 'T5_MAIN_NATURESTAFF', 'T6_MAIN_NATURESTAFF', 'T7_MAIN_NATURESTAFF', 'T8_MAIN_NATURESTAFF']
  };

  const armor = {
    helmet: [
      'T4_HEAD_PLATE_SET1', 'T5_HEAD_PLATE_SET1', 'T6_HEAD_PLATE_SET1', 'T7_HEAD_PLATE_SET1', 'T8_HEAD_PLATE_SET1',
      'T4_HEAD_LEATHER_SET1', 'T5_HEAD_LEATHER_SET1', 'T6_HEAD_LEATHER_SET1', 'T7_HEAD_LEATHER_SET1', 'T8_HEAD_LEATHER_SET1',
      'T4_HEAD_CLOTH_SET1', 'T5_HEAD_CLOTH_SET1', 'T6_HEAD_CLOTH_SET1', 'T7_HEAD_CLOTH_SET1', 'T8_HEAD_CLOTH_SET1'
    ],
    chest: [
      'T4_ARMOR_PLATE_SET1', 'T5_ARMOR_PLATE_SET1', 'T6_ARMOR_PLATE_SET1', 'T7_ARMOR_PLATE_SET1', 'T8_ARMOR_PLATE_SET1',
      'T4_ARMOR_LEATHER_SET1', 'T5_ARMOR_LEATHER_SET1', 'T6_ARMOR_LEATHER_SET1', 'T7_ARMOR_LEATHER_SET1', 'T8_ARMOR_LEATHER_SET1',
      'T4_ARMOR_CLOTH_SET1', 'T5_ARMOR_CLOTH_SET1', 'T6_ARMOR_CLOTH_SET1', 'T7_ARMOR_CLOTH_SET1', 'T8_ARMOR_CLOTH_SET1'
    ],
    boots: [
      'T4_SHOES_PLATE_SET1', 'T5_SHOES_PLATE_SET1', 'T6_SHOES_PLATE_SET1', 'T7_SHOES_PLATE_SET1', 'T8_SHOES_PLATE_SET1',
      'T4_SHOES_LEATHER_SET1', 'T5_SHOES_LEATHER_SET1', 'T6_SHOES_LEATHER_SET1', 'T7_SHOES_LEATHER_SET1', 'T8_SHOES_LEATHER_SET1',
      'T4_SHOES_CLOTH_SET1', 'T5_SHOES_CLOTH_SET1', 'T6_SHOES_CLOTH_SET1', 'T7_SHOES_CLOTH_SET1', 'T8_SHOES_CLOTH_SET1'
    ],
    cape: ['T6_CAPE', 'T7_CAPE', 'T8_CAPE'],
    offhand: [
      'T4_OFF_SHIELD', 'T5_OFF_SHIELD', 'T6_OFF_SHIELD', 'T7_OFF_SHIELD', 'T8_OFF_SHIELD',
      'T4_OFF_TORCH', 'T5_OFF_TORCH', 'T6_OFF_TORCH', 'T7_OFF_TORCH', 'T8_OFF_TORCH',
      'T4_OFF_ORB', 'T5_OFF_ORB', 'T6_OFF_ORB', 'T7_OFF_ORB', 'T8_OFF_ORB'
    ]
  };

  const food = [
    'T4_MEAL_PIE', 'T5_MEAL_PIE', 'T6_MEAL_PIE', 'T7_MEAL_PIE', 'T8_MEAL_PIE',
    'T4_MEAL_STEW', 'T5_MEAL_STEW', 'T6_MEAL_STEW', 'T7_MEAL_STEW', 'T8_MEAL_STEW',
    'T4_MEAL_OMELETTE', 'T5_MEAL_OMELETTE', 'T6_MEAL_OMELETTE', 'T7_MEAL_OMELETTE', 'T8_MEAL_OMELETTE'
  ];

  const potions = [
    'T4_POTION_HEAL', 'T5_POTION_HEAL', 'T6_POTION_HEAL', 'T7_POTION_HEAL', 'T8_POTION_HEAL',
    'T4_POTION_RECOVERY', 'T5_POTION_RECOVERY', 'T6_POTION_RECOVERY', 'T7_POTION_RECOVERY', 'T8_POTION_RECOVERY',
    'T4_POTION_STONESKIN', 'T5_POTION_STONESKIN', 'T6_POTION_STONESKIN', 'T7_POTION_STONESKIN', 'T8_POTION_STONESKIN'
  ];

  const mount = [
    'T6_MOUNT_HORSE', 'T7_MOUNT_HORSE', 'T8_MOUNT_HORSE',
    'T6_MOUNT_OX', 'T7_MOUNT_OX', 'T8_MOUNT_OX',
    'T6_MOUNT_DIREBOAR', 'T7_MOUNT_DIREBOAR', 'T8_MOUNT_DIREBOAR'
  ];

  let selectedItems = {
    weapon: 'T6_MAIN_SWORD',
    helmet: 'T6_HEAD_PLATE_SET1',
    chest: 'T6_ARMOR_PLATE_SET1',
    boots: 'T6_SHOES_PLATE_SET1',
    cape: 'T6_CAPE',
    offhand: null,
    food: 'T6_MEAL_PIE',
    potion: 'T6_POTION_HEAL',
    mount: 'T6_MOUNT_HORSE'
  };

  let skills = {
    q1: { id: 'slash', name: 'Slash', cooldown: 1.5, damage: 150 },
    w1: { id: 'whirlwind', name: 'Whirlwind', cooldown: 8, damage: 300 },
    e: { id: 'heroic_strike', name: 'Heroic Strike', cooldown: 15, damage: 600 },
    p1: { id: 'defensive_stance', name: 'Defensive Stance', cooldown: 20, damage: 0 }
  };

  const stats = {
    health: 2000,
    damage: 100,
    armor: 100,
    resistance: 100,
    healPower: 100,
    ccResistance: 0,
    movementSpeed: 1.0,
    attackSpeed: 1.0,
    cooldownReduction: 0,
    lifesteal: 0,
    critChance: 0.05,
    critDamage: 1.5
  };

  function calculateStats() {
    const baseStats = { ...stats };
    
    // Weapon effect
    if (selectedItems.weapon.includes('SWORD')) {
      baseStats.damage += 20;
      baseStats.attackSpeed += 0.1;
    } else if (selectedItems.weapon.includes('AXE')) {
      baseStats.damage += 30;
      baseStats.lifesteal += 0.02;
    } else if (selectedItems.weapon.includes('BOW')) {
      baseStats.damage += 25;
      baseStats.critChance += 0.1;
    }
    
    // Armor effects
    if (selectedItems.helmet.includes('PLATE')) {
      baseStats.armor += 30;
      baseStats.health += 200;
    } else if (selectedItems.helmet.includes('LEATHER')) {
      baseStats.armor += 15;
      baseStats.resistance += 15;
    } else if (selectedItems.helmet.includes('CLOTH')) {
      baseStats.resistance += 30;
      baseStats.healPower += 20;
    }
    
    if (selectedItems.chest.includes('PLATE')) {
      baseStats.armor += 50;
      baseStats.health += 300;
    } else if (selectedItems.chest.includes('LEATHER')) {
      baseStats.armor += 25;
      baseStats.resistance += 25;
    } else if (selectedItems.chest.includes('CLOTH')) {
      baseStats.resistance += 50;
      baseStats.healPower += 30;
    }
    
    if (selectedItems.boots.includes('PLATE')) {
      baseStats.armor += 20;
      baseStats.movementSpeed -= 0.05;
    } else if (selectedItems.boots.includes('LEATHER')) {
      baseStats.armor += 10;
      baseStats.movementSpeed += 0.1;
    } else if (selectedItems.boots.includes('CLOTH')) {
      baseStats.resistance += 20;
      baseStats.cooldownReduction += 0.05;
    }
    
    // Cape effect
    if (selectedItems.cape) {
      baseStats.resistance += 15;
      baseStats.armor += 15;
    }
    
    // Food effect
    if (selectedItems.food.includes('PIE')) {
      baseStats.health += 300;
      baseStats.armor += 10;
    } else if (selectedItems.food.includes('STEW')) {
      baseStats.damage += 15;
      baseStats.resistance += 15;
    } else if (selectedItems.food.includes('OMELETTE')) {
      baseStats.movementSpeed += 0.05;
      baseStats.cooldownReduction += 0.03;
    }
    
    // Potion effect
    if (selectedItems.potion.includes('HEAL')) {
      baseStats.healPower += 30;
    } else if (selectedItems.potion.includes('RECOVERY')) {
      baseStats.cooldownReduction += 0.08;
    } else if (selectedItems.potion.includes('STONESKIN')) {
      baseStats.armor += 40;
      baseStats.resistance += 40;
    }
    
    return baseStats;
  }

  function calculateDPS() {
    const baseDamage = 100;
    const attackSpeed = 1.0;
    const dps = baseDamage * attackSpeed;
    
    // Critical hits
    const critMultiplier = stats.critChance * stats.critDamage;
    const effectiveDPS = dps * (1 + critMultiplier);
    
    // Skill rotation
    let skillDPS = 0;
    Object.values(skills).forEach(skill => {
      if (skill.damage > 0 && skill.cooldown > 0) {
        skillDPS += skill.damage / skill.cooldown;
      }
    });
    
    return Math.round(effectiveDPS + skillDPS);
  }

  function render() {
    const container = document.getElementById('buildLabApp');
    if (!container) return;
    
    const currentStats = calculateStats();
    const dps = calculateDPS();
    
    container.innerHTML = `
      <div class="build-simulator">
        <div class="build-sim-header">
          <h2>Build Lab - Combat Simulator</h2>
          <div class="header-actions">
            <button id="saveBuild" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Kaydet</button>
            <button id="loadBuild" class="px-4 py-2 bg-gray-700 text-white rounded-lg font-bold text-sm">Yükle</button>
            <button id="testCombat" class="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">Test Başlat</button>
          </div>
        </div>
        
        <div class="build-sim-container">
          <!-- Gear Selection -->
          <div class="gear-panel">
            <h3 class="text-lg font-bold text-white mb-4">Ekipman Seçimi</h3>
            
            <div class="gear-slot">
              <div class="gear-slot-label">Ana Silah</div>
              <div class="gear-item-grid">
                ${weapons.swords.slice(0, 5).map(id => `
                  <div class="gear-item ${selectedItems.weapon === id ? 'selected' : ''}" data-type="weapon" data-id="${id}">
                    <i class="gear-item-icon fa-solid fa-sword"></i>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="gear-slot">
              <div class="gear-slot-label">Kask</div>
              <div class="gear-item-grid">
                ${armor.helmet.slice(0, 5).map(id => `
                  <div class="gear-item ${selectedItems.helmet === id ? 'selected' : ''}" data-type="helmet" data-id="${id}">
                    <i class="gear-item-icon fa-solid fa-helmet-safety"></i>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="gear-slot">
              <div class="gear-slot-label">Zırh</div>
              <div class="gear-item-grid">
                ${armor.chest.slice(0, 5).map(id => `
                  <div class="gear-item ${selectedItems.chest === id ? 'selected' : ''}" data-type="chest" data-id="${id}">
                    <i class="gear-item-icon fa-solid fa-vest"></i>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="gear-slot">
              <div class="gear-slot-label">Botlar</div>
              <div class="gear-item-grid">
                ${armor.boots.slice(0, 5).map(id => `
                  <div class="gear-item ${selectedItems.boots === id ? 'selected' : ''}" data-type="boots" data-id="${id}">
                    <i class="gear-item-icon fa-solid fa-boot"></i>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Skill Rotation -->
          <div class="canvas-area">
            <div class="p-4">
              <h3 class="text-lg font-bold text-white mb-4">Skill Rotation</h3>
              <div class="skill-rotation">
                ${Object.entries(skills).map(([key, skill]) => `
                  <div class="skill-slot" data-skill="${key}">
                    <i class="skill-icon fa-solid fa-bolt"></i>
                    <div class="absolute bottom-0 text-xs text-white bg-black/70 px-1 rounded">${key.toUpperCase()}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <canvas id="combatCanvas" width="800" height="400"></canvas>
            
            <div class="canvas-controls">
              <button id="startSimulation" class="bg-green-600 hover:bg-green-700">Başlat</button>
              <button id="pauseSimulation" class="bg-yellow-600 hover:bg-yellow-700">Durdur</button>
              <button id="resetSimulation" class="bg-red-600 hover:bg-red-700">Sıfırla</button>
            </div>
          </div>
          
          <!-- Stats Panel -->
          <div class="stats-panel">
            <h3 class="text-lg font-bold text-white mb-4">Karakter İstatistikleri</h3>
            
            <div class="stats-section">
              <h3>Ana İstatistikler</h3>
              <div class="stat-row">
                <span class="stat-label">HP</span>
                <span class="stat-value">${currentStats.health}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Damage</span>
                <span class="stat-value">${currentStats.damage}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">DPS</span>
                <span class="stat-value">${dps}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Armor</span>
                <span class="stat-value">${currentStats.armor}</span>
                <span class="stat-change">+${currentStats.armor - stats.armor}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Resistance</span>
                <span class="stat-value">${currentStats.resistance}</span>
                <span class="stat-change">+${currentStats.resistance - stats.resistance}</span>
              </div>
            </div>
            
            <div class="stats-section">
              <h3>İkincil İstatistikler</h3>
              <div class="stat-row">
                <span class="stat-label">Movement Speed</span>
                <span class="stat-value">${currentStats.movementSpeed.toFixed(2)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Attack Speed</span>
                <span class="stat-value">${currentStats.attackSpeed.toFixed(2)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">CD Reduction</span>
                <span class="stat-value">${(currentStats.cooldownReduction * 100).toFixed(1)}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Crit Chance</span>
                <span class="stat-value">${(currentStats.critChance * 100).toFixed(1)}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Lifesteal</span>
                <span class="stat-value">${(currentStats.lifesteal * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div class="dps-chart-container mt-4">
              <h3 class="text-lg font-bold text-white mb-2">DPS Chart</h3>
              <div class="dps-chart">
                <canvas id="dpsChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Event listeners
    container.querySelectorAll('.gear-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        const id = item.dataset.id;
        selectedItems[type] = id;
        render();
      });
    });
    
    container.querySelector('#startSimulation').addEventListener('click', startSimulation);
    container.querySelector('#pauseSimulation').addEventListener('click', pauseSimulation);
    container.querySelector('#resetSimulation').addEventListener('click', resetSimulation);
    container.querySelector('#saveBuild').addEventListener('click', saveBuild);
    container.querySelector('#loadBuild').addEventListener('click', loadBuild);
    container.querySelector('#testCombat').addEventListener('click', testCombat);
  }

  function startSimulation() {
    // TODO: Implement combat simulation
    console.log('Simulation started');
  }

  function pauseSimulation() {
    console.log('Simulation paused');
  }

  function resetSimulation() {
    console.log('Simulation reset');
  }

  function saveBuild() {
    localStorage.setItem('buildSimulator_build', JSON.stringify(selectedItems));
    alert('Build kaydedildi!');
  }

  function loadBuild() {
    const saved = localStorage.getItem('buildSimulator_build');
    if (saved) {
      selectedItems = JSON.parse(saved);
      render();
      alert('Build yüklendi!');
    } else {
      alert('Kayıtlı build bulunamadı!');
    }
  }

  function testCombat() {
    // TODO: Implement combat test
    alert('Combat test başlatıldı!');
  }

  function mount() {
    const container = document.getElementById('buildLabApp');
    if (container) {
      render();
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.BuildSimulator = { mount, render };
})();