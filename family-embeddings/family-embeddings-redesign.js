/* Presentation layer for the family-embeddings report.
 * It deliberately does not alter measurements, result files, or analysis state.
 */
(() => {
  'use strict';

  const html = String.raw;
  const reviewTopics = [
    ['Stage S7 inference', 'The cross-lineage association needs a pre-stated primary analysis, multiple-comparison handling, effect-size intervals, and a relatedness-aware model before it can be presented as confirmatory.'],
    ['Counts and cohorts', 'Per-bird flow is supplied: 406,625 source intervals, 1,793 rejected, and 404,832 retained. Stage S7’s 23 all-analysable lineages remain separate from the frozen 24-lineage Figure 2a cohort, whose 22 analysable members have not yet been computed.'],
    ['Estimator and clustering checks', 'Small-sample bias has been assessed with Miller–Madow and rarefaction. Hopkins has been calibrated by simulation; applying that calibration to observed embeddings remains open.'],
    ['Segmentation and duration', 'Duration is the retained interval length (min/median/max seconds), given WhisperSeg segmentation. Manual quality-control documentation and a duration-normalised sensitivity analysis remain open before interpreting categories as biological syllables.'],
    ['Balanced-imitation test', 'Partially replicated; partition instability not yet modelled.'],
    ['Tutor relationship definition', 'Tutor/pupil means the published tutor label and a catalogued mapping; exposure is not independently verified. The genetic, rearing, and exposure wording remains unresolved for some rows.']
  ];

  function make(tag, attrs = {}, content = '') {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') node.className = value;
      else if (key === 'html') node.innerHTML = value;
      else node.setAttribute(key, value);
    });
    if (content) node.textContent = content;
    return node;
  }

  function openThenScroll(target) {
    if (!target) return;
    for (let parent = target.closest('details'); parent; parent = parent.parentElement?.closest('details')) parent.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  function nearestHeading(node) {
    let current = node;
    while (current && current !== document.body) {
      let previous = current.previousElementSibling;
      while (previous) {
        if (/^H[1-3]$/.test(previous.tagName)) return previous.textContent.trim();
        previous = previous.previousElementSibling;
      }
      current = current.parentElement;
    }
    return 'Report data';
  }

  function addCaptioning() {
    let tableNo = 0;
    document.querySelectorAll('main table').forEach((table) => {
      tableNo += 1;
      if (!table.querySelector('caption')) {
        const caption = make('caption', {}, `Table ${tableNo}. ${nearestHeading(table)}.`);
        table.insertBefore(caption, table.firstChild);
      }
      const wrapper = table.parentElement?.classList.contains('table-wrap') ? table.parentElement : null;
      if (wrapper) wrapper.setAttribute('tabindex', '0');
    });
    let figureNo = 0;
    document.querySelectorAll('main img:not(.qr)').forEach((image) => {
      if (image.closest('figure')) return;
      figureNo += 1;
      const figure = make('figure', { class: 'report-figure' });
      image.parentNode.insertBefore(figure, image);
      figure.appendChild(image);
      figure.appendChild(make('figcaption', {}, `Figure ${figureNo}. ${image.alt || nearestHeading(image)}.`));
    });
  }

  function buildToc() {
    const aside = document.querySelector('aside .sidebox');
    const main = document.querySelector('main');
    if (!aside || !main) return;
    const toc = make('nav', { class: 'report-toc', 'aria-label': 'Report contents' });
    toc.appendChild(make('h2', {}, 'Contents'));
    const headings = [...main.querySelectorAll('h2')];
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const link = make('a', { href: `#${heading.id}` }, `${index + 1}. ${heading.textContent.trim()}`);
      if (heading.closest('details')) link.classList.add('toc-nested');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        history.replaceState(null, '', link.getAttribute('href'));
        openThenScroll(heading);
      });
      toc.appendChild(link);
    });
    aside.replaceChildren(toc);
  }

  function addNeedsReview(main) {
    const summary = reviewTopics.map(([title, description]) => `<li><strong>${title}:</strong> ${description}</li>`).join('');
    const review = make('section', {
      id: 'needs-review',
      class: 'needs-review',
      html: `<div class="section-kicker">Interpretation status</div><h2>Needs review / answer</h2><p>The results and their source files are retained below. The items in this panel are not missing data silently filled with assumptions; they are questions that must be answered, re-analysed, or cited before stronger public claims are made.</p><ul>${summary}</ul><p class="review-footer">Until then, treat the report as descriptive and exploratory.</p>`
    });
    main.insertBefore(review, main.firstChild);
    const labels = [
      ['#lineage-targets h3', 'S7 / inference needs review'],
      ['#full-hopkins h2', 'Hopkins validation needs review'],
      ['#august-family-analysis h2', 'definitions and cohort flow need review']
    ];
    labels.forEach(([selector, label]) => document.querySelectorAll(selector).forEach((heading) => heading.appendChild(make('span', { class: 'review-chip' }, label))));
  }

  function tuneHero() {
    const lead = document.querySelector('.hero .lead');
    if (lead) lead.textContent = 'An exploratory report on acoustic category occupancy within zebra finch tutor families, with family-level summaries, historical results, and interactive views.';
    const actions = document.querySelector('.hero .actions');
    if (!actions) return;
    actions.innerHTML = '<a class="button" href="#needs-review">Read results and cautions</a><a class="button" href="#full-explorer">Open explorer</a><span class="secondary-actions"><a href="gallery.html">Visual gallery</a><a href="hopkins-entropy/">Hopkins & entropy</a><a href="qr/family_embeddings_all.png">QR code</a></span>';
    const mobileNav = document.querySelector('.hero .mobile-nav');
    if (mobileNav) mobileNav.innerHTML = '<a class="button" href="#needs-review">Read results and cautions</a>';
    actions.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      openThenScroll(target);
    }));
  }

  function addDefinitions() {
    const section = document.querySelector('#august-family-analysis');
    if (!section) return;
    const definitions = make('details', {
      class: 'definitions',
      html: '<summary>Short glossary</summary><p><strong>Entropy:</strong> H = −Σ pᵢ log₂pᵢ; <strong>effective categories</strong> = 2<sup>H</sup>, the number of equally likely categories with the same H (Hill number of order 1). Inline notes below each table give the denominator and noise treatment.</p><p><strong>Evenness:</strong> H / log₂(K), with K occupied categories (noise is one category when included); it is undefined when K &lt; 2. <strong>Min. cluster size/min. samples:</strong> ceil(fraction × N), with fractions 0.005, 0.01, and 0.02; a larger fraction yields a coarser partition.</p>'
    });
    section.insertBefore(definitions, section.querySelector('#af-details'));
  }

  function addCoverageFilter() {
    const table = document.querySelector('#pair-coverage')?.closest('table');
    if (!table) return;
    const host = table.closest('details')?.querySelector('p');
    const input = make('input', { type: 'search', class: 'table-filter', placeholder: 'Filter coverage rows', 'aria-label': 'Filter coverage rows' });
    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      table.querySelectorAll('tbody tr').forEach((row) => { row.hidden = term && !row.textContent.toLowerCase().includes(term); });
    });
    if (host) host.after(input);
  }

  function replaceDisplayedTaskIds() {
    const taskId = /\b[0-9a-f]{16,}\b/ig;
    const scrub = (node) => {
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      if (!taskId.test(node.nodeValue)) return;
      taskId.lastIndex = 0;
      const original = node.nodeValue.match(taskId)?.[0];
      node.nodeValue = node.nodeValue.replace(taskId, 'Pair task (original and PCA75 arms)');
      if (original && node.parentElement?.matches('td')) node.parentElement.title = original;
    };
    const main = document.querySelector('main');
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) scrub(walker.currentNode);
    new MutationObserver((changes) => changes.forEach((change) => {
      if (change.type === 'characterData') scrub(change.target);
      else change.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) scrub(node);
        else node.querySelectorAll?.('*').forEach((element) => element.childNodes.forEach(scrub));
      });
    })).observe(main, { childList: true, subtree: true, characterData: true });
  }

  function addLightbox() {
    if (document.querySelector('#report-lightbox')) return;
    const box = make('div', { id: 'report-lightbox', class: 'report-lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Expanded report figure', hidden: '' });
    const close = make('button', { type: 'button', class: 'lightbox-close', 'aria-label': 'Close expanded figure' }, 'Close');
    const image = make('img', { alt: '' });
    box.append(close, image);
    const dismiss = () => { box.hidden = true; image.removeAttribute('src'); };
    close.addEventListener('click', dismiss);
    box.addEventListener('click', (event) => { if (event.target === box) dismiss(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') dismiss(); });
    document.body.appendChild(box);
    const isFigure = (source) => source instanceof HTMLImageElement && source.closest('main figure, main .report-figure');
    const open = (source) => { image.src = source.currentSrc || source.src; image.alt = source.alt || 'Expanded report figure'; box.hidden = false; close.focus(); };
    const prepare = (source) => { if (isFigure(source)) { source.classList.add('zoomable-figure'); source.tabIndex = 0; } };
    document.querySelectorAll('main figure img, main .report-figure img').forEach(prepare);
    document.addEventListener('click', (event) => { if (isFigure(event.target)) open(event.target); });
    document.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && isFigure(event.target)) { event.preventDefault(); open(event.target); }
    });
  }

  function addSelectionPermalink() {
    const section = document.querySelector('#august-family-analysis');
    const family = document.querySelector('#af-family');
    const variant = document.querySelector('#af-variant');
    const resolution = document.querySelector('#af-resolution');
    if (!section || !family || !variant || !resolution) return;
    const button = make('button', { type: 'button', class: 'copy-link' }, 'Copy selection link');
    button.addEventListener('click', async () => {
      const hash = `family=${encodeURIComponent(family.value)}&variant=${encodeURIComponent(variant.value)}&fraction=${encodeURIComponent(resolution.value)}`;
      const url = `${location.origin}${location.pathname}#${hash}`;
      try { await navigator.clipboard.writeText(url); button.textContent = 'Copied'; }
      catch { button.textContent = 'Copy unavailable'; }
      setTimeout(() => { button.textContent = 'Copy selection link'; }, 1600);
    });
    section.querySelector('#af-details')?.before(button);
  }

  function improveFullExplorer() {
    const host = document.querySelector('#full-explorer');
    if (!host || !window.Plotly || typeof refresh !== 'function') return;
    const palette = ['#1f77b4','#d55e00','#009e73','#cc79a7','#e69f00','#0072b2','#56b4e9','#a6761d','#984ea3','#4daf4a','#e41a1c','#377eb8','#f781bf','#999999','#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3','#1b9e77','#7570b3'];
    const originalReact = window.Plotly.react.bind(window.Plotly);
    window.Plotly.react = (id, traces, layout, config) => {
      if (id === 'full-plot') {
        traces.sort((a, b) => Number(String(a.name).match(/-?\d+/)?.[0]) - Number(String(b.name).match(/-?\d+/)?.[0]));
        traces.forEach((trace, index) => {
          const isNoise = /noise/i.test(trace.name);
          trace.marker = {...trace.marker, color:isNoise ? '#a7b0b6' : palette[index % palette.length], opacity:isNoise ? .22 : .72, symbol:trace.customdata?.map((datum) => datum[3] === 'tutor' ? 'circle-open' : 'circle'), line:{width:1,color:'#26343c'}};
          trace.customdata = trace.customdata?.map((datum) => [...datum.slice(0, 5), Math.round(Number(datum[5]) * 10000) / 10]);
          trace.hovertemplate = 'category: %{customdata[0]}<br>bird: %{customdata[2]}<br>role: %{customdata[3]}<br>date: %{customdata[4]}<br>duration: %{customdata[5]} ms<extra>%{fullData.name}</extra>';
        });
        layout = {...layout, legend:{...layout.legend, title:{text:'Category · rings=tutor; dots=pupil'}, itemsizing:'constant'}};
      }
      return originalReact(id, traces, layout, config);
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      refresh();
    }, {rootMargin:'280px 0px'});
    observer.observe(host);
  }

  function injectStyles() {
    const style = make('style', { html: html`
      :root{--ink:#1b2730;--muted:#586773;--paper:#fff;--wash:#f5f7f7;--line:#d8e0e1;--blue:#1f5f91;--teal:#136b68;--gold:#b97818;--review:#875914;--review-bg:#fff6df}
      html{scroll-padding-top:1.2rem}.skip-link{position:fixed;left:1rem;top:-4rem;z-index:10;background:#fff;color:#102f46;padding:.6rem .8rem;border-radius:.4rem}.skip-link:focus{top:1rem}
      body{font-size:16px;line-height:1.65;overflow-x:hidden}.hero{padding:clamp(2.5rem,8vw,5rem) 1.25rem 3rem;background:linear-gradient(135deg,#15384b,#246b68)}.hero h1{max-width:18ch}.lead{font-size:1.12rem}.actions{align-items:center}.actions .button{box-shadow:0 2px 0 #0002}.secondary-actions{display:flex;gap:.65rem;flex-wrap:wrap;font-size:.9rem}.secondary-actions a{color:#dff5f1}
      .layout{width:100%;max-width:min(96vw,1800px);grid-template-columns:minmax(0,1fr) clamp(190px,14vw,240px);gap:0}.layout main{min-width:0;border-radius:14px;box-shadow:0 5px 22px #1434490e}.layout main>section,.layout main>details,.layout main>h2,.layout main>p,.layout main>hr{max-width:100%}main h2{margin-top:3rem;border-top-color:var(--teal);scroll-margin-top:1.2rem}main h3{scroll-margin-top:1.2rem}.section-kicker{color:var(--teal);font-size:.78rem;font-weight:750;letter-spacing:.08em;text-transform:uppercase}
      .needs-review{margin:0 0 2.5rem;padding:clamp(1rem,3vw,1.8rem);background:var(--review-bg);border:1px solid #e8cb84;border-left:5px solid var(--review);border-radius:12px}.needs-review h2{border:0;margin:.25rem 0 .65rem;padding:0}.needs-review p,.needs-review li{max-width:85ch}.needs-review li+li{margin-top:.55rem}.review-footer{font-weight:700;color:#66420c}.review-chip{display:inline-block;margin:.25rem 0 .25rem .55rem;padding:.16rem .45rem;border:1px solid #d8b36b;border-radius:999px;background:var(--review-bg);color:#70470a;font:650 .68rem/1.25 system-ui;vertical-align:middle}
      .definitions{padding:.75rem 1rem;background:#f1f7f7;border:1px solid #cbdedf;border-radius:10px}.definitions p{margin:.8rem 0}.copy-link{margin:.8rem 0;padding:.48rem .7rem;border:1px solid #9ebec0;border-radius:7px;background:#fff;color:#164e58;font:inherit;font-weight:650;cursor:pointer}
      .table-wrap{max-width:100%;overflow:auto;border:1px solid var(--line);border-radius:8px;background:#fff}.table-wrap::after{content:'Wide comparisons scroll inside this panel; key columns remain visible in the default view.';display:block;padding:.35rem .6rem;color:var(--muted);font-size:.77rem}.table-wrap:focus-visible{outline:3px solid #e3a727;outline-offset:2px}table{width:100%;min-width:0;table-layout:fixed;font-variant-numeric:tabular-nums}caption{text-align:left;padding:.6rem .7rem;background:#f1f5f5;color:#40515c;font-weight:700}th{position:sticky;top:0;z-index:1;background:#e4efef}th,td{min-width:0;white-space:normal;overflow-wrap:anywhere;word-break:break-word;font-size:clamp(.64rem,.9vw,.92rem)}th:first-child,td:first-child{z-index:2;background:inherit;box-shadow:1px 0 #d8e0e1}.table-filter{display:block;width:min(100%,28rem);margin:.8rem 0;padding:.5rem .65rem;border:1px solid #9ebec0;border-radius:7px;font:inherit}.multiverse-controls{margin:.7rem 0}.multiverse-controls button{padding:.45rem .7rem;border:1px solid #527fa4;border-radius:7px;background:#fff;color:#164e58;font:inherit;font-weight:650;cursor:pointer}.multiverse-all{min-width:930px;table-layout:auto}
      figure.report-figure{width:100%;margin:1.5rem 0;border:1px solid var(--line);border-radius:10px;padding:.7rem;background:#fafcfc}main figure img,figure.report-figure img{display:block;width:100%;max-width:none;height:auto;image-rendering:auto}.zoomable-figure{cursor:zoom-in}.report-lightbox{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:2rem;background:#06121ce8}.report-lightbox[hidden]{display:none}.report-lightbox img{max-width:min(96vw,2200px);max-height:88vh;width:auto;height:auto;background:#fff}.lightbox-close{position:fixed;right:1rem;top:1rem;padding:.55rem .75rem;border:1px solid #fff;border-radius:.4rem;background:#fff;color:#132b3a;font:700 .9rem system-ui;cursor:pointer}figcaption{padding:.6rem .2rem 0;color:var(--muted);font-size:.9rem}.report-toc h2{font:700 1.05rem system-ui;margin:.1rem 0 .6rem}.report-toc a{display:block;padding:.32rem 0;color:#285a78;line-height:1.35}.report-toc .toc-nested{padding-left:.75rem;font-size:.91rem;color:#56717b}
      #august-family-analysis{padding:clamp(1rem,3vw,1.6rem)!important;border:1px solid #b9ced0!important;background:#fbfdfd;border-radius:12px}#af-refresh,#af-repair-status{display:none!important}#af-details{margin:.75rem 0;padding:.75rem;background:#f3f7f7;border-radius:8px}#full-plot{border:1px solid var(--line);border-radius:8px}details{border-radius:8px}summary{padding:.25rem 0}a:focus-visible,button:focus-visible,select:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #e3a727;outline-offset:3px}
      .status-chip{display:inline-block;padding:.12rem .42rem;border-radius:999px;font:700 .74rem/1.2 system-ui}.status-complete{background:#dff2e9;color:#145b43}.unavailable{padding:.75rem;background:#f6f1e8;border-left:3px solid #b97818}
      @media(max-width:1100px){.layout{max-width:96vw;grid-template-columns:minmax(0,1fr)}.layout aside{order:-1}.report-toc{max-height:18rem;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:.7rem}.layout main{width:100%}}@media(max-width:850px){.layout{width:100%;max-width:100%;padding:1rem .65rem 3rem}.layout main{padding:1rem;border-radius:10px}.secondary-actions{width:100%}#full-plot{height:480px}.table-wrap{margin-inline:-.15rem}.needs-review{border-left-width:4px}}@media(max-width:430px){body{font-size:15px}.hero{padding-inline:1rem}.actions .button{width:100%;text-align:center}.secondary-actions a{font-size:.84rem}#full-plot{height:420px}main h2{font-size:1.55rem}}
    ` });
    document.head.appendChild(style);
  }

  function run() {
    const main = document.querySelector('main');
    if (!main || document.querySelector('#needs-review')) return;
    document.body.prepend(make('a', { href: '#needs-review', class: 'skip-link' }, 'Skip to report content'));
    injectStyles();
    tuneHero();
    addNeedsReview(main);
    addDefinitions();
    addCaptioning();
    buildToc();
    addCoverageFilter();
    addSelectionPermalink();
    replaceDisplayedTaskIds();
    addLightbox();
    improveFullExplorer();
    if (location.hash.startsWith('#') && !location.hash.includes('=')) openThenScroll(document.getElementById(location.hash.slice(1)));
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(run, 0));
})();
