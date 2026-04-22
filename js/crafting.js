const royalCities = [
  { 
    id: "fortsterling", name: "Fort Sterling", x: 50, y: 15, 
    color: "bg-gray-100", textColor: "text-gray-900", border: "border-gray-300", 
    icon: "fa-mountain", biome: "Mountain (Dağ)",
    refines: "Wood (Odun)", crafts: ["Hammer", "Spear", "Holy Staff", "Plate Helmet", "Cloth Armor"] 
  },
  { 
    id: "lymhurst", name: "Lymhurst", x: 80, y: 35, 
    color: "bg-green-600", textColor: "text-white", border: "border-green-400", 
    icon: "fa-tree", biome: "Forest (Orman)",
    refines: "Fiber (Lif)", crafts: ["Sword", "Bow", "Arcane Staff", "Leather Helmet", "Leather Shoes"] 
  },
  { 
    id: "thetford", name: "Thetford", x: 20, y: 35, 
    color: "bg-purple-800", textColor: "text-white", border: "border-purple-400", 
    icon: "fa-frog", biome: "Swamp (Bataklık)",
    refines: "Ore (Maden)", crafts: ["Mace", "Nature Staff", "Fire Staff", "Leather Armor", "Cloth Helmet"] 
  },
  { 
    id: "martlock", name: "Martlock", x: 30, y: 75, 
    color: "bg-blue-600", textColor: "text-white", border: "border-blue-400", 
    icon: "fa-water", biome: "Highland (Yayla)",
    refines: "Hide (Deri)", crafts: ["Axe", "Quarterstaff", "Frost Staff", "Plate Shoes", "Offhand"] 
  },
  { 
    id: "bridgewatch", name: "Bridgewatch", x: 70, y: 75, 
    color: "bg-orange-500", textColor: "text-white", border: "border-orange-300", 
    icon: "fa-sun", biome: "Steppe (Bozkır)",
    refines: "Rock (Taş)", crafts: ["Crossbow", "Dagger", "Cursed Staff", "Plate Armor", "Cloth Shoes"] 
  },
  { 
    id: "caerleon", name: "Caerleon", x: 50, y: 50, 
    color: "bg-red-800", textColor: "text-white", border: "border-red-500", 
    icon: "fa-skull", biome: "Red Zone",
    refines: "Yok", crafts: ["Tools", "Gathering Gear", "Potions", "Food", "Mounts", "Capes", "Bags"] 
  },
  { 
    id: "brecilien", name: "Brecilien", x: 10, y: 85, 
    color: "bg-fuchsia-900", textColor: "text-white", border: "border-fuchsia-500", 
    icon: "fa-moon", biome: "The Mists",
    refines: "Yok", crafts: ["Brecilien Capes", "Avalonian Weapons", "Fey Armor", "Potions"] 
  }
];

const outlandsBiomes = [
  {
    id: "highland", name: "Yayla (Highland)", icon: "fa-mountain",
    color: "text-blue-400", border: "border-blue-500",
    refines: "Rock (Taş)",
    crafts: ["Axe (Balta)", "Quarterstaff (Asa)", "Frost Staff (Buz Asası)", "Plate Shoes (Plaka Ayakkabı)", "Offhand (Kalkan/Meşale)"],
    maps: ["Arthur's Rest", "Giant's Weald (T8)", "Thunderrock Draw (T8)", "Highstone Loch (T7)", "Highstone Mound (T7)", "Stonemouth Southbluff", "Windgrass Coast"],
    searchTerms: "balta axe quarterstaff asa frost staff buz plate shoes plaka ayakkabı offhand kalkan meşale taş rock arthur's rest giant's weald thunderrock highstone stonemouth windgrass"
  },
  {
    id: "forest", name: "Orman (Forest)", icon: "fa-tree",
    color: "text-green-500", border: "border-green-500",
    refines: "Fiber (Lif)",
    crafts: ["Sword (Kılıç)", "Bow (Yay)", "Arcane Staff (Gizem Asası)", "Leather Helmet (Deri Kafalık)", "Leather Shoes (Deri Ayakkabı)"],
    maps: ["Morgana's Rest", "Eye of the Forest (T8)", "Deepwood Gorge (T8)", "Deepwood Copse (T7)", "Hightree Lake (T7)", "Hightree Enclave (T7)", "Longtimber Glen"],
    searchTerms: "kılıç sword yay bow arcane staff gizem asası leather helmet deri kafalık shoes ayakkabı lif fiber morgana's rest eye of the forest deepwood hightree longtimber"
  },
  {
    id: "mountain", name: "Dağ (Mountain)", icon: "fa-snowflake",
    color: "text-gray-300", border: "border-gray-400",
    refines: "Wood (Odun)",
    crafts: ["Hammer (Çekiç)", "Spear (Mızrak)", "Holy Staff (Kutsal Asa)", "Plate Helmet (Plaka Kafalık)", "Cloth Armor (Kumaş Gövdelik)"],
    maps: ["Everwinter Peak (T8)", "Everwinter Gorge (T8)", "Frostspring Volcano (T7)", "Frostspring Passage (T7)", "Munten Rise", "Whitecliff Expanse", "Glacierfall Pass"],
    searchTerms: "çekiç hammer mızrak spear holy staff kutsal asa plate helmet plaka kafalık cloth armor kumaş gövdelik odun wood everwinter frostspring munten whitecliff glacierfall"
  },
  {
    id: "steppe", name: "Bozkır (Steppe)", icon: "fa-sun",
    color: "text-orange-400", border: "border-orange-500",
    refines: "Hide (Deri)",
    crafts: ["Crossbow (Arbalet)", "Dagger (Hançer)", "Cursed Staff (Lanetli Asa)", "Plate Armor (Plaka Gövdelik)", "Cloth Shoes (Kumaş Ayakkabı)"],
    maps: ["Merlyn's Rest", "Wailing Bulwark (T8)", "Roastcorpse Steppe (T8)", "Sunstrand Delta (T7)", "Sunstrand Quicksands (T7)", "Dryvein Cross", "Farwater Basin"],
    searchTerms: "arbalet crossbow hançer dagger cursed staff lanetli asa plate armor plaka gövdelik cloth shoes kumaş ayakkabı deri hide merlyn's wailing roastcorpse sunstrand dryvein farwater"
  },
  {
    id: "swamp", name: "Bataklık (Swamp)", icon: "fa-frog",
    color: "text-purple-400", border: "border-purple-500",
    refines: "Ore (Maden)",
    crafts: ["Mace (Gürz)", "Nature Staff (Doğa Asası)", "Fire Staff (Ateş Asası)", "Leather Armor (Deri Gövdelik)", "Cloth Helmet (Kumaş Kafalık)"],
    maps: ["Deathreach Priory (T8)", "Murkweald (T8)", "Gravelight Marsh (T7)", "Gravelight Mud (T7)", "Runnel Sink", "Sleetwater Basin", "Darkbough Snag"],
    searchTerms: "gürz mace doğa asası nature staff ateş asası fire staff leather armor deri gövdelik cloth helmet kumaş kafalık maden ore deathreach murkweald gravelight runnel sleetwater darkbough"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('craftingApp');
  if (!container) return;

  // Add the top tabs and dynamic content area
  container.innerHTML = `
    <div class="flex flex-col md:flex-row gap-2 mb-6 bg-albion-800 p-2 rounded-lg border border-gray-700 w-full md:w-max mx-auto md:mx-0">
      <button id="tabBtnRoyal" class="flex-1 md:flex-none px-6 py-2 bg-albion-accent text-white font-bold rounded shadow-md transition-colors">
        <i class="fa-solid fa-chess-rook mr-2"></i> <span >${window.t('crafting-royal', 'Kraliyet Kıtası')}</span>
      </button>
      <button id="tabBtnOutlands" class="flex-1 md:flex-none px-6 py-2 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors">
        <i class="fa-solid fa-skull mr-2"></i> <span >${window.t('crafting-blackZone', 'Black Zone (Hideout Planlayıcı)')}</span>
      </button>
    </div>
    <div id="craftingContentArea" class="flex-1 flex flex-col h-full relative"></div>
  `;

  const btnRoyal = document.getElementById('tabBtnRoyal');
  const btnOutlands = document.getElementById('tabBtnOutlands');
  const contentArea = document.getElementById('craftingContentArea');

  // RENDER ROYAL MAP
  function renderRoyalMap() {
    contentArea.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-6 h-full animate-fade-in">
        <div class="w-full lg:w-3/5 bg-albion-800 border border-gray-700 rounded-xl p-4 flex flex-col relative min-h-[400px]">
          <h3 class="text-lg font-bold text-albion-accent mb-4 text-center"><span >${window.t('crafting-safeZone', 'Güvenli Bölge (Royal Continent)')}</span></h3>
          <div class="relative flex-1 bg-[#151c28] border-2 border-gray-700 rounded-lg overflow-hidden shadow-inner" id="royalMapArea">
            <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
              <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="80%" y1="35%" x2="50%" y2="50%" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="20%" y1="35%" x2="50%" y2="50%" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="70%" y1="75%" x2="50%" y2="50%" stroke="white" stroke-width="2" stroke-dasharray="5,5" />
              <line x1="50%" y1="15%" x2="80%" y2="35%" stroke="white" stroke-width="2" />
              <line x1="50%" y1="15%" x2="20%" y2="35%" stroke="white" stroke-width="2" />
              <line x1="20%" y1="35%" x2="30%" y2="75%" stroke="white" stroke-width="2" />
              <line x1="80%" y1="35%" x2="70%" y2="75%" stroke="white" stroke-width="2" />
              <line x1="30%" y1="75%" x2="70%" y2="75%" stroke="white" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="w-full lg:w-2/5 flex flex-col space-y-4">
          <div id="cityDetailCard" class="bg-albion-800 border border-gray-700 rounded-xl p-6 shadow-lg min-h-[300px] flex flex-col justify-center items-center text-center">
            <i class="fa-solid fa-map-location-dot text-6xl text-gray-600 mb-4"></i>
            <p class="text-gray-400" >${window.t('crafting-clickCity', 'Tüm üretim bonuslarını görmek için haritadan bir şehre tıklayın.')}</p>
          </div>
        </div>
      </div>
    `;

    const mapArea = document.getElementById('royalMapArea');
    royalCities.forEach(city => {
      const cityNode = document.createElement('button');
      cityNode.className = `absolute transform -translate-x-1/2 -translate-y-1/2 ${city.color} ${city.textColor} border-4 ${city.border} w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-110 transition-transform z-10`;
      cityNode.style.left = `${city.x}%`;
      cityNode.style.top = `${city.y}%`;
      cityNode.title = city.name;
      cityNode.innerHTML = `<i class="fa-solid ${city.icon} text-xl"></i>`;
      
      const label = document.createElement('div');
      label.className = `absolute transform -translate-x-1/2 text-xs font-bold text-white whitespace-nowrap drop-shadow-md z-20 pointer-events-none`;
      label.style.left = `${city.x}%`;
      label.style.top = `calc(${city.y}% + 35px)`;
      label.innerText = city.name;

      cityNode.addEventListener('click', () => {
        document.getElementById('cityDetailCard').innerHTML = `
          <div class="w-full text-left animate-fade-in">
            <div class="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-700">
              <div class="${city.color} ${city.textColor} border-2 ${city.border} w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg shrink-0">
                <i class="fa-solid ${city.icon}"></i>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white">${city.name}</h2>
                <span class="text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md border border-gray-600">${city.biome}</span>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2" >${window.t('crafting-refineBonus', 'Arıtma Bonusu')}</h4>
              ${city.refines === 'Yok' ? `<div class="text-gray-500 italic" >${window.t('crafting-noRefine', 'Özel arıtma bonusu yoktur.')}</div>` 
                : `<div class="bg-albion-900 border border-gray-600 rounded-lg p-3 text-albion-accent font-bold text-lg flex items-center"><i class="fa-solid fa-fire-burner mr-3"></i> ${city.refines}</div>`
              }
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2" >${window.t('crafting-craftBonus', 'Üretim Bonusu')}</h4>
              <div class="grid grid-cols-2 gap-2">
                ${city.crafts.map(c => `<div class="bg-albion-900 border border-gray-600 rounded p-2 text-sm text-gray-200 flex items-center"><i class="fa-solid fa-hammer text-amber-600 mr-2 opacity-70"></i> ${c}</div>`).join('')}
              </div>
            </div>
          </div>
        `;
      });
      
      mapArea.appendChild(cityNode);
      mapArea.appendChild(label);
    });
  }

  // RENDER BLACK ZONE PLANNER
  function renderOutlandsPlanner() {
    contentArea.innerHTML = `
      <div class="flex flex-col h-full animate-fade-in">
        
        <div class="bg-albion-800 border border-gray-700 p-6 rounded-xl mb-6 shadow-lg">
          <h3 class="text-2xl font-bold text-white mb-2"><i class="fa-solid fa-crosshairs text-albion-accent mr-2"></i> <span >${window.t('crafting-plannerTitle', 'Hideout Yerleşim Planlayıcısı')}</span></h3>
          <p class="text-gray-400 mb-4"><span >${window.t('crafting-plannerDesc', 'Eşya veya harita adıyla arama yapın.')}</span></p>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-4 text-gray-500"></i>
            <input type="text" id="outlandSearch" class="w-full bg-albion-900 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-albion-accent outline-none" placeholder="Ne üretmek istiyorsun veya hangi haritadasın?">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6" id="biomesGrid">
          ${outlandsBiomes.map(b => `
            <div class="biome-card bg-albion-800 border-2 border-gray-700 rounded-xl p-4 transition-all duration-300 flex flex-col" data-search="${b.searchTerms}">
              <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-700">
                <i class="fa-solid ${b.icon} text-3xl ${b.color}"></i>
                <h4 class="font-bold text-white">${b.name}</h4>
              </div>
              <div class="text-sm text-albion-accent font-bold mb-2">${window.t('crafting-refine', 'Arıtma (Refine):')}<br><span class="text-white font-normal">${b.refines}</span></div>
              <div class="text-sm text-gray-400 font-bold mb-1">${window.t('crafting-craftBonus', 'Üretim Bonusu:')}</div>
              <ul class="text-xs text-gray-300 space-y-1 list-disc pl-4 mb-3">
                ${b.crafts.map(c => `<li>${c}</li>`).join('')}
              </ul>
              
              <div class="mt-auto border-t border-gray-700 pt-3">
                <div class="text-xs text-gray-400 font-bold mb-2">${window.t('crafting-importantMaps', 'Bölgedeki Önemli Haritalar:')}</div>
                <div class="flex flex-wrap gap-1 mb-1">
                  ${b.maps.map(m => `<span class="bg-albion-900 border border-gray-600 text-[10px] px-1.5 py-0.5 rounded text-gray-300">${m}</span>`).join('')}
                </div>
                <div class="text-[9px] text-gray-500 italic">*Ve bu biyomdaki diğer haritalar</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="bg-albion-900 border border-gray-700 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center">
          <div class="flex-1">
             <h4 class="text-lg font-bold text-albion-accent mb-2"><span >${window.t('crafting-returnRate', 'Black Zone Hideout Geri Dönüş Tablosu')}</span></h4>
             <p class="text-sm text-gray-400">Hideout'unuzu doğru biyoma kurduğunuzda, bölgenin Kalitesine (Quality) göre kazanacağınız tahmini bonus oranları. (Level 1 Hideout baz alınmıştır)</p>
          </div>
          <div class="w-full md:w-auto bg-albion-800 p-4 rounded-lg border border-gray-700">
             <table class="w-full text-sm text-left text-gray-300">
               <thead class="text-xs text-gray-400 uppercase border-b border-gray-700">
                 <tr><th class="py-2 pr-4">Bölge Kalitesi</th><th class="py-2 px-4 text-center">Odaksız</th><th class="py-2 pl-4 text-center">Odaklı (Focus)</th></tr>
               </thead>
               <tbody>
                 <tr class="border-b border-gray-700/50"><td class="py-2">Quality 1-2</td><td class="py-2 text-center text-albion-accent font-bold">%20</td><td class="py-2 text-center text-cyan-400 font-bold">%46</td></tr>
                 <tr class="border-b border-gray-700/50"><td class="py-2">Quality 3-4</td><td class="py-2 text-center text-albion-accent font-bold">%24</td><td class="py-2 text-center text-cyan-400 font-bold">%49</td></tr>
                 <tr><td class="py-2 text-white font-bold">Quality 5-6 (Derin)</td><td class="py-2 text-center text-albion-accent font-bold text-lg">%30+</td><td class="py-2 text-center text-cyan-400 font-bold text-lg">%53+</td></tr>
               </tbody>
             </table>
          </div>
        </div>

      </div>
    `;

    // Search Logic
    const searchInput = document.getElementById('outlandSearch');
    const cards = document.querySelectorAll('.biome-card');

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      
      cards.forEach(card => {
        if (term === '') {
          card.classList.remove('opacity-30', 'scale-95');
          card.classList.add('border-gray-700');
          card.classList.remove('border-albion-accent', 'shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]');
        } else {
          const searchData = card.getAttribute('data-search');
          if (searchData.includes(term)) {
            card.classList.remove('opacity-30', 'scale-95', 'border-gray-700');
            card.classList.add('border-albion-accent', 'shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]');
          } else {
            card.classList.add('opacity-30', 'scale-95', 'border-gray-700');
            card.classList.remove('border-albion-accent', 'shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]');
          }
        }
      });
    });
  }

  // Bind Tabs
  btnRoyal.addEventListener('click', () => {
    btnRoyal.classList.replace('bg-transparent', 'bg-albion-accent');
    btnRoyal.classList.replace('text-gray-400', 'text-white');
    
    btnOutlands.classList.replace('bg-albion-accent', 'bg-transparent');
    btnOutlands.classList.replace('text-white', 'text-gray-400');
    renderRoyalMap();
  });

  btnOutlands.addEventListener('click', () => {
    btnOutlands.classList.replace('bg-transparent', 'bg-albion-accent');
    btnOutlands.classList.replace('text-gray-400', 'text-white');
    
    btnRoyal.classList.replace('bg-albion-accent', 'bg-transparent');
    btnRoyal.classList.replace('text-white', 'text-gray-400');
    renderOutlandsPlanner();
  });

  // Default Render
  renderRoyalMap();
});
