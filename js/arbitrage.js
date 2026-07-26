// Global fonksiyon: Arbitrage modülünü yükle
function loadArbitrageModule() {
    const container = document.getElementById('arbitrageApp');
    if (!container) return;
    
    console.log('🔄 Arbitrage modülü yükleniyor...');

    // Kategori ve Eşya Listeleri
    const ARB_CATEGORIES = {
        "Silahlar (Weapons)": [
            { id: "MAIN_SWORD", name: "Kılıç" }, { id: "2H_CLAYMORE", name: "Claymore" },
            { id: "MAIN_BOW", name: "Yay" }, { id: "2H_BOW_LONGBOW", name: "Uzun Yay" },
            { id: "MAIN_SPEAR", name: "Mızrak" }, { id: "2H_HALBERD", name: "Teber" },
            { id: "MAIN_DAGGER", name: "Hançer" }, { id: "2H_DAGGERPAIR", name: "Çift Hançer" },
            { id: "MAIN_NATURESTAFF", name: "Doğa Asası" }, { id: "MAIN_FIRESTAFF", name: "Ateş Asası" },
            { id: "2H_FIRESTAFF_HELL", name: "Cehennem Asası" }, { id: "MAIN_ARCANESTAFF", name: "Gizem Asası" },
            { id: "MAIN_FROSTSTAFF", name: "Buz Asası" }, { id: "MAIN_CURSEDSTAFF", name: "Lanetli Asa" },
            { id: "MAIN_MACE", name: "Gürz" }, { id: "MAIN_HAMMER", name: "Çekiç" }, { id: "MAIN_CROSSBOW", name: "Arbalet" }
        ],
        "Zırhlar (Armor)": [
            { id: "HEAD_LEATHER_SET1", name: "Paralı Asker Kafalığı" }, { id: "ARMOR_LEATHER_SET1", name: "Paralı Asker Ceketi" }, { id: "SHOES_LEATHER_SET1", name: "Paralı Asker Ayakkabısı" },
            { id: "HEAD_CLOTH_SET1", name: "Bilgin Kukuletası" }, { id: "ARMOR_CLOTH_SET1", name: "Bilgin Cübbesi" }, { id: "SHOES_CLOTH_SET1", name: "Bilgin Sandaleti" },
            { id: "HEAD_PLATE_SET1", name: "Asker Miğferi" }, { id: "ARMOR_PLATE_SET1", name: "Asker Zırhı" }, { id: "SHOES_PLATE_SET1", name: "Asker Çizmesi" },
            { id: "HEAD_LEATHER_SET2", name: "Avcı Kukuletası" }, { id: "ARMOR_LEATHER_SET2", name: "Avcı Ceketi" }, { id: "SHOES_LEATHER_SET2", name: "Avcı Ayakkabısı" },
            { id: "HEAD_CLOTH_SET2", name: "Ruhban Kukuletası" }, { id: "ARMOR_CLOTH_SET2", name: "Ruhban Cübbesi" }, { id: "SHOES_CLOTH_SET2", name: "Ruhban Sandaleti" },
            { id: "HEAD_PLATE_SET2", name: "Şövalye Miğferi" }, { id: "ARMOR_PLATE_SET2", name: "Şövalye Zırhı" }, { id: "SHOES_PLATE_SET2", name: "Şövalye Çizmesi" }
        ],
        "Aksesuarlar (Accessories)": [
            { id: "BAG", name: "Çanta" }, { id: "CAPE", name: "Pelerin" },
            { id: "CAPEITEM_FW_MARTLOCK", name: "Martlock Pelerini" }, { id: "CAPEITEM_FW_THETFORD", name: "Thetford Pelerini" },
            { id: "CAPEITEM_FW_FORTSTERLING", name: "Fort Sterling Pelerini" }, { id: "CAPEITEM_FW_LYMHURST", name: "Lymhurst Pelerini" },
            { id: "CAPEITEM_FW_BRIDGEWATCH", name: "Bridgewatch Pelerini" }, { id: "CAPEITEM_FW_CAERLEON", name: "Caerleon Pelerini" }
        ],
        "Sarf Malzemeleri (Consumables)": [
            { id: "MEAL_STEW", name: "Yahni (Stew)" }, { id: "MEAL_OMELETTE", name: "Omlet (Omelette)" },
            { id: "MEAL_PIE", name: "Turta (Pie)" }, { id: "MEAL_SALAD", name: "Salata (Salad)" },
            { id: "MEAL_SANDWICH", name: "Sandviç (Sandwich)" }, { id: "MEAL_ROAST", name: "Kızartma (Roast)" },
            { id: "POTION_HEAL", name: "Sağlık İksiri" }, { id: "POTION_ENERGY", name: "Enerji İksiri" },
            { id: "POTION_POISON", name: "Zehir İksiri" }, { id: "POTION_INVISIBILITY", name: "Görünmezlik İksiri" },
            { id: "POTION_STONESKIN", name: "Direnç İksiri" }
        ],
        "Token & Ekonomi": [
            { id: "QUESTITEM_TOKEN_SIPHONED_ENERGY", name: "Siphoned Energy (Özümlenmiş Enerji)" },
            { id: "QUESTITEM_TOKEN_AVALON", name: "Avalonian Energy" },
            { id: "QUESTITEM_TOKEN_ROYAL", name: "Royal Sigil (Kraliyet Nişanı)" },
            { id: "RUNE", name: "Rün (Rune)" },
            { id: "SOUL", name: "Ruh (Soul)" },
            { id: "RELIC", name: "Kalıntı (Relic)" },
            { id: "SHARD_AVALONIAN", name: "Avalon Parçası (Shard)" },
            { id: "ESSENCE", name: "Öz (Essence)" }
        ],
        "Gather": [
            { id: "LOGS", name: "Ağaç Kütüğü (Logs)" },
            { id: "PLANKS", name: "Kalas (Planks)" },
            { id: "HIDE", name: "Ham Deri (Hide)" },
            { id: "LEATHER", name: "İşlenmiş Deri (Leather)" },
            { id: "ROCK", name: "Taş (Rock)" },
            { id: "STONE_BLOCK", name: "Taş Blok (Stone Block)" },
            { id: "ORE", name: "Cevher (Ore)" },
            { id: "METALBAR", name: "Metal Külçe (Metal Bar)" },
            { id: "FIBER", name: "Lif (Fiber)" },
            { id: "CLOTH", name: "Kumaş (Cloth)" }
        ]
    };

    let arbitrageData = [];
    let arbitrageSort = { by: 'profit', dir: 'desc' };

    let bmData = [];
    let bmSort = { by: 'price', dir: 'desc' };

    let cityDataArray = []; // Artık çoklu item listesi tutacak
    
    // === REFİNE EŞLEŞTİRİCİSİ ===
    const REFINE_MAPPING = {
        'LOGS': { processed: 'PLANKS', rate: 0.6, focusRate: 0.8 },      // 100 Logs → 60 Planks (focus ile 80)
        'HIDE': { processed: 'LEATHER', rate: 0.6, focusRate: 0.8 },     // 100 Hide → 60 Leather
        'ROCK': { processed: 'STONE_BLOCK', rate: 0.6, focusRate: 0.8 }, // 100 Rock → 60 Stone Block
        'ORE': { processed: 'METALBAR', rate: 0.6, focusRate: 0.8 },     // 100 Ore → 60 Metal Bar
        'FIBER': { processed: 'CLOTH', rate: 0.6, focusRate: 0.8 }       // 100 Fiber → 60 Cloth
    };
    
    let refineData = [];
    let refineSort = { by: 'profit', dir: 'desc' };
    
    let statsData = [];
    let statsFilters = { timeRange: '7d', category: 'ALL', sort: 'sold' };
    
    // === CRAFT EŞLEŞTİRİCİSİ ===
    const CRAFT_MAPPING = {
        // Silah Craft
        'T6_MAIN_SWORD': { materials: { 'T6_METALBAR': 12, 'T6_LEATHER': 8, 'T6_CLOTH': 4 }, craftTime: 1200 },
        'T6_MAIN_BOW': { materials: { 'T6_PLANKS': 15, 'T6_CLOTH': 6 }, craftTime: 1200 },
        'T6_ARMOR_LEATHER_SET1': { materials: { 'T6_LEATHER': 20, 'T6_CLOTH': 8 }, craftTime: 1800 },
        'T6_ARMOR_PLATE_SET1': { materials: { 'T6_METALBAR': 18, 'T6_CLOTH': 6 }, craftTime: 1800 },
        'T6_ARMOR_CLOTH_SET1': { materials: { 'T6_CLOTH': 25 }, craftTime: 1800 },
        // Aksesuar
        'T6_CAPE': { materials: { 'T6_CLOTH': 10, 'T6_LEATHER': 5 }, craftTime: 900 },
        // Gather Tools
        'T6_MAIN_SICKLE': { materials: { 'T6_METALBAR': 8, 'T6_PLANKS': 6 }, craftTime: 900 },
        'T6_MAIN_SKINNINGKNIFE': { materials: { 'T6_METALBAR': 10, 'T6_LEATHER': 4 }, craftTime: 900 },
        'T6_MAIN_PICKAXE': { materials: { 'T6_METALBAR': 12, 'T6_PLANKS': 4 }, craftTime: 900 },
        'T6_MAIN_STONEHAMMER': { materials: { 'T6_METALBAR': 8, 'T6_STONE_BLOCK': 10 }, craftTime: 900 }
    };
    
    let craftData = [];
    let craftSort = { by: 'profit', dir: 'desc' };

    // HTML Skeleton
    container.innerHTML = `
        <div class="flex flex-col h-full p-4 md:p-6 bg-albion-900 animate-fade-in relative w-full">
            
            <!-- Üst Navigasyon Sekmeleri -->
            <div class="flex flex-col lg:flex-row gap-2 mb-6 bg-albion-800 p-2 rounded-lg border border-gray-700 w-full lg:w-max shadow-lg shrink-0">
                <button id="btnTabArbOpp" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-albion-accent text-black font-bold rounded shadow-md transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-sack-dollar mr-2"></i> <span data-i18n="arbitrage-tabOpp">Kâr Fırsatları</span>
                </button>
                <button id="btnTabArbCity" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-city mr-2"></i> <span data-i18n="arbitrage-tabCity">Şehir Kıyaslama</span>
                </button>
                <button id="btnTabArbManual" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i> <span data-i18n="arbitrage-tabManual">Manuel Arama</span>
                </button>
                <button id="btnTabArbRefine" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-industry mr-2"></i> <span data-i18n="arbitrage-tabRefine">Refine Hesaplayıcı</span>
                </button>
                <button id="btnTabArbStats" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-chart-bar mr-2"></i> <span data-i18n="arbitrage-tabStats">Satış İstatistikleri</span>
                </button>
                <button id="btnTabArbCraft" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-hammer mr-2"></i> <span data-i18n="arbitrage-tabCraft">Craft Hesaplayıcı</span>
                </button>
                <button id="btnTabArbBM" class="arb-nav-btn flex-1 lg:flex-none px-5 py-2.5 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors flex items-center justify-center text-sm md:text-base">
                    <i class="fa-solid fa-skull mr-2"></i> <span data-i18n="arbitrage-tabBM">BM Talepleri</span>
                </button>
            </div>

            <div class="flex-1 relative flex flex-col min-h-0">
                
                <!-- SEKME 1: Kâr Fırsatları (Sadece Ekipman) -->
                <div id="viewArbOpp" class="arb-view flex flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shrink-0">
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-sack-dollar text-albion-accent mr-3"></i> Genel Karaborsa Fırsatları
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Kraliyet şehirlerindeki ucuz ekipmanlar ile Caerleon Black Market arasındaki kâr marjları.</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center w-full xl:w-auto">
                            <select id="oppCity" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">${_('arbitrage-cityAll', 'Tüm Şehirler')}</option>
                                <option value="royal">${_('arbitrage-cityRoyal', 'Kraliyet Şehirleri')}</option>
                                <option value="rest">${_('arbitrage-cityRest', 'Rest Şehirleri')}</option>
                                <option value="LYMHURST">Lymhurst</option>
                                <option value="BRIDGEWATCH">Bridgewatch</option>
                                <option value="FORT_STERLING">Fort Sterling</option>
                                <option value="MARTLOCK">Martlock</option>
                                <option value="THETFORD">Thetford</option>
                                <option value="CAERLEON">Caerleon</option>
                                <option value="ARTHURS_REST">Arthur's Rest</option>
                                <option value="MORGANAS_REST">Morgana's Rest</option>
                                <option value="MERLINS_REST">Merlin's Rest</option>
                            </select>
                            <select id="oppTier" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Tierlar (Hepsi)</option><option value="4">Tier 4</option><option value="5">Tier 5</option>
                                <option value="6" selected>Tier 6</option><option value="7">Tier 7</option><option value="8">Tier 8</option>
                            </select>
                            <select id="oppEnchant" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Enchantlar (Hepsi)</option>
                                <option value="0" selected>Enchant 0</option><option value="1">Enchant 1 (.1)</option>
                                <option value="2">Enchant 2 (.2)</option><option value="3">Enchant 3 (.3)</option><option value="4">Enchant 4 (.4)</option>
                            </select>
                            <button id="btnFetchOpp" class="w-full xl:w-auto bg-albion-accent hover:bg-albion-accent_hover text-black px-4 py-2.5 rounded-lg font-black transition-colors flex justify-center items-center shadow-md uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-rotate-right mr-2"></i> ${_('arbitrage-oppFetch', 'Tara')}
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col relative">
                        <div id="oppLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-4xl md:text-5xl text-albion-accent mb-4"></i>
                            <span class="text-white font-black tracking-widest uppercase text-sm md:text-lg">${_('arbitrage-loading', 'Veriler Çekiliyor...')}</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll">
                            <table class="w-full text-left text-gray-300 min-w-[700px]">
                                <thead class="bg-[#0a0d14] border-b border-gray-700 text-xs uppercase text-gray-400 sticky top-0 z-10" id="oppHeaders">
                                    <tr>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="name">Eşya <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="buy">Alış (Şehir) <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="sell">Satış (Karaborsa) <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="recency">Son Veri <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold text-right cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="profit">Net Kâr <i class="fa-solid fa-sort-down text-albion-accent ml-1 sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody id="oppTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 2: Şehir Kıyaslama -->
                <div id="viewArbCity" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-city text-albion-accent mr-3"></i> <span data-i18n="arbitrage-cityTitle">Şehir Kıyaslama Tablosu</span>
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1" data-i18n="arbitrage-cityDesc">Seçtiğiniz kriterlerdeki tüm eşyaların şehirlerdeki Alış (Buy) ve Satış (Sell) emirlerini kıyaslayın.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Kategori</label>
                                <select id="cityCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm"></select>
                            </div>
                            <div class="flex flex-col lg:col-span-2">
                                <label class="text-xs text-gray-400 font-bold mb-1">Eşya Tipi</label>
                                <select id="cityItem" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm"></select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Tier / Enchant</label>
                                <div class="flex gap-2">
                                    <select id="cityTier" class="w-1/2 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                        <option value="ALL">Hepsi</option><option value="4">T4</option> <option value="5">T5</option> <option value="6" selected>T6</option> <option value="7">T7</option> <option value="8">T8</option>
                                    </select>
                                    <select id="cityEnchant" class="w-1/2 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                        <option value="ALL">Hepsi</option><option value="0" selected>.0</option> <option value="1">.1</option> <option value="2">.2</option> <option value="3">.3</option> <option value="4">.4</option>
                                    </select>
                                </div>
                            </div>
                            <button id="btnFetchCity" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-search mr-2"></i> Ara
                            </button>
                        </div>
                        
                        <!-- Renk Legend -->
                        <div class="mt-3 flex flex-wrap gap-3 text-xs bg-blue-500/10 border border-blue-500/30 p-2 rounded">
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-green-500"></span>
                                <span class="text-gray-300 font-bold">Yeşil =</span>
                                <span class="text-green-400">Alış Fiyatı (Buy Order)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-red-500"></span>
                                <span class="text-gray-300 font-bold">Kırmızı =</span>
                                <span class="text-red-400">Satış Fiyatı (Sell Order)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-yellow-500"></span>
                                <span class="text-gray-300 font-bold">Sarı =</span>
                                <span class="text-yellow-400">Kâr Fırsatı!</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="cityLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-blue-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">Pazar Verileri Derleniyor...</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll" id="cityResultArea">
                            <table class="w-full text-left text-gray-300 min-w-[1600px]">
                                <thead class="bg-[#0a0d14] border-b-2 border-blue-500/50 text-xs uppercase text-gray-400 sticky top-0 z-10" id="cityHeaders">
                                    <tr>
                                        <th class="p-3 font-bold border-r border-gray-800/50 sticky left-0 bg-[#0a0d14] z-20">Eşya</th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Lymhurst<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Bridgewatch<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Fort Sterling<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Martlock<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Thetford<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Caerleon<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Arthur's Rest<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Morgana's Rest<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center border-r border-gray-800/50">Merlyn's Rest<br><span class="text-[9px] text-gray-500 font-normal normal-case">Satış / Alış</span></th>
                                        <th class="p-3 font-bold text-center bg-yellow-500/10 text-yellow-400">En Yüksek Kâr<br><span class="text-[9px] font-normal normal-case">Nereden → Nereye</span></th>
                                    </tr>
                                </thead>
                                <tbody id="cityTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 3: Manuel Eşya Arama -->
                <div id="viewArbManual" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-magnifying-glass text-purple-400 mr-3"></i> Manuel Eşya Arama
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Eşya adı yazarak TÜM pazarlarda (9 şehir) fiyat karşılaştırması yap ve kâr fırsatlarını yakala!</p>
                        </div>
                        <div class="flex gap-3">
                            <input type="text" id="manualSearchInput" placeholder="Eşya adı yaz (örn: Hide, Logs, Broadsword, Cape...)" class="flex-1 bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none text-sm">
                            <select id="manualTier" class="bg-albion-900 border border-gray-600 rounded-lg px-3 text-white focus:border-purple-500 outline-none text-sm font-bold" aria-label="Tier seçin">
                                <option value="ALL" selected>T4–T8</option><option value="4">T4</option><option value="5">T5</option><option value="6">T6</option><option value="7">T7</option><option value="8">T8</option>
                            </select>
                            <select id="manualEnchant" class="bg-albion-900 border border-gray-600 rounded-lg px-3 text-white focus:border-purple-500 outline-none text-sm font-bold" aria-label="Enchant seçin">
                                <option value="ALL" selected>.0–.4</option><option value="0">.0</option><option value="1">.1</option><option value="2">.2</option><option value="3">.3</option><option value="4">.4</option>
                            </select>
                            <button id="btnManualSearch" class="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md flex items-center">
                                <i class="fa-solid fa-search mr-2"></i> Ara
                            </button>
                        </div>
                        <div class="mt-3 flex flex-wrap gap-3 text-xs bg-purple-500/10 border border-purple-500/30 p-2 rounded">
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-green-500"></span>
                                <span class="text-gray-300 font-bold">Yeşil =</span>
                                <span class="text-green-400">Satış Fiyatı (Satin Al)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-red-500"></span>
                                <span class="text-gray-300 font-bold">Kırmızı =</span>
                                <span class="text-red-400">Alış Fiyatı (Anında Sat)</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-block w-3 h-3 rounded bg-yellow-500"></span>
                                <span class="text-gray-300 font-bold">Sarı =</span>
                                <span class="text-yellow-400">Kâr Fırsatı!</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="manualLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-purple-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">Pazarlar Aranıyor...</span>
                        </div>
                        <div class="overflow-y-auto flex-1 custom-scroll p-4" id="manualSearchResults">
                            <div class="text-center text-gray-500 mt-20">
                                <i class="fa-solid fa-magnifying-glass text-6xl mb-4 opacity-30"></i>
                                <p class="text-lg font-bold">Eşya aramaya başlayın</p>
                                <p class="text-sm mt-2">Tüm şehirlerdeki fiyatları karşılaştırıp en kârlı fırsatları göstereceğim!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEKME 4: Refine Hesaplayıcı -->
                <div id="viewArbRefine" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-industry text-orange-500 mr-3"></i> Refine Kâr Hesaplayıcı
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Ham malzeme al → Refine et → İşlenmiş olarak sat = KÂR! Focus kullanmadan ve kullanarak kârı hesapla.</p>
                        </div>
                        
                        <!-- Bilgi Kutusu -->
                        <div class="mb-4 bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                            <div class="text-orange-400 font-bold text-xs mb-2"><i class="fa-solid fa-lightbulb mr-1"></i> REFİNE ORANLARI</div>
                            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🌳 Ağaç</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🐄 Deri</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🪨 Taş</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">⛏️ Cevher</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded text-center">
                                    <div class="text-gray-400">🌾 Lif</div>
                                    <div class="text-white font-bold mt-1">100 → 60</div>
                                    <div class="text-green-400 text-[9px]">Focus: 80</div>
                                </div>
                            </div>
                        </div>
                        
                        <button id="btnFetchRefine" class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                            <i class="fa-solid fa-calculator mr-2"></i> En Kârlı Refine İşlemlerini Hesapla
                        </button>
                    </div>
                    
                    <div id="refineLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-albion-accent"></i><p class="text-white font-bold mt-3 animate-pulse">Refine kârı hesaplanıyor...</p></div>
                    </div>
                    
                    <div id="refineResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="refineHeaders"></thead>
                                <tbody id="refineTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 5: Satış İstatistikleri -->
                <div id="viewArbStats" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-chart-line text-purple-500 mr-3"></i> Satış İstatistikleri & Analiz
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Hangi eşyalar ne kadar satıldı? 1 saat, 1 hafta, 1 aylık analiz ile en çok satılanları keşfet!</p>
                        </div>
                        
                        <!-- Filtreler -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Zaman Aralığı</label>
                                <select id="statsTimeRange" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="1h">Son 1 Saat</option>
                                    <option value="24h">Son 24 Saat</option>
                                    <option value="7d" selected>Son 7 Gün</option>
                                    <option value="30d">Son 30 Gün</option>
                                </select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Kategori</label>
                                <select id="statsCategory" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="ALL">Tüm Kategoriler</option>
                                    <option value="Weapons">Silahlar</option>
                                    <option value="Armor">Zırhlar</option>
                                    <option value="Gather">Gather Malzemeleri</option>
                                    <option value="Consumables">Sarf Malzemeleri</option>
                                </select>
                            </div>
                            <div class="flex flex-col">
                                <label class="text-xs text-gray-400 font-bold mb-1">Sıralama</label>
                                <select id="statsSort" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm">
                                    <option value="sold">En Çok Satan</option>
                                    <option value="revenue">En Yüksek Gelir</option>
                                    <option value="avgPrice">Ortalama Fiyat</option>
                                </select>
                            </div>
                            <button id="btnFetchStats" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                                <i class="fa-solid fa-chart-pie mr-2"></i> Analiz Et
                            </button>
                        </div>
                        
                        <!-- Özet Kartları -->
                        <div id="statsSummaryCards" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 hidden">
                            <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                                <div class="text-blue-400 text-[10px] font-bold uppercase">Toplam Satış</div>
                                <div class="text-white font-black text-xl mt-1" id="statsTotalSold">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-3">
                                <div class="text-green-400 text-[10px] font-bold uppercase">Toplam Gelir</div>
                                <div class="text-white font-black text-xl mt-1" id="statsTotalRevenue">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                                <div class="text-purple-400 text-[10px] font-bold uppercase">En Popüler</div>
                                <div class="text-white font-bold text-sm mt-1 truncate" id="statsTopItem">-</div>
                            </div>
                            <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-3">
                                <div class="text-orange-400 text-[10px] font-bold uppercase">Ortalama Fiyat</div>
                                <div class="text-white font-black text-xl mt-1" id="statsAvgPrice">-</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="statsLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-purple-500"></i><p class="text-white font-bold mt-3 animate-pulse">İstatistikler analiz ediliyor...</p></div>
                    </div>
                    
                    <div id="statsResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="statsHeaders"></thead>
                                <tbody id="statsTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 6: Craft Hesaplayıcı -->
                <div id="viewArbCraft" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col shrink-0">
                        <div class="mb-4">
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-hammer text-amber-500 mr-3"></i> Craft Kâr Hesaplayıcı
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Eşya craft et, malzeme maliyetini hesapla, en kârlı craft işlemini bul! Craft puanını da artır.</p>
                        </div>
                        
                        <!-- Bilgi Kutusu -->
                        <div class="mb-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                            <div class="text-amber-400 font-bold text-xs mb-2"><i class="fa-solid fa-lightbulb mr-1"></i> CRAFT AVANTAJLARI</div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">💰 KÂR</div>
                                    <div class="text-gray-300">Kendi eşyanı üret, daha ucuza mal et</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">⭐ CRAFT PUANI</div>
                                    <div class="text-gray-300">Her craft, focus ile daha yüksek kalite</div>
                                </div>
                                <div class="bg-gray-800/50 p-2 rounded">
                                    <div class="text-amber-400 font-bold mb-1">📊 PİYASA</div>
                                    <div class="text-gray-300">Doğru yere doğru eşyayı götür</div>
                                </div>
                            </div>
                        </div>
                        
                        <button id="btnFetchCraft" class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md h-[42px] flex items-center justify-center uppercase text-sm tracking-wider">
                            <i class="fa-solid fa-calculator mr-2"></i> En Kârlı Craft İşlemlerini Hesapla
                        </button>
                    </div>
                    
                    <div id="craftLoading" class="hidden flex-1 items-center justify-center">
                        <div class="text-center"><i class="fa-solid fa-spinner fa-spin text-4xl text-amber-500"></i><p class="text-white font-bold mt-3 animate-pulse">Craft kârı hesaplanıyor...</p></div>
                    </div>
                    
                    <div id="craftResultArea" class="hidden flex-1 overflow-y-auto custom-scroll">
                        <div class="overflow-x-auto rounded-xl border border-gray-700">
                            <table class="w-full text-left border-collapse">
                                <thead id="craftHeaders"></thead>
                                <tbody id="craftTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SEKME 7: Black Market Talepleri -->
                <div id="viewArbBM" class="arb-view hidden flex-col h-full absolute inset-0">
                    <div class="bg-albion-800 border border-gray-700 rounded-xl p-5 shadow-lg mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center shrink-0">
                        <div>
                            <h2 class="text-xl md:text-2xl font-black text-white flex items-center">
                                <i class="fa-solid fa-skull text-red-500 mr-3"></i> Black Market Talepleri
                            </h2>
                            <p class="text-gray-400 text-xs md:text-sm mt-1">Black Market'in anlık en yüksek alım emirlerini (Buy Orders) görün.</p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center w-full xl:w-auto">
                            <select id="bmCategory" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold"></select>
                            <select id="bmTier" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Tierlar (Hepsi)</option><option value="4">Tier 4</option> <option value="5">Tier 5</option> <option value="6" selected>Tier 6</option> <option value="7">Tier 7</option> <option value="8">Tier 8</option>
                            </select>
                            <select id="bmEnchant" class="flex-1 xl:flex-none bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white focus:border-albion-accent outline-none text-sm font-bold">
                                <option value="ALL">Tüm Enchantlar (Hepsi)</option><option value="0" selected>Enchant 0</option> <option value="1">Enchant 1 (.1)</option> <option value="2">Enchant 2 (.2)</option> <option value="3">Enchant 3 (.3)</option> <option value="4">Enchant 4 (.4)</option>
                            </select>
                            <button id="btnFetchBM" class="w-full xl:w-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg font-black transition-colors shadow-md flex justify-center items-center text-sm uppercase tracking-wider">
                                <i class="fa-solid fa-cloud-arrow-down mr-2"></i> Çek
                            </button>
                        </div>
                    </div>
                    <div class="flex-1 bg-albion-800 border border-gray-700 rounded-xl shadow-lg relative p-0 overflow-hidden flex flex-col">
                        <div id="bmLoading" class="hidden absolute inset-0 bg-albion-800/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <i class="fa-solid fa-circle-notch fa-spin text-5xl text-red-400 mb-4"></i>
                            <span class="text-white font-bold tracking-widest uppercase">BM Verileri Çekiliyor...</span>
                        </div>
                        <div class="overflow-x-auto flex-1 custom-scroll">
                            <table class="w-full text-left text-gray-300 min-w-[500px]">
                                <thead class="bg-[#0a0d14] border-b border-gray-700 text-xs uppercase text-gray-400 sticky top-0 z-10" id="bmHeaders">
                                    <tr>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="name">Eşya <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="quality">Kalite <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="price">En Yüksek Alış <i class="fa-solid fa-sort-down text-albion-accent ml-1 sort-icon"></i></th>
                                        <th class="p-4 font-bold text-right cursor-pointer hover:bg-white/5 transition-colors group whitespace-nowrap" data-sort="recency">Son Veri <i class="fa-solid fa-sort text-gray-600 ml-1 sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody id="bmTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // --- Core Helpers ---
    const getMins = (dStr) => {
        if(!dStr || dStr.startsWith("0001")) return 999999;
        const d = new Date(dStr + "Z");
        return Math.floor((new Date() - d) / 60000);
    };

    const enforceDataFreshness = (dataArray) => {
        if (!Array.isArray(dataArray)) return dataArray;
        // Kullanıcı isteği: 3 saatten (180 dakika) eski olan verileri iptal et (0 yap)
        return dataArray.map(d => {
            if (d.sell_price_min_date && getMins(d.sell_price_min_date) > 180) d.sell_price_min = 0;
            if (d.buy_price_max_date && getMins(d.buy_price_max_date) > 180) d.buy_price_max = 0;
            if (d.sell_price_max_date && getMins(d.sell_price_max_date) > 180) d.sell_price_max = 0;
            if (d.buy_price_min_date && getMins(d.buy_price_min_date) > 180) d.buy_price_min = 0;
            return d;
        });
    };

    const getTimeAgoStr = (maxMins) => {
        if(maxMins > 100000) return `<span class="text-gray-600 italic font-medium">Bilinmiyor</span>`;
        if(maxMins < 2) return `<span class="text-green-400 font-bold">Şimdi</span>`;
        if(maxMins < 60) return `<span class="text-green-300 font-semibold">${maxMins} dk önce</span>`;
        return `<span class="text-yellow-500/80 font-semibold">${Math.floor(maxMins/60)} sa. önce</span>`;
    };

    const getQualityHtml = (q) => {
        const map = { 
           1: {n: 'Normal', c: 'text-gray-400 border-gray-600'}, 
           2: {n: 'İyi', c: 'text-green-400 border-green-600/50'}, 
           3: {n: 'Sıradışı', c: 'text-blue-400 border-blue-600/50'}, 
           4: {n: 'Mükemmel', c: 'text-purple-400 border-purple-600/50'}, 
           5: {n: 'Şaheser', c: 'text-yellow-400 border-yellow-500/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]'} 
        };
        const dt = map[q] || map[1];
        return `<span class="bg-gray-800 border ${dt.c} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">${dt.n}</span>`;
    };

    const getEnchantBadge = (itemId) => {
        const match = itemId.match(/@(\d+)/);
        if(!match) return '';
        const e = parseInt(match[1]);
        let bgClass = 'bg-gray-700 text-white', borderClass = 'border-gray-500';
        if (e === 1) { bgClass = 'bg-green-600 text-white'; borderClass = 'border-green-500/50'; }
        if (e === 2) { bgClass = 'bg-blue-500 text-white'; borderClass = 'border-blue-400/50'; }
        if (e === 3) { bgClass = 'bg-purple-500 text-white'; borderClass = 'border-purple-400/50'; }
        if (e === 4) { bgClass = 'bg-yellow-500 text-black'; borderClass = 'border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]'; }
        return `<div class="absolute -bottom-1 -right-1 ${bgClass} text-[10px] font-black px-1.5 py-0.5 rounded border border-black shadow-lg z-10">.${e}</div>`;
    };

    // Shared filter module keeps every market surface consistent, including T4.4–T8.4.
    const generateItemIds = (baseItem, tierOpt, enchantOpt) =>
        window.ArbFilters.generateItemIds(baseItem, tierOpt, enchantOpt);
    const getItemsToFetch = (baseItems, tierOpt, enchantOpt) =>
        window.ArbFilters.getItemsToFetch(baseItems, tierOpt, enchantOpt);

    const formatItemName = (itemId) => {
        let t = itemId.match(/^T(\d+)/); t = t ? `Tier ${t[1]}` : '';
        let e = itemId.match(/@(\d+)$/); e = e ? ` .${e[1]}` : '';
        let b = itemId.replace(/^T\d+_/, '').replace(/@\d+$/, '');
        
        if (itemId === "QUESTITEM_TOKEN_SIPHONED_ENERGY") return "Siphoned Energy";
        if (itemId === "QUESTITEM_TOKEN_AVALON") return "Avalonian Energy";

        let foundName = b.replace(/_/g, ' ');
        Object.values(ARB_CATEGORIES).flat().forEach(catItem => {
            if (catItem.id === b) foundName = catItem.name;
        });
        return `${t} ${foundName}${e}`.trim();
    };

    // Parçalara (Chunk) ayırarak çoklu eşya verisi çeken yeni ana fonksiyon
    async function fetchPricesInChunks(items, params = '') {
        const chunkSize = 100; // Albion API URL limitini aşmamak için güvenli sayı
        const chunks = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            chunks.push(items.slice(i, i + chunkSize));
        }

        const domain = window.getAlbionApiDomain ? window.getAlbionApiDomain() : 'europe.albion-online-data.com';
        let allData = [];

        await Promise.all(chunks.map(async (chunk) => {
            const url = `https://${domain}/api/v2/stats/prices/${chunk.join(',')}.json${params ? '?' + params : ''}`;
            try {
                const data = await window.fetchWithProxies(url);
                if (Array.isArray(data)) {
                    allData = allData.concat(enforceDataFreshness(data));
                }
            } catch (e) {
                console.error("Fetch chunk failed", e);
            }
        }));

        return allData;
    }

    // --- Tab Switching ---
    const navBtns = document.querySelectorAll('.arb-nav-btn');
    const views = document.querySelectorAll('.arb-view');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => {
                b.classList.remove('bg-albion-accent', 'text-black');
                b.classList.add('bg-transparent', 'text-gray-400');
            });
            btn.classList.remove('bg-transparent', 'text-gray-400');
            btn.classList.add('bg-albion-accent', 'text-black');
            
            const targetId = btn.id.replace('btnTab', 'view');
            views.forEach(v => {
                v.classList.add('hidden');
                v.classList.remove('flex');
            });
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('flex');
        });
    });

    // --- Populate Selects ---
    const cityCatSelect = document.getElementById('cityCategory');
    const cityItemSelect = document.getElementById('cityItem');
    const bmCatSelect = document.getElementById('bmCategory');
    
    // Şehir Kıyaslama kategorilerini populate et
    cityCatSelect.add(new Option("Tüm Kategoriler (Hepsi)", "ALL"));
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        cityCatSelect.add(new Option(catName, catName));
    });
    
    // Şehir Kıyaslama için eşya listesini güncelle
    const updateCityItems = () => {
        cityItemSelect.innerHTML = '<option value="ALL">Tüm Eşyalar (Hepsi)</option>';
        if (cityCatSelect.value === 'ALL') {
            Object.values(ARB_CATEGORIES).flat().forEach(item => {
                cityItemSelect.add(new Option(item.name, item.id));
            });
        } else {
            const catItems = ARB_CATEGORIES[cityCatSelect.value];
            catItems.forEach(item => {
                cityItemSelect.add(new Option(item.name, item.id));
            });
        }
    };
    cityCatSelect.addEventListener('change', updateCityItems);
    updateCityItems();

    bmCatSelect.add(new Option("Tüm Ekipmanlar (Hepsi)", "ALL"));
    Object.keys(ARB_CATEGORIES).forEach(catName => {
        if(catName !== "Sarf Malzemeleri (Consumables)" && catName !== "Token & Ekonomi") {
            bmCatSelect.add(new Option(catName, catName));
        }
    });


    // === TAB 1: KÂR FIRSATLARI (OPP) ===
    const renderOppTable = () => {
        const tbody = document.getElementById('oppTableBody');
        if(!tbody) return;

        if (arbitrageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-gray-500"><i class="fa-solid fa-triangle-exclamation text-2xl mb-2 opacity-50"></i><br>Şu an yüksek kârlı fırsat bulunamadı.</td></tr>`;
            return;
        }

        arbitrageData.sort((a, b) => {
            let valA, valB;
            if(arbitrageSort.by === 'profit') { valA = a.profit; valB = b.profit; }
            else if(arbitrageSort.by === 'recency') { valA = a.recency; valB = b.recency; }
            else if(arbitrageSort.by === 'name') { valA = a.itemNameStr; valB = b.itemNameStr; }
            else if(arbitrageSort.by === 'buy') { valA = a.buy.price; valB = b.buy.price; }
            else if(arbitrageSort.by === 'sell') { valA = a.sell.price; valB = b.sell.price; }

            if(typeof valA === 'string') return arbitrageSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return arbitrageSort.dir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = `<tr class="border-b border-gray-700/50 bg-gray-800/30">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">EŞYA</th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase tracking-wider">ALIŞ YERİ & FİYAT</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase tracking-wider">SATIŞ YERİ & FİYAT</th>
            <th class="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">VERİ YAŞI</th>
            <th class="p-3 text-right text-xs font-bold text-yellow-400 uppercase tracking-wider">NET KÂR</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase tracking-wider">YAPAY ZEKA ÖNERİSİ</th>
        </tr>` + arbitrageData.map(opp => {
            const roi = ((opp.profit / opp.buy.price) * 100).toFixed(0);
            
            // Öneri oluştur
            let tipHtml = '';
            if (opp.profit > 5000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>YÜKSEK KÂR!</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Hemen al, kâr büyük!</div>
                    <div class="text-gray-400 text-[9px] mt-1">Hedef: ${opp.sell.city}</div>
                </div>`;
            } else if (opp.profit > 2000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check-circle mr-1"></i>İYİ FIRSAT</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Değerlendirilebilir</div>
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-info-circle mr-1"></i>Düşük marj (${roi}%)</div>`;
            }
            
            return `
            <tr class="hover:bg-albion-900/50 transition-colors group">
            <td class="p-3 border-b border-gray-700/50 flex items-center">
                <div class="relative mr-4 shrink-0 group-hover:scale-105 transition-transform">
                    <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(opp.itemId) || ''}" class="w-16 h-16 drop-shadow-lg bg-[#0a0d14] rounded border border-gray-700 p-1">
                    ${getEnchantBadge(opp.itemId)}
                </div>
                <div>
                    <div class="font-bold text-white text-sm group-hover:text-albion-accent transition-colors">${opp.itemNameStr}</div>
                    <div class="mt-1">${getQualityHtml(opp.quality)}</div>
                </div>
            </td>
            <td class="p-3 border-b border-gray-700/50">
                <div class="text-xs text-gray-400 mb-0.5"><i class="fa-solid fa-map-location-dot mr-1"></i> ${opp.buy.city}</div>
                <div class="text-sm font-bold text-gray-300">${opp.buy.price.toLocaleString()} 🥈 <span class="text-[9px] text-gray-500">(Satış Emrinden)</span></div>
                ${opp.route ? `<div class="text-[10px] text-yellow-400 mt-1"><i class="fa-solid fa-route mr-1"></i>${opp.route}</div>` : ''}
            </td>
            <td class="p-3 border-b border-gray-700/50">
                <div class="text-xs text-red-400 mb-0.5"><i class="fa-solid fa-skull mr-1"></i> Black Market</div>
                <div class="text-sm font-bold text-gray-300">${opp.sell.price.toLocaleString()} 🥈 <span class="text-[9px] text-red-500/70">(Alış Emrine)</span></div>
            </td>
            <td class="p-3 border-b border-gray-700/50 text-xs">${getTimeAgoStr(opp.recency)}</td>
            <td class="p-3 border-b border-gray-700/50 text-right">
                <div class="text-sm font-black text-green-400 bg-green-500/10 px-3 py-1.5 rounded inline-block border border-green-500/30">
                    +${opp.profit.toLocaleString()} 🥈
                </div>
                <div class="text-[9px] text-gray-500 mt-1">ROI: ${roi}%</div>
            </td>
            <td class="p-3 border-b border-gray-700/50">
                ${tipHtml}
            </td>
            </tr>`;
        }).join('');
    };

    document.querySelectorAll('#oppHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(arbitrageSort.by === sortKey) { arbitrageSort.dir = arbitrageSort.dir === 'asc' ? 'desc' : 'asc'; } 
            else { arbitrageSort.by = sortKey; arbitrageSort.dir = (sortKey === 'recency' || sortKey === 'name') ? 'asc' : 'desc'; }
            
            document.querySelectorAll('#oppHeaders .sort-icon').forEach(icon => icon.className = 'fa-solid fa-sort text-gray-600 group-hover:text-albion-accent ml-1 sort-icon');
            th.querySelector('.sort-icon').className = `fa-solid fa-sort-${arbitrageSort.dir === 'asc' ? 'up' : 'down'} text-albion-accent ml-1 sort-icon`;
            renderOppTable();
        });
    });

    document.getElementById('btnFetchOpp').addEventListener('click', async () => {
        const loading = document.getElementById('oppLoading');
        loading.classList.remove('hidden');
        
        const selectedTier = document.getElementById('oppTier').value;
        const selectedEnchant = document.getElementById('oppEnchant').value;
        const selectedCity = document.getElementById('oppCity').value;
        
        // Şehir filtreleme fonksiyonu
        const cityFilter = (itemData) => {
            if (selectedCity === 'ALL') return true;
            if (selectedCity === 'royal') {
                return ['LYMHURST', 'BRIDGEWATCH', 'FORT_STERLING', 'MARTLOCK', 'THETFORD'].includes(itemData.from);
            }
            if (selectedCity === 'rest') {
                return ['ARTHURS_REST', 'MORGANAS_REST', 'MERLINS_REST'].includes(itemData.from);
            }
            return itemData.from === selectedCity;
        };
        
        // TÜM kategorilerden eşyalar (Gather, Lüks mallar, vs. dahil)
        const baseItems = Object.values(ARB_CATEGORIES)
            .flat()
            .filter(item => {
                // Token ve ekonomi itemlerini çıkar (onlar tierless)
                return !["QUESTITEM_TOKEN_SIPHONED_ENERGY", "QUESTITEM_TOKEN_AVALON", "QUESTITEM_TOKEN_ROYAL", 
                         "RUNE", "SOUL", "RELIC", "SHARD_AVALONIAN", "ESSENCE"].includes(item.id);
            })
            .map(item => item.id);
        
        const itemsToFetch = getItemsToFetch(baseItems, selectedTier, selectedEnchant);
        
        try {
            const data = await fetchPricesInChunks(itemsToFetch);
            
            arbitrageData = [];
            if(data && data.length > 0) {
                const grouped = {};
                const outpostCities = ["Arthur's Rest", "Morgana's Rest", "Merlyn's Rest"];
                
                data.forEach(d => {
                    const key = `${d.item_id}_${d.quality}`;
                    if(!grouped[key]) grouped[key] = { itemId: d.item_id, quality: d.quality, royals: [], outposts: [], caerleon: null };
                    
                    // Outpost şehirleri
                    if(outpostCities.includes(d.city)) {
                        if(d.sell_price_min > 0) {
                            grouped[key].outposts.push({ city: d.city, price: d.sell_price_min, date: d.sell_price_min_date });
                        }
                    }
                    // Caerleon / Black Market
                    else if(d.city === 'Caerleon' || d.city === 'Black Market') {
                        if(d.buy_price_max > 0) grouped[key].caerleon = { price: d.buy_price_max, date: d.buy_price_max_date };
                    } 
                    // Royal şehirler
                    else {
                        if(d.sell_price_min > 0) grouped[key].royals.push({ city: d.city, price: d.sell_price_min, date: d.sell_price_min_date });
                    }
                });

                for(const [key, info] of Object.entries(grouped)) {
                    // Royal -> Caerleon arbitrajı
                    if(info.caerleon && info.royals.length > 0) {
                        info.royals.sort((a,b) => a.price - b.price);
                        const bestBuy = info.royals[0];
                        const netProfit = Math.floor(info.caerleon.price * 0.96) - bestBuy.price;
                        
                        if (netProfit > 500) {
                            arbitrageData.push({
                                itemId: info.itemId, itemNameStr: formatItemName(info.itemId),
                                quality: info.quality, buy: bestBuy, sell: info.caerleon,
                                profit: netProfit, recency: Math.max(getMins(bestBuy.date), getMins(info.caerleon.date)),
                                route: `${bestBuy.city} → BM`
                            });
                        }
                    }
                    
                    // Outpost -> Caerleon arbitrajı
                    if(info.caerleon && info.outposts.length > 0) {
                        info.outposts.sort((a,b) => a.price - b.price);
                        const bestBuy = info.outposts[0];
                        const netProfit = Math.floor(info.caerleon.price * 0.96) - bestBuy.price;
                        
                        // Şehir filtresini uygula
                        const itemData = {
                            itemId: info.itemId, itemNameStr: formatItemName(info.itemId),
                            quality: info.quality, buy: bestBuy, sell: info.caerleon,
                            profit: netProfit, recency: Math.max(getMins(bestBuy.date), getMins(info.caerleon.date)),
                            route: `${bestBuy.city} → BM`,
                            from: bestBuy.city
                        };
                        
                        if (netProfit > 500 && cityFilter(itemData)) {
                            arbitrageData.push(itemData);
                        }
                    }
                }
            }
            renderOppTable();
        } catch(e) {
            document.getElementById('oppTableBody').innerHTML = `<tr><td colspan="5" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });


    // === TAB 2: ŞEHİR KIYASLAMA TABLOSU ===
    const renderCityTable = () => {
        const tbody = document.getElementById('cityTableBody');
        if(!tbody) return;

        if (cityDataArray.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Seçilen kriterlerde eşya verisi bulunamadı.</td></tr>`;
            return;
        }

        cityDataArray.sort((a,b) => formatItemName(a.itemId).localeCompare(formatItemName(b.itemId)));

        const cityList = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon", "Arthur's Rest", "Morgana's Rest", "Merlyn's Rest"];

        tbody.innerHTML = cityDataArray.map(c => {
            return `
            <tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 flex items-center min-w-[220px] border-r border-gray-800/50">
                    <div class="relative mr-3 shrink-0 group-hover:scale-105 transition-transform">
                        <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(c.itemId) || ''}" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5">
                        ${getEnchantBadge(c.itemId)}
                    </div>
                    <div>
                        <div class="font-bold text-white text-xs">${formatItemName(c.itemId)}</div>
                        <div class="text-[9px] text-gray-500 mt-0.5"><i class="fa-solid fa-clock mr-0.5"></i> ${getTimeAgoStr(c.bestRecency)}</div>
                    </div>
                </td>
                ${cityList.map(city => {
                    const sell = c.cities[city].sell > 0 ? c.cities[city].sell.toLocaleString() : '<span class="opacity-30">-</span>';
                    const buy = c.cities[city].buy > 0 ? c.cities[city].buy.toLocaleString() : '<span class="opacity-30">-</span>';
                    return `
                    <td class="p-3 text-center align-middle border-r border-gray-800/50 last:border-0">
                        <div class="text-[13px] font-bold text-green-400 mb-1" title="Satış Emri (Sizin Alış Fiyatınız)">${sell}</div>
                        <div class="text-xs font-bold text-albion-accent" title="Alış Emri (Sizin Anında Satış Fiyatınız)">${buy}</div>
                    </td>`;
                }).join('')}
            </tr>
            `;
        }).join('');
    };

    document.getElementById('btnFetchCity').addEventListener('click', async () => {
        const loading = document.getElementById('cityLoading');
        const resArea = document.getElementById('cityResultArea');
        const tbody = document.getElementById('cityTableBody');
        
        tbody.innerHTML = '';
        resArea.classList.remove('hidden');
        resArea.classList.add('flex');
        loading.classList.remove('hidden');
        
        const cat = document.getElementById('cityCategory').value;
        const itemOpt = document.getElementById('cityItem').value;
        const tier = document.getElementById('cityTier').value;
        const enchant = document.getElementById('cityEnchant').value;
        
        let baseItems = [];
        if (itemOpt === 'ALL') {
            if (cat === 'ALL') {
                baseItems = Object.values(ARB_CATEGORIES).flat().map(i => i.id);
            } else {
                baseItems = ARB_CATEGORIES[cat].map(i => i.id);
            }
        } else {
            baseItems = [itemOpt];
        }
        
        const itemsToFetch = getItemsToFetch(baseItems, tier, enchant);
        
        try {
            const data = await fetchPricesInChunks(itemsToFetch, 'qualities=1');
            
            const grouped = {};
            const cityList = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon", "Arthur's Rest", "Morgana's Rest", "Merlyn's Rest"];
            
            if(data && data.length > 0) {
                data.forEach(d => {
                    if (cityList.includes(d.city)) {
                        if(!grouped[d.item_id]) {
                            grouped[d.item_id] = { itemId: d.item_id, bestRecency: 999999, cities: {} };
                            cityList.forEach(c => grouped[d.item_id].cities[c] = { sell: 0, buy: 0 });
                        }
                        grouped[d.item_id].cities[d.city].sell = d.sell_price_min;
                        grouped[d.item_id].cities[d.city].buy = d.buy_price_max;
                        
                        const recSell = getMins(d.sell_price_min_date);
                        const recBuy = getMins(d.buy_price_max_date);
                        grouped[d.item_id].bestRecency = Math.min(grouped[d.item_id].bestRecency, recSell, recBuy);
                    }
                });
            }

            cityDataArray = Object.values(grouped);
            renderCityTable();
        } catch(e) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-400">Veri Çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });


    // === TAB 3: BLACK MARKET TALEPLERİ ===
    const renderBMTable = () => {
        const tbody = document.getElementById('bmTableBody');
        if(!tbody) return;

        if (bmData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>BM alım emri verisi bulunamadı.</td></tr>`;
            return;
        }

        bmData.sort((a,b) => {
            let valA, valB;
            if(bmSort.by === 'price') { valA = a.price; valB = b.price; }
            else if(bmSort.by === 'recency') { valA = getMins(a.date); valB = getMins(b.date); }
            else if(bmSort.by === 'quality') { valA = a.quality; valB = b.quality; }
            else if(bmSort.by === 'name') { valA = formatItemName(a.itemId); valB = formatItemName(b.itemId); }

            if(typeof valA === 'string') return bmSort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return bmSort.dir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = bmData.map(d => `
            <tr class="hover:bg-albion-900/50 transition-colors">
                <td class="p-3 border-b border-gray-700/50 flex items-center">
                    <div class="relative mr-4 shrink-0">
                        <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(d.itemId) || ''}" class="w-12 h-12 drop-shadow-lg bg-[#0a0d14] rounded border border-gray-700 p-0.5">
                        ${getEnchantBadge(d.itemId)}
                    </div>
                    <span class="font-bold text-white text-sm">${formatItemName(d.itemId)}</span>
                </td>
                <td class="p-3 border-b border-gray-700/50">${getQualityHtml(d.quality)}</td>
                <td class="p-3 border-b border-gray-700/50 font-black text-red-400">${d.price.toLocaleString()} 🥈 <span class="text-[9px] text-red-500/70 block md:inline mt-1 md:mt-0">(Alış Emri)</span></td>
                <td class="p-3 border-b border-gray-700/50 text-right text-xs">${getTimeAgoStr(getMins(d.date))}</td>
            </tr>
        `).join('');
    };

    document.querySelectorAll('#bmHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(bmSort.by === sortKey) { bmSort.dir = bmSort.dir === 'asc' ? 'desc' : 'asc'; } 
            else { bmSort.by = sortKey; bmSort.dir = (sortKey === 'name') ? 'asc' : 'desc'; }
            
            document.querySelectorAll('#bmHeaders .sort-icon').forEach(icon => icon.className = 'fa-solid fa-sort text-gray-600 group-hover:text-albion-accent ml-1 sort-icon');
            th.querySelector('.sort-icon').className = `fa-solid fa-sort-${bmSort.dir === 'asc' ? 'up' : 'down'} text-albion-accent ml-1 sort-icon`;
            renderBMTable();
        });
    });

    document.getElementById('btnFetchBM').addEventListener('click', async () => {
        const loading = document.getElementById('bmLoading');
        loading.classList.remove('hidden');
        
        const cat = document.getElementById('bmCategory').value;
        const tier = document.getElementById('bmTier').value;
        const enchant = document.getElementById('bmEnchant').value;
        
        let baseItems = [];
        if (cat === "ALL") {
            const bmEligibleCats = ["Silahlar (Weapons)", "Zırhlar (Armor)", "Aksesuarlar (Accessories)"];
            bmEligibleCats.forEach(c => {
                ARB_CATEGORIES[c].forEach(b => baseItems.push(b.id));
            });
        } else {
            baseItems = ARB_CATEGORIES[cat].map(b => b.id);
        }
        
        const itemsToFetch = getItemsToFetch(baseItems, tier, enchant);
        
        try {
            const data = await fetchPricesInChunks(itemsToFetch, 'locations=Black Market');
            
            bmData = [];
            if(data && data.length > 0) {
                data.forEach(d => {
                    if (d.buy_price_max > 0) {
                        bmData.push({
                            itemId: d.item_id, quality: d.quality, price: d.buy_price_max, date: d.buy_price_max_date
                        });
                    }
                });
            }

            renderBMTable();
        } catch(e) {
            document.getElementById('bmTableBody').innerHTML = `<tr><td colspan="4" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === MANUEL EŞYA ARAMA ===
    const btnManualSearch = document.getElementById('btnManualSearch');
    const manualSearchInput = document.getElementById('manualSearchInput');
    const manualSearchResults = document.getElementById('manualSearchResults');
    
    btnManualSearch?.addEventListener('click', async () => {
        const searchText = manualSearchInput.value.toLowerCase().trim();
        if (!searchText) {
            alert('Lütfen bir eşya adı girin!');
            return;
        }
        
        manualSearchResults.classList.remove('hidden');
        const loading = document.getElementById('manualLoading');
        loading.classList.remove('hidden');
        manualSearchResults.innerHTML = '';
        
        // Tüm item'lar içinde ara
        const allItems = Object.values(ARB_CATEGORIES).flat();
        const matchedItems = allItems.filter(item => 
            item.name.toLowerCase().includes(searchText) || 
            item.id.toLowerCase().includes(searchText)
        );
        
        if (matchedItems.length === 0) {
            manualSearchResults.innerHTML = '<div class="text-center p-4 text-gray-400"><i class="fa-solid fa-circle-xmark mr-2"></i> Eşya bulunamadı.</div>';
            return;
        }
        
        // İlk 5 eşyayı getir
        const itemsToShow = matchedItems.slice(0, 5);
        const itemsToFetch = [];
        
        const manualTier = document.getElementById('manualTier')?.value || 'ALL';
        const manualEnchant = document.getElementById('manualEnchant')?.value || 'ALL';

        // Seçilen tier ve enchant kombinasyonlarını oluştur (T4.4, T5.4 ... T8.4 dahil).
        itemsToShow.forEach(item => {
            itemsToFetch.push(...generateItemIds(item.id, manualTier, manualEnchant));
        });
        
        try {
            const data = await fetchPricesInChunks(itemsToFetch, 'qualities=1');
            
            if (!data || data.length === 0) {
                manualSearchResults.innerHTML = '<div class="text-center p-4 text-gray-400"><i class="fa-solid fa-circle-xmark mr-2"></i> Veri bulunamadı.</div>';
                return;
            }
            
            // Sonuçları grupla
            const grouped = {};
            const allCities = ["Lymhurst", "Bridgewatch", "Fort Sterling", "Martlock", "Thetford", "Caerleon", "Arthur's Rest", "Morgana's Rest", "Merlyn's Rest"];
            
            data.forEach(d => {
                if (allCities.includes(d.city)) {
                    if (!grouped[d.item_id]) {
                        grouped[d.item_id] = { cities: {} };
                        allCities.forEach(c => grouped[d.item_id].cities[c] = { sell: 0, buy: 0 });
                    }
                    if (d.sell_price_min > 0) {
                        grouped[d.item_id].cities[d.city].sell = d.sell_price_min;
                    }
                    if (d.buy_price_max > 0) {
                        grouped[d.item_id].cities[d.city].buy = d.buy_price_max;
                    }
                }
            });
            
            // HTML oluştur
            let html = '<div class="space-y-3">';
            html += `<div class="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/30"><i class="fa-solid fa-circle-info mr-1"></i> <strong>${matchedItems.length}</strong> eşya bulundu, ilk <strong>${itemsToShow.length}</strong> gösteriliyor</div>`;
            
            for (const [itemId, cityData] of Object.entries(grouped)) {
                // En yüksek kâr fırsatını bul
                let bestProfit = 0;
                let bestFrom = '';
                let bestTo = '';
                
                for (const city1 of allCities) {
                    const buyPrice = cityData.cities[city1]?.buy || 0;
                    if (buyPrice === 0) continue;
                    
                    for (const city2 of allCities) {
                        if (city1 === city2) continue;
                        const sellPrice = cityData.cities[city2]?.sell || 0;
                        if (sellPrice === 0) continue;
                        
                        const profit = Math.floor(sellPrice * 0.935) - buyPrice; // %6.5 vergi
                        if (profit > bestProfit) {
                            bestProfit = profit;
                            bestFrom = city1;
                            bestTo = city2;
                        }
                    }
                }
                
                const itemName = formatItemName(itemId);
                html += `
                    <div class="bg-albion-800 border border-gray-700 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(itemId) || ''}" class="w-8 h-8 bg-[#0a0d14] rounded border border-gray-700">
                                <span class="font-bold text-white text-sm">${itemName}</span>
                            </div>
                            ${bestProfit > 0 ? `<div class="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30"><i class="fa-solid fa-coins mr-1"></i> +${bestProfit.toLocaleString()} (${bestFrom} → ${bestTo})</div>` : '<div class="text-xs text-gray-500">Kâr fırsatı yok</div>'}
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-xs">
                            ${allCities.map(city => {
                                const sell = cityData.cities[city]?.sell;
                                const buy = cityData.cities[city]?.buy;
                                return `
                                    <div class="bg-albion-900 rounded p-2">
                                        <div class="text-gray-400 font-bold mb-1">${city}</div>
                                        <div class="text-green-400">Satış: ${sell > 0 ? sell.toLocaleString() : '-'}</div>
                                        <div class="text-red-400">Alış: ${buy > 0 ? buy.toLocaleString() : '-'}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
            manualSearchResults.innerHTML = html;
            
        } catch (e) {
            console.error('Manuel arama hatası:', e);
            manualSearchResults.innerHTML = '<div class="text-center p-4 text-red-400"><i class="fa-solid fa-triangle-exclamation mr-2"></i> Arama sırasında hata oluştu.</div>';
        } finally {
            loading.classList.add('hidden');
        }
    });
    
    // Enter tuşu ile arama
    manualSearchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnManualSearch.click();
        }
    });

    // === SEKME 4: REFİNE HESAPLAYICI ===
    const renderRefineTable = () => {
        const tbody = document.getElementById('refineTableBody');
        const thead = document.getElementById('refineHeaders');
        if(!tbody || !thead) return;

        if (refineData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamadı. Tüm şehirlerdeki fiyatları kontrol edin.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="profit"><i class="fa-solid fa-fire mr-1"></i>SÜPER KÂR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="rawCost"><i class="fa-solid fa-coins mr-1"></i>HAM ALIM <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">İŞLENMİŞ SATIŞ</th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase cursor-pointer hover:text-white" data-sort="profitNoFocus"><i class="fa-solid fa-chart-line mr-1"></i>KÂR (Focus'suz) <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="profitFocus"><i class="fa-solid fa-bolt mr-1"></i>KÂR (Focus'lu) <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-orange-400 uppercase cursor-pointer hover:text-white" data-sort="roi"><i class="fa-solid fa-percentage mr-1"></i>ROI <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase cursor-pointer hover:text-white" data-sort="city"><i class="fa-solid fa-map-marker-alt mr-1"></i>ŞEHİR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="recency"><i class="fa-solid fa-clock mr-1"></i>SON GÜNCELLEME <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİ</th>
        </tr>`;

        // Akıllı sıralama uygula
        const sortKey = refineSort.by;
        const sortDir = refineSort.dir;
        
        refineData.sort((a, b) => {
            let valA, valB;
            
            if (sortKey === 'profit') {
                // Süper kâr: hem focus'suz hem focus'lu kârı değerlendir
                valA = a.profitNoFocus > 0 ? a.profitNoFocus + a.profitFocus : a.profitNoFocus;
                valB = b.profitNoFocus > 0 ? b.profitNoFocus + b.profitFocus : b.profitNoFocus;
            } else if (sortKey === 'rawCost') {
                valA = a.rawCost;
                valB = b.rawCost;
            } else if (sortKey === 'profitNoFocus') {
                valA = a.profitNoFocus;
                valB = b.profitNoFocus;
            } else if (sortKey === 'profitFocus') {
                valA = a.profitFocus;
                valB = b.profitFocus;
            } else if (sortKey === 'roi') {
                valA = (a.profitNoFocus / a.rawCost) * 100;
                valB = (b.profitNoFocus / b.rawCost) * 100;
            } else if (sortKey === 'city') {
                valA = a.bestCity;
                valB = b.bestCity;
                return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else if (sortKey === 'recency') {
                valA = a.recency || 999999;
                valB = b.recency || 999999;
            } else {
                valA = a.profitNoFocus;
                valB = b.profitNoFocus;
            }
            
            return sortDir === 'asc' ? valA - valB : valB - valA;
        });

        tbody.innerHTML = refineData.map(item => {
            const roiNoFocus = ((item.profitNoFocus / item.rawCost) * 100).toFixed(0);
            const roiFocus = ((item.profitFocus / item.rawCost) * 100).toFixed(0);
            
            let tipHtml = '';
            if (item.profitNoFocus > 3000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>SÜPER KÂR!</div>
                    <div class="text-gray-300 text-[10px]">Hemen al, refine et, sat!</div>
                </div>`;
            } else if (item.profitNoFocus > 1000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check mr-1"></i>İYİ KÂR</div>
                    <div class="text-gray-300 text-[10px]">Focus ile daha fazla kazan!</div>
                </div>`;
            } else if (item.profitFocus > 1000) {
                tipHtml = `<div class="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                    <div class="text-purple-400 font-semibold text-xs mb-1"><i class="fa-solid fa-bolt mr-1"></i>FOCUS GEREKLİ</div>
                    <div class="text-gray-300 text-[10px]">Sadece Focus ile kârlı</div>
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-times-circle mr-1"></i>Kârsız</div>`;
            }
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(item.rawId) || ''}" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3">
                        <div>
                            <div class="font-bold text-white text-xs">${item.rawName}</div>
                            <div class="text-gray-500 text-[9px]">→ ${item.processedName}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-bold text-xs">${item.rawCost.toLocaleString()} 🥈</div>
                    <div class="text-gray-500 text-[9px]">(100 adet)</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-xs">${item.processedRevenue.toLocaleString()} 🥈</div>
                    <div class="text-gray-500 text-[9px]">(${item.yield} adet)</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black ${item.profitNoFocus > 0 ? 'text-yellow-400' : 'text-red-400'} text-base">
                        ${item.profitNoFocus > 0 ? '+' : ''}${item.profitNoFocus.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black text-green-400 text-base">
                        +${item.profitFocus.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-orange-400 font-bold text-xs">${roiNoFocus}%</div>
                    <div class="text-green-400 text-[9px]">Focus: ${roiFocus}%</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs"><i class="fa-solid fa-map-marker-alt mr-1"></i>${item.bestCity}</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <span class="font-mono font-bold text-xs ${item.recency < 30 ? 'text-green-400' : (item.recency < 120 ? 'text-yellow-400' : 'text-red-400')}">
                        <i class="fa-solid fa-clock mr-1"></i>${getTimeAgoStr(item.recency || 999999)}
                    </span>
                </td>
                <td class="p-3">
                    ${tipHtml}
                </td>
            </tr>`;
        }).join('');
    };
    
    // Refine tablosu sıralama
    document.querySelectorAll('#refineHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(refineSort.by === sortKey) { 
                refineSort.dir = refineSort.dir === 'asc' ? 'desc' : 'asc'; 
            } else { 
                refineSort.by = sortKey; 
                refineSort.dir = (sortKey === 'city' || sortKey === 'recency') ? 'asc' : 'desc'; 
            }
                
            // Sıralama ikonlarını güncelle
            document.querySelectorAll('#refineHeaders .fa-sort').forEach(icon => {
                icon.className = 'fa-solid fa-sort ml-1';
            });
            const activeIcon = th.querySelector('.fa-sort');
            if (activeIcon) {
                activeIcon.className = `fa-solid fa-sort-${refineSort.dir === 'asc' ? 'up' : 'down'} ml-1`;
            }
                
            renderRefineTable();
        });
    });
    
    document.getElementById('btnFetchRefine').addEventListener('click', async () => {
        const loading = document.getElementById('refineLoading');
        const resArea = document.getElementById('refineResultArea');
        
        resArea.classList.add('hidden');
        loading.classList.remove('hidden');
        refineData = [];
        
        try {
            const domain = getAlbionApiDomain();
            const rawMaterials = Object.keys(REFINE_MAPPING);
            const processedMaterials = Object.values(REFINE_MAPPING).map(m => m.processed);
            
            // Tüm ham ve işlenmiş malzemelerin fiyatlarını çek
            const allItems = [...rawMaterials, ...processedMaterials].map(m => `T6_${m}`).join(',');
            const locations = 'Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon,Arthur\'s Rest,Morgana\'s Rest,Merlyn\'s Rest';
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            let data = await fetchWithProxies(url);
            data = enforceDataFreshness(data);
            
            if (data && data.length > 0) {
                // Fiyatları grupla
                const prices = {};
                const timestamps = {};
                data.forEach(d => {
                    if (!prices[d.item_id]) prices[d.item_id] = {};
                    if (!timestamps[d.item_id]) timestamps[d.item_id] = {};
                    if (d.sell_price_min > 0) {
                        prices[d.item_id][d.city] = d.sell_price_min;
                        timestamps[d.item_id][d.city] = d.sell_price_min_date;
                    }
                });
                
                // Her refine işlemi için kâr hesapla
                for (const [rawId, mapping] of Object.entries(REFINE_MAPPING)) {
                    const fullRawId = `T6_${rawId}`;
                    const fullProcessedId = `T6_${mapping.processed}`;
                    
                    const rawPrices = prices[fullRawId] || {};
                    const processedPrices = prices[fullProcessedId] || {};
                    
                    // En ucuz ham malzeme şehrini bul
                    let bestRawCity = null;
                    let bestRawPrice = Infinity;
                    for (const [city, price] of Object.entries(rawPrices)) {
                        if (price < bestRawPrice) {
                            bestRawPrice = price;
                            bestRawCity = city;
                        }
                    }
                    
                    // En pahalı işlenmiş satış şehrini bul
                    let bestProcessedCity = null;
                    let bestProcessedPrice = 0;
                    for (const [city, price] of Object.entries(processedPrices)) {
                        if (price > bestProcessedPrice) {
                            bestProcessedPrice = price;
                            bestProcessedCity = city;
                        }
                    }
                    
                    if (bestRawPrice === Infinity || bestProcessedPrice === 0) continue;
                    
                    // 100 adet ham malzeme maliyeti
                    const rawCost = bestRawPrice * 100;
                    
                    // Focus'suz: 60 adet işlenmiş
                    const yieldNoFocus = 60;
                    const revenueNoFocus = bestProcessedPrice * yieldNoFocus;
                    const profitNoFocus = Math.floor(revenueNoFocus * 0.935) - rawCost; // %6.5 vergi
                    
                    // Focus'lu: 80 adet işlenmiş
                    const yieldFocus = 80;
                    const revenueFocus = bestProcessedPrice * yieldFocus;
                    const profitFocus = Math.floor(revenueFocus * 0.935) - rawCost;
                    
                    refineData.push({
                        rawId: fullRawId,
                        rawName: ARB_CATEGORIES['Gather'].find(g => g.id === rawId)?.name || rawId,
                        processedName: ARB_CATEGORIES['Gather'].find(g => g.id === mapping.processed)?.name || mapping.processed,
                        rawCost,
                        processedRevenue: revenueNoFocus,
                        yield: yieldNoFocus,
                        profitNoFocus,
                        profitFocus,
                        bestCity: bestRawCity,
                        sellCity: bestProcessedCity,
                        recency: getMins(timestamps[fullRawId]?.[bestRawCity])
                    });
                }
            }
            
            renderRefineTable();
            resArea.classList.remove('hidden');
        } catch (e) {
            console.error('Refine hesaplama hatası:', e);
            document.getElementById('refineTableBody').innerHTML = `<tr><td colspan="8" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === SEKME 5: SATIŞ İSTATİSTİKLERİ ===
    const renderStatsTable = () => {
        const tbody = document.getElementById('statsTableBody');
        const thead = document.getElementById('statsHeaders');
        if(!tbody || !thead) return;

        if (statsData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamadı.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-white" data-sort="sold"><i class="fa-solid fa-fire mr-1"></i>SATILAN ADET <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase cursor-pointer hover:text-white" data-sort="revenue"><i class="fa-solid fa-coins mr-1"></i>TOPLAM GELİR <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase cursor-pointer hover:text-white" data-sort="avgPrice"><i class="fa-solid fa-chart-line mr-1"></i>ORTALAMA FİYAT <i class="fa-solid fa-sort ml-1"></i></th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase">EN DÜŞÜK</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase">EN YÜKSEK</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">TREND</th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİSİ</th>
        </tr>`;

        // Sıralama uygula
        const sortKey = statsFilters.sort;
        statsData.sort((a, b) => {
            if (sortKey === 'sold') return b.soldCount - a.soldCount;
            if (sortKey === 'revenue') return b.totalRevenue - a.totalRevenue;
            if (sortKey === 'avgPrice') return b.avgPrice - a.avgPrice;
            return 0;
        });

        tbody.innerHTML = statsData.map((item, index) => {
            // Trend hesapla
            let trendHtml = '';
            if (item.soldCount > 100) {
                trendHtml = `<span class="text-green-400 font-bold"><i class="fa-solid fa-arrow-trend-up mr-1"></i>YÜKSEK</span>`;
            } else if (item.soldCount > 50) {
                trendHtml = `<span class="text-blue-400 font-semibold"><i class="fa-solid fa-arrow-right mr-1"></i>ORTA</span>`;
            } else {
                trendHtml = `<span class="text-gray-400"><i class="fa-solid fa-arrow-trend-down mr-1"></i>DÜŞÜK</span>`;
            }
            
            // AI Önerisi oluştur
            let aiTipHtml = '';
            const revenuePerUnit = item.totalRevenue / item.soldCount;
            
            if (item.soldCount > 100 && item.avgPrice > 5000) {
                aiTipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>ÇOK SATAN!</div>
                    <div class="text-gray-300 text-[10px]">Yüksek talep + yüksek fiyat</div>
                    <div class="text-green-400 text-[9px] mt-1">→ Bu eşyayı stokla!</div>
                </div>`;
            } else if (item.soldCount > 100 && item.avgPrice <= 5000) {
                aiTipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-chart-line mr-1"></i>HACIM KÂRI</div>
                    <div class="text-gray-300 text-[10px]">Çok satıyor, düşük fiyat</div>
                    <div class="text-blue-400 text-[9px] mt-1">→ Bulk al, hızlı sat!</div>
                </div>`;
            } else if (item.soldCount <= 100 && item.avgPrice > 10000) {
                aiTipHtml = `<div class="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                    <div class="text-purple-400 font-semibold text-xs mb-1"><i class="fa-solid fa-gem mr-1"></i>PREMIUM</div>
                    <div class="text-gray-300 text-[10px]">Az satan, yüksek fiyat</div>
                    <div class="text-purple-400 text-[9px] mt-1">→ Lüks pazar fırsatı</div>
                </div>`;
            } else if (item.totalRevenue > 500000) {
                aiTipHtml = `<div class="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                    <div class="text-amber-400 font-semibold text-xs mb-1"><i class="fa-solid fa-sack-dollar mr-1"></i>YÜKSEK GELİR</div>
                    <div class="text-gray-300 text-[10px]">Toplam gelir yüksek</div>
                    <div class="text-amber-400 text-[9px] mt-1">→ Güvenilir yatırım</div>
                </div>`;
            } else {
                aiTipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-info-circle mr-1"></i>Normal performans</div>`;
            }
            
            // Popülerlik rozeti
            let badge = '';
            if (index === 0) badge = `<span class="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[8px] font-black ml-2">#1 BEST</span>`;
            else if (index < 3) badge = `<span class="bg-gray-400/20 text-gray-300 border border-gray-400/30 px-1.5 py-0.5 rounded text-[8px] font-bold ml-2">TOP ${index + 1}</span>`;
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(item.itemId) || ''}" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3">
                        <div>
                            <div class="font-bold text-white text-xs">${item.itemName}${badge}</div>
                            <div class="text-gray-500 text-[9px]">${item.category}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-base">${item.soldCount.toLocaleString()}</div>
                    <div class="text-gray-500 text-[9px]">adet</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-bold text-sm">${item.totalRevenue.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-yellow-400 font-bold text-xs">${item.avgPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs">${item.minPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-red-400 font-semibold text-xs">${item.maxPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    ${trendHtml}
                </td>
                <td class="p-3">
                    ${aiTipHtml}
                </td>
            </tr>`;
        }).join('');
    };

    // Satış İstatistikleri sıralama
    document.querySelectorAll('#statsHeaders th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort');
            if(statsFilters.sort === sortKey) { 
                // Aynı sütuna tıklandı, yön değiştir
                // Ama şimdilik sadece azalan destekliyoruz
            } else { 
                statsFilters.sort = sortKey;
            }
            
            // Sıralama ikonlarını güncelle
            document.querySelectorAll('#statsHeaders .fa-sort').forEach(icon => {
                icon.className = 'fa-solid fa-sort ml-1';
            });
            const activeIcon = th.querySelector('.fa-sort');
            if (activeIcon) {
                // Varsayılan olarak azalan
                activeIcon.className = 'fa-solid fa-sort-down ml-1';
            }
            
            // Select'i de güncelle
            document.getElementById('statsSort').value = sortKey;
            
            renderStatsTable();
        });
    });

    const updateStatsSummary = () => {
        const totalSold = statsData.reduce((sum, item) => sum + item.soldCount, 0);
        const totalRevenue = statsData.reduce((sum, item) => sum + item.totalRevenue, 0);
        const avgPrice = statsData.length > 0 ? statsData.reduce((sum, item) => sum + item.avgPrice, 0) / statsData.length : 0;
        const topItem = statsData.length > 0 ? statsData[0].itemName : '-';
        
        document.getElementById('statsTotalSold').textContent = totalSold.toLocaleString();
        document.getElementById('statsTotalRevenue').textContent = totalRevenue.toLocaleString() + ' 🥈';
        document.getElementById('statsAvgPrice').textContent = Math.floor(avgPrice).toLocaleString() + ' 🥈';
        document.getElementById('statsTopItem').textContent = topItem;
    };

    document.getElementById('btnFetchStats').addEventListener('click', async () => {
        const loading = document.getElementById('statsLoading');
        const resArea = document.getElementById('statsResultArea');
        const summaryCards = document.getElementById('statsSummaryCards');
        
        resArea.classList.add('hidden');
        summaryCards.classList.add('hidden');
        loading.classList.remove('hidden');
        statsData = [];
        
        // Filtreleri güncelle
        statsFilters.timeRange = document.getElementById('statsTimeRange').value;
        statsFilters.category = document.getElementById('statsCategory').value;
        statsFilters.sort = document.getElementById('statsSort').value;
        
        try {
            const domain = getAlbionApiDomain();
            
            // İstatistik API'si (Albion Data Project)
            // Not: Bu API tarih bazlı satış verisi sağlamaz, bu yüzden prices API kullanacağız
            const allItems = Object.values(ARB_CATEGORIES)
                .flat()
                .filter(item => !["QUESTITEM_TOKEN_SIPHONED_ENERGY", "QUESTITEM_TOKEN_AVALON", "QUESTITEM_TOKEN_ROYAL", 
                         "RUNE", "SOUL", "RELIC", "SHARD_AVALONIAN", "ESSENCE"].includes(item.id))
                .slice(0, 50) // İlk 50 eşya (API limiti)
                .map(item => `T6_${item.id}`)
                .join(',');
            
            const locations = 'Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon';
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            let data = await fetchWithProxies(url);
            data = enforceDataFreshness(data);
            
            if (data && data.length > 0) {
                // Grupla ve analiz et
                const grouped = {};
                data.forEach(d => {
                    if (!grouped[d.item_id]) {
                        grouped[d.item_id] = { 
                            prices: [], 
                            cities: new Set(),
                            itemId: d.item_id
                        };
                    }
                    if (d.sell_price_min > 0) {
                        grouped[d.item_id].prices.push(d.sell_price_min);
                        grouped[d.item_id].cities.add(d.city);
                    }
                });
                
                // Her eşya için istatistik
                for (const [itemId, info] of Object.entries(grouped)) {
                    if (info.prices.length === 0) continue;
                    
                    const sorted = info.prices.sort((a, b) => a - b);
                    const totalRevenue = sorted.reduce((sum, p) => sum + p, 0);
                    const avgPrice = Math.floor(totalRevenue / sorted.length);
                    
                    // Kategori bul
                    const baseId = itemId.replace('T6_', '');
                    let category = 'Diğer';
                    for (const [catName, items] of Object.entries(ARB_CATEGORIES)) {
                        if (items.find(i => i.id === baseId)) {
                            category = catName;
                            break;
                        }
                    }
                    
                    // Filtre uygula
                    if (statsFilters.category !== 'ALL') {
                        const filterMap = {
                            'Weapons': 'Silahlar',
                            'Armor': 'Zırhlar',
                            'Gather': 'Gather',
                            'Consumables': 'Sarf'
                        };
                        if (!category.includes(filterMap[statsFilters.category])) continue;
                    }
                    
                    // Satış adedi tahmini (şehir sayısı * 10 baz alındı)
                    const estimatedSold = info.cities.size * 10;
                    
                    statsData.push({
                        itemId,
                        itemName: ARB_CATEGORIES[category]?.find(i => i.id === baseId)?.name || baseId,
                        category,
                        soldCount: estimatedSold,
                        totalRevenue,
                        avgPrice,
                        minPrice: sorted[0],
                        maxPrice: sorted[sorted.length - 1]
                    });
                }
            }
            
            renderStatsTable();
            updateStatsSummary();
            resArea.classList.remove('hidden');
            summaryCards.classList.remove('hidden');
        } catch (e) {
            console.error('İstatistik hatası:', e);
            document.getElementById('statsTableBody').innerHTML = `<tr><td colspan="7" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // === SEKME 6: CRAFT HESAPLAYICI ===
    const renderCraftTable = () => {
        const tbody = document.getElementById('craftTableBody');
        const thead = document.getElementById('craftHeaders');
        if(!tbody || !thead) return;

        if (craftData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center p-8 text-gray-500"><i class="fa-solid fa-ghost text-2xl mb-2 opacity-50"></i><br>Veri bulunamadı.</td></tr>`;
            return;
        }

        thead.innerHTML = `<tr class="border-b border-gray-700 bg-gray-800/50">
            <th class="p-3 text-left text-xs font-bold text-gray-400 uppercase">CRAFT EDİLECEK EŞYA</th>
            <th class="p-3 text-xs font-bold text-red-400 uppercase">MALZEME MALİYETİ</th>
            <th class="p-3 text-xs font-bold text-blue-400 uppercase">SATIŞ FİYATI</th>
            <th class="p-3 text-xs font-bold text-yellow-400 uppercase">NET KÂR</th>
            <th class="p-3 text-xs font-bold text-orange-400 uppercase">ROI</th>
            <th class="p-3 text-xs font-bold text-green-400 uppercase">CRAFT SÜRESİ</th>
            <th class="p-3 text-xs font-bold text-purple-400 uppercase">EN İYİ ŞEHİR</th>
            <th class="p-3 text-xs font-bold text-cyan-400 uppercase">AI ÖNERİ</th>
        </tr>`;

        craftData.sort((a, b) => b.profit - a.profit);

        tbody.innerHTML = craftData.map(item => {
            const roi = ((item.profit / item.materialCost) * 100).toFixed(0);
            const craftMinutes = Math.floor(item.craftTime / 60);
            
            let tipHtml = '';
            if (item.profit > 10000) {
                tipHtml = `<div class="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <div class="text-green-400 font-bold text-xs mb-1"><i class="fa-solid fa-fire mr-1"></i>MÜKEMMEL!</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Craft et, sat!</div>
                    <div class="text-gray-400 text-[9px] mt-1">+Craft Puanı</div>
                </div>`;
            } else if (item.profit > 5000) {
                tipHtml = `<div class="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <div class="text-blue-400 font-semibold text-xs mb-1"><i class="fa-solid fa-check mr-1"></i>İYİ KÂR</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Değerlendir</div>
                </div>`;
            } else if (item.profit > 0) {
                tipHtml = `<div class="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                    <div class="text-amber-400 font-semibold text-xs mb-1"><i class="fa-solid fa-info-circle mr-1"></i>DÜŞÜK KÂR</div>
                    <div class="text-gray-300 text-[10px]">ROI: ${roi}% → Sadece focus ile</div>
                </div>`;
            } else {
                tipHtml = `<div class="text-gray-500 text-[10px]"><i class="fa-solid fa-times-circle mr-1"></i>KÂRSIZ</div>`;
            }
            
            return `<tr class="hover:bg-white/5 transition-colors border-b border-gray-700/50">
                <td class="p-3 border-r border-gray-800/50">
                    <div class="flex items-center">
                        <img loading="lazy" data-image-fallback="item" src="${window.ItemCard?.image?.(item.itemId) || ''}" class="w-10 h-10 bg-[#0a0d14] rounded border border-gray-700 p-0.5 mr-3">
                        <div>
                            <div class="font-bold text-white text-xs">${item.itemName}</div>
                            <div class="text-gray-500 text-[9px]">${item.materialCount} malzeme</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-red-400 font-bold text-xs">${item.materialCost.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-blue-400 font-bold text-xs">${item.sellPrice.toLocaleString()} 🥈</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="font-black ${item.profit > 0 ? 'text-yellow-400' : 'text-red-400'} text-base">
                        ${item.profit > 0 ? '+' : ''}${item.profit.toLocaleString()} 🥈
                    </div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-orange-400 font-bold text-xs">${roi}%</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-green-400 font-semibold text-xs"><i class="fa-solid fa-clock mr-1"></i>${craftMinutes}dk</div>
                </td>
                <td class="p-3 border-r border-gray-800/50">
                    <div class="text-purple-400 font-semibold text-xs"><i class="fa-solid fa-map-marker-alt mr-1"></i>${item.bestCity}</div>
                </td>
                <td class="p-3">
                    ${tipHtml}
                </td>
            </tr>`;
        }).join('');
    };

    document.getElementById('btnFetchCraft').addEventListener('click', async () => {
        const loading = document.getElementById('craftLoading');
        const resArea = document.getElementById('craftResultArea');
        
        resArea.classList.add('hidden');
        loading.classList.remove('hidden');
        craftData = [];
        
        try {
            const domain = getAlbionApiDomain();
            
            // Tüm craft edilecek eşyalar ve malzemeler
            const craftedItems = Object.keys(CRAFT_MAPPING);
            const allMaterials = new Set();
            Object.values(CRAFT_MAPPING).forEach(craft => {
                Object.keys(craft.materials).forEach(mat => allMaterials.add(mat));
            });
            
            const allItems = [...craftedItems, ...Array.from(allMaterials)].join(',');
            const locations = 'Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford,Caerleon,Arthur\'s Rest,Morgana\'s Rest,Merlyn\'s Rest';
            const url = `https://${domain}/api/v2/stats/prices/${allItems}.json?locations=${locations}`;
            
            let data = await fetchWithProxies(url);
            data = enforceDataFreshness(data);
            
            if (data && data.length > 0) {
                // Fiyatları grupla
                const prices = {};
                data.forEach(d => {
                    if (!prices[d.item_id]) prices[d.item_id] = {};
                    if (d.sell_price_min > 0) {
                        prices[d.item_id][d.city] = d.sell_price_min;
                    }
                });
                
                // Her craft işlemi için kâr hesapla
                for (const [itemId, craftInfo] of Object.entries(CRAFT_MAPPING)) {
                    // Malzeme maliyetini hesapla
                    let totalMaterialCost = 0;
                    let materialCount = 0;
                    let allMaterialsFound = true;
                    
                    for (const [matId, matQty] of Object.entries(craftInfo.materials)) {
                        const matPrices = prices[matId] || {};
                        const matValues = Object.values(matPrices);
                        if (matValues.length === 0) {
                            allMaterialsFound = false;
                            break;
                        }
                        const avgMatPrice = matValues.reduce((a, b) => a + b, 0) / matValues.length;
                        totalMaterialCost += avgMatPrice * matQty;
                        materialCount += matQty;
                    }
                    
                    if (!allMaterialsFound || totalMaterialCost === 0) continue;
                    
                    // Satış fiyatını bul (en yüksek)
                    const sellPrices = prices[itemId] || {};
                    const sellValues = Object.values(sellPrices);
                    if (sellValues.length === 0) continue;
                    
                    const bestSellPrice = Math.max(...sellValues);
                    const bestCity = Object.keys(sellPrices).find(city => prices[itemId][city] === bestSellPrice);
                    
                    // Kâr hesapla (vergi dahil)
                    const profit = Math.floor(bestSellPrice * 0.935) - totalMaterialCost;
                    
                    craftData.push({
                        itemId,
                        itemName: ARB_CATEGORIES['Silahlar (Weapons)']?.find(i => i.id === itemId.replace('T6_', ''))?.name ||
                                 ARB_CATEGORIES['Zırhlar (Armor)']?.find(i => i.id === itemId.replace('T6_', ''))?.name ||
                                 ARB_CATEGORIES['Aksesuarlar (Accessories)']?.find(i => i.id === itemId.replace('T6_', ''))?.name ||
                                 itemId.replace('T6_', ''),
                        materialCost: Math.floor(totalMaterialCost),
                        sellPrice: bestSellPrice,
                        profit,
                        craftTime: craftInfo.craftTime,
                        materialCount,
                        bestCity: bestCity || 'Bilinmiyor'
                    });
                }
            }
            
            renderCraftTable();
            resArea.classList.remove('hidden');
        } catch (e) {
            console.error('Craft hesaplama hatası:', e);
            document.getElementById('craftTableBody').innerHTML = `<tr><td colspan="8" class="text-center p-8 text-red-400">Veri çekilemedi.</td></tr>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Otomatik İlk Çalıştırma
    setTimeout(() => {
        const fetchOpp = document.getElementById('btnFetchOpp');
        if(fetchOpp) fetchOpp.click();
    }, 1000);
    
    console.log('✅ Arbitrage modülü yüklendi!');
}

// Sayfa yüklendiğinde otomatik çalıştır
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadArbitrageModule);
} else {
  loadArbitrageModule();
}