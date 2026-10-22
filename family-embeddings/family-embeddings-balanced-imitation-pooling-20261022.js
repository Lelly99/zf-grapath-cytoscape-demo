/* Presentation layer for the 2026-10-22 Task-1 pooling extension. */
document.addEventListener('DOMContentLoaded', () => {
  const oldRoot = 'balanced-imitation-20261019/';
  const newRoot = 'balanced-imitation-20261022/';
  const paper = document.querySelector('#bi-paper');
  if (!paper || paper.dataset.pooling20261022) return;
  paper.dataset.pooling20261022 = 'true';
  paper.querySelectorAll('img[src^="' + oldRoot + '"], a[href^="' + oldRoot + '"]').forEach(node => {
    const attribute = node.tagName === 'IMG' ? 'src' : 'href';
    node.setAttribute(attribute, node.getAttribute(attribute).replace(oldRoot, newRoot));
  });
  const variants = paper.querySelector('img[src$="fig4h_variants_mean_vs_pooled.png"]');
  if (variants) {
    variants.width = 2380;
    variants.height = 1470;
    variants.alt = 'Five-panel Fig. 4h comparison: mean individual pupils, count-weighted pooling, equal-weight probability pooling, and two comparisons';
    const caption = variants.closest('figure')?.querySelector('figcaption');
    if (caption) caption.firstChild.textContent = 'Fig. 4h variants: mean individual pupils, count-weighted pooling, equal-weight probability pooling, and their comparisons. ';
  }
  const supplement = document.createElement('figure');
  supplement.innerHTML = `<img loading="lazy" decoding="async" width="1820" height="1260" src="${newRoot}task1_paper_reproduction/fig4h_pooling_metrics.png" alt="Supplementary family-level entropy changes, pooling gains, and pupil–tutor Jensen-Shannon divergence"><figcaption>Supplementary family-level diversity and distribution measures. <a download href="${newRoot}task1_paper_reproduction/fig4h_pooling_metrics.png">Download</a></figcaption>`;
  variants?.closest('figure')?.after(supplement);
  const note = document.createElement('div');
  note.className = 'how-to-read';
  note.innerHTML = '<strong>Pooling update.</strong> Mean individual pupil entropy, raw-count pooling, and equal-weight probability pooling are distinct measures. The equal-weight and count-weighted gains are correctly matched Jensen gaps. Pupil–tutor Jensen–Shannon divergence measures cluster allocation difference, not signed diversity change.';
  supplement.after(note);
  const links = document.createElement('p');
  links.innerHTML = `<a download href="${newRoot}task1_paper_reproduction/paper_tutor_family_diversity.csv">Download expanded family table</a> · <a download href="${newRoot}task1_paper_reproduction/reversal_statistics_by_threshold.csv">Download reversal statistics by threshold</a> · <a download href="${newRoot}task1_paper_reproduction/task1_validation.json">Download validation report</a>`;
  note.after(links);
});
