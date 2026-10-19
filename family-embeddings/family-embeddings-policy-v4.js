/* Author-policy v4 presentation layer.  It is display-only: result JSON/CSV
 * files remain immutable and every unavailable item stays visible. */
(() => {
  'use strict';
  const DOI = 'https://doi.org/10.1038/s41467-021-22852-3';
  const citation = '<span class="origin-tag paper-origin">Origin: <a href="'+DOI+'">Paper source data</a></span>';
  const analysis = '<span class="origin-tag analysis-origin">Origin: New analysis</span>';
  const exclusions = [
    ['Aq12*','t-SNE (Euclidean and cosine), numeric-LR=200 rollout','CUDA out of memory during t-SNE fit (N = 17,874); a wrapper “exit 0” is a logging flaw, not success.','Partially available: published UMAP and PCoA remain valid.','A larger GPU memory budget or an approved different t-SNE configuration, labelled as a separate sensitivity.','2026-10-19'],
    ['Gry12*','rollout variants','Worker memory/time ceiling; published UMAP/PHATE/PCA blocks are host- or GPU-memory limits as labelled.','Not yet available for the held variants.','An admitted run within the relevant memory/time budget.','2026-10-19'],
    ['R39* and Y16*','local acoustic analysis','Tutor or pupil local audio is unresolved. Published outcome values remain visible.','Held out of local acoustic analysis.','Resolve and verify the local tutor/pupil audio identities.','2026-10-19'],
    ['LP5†','Figure 2a frozen cohort','LP5 occurs in the paper Fig. 1 workbook but is not a Figure 2a tutor.','Included in all analysable lineages; excluded from frozen Figure 2a cohort.','No action; this is a documented cohort distinction.','2026-10-18'],
    ['2026-10-13 t-SNE blocks*','110 historical t-SNE blocks','Stopped by the project numeric-learning-rate guard.','Not historical results; GPU-native adaptive/LR=200 is separately labelled pending sensitivity.','A validated, explicitly labelled sensitivity run.','2026-10-19'],
    ['Aq32 and unresolved identities*','held pairs/families','Existing catalogued hold or unresolved identity.','Held or unresolved; never represented as zero.','Resolve the recorded hold or identity evidence.','2026-10-19']
  ];
  const make = (tag, attrs = {}, html = '') => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    node.innerHTML = html;
    return node;
  };
  const note = (id, title, html) => make('details', {class:'definition', id}, `<summary>${title}</summary>${html}<p><a href="#exclusions-asterisks">Exclusions and asterisks</a></p>`);
  const addAfter = (anchor, node) => { if (anchor && !document.getElementById(node.id)) anchor.after(node); };

  function addExclusions() {
    const main = document.querySelector('main');
    if (!main || document.querySelector('#exclusions-asterisks')) return;
    const rows = exclusions.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
    const section = make('section', {id:'exclusions-asterisks', class:'asterisk-section'},
      `<div class="section-kicker">Availability policy</div><h2>Exclusions and asterisks</h2><p><strong>* excluded for now; see this table.</strong> A dagger (†) marks a documented cohort distinction rather than a failed result. No excluded or held item is treated as zero or silently removed.</p><div class="table-wrap" tabindex="0"><table><caption>Items not currently included in every analysis</caption><thead><tr><th>Item</th><th>Asterisk</th><th>Reason</th><th>Current status</th><th>Needed to include it</th><th>Date recorded</th></tr></thead><tbody>${rows}</tbody></table></div>`);
    const review = document.querySelector('#needs-review');
    (review ? review.after.bind(review) : main.prepend.bind(main))(section);
    const toc = document.querySelector('.report-toc');
    if (toc) toc.appendChild(make('a', {href:'#exclusions-asterisks'}, 'Exclusions and asterisks'));
  }

  function tagOrigins() {
    const lineage = document.querySelector('#lineage-targets');
    if (lineage && !lineage.querySelector('.origin-tag')) {
      lineage.querySelector('h2')?.after(make('p', {class:'origin-line'}, `${citation} Published similarity/influence, clutch means, and lineage means. ${analysis} Matched local tutors, family partitions, Stage S2/S7 associations, LOLO, Hopkins, and cuML summaries.`));
      lineage.querySelector('h3')?.after(make('p', {class:'origin-line'}, analysis));
    }
    document.querySelector('#full-results h2')?.after(make('p', {class:'origin-line'}, analysis));
    document.querySelector('#august-family-analysis h2')?.after(make('p', {class:'origin-line'}, analysis));
  }

  function markAsterisks() {
    const lineageMarks = {Aq12:'Aq12*', R39:'R39*', Y16:'Y16*', LP5:'LP5†'};
    document.querySelectorAll('#lineage-targets strong, #lineage-targets svg text').forEach((node) => {
      const value = node.textContent.trim();
      if (lineageMarks[value]) node.textContent = lineageMarks[value];
    });
    document.querySelectorAll('#af-family option').forEach((option) => {
      if (/^(Aq_12|Gry_12)\b/.test(option.textContent) && !option.textContent.includes('*')) option.textContent = option.textContent.replace(/^(Aq_12|Gry_12)/, '$1*');
    });
    document.querySelectorAll('#af-details, #lineage-targets h2, #full-results h2').forEach((node) => {
      if (!node.querySelector('.asterisk-link')) node.insertAdjacentHTML('beforeend', ' <a class="asterisk-link" href="#exclusions-asterisks" aria-label="See exclusions and asterisks">*</a>');
    });
  }

  function addInlineDefinitions() {
    const comparison = document.querySelector('#af-comparison');
    addAfter(comparison, note('family-entropy-definition', 'How to read the shared-partition entropy table',
      '<p><strong>H</strong> = −Σp log<sub>2</sub>p in bits over shared HDBSCAN categories; 2<sup>H</sup> is the effective number of equally likely categories. <strong>Noise included</strong> treats label −1 as one category with all N syllables as denominator. <strong>Assigned only</strong> removes noise and renormalises over assigned syllables.</p><p><strong>Equal-weight mean pupil H</strong> is the unweighted mean of per-pupil H, not pooled-pupil entropy. Pooled H equals the count-weighted mean plus the generalised Jensen–Shannon divergence between pupil category distributions; the published pooled-minus-weighted-mean gap averages about 0.9 bits. Comparing tutor H with pooled-pupil H would therefore create a spurious difference. Equal H does not imply category overlap, which this table does not measure.</p><p>An eligible pupil has a uniquely agreed published tutor–pupil mapping, resolved local audio, no hold (for example Aq32), and no duplicate. Noise-included H always exists. Assigned-only H is undefined—not zero—when no syllables are assigned: 100 syllables in one real category gives H = 0, while 100 noise syllables give no assigned-only H. “Pupils with defined H / eligible pupils” reports that denominator.</p><p>With noise fraction f, H<sub>incl</sub> = h<sub>b</sub>(f) + (1−f)H<sub>assigned</sub>. Thus H<sub>incl</sub>−H<sub>assigned</sub> = h<sub>b</sub>(f)−fH<sub>assigned</sub>; it is arithmetic, not a biological finding. Noise raises H at small f, then lowers it beyond f* = 0.77, 0.50, 0.29, 0.16 for assigned H = 1, 2, 3, 4 bits. Always read f beside H.</p>'));
    const hopkins = document.querySelector('#af-hopkins');
    addAfter(hopkins, note('family-hopkins-definition', 'How to read Hopkins',
      '<p>On each of 100 deterministic repeats, the larger tutor/pupil pool is subsampled without replacement to the smaller pool: <strong>count balanced</strong> is not recording balanced. Unbalanced values depend on N, so balanced values are preferred for tutor–pupil comparison.</p><p>Hopkins uses H = Σw² / (Σw² + Σu²), where w is a real point’s nearest-other-real distance and u is a uniform synthetic point’s nearest-real distance. It is computed in 2-D with squared distances and uniform-by-area sampling in each group’s convex hull. Here 0 indicates concentration and 0.5 is the null reference. Hull outliers and empty areas can make H small; calibration of this null remains open. Repeat SD/quantiles are Monte-Carlo variation, not confidence intervals.</p>'));
    const pair = document.querySelector('#pair-analysis');
    if (pair && !document.querySelector('#pair-definition-v4')) pair.querySelector('h2')?.after(note('pair-definition-v4', 'Pair-table definitions',
      '<p><strong>Inclusive denominator</strong> is all N observations; <strong>assigned denominator</strong> is N − noise; noise fraction = noise n/N. Evenness = H/log<sub>2</sub>K with K occupied categories, including noise in the inclusive treatment; it is undefined for K &lt; 2. Duration is the retained interval length (min/median/max seconds), not a whole vocalization. Example: an Aq_12 tutor with 662 syllables, 7 noise, and two real categories has assigned H = 0.910, K = 2, evenness = 0.910; inclusive H = 0.985, K = 3, evenness = 0.621.</p><p>Pair arrays are right-padded with silence to the pair’s longest interval; they are not time-stretched, so values are not a shared metric across pairs. Unwhitened PCA75 is joint tutor+pupil PCA retaining ≥75% variance without division by √eigenvalue. HDBSCAN resolution is a pair: minimum mass m/N and density-smoothing length scale set by min_samples; equal fractions do not imply equal length-scale resolution. Interface availability for PCoA, UMAP, t-SNE, and PHATE is not a completed result.</p>'));
    const full = document.querySelector('#full-results');
    if (full && !document.querySelector('#full-definition-v4')) full.querySelector('h2')?.after(note('full-definition-v4', 'Full-cohort table definitions',
      '<p>mcsA_msB means HDBSCAN min_cluster_size=A and min_samples=B (cuML, Euclidean, EOM, no single cluster): (64,20) reference, (32,20) finer, (128,20) coarser, (64,40) more conservative. Noise n (%) is label −1 divided by 31,061 (for example 504/31,061 = 1.62%); fit seconds are GPU planning time only, never a selection criterion.</p><p>GPU cuML float32 and CPU float64 outputs are shown separately: the core-distance tolerance check failed, so tie/MST and CPU equivalence are not claimed. Category 20 contains 57% of observations. Family t-SNE uses cuML random/FFT/adaptive settings (perplexity 30, max_iter 1000); adaptive learning is N-dependent, so “LR=200” is a configuration label, not an effective historical scikit-learn equivalent. Coordinates are not backend- or run-reproducible.</p><p><strong>Cutoffs on this page:</strong> historical percentile cutoffs (not used in new runs); the descriptive 5 ms inventory split (not a QC rule); 23 discard, 10 keep, and one manual-exclusion review decisions; and density settings. No new duration threshold is permitted by the current protocol.</p>'));
    const fullHopkins = document.querySelector('#full-hopkins');
    if (fullHopkins && !document.querySelector('#full-hopkins-definition-v4')) fullHopkins.querySelector('h2')?.after(note('full-hopkins-definition-v4', 'Selected-projection Hopkins definitions',
      '<p>H = Σw²/(Σw² + Σu²): w is a real point’s nearest-other-real distance and u a uniform synthetic point’s nearest-real distance. The displayed 2-D evaluation squares distances. Synthetic points are uniform by area in the group’s convex hull; outliers and empty space can make H small. A fixed master seed gives 100 repeats; 0.5 is the null reference by construction. Repeat quantiles/SD are Monte-Carlo variation, not confidence intervals.</p><p>“Pair-conditioned refits” would re-embed/re-cluster one pair. These values instead restrict groups within one joint 31,061-point embedding.</p>'));
    const examples = document.querySelector('#full-examples');
    if (examples && !document.querySelector('#examples-definition-v4')) examples.querySelector('h2')?.after(note('examples-definition-v4', 'Reference spectrogram definitions',
      '<p>Maximum membership is the point with highest membership strength in a category. Strength is the point’s depth in that density hierarchy (1 = densest core; noise = 0); it is not cluster persistence/stability. This pipeline saves labels and membership strength, not cluster persistence. The 16 examples are the 16 largest of 24 mcs64_ms20 categories, ordered by size then ID; canonical tie-breaking is strength descending then syllable ID ascending. All selected strengths are 1.000, so examples are not prototypes.</p>'));
  }

  function repairPairRawJson() {
    const target = document.querySelector('#pair-detail');
    if (!target) return;
    const clean = () => target.querySelectorAll('pre').forEach((pre) => {
      const details = pre.closest('details');
      if (details) details.replaceWith(make('details', {class:'provenance-summary'}, '<summary>Structured provenance and configuration</summary><p>Download the accompanying public JSON/CSV files for machine-readable provenance. Raw internal objects are intentionally not printed in the report.</p>'));
    });
    new MutationObserver(clean).observe(target, {childList:true, subtree:true});
    clean();
  }

  function addFigureReadingNotes() {
    const comparison = document.querySelector('#af-comparison');
    if (comparison && !document.querySelector('#noise-identity-figure')) comparison.after(make('figure', {id:'noise-identity-figure', class:'report-figure'},
      '<svg viewBox="0 0 720 210" role="img" aria-label="Noise fraction versus the arithmetic difference between inclusive and assigned entropy"><rect width="720" height="210" fill="#fbfcfc"/><path d="M55 175 C130 55 220 52 310 102 S500 176 670 38" fill="none" stroke="#1769aa" stroke-width="3"/><path d="M55 175 C170 88 260 96 350 155 S540 180 670 116" fill="none" stroke="#087f79" stroke-width="3" stroke-dasharray="7 5"/><text x="55" y="198" font-size="13">noise fraction f →</text><text x="55" y="25" font-size="13">H incl − H assigned (bits)</text><text x="470" y="52" font-size="13" fill="#1769aa">H assigned = 1 bit</text><text x="470" y="132" font-size="13" fill="#087f79">H assigned = 3 bits</text></svg><figcaption>Figure 1. Exact noise–entropy identity, not a fitted biological relationship.</figcaption><div class="how-to-read"><strong>How to read this figure.</strong> <em>What we expect:</em> every published bird/partition lies exactly on its relevant curve; the identity was checked on 2,466 rows (error 3×10<sup>−15</sup>). <em>Why:</em> noise adds binary uncertainty and reweights the assigned part. <em>What it does not show:</em> that noise is a syllable type or which treatment is biologically right; noise-inclusive H is the frozen protocol’s primary treatment.</div>'));
    if (comparison && !document.querySelector('#tutor-pupil-figure')) comparison.after(make('figure', {id:'tutor-pupil-figure', class:'report-figure'},
      '<svg viewBox="0 0 720 220" role="img" aria-label="Published tutor-pupil entropy summary"><rect width="720" height="220" fill="#fbfcfc"/><text x="30" y="28" font-size="14" font-weight="700">A. Equal-weight pupil H − tutor H</text><line x1="70" y1="82" x2="290" y2="82" stroke="#1769aa" stroke-width="5"/><line x1="178" y1="62" x2="178" y2="103" stroke="#17222d" stroke-width="2"/><text x="70" y="122" font-size="13">bootstrap 95% interval: −0.18 to +0.06 bits</text><text x="122" y="58" font-size="13">mean −0.06</text><text x="385" y="28" font-size="14" font-weight="700">B. Jensen inflation</text><line x1="405" y1="172" x2="665" y2="55" stroke="#6f8792" stroke-width="2"/><circle cx="470" cy="125" r="6" fill="#1769aa"/><circle cx="535" cy="106" r="6" fill="#1769aa"/><circle cx="604" cy="74" r="6" fill="#1769aa"/><text x="405" y="198" font-size="13">pooled pupil H − tutor H →</text><text x="30" y="160" font-size="14" font-weight="700">C. Treatment differences track noise imbalance</text><path d="M70 195 L285 143" stroke="#087f79" stroke-width="3"/><text x="70" y="212" font-size="13">mean pupil noise − tutor noise →</text></svg><figcaption>Figure 2. Tutor–pupil entropy summaries from the published 2026-10-13 snapshot (797 partitions).</figcaption><div class="how-to-read"><strong>How to read this figure.</strong> <em>What we expect:</em> the equal-weight gap is near zero (mean −0.06 bits; family bootstrap 95% intervals [−0.18, +0.06] inclusive and [−0.18, +0.07] assigned-only), so say “no detectable difference,” not “no difference.” Pooled-pupil H lies above the equal-weight comparison because of Jensen–Shannon heterogeneity. <em>Why:</em> pooling measures between-pupil heterogeneity as well as individual diversity. <em>What it does not show:</em> copying, shared categories, or a causal/developmental effect.</div>'));
    const hopkins = document.querySelector('#af-hopkins');
    if (hopkins && !document.querySelector('#hopkins-balance-figure')) hopkins.after(make('figure', {id:'hopkins-balance-figure', class:'report-figure'},
      '<svg viewBox="0 0 720 205" role="img" aria-label="Hopkins balanced versus unbalanced summary"><rect width="720" height="205" fill="#fbfcfc"/><line x1="70" y1="170" x2="675" y2="170" stroke="#8ca0a8"/><line x1="70" y1="30" x2="70" y2="170" stroke="#8ca0a8"/><path d="M85 55 C210 78 330 110 650 152" fill="none" stroke="#b66b15" stroke-width="4"/><path d="M85 110 C250 112 430 106 650 112" fill="none" stroke="#087f79" stroke-width="4"/><text x="85" y="48" font-size="13" fill="#9a5711">unbalanced: Spearman −0.47 with N</text><text x="85" y="102" font-size="13" fill="#087f79">count-balanced: Spearman −0.04 with N</text><text x="470" y="193" font-size="13">points per repeat →</text><text x="12" y="25" font-size="13">Hopkins H</text></svg><figcaption>Figure 3. Why count-balanced Hopkins is preferred for tutor–pupil comparison.</figcaption><div class="how-to-read"><strong>How to read this figure.</strong> <em>What we expect:</em> unbalanced H decreases with pool size while count-balanced H does not. <em>Why:</em> more points shorten nearest-neighbour distances, so the larger pool can look more concentrated for N alone; balancing subsamples it on each repeat. <em>What it does not show:</em> a confidence interval, recording-balanced sampling, or original-space clusterability.</div>'));
  }

  function addStyles() {
    if (document.querySelector('#policy-v4-styles')) return;
    document.head.appendChild(make('style', {id:'policy-v4-styles'}, '.asterisk-section{margin:0 0 2.5rem;padding:1.2rem;background:#fffaf0;border:1px solid #e4cc9a;border-left:5px solid #9b650c;border-radius:12px}.asterisk-link{color:#8b5607;font-weight:800;text-decoration:none}.origin-tag{display:inline-block;margin:.1rem .25rem .1rem 0;padding:.14rem .42rem;border-radius:999px;font:700 .72rem/1.2 system-ui}.paper-origin{background:#edf4fb;color:#1d527d}.analysis-origin{background:#e9f5f2;color:#17655d}.origin-line{font-size:.9rem;color:#51616d}.definition{margin:.9rem 0;padding:.65rem .85rem;background:#f3f8f8;border:1px solid #c9dcdd;border-radius:8px}.definition p{max-width:90ch}.how-to-read{margin:.75rem 0 0;padding:.7rem .8rem;border-left:3px solid #136b68;background:#edf6f5;font-size:.92rem;line-height:1.55}.provenance-summary{margin:.6rem 0;padding:.4rem .65rem;background:#f5f7f7;border-radius:6px}'));
  }

  function run() {
    addStyles();
    addExclusions();
    tagOrigins();
    markAsterisks();
    addInlineDefinitions();
    repairPairRawJson();
    addFigureReadingNotes();
    document.querySelector('footer')?.insertAdjacentHTML('beforeend', ` · Tchernichovski O, Eisenberg-Edidin S, Jarvis ED (2021), <a href="${DOI}">Nature Communications 12:2562</a>`);
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(run, 40));
})();
