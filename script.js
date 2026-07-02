(() => {
  'use strict';

  /* ===== Material data ===== */
  const ICONS = {
    paper: `<path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 3v5h5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
    plastic: `<path d="M10 2h4v3l1.5 2v14a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V7L10 5V2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
    metal: `<circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1M18.5 18.5l-2.1-2.1M7.6 7.6 5.5 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
    glass: `<path d="M8 2h8l-1 6.5c2 1.4 3 3.7 3 6.5a7 7 0 1 1-14 0c0-2.8 1-5.1 3-6.5L8 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 2h8" stroke="currentColor" stroke-width="1.6"/>`,
    ewaste: `<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`
  };

  const MATERIALS = [
    { id:'paper',   label:'Paper',   rate:10,  color:'var(--mat-paper)'   },
    { id:'plastic', label:'Plastic', rate:15,  color:'var(--mat-plastic)'},
    { id:'metal',   label:'Metal',   rate:150, color:'var(--mat-metal)'  },
    { id:'glass',   label:'Glass',   rate:2,   color:'var(--mat-glass)'  },
    { id:'ewaste',  label:'E-waste', rate:80,  color:'var(--mat-ewaste)' }
  ];
  const matById = id => MATERIALS.find(m => m.id === id);

  /* ===== Directory data ===== */
  const DIRECTORY = {
    dealers: [
      { name:'Shree Ganesh Kabadi Store', area:'Local · door pickup', desc:'Neighbourhood scrap dealer buying mixed paper, plastic and metal by weight, cash on the spot.', mats:['paper','plastic','metal'], phone:'Call to confirm today\'s rate' },
      { name:'City Metal & Paper Traders', area:'Wholesale yard', desc:'Bulk buyer for larger quantities of metal and paper — best rates above 25 kg.', mats:['metal','paper'], phone:'Weighs on-site, cash or UPI' },
      { name:'Green Bottle Scrap Point', area:'Local · walk-in', desc:'Specialises in glass and plastic bottles, also takes small e-waste like cables and chargers.', mats:['glass','plastic','ewaste'], phone:'Open till evening, no pickup' }
    ],
    recyclers: [
      { name:'EcoCycle Processing Unit', area:'Certified facility', desc:'Formal recycler for plastics and glass with documented, traceable processing.', mats:['plastic','glass'], phone:'Bulk drop-off, prior booking needed' },
      { name:'ReMetal Industries', area:'Certified facility', desc:'Handles ferrous and non-ferrous metal recycling with proper environmental clearance.', mats:['metal'], phone:'Minimum quantity applies' },
      { name:'Circuit Circle E-Waste', area:'Authorised e-waste unit', desc:'Government-authorised handling of e-waste — old phones, wires, small appliances, batteries.', mats:['ewaste'], phone:'Free pickup above 5 kg' }
    ],
    ngos: [
      { name:'Kagaz Se Kal', area:'Community NGO', desc:'Collects paper waste and channels proceeds into school supplies for underprivileged children.', mats:['paper'], phone:'Monthly community drives' },
      { name:'Plastic Free Neighbourhood', area:'Environmental NGO', desc:'Runs plastic collection drives and converts sorted plastic into eco-bricks for local builds.', mats:['plastic'], phone:'Drop-off points listed on notice board' },
      { name:'Second Life E-Waste Trust', area:'Non-profit', desc:'Refurbishes usable e-waste for donation, safely recycles the rest — no material turned away.', mats:['ewaste','metal'], phone:'Home pickup for bulk donations' }
    ]
  };

  /* ===== State ===== */
  let entries = [];       // { id, matId, weight }
  let selectedMat = null;

  /* ===== Nav ===== */
  const pages = document.querySelectorAll('.page');
  const tabs = document.querySelectorAll('.tabs__item');

  function goTo(name){
    pages.forEach(p => p.classList.toggle('is-active', p.dataset.page === name));
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.nav === name));
    window.scrollTo({ top:0, behavior:'smooth' });
    if(name === 'value') renderValue();
  }
  document.querySelectorAll('[data-nav]').forEach(el=>{
    el.addEventListener('click', () => goTo(el.dataset.nav));
  });

  /* ===== Rates strip (home) ===== */
  const ratesGrid = document.getElementById('rates-grid');
  ratesGrid.innerHTML = MATERIALS.map(m => `
    <div class="rate-chip">
      <span class="rate-chip__icon" style="color:${m.color}"><svg viewBox="0 0 24 24" fill="none">${ICONS[m.id]}</svg></span>
      <span class="rate-chip__name">${m.label}</span>
      <span class="rate-chip__rate">₹${m.rate}/kg</span>
    </div>
  `).join('');

  /* ===== Material chips (add page) ===== */
  const chipGrid = document.getElementById('material-chips');
  chipGrid.innerHTML = MATERIALS.map(m => `
    <button type="button" class="mat-chip" data-mat="${m.id}" role="radio" aria-checked="false">
      <svg viewBox="0 0 24 24" fill="none">${ICONS[m.id]}</svg>
      <span>${m.label}</span>
      <span class="rate-tag">₹${m.rate}/kg</span>
    </button>
  `).join('');
  chipGrid.addEventListener('click', e => {
    const btn = e.target.closest('.mat-chip');
    if(!btn) return;
    selectedMat = btn.dataset.mat;
    chipGrid.querySelectorAll('.mat-chip').forEach(c => {
      const on = c === btn;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-checked', on);
    });
  });

  /* ===== Add-waste form ===== */
  const form = document.getElementById('add-form');
  const weightInput = document.getElementById('weight-input');
  const formError = document.getElementById('form-error');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const weight = parseFloat(weightInput.value);
    if(!selectedMat || !weight || weight <= 0){
      formError.hidden = false;
      return;
    }
    formError.hidden = true;
    entries.push({ id: Date.now(), matId: selectedMat, weight });
    weightInput.value = '';
    renderLedger();
  });

  /* ===== Ledger list (add page) ===== */
  const entryList = document.getElementById('entry-list');
  const entryEmpty = document.getElementById('entry-empty');
  const entryCount = document.getElementById('entry-count');
  const goValueBtn = document.getElementById('go-value');
  const cartBadge = document.getElementById('cart-badge');
  const cartCount = document.getElementById('cart-count');

  goValueBtn.addEventListener('click', () => {
    goTo('value');
});

  function renderLedger(){
    entryCount.textContent = `(${entries.length})`;
    goValueBtn.disabled = entries.length === 0;
    cartBadge.hidden = entries.length === 0;
    cartCount.textContent = entries.length;

    if(entries.length === 0){
      entryList.innerHTML = '';
      entryList.appendChild(entryEmpty);
      entryEmpty.hidden = false;
      return;
    }
    entryEmpty.hidden = true;
    entryList.innerHTML = entries.map(en => {
      const m = matById(en.matId);
      const amount = (en.weight * m.rate).toFixed(2);
      return `
        <div class="receipt__row" data-id="${en.id}">
          <span class="receipt__swatch" style="background:${m.color}"></span>
          <span class="receipt__name">${m.label}</span>
          <span class="receipt__weight">${en.weight} kg</span>
          <span class="receipt__amount">₹${amount}</span>
          <button type="button" class="receipt__del" aria-label="Remove ${m.label} entry">
            <svg viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>`;
    }).join('');
  }

  entryList.addEventListener('click', e => {
    const del = e.target.closest('.receipt__del');
    if(!del) return;
    const id = Number(del.closest('.receipt__row').dataset.id);
    entries = entries.filter(en => en.id !== id);
    renderLedger();
  });

  


  /* ===== Value page ===== */
  const totalValueEl = document.getElementById('total-value');
  const totalWeightEl = document.getElementById('total-weight');
  const totalItemsEl = document.getElementById('total-items');
  const breakdownBody = document.getElementById('breakdown-body');
  const breakdownTable = document.getElementById('breakdown-table');
  const breakdownEmpty = document.getElementById('breakdown-empty');

  function renderValue(){
    const totalWeight = entries.reduce((s,e) => s + e.weight, 0);
    const totalValue = entries.reduce((s,e) => s + e.weight * matById(e.matId).rate, 0);

    totalWeightEl.textContent = totalWeight.toFixed(1);
    totalItemsEl.textContent = entries.length;
    animateCounter(totalValueEl, totalValue);

    if(entries.length === 0){
      breakdownTable.style.display = 'none';
      breakdownEmpty.style.display = 'block';
      return;
    }
    breakdownTable.style.display = 'table';
    breakdownEmpty.style.display = 'none';

    // group by material
    const groups = {};
    entries.forEach(en => {
      groups[en.matId] = (groups[en.matId] || 0) + en.weight;
    });

    breakdownBody.innerHTML = Object.entries(groups).map(([matId, weight]) => {
      const m = matById(matId);
      const subtotal = weight * m.rate;
      return `
        <tr>
          <td><span class="cell-swatch" style="background:${m.color}"></span>${m.label}</td>
          <td>${weight.toFixed(1)} kg</td>
          <td>₹${m.rate}/kg</td>
          <td>₹${subtotal.toFixed(2)}</td>
        </tr>`;
    }).join('') + `
      <tfoot><tr><td>Total</td><td>${totalWeight.toFixed(1)} kg</td><td></td><td>₹${totalValue.toFixed(2)}</td></tr></tfoot>`;
  }

  function animateCounter(el, target){
    const start = parseFloat(el.textContent.replace(/,/g,'')) || 0;
    const duration = 650;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start) * eased;
      el.textContent = val.toFixed(2);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ===== Home demo LED ===== */
  const demoValue = document.getElementById('demo-value');
  const demoWeight = document.getElementById('demo-weight');
  const demoMaterial = document.getElementById('demo-material');
  let demoIndex = 0;
  const demoWeights = [3.2, 1.8, 0.6, 5.5, 2.1];

  function runDemo(){
    const m = MATERIALS[demoIndex % MATERIALS.length];
    const w = demoWeights[demoIndex % demoWeights.length];
    demoMaterial.textContent = m.label;
    demoWeight.textContent = w.toFixed(1);
    animateCounter(demoValue, w * m.rate);
    demoIndex++;
  }
  runDemo();
  setInterval(runDemo, 2600);

  /* ===== Directory ===== */
  const directoryGrid = document.getElementById('directory-grid');
  const dtabs = document.querySelectorAll('.dtab');

  let currentCat = 'dealers';

  function renderDirectory(cat){
    currentCat = cat;
    directoryGrid.innerHTML = DIRECTORY[cat].map((org, i) => `
      <button type="button" class="org-card" data-cat="${cat}" data-idx="${i}">
        <div class="org-card__top">
          <span class="org-card__name">${org.name}</span>
        </div>
        <span class="org-card__area">${org.area}</span>
        <p class="org-card__desc">${org.desc}</p>
        <div class="org-card__mats">
          ${org.mats.map(id => {
            const m = matById(id);
            return `<span class="mat-tag" style="background:${m.color}">${m.label}</span>`;
          }).join('')}
        </div>
        <div class="org-card__contact"><span>${org.phone}</span></div>
        <span class="org-card__cta">Schedule pickup / drop-off
          <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
    `).join('');

    directoryGrid.querySelectorAll('.org-card').forEach(card => {
      card.addEventListener('click', () => {
        const org = DIRECTORY[card.dataset.cat][card.dataset.idx];
        openSchedule(org);
      });
    });
  }
  dtabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dtabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
      renderDirectory(tab.dataset.cat);
    });
  });

  /* ===== Schedule page ===== */
  const scheduleForm = document.getElementById('schedule-form');
  const scheduleOrgBox = document.getElementById('schedule-org');
  const scheduleTitle = document.getElementById('schedule-title');
  const scheduleSub = document.getElementById('schedule-sub');
  const scheduleAddressLabel = document.getElementById('sch-address-label');
  const scheduleAddressInput = document.getElementById('sch-address');
  const modeBtns = document.querySelectorAll('#schedule-mode .mode-btn');
  const confirmCard = document.getElementById('schedule-confirm-card');
  const confirmText = document.getElementById('schedule-confirm-text');
  let scheduleOrg = null;
  let scheduleMode = 'pickup';

  function openSchedule(org){
    scheduleOrg = org;
    scheduleTitle.textContent = `Book with ${org.name}`;
    scheduleSub.textContent = `${org.area} — fill in your details and they'll be in touch to confirm.`;
    scheduleOrgBox.innerHTML = `
      <span class="org-summary__name">${org.name}</span>
      <span class="org-summary__area">${org.area} · ${org.phone}</span>
    `;
    scheduleForm.hidden = false;
    confirmCard.hidden = true;
    scheduleForm.reset();
    setScheduleMode('pickup');
    goTo('schedule');
  }

  function setScheduleMode(mode){
    scheduleMode = mode;
    modeBtns.forEach(b => b.classList.toggle('is-selected', b.dataset.mode === mode));
    if(mode === 'pickup'){
      scheduleAddressLabel.textContent = 'Pickup address';
      scheduleAddressInput.placeholder = 'House no., street, area';
      scheduleAddressInput.required = true;
    } else {
      scheduleAddressLabel.textContent = 'Your area (for reference)';
      scheduleAddressInput.placeholder = 'e.g. Sector 12, Hansi';
      scheduleAddressInput.required = false;
    }
  }
  modeBtns.forEach(btn => btn.addEventListener('click', () => setScheduleMode(btn.dataset.mode)));

  document.getElementById('schedule-back').addEventListener('click', () => goTo('directory'));

  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!scheduleOrg) return;
    const name = document.getElementById('sch-name').value.trim();
    const date = document.getElementById('sch-date').value;
    const time = document.getElementById('sch-time').value;
    const modeLabel = scheduleMode === 'pickup' ? 'home pickup' : 'self drop-off';

    confirmText.textContent = `Thanks${name ? ', ' + name : ''} — your ${modeLabel} with ${scheduleOrg.name} is requested for ${date || 'the selected date'} at ${time || 'the selected time'}. They'll confirm on the number you provided.`;
    scheduleForm.hidden = true;
    confirmCard.hidden = false;
  });

  /* ===== Init ===== */
  renderLedger();
  renderDirectory('dealers');
})();
