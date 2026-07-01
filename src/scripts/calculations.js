// ── Estimate calculations, pricing constants ──

export var SEASON_WEEKS = 36;

export var weeklyFloor = { condo: 75, small: 95, quarter: 120, half: 155, acre: 220, large: 355 };

export var sizeScale = { condo: 0.4, small: 0.55, quarter: 0.75, half: 1.0, acre: 1.45, large: 2.3 };

export var svcRates = {
  turf: [1000, 2600],    native: [1200, 3800],  soil: [350, 1000],
  water: [700, 2200],    pasture: [1200, 3000],  hay: [800, 2000],
  habitat: [500, 1600],  meadow: [800, 2400],   woodland: [600, 1600],
  pruning: [500, 1600],  annuals: [350, 1100],   cleanup: [400, 1300],
  leaf: [300, 900]
};

export var svcNames = {
  turf: 'Lawn restoration & renovation',
  native: 'Native plant design & installation',
  soil: 'Soil testing & amendment program',
  water: 'Drainage mapping & management',
  pasture: 'Pasture rotation & livestock support',
  hay: 'Hay field soil health & yield program',
  habitat: 'Habitat corridors & wildlife planting',
  meadow: 'Meadow & field conversion',
  woodland: 'Woodland edge restoration',
  pruning: 'Pruning & trimming',
  annuals: 'Annual plantings',
  cleanup: 'Seasonal cleanups',
  leaf: 'Leaf & debris management'
};

export var sizeLabel = {
  condo: 'Condo / townhome', small: 'Under ¼ acre', quarter: '¼–½ acre', half: '½–1 acre',
  acre: '1–3 acres', large: '3–5 acres',
  acres5: '5–10 acres', acres10: '10–25 acres', acres25: '25–50 acres',
  acres50: '50+ acres'
};

export var typeLabels = {
  residential: 'Residential',
  farm: 'Farm / Working Land',
  commercial: 'Commercial',
  estate: 'Estate / Large Residential'
};

export var timelineLabel = {
  asap: 'As soon as possible',
  season: 'This season',
  next: 'Next season',
  exploring: 'Just exploring'
};

export var partnerLabel = {
  trainees: 'Stewards in Training',
  content: 'Property as Content',
  pilot: 'Pilot Program Participant',
  flexible: 'Full Scheduling Flexibility'
};
