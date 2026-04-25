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
    <div class="flex flex-col md:flex-row gap-2 mb-6 bg-albion-800 p-2 rounded-lg border border-gray-700 w-full md:w-max mx-auto md:mx-0 shadow-lg shrink-0">
      <button id="tabBtnRoyal" class="flex-1 md:flex-none px-6 py-2 bg-albion-accent text-black font-bold rounded shadow-md transition-colors flex items-center justify-center">
        <i class="fa-solid fa-chess-rook mr-2"></i> <span>${window.t('crafting-royal', 'Kraliyet Kıtası')}</span>
      </button>
      <button id="tabBtnOutlands" class="flex-1 md:flex-none px-6 py-2 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center">
        <i class="fa-solid fa-skull mr-2"></i> <span>${window.t('crafting-blackZone', 'Siyah Bölge (Sığınak Planlayıcı)')}</span>
      </button>
      <button id="tabBtnCalc" class="flex-1 md:flex-none px-6 py-2 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center">
        <i class="fa-solid fa-calculator mr-2"></i> <span>${window.t('crafting-calc', 'Crafting Hesaplayıcı')}</span>
      </button>
    </div>
    <div id="craftingContentArea" class="flex-1 flex flex-col h-full relative"></div>
  `;

  const btnRoyal = document.getElementById('tabBtnRoyal');
  const btnOutlands = document.getElementById('tabBtnOutlands');
  const btnCalc = document.getElementById('tabBtnCalc');
  const contentArea = document.getElementById('craftingContentArea');

  function resetTabs() {
    [btnRoyal, btnOutlands, btnCalc].forEach(btn => {
      btn.className = "flex-1 md:flex-none px-6 py-2 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center";
    });
  }
  function activateTab(btn) {
    btn.className = "flex-1 md:flex-none px-6 py-2 bg-albion-accent text-black font-bold rounded shadow-md transition-colors flex items-center justify-center";
  }

  // RENDER ROYAL MAP
  function renderRoyalMap() {
    contentArea.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-6 h-full animate-fade-in">
        <div class="w-full lg:w-3/5 bg-albion-800 border border-gray-700 rounded-xl p-4 flex flex-col relative min-h-[400px]">
          <h3 class="text-lg font-bold text-albion-accent mb-4 text-center"><span>${window.t('crafting-safeZone', 'Güvenli Bölge (Royal Continent)')}</span></h3>
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
            <p class="text-gray-400">${window.t('crafting-clickCity', 'Tüm üretim bonuslarını görmek için haritadan bir şehre tıklayın.')}</p>
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
              <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">${window.t('crafting-refineBonus', 'Arıtma Bonusu')}</h4>
              ${city.refines === 'Yok' ? `<div class="text-gray-500 italic">${window.t('crafting-noRefine', 'Özel arıtma bonusu yoktur.')}</div>` 
                : `<div class="bg-albion-900 border border-gray-600 rounded-lg p-3 text-albion-accent font-bold text-lg flex items-center"><i class="fa-solid fa-fire-burner mr-3"></i> ${city.refines}</div>`
              }
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">${window.t('crafting-craftBonus', 'Üretim Bonusu')}</h4>
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
      <div class="flex flex-col h-full animate-fade-in pb-10">
        
        <div class="bg-albion-800 border border-gray-700 p-6 rounded-xl mb-6 shadow-lg">
          <h3 class="text-2xl font-bold text-white mb-2"><i class="fa-solid fa-crosshairs text-albion-accent mr-2"></i> <span>${window.t('crafting-plannerTitle', 'Hideout Yerleşim Planlayıcısı')}</span></h3>
          <p class="text-gray-400 mb-4"><span>${window.t('crafting-plannerDesc', 'Eşya veya harita adıyla arama yapın. (Hangi eşyanın hangi bölgedeki sığınakta bonus aldığını gösterir)')}</span></p>
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
             <h4 class="text-lg font-bold text-albion-accent mb-2"><span>${window.t('crafting-returnRate', 'Black Zone Hideout Geri Dönüş Tablosu')}</span></h4>
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

  // RENDER CANLI CRAFT HESAPLAYICI (DİNAMİK AO_ITEMS ENTEGRASYONU)
  let ALL_CRAFT_RECIPES = {};
  
  const RECIPE_RULES = [
    { match: /ARMOR_PLATE/, main: "METALBAR", mainQty: 16 },
    { match: /HEAD_PLATE/, main: "METALBAR", mainQty: 8 },
    { match: /SHOES_PLATE/, main: "METALBAR", mainQty: 8 },
    { match: /ARMOR_LEATHER/, main: "LEATHER", mainQty: 16 },
    { match: /HEAD_LEATHER/, main: "LEATHER", mainQty: 8 },
    { match: /SHOES_LEATHER/, main: "LEATHER", mainQty: 8 },
    { match: /ARMOR_CLOTH/, main: "CLOTH", mainQty: 16 },
    { match: /HEAD_CLOTH/, main: "CLOTH", mainQty: 8 },
    { match: /SHOES_CLOTH/, main: "CLOTH", mainQty: 8 },
    { match: /OFF_SHIELD/, main: "METALBAR", mainQty: 4, sub: "PLANKS", subQty: 4 },
    { match: /OFF_TOWERSHIELD/, main: "METALBAR", mainQty: 4, sub: "PLANKS", subQty: 4 },
    { match: /OFF_SPIKEDSHIELD/, main: "METALBAR", mainQty: 4, sub: "PLANKS", subQty: 4 },
    { match: /OFF_BOOK/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_ORB/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_DEMONSKULL/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_TOTEM/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_CENSER/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_TOME/, main: "LEATHER", mainQty: 4, sub: "CLOTH", subQty: 4 },
    { match: /OFF_TORCH/, main: "PLANKS", mainQty: 4, sub: "LEATHER", subQty: 4 },
    { match: /OFF_HORN/, main: "PLANKS", mainQty: 4, sub: "LEATHER", subQty: 4 },
    { match: /OFF_TALISMAN/, main: "PLANKS", mainQty: 4, sub: "LEATHER", subQty: 4 },
    { match: /OFF_LAMP/, main: "PLANKS", mainQty: 4, sub: "LEATHER", subQty: 4 },
    { match: /OFF_JESTERCANE/, main: "PLANKS", mainQty: 4, sub: "LEATHER", subQty: 4 },
    { match: /MAIN_SWORD/, main: "METALBAR", mainQty: 16, sub: "LEATHER", subQty: 8 },
    { match: /MAIN_SCIMITAR/, main: "METALBAR", mainQty: 16, sub: "LEATHER", subQty: 8 },
    { match: /MAIN_RAPIER/, main: "METALBAR", mainQty: 16, sub: "LEATHER", subQty: 8 },
    { match: /2H_CLAYMORE/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_DUALSWORD/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_CLEAVER/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_DUALSCIMITAR/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /MAIN_AXE/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_AXE/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_HALBERD/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_SCYTHE/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_DUALAXE/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_MACE/, main: "METALBAR", mainQty: 16, sub: "CLOTH", subQty: 8 },
    { match: /MAIN_ROCKMACE/, main: "METALBAR", mainQty: 16, sub: "CLOTH", subQty: 8 },
    { match: /2H_MACE/, main: "METALBAR", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /2H_FLAIL/, main: "METALBAR", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /2H_DUALMACE/, main: "METALBAR", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /MAIN_HAMMER/, main: "METALBAR", mainQty: 16, sub: "PLANKS", subQty: 8 },
    { match: /2H_POLEHAMMER/, main: "METALBAR", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_HAMMER/, main: "METALBAR", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_DUALHAMMER/, main: "METALBAR", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_RAM/, main: "METALBAR", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /MAIN_SPEAR/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_SPEAR/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_GLAIVE/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_HARPOON/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_TRIDENT/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_DAGGER/, main: "METALBAR", mainQty: 16, sub: "LEATHER", subQty: 8 },
    { match: /2H_DAGGER/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_CLAW/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_DUALSICKLE/, main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_QUARTERSTAFF/, main: "LEATHER", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_IRONCLADEDSTAFF/, main: "LEATHER", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_DOUBLEBLADEDSTAFF/, main: "LEATHER", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_COMBATSTAFF/, main: "LEATHER", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_TWINSCYTHE/, main: "LEATHER", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_ROCKSTAFF/, main: "LEATHER", mainQty: 20, sub: "PLANKS", subQty: 12 },
    { match: /2H_BOW/, main: "PLANKS", mainQty: 32 },
    { match: /2H_WARBOW/, main: "PLANKS", mainQty: 32 },
    { match: /2H_LONGBOW/, main: "PLANKS", mainQty: 32 },
    { match: /MAIN_1HCROSSBOW/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_CROSSBOW/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_REPEATINGCROSSBOW/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_DUALCROSSBOW/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_CURSEDSTAFF/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_CURSEDSTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_DEMONICSTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_SKULLORB/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_FIRESTAFF/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_FIRESTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_INFERNOSTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_FIRE_RINGPAIR/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_FROSTSTAFF/, main: "PLANKS", mainQty: 16, sub: "LEATHER", subQty: 8 },
    { match: /2H_FROSTSTAFF/, main: "PLANKS", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_GLACIALSTAFF/, main: "PLANKS", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_ICEGAUNTLETS/, main: "PLANKS", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /2H_ICECRYSTAL/, main: "PLANKS", mainQty: 20, sub: "LEATHER", subQty: 12 },
    { match: /MAIN_ARCANESTAFF/, main: "PLANKS", mainQty: 16, sub: "METALBAR", subQty: 8 },
    { match: /2H_ARCANESTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_ENIGMATICSTAFF/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_ENIGMATICORB/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_ARCANE_RINGPAIR/, main: "PLANKS", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /MAIN_HOLYSTAFF/, main: "PLANKS", mainQty: 16, sub: "CLOTH", subQty: 8 },
    { match: /2H_HOLYSTAFF/, main: "PLANKS", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /2H_DIVINESTAFF/, main: "PLANKS", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /MAIN_NATURESTAFF/, main: "PLANKS", mainQty: 16, sub: "CLOTH", subQty: 8 },
    { match: /2H_NATURESTAFF/, main: "PLANKS", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /2H_WILDSTAFF/, main: "PLANKS", mainQty: 20, sub: "CLOTH", subQty: 12 },
    { match: /2H_KNUCKLES/, main: "LEATHER", mainQty: 20, sub: "METALBAR", subQty: 12 },
    { match: /2H_SHAPESHIFTER/, main: "PLANKS", mainQty: 20, sub: "LEATHER", subQty: 12 }
  ];

  if (window.AO_ITEMS) {
    const validCats = ['sword','axe','mace','hammer','spear','bow','crossbow','nature','holy','fire','frost','arcane','curse','dagger','qstaff','knuckles','shape','phelmet','parmor','pshoes','lhelmet','larmor','lshoes','chelmet','carmor','cshoes','offhand'];
    
    window.AO_ITEMS.forEach(item => {
      // Enchanted (@) varyasyonları atlayalım. Base id'lerde zaten yoktur ama emin olmak için.
      if (item.id.includes('@')) return;

      // Exclude tokens, artifacts, and debug/garbage items
      if (item.id.includes('ARTEFACT') || item.id.includes('TREASURE') || item.id.includes('UNIQUE')) return;
      if (item.id.includes('PROTOTYPE') || item.id.includes('DEBUG') || item.id.includes('NON_TRADABLE') || item.en === item.id) return;

      if (validCats.includes(item.cat)) {
        // Eşya datası base ID şeklindedir (örn: MAIN_SWORD)
        const baseId = item.id;
        let rule = RECIPE_RULES.find(r => r.match.test(baseId));
        if (rule) {
          let rawName = item.tr || item.en;
          // Tüm tier ön eklerini (Acemi, Ehil, Tecrübesiz vb.) temizleyelim ki net eşya adı kalsın.
          let cleanName = rawName.replace(/^(Beginner's|Novice's|Journeyman's|Adept's|Expert's|Master's|Grandmaster's|Elder's|Tecrübesiz|Acemi|Çırak|Kalfa|Ehil|Uzman|Büyük Usta|Usta|Üstat|Yüce)\s+/i, '').trim();

          ALL_CRAFT_RECIPES[baseId] = {
            name: cleanName,
            cat: item.cat,
            main: rule.main,
            mainQty: rule.mainQty,
            sub: rule.sub || null,
            subQty: rule.subQty || 0
          };
          
          const artId = "ARTEFACT_" + baseId;
          const hasArtifact = window.AO_ITEMS.some(i => i.id === artId);
          if (hasArtifact) {
            ALL_CRAFT_RECIPES[baseId].art = artId;
          }
        }
      }
    });
  }

  // Güvenlik amaçlı Fallback (eğer liste yüklenmezse)
  if (Object.keys(ALL_CRAFT_RECIPES).length === 0) {
    ALL_CRAFT_RECIPES = {
      "MAIN_SWORD": { name: "Geniş Kılıç", cat: "sword", main: "METALBAR", mainQty: 16, sub: "LEATHER", subQty: 8 },
      "2H_CLAYMORE": { name: "Çift Elli Kılıç", cat: "sword", main: "METALBAR", mainQty: 20, sub: "LEATHER", subQty: 12 },
    };
  }

  const GROUP_MAP = {
      sword: "Silahlar - Kılıçlar", 
      axe: "Silahlar - Baltalar", 
      mace: "Silahlar - Gürzler", 
      hammer: "Silahlar - Çekiçler", 
      spear: "Silahlar - Mızraklar", 
      bow: "Silahlar - Yaylar", 
      crossbow: "Silahlar - Arbaletler",
      dagger: "Silahlar - Hançerler", 
      qstaff: "Silahlar - Sopalar", 
      knuckles: "Silahlar - Savaş Eldivenleri", 
      nature: "Büyü Asaları - Doğa", 
      holy: "Büyü Asaları - Kutsal", 
      fire: "Büyü Asaları - Ateş", 
      frost: "Büyü Asaları - Buz", 
      arcane: "Büyü Asaları - Arkana", 
      curse: "Büyü Asaları - Lanetli", 
      shape: "Büyü Asaları - Şekil Değiştiren", 
      phelmet: "Zırhlar - Plaka Set", 
      parmor: "Zırhlar - Plaka Set", 
      pshoes: "Zırhlar - Plaka Set", 
      lhelmet: "Zırhlar - Deri Set", 
      larmor: "Zırhlar - Deri Set", 
      lshoes: "Zırhlar - Deri Set", 
      chelmet: "Zırhlar - Kumaş Set", 
      carmor: "Zırhlar - Kumaş Set", 
      cshoes: "Zırhlar - Kumaş Set", 
      offhand: "İkincil Eşyalar (Off-Hand)"
  };

  const superGroups = {};
  Object.keys(ALL_CRAFT_RECIPES).forEach(id => {
      let cat = ALL_CRAFT_RECIPES[id].cat;
      let groupName = GROUP_MAP[cat] || cat;
      if (!superGroups[groupName]) superGroups[groupName] = [];
      superGroups[groupName].push({ id, ...ALL_CRAFT_RECIPES[id] });
  });

  const MAT_NAMES = { "METALBAR": "Metal Külçe", "LEATHER": "İşlenmiş Deri", "CLOTH": "Kumaş", "PLANKS": "Kalas (Ahşap)" };

  function getMatId(baseMat, tier, enchant) {
    if (enchant == 0) return `T${tier}_${baseMat}`;
    return `T${tier}_${baseMat}_LEVEL${enchant}`;
  }
  function getItemId(baseItem, tier, enchant) {
    if (enchant == 0) return `T${tier}_${baseItem}`;
    return `T${tier}_${baseItem}@${enchant}`;
  }

  function renderCalc() {
    const sortedGroupKeys = Object.keys(superGroups).sort((a,b) => {
        if (a.includes('Zırhlar') && !b.includes('Zırhlar')) return 1;
        if (!a.includes('Zırhlar') && b.includes('Zırhlar')) return -1;
        return a.localeCompare(b);
    });

    const selectOptions = sortedGroupKeys.map(groupName => {
        let html = `<optgroup label="${groupName}">`;
        
        superGroups[groupName].sort((a,b) => {
            const typeWeightA = a.cat.includes('armor') ? 1 : (a.cat.includes('helmet') ? 2 : 3);
            const typeWeightB = b.cat.includes('armor') ? 1 : (b.cat.includes('helmet') ? 2 : 3);
            
            if (typeWeightA !== typeWeightB && a.cat !== b.cat) return typeWeightA - typeWeightB;
            return a.name.localeCompare(b.name);
        }).forEach(item => {
            html += `<option value="${item.id}">${item.name}</option>`;
        });
        html += `</optgroup>`;
        return html;
    }).join('');

    contentArea.innerHTML = `
      <div class="w-full flex flex-col md:flex-row gap-6 animate-fade-in text-gray-200 mt-4">
         <!-- Left Sidebar -->
         <div class="w-full md:w-1/3 bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-xl flex flex-col gap-5">
            <h3 class="text-xl font-black text-albion-accent border-b border-gray-700 pb-3 flex items-center"><i class="fa-solid fa-hammer mr-2"></i> Eşya Seçimi</h3>
            
            <div>
               <label class="block text-xs font-bold text-gray-400 mb-1">Eşya Tipi</label>
               <select id="calcItemType" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors custom-scroll">
                 ${selectOptions}
               </select>
            </div>

            <div class="flex gap-3">
               <div class="flex-1">
                 <label class="block text-xs font-bold text-gray-400 mb-1">Tier</label>
                 <select id="calcItemTier" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors">
                   <option value="4">T4</option><option value="5">T5</option><option value="6">T6</option>
                   <option value="7">T7</option><option value="8">T8</option>
                 </select>
               </div>
               <div class="flex-1">
                 <label class="block text-xs font-bold text-gray-400 mb-1">Efsun (Enchant)</label>
                 <select id="calcItemEnchant" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors">
                   <option value="0">.0</option><option value="1">.1</option><option value="2">.2</option>
                   <option value="3">.3</option><option value="4">.4</option>
                 </select>
               </div>
            </div>

            <div>
               <label class="block text-xs font-bold text-gray-400 mb-1">Şehir Bonusu (Return Rate %)</label>
               <select id="calcCityBonus" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors">
                 <option value="15.2">Normal Şehir (%15.2)</option>
                 <option value="24.8">Bonuslu Şehir (%24.8)</option>
                 <option value="43.5">Odaklı / Focus Normal (%43.5)</option>
                 <option value="47.9">Odaklı / Focus Bonuslu (%47.9)</option>
                 <option value="0">Bonus Yok (%0)</option>
               </select>
            </div>

            <div>
               <label class="block text-xs font-bold text-gray-400 mb-1">Tezgah Vergisi (Silver / Station Tax)</label>
               <input type="number" id="calcTax" value="500" placeholder="Örn: 500" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors">
            </div>

            <div>
               <label class="block text-xs font-bold text-gray-400 mb-1">Üretim Adedi (Batch)</label>
               <input type="number" id="calcBatchAmount" value="1" min="1" placeholder="Kaç adet?" class="w-full bg-albion-900 border border-gray-600 rounded p-2.5 text-white outline-none focus:border-albion-accent transition-colors">
            </div>

            <button id="calcBtnFetch" class="w-full bg-albion-accent text-black font-black py-3 rounded-lg shadow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-2">
               <i class="fa-solid fa-cloud-arrow-down"></i> Fiyatları Canlı Çek
            </button>
         </div>

         <!-- Right Area -->
         <div class="w-full md:w-2/3 flex flex-col gap-5">
            <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-xl">
               <div class="flex flex-wrap items-center justify-between border-b border-gray-700 pb-3 mb-4 gap-2">
                  <h3 class="text-xl font-black text-white">Gereksinimler & Piyasalar</h3>
                  <span class="text-xs bg-red-900/50 text-red-400 px-3 py-1.5 rounded-md border border-red-700/50 flex items-center shadow-inner"><i class="fa-solid fa-clock mr-1.5 animate-pulse"></i> <span id="calcUpdateStatus">Son 4 Saat Verisi Bekleniyor</span></span>
               </div>
               <div id="calcMatsContainer" class="flex flex-col gap-3"></div>
            </div>

               <div id="calcWeightContainer" class="mt-4 mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center justify-between shadow-inner">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/50">
                         <i class="fa-solid fa-weight-hanging text-xl text-blue-400"></i>
                     </div>
                     <div>
                        <div class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-0.5">Lojistik & Toplam Ağırlık</div>
                        <div class="text-lg font-black text-white" id="resTotalWeight">0.0 kg</div>
                     </div>
                  </div>
                  <div class="text-right">
                     <div class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Taşıma Önerisi</div>
                     <div class="text-sm font-black text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30" id="resRecommendedMount">Hesaplanıyor...</div>
                  </div>
               </div>

            <div class="#0f141e border-2 border-gray-700 rounded-xl p-6 shadow-2xl relative overflow-hidden bg-black/50">
               <div class="absolute right-0 top-0 w-32 h-32 bg-albion-accent/5 rounded-bl-full pointer-events-none"></div>
               <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center relative z-10">
                  <div class="bg-black/40 p-4 rounded-lg border border-gray-700 shadow-inner">
                     <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Toplam Maliyet</div>
                     <div class="text-xl md:text-2xl font-black text-red-400 tracking-wide" id="resTotalCost">0</div>
                  </div>
                  <div class="bg-black/40 p-4 rounded-lg border border-gray-700 shadow-inner">
                     <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Satış (Vergi Düşülmüş)</div>
                     <div class="text-xl md:text-2xl font-black text-blue-400 tracking-wide" id="resTotalRev">0</div>
                  </div>
                  <div class="bg-black/40 p-4 rounded-lg border border-gray-700 shadow-inner">
                     <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Net Kâr</div>
                     <div class="text-xl md:text-2xl font-black text-green-400 tracking-wide drop-shadow-md" id="resTotalProfit">0</div>
                  </div>
                  <div class="bg-black/40 p-4 rounded-lg border border-gray-700 shadow-inner relative overflow-hidden">
                     <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Kâr Marjı</div>
                     <div class="text-xl md:text-2xl font-black text-white tracking-wide" id="resProfitMargin">%0</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    `;

    // UI Elements
    const selType = document.getElementById('calcItemType');
    const selTier = document.getElementById('calcItemTier');
    const selEnchant = document.getElementById('calcItemEnchant');
    const selBonus = document.getElementById('calcCityBonus');
    const inputTax = document.getElementById('calcTax');
    const btnFetch = document.getElementById('calcBtnFetch');
    const matsContainer = document.getElementById('calcMatsContainer');
    
    // State variables
    let currentMat1Id = '';
    let currentMat2Id = '';
    let currentArtId = '';
    let currentItemId = '';
    let currentMainQty = 0;
    let currentSubQty = 0;

    async function updateLayout() {
      const typeKey = selType.value;
      const tier = selTier.value;
      const ench = selEnchant.value;
      const recipe = ALL_CRAFT_RECIPES[typeKey];

      currentMainQty = recipe.mainQty;
      currentSubQty = recipe.subQty;

      currentMat1Id = getMatId(recipe.main, tier, ench);
      let htmlContent = `
        <div class="flex items-center justify-between bg-black/40 border border-gray-700 p-3 rounded-lg hover:border-gray-500 transition-colors">
          <div class="flex items-center gap-4 w-1/2">
            <div class="w-12 h-12 bg-gray-800 rounded shadow-inner flex items-center justify-center p-1 border border-gray-700">${await window.createItemImage(currentMat1Id, {size: 64})}</div>
            <div class="flex flex-col">
              <span class="font-bold text-sm text-gray-300">${MAT_NAMES[recipe.main]} (T${tier}.${ench})</span>
              <span class="text-xs text-gray-500">Miktar: <span class="text-albion-accent font-bold">${currentMainQty}</span></span>
            </div>
          </div>
          <div class="w-1/3 flex flex-col gap-1 items-end">
            <div class="flex items-center gap-2 w-full">
              <input type="number" id="priceMat1" class="calc-input w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white text-right focus:border-albion-accent outline-none" value="0">
              <i class="fa-solid fa-coins text-yellow-500 text-sm"></i>
            </div>
            <span class="text-[10px] text-gray-500">Birim Alış Fiyatı</span>
          </div>
        </div>
      `;

      currentMat2Id = '';
      if (recipe.sub) {
        currentMat2Id = getMatId(recipe.sub, tier, ench);
        htmlContent += `
          <div class="flex items-center justify-between bg-black/40 border border-gray-700 p-3 rounded-lg hover:border-gray-500 transition-colors">
            <div class="flex items-center gap-4 w-1/2">
              <div class="w-12 h-12 bg-gray-800 rounded shadow-inner flex items-center justify-center p-1 border border-gray-700">${await window.createItemImage(currentMat2Id, {size: 64})}</div>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-gray-300">${MAT_NAMES[recipe.sub]} (T${tier}.${ench})</span>
                <span class="text-xs text-gray-500">Miktar: <span class="text-albion-accent font-bold">${currentSubQty}</span></span>
              </div>
            </div>
            <div class="w-1/3 flex flex-col gap-1 items-end">
              <div class="flex items-center gap-2 w-full">
                <input type="number" id="priceMat2" class="calc-input w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white text-right focus:border-albion-accent outline-none" value="0">
                <i class="fa-solid fa-coins text-yellow-500 text-sm"></i>
              </div>
              <span class="text-[10px] text-gray-500">Birim Alış Fiyatı</span>
            </div>
          </div>
        `;
      }

      currentArtId = '';
      if (recipe.art) {
        currentArtId = `T${tier}_${recipe.art}`;
        // Find turkish name for artifact if available
        let artObj = window.AO_ITEMS.find(i => i.id === recipe.art);
        let artName = artObj ? (artObj.tr || artObj.en) : "Artifact";
        let cleanArtName = artName.replace(/^(Beginner's|Novice's|Journeyman's|Adept's|Expert's|Master's|Grandmaster's|Elder's|Tecrübesiz|Acemi|Çırak|Kalfa|Ehil|Uzman|Büyük Usta|Usta|Üstat|Yüce)\s+/i, '').trim();

        htmlContent += `
          <div class="flex items-center justify-between bg-purple-900/20 border border-purple-800/50 p-3 rounded-lg hover:border-purple-500 transition-colors">
            <div class="flex items-center gap-4 w-1/2">
              <div class="w-12 h-12 bg-gray-800 rounded shadow-inner flex items-center justify-center p-1 border border-purple-700">${await window.createItemImage(currentArtId, {size: 64})}</div>
              <div class="flex flex-col">
                <span class="font-bold text-sm text-gray-300">${cleanArtName} (T${tier})</span>
                <span class="text-xs text-purple-400">Miktar: <span class="text-purple-300 font-bold">1</span> (Artifact)</span>
              </div>
            </div>
            <div class="w-1/3 flex flex-col gap-1 items-end">
              <div class="flex items-center gap-2 w-full">
                <input type="number" id="priceArt" class="calc-input w-full bg-gray-800 border border-purple-600 rounded px-3 py-1.5 text-sm text-white text-right focus:border-purple-400 outline-none" value="0">
                <i class="fa-solid fa-coins text-yellow-500 text-sm"></i>
              </div>
              <span class="text-[10px] text-gray-500">Birim Alış Fiyatı</span>
            </div>
          </div>
        `;
      }

      currentItemId = getItemId(typeKey, tier, ench);
      htmlContent += `
        <div class="flex items-center justify-between bg-albion-900 border border-albion-700 p-3 rounded-lg mt-4 shadow-lg">
          <div class="flex items-center gap-4 w-1/2">
            <div class="w-14 h-14 bg-black/50 rounded shadow-inner flex items-center justify-center p-1 border border-albion-accent">${await window.createItemImage(currentItemId, {size: 64})}</div>
            <div class="flex flex-col">
              <span class="font-black text-base text-white">${recipe.name} (T${tier}.${ench})</span>
              <span class="text-[10px] bg-green-900/40 text-green-400 px-2 py-0.5 rounded border border-green-700/50 w-max mt-1 font-bold">Üretilen Eşya</span>
            </div>
          </div>
          <div class="w-1/3 flex flex-col gap-1 items-end">
            <div class="flex items-center gap-2 w-full">
              <input type="number" id="priceItem" class="calc-input w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-base font-bold text-white text-right focus:border-green-400 outline-none" value="0">
              <i class="fa-solid fa-coins text-yellow-500 text-sm"></i>
            </div>
            <span class="text-[10px] text-gray-500">Piyasa Satış Fiyatı</span>
          </div>
        </div>
      `;

      matsContainer.innerHTML = htmlContent;

      document.querySelectorAll('.calc-input, #calcBatchAmount').forEach(inp => {
        inp.addEventListener('input', calculateProfit);
      });
      calculateProfit();
    }

    function calculateProfit() {
      const p1 = parseFloat(document.getElementById('priceMat1')?.value || 0);
      const p2 = parseFloat(document.getElementById('priceMat2')?.value || 0);
      const pArt = parseFloat(document.getElementById('priceArt')?.value || 0);
      const pItem = parseFloat(document.getElementById('priceItem')?.value || 0);
      
      const rrr = parseFloat(selBonus.value) / 100;
      const tax = parseFloat(inputTax.value) || 0;
      const batch = parseInt(document.getElementById('calcBatchAmount')?.value || 1);
      const marketTax = 0.065;

      const effectiveMat1 = currentMainQty * (1 - rrr);
      const effectiveMat2 = currentSubQty * (1 - rrr);
      const effectiveArt = currentArtId ? 1 * (1 - rrr) : 0;

      const costMat1 = effectiveMat1 * p1;
      const costMat2 = effectiveMat2 * p2;
      const costArt = effectiveArt * pArt;
      
      const singleCost = costMat1 + costMat2 + costArt + tax;
      const singleRev = pItem * (1 - marketTax);
      const singleProfit = singleRev - singleCost;

      const totalCost = singleCost * batch;
      const totalRev = singleRev * batch;
      const netProfit = singleProfit * batch;
      
      let margin = 0;
      if (totalCost > 0) margin = (netProfit / totalCost) * 100;

      document.getElementById('resTotalCost').innerText = Math.round(totalCost).toLocaleString();
      document.getElementById('resTotalRev').innerText = Math.round(totalRev).toLocaleString();
      
      const elProf = document.getElementById('resTotalProfit');
      elProf.innerText = Math.round(netProfit).toLocaleString();
      elProf.className = netProfit >= 0 ? "text-xl md:text-2xl font-black text-green-400 tracking-wide drop-shadow-md" : "text-xl md:text-2xl font-black text-red-400 tracking-wide drop-shadow-md";

      const elMargin = document.getElementById('resProfitMargin');
      elMargin.innerText = "%" + margin.toFixed(1);
      elMargin.className = margin >= 0 ? "text-xl md:text-2xl font-black text-green-400 tracking-wide" : "text-xl md:text-2xl font-black text-red-400 tracking-wide";
      
      let itemWeight = 0;
      const cleanId = currentItemId.replace(/^T\d+_/, '').replace(/@\d+$/, '');
      if (window.AOT_DATA && window.AOT_DATA.weights) {
          itemWeight = window.AOT_DATA.weights[currentItemId] || window.AOT_DATA.weights[cleanId] || 3.5;
      }
      
      const totalWeight = itemWeight * batch;
      document.getElementById('resTotalWeight').innerText = totalWeight.toFixed(1) + " kg";
      
      const mountEl = document.getElementById('resRecommendedMount');
      if (totalWeight <= 0) {
          mountEl.innerHTML = "Bilinmiyor";
      } else if (totalWeight <= 100) {
          mountEl.innerHTML = "🚶 Çanta Yeterli";
      } else if (totalWeight <= 800) {
          mountEl.innerHTML = "🐎 T4 At / Stag";
      } else if (totalWeight <= 1400) {
          mountEl.innerHTML = "🐂 T6 Taşıma Öküzü";
      } else if (totalWeight <= 2800) {
          mountEl.innerHTML = "🐂 T8 Taşıma Öküzü";
      } else if (totalWeight <= 25000) {
          mountEl.innerHTML = "🐘 T8 Nakliye Mamutu";
      } else {
          mountEl.innerHTML = `🐘 ${Math.ceil(totalWeight / 25000)}x Mamut!`;
      }
    }

    btnFetch.addEventListener('click', async () => {
      try {
        btnFetch.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Çekiliyor...';
        btnFetch.disabled = true;
        
        const server = window.getAppServer ? window.getAppServer() : 'europe';
        let idsToFetch = [currentMat1Id, currentItemId];
        if (currentMat2Id) idsToFetch.push(currentMat2Id);
        if (currentArtId) idsToFetch.push(currentArtId);

        const url = `https://${server}.albion-online-data.com/api/v2/stats/prices/${idsToFetch.join(',')}`;
        const res = await fetch(url);
        const data = await res.json();

        function getValidPrice(items, targetId, preferSell = true) {
          const matches = items.filter(i => i.item_id === targetId && i.city !== "Black Market");
          let best = 0;
          let oldestAllowed = Date.now() - (4 * 60 * 60 * 1000); 

          for (let m of matches) {
             let t = new Date(preferSell ? m.sell_price_min_date : m.buy_price_max_date).getTime();
             if (t > oldestAllowed) {
                let price = preferSell ? m.sell_price_min : m.buy_price_max;
                if (price > 0 && (best === 0 || (preferSell ? price < best : price > best))) {
                   best = price;
                }
             }
          }
          return best;
        }

        const p1 = getValidPrice(data, currentMat1Id, true);
        const p2 = currentMat2Id ? getValidPrice(data, currentMat2Id, true) : 0;
        const pArt = currentArtId ? getValidPrice(data, currentArtId, true) : 0;
        const pI = getValidPrice(data, currentItemId, true);

        if (document.getElementById('priceMat1')) document.getElementById('priceMat1').value = p1;
        if (document.getElementById('priceMat2')) document.getElementById('priceMat2').value = p2;
        if (document.getElementById('priceArt')) document.getElementById('priceArt').value = pArt;
        if (document.getElementById('priceItem')) document.getElementById('priceItem').value = pI;

        document.getElementById('calcUpdateStatus').innerText = "Fiyatlar Güncellendi";
        document.getElementById('calcUpdateStatus').parentElement.className = "text-xs bg-green-900/50 text-green-400 px-3 py-1.5 rounded-md border border-green-700/50 flex items-center shadow-inner";

        calculateProfit();
      } catch (e) {
        console.error(e);
        document.getElementById('calcUpdateStatus').innerText = "Veri Çekilemedi!";
      } finally {
        btnFetch.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Fiyatları Canlı Çek';
        btnFetch.disabled = false;
      }
    });

    [selType, selTier, selEnchant].forEach(el => el.addEventListener('change', updateLayout));
    [selBonus, inputTax].forEach(el => el.addEventListener('change', calculateProfit));

    updateLayout();
  }

  btnRoyal.addEventListener('click', () => { resetTabs(); activateTab(btnRoyal); renderRoyalMap(); });
  btnOutlands.addEventListener('click', () => { resetTabs(); activateTab(btnOutlands); renderOutlandsPlanner(); });
  btnCalc.addEventListener('click', () => { resetTabs(); activateTab(btnCalc); renderCalc(); });

  renderRoyalMap();
});
