// ── Navigation, progress tracking, step management ──
import { appState } from './state.js';

// Progress percentages per step per mode
var progressQQ = {
  'fs-type':0, 'fs-size-res':12, 'fs-size-com':12, 'fs-size-land':12,
  'fs-problems':25, 'fs-qq-services-maint':37, 'fs-qq-services-eco':50,
  'fs-timeline':62, 'fs-savings':75, 'fs-qq-contact':87, 'fs-result':100
};
var progressDD = {
  'fs-type':0, 'fs-size-res':8, 'fs-size-com':8, 'fs-size-land':8,
  'fs-landuse':15, 'fs-challenges':23, 'fs-dd-services-maint':31, 'fs-dd-services-eco':38,
  'fs-setup':46, 'fs-spend':54, 'fs-goals':62,
  'fs-priority':69, 'fs-savings':77, 'fs-decision':85, 'fs-dd-contact':92, 'fs-result':100
};

function getProgress(id) {
  return (appState.mode === 'dd' ? progressDD[id] : progressQQ[id]) || 0;
}

export function goTo(id) {
  var progressFill = document.getElementById('progressFill');
  var stepLabel = document.getElementById('stepLabel');
  var backBtn = document.getElementById('backBtn');
  var flowContent = document.getElementById('flowContent');

  if (appState.currentStep && appState.currentStep !== id) appState.navHistory.push(appState.currentStep);
  appState.currentStep = id;

  var allSteps = document.querySelectorAll('.flow-step');
  for (var i = 0; i < allSteps.length; i++) allSteps[i].classList.remove('active');
  var el = document.getElementById(id);
  if (el) { void el.offsetWidth; el.classList.add('active'); }

  progressFill.style.width = getProgress(id) + '%';
  var numEl = el ? el.querySelector('.step-number') : null;
  stepLabel.textContent = numEl ? numEl.textContent : (id === 'fs-result' ? 'Complete' : '');
  backBtn.className = 'flow-back-btn' + (appState.navHistory.length === 0 ? ' hidden' : '');
  flowContent.scrollTop = 0;
}

export function goBack() {
  if (appState.navHistory.length === 0) return;
  var progressFill = document.getElementById('progressFill');
  var stepLabel = document.getElementById('stepLabel');
  var backBtn = document.getElementById('backBtn');
  var flowContent = document.getElementById('flowContent');

  var prev = appState.navHistory.pop();
  appState.currentStep = prev;

  var allSteps = document.querySelectorAll('.flow-step');
  for (var i = 0; i < allSteps.length; i++) allSteps[i].classList.remove('active');
  var el = document.getElementById(prev);
  if (el) el.classList.add('active');

  progressFill.style.width = getProgress(prev) + '%';
  var numEl = el ? el.querySelector('.step-number') : null;
  stepLabel.textContent = numEl ? numEl.textContent : '';
  backBtn.className = 'flow-back-btn' + (appState.navHistory.length === 0 ? ' hidden' : '');
  flowContent.scrollTop = 0;
}

export function updateSharedStepNumbers() {
  var total = appState.mode === 'dd' ? '13' : '8';
  var snType = document.getElementById('sn-type');
  var snSav  = document.getElementById('sn-savings');
  if (snType) snType.textContent = 'Step 1 of ' + total;
  if (snSav)  snSav.textContent  = appState.mode === 'dd' ? 'Step 11 of 13' : 'Step 7 of 8';
  var sizeSteps = document.querySelectorAll('#fs-size-res .step-number, #fs-size-com .step-number, #fs-size-land .step-number');
  for (var i = 0; i < sizeSteps.length; i++) sizeSteps[i].textContent = 'Step 2 of ' + total;
}
