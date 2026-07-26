/* AI Assistant - Playstyle-based build recommendations */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  
  const playstyles = {
    aggressive: {
      name: 'Aggressive',
      icon: 'fire',
      color: '#EF4444',
      desc: 'High damage, frontline combat, burst damage focus',
      weapons: ['swords', 'axes', 'daggers', 'fire_staffs'],
      armor: 'plate',
      stats: ['damage', 'crit_chance', 'attack_speed']
    },
    defensive: {
      name: 'Defensive',
      icon: 'shield',
      color: '#3B82F6',
      desc: 'High survival, tanking, crowd control',
      weapons: ['maces', 'shields', 'nature_staffs'],
      armor: 'plate',
      stats: ['health', 'armor', 'resistance']
    },
    tactical: {
      name: 'Tactical',
      icon: 'chess',
      color: '#10B981',
      desc: 'Strategic positioning, support, utility focus',
      weapons: ['spears', 'crossbows', 'arcane_staffs'],
      armor: 'leather',
      stats: ['cooldown_reduction', 'movement_speed', 'utility']
    },
    supportive: {
      name: 'Supportive',
      icon: 'heart',
      color: '#EC4899',
      desc: 'Healing, buffs, team utility',
      weapons: ['holy_staffs', 'nature_staffs', 'support_items'],
      armor: 'cloth',
      stats: ['heal_power', 'cooldown_reduction', 'support']
    },
    mobile: {
      name: 'Mobile',
      icon: 'running',
      color: '#F59E0B',
      desc: 'High mobility, hit-and-run tactics',
      weapons: ['daggers', 'spears', 'bows'],
      armor: 'leather',
      stats: ['movement_speed', 'attack_speed', 'dodge']
    },
    versatile: {
      name: 'Versatile',
      icon: 'star',
      color: '#8B5CF6',
      desc: 'Balanced approach, adaptable to situations',
      weapons: ['swords', 'bows', 'frost_staffs'],
      armor: 'plate/leather',
      stats: ['balanced', 'utility', 'survivability']
    }
  };

  const contentTypes = {
    solo_pve: {
      name: 'Solo PvE',
      icon: 'user-ninja',
      desc: 'Open world farming, solo dungeons'
    },
    group_pve: {
      name: 'Group PvE',
      icon: 'users',
      desc: 'Group dungeons, Avalonian raids'
    },
    small_scale: {
      name: 'Small Scale PvP',
      icon: 'skull-crossbones',
      desc: '2v2, 5v5, open world skirmishes'
    },
    large_scale: {
      name: 'Large Scale PvP',
      icon: 'flag',
      desc: 'ZvZ, territory battles'
    },
    gathering: {
      name: 'Gathering',
      icon: 'leaf',
      desc: 'Resource collection, transport'
    },
    ganking: {
      name: 'Ganking',
      icon: 'mask',
      desc: 'Ambush tactics, surprise attacks'
    }
  };

  const weaponTypes = {
    swords: { name: 'Swords', icon: 'sword', playstyles: ['aggressive', 'versatile'] },
    axes: { name: 'Axes', icon: 'axe', playstyles: ['aggressive'] },
    daggers: { name: 'Daggers', icon: 'dagger', playstyles: ['aggressive', 'mobile'] },
    spears: { name: 'Spears', icon: 'spear', playstyles: ['tactical', 'mobile'] },
    maces: { name: 'Maces', icon: 'hammer', playstyles: ['defensive'] },
    bows: { name: 'Bows', icon: 'bow-arrow', playstyles: ['tactical', 'mobile'] },
    crossbows: { name: 'Crossbows', icon: 'crosshairs', playstyles: ['tactical'] },
    fire_staffs: { name: 'Fire Staffs', icon: 'fire', playstyles: ['aggressive'] },
    frost_staffs: { name: 'Frost Staffs', icon: 'snowflake', playstyles: ['tactical', 'versatile'] },
    arcane_staffs: { name: 'Arcane Staffs', icon: 'wand-magic', playstyles: ['tactical'] },
    holy_staffs: { name: 'Holy Staffs', icon: 'cross', playstyles: ['supportive'] },
    nature_staffs: { name: 'Nature Staffs', icon: 'leaf', playstyles: ['defensive', 'supportive'] },
    cursed_staffs: { name: 'Cursed Staffs', icon: 'skull', playstyles: ['aggressive', 'tactical'] }
  };

  let userPreferences = {
    playstyle: 'aggressive',
    contentType: 'solo_pve',
    budget: 'medium', // low, medium, high
    experience: 'intermediate', // beginner, intermediate, advanced
    focus: ['damage', 'survival'], // damage, survival, mobility, utility
    restrictions: [] // no healing, no expensive items, etc.
  };

  let recommendedBuilds = [];

  function generateRecommendations() {
    const playstyle = playstyles[userPreferences.playstyle];
    const contentType = contentTypes[userPreferences.contentType];
    
    // Filter weapons by playstyle
    const suitableWeapons = Object.entries(weaponTypes)
      .filter(([key, weapon]) => weapon.playstyles.includes(userPreferences.playstyle))
      .map(([key, weapon]) => weapon);
    
    // Generate builds based on preferences
    recommendedBuilds = [
      {
        id: 1,
        name: `${playstyle.name} ${contentType.name} Build`,
        weapon: suitableWeapons[0]?.name || 'Sword',
        armor: playstyle.armor === 'plate' ? 'Plate Armor' : 
               playstyle.armor === 'leather' ? 'Leather Armor' : 'Cloth Armor',
        description: `A ${playstyle.desc.toLowerCase()} build optimized for ${contentType.desc.toLowerCase()}.`,
        skills: {
          q1: 'Primary Damage',
          w1: 'Utility/Mobility',
          e: 'Ultimate Ability',
          p1: 'Defensive/Heal'
        },
        items: [
          `T6 ${suitableWeapons[0]?.name || 'Sword'}`,
          `T6 ${playstyle.armor === 'plate' ? 'Plate' : playstyle.armor === 'leather' ? 'Leather' : 'Cloth'} Helmet`,
          `T6 ${playstyle.armor === 'plate' ? 'Plate' : playstyle.armor === 'leather' ? 'Leather' : 'Cloth'} Armor`,
          `T6 ${playstyle.armor === 'plate' ? 'Plate' : playstyle.armor === 'leather' ? 'Leather' : 'Cloth'} Boots`,
          'T6 Cape',
          'Healing Potions',
          'Food Buff'
        ],
        stats: {
          damage: 85,
          survival: 70,
          mobility: 60,
          utility: 50
        },
        cost: userPreferences.budget === 'low' ? '150K' : 
              userPreferences.budget === 'medium' ? '450K' : '1.2M',
        difficulty: userPreferences.experience === 'beginner' ? 'Easy' : 
                    userPreferences.experience === 'intermediate' ? 'Medium' : 'Hard'
      },
      {
        id: 2,
        name: `Alternative ${playstyle.name} Build`,
        weapon: suitableWeapons[1]?.name || 'Axe',
        armor: playstyle.armor === 'plate' ? 'Plate Armor (Hybrid)' : 'Leather Armor',
        description: `More ${userPreferences.focus.includes('mobility') ? 'mobile' : 'durable'} version of the ${playstyle.name} build.`,
        skills: {
          q1: 'Sustained Damage',
          w1: 'Crowd Control',
          e: 'Burst Damage',
          p1: 'Escape/Mobility'
        },
        items: [
          `T6 ${suitableWeapons[1]?.name || 'Axe'}`,
          'T6 Guardian Helmet',
          'T6 Mercenary Armor',
          'T6 Soldier Boots',
          'T6 Thetford Cape',
          'Resistance Potions',
          'Beef Stew'
        ],
        stats: {
          damage: 75,
          survival: 80,
          mobility: 70,
          utility: 55
        },
        cost: userPreferences.budget === 'low' ? '200K' : 
              userPreferences.budget === 'medium' ? '550K' : '1.5M',
        difficulty: 'Medium'
      }
    ];
  }

  function render() {
    const container = document.getElementById('aiAssistantApp');
    if (!container) return;
    
    const playstyle = playstyles[userPreferences.playstyle];
    const contentType = contentTypes[userPreferences.contentType];
    
    generateRecommendations();
    
    container.innerHTML = `
      <div class="ai-assistant-container bg-gray-900 rounded-xl p-6">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
            <i class="fa-solid fa-brain text-2xl text-purple-400"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">AI Build Assistant</h2>
            <p class="text-gray-400">Personalized build recommendations based on your playstyle</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Preferences Panel -->
          <div class="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold text-white mb-4">Your Preferences</h3>
            
            <div class="space-y-6">
              <!-- Playstyle Selection -->
              <div>
                <h4 class="font-semibold text-gray-300 mb-3">Playstyle</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  ${Object.entries(playstyles).map(([key, style]) => `
                    <div class="playstyle-option p-4 rounded-lg cursor-pointer border-2 
                               ${userPreferences.playstyle === key ? 'border-' + style.color.replace('#', '') : 'border-gray-700'}
                               hover:border-${style.color.replace('#', '')}"
                         data-playstyle="${key}"
                         style="border-color: ${userPreferences.playstyle === key ? style.color : '#374151'}">
                      <div class="flex items-center mb-2">
                        <i class="fa-solid fa-${style.icon} mr-2" style="color: ${style.color}"></i>
                        <span class="font-bold text-white">${style.name}</span>
                      </div>
                      <p class="text-sm text-gray-400">${style.desc}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <!-- Content Type -->
              <div>
                <h4 class="font-semibold text-gray-300 mb-3">Content Focus</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  ${Object.entries(contentTypes).map(([key, content]) => `
                    <div class="content-option p-4 rounded-lg cursor-pointer border-2 
                               ${userPreferences.contentType === key ? 'border-blue-500' : 'border-gray-700'}
                               hover:border-blue-400"
                         data-content="${key}">
                      <div class="flex items-center mb-2">
                        <i class="fa-solid fa-${content.icon} mr-2 text-blue-400"></i>
                        <span class="font-bold text-white">${content.name}</span>
                      </div>
                      <p class="text-sm text-gray-400">${content.desc}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <!-- Budget & Experience -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-300 mb-3">Budget</h4>
                  <div class="flex gap-2">
                    ${['low', 'medium', 'high'].map(level => `
                      <button class="budget-btn flex-1 py-3 rounded-lg font-bold 
                                   ${userPreferences.budget === level ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
                              data-budget="${level}">
                        ${level === 'low' ? '💸 Low' : level === 'medium' ? '💰 Medium' : '💎 High'}
                      </button>
                    `).join('')}
                  </div>
                </div>
                
                <div>
                  <h4 class="font-semibold text-gray-300 mb-3">Experience Level</h4>
                  <div class="flex gap-2">
                    ${['beginner', 'intermediate', 'advanced'].map(level => `
                      <button class="exp-btn flex-1 py-3 rounded-lg font-bold 
                                   ${userPreferences.experience === level ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
                              data-exp="${level}">
                        ${level === 'beginner' ? '🎯 Beginner' : level === 'intermediate' ? '⚔️ Intermediate' : '🏆 Advanced'}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
              
              <!-- Focus Areas -->
              <div>
                <h4 class="font-semibold text-gray-300 mb-3">Focus Areas</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  ${[
                    { id: 'damage', name: 'Damage', icon: 'bolt', color: 'red' },
                    { id: 'survival', name: 'Survival', icon: 'shield', color: 'blue' },
                    { id: 'mobility', name: 'Mobility', icon: 'running', color: 'yellow' },
                    { id: 'utility', name: 'Utility', icon: 'toolbox', color: 'green' }
                  ].map(focus => `
                    <div class="focus-option p-3 rounded-lg cursor-pointer border-2 
                               ${userPreferences.focus.includes(focus.id) ? 'border-' + focus.color + '-500' : 'border-gray-700'}
                               hover:border-${focus.color}-400"
                         data-focus="${focus.id}">
                      <div class="flex items-center">
                        <i class="fa-solid fa-${focus.icon} mr-2 text-${focus.color}-400"></i>
                        <span class="font-bold text-white">${focus.name}</span>
                        ${userPreferences.focus.includes(focus.id) ? 
                          '<i class="fa-solid fa-check ml-auto text-green-400"></i>' : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <!-- Generate Button -->
              <div class="pt-4">
                <button id="generateBuilds" class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg">
                  <i class="fa-solid fa-robot mr-2"></i> Generate Build Recommendations
                </button>
              </div>
            </div>
          </div>
          
          <!-- Current Selection Preview -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold text-white mb-4">Your Profile</h3>
            
            <div class="space-y-4">
              <div class="p-4 rounded-lg" style="border-left: 4px solid ${playstyle.color}">
                <div class="flex items-center mb-2">
                  <i class="fa-solid fa-${playstyle.icon} mr-2" style="color: ${playstyle.color}"></i>
                  <h4 class="font-bold text-white">${playstyle.name}</h4>
                </div>
                <p class="text-sm text-gray-300">${playstyle.desc}</p>
              </div>
              
              <div class="p-4 rounded-lg border-l-4 border-blue-500">
                <div class="flex items-center mb-2">
                  <i class="fa-solid fa-${contentType.icon} mr-2 text-blue-400"></i>
                  <h4 class="font-bold text-white">${contentType.name}</h4>
                </div>
                <p class="text-sm text-gray-300">${contentType.desc}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 rounded-lg bg-gray-700">
                  <div class="text-sm text-gray-400 mb-1">Budget</div>
                  <div class="font-bold text-white">
                    ${userPreferences.budget === 'low' ? '💸 Low' : 
                      userPreferences.budget === 'medium' ? '💰 Medium' : '💎 High'}
                  </div>
                </div>
                
                <div class="p-3 rounded-lg bg-gray-700">
                  <div class="text-sm text-gray-400 mb-1">Experience</div>
                  <div class="font-bold text-white capitalize">${userPreferences.experience}</div>
                </div>
              </div>
              
              <div class="p-4 rounded-lg bg-gray-700">
                <div class="text-sm text-gray-400 mb-2">Focus Areas</div>
                <div class="flex flex-wrap gap-2">
                  ${userPreferences.focus.map(focusId => {
                    const focus = [
                      { id: 'damage', name: 'Damage', color: 'red' },
                      { id: 'survival', name: 'Survival', color: 'blue' },
                      { id: 'mobility', name: 'Mobility', color: 'yellow' },
                      { id: 'utility', name: 'Utility', color: 'green' }
                    ].find(f => f.id === focusId);
                    
                    return `
                      <span class="px-2 py-1 rounded text-xs font-bold bg-${focus?.color}-900 text-${focus?.color}-300">
                        ${focus?.name}
                      </span>
                    `;
                  }).join('')}
                </div>
              </div>
              
              <div class="p-4 rounded-lg bg-gray-700">
                <div class="text-sm text-gray-400 mb-2">Recommended Weapons</div>
                <div class="flex flex-wrap gap-2">
                  ${Object.entries(weaponTypes)
                    .filter(([key, weapon]) => weapon.playstyles.includes(userPreferences.playstyle))
                    .slice(0, 3)
                    .map(([key, weapon]) => `
                      <span class="px-2 py-1 rounded text-xs font-bold bg-gray-800 text-gray-300">
                        <i class="fa-solid fa-${weapon.icon} mr-1"></i>${weapon.name}
                      </span>
                    `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Build Recommendations -->
        ${recommendedBuilds.length > 0 ? `
          <div class="mt-8">
            <h3 class="text-2xl font-bold text-white mb-6">Recommended Builds</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${recommendedBuilds.map(build => `
                <div class="build-card bg-gray-800 rounded-lg p-6 border-l-4" 
                     style="border-color: ${playstyle.color}">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h4 class="text-xl font-bold text-white mb-2">${build.name}</h4>
                      <div class="flex items-center text-gray-400 text-sm">
                        <i class="fa-solid fa-${weaponTypes[build.weapon.toLowerCase()]?.icon || 'sword'} mr-2"></i>
                        <span class="mr-4">${build.weapon}</span>
                        <i class="fa-solid fa-shield mr-2"></i>
                        <span>${build.armor}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-white">${build.cost}</div>
                      <div class="text-sm text-gray-400">estimated cost</div>
                    </div>
                  </div>
                  
                  <p class="text-gray-300 mb-4">${build.description}</p>
                  
                  <div class="mb-4">
                    <h5 class="font-semibold text-gray-300 mb-2">Skill Rotation</h5>
                    <div class="grid grid-cols-4 gap-2">
                      ${Object.entries(build.skills).map(([key, skill]) => `
                        <div class="skill-slot p-2 rounded bg-gray-700 text-center">
                          <div class="text-xs font-bold text-gray-400 mb-1">${key.toUpperCase()}</div>
                          <div class="text-sm text-white">${skill}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <h5 class="font-semibold text-gray-300 mb-2">Stat Distribution</h5>
                    <div class="space-y-2">
                      ${Object.entries(build.stats).map(([stat, value]) => `
                        <div class="flex items-center">
                          <div class="w-24 text-sm text-gray-400 capitalize">${stat}</div>
                          <div class="flex-1 bg-gray-700 rounded-full h-2">
                            <div class="bg-${stat === 'damage' ? 'red' : 
                                         stat === 'survival' ? 'blue' : 
                                         stat === 'mobility' ? 'yellow' : 'green'}-500 h-2 rounded-full" 
                                 style="width: ${value}%"></div>
                          </div>
                          <div class="w-8 text-right text-sm text-white">${value}%</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div>
                    <h5 class="font-semibold text-gray-300 mb-2">Required Items</h5>
                    <div class="flex flex-wrap gap-2">
                      ${build.items.map(item => `
                        <span class="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                          ${item}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                    <div class="text-sm">
                      <span class="text-gray-400">Difficulty:</span>
                      <span class="font-bold ml-2 ${build.difficulty === 'Easy' ? 'text-green-400' : 
                                                     build.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}">
                        ${build.difficulty}
                      </span>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm"
                            onclick="saveBuild(${build.id})">
                      <i class="fa-solid fa-save mr-1"></i> Save Build
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    
    setupEventListeners();
  }

  function setupEventListeners() {
    // Playstyle selection
    document.querySelectorAll('.playstyle-option').forEach(option => {
      option.addEventListener('click', () => {
        userPreferences.playstyle = option.dataset.playstyle;
        render();
      });
    });
    
    // Content type selection
    document.querySelectorAll('.content-option').forEach(option => {
      option.addEventListener('click', () => {
        userPreferences.contentType = option.dataset.content;
        render();
      });
    });
    
    // Budget selection
    document.querySelectorAll('.budget-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        userPreferences.budget = btn.dataset.budget;
        render();
      });
    });
    
    // Experience selection
    document.querySelectorAll('.exp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        userPreferences.experience = btn.dataset.exp;
        render();
      });
    });
    
    // Focus selection
    document.querySelectorAll('.focus-option').forEach(option => {
      option.addEventListener('click', () => {
        const focus = option.dataset.focus;
        const index = userPreferences.focus.indexOf(focus);
        
        if (index > -1) {
          userPreferences.focus.splice(index, 1);
        } else {
          userPreferences.focus.push(focus);
        }
        
        render();
      });
    });
    
    // Generate builds
    document.getElementById('generateBuilds').addEventListener('click', () => {
      generateRecommendations();
      render();
      
      // Scroll to recommendations
      setTimeout(() => {
        const recommendations = document.querySelector('.build-card');
        if (recommendations) {
          recommendations.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  }

  function saveBuild(buildId) {
    const build = recommendedBuilds.find(b => b.id === buildId);
    if (build) {
      localStorage.setItem(`ai_assistant_build_${buildId}`, JSON.stringify(build));
      alert('Build saved successfully!');
    }
  }

  function mount() {
    const container = document.getElementById('aiAssistantApp');
    if (container) {
      // Load user preferences if saved
      const savedPrefs = localStorage.getItem('ai_assistant_preferences');
      if (savedPrefs) {
        userPreferences = JSON.parse(savedPrefs);
      }
      
      render();
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.AIAssistant = { mount, render, saveBuild };
})();