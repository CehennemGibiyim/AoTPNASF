/* Guild Operations Center - ZvZ and group operation planner */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  
  const operationTypes = {
    zvz: {
      name: 'ZvZ (Large Scale)',
      icon: 'flag',
      color: '#EF4444',
      roles: ['Tank', 'Healer', 'DPS (Ranged)', 'DPS (Melee)', 'Support', 'Scout', 'Commander'],
      minPlayers: 20,
      maxPlayers: 100
    },
    gvg: {
      name: 'GvG (Territory)',
      icon: 'chess',
      color: '#3B82F6',
      roles: ['Main Tank', 'Off Tank', 'Main Healer', 'Off Healer', 'Bruiser', 'Ranged DPS', 'Support', 'Flex'],
      minPlayers: 5,
      maxPlayers: 20
    },
    dungeon: {
      name: 'Group Dungeon',
      icon: 'dungeon',
      color: '#10B981',
      roles: ['Tank', 'Healer', 'DPS 1', 'DPS 2', 'DPS 3', 'Support', 'Flex'],
      minPlayers: 5,
      maxPlayers: 10
    },
    gathering: {
      name: 'Gathering Operation',
      icon: 'leaf',
      color: '#8B4513',
      roles: ['Gatherer (Wood)', 'Gatherer (Stone)', 'Gatherer (Ore)', 'Gatherer (Hide)', 'Gatherer (Fiber)', 'Protector', 'Scout'],
      minPlayers: 5,
      maxPlayers: 15
    },
    transport: {
      name: 'Transport Escort',
      icon: 'truck',
      color: '#F59E0B',
      roles: ['Transport Leader', 'Front Guard', 'Rear Guard', 'Flank Guard', 'Scout', 'Support'],
      minPlayers: 6,
      maxPlayers: 12
    }
  };

  const territories = [
    { id: 'castle_1', name: 'Castle Arachnea', type: 'castle', tier: 8, defenders: 50, value: 2500000 },
    { id: 'castle_2', name: 'Castle Edremor', type: 'castle', tier: 8, defenders: 45, value: 2200000 },
    { id: 'territory_1', name: 'Forest Outpost', type: 'outpost', tier: 7, defenders: 20, value: 800000 },
    { id: 'territory_2', name: 'Mountain Fort', type: 'fort', tier: 7, defenders: 25, value: 950000 },
    { id: 'territory_3', name: 'Swamp Camp', type: 'camp', tier: 6, defenders: 15, value: 500000 }
  ];

  const guildMembers = [
    { id: 1, name: 'GuildMaster', role: 'Commander', online: true, ip: 1800 },
    { id: 2, name: 'HealerPro', role: 'Healer', online: true, ip: 1600 },
    { id: 3, name: 'TankLord', role: 'Tank', online: true, ip: 1700 },
    { id: 4, name: 'SniperElite', role: 'Ranged DPS', online: true, ip: 1550 },
    { id: 5, name: 'ShadowBlade', role: 'Melee DPS', online: true, ip: 1650 },
    { id: 6, name: 'SwiftScout', role: 'Scout', online: true, ip: 1500 },
    { id: 7, name: 'SupportMain', role: 'Support', online: true, ip: 1450 },
    { id: 8, name: 'GatherKing', role: 'Gatherer', online: false, ip: 1400 },
    { id: 9, name: 'FlexPlayer', role: 'Flex', online: true, ip: 1550 },
    { id: 10, name: 'NewRecruit', role: 'Trainee', online: false, ip: 1200 }
  ];

  let currentOperation = {
    type: 'zvz',
    name: 'Castle Siege Operation',
    description: 'Attack on Castle Arachnea to expand territory control',
    date: new Date(Date.now() + 86400000), // Tomorrow
    duration: 120, // minutes
    target: 'castle_1',
    participants: [1, 2, 3, 4, 5, 6, 7],
    requiredRoles: {},
    notes: 'Bring siege weapons and repair kits'
  };

  let operationHistory = [
    { id: 1, type: 'zvz', name: 'Territory Defense', date: '2024-01-15', result: 'win', participants: 35, kills: 120, deaths: 45 },
    { id: 2, type: 'gvg', name: 'Guild Battle', date: '2024-01-10', result: 'loss', participants: 8, kills: 15, deaths: 8 },
    { id: 3, type: 'dungeon', name: 'Avalonian Dungeon', date: '2024-01-05', result: 'win', participants: 7, kills: 42, deaths: 3 },
    { id: 4, type: 'gathering', name: 'Resource Run', date: '2024-01-03', result: 'success', participants: 9, silver: 2500000, resources: 850 }
  ];

  function calculateRequiredRoles() {
    const type = operationTypes[currentOperation.type];
    const required = {};
    
    type.roles.forEach(role => {
      const assigned = currentOperation.participants.map(id => 
        guildMembers.find(m => m.id === id)
      ).filter(member => 
        member && (member.role === role || role === 'Flex' || role === 'Support')
      ).length;
      
      required[role] = {
        needed: role === 'Commander' ? 1 : 3,
        assigned: assigned,
        missing: Math.max(0, (role === 'Commander' ? 1 : 3) - assigned)
      };
    });
    
    return required;
  }

  function render() {
    const container = document.getElementById('guildOperationsApp');
    if (!container) return;
    
    const type = operationTypes[currentOperation.type];
    const target = territories.find(t => t.id === currentOperation.target);
    const requiredRoles = calculateRequiredRoles();
    
    container.innerHTML = `
      <div class="guild-operations-container bg-gray-900 rounded-xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">Guild Operations Center</h2>
          <button id="newOperation" class="px-4 py-2 bg-green-600 text-white rounded-lg font-bold">
            <i class="fa-solid fa-plus mr-1"></i> New Operation
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Operation Planning -->
          <div class="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold text-white mb-4">Operation Planning</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">Operation Type</label>
                <select id="opType" class="w-full bg-gray-700 text-white p-3 rounded-lg">
                  ${Object.entries(operationTypes).map(([key, op]) => `
                    <option value="${key}" ${currentOperation.type === key ? 'selected' : ''}>
                      ${op.name}
                    </option>
                  `).join('')}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">Target</label>
                <select id="opTarget" class="w-full bg-gray-700 text-white p-3 rounded-lg">
                  ${territories.map(territory => `
                    <option value="${territory.id}" ${currentOperation.target === territory.id ? 'selected' : ''}>
                      ${territory.name} (T${territory.tier})
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Operation Name</label>
              <input type="text" id="opName" value="${currentOperation.name}" 
                     class="w-full bg-gray-700 text-white p-3 rounded-lg">
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Description & Objectives</label>
              <textarea id="opDescription" rows="3" 
                        class="w-full bg-gray-700 text-white p-3 rounded-lg">${currentOperation.description}</textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">Date & Time</label>
                <input type="datetime-local" id="opDate" 
                       value="${currentOperation.date.toISOString().slice(0, 16)}"
                       class="w-full bg-gray-700 text-white p-3 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
                <input type="number" id="opDuration" value="${currentOperation.duration}" 
                       class="w-full bg-gray-700 text-white p-3 rounded-lg">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">Required IP</label>
                <select id="opMinIP" class="w-full bg-gray-700 text-white p-3 rounded-lg">
                  <option value="1200">1200+ (Beginner)</option>
                  <option value="1400" selected>1400+ (Intermediate)</option>
                  <option value="1600">1600+ (Advanced)</option>
                  <option value="1800">1800+ (Elite)</option>
                </select>
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Additional Notes</label>
              <textarea id="opNotes" rows="2" 
                        class="w-full bg-gray-700 text-white p-3 rounded-lg">${currentOperation.notes}</textarea>
            </div>
            
            <div class="flex gap-4">
              <button id="saveOperation" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold flex-1">
                <i class="fa-solid fa-save mr-2"></i> Save Operation
              </button>
              <button id="publishOperation" class="px-6 py-3 bg-green-600 text-white rounded-lg font-bold flex-1">
                <i class="fa-solid fa-bullhorn mr-2"></i> Publish to Guild
              </button>
            </div>
          </div>
          
          <!-- Member Selection -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-xl font-bold text-white mb-4">Available Members</h3>
            
            <div class="mb-4">
              <input type="text" id="memberSearch" placeholder="Search members..." 
                     class="w-full bg-gray-700 text-white p-3 rounded-lg mb-3">
              
              <div class="flex justify-between text-sm text-gray-400 mb-2">
                <span>Online: ${guildMembers.filter(m => m.online).length}</span>
                <span>Selected: ${currentOperation.participants.length}</span>
              </div>
            </div>
            
            <div class="member-list max-h-96 overflow-y-auto">
              ${guildMembers.map(member => `
                <div class="member-item flex items-center justify-between p-3 mb-2 bg-gray-700 rounded-lg 
                           hover:bg-gray-600 cursor-pointer ${currentOperation.participants.includes(member.id) ? 'border-2 border-blue-500' : ''}"
                     data-member-id="${member.id}">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-3 ${member.online ? 'bg-green-500' : 'bg-gray-500'}"></div>
                    <div>
                      <div class="font-semibold text-white">${member.name}</div>
                      <div class="text-sm text-gray-400">${member.role} • IP: ${member.ip}</div>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span class="text-xs font-bold px-2 py-1 rounded ${member.ip >= 1600 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}">
                      ${member.ip}
                    </span>
                    <input type="checkbox" class="ml-3" ${currentOperation.participants.includes(member.id) ? 'checked' : ''}>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Role Distribution -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold text-white mb-4">Role Distribution</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${Object.entries(requiredRoles).map(([role, data]) => `
              <div class="role-card p-4 rounded-lg" style="border-left: 4px solid ${type.color}">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-bold text-white">${role}</h4>
                  <span class="text-sm ${data.missing > 0 ? 'text-red-400' : 'text-green-400'}">
                    ${data.assigned}/${data.needed}
                  </span>
                </div>
                <div class="text-sm text-gray-300 mb-3">
                  Assigned: ${guildMembers.filter(m => 
                    currentOperation.participants.includes(m.id) && 
                    (m.role === role || role === 'Flex' || role === 'Support')
                  ).map(m => m.name).join(', ') || 'None'}
                </div>
                ${data.missing > 0 ? `
                  <div class="text-xs text-red-400">
                    <i class="fa-solid fa-exclamation-triangle mr-1"></i>
                    ${data.missing} more needed
                  </div>
                ` : `
                  <div class="text-xs text-green-400">
                    <i class="fa-solid fa-check mr-1"></i>
                    Requirement met
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Operation History -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold text-white mb-4">Operation History</h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-gray-400 border-b border-gray-700">
                  <th class="pb-3">Operation</th>
                  <th class="pb-3">Date</th>
                  <th class="pb-3">Type</th>
                  <th class="pb-3">Participants</th>
                  <th class="pb-3">Result</th>
                  <th class="pb-3">Details</th>
                </tr>
              </thead>
              <tbody>
                ${operationHistory.map(op => `
                  <tr class="border-b border-gray-700 hover:bg-gray-700">
                    <td class="py-3">
                      <div class="font-semibold text-white">${op.name}</div>
                    </td>
                    <td class="py-3 text-gray-300">${op.date}</td>
                    <td class="py-3">
                      <span class="px-2 py-1 rounded text-xs font-bold" 
                            style="background: ${operationTypes[op.type]?.color || '#6B7280'}; color: white">
                        ${operationTypes[op.type]?.name || op.type}
                      </span>
                    </td>
                    <td class="py-3 text-gray-300">${op.participants}</td>
                    <td class="py-3">
                      <span class="px-2 py-1 rounded text-xs font-bold 
                                 ${op.result === 'win' ? 'bg-green-900 text-green-300' : 
                                   op.result === 'loss' ? 'bg-red-900 text-red-300' : 
                                   'bg-blue-900 text-blue-300'}">
                        ${op.result.toUpperCase()}
                      </span>
                    </td>
                    <td class="py-3">
                      ${op.kills ? `<span class="text-green-400 mr-3">${op.kills} kills</span>` : ''}
                      ${op.deaths ? `<span class="text-red-400 mr-3">${op.deaths} deaths</span>` : ''}
                      ${op.silver ? `<span class="text-yellow-400">${op.silver.toLocaleString()} silver</span>` : ''}
                      ${op.resources ? `<span class="text-blue-400">${op.resources} resources</span>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Strategy Notes -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-bold text-white mb-4">Strategy & Tactics</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 class="font-bold text-white mb-2">Formation</h4>
              <div class="text-gray-300 text-sm space-y-2">
                <div><i class="fa-solid fa-shield mr-2 text-blue-400"></i> Tanks front line</div>
                <div><i class="fa-solid fa-cross mr-2 text-green-400"></i> Healers middle position</div>
                <div><i class="fa-solid fa-bow-arrow mr-2 text-red-400"></i> DPS behind tanks</div>
                <div><i class="fa-solid fa-eye mr-2 text-yellow-400"></i> Scouts on flanks</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-bold text-white mb-2">Communication</h4>
              <div class="text-gray-300 text-sm space-y-2">
                <div><i class="fa-solid fa-comments mr-2 text-purple-400"></i> Discord: #operation-channel</div>
                <div><i class="fa-solid fa-bullhorn mr-2 text-orange-400"></i> Commander calls targets</div>
                <div><i class="fa-solid fa-radio mr-2 text-blue-400"></i> Push-to-talk required</div>
                <div><i class="fa-solid fa-list-check mr-2 text-green-400"></i> Use operation markers</div>
              </div>
            </div>
            
            <div>
              <h4 class="font-bold text-white mb-2">Required Items</h4>
              <div class="text-gray-300 text-sm space-y-2">
                <div><i class="fa-solid fa-flask mr-2 text-red-400"></i> Healing potions (T6+)</div>
                <div><i class="fa-solid fa-utensils mr-2 text-yellow-400"></i> Food buffs</div>
                <div><i class="fa-solid fa-helmet-safety mr-2 text-gray-400"></i> Full repair kits</div>
                <div><i class="fa-solid fa-hammer mr-2 text-blue-400"></i> Siege equipment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    setupEventListeners();
  }

  function setupEventListeners() {
    // Operation type change
    document.getElementById('opType').addEventListener('change', (e) => {
      currentOperation.type = e.target.value;
      render();
    });
    
    // Target change
    document.getElementById('opTarget').addEventListener('change', (e) => {
      currentOperation.target = e.target.value;
    });
    
    // Operation name
    document.getElementById('opName').addEventListener('input', (e) => {
      currentOperation.name = e.target.value;
    });
    
    // Operation description
    document.getElementById('opDescription').addEventListener('input', (e) => {
      currentOperation.description = e.target.value;
    });
    
    // Operation date
    document.getElementById('opDate').addEventListener('change', (e) => {
      currentOperation.date = new Date(e.target.value);
    });
    
    // Operation duration
    document.getElementById('opDuration').addEventListener('input', (e) => {
      currentOperation.duration = parseInt(e.target.value) || 60;
    });
    
    // Operation notes
    document.getElementById('opNotes').addEventListener('input', (e) => {
      currentOperation.notes = e.target.value;
    });
    
    // Member selection
    document.querySelectorAll('.member-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const memberId = parseInt(item.dataset.memberId);
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        if (checkbox.checked) {
          // Remove member
          currentOperation.participants = currentOperation.participants.filter(id => id !== memberId);
          checkbox.checked = false;
        } else {
          // Add member
          if (!currentOperation.participants.includes(memberId)) {
            currentOperation.participants.push(memberId);
            checkbox.checked = true;
          }
        }
        
        render();
      });
    });
    
    // Save operation
    document.getElementById('saveOperation').addEventListener('click', () => {
      localStorage.setItem('guild_operation', JSON.stringify(currentOperation));
      alert('Operation saved successfully!');
    });
    
    // Publish operation
    document.getElementById('publishOperation').addEventListener('click', () => {
      const type = operationTypes[currentOperation.type];
      const target = territories.find(t => t.id === currentOperation.target);
      
      const message = `
        🚨 **NEW GUILD OPERATION** 🚨
        
        **${currentOperation.name}**
        Type: ${type.name}
        Target: ${target?.name || 'Unknown'}
        Date: ${currentOperation.date.toLocaleString()}
        Duration: ${currentOperation.duration} minutes
        
        **Required Roles:**
        ${Object.entries(calculateRequiredRoles()).map(([role, data]) => 
          `${role}: ${data.assigned}/${data.needed} ${data.missing > 0 ? '(NEEDS MORE!)' : ''}`
        ).join('\n')}
        
        **Notes:**
        ${currentOperation.notes}
        
        Please RSVP if you can attend!
      `;
      
      alert('Operation published to guild chat!\n\n' + message);
    });
    
    // New operation
    document.getElementById('newOperation').addEventListener('click', () => {
      currentOperation = {
        type: 'zvz',
        name: 'New Guild Operation',
        description: 'Enter operation details here...',
        date: new Date(Date.now() + 86400000),
        duration: 120,
        target: 'castle_1',
        participants: [1, 2, 3],
        requiredRoles: {},
        notes: 'Bring necessary equipment and potions'
      };
      render();
    });
    
    // Member search
    document.getElementById('memberSearch')?.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const members = document.querySelectorAll('.member-item');
      
      members.forEach(member => {
        const memberName = member.querySelector('.font-semibold').textContent.toLowerCase();
        const memberRole = member.querySelector('.text-sm').textContent.toLowerCase();
        
        if (memberName.includes(searchTerm) || memberRole.includes(searchTerm)) {
          member.style.display = 'flex';
        } else {
          member.style.display = 'none';
        }
      });
    });
  }

  function mount() {
    const container = document.getElementById('guildOperationsApp');
    if (container) {
      // Load saved operation if exists
      const saved = localStorage.getItem('guild_operation');
      if (saved) {
        currentOperation = JSON.parse(saved);
        currentOperation.date = new Date(currentOperation.date);
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

  window.GuildOperations = { mount, render };
})();