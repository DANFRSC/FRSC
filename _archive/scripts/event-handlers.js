// ── Central event delegation and orchestration ──
import { appState, fullReset } from './state.js';
import { goTo, goBack, updateSharedStepNumbers } from './navigation.js';
import { applySmartFilter } from './filtering.js';
import { weeklyFloor, SEASON_WEEKS, typeLabels, sizeLabel, svcNames } from './calculations.js';
import { submitToFormspree } from './form-submission.js';
import { openEmailPreview } from './email-builder.js';

var landing, overlay;

function openOverlay() {
  landing.style.display = 'none';
  overlay.classList.add('open');
}

function closeOverlay() {
  overlay.classList.remove('open');
  landing.style.display = '';
  fullReset();
}

function handleChipToggle(chip) {
  var setName = chip.getAttribute('data-set');
  var val = chip.getAttribute('data-val');
  var isExclusive = chip.getAttribute('data-exclusive') === 'true';
  var s = appState.sets[setName];

  if (setName === 'problems' && isExclusive && !s.has(val)) {
    s.clear();
    var allC = document.querySelectorAll('.chip[data-set="problems"].selected');
    for (var i = 0; i < allC.length; i++) allC[i].classList.remove('selected');
  } else if (setName === 'problems' && !isExclusive && s.has('nothing')) {
    s.delete('nothing');
    var excl = document.querySelector('.chip[data-val="nothing"]');
    if (excl) excl.classList.remove('selected');
  }

  chip.classList.toggle('selected');
  if (s.has(val)) s.delete(val); else s.add(val);

  var size = s.size;
  if (setName === 'services') {
    var c1 = document.getElementById('qqSvcCount'); if (c1) c1.textContent = size;
    var c2 = document.getElementById('qqSvcCount2'); if (c2) c2.textContent = size;
  } else if (setName === 'ddservices') {
    var c1 = document.getElementById('ddSvcCount'); if (c1) c1.textContent = size;
    var c2 = document.getElementById('ddSvcCount2'); if (c2) c2.textContent = size;
  } else {
    var counterMap = { problems: 'probCount', challenges: 'challCount', goals: 'goalsCount' };
    var cid = counterMap[setName];
    if (cid) document.getElementById(cid).textContent = size;
  }
}

function handleToggle(btn) {
  var setName = btn.getAttribute('data-set');
  var val = btn.getAttribute('data-val');
  var counterId = btn.getAttribute('data-counter');
  var s = appState.sets[setName];
  btn.classList.toggle('selected');
  if (s.has(val)) s.delete(val); else s.add(val);
  document.getElementById(counterId).textContent = s.size;
}

function afterSize(sizeVal) {
  appState.data.size = sizeVal;
  if (appState.mode === 'dd') goTo('fs-landuse');
  else goTo('fs-problems');
}

function showResult(isDD) {
  var prefix = isDD ? 'dd' : 'qq';
  var errEl = document.getElementById(prefix + 'Err');
  errEl.style.display = 'none';

  var firstName = document.getElementById(prefix + 'First').value.trim();
  var email = document.getElementById(prefix + 'Email').value.trim();
  if (!firstName || !email) { errEl.style.display = 'block'; return; }

  appState.data.firstName = firstName;
  appState.data.lastName = document.getElementById(prefix + 'Last').value.trim();
  appState.data.email = email;
  appState.data.phone = document.getElementById(prefix + 'Phone').value.trim();

  if (isDD) {
    appState.data.address = document.getElementById('ddAddr').value.trim();
    appState.data.notes = document.getElementById('ddNotes').value.trim();
  } else {
    appState.data.town = document.getElementById('qqTown').value.trim() || 'Chester County, PA';
  }

  var sz = appState.data.size || 'half';
  var isCustom = (appState.data.type === 'commercial' || appState.data.type === 'farm' || sz.indexOf('acres') === 0);

  if (isCustom) {
    appState.data._weekly = null;
    document.getElementById('resultWeekly').textContent = 'Custom';
    document.getElementById('resultAnnual').textContent = 'Farm, estate & commercial programs are scoped on-site — your Steward will build a custom proposal.';
  } else {
    var weekly = weeklyFloor[sz] || (isDD ? 155 : 95);
    var annual = weekly * SEASON_WEEKS;
    appState.data._weekly = weekly;
    document.getElementById('resultWeekly').textContent = weekly.toLocaleString();
    document.getElementById('resultAnnual').textContent = '$' + annual.toLocaleString() + ' / season · 36 weeks';
  }

  // Populate personalized elements
  document.getElementById('resultName').textContent = firstName;

  // Selection tags
  var typeTag = document.getElementById('resultTypeTag');
  var sizeTag = document.getElementById('resultSizeTag');
  var priorityWrap = document.getElementById('resultPriorityTags');

  typeTag.textContent = typeLabels[appState.data.type] || 'Property';
  sizeTag.textContent = sizeLabel[sz] || '';

  var priorityMap = {
    soil: 'Soil health', beauty: 'Curb appeal', safe: 'Chemical-free',
    lowmaint: 'Low maintenance', environment: 'Environmental impact', value: 'Value & efficiency'
  };
  var prios = appState.sets.priorities;
  priorityWrap.innerHTML = '';
  if (prios.size > 0) {
    prios.forEach(function(p) {
      if (priorityMap[p]) {
        var tag = document.createElement('span');
        tag.className = 'result-tag';
        tag.textContent = '★ ' + priorityMap[p];
        priorityWrap.appendChild(tag);
      }
    });
    priorityWrap.style.display = '';
  } else {
    priorityWrap.style.display = 'none';
  }

  // Add-on services
  var services = isDD ? appState.sets.ddservices : appState.sets.services;
  var addonsWrap = document.getElementById('resultAddons');
  var addonList = document.getElementById('resultAddonList');
  if (services.size > 0) {
    addonList.innerHTML = '';
    services.forEach(function(svc) {
      var pill = document.createElement('span');
      pill.className = 'result-addon-pill';
      pill.textContent = svcNames[svc] || svc;
      addonList.appendChild(pill);
    });
    addonsWrap.style.display = '';
  } else {
    addonsWrap.style.display = 'none';
  }

  goTo('fs-result');
  submitToFormspree(isDD ? 'dd' : 'qq');
}

export function initializeEventHandlers() {
  landing = document.getElementById('landing');
  overlay = document.getElementById('flowOverlay');

  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-action], [id]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var id = target.id;

    if (id === 'btn-qq') { appState.mode = 'qq'; appState.data._mode = 'qq'; updateSharedStepNumbers(); openOverlay(); goTo('fs-type'); return; }
    if (id === 'btn-dd') { appState.mode = 'dd'; appState.data._mode = 'dd'; updateSharedStepNumbers(); openOverlay(); goTo('fs-type'); return; }
    if (id === 'btn-close' || id === 'btn-done') { closeOverlay(); return; }
    if (id === 'backBtn') { goBack(); return; }
    if (id === 'btn-qq-generate') { showResult(false); return; }
    if (id === 'btn-dd-generate') { showResult(true); return; }
    if (id === 'btn-profile') { openEmailPreview(); return; }
    if (id === 'btn-savings-continue') {
      if (appState.mode === 'dd') goTo('fs-decision');
      else goTo('fs-qq-contact');
      return;
    }

    if (action === 'select-type') {
      var val = target.getAttribute('data-val');
      var next = target.getAttribute('data-next');
      appState.data.type = val;
      applySmartFilter(val);
      target.classList.add('selected');
      setTimeout(function() { goTo(next); }, 180);
      return;
    }
    if (action === 'select-size') {
      target.classList.add('selected');
      var val = target.getAttribute('data-val');
      setTimeout(function() { afterSize(val); }, 180);
      return;
    }
    if (action === 'select') {
      appState.data[target.getAttribute('data-key')] = target.getAttribute('data-val');
      target.classList.add('selected');
      var next = target.getAttribute('data-next');
      setTimeout(function() { goTo(next); }, 180);
      return;
    }
    if (action === 'chip-toggle') { handleChipToggle(target); return; }
    if (action === 'toggle') { handleToggle(target); return; }
    if (action === 'goto') { goTo(target.getAttribute('data-next')); return; }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'Backspace') {
      var tag = document.activeElement.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') { e.preventDefault(); goBack(); }
    }
  });
}
