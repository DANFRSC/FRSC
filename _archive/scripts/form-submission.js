// ── Formspree payload builder and submission ──
import { appState } from './state.js';
import { SEASON_WEEKS, typeLabels, sizeLabel, timelineLabel, partnerLabel, svcNames } from './calculations.js';

export function submitToFormspree(submitMode) {
  var isDD = submitMode === 'dd';
  var svcs = isDD ? appState.sets.ddservices : appState.sets.services;
  var savs = appState.sets.savings;
  var probs = isDD ? appState.sets.challenges : appState.sets.problems;
  var gls = appState.sets.goals;
  var loc = isDD ? (appState.data.address || 'Chester County, PA') : (appState.data.town || 'Chester County, PA');

  var payload = {
    _subject: 'Consultation Request — ' + (typeLabels[appState.data.type] || 'Property') + ', ' + loc,
    mode: isDD ? 'Full Discovery' : 'Quick Quote',
    name: ((appState.data.firstName || '') + ' ' + (appState.data.lastName || '')).trim(),
    email: appState.data.email || '',
    phone: appState.data.phone || 'Not provided',
    location: loc,
    property_type: typeLabels[appState.data.type] || 'Not specified',
    property_size: sizeLabel[appState.data.size] || 'Not specified',
    estimate: appState.data._weekly ? '$' + appState.data._weekly + '/week · $' + (appState.data._weekly * SEASON_WEEKS).toLocaleString() + '/season' : 'Custom quote — scoped on-site',
    services: svcs.size ? Array.from(svcs).map(function(s) { return svcNames[s] || s; }).join(', ') : 'To be discussed on-site',
    partnership_options: savs.size ? Array.from(savs).map(function(s) { return partnerLabel[s] || s; }).join(', ') : 'None selected',
    challenges: probs.size ? Array.from(probs).join(', ') : 'None specified'
  };

  if (!isDD) payload.timeline = timelineLabel[appState.data.timeline] || 'Not specified';
  if (isDD) {
    payload.land_use = appState.data.landuse || 'Not specified';
    payload.current_setup = appState.data.setup || 'Not specified';
    payload.current_spend = appState.data.spend || 'Not specified';
    payload.decision_maker = appState.data.decision || 'Not specified';
    payload.ecological_goals = gls && gls.size ? Array.from(gls).join(', ') : 'Not specified';
    var prios = appState.sets.priorities;
    payload.priorities = prios && prios.size ? Array.from(prios).join(', ') : 'Not specified';
    payload.notes = appState.data.notes || '';
  }

  fetch('https://formspree.io/f/meelylja', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function() {});
}
