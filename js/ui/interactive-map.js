/* Interactive Map - Heatmap and route planning system */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  
  const zones = [
    { id: 'lymhurst', name: 'Lymhurst Forest', type: 'green', risk: 'low', resources: ['wood', 'fiber'], x: 150, y: 200 },
    { id: 'martlock', name: 'Martlock Swamp', type: 'swamp', risk: 'medium', resources: ['stone', 'hide'], x: 300, y: 250 },
    { id: 'bridgewatch', name: 'Bridgewatch Steppe', type: 'steppe', risk: 'low', resources: ['ore', 'hide'], x: 450, y: 200 },
    { id: 'fortsterling', name: 'Fort Sterling Mountains', type: 'mountain', risk: 'medium', resources: ['stone', 'wood'], x: 200, y: 350 },
    { id: 'thetford', name: 'Thetford Forest', type: 'forest', risk: 'medium', resources: ['wood', 'fiber'], x: 400, y: 300 },
    { id: 'caerleon', name: 'Caerleon Black Zone', type: 'black', risk: 'high', resources: ['all'], x: 320, y: 150 },
    { id: 'brecilien', name: 'Brecilien Roads', type: 'road', risk: 'high', resources: ['rare'], x: 250, y: 100 }
  ];

  const resources = {
    wood: { name: 'Wood', color: '#8B4513', icon: 'tree' },
    stone: { name: 'Stone', color: '#A9A9A9', icon: 'mountain' },
    ore: { name: 'Ore', color: '#FFD700', icon: 'gem' },
    fiber: { name: 'Fiber', color: '#90EE90', icon: 'leaf' },
    hide: { name: 'Hide', color: '#D2691E', icon: 'paw' },
    all: { name: 'All Resources', color: '#800080', icon: 'star' },
    rare: { name: 'Rare Resources', color: '#FF4500', icon: 'crown' }
  };

  const riskLevels = {
    low: { color: '#10B981', label: 'Low Risk', description: 'Safe zones, minimal PvP' },
    medium: { color: '#F59E0B', label: 'Medium Risk', description: 'Some PvP activity possible' },
    high: { color: '#EF4444', label: 'High Risk', description: 'Full-loot PvP, dangerous zones' }
  };

  let currentFilters = {
    risk: ['low', 'medium', 'high'],
    resources: ['wood', 'stone', 'ore', 'fiber', 'hide', 'all', 'rare'],
    playerDensity: true,
    resourceDensity: true,
    guildTerritories: false
  };

  let selectedZone = null;
  let isDragging = false;
  let startX, startY;
  let offsetX = 0, offsetY = 0;
  let scale = 1.0;

  function render() {
    const container = document.getElementById('interactiveMapApp');
    if (!container) return;
    
    container.innerHTML = `
      <div class="interactive-map-container">
        <div class="map-header">
          <h2>Interactive Albion Map</h2>
          <div class="map-controls">
            <button id="zoomIn" class="px-3 py-2 bg-gray-800 text-white rounded-lg">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button id="zoomOut" class="px-3 py-2 bg-gray-800 text-white rounded-lg">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button id="resetView" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">
              <i class="fa-solid fa-rotate-right mr-1"></i> Reset
            </button>
          </div>
        </div>
        
        <div class="map-main">
          <!-- Sidebar -->
          <div class="map-sidebar">
            <div class="map-filter-group">
              <h3>Risk Level</h3>
              <div class="filter-options">
                ${Object.entries(riskLevels).map(([key, level]) => `
                  <div class="filter-option ${currentFilters.risk.includes(key) ? 'active' : ''}" 
                       data-filter="risk" data-value="${key}"
                       style="border-left: 3px solid ${level.color}">
                    ${level.label}
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="map-filter-group">
              <h3>Resources</h3>
              <div class="filter-options">
                ${Object.entries(resources).map(([key, resource]) => `
                  <div class="filter-option ${currentFilters.resources.includes(key) ? 'active' : ''}" 
                       data-filter="resources" data-value="${key}"
                       style="color: ${resource.color}">
                    <i class="fa-solid fa-${resource.icon} mr-1"></i> ${resource.name}
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="map-filter-group">
              <h3>Map Overlays</h3>
              <div class="flex flex-col gap-2">
                <label class="flex items-center">
                  <input type="checkbox" ${currentFilters.playerDensity ? 'checked' : ''} 
                         id="playerDensityToggle" class="mr-2">
                  Player Density Heatmap
                </label>
                <label class="flex items-center">
                  <input type="checkbox" ${currentFilters.resourceDensity ? 'checked' : ''} 
                         id="resourceDensityToggle" class="mr-2">
                  Resource Density
                </label>
                <label class="flex items-center">
                  <input type="checkbox" ${currentFilters.guildTerritories ? 'checked' : ''} 
                         id="guildTerritoriesToggle" class="mr-2">
                  Guild Territories
                </label>
              </div>
            </div>
            
            <div class="route-planning mt-6">
              <h3>Route Planning</h3>
              <div class="route-controls">
                <input type="text" id="startPoint" placeholder="Başlangıç noktası" class="bg-gray-800 text-white p-2 rounded">
                <input type="text" id="endPoint" placeholder="Bitiş noktası" class="bg-gray-800 text-white p-2 rounded">
                <button id="calculateRoute" class="bg-green-600 text-white p-2 rounded font-bold">
                  <i class="fa-solid fa-route"></i>
                </button>
              </div>
              
              <div id="routeDisplay" class="route-display hidden">
                <div class="route-step">
                  <div class="route-step-icon">
                    <i class="fa-solid fa-flag"></i>
                  </div>
                  <div class="route-step-info">
                    <div class="route-step-name">Lymhurst Forest</div>
                    <div class="route-step-distance">0 km</div>
                  </div>
                </div>
              </div>
            </div>
            
            ${selectedZone ? `
              <div class="zone-details mt-6 p-4 bg-gray-900 rounded-lg">
                <h3 class="text-lg font-bold text-white mb-2">${selectedZone.name}</h3>
                <div class="flex items-center mb-2">
                  <div class="w-3 h-3 rounded-full mr-2" 
                       style="background: ${riskLevels[selectedZone.risk].color}"></div>
                  <span class="text-sm">${riskLevels[selectedZone.risk].label}</span>
                </div>
                <div class="text-sm text-gray-300 mb-2">
                  Resources: ${selectedZone.resources.map(r => resources[r].name).join(', ')}
                </div>
                <div class="text-xs text-gray-400">
                  ${riskLevels[selectedZone.risk].description}
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Map Canvas -->
          <div class="map-canvas-area">
            <canvas id="mapCanvas" width="800" height="600"></canvas>
            
            <div class="map-toolbar">
              <button id="panTool" class="bg-gray-900 text-white p-2 rounded" title="Pan Tool">
                <i class="fa-solid fa-hand"></i>
              </button>
              <button id="selectTool" class="bg-gray-900 text-white p-2 rounded" title="Select Tool">
                <i class="fa-solid fa-mouse-pointer"></i>
              </button>
              <button id="pathTool" class="bg-gray-900 text-white p-2 rounded" title="Path Tool">
                <i class="fa-solid fa-draw-polygon"></i>
              </button>
            </div>
            
            <div class="map-zoom-display">
              Zoom: ${Math.round(scale * 100)}%
            </div>
            
            <div class="heatmap-legend">
              <div class="legend-title">Player Density</div>
              <div class="legend-items">
                <div class="legend-item">
                  <div class="legend-color" style="background: #10B981"></div>
                  <span class="legend-label">Low</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: #F59E0B"></div>
                  <span class="legend-label">Medium</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: #EF4444"></div>
                  <span class="legend-label">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    drawMap();
    setupEventListeners();
  }

  function drawMap() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    // Draw zones
    zones.forEach(zone => {
      if (!currentFilters.risk.includes(zone.risk)) return;
      
      const hasResources = zone.resources.some(r => currentFilters.resources.includes(r));
      if (!hasResources) return;
      
      const x = zone.x * scale + offsetX;
      const y = zone.y * scale + offsetY;
      
      // Draw zone
      ctx.fillStyle = riskLevels[zone.risk].color + '40';
      ctx.strokeStyle = riskLevels[zone.risk].color;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, 40 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw zone name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${12 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(zone.name, x, y - 50 * scale);
      
      // Draw resources
      zone.resources.forEach((resource, index) => {
        if (currentFilters.resources.includes(resource)) {
          const iconX = x - 20 + index * 15;
          const iconY = y + 20;
          
          ctx.fillStyle = resources[resource].color;
          ctx.font = `${10 * scale}px FontAwesome`;
          // Note: FontAwesome icons won't render directly on canvas
          // For simplicity, we'll use colored circles
          ctx.beginPath();
          ctx.arc(iconX, iconY, 5 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Highlight selected zone
      if (selectedZone && selectedZone.id === zone.id) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(x, y, 45 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    
    // Draw player density if enabled
    if (currentFilters.playerDensity) {
      // Simulated player density data
      const densityData = [
        { x: 200, y: 220, density: 0.8 },
        { x: 450, y: 200, density: 0.6 },
        { x: 320, y: 150, density: 0.9 }
      ];
      
      densityData.forEach(data => {
        const x = data.x * scale + offsetX;
        const y = data.y * scale + offsetY;
        const radius = 30 * data.density * scale;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function setupEventListeners() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    
    // Canvas interaction
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.offsetX;
      startY = e.offsetY;
      canvas.style.cursor = 'grabbing';
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        offsetX += e.offsetX - startX;
        offsetY += e.offsetY - startY;
        startX = e.offsetX;
        startY = e.offsetY;
        drawMap();
      }
      
      // Check for zone hover
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale - offsetX;
      const y = (e.clientY - rect.top) / scale - offsetY;
      
      let hoveredZone = null;
      zones.forEach(zone => {
        const distance = Math.sqrt(Math.pow(zone.x - x, 2) + Math.pow(zone.y - y, 2));
        if (distance < 40) {
          hoveredZone = zone;
        }
      });
      
      if (hoveredZone) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    });
    
    canvas.addEventListener('mouseup', (e) => {
      isDragging = false;
      canvas.style.cursor = 'grab';
      
      // Zone selection
      if (!isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale - offsetX;
        const y = (e.clientY - rect.top) / scale - offsetY;
        
        zones.forEach(zone => {
          const distance = Math.sqrt(Math.pow(zone.x - x, 2) + Math.pow(zone.y - y, 2));
          if (distance < 40) {
            selectedZone = zone;
            render();
          }
        });
      }
    });
    
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const oldScale = scale;
      
      if (e.deltaY < 0) {
        scale = Math.min(scale + zoomFactor, 3.0);
      } else {
        scale = Math.max(scale - zoomFactor, 0.5);
      }
      
      // Adjust offset to zoom around cursor
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      offsetX = mouseX - (mouseX - offsetX) * (scale / oldScale);
      offsetY = mouseY - (mouseY - offsetY) * (scale / oldScale);
      
      drawMap();
      document.querySelector('.map-zoom-display').textContent = `Zoom: ${Math.round(scale * 100)}%`;
    });
    
    // Filter controls
    document.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', () => {
        const filter = option.dataset.filter;
        const value = option.dataset.value;
        
        if (filter === 'risk' || filter === 'resources') {
          const index = currentFilters[filter].indexOf(value);
          if (index > -1) {
            currentFilters[filter].splice(index, 1);
          } else {
            currentFilters[filter].push(value);
          }
        }
        
        render();
      });
    });
    
    // Checkbox toggles
    document.getElementById('playerDensityToggle')?.addEventListener('change', (e) => {
      currentFilters.playerDensity = e.target.checked;
      drawMap();
    });
    
    document.getElementById('resourceDensityToggle')?.addEventListener('change', (e) => {
      currentFilters.resourceDensity = e.target.checked;
      drawMap();
    });
    
    document.getElementById('guildTerritoriesToggle')?.addEventListener('change', (e) => {
      currentFilters.guildTerritories = e.target.checked;
      drawMap();
    });
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
      scale = Math.min(scale + 0.2, 3.0);
      drawMap();
      document.querySelector('.map-zoom-display').textContent = `Zoom: ${Math.round(scale * 100)}%`;
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
      scale = Math.max(scale - 0.2, 0.5);
      drawMap();
      document.querySelector('.map-zoom-display').textContent = `Zoom: ${Math.round(scale * 100)}%`;
    });
    
    document.getElementById('resetView').addEventListener('click', () => {
      offsetX = 0;
      offsetY = 0;
      scale = 1.0;
      drawMap();
      document.querySelector('.map-zoom-display').textContent = `Zoom: ${Math.round(scale * 100)}%`;
    });
    
    // Route planning
    document.getElementById('calculateRoute').addEventListener('click', () => {
      const start = document.getElementById('startPoint').value;
      const end = document.getElementById('endPoint').value;
      
      if (start && end) {
        const routeDisplay = document.getElementById('routeDisplay');
        routeDisplay.classList.remove('hidden');
        routeDisplay.innerHTML = `
          <div class="route-step">
            <div class="route-step-icon">
              <i class="fa-solid fa-flag"></i>
            </div>
            <div class="route-step-info">
              <div class="route-step-name">${start}</div>
              <div class="route-step-distance">Başlangıç</div>
            </div>
          </div>
          <div class="route-step">
            <div class="route-step-icon">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
            <div class="route-step-info">
              <div class="route-step-name">Optimum Rota</div>
              <div class="route-step-distance">~15.2 km</div>
            </div>
          </div>
          <div class="route-step">
            <div class="route-step-icon">
              <i class="fa-solid fa-flag-checkered"></i>
            </div>
            <div class="route-step-info">
              <div class="route-step-name">${end}</div>
              <div class="route-step-distance">Varış</div>
            </div>
          </div>
        `;
      }
    });
  }

  function mount() {
    const container = document.getElementById('interactiveMapApp');
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

  window.InteractiveMap = { mount, render, drawMap };
})();