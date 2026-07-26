/* Shared market item filters and ID generation for the arbitrage surfaces. */
(function () {
  const TIER_VALUES = [4, 5, 6, 7, 8];
  const ENCHANT_VALUES = [0, 1, 2, 3, 4];
  const ENCHANTLESS = new Set([
    'QUESTITEM_TOKEN_ROYAL', 'RUNE', 'SOUL', 'RELIC',
    'SHARD_AVALONIAN', 'ESSENCE'
  ]);
  const TIERLESS = new Set([
    'QUESTITEM_TOKEN_SIPHONED_ENERGY', 'QUESTITEM_TOKEN_AVALON'
  ]);

  const valuesFor = (value, allValues) => value === 'ALL'
    ? allValues
    : [Number.parseInt(value, 10)].filter(Number.isFinite);

  function generateItemIds(baseItem, tierOption = 'ALL', enchantOption = 'ALL') {
    if (TIERLESS.has(baseItem)) return [baseItem];
    const tiers = valuesFor(tierOption, TIER_VALUES);
    if (ENCHANTLESS.has(baseItem)) return tiers.map((tier) => `T${tier}_${baseItem}`);
    const enchants = valuesFor(enchantOption, ENCHANT_VALUES);
    return tiers.flatMap((tier) => enchants.map((enchant) => {
      const suffix = enchant === 0 ? '' : `@${enchant}`;
      return `T${tier}_${baseItem}${suffix}`;
    }));
  }

  function getItemsToFetch(baseItems, tierOption = 'ALL', enchantOption = 'ALL') {
    return [...new Set(baseItems.flatMap((item) => generateItemIds(item, tierOption, enchantOption)))];
  }

  function optionMarkup(prefix = '') {
    return `${prefix}<option value="ALL">Tüm Enchantlar (Hepsi)</option>${ENCHANT_VALUES
      .map((value) => `<option value="${value}">${value === 0 ? 'Enchant 0' : `Enchant ${value} (.${value})`}</option>`)
      .join('')}`;
  }

  window.ArbFilters = {
    TIER_VALUES,
    ENCHANT_VALUES,
    generateItemIds,
    getItemsToFetch,
    optionMarkup
  };
})();
