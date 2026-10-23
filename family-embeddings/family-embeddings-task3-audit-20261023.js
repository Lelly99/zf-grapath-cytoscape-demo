/* Presentation layer for the audited Task-3 analogue export. */
document.addEventListener('DOMContentLoaded', () => {
  const oldRoot = 'balanced-imitation-20261019/';
  const newRoot = 'balanced-imitation-20261023/';
  const section = document.querySelector('#bi-analogue');
  if (!section || section.dataset.task3Audit20261023) return;
  section.dataset.task3Audit20261023 = 'true';
  section.querySelectorAll('img[src^="' + oldRoot + '"], a[href^="' + oldRoot + '"]').forEach(node => {
    const attribute = node.tagName === 'IMG' ? 'src' : 'href';
    node.setAttribute(attribute, node.getAttribute(attribute).replace(oldRoot, newRoot));
  });
  const figure = section.querySelector('img[src$="fig_analogue_4h_family_lines.png"]');
  if (figure) {
    figure.width = 2470; figure.height = 2210;
    figure.alt = 'Four by four family-line entropy analogue: raw and normalized mean individual and raw-count-pooled pupil entropy across four embeddings';
    const caption = figure.closest('figure')?.querySelector('figcaption');
    if (caption) caption.firstChild.textContent = 'Audited 4×4 family-line analogue. Pooled-panel annotations now use the pooled endpoints shown. ';
  }
  const ceiling = document.createElement('figure');
  ceiling.innerHTML = `<img loading="lazy" width="1560" height="585" src="${newRoot}task3_analogue/fig_family_cluster_ceiling_distribution.png" alt="Distributions of family-specific category counts and entropy ceilings"><figcaption>Distribution of K_family and log2(K_family); noise category −1 is included. <a download href="${newRoot}task3_analogue/fig_family_cluster_ceiling_distribution.png">Download</a></figcaption>`;
  figure?.closest('figure')?.after(ceiling);
  const auditLinks = document.createElement('p');
  auditLinks.innerHTML = `<a download href="${newRoot}task3_analogue/task3_data_audit.md">Data audit report</a> · <a download href="${newRoot}task3_analogue/task3_record_provenance.csv">record provenance</a> · <a download href="${newRoot}task3_analogue/task3_family_membership_audit.csv">family membership audit</a> · <a download href="${newRoot}task3_analogue/task3_cluster_cardinality_audit.csv">cluster-cardinality audit</a> · <a download href="${newRoot}task3_analogue/illustrative_panel_statistics.csv">displayed panel statistics</a> · <a download href="${newRoot}task3_analogue/illustrative_family_cluster_ceilings.csv">named K_family table</a>`;
  ceiling.after(auditLinks);
  const explanation = document.createElement('section');
  explanation.className = 'how-to-read';
  explanation.innerHTML = `<h3>What the family-entropy lines measure</h3><p>For a distribution p over K shared within-family categories, Shannon entropy is <code>H(p) = −Σ pₖ log₂ pₖ</code>, with <code>0 log₂ 0 = 0</code>. Each family has its own partition, so the normalized display is <code>H_norm,j = Hⱼ / log₂(Kⱼ)</code>. This accounts for different theoretical ceilings, but does not make distinct embedding geometries biologically equivalent.</p><p><strong>Mean individual pupil entropy</strong> is <code>mean H(P) = (1/n)ΣH(Pᵢ)</code>; each pupil has equal weight. Its tutor contrast is <code>mean ΔH = mean H(P) − H(T)</code>. <strong>Raw pooled pupil entropy</strong> instead uses <code>p_count = Σwᵢpᵢ</code>, where <code>wᵢ = Nᵢ/ΣNᵢ</code>: pupils with more observations receive more weight. The displayed pooled contrast is <code>H(p_count) − H(T)</code>.</p><p>An equal-weight pooled alternative is <code>p_equal = (1/n)Σpᵢ</code>, with entropy <code>H(p_equal)</code>. It is documented here but not added to this Task-3 figure. Correct pooling gains require matched weights: <code>H(p_equal) − mean H(P) ≥ 0</code> and <code>H(p_count) − ΣwᵢH(Pᵢ) ≥ 0</code>. The difference <code>H(p_count) − mean H(P)</code> is not, by itself, a Jensen gap.</p><h3>Individual diversity versus collective diversity</h3><p>Individual and pooled pupil entropy answer different scientific questions. Mean individual entropy asks whether a typical pupil has a more diverse vocal-state distribution than its tutor. Pooled entropy asks how diverse the pupils’ combined repertoire is. A family can have <code>mean H(P) &lt; H(T)</code> while <code>H(p_count) &gt; H(T)</code>, consistent with complementary pupil repertoires. Entropy alone cannot establish which tutor states were reproduced, better imitation, or a causal learning effect.</p><p>The dashed line is the median of included family tutors on the displayed scale. The historical <code>rev_share</code> statistic instead uses separate tutor and pupil-summary medians; it is a relative-median-crossing metric, not crossing one common entropy threshold.</p>`;
  auditLinks.after(explanation);
});
