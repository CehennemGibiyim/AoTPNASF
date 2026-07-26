/* Mini Oyunlar - Fiyat Tahmin Et ve Albion Trivia */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const TRIVIA_QUESTIONS = [
    { q: 'Albion Online hangi yıl çıktı?', options: ['2015', '2016', '2017', '2018'], correct: 2 },
    { q: 'Kaç tane royal şehir var?', options: ['4', '5', '6', '7'], correct: 2 },
    { q: 'Caerleon hangi biyomda bulunur?', options: ['Orman', 'Çöl', 'Bozkır', 'Merkez/ Hepsi'], correct: 3 },
    { q: 'En yüksek tier kaç?', options: ['T6', 'T7', 'T8', 'T9'], correct: 2 },
    { q: 'Avalon Roads hangi güncelleme ile geldi?', options: ['Queen', 'Rise of Avalon', 'Lands Awakened', 'Beyond the Veil'], correct: 1 },
    { q: 'Hangi kaynak toplama aracı deri için kullanılır?', options: ['Pickaxe', 'Skinning Knife', 'Sickle', 'Axe'], correct: 1 },
    { q: 'Bir T8.3 eşya için kaç enchant gerekir?', options: ['1', '2', '3', '4'], correct: 2 },
    { q: 'Hangisi bir tank silahıdır?', options: ['Dagger', 'Mace', 'Fire Staff', 'Crossbow'], correct: 1 },
    { q: 'Thetford hangi biyomdadır?', options: ['Dağ', 'Bataklık', 'Bozkır', 'Çöl'], correct: 2 },
    { q: 'Premium ile fame bonusu ne kadardır?', options: ['%25', '%50', '%75', '%100'], correct: 1 },
    { q: 'Hellgate kaç kişiliktir?', options: ['1v1', '2v2', '5v5', 'Hepsi'], correct: 3 },
    { q: 'En pahalı mount hangisidir?', options: ['Command Mammoth', 'Gold Eagle', 'Spectral Boar', 'Frost Ram'], correct: 0 },
    { q: 'Hangisi bir healer silahıdır?', options: ['Claymore', 'Holy Staff', 'Cursed Staff', 'Quarterstaff'], correct: 1 },
    { q: 'ZvZ ne demektir?', options: ['Zone vs Zone', 'Zerg vs Zerg', 'Zero vs Zero', 'Zoom vs Zoom'], correct: 1 },
    { q: 'Laborer sistemi ne işe yarar?', options: ['PvP', 'Kaynak toplama', 'Pasif gelir', 'Crafting bonus'], correct: 2 }
  ];

  // Gerçekçi fiyat simülasyonu için item listesi
  const PRICE_ITEMS = [
    { name: 'T8.3 Elder\'s Greatstaff', basePrice: 2500000, volatility: 0.15 },
    { name: 'T7.2 Grandmaster\'s Chest', basePrice: 850000, volatility: 0.12 },
    { name: 'T6.1 Elder\'s Helm', basePrice: 180000, volatility: 0.10 },
    { name: 'T8.0 Elder\'s Robe', basePrice: 900000, volatility: 0.14 },
    { name: 'T5.3 Expert\'s Boots', basePrice: 350000, volatility: 0.13 },
    { name: 'T8.2 Bear Paws', basePrice: 3200000, volatility: 0.18 },
    { name: 'T7.3 Deathgivers', basePrice: 2800000, volatility: 0.20 },
    { name: 'T6.2 Bloodletter', basePrice: 650000, volatility: 0.11 },
    { name: 'T8.1 Permafrost Prism', basePrice: 1800000, volatility: 0.16 },
    { name: 'T7.0 Wildfire Staff', basePrice: 480000, volatility: 0.09 }
  ];

  function generatePriceGame() {
    const item = PRICE_ITEMS[Math.floor(Math.random() * PRICE_ITEMS.length)];
    const actualPrice = Math.round(item.basePrice * (1 + (Math.random() - 0.5) * item.volatility * 2));
    
    // Generate 4 options with one close to actual
    const options = new Set();
    options.add(actualPrice);
    
    while (options.size < 4) {
      const variation = 0.7 + Math.random() * 0.6;
      const option = Math.round(actualPrice * variation / 5000) * 5000;
      if (option > 10000 && option < actualPrice * 2.5) options.add(option);
    }
    
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    
    return {
      item: item.name,
      actualPrice,
      options: shuffledOptions,
      correctIndex: shuffledOptions.indexOf(actualPrice)
    };
  }

  function formatSilver(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  }

  function render(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="mini-games max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-gamepad mr-2 text-albion-accent"></i>Mini Oyunlar</h2>
          <p class="text-gray-400">Fiyat tahmin et, bilgini test et, eğlen!</p>
        </div>

        <!-- Game Tabs -->
        <div class="flex gap-2 mb-6 bg-albion-800 p-2 rounded-lg border border-gray-700">
          <button id="gameTabPrice" class="flex-1 px-4 py-2 bg-albion-accent text-black font-bold rounded shadow-md transition-colors">
            <i class="fa-solid fa-coins mr-2"></i>Fiyat Tahmin Et
          </button>
          <button id="gameTabTrivia" class="flex-1 px-4 py-2 bg-transparent text-gray-400 hover:text-white font-bold rounded transition-colors">
            <i class="fa-solid fa-brain mr-2"></i>Albion Trivia
          </button>
        </div>

        <!-- Price Game -->
        <div id="gamePricePanel" class="flex-1">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-6 text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">💰 Fiyat Tahmin Oyunu</div>
            <p class="text-sm text-gray-300 mb-6">Bu eşyanın şu anki piyasa fiyatı nedir?</p>
            <div id="priceGameContent"></div>
            <div id="priceGameScore" class="mt-4 flex items-center justify-center gap-2">
              <span class="text-sm text-gray-400">Skor:</span>
              <span id="priceScore" class="text-xl font-black text-albion-accent">0</span>
              <span class="text-sm text-gray-400">| Seri:</span>
              <span id="priceStreak" class="text-lg font-bold text-green-400">0</span>
            </div>
          </div>
        </div>

        <!-- Trivia Game -->
        <div id="gameTriviaPanel" class="hidden flex-1">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-6 text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-2">🧠 Albion Bilgi Yarışması</div>
            <div id="triviaGameContent"></div>
            <div id="triviaGameScore" class="mt-4 flex items-center justify-center gap-2">
              <span class="text-sm text-gray-400">Doğru:</span>
              <span id="triviaCorrect" class="text-xl font-black text-green-400">0</span>
              <span class="text-sm text-gray-400">| Yanlış:</span>
              <span id="triviaWrong" class="text-xl font-black text-red-400">0</span>
            </div>
          </div>
        </div>
      </div>
    `;

    let priceScore = 0;
    let priceStreak = 0;
    let triviaCorrect = 0;
    let triviaWrong = 0;
    let currentPriceGame = null;
    let currentTriviaQ = null;

    const pricePanel = container.querySelector('#gamePricePanel');
    const triviaPanel = container.querySelector('#gameTriviaPanel');
    const tabPrice = container.querySelector('#gameTabPrice');
    const tabTrivia = container.querySelector('#gameTabTrivia');

    tabPrice.addEventListener('click', () => {
      pricePanel.classList.remove('hidden');
      triviaPanel.classList.add('hidden');
      tabPrice.classList.add('bg-albion-accent', 'text-black');
      tabPrice.classList.remove('bg-transparent', 'text-gray-400');
      tabTrivia.classList.remove('bg-albion-accent', 'text-black');
      tabTrivia.classList.add('bg-transparent', 'text-gray-400');
      if (!currentPriceGame) newPriceRound();
    });

    tabTrivia.addEventListener('click', () => {
      triviaPanel.classList.remove('hidden');
      pricePanel.classList.add('hidden');
      tabTrivia.classList.add('bg-albion-accent', 'text-black');
      tabTrivia.classList.remove('bg-transparent', 'text-gray-400');
      tabPrice.classList.remove('bg-albion-accent', 'text-black');
      tabPrice.classList.add('bg-transparent', 'text-gray-400');
      if (!currentTriviaQ) newTriviaRound();
    });

    function newPriceRound() {
      currentPriceGame = generatePriceGame();
      const content = container.querySelector('#priceGameContent');
      
      content.innerHTML = `
        <div class="text-2xl font-black text-white mb-6">${currentPriceGame.item}</div>
        <div class="grid grid-cols-2 gap-3 max-w-md mx-auto">
          ${currentPriceGame.options.map((opt, i) => `
            <button class="price-option bg-albion-900 hover:bg-albion-700 border border-gray-600 hover:border-albion-accent rounded-xl p-4 text-lg font-bold text-white transition-all" data-index="${i}">
              ${formatSilver(opt)}
            </button>
          `).join('')}
        </div>
        <div id="priceFeedback" class="mt-4 text-sm font-bold min-h-[24px]"></div>
      `;

      content.querySelectorAll('.price-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIndex = parseInt(btn.dataset.index);
          const feedback = container.querySelector('#priceFeedback');
          const isCorrect = selectedIndex === currentPriceGame.correctIndex;

          content.querySelectorAll('.price-option').forEach(b => {
            b.disabled = true;
            if (parseInt(b.dataset.index) === currentPriceGame.correctIndex) {
              b.classList.add('bg-green-600', 'border-green-400', 'text-white');
            }
          });

          if (isCorrect) {
            priceScore += 10 + priceStreak * 2;
            priceStreak++;
            feedback.innerHTML = `<span class="text-green-400">✅ Doğru! +${10 + (priceStreak - 1) * 2} puan | Seri: ${priceStreak}🔥</span>`;
          } else {
            priceStreak = 0;
            feedback.innerHTML = `<span class="text-red-400">❌ Yanlış! Doğru fiyat: ${formatSilver(currentPriceGame.actualPrice)}</span>`;
          }

          container.querySelector('#priceScore').textContent = priceScore;
          container.querySelector('#priceStreak').textContent = priceStreak;

          setTimeout(newPriceRound, 1500);
        });
      });
    }

    function newTriviaRound() {
      currentTriviaQ = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
      const content = container.querySelector('#triviaGameContent');

      content.innerHTML = `
        <div class="text-xl font-bold text-white mb-6">${currentTriviaQ.q}</div>
        <div class="grid grid-cols-2 gap-3 max-w-md mx-auto">
          ${currentTriviaQ.options.map((opt, i) => `
            <button class="trivia-option bg-albion-900 hover:bg-albion-700 border border-gray-600 hover:border-albion-accent rounded-xl p-4 text-base font-bold text-white transition-all" data-index="${i}">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="triviaFeedback" class="mt-4 text-sm font-bold min-h-[24px]"></div>
      `;

      content.querySelectorAll('.trivia-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIndex = parseInt(btn.dataset.index);
          const feedback = container.querySelector('#triviaFeedback');
          const isCorrect = selectedIndex === currentTriviaQ.correct;

          content.querySelectorAll('.trivia-option').forEach(b => {
            b.disabled = true;
            if (parseInt(b.dataset.index) === currentTriviaQ.correct) {
              b.classList.add('bg-green-600', 'border-green-400', 'text-white');
            }
          });

          if (isCorrect) {
            triviaCorrect++;
            feedback.innerHTML = '<span class="text-green-400">✅ Doğru cevap! Harikasın!</span>';
          } else {
            triviaWrong++;
            feedback.innerHTML = `<span class="text-red-400">❌ Yanlış! Doğru: ${currentTriviaQ.options[currentTriviaQ.correct]}</span>`;
          }

          container.querySelector('#triviaCorrect').textContent = triviaCorrect;
          container.querySelector('#triviaWrong').textContent = triviaWrong;

          setTimeout(newTriviaRound, 1800);
        });
      });
    }

    // Start with price game
    newPriceRound();
  }

  window.MiniGames = { render, generatePriceGame, TRIVIA_QUESTIONS, PRICE_ITEMS };
})();
