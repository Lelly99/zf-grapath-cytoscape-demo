/* Display-only explorer for validated August family summaries.
 * It reads data.json and never recalculates or changes results. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const labels = {pca_euclidean:'PCA (Euclidean)',pcoa_cosine:'PCoA (cosine)',umap_euclidean:'UMAP (Euclidean)',umap_cosine:'UMAP (cosine)',tsne_euclidean:'t-SNE (Euclidean)',tsne_cosine:'t-SNE (cosine)',phate_euclidean:'PHATE (Euclidean)',phate_cosine:'PHATE (cosine)'};
  const variantLabel = (value) => labels[value] || String(value).replaceAll('_', ' ');
  const esc = (value) => String(value ?? 'not available').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const number = (value, digits = 4) => typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : (value ?? 'not available');
  const readableState = (state) => {
    const raw = String(state?.original_primary_state?.error || state?.error || state?.hopkins_error || '');
    if (!raw) return state?.status || 'not available';
    if (/resource|memory|workspace|gpu/i.test(raw)) return 'Blocked: the available GPU memory is insufficient for this variant.';
    if (/pending|not attempted/i.test(raw)) return 'Pending: no validated result is available yet.';
    return 'Unavailable: this variant has no validated result in this snapshot.';
  };
  const humanDate = (value) => {
    const match = String(value || '').match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/);
    if (!match) return value || 'date not available';
    const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], +(match[4] || 0), +(match[5] || 0)));
    return new Intl.DateTimeFormat('en', {day:'numeric',month:'short',year:'numeric',hour:match[4]?'2-digit':undefined,minute:match[5]?'2-digit':undefined,timeZone:'UTC',timeZoneName:match[4]?'short':undefined}).format(date);
  };
  const table = (caption, rows, columns) => `<div class="table-wrap" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${columns.map(([, label]) => `<th scope="col">${esc(label)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map(([key]) => `<td>${esc(number(row[key]))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const setOptions = (select, options, selected) => {
    select.replaceChildren();
    options.forEach(({value,label,disabled=false}) => select.add(new Option(label, value, false, value === selected && !disabled)));
    options.forEach((item, index) => { select.options[index].disabled = item.disabled; });
    if (!select.value) select.selectedIndex = Math.max(0, options.findIndex((item) => !item.disabled));
  };

  async function start() {
    const response = await fetch('august-family-analysis/data.json', {cache:'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const families = [...data.families].sort((a,b) => b.n_observations-a.n_observations || a.tutor_id.localeCompare(b.tutor_id));
    const findResult = (family, variant, fraction) => data.results.find((result) => result.family_id === family.family_id && result.variant === variant && result.fraction === Number(fraction));
    const familySelect = $('af-family'), variantSelect = $('af-variant'), fractionSelect = $('af-resolution');
    $('af-refresh')?.remove();
    $('af-repair-status')?.remove();
    setOptions(familySelect, families.map((family) => ({value:family.tutor_id,label:`${family.tutor_id} · ${family.pupil_ids.length} pupils · N ${family.n_observations.toLocaleString()}`})));
    const date = humanDate(data.updated_utc);
    $('af-progress').textContent = `${data.results.length} validated family partitions across ${new Set(data.results.map((result) => result.family_id)).size} families. Data snapshot: ${date}.`;

    function variants(family, preferred) {
      const states = family.variant_states || {};
      const values = [...new Set([...(family.variants_available || []), ...Object.keys(states)])];
      const completed = values.filter((value) => data.results.some((result) => result.family_id === family.family_id && result.variant === value));
      setOptions(variantSelect, values.map((value) => ({value,disabled:!completed.includes(value),label:`${variantLabel(value)}${completed.includes(value) ? ' · completed' : ` · ${readableState(states[value])}`}`})), preferred && completed.includes(preferred) ? preferred : completed[0]);
    }
    function fractions(family, variant, preferred) {
      const choices = ['0.005','0.01','0.02'];
      const complete = choices.filter((fraction) => findResult(family,variant,fraction));
      setOptions(fractionSelect, choices.map((fraction) => {
        const result = findResult(family,variant,fraction), mcs = result?.fit?.min_cluster_size;
        return {value:fraction,disabled:!result,label:`${fraction}${mcs ? ` → ${mcs.toLocaleString()} syllables` : ' · unavailable'}`};
      }), preferred && complete.includes(preferred) ? preferred : complete[0]);
    }
    function render({familyChanged=false,variantChanged=false} = {}) {
      const family = families.find((item) => item.tutor_id === familySelect.value) || families[0];
      if (familyChanged) variants(family);
      if (familyChanged || variantChanged) fractions(family,variantSelect.value);
      const variant = variantSelect.value, fraction = fractionSelect.value, result = findResult(family,variant,fraction);
      const completeText = family.complete_catalogued_family ? 'Complete catalogued family.' : 'Incomplete family: unresolved or held members are omitted.';
      $('af-details').innerHTML = `<strong>${esc(completeText)}</strong> ${family.pupil_ids.length} eligible pupils; ${family.n_observations.toLocaleString()} observations. <span class="status-chip status-complete">Completed</span> ${esc(variantLabel(variant))}; minimum cluster size ${result?.fit?.min_cluster_size?.toLocaleString() || 'not available'} (${fraction} of N). This explorer is tabular; embedding plots are available in the visual gallery.`;
      const summary = result?.metrics?.summary_rows || [];
      const entropyRows = summary.map((row) => ({...row,role:row.bird_id===family.tutor_id?'tutor':'pupil',noise_fraction:row.n_total ? row.n_noise/row.n_total : null}));
      $('af-entropy').innerHTML = result ? table('Per-bird entropy summary', entropyRows, [['bird_id','Bird'],['role','Role'],['noise_mode','Noise treatment'],['n_total','N'],['n_recordings','Recordings'],['n_dates','Dates'],['probability_denominator','Entropy denominator'],['noise_fraction','Noise fraction'],['n_occupied_clusters','Occupied categories'],['entropy_bits','H (bits)'],['effective_n_clusters','Effective categories'],['occupied_cluster_evenness','Evenness']]) : '<p class="unavailable">No validated partition is available for this selection.</p>';
      const comparisons = result ? ['noise_included','clustered_only'].map((mode) => {
        const rows = summary.filter((row) => row.noise_mode===mode), tutor = rows.find((row) => row.bird_id===family.tutor_id), pupils = rows.filter((row) => row.bird_id!==family.tutor_id && typeof row.entropy_bits==='number');
        const mean = pupils.length ? pupils.reduce((total,row) => total+row.entropy_bits,0)/pupils.length : null;
        return {mode,tutor:tutor?.entropy_bits,mean_pupil:mean,pupils_with_h:pupils.length,eligible_pupils:family.pupil_ids.length,contrast:typeof tutor?.entropy_bits==='number' && mean!==null ? mean-tutor.entropy_bits : null};
      }) : [];
      $('af-comparison').innerHTML = result ? table('Shared-partition tutor–pupil summary', comparisons, [['mode','Noise treatment'],['tutor','Tutor H (bits)'],['mean_pupil','Mean pupil H (bits)'],['pupils_with_h','Pupils with defined H'],['eligible_pupils','Eligible pupils'],['contrast','Mean pupil − tutor H (bits)']])+'<p>Each pupil has equal weight. These are descriptive family-specific contrasts, not independent biological replicates.</p>' : '<p class="unavailable">No completed shared partition.</p>';
      const hopkins = data.hopkins.find((item) => item.family_id===family.family_id && item.variant===variant);
      $('af-hopkins').innerHTML = hopkins ? table('Hopkins descriptive summary', hopkins.rows.map((row) => ({...row,balanced:row.balanced?'yes':'no'})), [['role','Pool'],['metric','Metric'],['balanced','Count balanced'],['n_available','N available'],['n_per_repeat','N / repeat'],['mean','Mean'],['standard_deviation','Monte Carlo SD'],['status','Status']]) : '<p class="unavailable">No Hopkins summary is available for this selection. A null calibration remains a review item.</p>';
      const stateRows = families.flatMap((item) => Object.entries(item.variant_states || {}).filter(([,state]) => state.status!=='complete').map(([name,state]) => ({tutor:item.tutor_id,variant:variantLabel(name),status:state.status || 'pending',reason:readableState(state)})));
      $('af-states').innerHTML = stateRows.length ? table('Unavailable or pending variants',stateRows,[['tutor','Tutor'],['variant','Embedding'],['status','State'],['reason','Reader summary']]) : '<p>All listed variants have validated summaries.</p>';
    }
    variants(families[0]);
    fractions(families[0],variantSelect.value);
    render();
    familySelect.addEventListener('change', () => render({familyChanged:true}));
    variantSelect.addEventListener('change', () => render({variantChanged:true}));
    fractionSelect.addEventListener('change', () => render());
  }
  start().catch((error) => { $('af-details').textContent = `Validated family summaries could not be loaded (${error.message}). Existing result files were not changed.`; });
})();
