// ── Stewardship profile HTML generator ──
import { appState } from './state.js';
import { SEASON_WEEKS, weeklyFloor, sizeScale, svcRates, svcNames, sizeLabel, typeLabels } from './calculations.js';

var priorityLabels = {
  soil: 'Soil health & long-term results',
  beauty: 'Curb appeal & visual beauty',
  safe: 'Chemical-free & safe for family',
  lowmaint: 'Low maintenance & less hassle',
  environment: 'Environmental impact',
  value: 'Value & cost efficiency'
};

export function buildEmailHTML() {
  var isDD = appState.mode === 'dd';
  var services = isDD ? appState.sets.ddservices : appState.sets.services;
  var savings = appState.sets.savings;
  var sz = appState.data.size || 'half';
  var scale = sizeScale[sz] || 1.0;
  var firstName = appState.data.firstName || 'there';
  var location  = isDD ? (appState.data.address || 'Chester County, PA') : (appState.data.town || 'Chester County, PA');
  var weekly = appState.data._weekly || (weeklyFloor[sz] || 155);
  var annual = weekly * SEASON_WEEKS;
  var isCustom = (appState.data._weekly === null);
  var typeLabel = typeLabels[appState.data.type] || 'Property';

  // Piecemeal market comparison — Putting Down Roots base services only.
  // Base rates at half-acre (scale 1.0), Chester County PA market research
  // 2025-2026. Scaled by property size with floor of 0.55 for vendor minimums.
  // Col 1 = conventional rates, Col 2 = organic / ecological rates.
  var mktScale = Math.max(scale, 0.55);
  var pdrBase = [
    ['Weekly lawn mowing',                  2400, 3600],
    ['Full-land fertilization & weed control', 750, 1600],
    ['Invasive species control',              600, 1200],
    ['Mulched bed maintenance (weed-free)',   1400, 2200]
  ];
  var pdrRows = pdrBase.map(function(r) {
    return [r[0], Math.round(r[1] * mktScale / 50) * 50, Math.round(r[2] * mktScale / 50) * 50];
  });
  var convTotal = 0, orgTotal = 0;
  pdrRows.forEach(function(r) { convTotal += r[1]; orgTotal += r[2]; });

  // Universal 3-year Putting Down Roots roadmap
  var roadmap = [
    ['Year 1','This is the getting-to-know-you year. Your Lead Steward assesses the full property — soil conditions, drainage patterns, existing plant health, problem areas, and what the land needs. Weekly service begins and we establish a baseline. Think of it as a thorough evaluation while we take care of the day-to-day.'],
    ['Year 2','Now that we understand your property, your Steward brings specific improvement recommendations for spring and fall — targeted add-on projects, planting suggestions, or corrective work. We continue assessing what\'s working and what isn\'t, and adjust the program accordingly.'],
    ['Year 3','Full understanding of your land. Your Steward presents a clear picture of where things stand and where they can go. You decide the direction — invest in more beauty and ecological depth, bring costs down through efficiency gains, or a mix of both. The program evolves with you.']
  ];

  // Color palette
  var F = '#013220'; var G = '#B8860B'; var GL = '#d4a017'; var CR = '#FAF7F0'; var BG = '#080e08';

  // 4-column table: Service | Conventional | Organic | With FRSC
  var tBdr = 'border-bottom:1px solid rgba(1,50,32,0.1);';
  var tCell = 'padding:10px 14px;' + tBdr;
  var pdrTableRows = pdrRows.map(function(r) {
    return '<tr>' +
      '<td style="' + tCell + 'color:#374337;font-size:0.84rem;line-height:1.4;">' + r[0] + '</td>' +
      '<td style="' + tCell + 'color:#666;font-size:0.84rem;white-space:nowrap;text-align:right;">$' + r[1].toLocaleString() + '/yr</td>' +
      '<td style="' + tCell + 'color:#666;font-size:0.84rem;white-space:nowrap;text-align:right;">$' + r[2].toLocaleString() + '/yr</td>' +
      '<td style="' + tCell + 'text-align:center;"><span style="color:' + F + ';font-weight:700;font-size:0.82rem;">✓ Included</span></td></tr>';
  }).join('');

  var convTotalRow = '<tr style="background:rgba(1,50,32,0.06);">' +
    '<td style="padding:12px 14px;font-weight:700;color:' + F + ';font-size:0.88rem;">Total</td>' +
    '<td style="padding:12px 14px;font-weight:700;color:#cc2200;font-size:0.88rem;white-space:nowrap;text-align:right;">$' + convTotal.toLocaleString() + '/yr</td>' +
    '<td style="padding:12px 14px;font-weight:700;color:#cc2200;font-size:0.88rem;white-space:nowrap;text-align:right;">$' + orgTotal.toLocaleString() + '/yr</td>' +
    '<td style="padding:12px 14px;"></td></tr>';

  var frscRow = '<tr style="background:' + F + ';">' +
    '<td style="padding:14px;font-weight:700;color:' + CR + ';font-size:0.88rem;">Filthy Rich Soil Co.<br><span style="font-weight:400;font-size:0.76rem;color:rgba(250,247,240,0.5);">Putting Down Roots — all-inclusive</span></td>' +
    '<td colspan="2" style="padding:14px;text-align:center;"><span style="color:rgba(250,247,240,0.45);font-size:0.78rem;">$' + annual.toLocaleString() + '/season</span></td>' +
    '<td style="padding:14px;text-align:center;"><span style="font-family:Georgia,serif;font-weight:900;color:' + G + ';font-size:1.15rem;">$' + weekly.toLocaleString() + '/wk</span></td></tr>';

  var roadmapHTML = roadmap.map(function(r, i) {
    var labels = ['Year One', 'Year Two', 'Year Three'];
    return '<div style="display:flex;gap:18px;padding:16px 0;border-bottom:1px solid rgba(1,50,32,0.1);">' +
      '<div style="min-width:80px;font-family:Georgia,serif;font-weight:900;font-size:0.82rem;color:' + G + ';padding-top:2px;">' + labels[i] + '</div>' +
      '<div style="font-size:0.86rem;color:#444;line-height:1.72;">' + r[1] + '</div></div>';
  }).join('');

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Filthy Rich Soil Co. — Your Stewardship Profile</title>' +
  '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">' +
  '<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:"DM Sans",Georgia,sans-serif;background:#f0ece4;color:#2a2a2a;}@media print{body{background:white;}.no-print{display:none!important;}}</style>' +
  '</head><body>' +
  '<div style="max-width:720px;margin:0 auto;background:#fff;box-shadow:0 4px 40px rgba(0,0,0,0.12);">' +

  // Header
  '<div style="background:' + F + ';padding:32px 48px 28px;display:flex;justify-content:space-between;align-items:center;">' +
    '<div>' +
      '<div style="font-family:Georgia,serif;color:' + G + ';font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;">Filthy Rich Soil Co.</div>' +
      '<div style="color:rgba(250,247,240,0.45);font-size:0.68rem;letter-spacing:1px;">Chester County, PA · Ecological Land Stewardship</div>' +
    '</div>' +
    '<div style="text-align:right;">' +
      '<div style="font-size:0.65rem;color:rgba(250,247,240,0.4);letter-spacing:0.5px;">dan@filthyrichsoilco.com</div>' +
      '<div style="font-size:0.65rem;color:rgba(250,247,240,0.4);margin-top:3px;">filthyrichsoilco.com</div>' +
    '</div>' +
  '</div>' +

  // Hero
  '<div style="background:' + BG + ';padding:44px 48px 40px;">' +
    '<div style="display:inline-block;background:rgba(184,134,11,0.2);border:1px solid rgba(184,134,11,0.35);border-radius:100px;padding:5px 16px;font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:' + GL + ';margin-bottom:18px;">' + typeLabel + ' · ' + sizeLabel[sz] + ' · Chester County, PA</div>' +
    (appState.sets.priorities.size > 0 ? Array.from(appState.sets.priorities).map(function(p) { return '<div style="display:inline-block;background:rgba(250,247,240,0.08);border:1px solid rgba(250,247,240,0.15);border-radius:100px;padding:5px 16px;font-size:0.62rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(250,247,240,0.6);margin-bottom:18px;margin-left:8px;">' + (priorityLabels[p] || p) + '</div>'; }).join('') : '') +
    '<h1 style="font-family:Georgia,serif;font-size:2.1rem;font-style:italic;font-weight:900;color:' + CR + ';line-height:1.15;margin-bottom:14px;">Hi ' + firstName + ' — here\'s<br>what we put together.</h1>' +
    '<p style="font-size:0.94rem;color:rgba(250,247,240,0.62);line-height:1.82;max-width:560px;">' + (isCustom ? 'Farm and commercial programs require an on-site assessment before we can build a proper proposal. A Lead Steward will reach out to schedule yours — no obligation.' : 'Based on your property, here\'s what a Putting Down Roots program looks like for your land — base program, comparison to piecemeal, and your 3-year ecological roadmap.') + '</p>' +
  '</div>' +

  // Estimate band
  '<div style="background:' + F + ';padding:32px 48px;">' +
    (isCustom ?
      '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(250,247,240,0.45);margin-bottom:8px;">Program Investment</div>' +
      '<div style="font-family:Georgia,serif;font-size:2rem;font-weight:900;color:' + CR + ';line-height:1.2;margin-bottom:10px;">Custom Quote — Scoped On-Site</div>' +
      '<div style="font-size:0.84rem;color:' + GL + ';line-height:1.6;">Farm and commercial programs vary widely based on acreage, land use, and goals. Your Lead Steward will build a proposal after the free on-site assessment.</div>'
    :
      '<div style="display:flex;align-items:flex-end;gap:32px;flex-wrap:wrap;">' +
        '<div>' +
          '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(250,247,240,0.45);margin-bottom:8px;">Putting Down Roots</div>' +
          '<div style="display:flex;align-items:baseline;gap:8px;">' +
            '<div style="font-family:Georgia,serif;font-size:3.4rem;font-weight:900;color:' + CR + ';line-height:1;">$' + weekly.toLocaleString() + '</div>' +
            '<div style="font-size:1rem;color:rgba(250,247,240,0.55);font-weight:300;">/week</div>' +
          '</div>' +
          '<div style="font-size:0.82rem;color:' + GL + ';margin-top:6px;">$' + annual.toLocaleString() + ' per season &nbsp;·&nbsp; 36 weeks</div>' +
        '</div>' +
        '<div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:14px 18px;">' +
          '<div style="font-size:0.6rem;color:rgba(250,247,240,0.38);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Location</div>' +
          '<div style="font-size:0.86rem;color:' + CR + ';font-weight:500;">' + location + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:0.78rem;color:rgba(250,247,240,0.42);margin-top:14px;line-height:1.6;">Base program. Add-on services scoped separately. As soil ecology matures, the inputs your program requires can decrease — your Steward will discuss realistic cost trajectory at the site assessment.</div>' +
      '<div style="font-size:0.74rem;color:rgba(250,247,240,0.32);margin-top:10px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;">This rate assumes a property in manageable condition. During the site assessment, your Lead Steward may identify one-time structural improvements or corrective work needed before the ongoing program can begin — such as drainage corrections, severe invasive clearing, or areas requiring initial restoration. These items are scoped and quoted separately so your weekly rate stays predictable from day one.</div>'
    ) +
  '</div>' +

  // Comparison table (skip for custom quote)
  (!isCustom ? (
  '<div style="padding:44px 48px;background:#FAF7F0;">' +
    '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(1,50,32,0.45);margin-bottom:6px;">The Real Cost Comparison</div>' +
    '<h2 style="font-family:Georgia,serif;font-size:1.55rem;font-style:italic;font-weight:700;color:' + F + ';margin-bottom:6px;">What separate vendors would cost you</h2>' +
    '<p style="font-size:0.84rem;color:#666;line-height:1.7;margin-bottom:24px;">Most Chester County homeowners cobble together a mowing company, a fertilization service, a landscaper for beds, and someone for invasive weeds. Here\'s what that stack costs — both conventional and organic — compared to one FRSC subscription.</p>' +
    '<table style="width:100%;border-collapse:collapse;background:white;border-radius:10px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.06);">' +
      '<thead><tr style="background:' + F + ';">' +
        '<th style="padding:12px 14px;text-align:left;font-size:0.65rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(250,247,240,0.6);font-weight:600;">Service</th>' +
        '<th style="padding:12px 14px;text-align:right;font-size:0.65rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(250,247,240,0.6);font-weight:600;">Conventional</th>' +
        '<th style="padding:12px 14px;text-align:right;font-size:0.65rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(250,247,240,0.6);font-weight:600;">Organic</th>' +
        '<th style="padding:12px 14px;text-align:center;font-size:0.65rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(250,247,240,0.6);font-weight:600;">With FRSC</th>' +
      '</tr></thead>' +
      '<tbody>' + pdrTableRows + convTotalRow + frscRow + '</tbody>' +
    '</table>' +
    '<p style="font-size:0.74rem;color:#999;margin-top:10px;line-height:1.6;">Estimates based on Chester County, PA market rates. Additional services you expressed interest in will be scoped and estimated by your Lead Steward during the on-site assessment.</p>' +
  '</div>'
  ) : '') +

  // Partnership section (only if any selected)
  (savings.size > 0 ? (function() {
    var partnerLabels = {
      trainees: { label: 'Stewards in Training',        desc: 'Allow supervised trainees to work alongside our senior Steward on your property. You receive the same expert oversight — they gain real-world experience in a professional setting.' },
      content:  { label: 'Property as Content',         desc: 'Allow us to document your property\'s transformation — video, photography, and soil data — for use in our educational content and media channels. Your identity stays private unless you choose otherwise.' },
      pilot:    { label: 'Pilot Program Participant',   desc: 'Open a section of your property as a living laboratory for new biological techniques we\'re developing. You receive full scientific documentation of what was tried, what worked, and what didn\'t.' },
      flexible: { label: 'Full Scheduling Flexibility', desc: 'Give us full flexibility on which weekday we visit — no day restrictions or preferred windows. This lets us build the most efficient route possible and pass the savings directly to you.' }
    };
    var discLevels = ['a meaningful discount', 'a significant discount', 'a substantial discount', 'our most significant available discount'];
    var count = savings.size;
    var discLabel = discLevels[Math.min(count - 1, 3)];
    var rows = '';
    savings.forEach(function(key) {
      var p = partnerLabels[key];
      if (!p) return;
      rows += '<div style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid rgba(250,247,240,0.1);align-items:flex-start;">' +
        '<div style="min-width:28px;height:28px;border-radius:50%;background:' + G + ';display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:' + BG + ';font-weight:900;flex-shrink:0;margin-top:2px;">✓</div>' +
        '<div><div style="font-weight:600;color:' + CR + ';font-size:0.88rem;margin-bottom:4px;">' + p.label + '</div>' +
        '<div style="font-size:0.82rem;color:rgba(250,247,240,0.58);line-height:1.68;">' + p.desc + '</div></div>' +
      '</div>';
    });
    return '<div style="padding:44px 48px;background:' + F + ';border-top:4px solid ' + G + ';">' +
      '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(250,247,240,0.4);margin-bottom:6px;">Partnership Selected</div>' +
      '<h2 style="font-family:Georgia,serif;font-size:1.55rem;font-style:italic;font-weight:700;color:' + CR + ';margin-bottom:8px;">You\'ve opened the door to ' + discLabel + '.</h2>' +
      '<p style="font-size:0.84rem;color:rgba(250,247,240,0.58);line-height:1.7;margin-bottom:22px;">These aren\'t upsells — they\'re ways to deepen the relationship. The exact reduction on your stewardship rate will be reflected in the formal proposal after your Lead Steward visits the property.</p>' +
      rows +
      '<p style="font-size:0.74rem;color:rgba(250,247,240,0.3);margin-top:18px;line-height:1.6;">Partnership terms are finalized during the site assessment and formal proposal conversation.</p>' +
    '</div>';
  })() : '') +

  // What's included
  '<div style="padding:44px 48px;background:' + F + ';">' +
    '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(250,247,240,0.4);margin-bottom:6px;">Putting Down Roots — Base</div>' +
    '<h2 style="font-family:Georgia,serif;font-size:1.55rem;font-style:italic;font-weight:700;color:' + CR + ';margin-bottom:8px;">Always included, every week</h2>' +
    '<p style="font-size:0.84rem;color:rgba(250,247,240,0.48);line-height:1.72;margin-bottom:20px;">This is the foundation of every FRSC program — not optional extras, not line-item add-ons. One rate, always covered.</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
      ['Lawn mowing', 'Full-land sustainable fertilization', 'Invasive species control', 'Weed-free mulched beds', 'Dedicated Lead Steward']
        .map(function(pill) { return '<span style="background:rgba(250,247,240,0.1);border:1px solid rgba(250,247,240,0.2);border-radius:100px;padding:6px 16px;font-size:0.76rem;color:rgba(250,247,240,0.8);">' + pill + '</span>'; })
        .join('') +
    '</div>' +
    (services.size > 0 ?
      '<div style="margin-top:22px;padding-top:22px;border-top:1px solid rgba(255,255,255,0.08);">' +
      '<div style="font-size:0.7rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(250,247,240,0.35);margin-bottom:10px;">Add-on services you indicated interest in — scoped on-site</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
        Array.from(services).map(function(s) { return '<span style="background:rgba(184,134,11,0.12);border:1px solid rgba(184,134,11,0.3);border-radius:100px;padding:6px 16px;font-size:0.76rem;color:' + GL + ';">' + (svcNames[s] || s) + '</span>'; }).join('') +
      '</div></div>'
    : '') +
    '<p style="font-size:0.82rem;color:rgba(250,247,240,0.42);margin-top:20px;line-height:1.72;">One contract. One steward. One weekly number. No surprise invoices, no surprise add-ons, no coordination overhead.</p>' +
  '</div>' +

  // 3-year roadmap
  '<div style="padding:44px 48px;background:white;">' +
    '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(1,50,32,0.45);margin-bottom:6px;">What to Expect</div>' +
    '<h2 style="font-family:Georgia,serif;font-size:1.55rem;font-style:italic;font-weight:700;color:' + F + ';margin-bottom:4px;">How the relationship grows</h2>' +
    '<p style="font-size:0.84rem;color:#666;line-height:1.7;margin-bottom:22px;">Every Putting Down Roots program follows this arc. We don\'t rush — we learn your land first, then build from there.</p>' +
    roadmapHTML +
  '</div>' +

  // Next steps
  '<div style="padding:44px 48px;background:#FAF7F0;">' +
    '<div style="font-size:0.62rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(1,50,32,0.45);margin-bottom:6px;">What Happens Next</div>' +
    '<h2 style="font-family:Georgia,serif;font-size:1.55rem;font-style:italic;font-weight:700;color:' + F + ';margin-bottom:24px;">From here</h2>' +
    '<div style="display:flex;gap:20px;align-items:flex-start;">' +
      '<div style="min-width:36px;height:36px;border-radius:50%;background:' + F + ';display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-weight:900;color:' + G + ';font-size:0.9rem;flex-shrink:0;margin-top:2px;">1</div>' +
      '<div><div style="font-weight:600;color:' + F + ';font-size:0.9rem;margin-bottom:4px;">Check your inbox</div><div style="font-size:0.82rem;color:#666;line-height:1.72;">A Lead Steward will send you a personal email with a link to schedule either a property visit or a quick phone call — whichever you prefer. No automated sequences, no pressure. Just a real person ready to talk about your land.</div></div>' +
    '</div>' +
  '</div>' +

  // Footer
  '<div style="background:' + F + ';padding:32px 48px;text-align:center;">' +
    '<div style="font-family:Georgia,serif;color:' + G + ';font-size:0.75rem;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:8px;">Filthy Rich Soil Co.</div>' +
    '<div style="color:rgba(250,247,240,0.45);font-size:0.72rem;margin-bottom:4px;">Chester County, PA · Ecological Land Stewardship</div>' +
    '<div style="color:rgba(250,247,240,0.4);font-size:0.72rem;">dan@filthyrichsoilco.com · filthyrichsoilco.com</div>' +
    '<div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:0.65rem;color:rgba(255,255,255,0.25);line-height:1.7;">This stewardship profile was generated based on your consultation inputs and represents an initial program estimate. A formal estimate of charges will detail exactly what services you will receive prior to any payment or commitment.</div>' +
  '</div>' +

  '</div></body></html>';
}

export function openEmailPreview() {
  var html = buildEmailHTML();
  var blob = new Blob([html], { type: 'text/html' });
  window.open(URL.createObjectURL(blob), '_blank');
}
