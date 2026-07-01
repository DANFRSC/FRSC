// ── Shared application state singleton ──
// All modules import this same object — mutations are visible everywhere.

export var appState = {
  data: {},
  sets: {
    problems: new Set(),
    services: new Set(),
    ddservices: new Set(),
    challenges: new Set(),
    goals: new Set(),
    priorities: new Set(),
    savings: new Set()
  },
  mode: 'qq',       // 'qq' or 'dd'
  navHistory: [],
  currentStep: null
};

export function fullReset() {
  appState.navHistory = [];
  appState.currentStep = null;
  appState.data = {};
  appState.mode = 'qq';
  appState.sets = {
    problems: new Set(),
    services: new Set(),
    ddservices: new Set(),
    challenges: new Set(),
    goals: new Set(),
    priorities: new Set(),
    savings: new Set()
  };

  // Clear selected UI state
  var sel = document.querySelectorAll('.chip.selected, .flow-option.selected');
  for (var i = 0; i < sel.length; i++) sel[i].classList.remove('selected');

  // Reset counters
  ['probCount','qqSvcCount','qqSvcCount2','ddSvcCount','ddSvcCount2','challCount','goalsCount','prioCount','savCount'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '0';
  });

  // Clear form fields
  ['qqFirst','qqLast','qqEmail','qqPhone','qqTown','ddFirst','ddLast','ddEmail','ddPhone','ddAddr','ddNotes'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Clear error messages
  ['qqErr','ddErr'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Remove filter classes
  var hc = document.querySelectorAll('.hidden-chip');
  for (var i = 0; i < hc.length; i++) hc[i].classList.remove('hidden-chip');
  var hg = document.querySelectorAll('.hidden-group');
  for (var i = 0; i < hg.length; i++) hg[i].classList.remove('hidden-group');
  var rh = document.querySelectorAll('.route-hidden');
  for (var i = 0; i < rh.length; i++) rh[i].classList.remove('route-hidden');

  // Reset progress and step display
  document.getElementById('progressFill').style.width = '0%';
  var allSteps = document.querySelectorAll('.flow-step');
  for (var i = 0; i < allSteps.length; i++) allSteps[i].classList.remove('active');
  document.getElementById('fs-type').classList.add('active');
}
