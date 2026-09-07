// ── Smart filtering: reorder/hide chips based on property type ──

export var filterConfig = {
  residential: {
    probOrder: ['prob-soil','prob-water','prob-ecology'], probHideChips: ['pasture'], probHideGroups: [],
    svcMaintHideChips: [], svcMaintHideGroups: [],
    svcEcoHideChips: ['pasture','hay'], svcEcoHideGroups: ['farm'],
    challOrder: ['chall-soil','chall-water','chall-results','chall-land'], challHideChips: ['pasture','hay'], challHideGroups: [],
    badge: '<span>🏠</span> Tailored for residential'
  },
  commercial: {
    probOrder: ['prob-soil','prob-water','prob-ecology'], probHideChips: ['pasture'], probHideGroups: [],
    svcMaintHideChips: [], svcMaintHideGroups: [],
    svcEcoHideChips: ['pasture','hay'], svcEcoHideGroups: ['farm'],
    challOrder: ['chall-soil','chall-water','chall-results','chall-land'], challHideChips: ['pasture','hay'], challHideGroups: [],
    badge: '<span>🏢</span> Tailored for commercial'
  },
  estate: {
    probOrder: ['prob-water','prob-ecology','prob-soil'], probHideChips: [], probHideGroups: [],
    svcMaintHideChips: [], svcMaintHideGroups: [],
    svcEcoHideChips: [], svcEcoHideGroups: [],
    challOrder: ['chall-water','chall-land','chall-soil','chall-results'], challHideChips: [], challHideGroups: [],
    badge: '<span>🌳</span> Tailored for estate'
  },
  farm: {
    probOrder: ['prob-ecology','prob-soil','prob-water'], probHideChips: ['trees'], probHideGroups: [],
    svcMaintHideChips: [], svcMaintHideGroups: [],
    svcEcoHideChips: [], svcEcoHideGroups: [],
    challOrder: ['chall-land','chall-soil','chall-water','chall-results'], challHideChips: [], challHideGroups: [],
    badge: '<span>🌾</span> Tailored for farm'
  }
};

function reorderGroups(containerId, order) {
  var c = document.getElementById(containerId);
  if (!c) return;
  for (var i = 0; i < order.length; i++) {
    var g = c.querySelector('[data-group="' + order[i] + '"]');
    if (g) c.appendChild(g);
  }
}

function hideChips(containerId, vals) {
  var c = document.getElementById(containerId);
  if (!c) return;
  var all = c.querySelectorAll('.chip.hidden-chip');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('hidden-chip');
  for (var i = 0; i < vals.length; i++) {
    var ch = c.querySelector('.chip[data-val="' + vals[i] + '"]');
    if (ch) { ch.classList.add('hidden-chip'); ch.classList.remove('selected'); }
  }
}

function hideGroups(containerId, names) {
  var c = document.getElementById(containerId);
  if (!c) return;
  var all = c.querySelectorAll('.chip-group.hidden-group');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('hidden-group');
  for (var i = 0; i < names.length; i++) {
    var g = c.querySelector('[data-group="' + names[i] + '"]');
    if (g) g.classList.add('hidden-group');
  }
}

function hideGroupsPrefix(containerId, prefix, names) {
  var c = document.getElementById(containerId);
  if (!c) return;
  var all = c.querySelectorAll('.chip-group.hidden-group');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('hidden-group');
  for (var i = 0; i < names.length; i++) {
    var g = c.querySelector('[data-group="' + prefix + names[i] + '"]');
    if (g) g.classList.add('hidden-group');
  }
}

function applyRouteFilter(type) {
  var routed = document.querySelectorAll('.flow-option[data-route]');
  for (var i = 0; i < routed.length; i++) {
    var btn = routed[i];
    var routes = btn.getAttribute('data-route').split(' ');
    if (routes.indexOf(type) !== -1) btn.classList.remove('route-hidden');
    else { btn.classList.add('route-hidden'); btn.classList.remove('selected'); }
  }
}

function setBadge(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

export function applySmartFilter(type) {
  var cfg = filterConfig[type];
  if (!cfg) return;

  // QQ problems
  reorderGroups('prob-groups', cfg.probOrder);
  hideChips('prob-groups', cfg.probHideChips);
  hideGroups('prob-groups', cfg.probHideGroups);
  setBadge('probBadge', cfg.badge);

  // QQ services — maintenance slide
  hideChips('qq-svc-maint-groups', cfg.svcMaintHideChips);
  hideGroupsPrefix('qq-svc-maint-groups', 'qqsvcm-', cfg.svcMaintHideGroups);
  setBadge('qqSvcMaintBadge', cfg.badge);

  // QQ services — ecological slide
  hideChips('qq-svc-eco-groups', cfg.svcEcoHideChips);
  hideGroupsPrefix('qq-svc-eco-groups', 'qqsvce-', cfg.svcEcoHideGroups);
  setBadge('qqSvcEcoBadge', cfg.badge);

  // DD challenges
  reorderGroups('chall-groups', cfg.challOrder);
  hideChips('chall-groups', cfg.challHideChips);
  hideGroups('chall-groups', cfg.challHideGroups);
  setBadge('challBadge', cfg.badge);

  // DD services — maintenance slide
  hideChips('dd-svc-maint-groups', cfg.svcMaintHideChips);
  hideGroupsPrefix('dd-svc-maint-groups', 'ddsvcm-', cfg.svcMaintHideGroups);
  setBadge('ddSvcMaintBadge', cfg.badge);

  // DD services — ecological slide
  hideChips('dd-svc-eco-groups', cfg.svcEcoHideChips);
  hideGroupsPrefix('dd-svc-eco-groups', 'ddsvce-', cfg.svcEcoHideGroups);
  setBadge('ddSvcEcoBadge', cfg.badge);

  // Route-filter for land use + setup
  applyRouteFilter(type);
}
