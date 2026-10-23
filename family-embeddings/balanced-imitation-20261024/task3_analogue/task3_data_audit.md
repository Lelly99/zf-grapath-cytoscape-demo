# Task 3 upstream data audit

## Confirmed data checks

- Selected 797 historical and 258 LR=200 result records.
- Provenance entries excluded by the existing selection rule: 8.
- Duplicate `(bird_id, noise_mode, cluster_label)` keys: 0; invalid cardinalities: 0; zero-cardinality rows: 0.
- Family-membership incidents relative to the historical snapshot registry: missing 0, unexpected 0.
- Noise is represented by label `-1`; for noise-included records it is included in K_listed.
- K_listed differs from K_occupied in 0 of 1055 noise-included configurations.

## Intentional methodological constraints

- Each result is a family-specific shared HDBSCAN partition; labels are comparable within, not across, families.
- Normalization retains the historical denominator `log2(K_listed)`, including noise in noise-included mode. The audit does not redefine it.
- LR=200 files are selected only when they contain the exact six completed t-SNE variant/fraction configurations; first selected root wins for a repeated family.

## Unverified or interpretation-dependent items

- The audit can compare LR=200 membership to the historical snapshot registry, but cannot independently validate biological tutor–pupil identity beyond that registry.
- Whether normalization across distinct embedding geometries carries a biological interpretation remains a scientific question, not a data-integrity check.

## Files

- `task3_record_provenance.csv`: source-file discovery and selection status.
- `task3_family_membership_audit.csv`: expected/observed birds and reconstructed counts.
- `task3_cluster_cardinality_audit.csv`: K, noise, duplicate-key, and count-total checks.
