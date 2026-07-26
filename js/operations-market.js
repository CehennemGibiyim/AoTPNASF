/* Shared, cached market adapter for operations surfaces. */
(function () {
  const cityList = ['Martlock', 'Bridgewatch', 'Fort Sterling', 'Lymhurst', 'Thetford', 'Caerleon', 'Brecilien'];
  async function prices(ids, city) { const domain = window.getAlbionApiDomain?.() || 'europe.albion-online-data.com'; const url = `https://${domain}/api/v2/stats/prices/${ids.map(encodeURIComponent).join(',')}.json?locations=${encodeURIComponent(city || cityList.join(','))}&qualities=1`; const loader = window.MarketRuntime?.fetch || window.fetchWithProxies; const rows = await loader?.(url); return Array.isArray(rows) ? rows : []; }
  window.AlbionOperationsMarket = { cityList, prices };
})();
