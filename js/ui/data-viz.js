/* Advanced Data Visualization - Heatmaps, trend analysis, market depth charts */
(function () {
  const t = (key, fallback) => {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (e) {}
    return fallback || key;
  };

  // Color scales
  const HEAT_COLORS = {
    profit: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560', '#fbbf24', '#4ade80'],
    volume: ['#0a0a1a', '#1a1a3e', '#2a2a5e', '#4a3a7e', '#6a4a9e', '#8a5abe', '#d4af37'],
    risk: ['#4ade80', '#a3e635', '#fbbf24', '#fb923c', '#f87171', '#ef4444', '#dc2626'],
    price: ['#0f172a', '#1e3a5f', '#2e5a8f', '#4e7abf', '#6e9aef', '#d4af37', '#fbbf24']
  };

  function getHeatColor(value, min, max, colorScale) {
    if (max === min) return colorScale[0];
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const index = Math.floor(ratio * (colorScale.length - 1));
    return colorScale[Math.min(index, colorScale.length - 1)];
  }

  // City arbitrage heatmap
  function renderCityHeatmap(container, data, type = 'profit') {
    if (!container) return;
    
    const cities = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford', 'Caerleon'];
    const colorScale = HEAT_COLORS[type] || HEAT_COLORS.profit;
    
    // Find min/max
    let minVal = Infinity, maxVal = -Infinity;
    const matrix = {};
    cities.forEach(buy => {
      matrix[buy] = {};
      cities.forEach(sell => {
        const val = data?.[buy]?.[sell] || 0;
        matrix[buy][sell] = val;
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      });
    });

    const cellSize = Math.min(60, Math.floor((container.clientWidth - 80) / cities.length));
    
    let html = `<div class="heatmap-container">
      <div class="heatmap-title">
        <i class="fa-solid fa-fire"></i> ${t('viz-heatmapTitle', 'Şehirler Arası Arbitraj Isı Haritası')}
        <span class="heatmap-subtitle">${t('viz-heatmapSubtitle', 'Satır: Alış, Sütun: Satış')}</span>
      </div>
      <div class="heatmap-legend">
        <span>${t('viz-low', 'Düşük')}</span>
        <div class="heatmap-legend-bar">${colorScale.map(c => `<span style="background:${c}"></span>`).join('')}</div>
        <span>${t('viz-high', 'Yüksek')}</span>
      </div>
      <div class="heatmap-grid" style="grid-template-columns: ${cellSize}px repeat(${cities.length}, 1fr)">
        <div class="heatmap-cell heatmap-label"></div>
        ${cities.map(c => `<div class="heatmap-cell heatmap-label heatmap-col-label">${c.substring(0,4)}</div>`).join('')}
        ${cities.map(buy => `
          <div class="heatmap-cell heatmap-label heatmap-row-label">${buy.substring(0,4)}</div>
          ${cities.map(sell => {
            const val = matrix[buy][sell];
            const color = buy === sell ? '#1a1d2e' : getHeatColor(val, minVal, maxVal, colorScale);
            return `<div class="heatmap-cell" style="background:${color}" title="${buy} → ${sell}: ${val.toLocaleString()} 🥈">
              <span class="heatmap-value">${val > 0 ? (val / 1000).toFixed(1) + 'K' : '-'}</span>
            </div>`;
          }).join('')}
        `).join('')}
      </div>
    </div>`;
    
    container.innerHTML = html;
  }

  // Market depth chart (bid/ask visualization)
  function renderDepthChart(canvas, bids, asks, currentPrice) {
    if (!canvas || typeof window.Chart !== 'function') return null;
    
    // Destroy existing
    try { window.Chart.getChart(canvas)?.destroy(); } catch (e) {}
    
    const bidPrices = bids.map(b => b.price).sort((a, b) => b - a);
    const askPrices = asks.map(a => a.price).sort((a, b) => a - b);
    const allPrices = [...bidPrices, ...askPrices];
    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;
    
    // Cumulative volume
    let cumBid = 0;
    const bidCumulative = bidPrices.map(p => {
      const b = bids.find(x => x.price === p);
      cumBid += b?.volume || 0;
      return { x: p, y: cumBid };
    });
    
    let cumAsk = 0;
    const askCumulative = askPrices.map(p => {
      const a = asks.find(x => x.price === p);
      cumAsk += a?.volume || 0;
      return { x: p, y: cumAsk };
    });

    return new window.Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: t('viz-bids', 'Alış (Bid)'),
            data: bidCumulative,
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74,222,128,0.15)',
            fill: true,
            showLine: true,
            pointRadius: 0,
            tension: 0.3,
            order: 1
          },
          {
            label: t('viz-asks', 'Satış (Ask)'),
            data: askCumulative,
            borderColor: '#f87171',
            backgroundColor: 'rgba(248,113,113,0.15)',
            fill: true,
            showLine: true,
            pointRadius: 0,
            tension: 0.3,
            order: 1
          },
          {
            label: t('viz-spread', 'Spread: {price}').replace('{price}', currentPrice?.toLocaleString() || '--'),
            data: [{ x: currentPrice, y: 0 }, { x: currentPrice, y: Math.max(cumBid, cumAsk) }],
            borderColor: '#d4af37',
            borderWidth: 2,
            borderDash: [5, 5],
            showLine: true,
            pointRadius: 0,
            fill: false,
            order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: minPrice,
            max: maxPrice,
            title: { display: true, text: t('viz-price', 'Fiyat (Silver)'), color: '#94a3b8' },
            ticks: { color: '#94a3b8', callback: v => (v / 1000).toFixed(0) + 'K' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            title: { display: true, text: t('viz-volume', 'Kümülatif Hacim'), color: '#94a3b8' },
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#94a3b8' } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()} 🥈 | Hacim: ${ctx.parsed.y.toLocaleString()}`
            }
          }
        }
      }
    });
  }

  // Price trend analyzer
  function analyzeTrend(prices) {
    if (!prices || prices.length < 3) return { direction: 'neutral', strength: 0, support: null, resistance: null };
    
    const values = prices.map(p => p.price || p);
    const n = values.length;
    
    // Simple linear regression
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    values.forEach((y, i) => {
      sumX += i;
      sumY += y;
      sumXY += i * y;
      sumX2 += i * i;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgPrice = sumY / n;
    const strength = Math.min(100, Math.abs(slope / avgPrice * 10000));
    
    // Support & resistance
    const sorted = [...values].sort((a, b) => a - b);
    const support = sorted[Math.floor(n * 0.1)];
    const resistance = sorted[Math.floor(n * 0.9)];
    
    // Volatility
    const variance = values.reduce((sum, v) => sum + (v - avgPrice) ** 2, 0) / n;
    const volatility = Math.sqrt(variance) / avgPrice * 100;
    
    return {
      direction: slope > 0.001 ? 'up' : slope < -0.001 ? 'down' : 'neutral',
      strength: Math.round(strength),
      support,
      resistance,
      volatility: Math.round(volatility * 10) / 10,
      slope,
      avgPrice
    };
  }

  function renderTrendPanel(container, trend) {
    if (!container) return;
    
    const dirIcon = trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️';
    const dirColor = trend.direction === 'up' ? '#4ade80' : trend.direction === 'down' ? '#f87171' : '#94a3b8';
    const dirText = trend.direction === 'up' ? t('viz-trendUp', 'Yükseliş') : trend.direction === 'down' ? t('viz-trendDown', 'Düşüş') : t('viz-trendNeutral', 'Yatay');
    
    container.innerHTML = `
      <div class="trend-panel">
        <div class="trend-header">
          <span class="trend-direction" style="color:${dirColor}">${dirIcon} ${dirText}</span>
          <span class="trend-strength">${t('viz-strength', 'Güç')}: ${trend.strength}%</span>
        </div>
        <div class="trend-metrics">
          <div class="trend-metric">
            <span class="trend-metric-label">${t('viz-support', 'Destek')}</span>
            <span class="trend-metric-value">${trend.support?.toLocaleString() || '--'} 🥈</span>
          </div>
          <div class="trend-metric">
            <span class="trend-metric-label">${t('viz-resistance', 'Direnç')}</span>
            <span class="trend-metric-value">${trend.resistance?.toLocaleString() || '--'} 🥈</span>
          </div>
          <div class="trend-metric">
            <span class="trend-metric-label">${t('viz-volatility', 'Oynaklık')}</span>
            <span class="trend-metric-value">%${trend.volatility}</span>
          </div>
          <div class="trend-metric">
            <span class="trend-metric-label">${t('viz-avg', 'Ortalama')}</span>
            <span class="trend-metric-value">${trend.avgPrice?.toLocaleString() || '--'} 🥈</span>
          </div>
        </div>
        <div class="trend-bar">
          <div class="trend-bar-fill ${trend.direction}" style="width:${trend.strength}%"></div>
        </div>
      </div>
    `;
  }

  // Item comparison radar chart
  function renderComparisonChart(canvas, items) {
    if (!canvas || typeof window.Chart !== 'function' || !items?.length) return null;
    
    try { window.Chart.getChart(canvas)?.destroy(); } catch (e) {}
    
    const labels = [t('viz-damage', 'Hasar'), t('viz-speed', 'Hız'), t('viz-defense', 'Savunma'), 
                    t('viz-utility', 'Fayda'), t('viz-cost', 'Maliyet'), t('viz-popularity', 'Popülerlik')];
    
    const colors = ['rgba(212,175,55,0.6)', 'rgba(74,222,128,0.6)', 'rgba(96,165,250,0.6)', 
                    'rgba(248,113,113,0.6)', 'rgba(192,132,252,0.6)'];
    
    return new window.Chart(canvas, {
      type: 'radar',
      data: {
        labels,
        datasets: items.map((item, i) => ({
          label: item.name,
          data: [
            item.damage || 50,
            item.speed || 50,
            item.defense || 50,
            item.utility || 50,
            100 - ((item.cost || 50) / 100 * 100),
            item.popularity || 50
          ],
          borderColor: colors[i % colors.length],
          backgroundColor: colors[i % colors.length].replace('0.6', '0.1'),
          borderWidth: 2,
          pointBackgroundColor: colors[i % colors.length]
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#94a3b8', font: { size: 11 } }
          }
        },
        plugins: {
          legend: { labels: { color: '#94a3b8', padding: 16 } }
        }
      }
    });
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('viz-styles')) return;
    const style = document.createElement('style');
    style.id = 'viz-styles';
    style.textContent = `
      .heatmap-container {
        background: #1a1d2e;
        border: 1px solid #2a2d3e;
        border-radius: 12px;
        padding: 16px;
        overflow-x: auto;
      }
      .heatmap-title {
        font-size: 15px;
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .heatmap-subtitle {
        font-size: 11px;
        color: #64748b;
        font-weight: 400;
        margin-left: auto;
      }
      .heatmap-legend {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 10px 0 14px;
        font-size: 10px;
        color: #64748b;
      }
      .heatmap-legend-bar {
        display: flex;
        flex: 1;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
      }
      .heatmap-legend-bar span {
        flex: 1;
      }
      .heatmap-grid {
        display: grid;
        gap: 2px;
      }
      .heatmap-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.15s;
        min-width: 40px;
      }
      .heatmap-cell:hover {
        transform: scale(1.1);
        z-index: 2;
      }
      .heatmap-label {
        background: transparent !important;
        color: #64748b;
        font-size: 10px;
        font-weight: 600;
        cursor: default;
      }
      .heatmap-label:hover {
        transform: none;
      }
      .heatmap-value {
        font-size: 10px;
        font-weight: 700;
        color: #f1f5f9;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
      .trend-panel {
        background: #1a1d2e;
        border: 1px solid #2a2d3e;
        border-radius: 12px;
        padding: 16px;
      }
      .trend-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .trend-direction {
        font-size: 18px;
        font-weight: 700;
      }
      .trend-strength {
        font-size: 12px;
        color: #94a3b8;
        background: #141726;
        padding: 4px 10px;
        border-radius: 20px;
      }
      .trend-metrics {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      .trend-metric {
        text-align: center;
        padding: 8px;
        background: #141726;
        border-radius: 8px;
      }
      .trend-metric-label {
        display: block;
        font-size: 10px;
        color: #64748b;
        margin-bottom: 4px;
        text-transform: uppercase;
      }
      .trend-metric-value {
        font-size: 14px;
        font-weight: 700;
        color: #f1f5f9;
      }
      .trend-bar {
        height: 6px;
        background: #141726;
        border-radius: 3px;
        overflow: hidden;
      }
      .trend-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.6s ease;
      }
      .trend-bar-fill.up { background: linear-gradient(90deg, #4ade80, #22c55e); }
      .trend-bar-fill.down { background: linear-gradient(90deg, #f87171, #ef4444); }
      .trend-bar-fill.neutral { background: linear-gradient(90deg, #94a3b8, #64748b); }
      @media (max-width: 480px) {
        .trend-metrics {
          grid-template-columns: repeat(2, 1fr);
        }
        .heatmap-value {
          font-size: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Init
  document.addEventListener('DOMContentLoaded', injectStyles);

  // Expose
  window.AlbionViz = {
    renderCityHeatmap,
    renderDepthChart,
    analyzeTrend,
    renderTrendPanel,
    renderComparisonChart,
    HEAT_COLORS
  };
})();
