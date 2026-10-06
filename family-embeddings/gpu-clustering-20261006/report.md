# Full Aq12–DG1 cuML descriptive results — 2026-10-06

All four approved fits completed and passed output integrity checks on31,061 frozen observations. CPU equivalence was explicitly waived; the failed core-distance comparison remains preserved, and neither CPU equivalence nor biological validation is claimed. No selection, representation, original metadata or previous results were changed.

| Setting | Clusters | Noise n (%) | Entropy including noise | Assigned entropy | Fit seconds | Sampled host/GPU peak GiB |
|---|---:|---:|---:|---:|---:|---:|
| mcs64_ms20 | 24 | 504 (1.62%) | 2.737 | 2.661 | 20.25 | 2.90 / 1.19 |
| mcs32_ms20 | 26 | 480 (1.55%) | 2.749 | 2.676 | 16.82 | 2.82 / 1.19 |
| mcs128_ms20 | 21 | 469 (1.51%) | 2.681 | 2.608 | 17.03 | 2.82 / 1.19 |
| mcs64_ms40 | 46 | 7919 (25.49%) | 4.527 | 4.977 | 22.23 | 2.95 / 1.20 |

Entropies are bits; noise is one category in the first treatment and removed with a changed denominator in the second. Fit timing includes GPU fit/synchronization; supervised stages include imports, hashing, transfer and output. Total four-stage execution was139.98s. Monitoring sampled once per approximately1s and therefore cannot establish instantaneous memory peaks. Lowest sampled available RAM was18.11GiB, above the8GiB floor. No observed resource breach or fit failure. GPU memory is total device usage, including baseline. Host cap8GiB, GPU cap6GiB, per-fit7200s, total fit budget8h, additional output budget4GiB remain unchanged.

| Pair | ARI including noise | ARI common assigned | Common assigned n | Noise-transition fraction |
|---|---:|---:|---:|---:|
| mcs64_ms20__mcs32_ms20 | 0.9998 | 0.9999 | 30547 | 0.0014 |
| mcs64_ms20__mcs128_ms20 | 0.9984 | 0.9986 | 30557 | 0.0011 |
| mcs64_ms20__mcs64_ms40 | 0.2344 | 0.1978 | 23065 | 0.2437 |
| mcs32_ms20__mcs128_ms20 | 0.9981 | 0.9984 | 30547 | 0.0025 |
| mcs32_ms20__mcs64_ms40 | 0.2341 | 0.1972 | 23056 | 0.2450 |
| mcs128_ms20__mcs64_ms40 | 0.2374 | 0.2062 | 23097 | 0.2427 |

Changing minimum cluster size with min_samples20 barely changed the main partition. Increasing min_samples to40 substantially changed the partition and raised noise to25.49%; this is resolution dependence, not a reason to select a favorable entropy result. Overall entropy is strongly weighted by unequal observation counts and is not a family or pupil effect.

Reference per-bird results:

| Bird | n | Noise n | Assigned categories | H including noise | Assigned H |
|---|---:|---:|---:|---:|---:|
| Aq_12 | 630 | 45 | 6 | 1.336 | 1.039 |
| Aq_26_HP | 2211 | 42 | 7 | 1.684 | 1.579 |
| Aq_30_HP | 1318 | 23 | 8 | 1.460 | 1.357 |
| Aq_31_HP | 1973 | 7 | 5 | 1.291 | 1.261 |
| Aq_33_HP | 2019 | 22 | 10 | 1.913 | 1.847 |
| Aq_51_HP | 4121 | 35 | 9 | 1.613 | 1.555 |
| DG_1 | 780 | 7 | 6 | 1.374 | 1.312 |
| Lime_21_Y_106 | 3196 | 25 | 9 | 1.972 | 1.921 |
| Lime_22_Y_107 | 104 | 33 | 1 | 0.901 | -0.000 |
| Lime_23_Y_108 | 447 | 76 | 3 | 0.992 | 0.403 |
| Lime_24_Y_109 | 972 | 25 | 2 | 0.234 | 0.063 |
| Lime_29 | 1090 | 78 | 6 | 1.831 | 1.572 |
| Lime_30 | 1268 | 58 | 6 | 1.671 | 1.470 |
| Lime_31_Y_641_06 | 1047 | 13 | 8 | 1.964 | 1.891 |
| Lime_72_Y | 5007 | 5 | 6 | 0.910 | 0.900 |
| Lime_74_Y | 4878 | 10 | 10 | 2.884 | 2.868 |

Counts range from104 (Lime22) to5,007 (Lime72), so these do not provide equivalent repertoire coverage. Lime22 has71 assigned observations in a single reference category and33 noise observations; assigned entropy0 means one assigned category, not absence of acoustic variation. Its104 observations span19 recordings/3dates. The Aq12 pool contains16,281 observations after23 explicit discards; DG1 contains14,780, with Aq32 held out. Historical P90/P85 duration selections remain unequal, including2,017 DG1 observations beyond the Aq12 upper cutoff. No common cutoff was applied.

Duration/support diagnostics (descriptive eta squared including noise, no significance tests):

| Setting | Duration eta² | Support eta² | Noise below5ms | Noise above Aq12 cutoff |
|---|---:|---:|---:|---:|
| mcs64_ms20 | 0.923 | 0.923 | 0.30% | 3.82% |
| mcs32_ms20 | 0.921 | 0.922 | 0.30% | 3.82% |
| mcs128_ms20 | 0.924 | 0.924 | 0.30% | 2.68% |
| mcs64_ms40 | 0.911 | 0.911 | 0.30% | 7.83% |

Support is the clipped count of hop starts before the segment end, a descriptive proxy rather than an assertion that every STFT window has identical signal support. These associations are not causal and do not establish a duration-only explanation. All333 unreviewed sub5ms intervals remain included; they span207 recordings and still limit biological interpretation. Membership strength is distinct from cluster persistence.

Warnings/limitations: optional single-linkage export required the absent CPU `hdbscan` package and was skipped for each fit; labels, membership strengths and completion checks succeeded. No dependency installation or hierarchy reuse followed. cuML26.06.00 uses float32, brute-force neighbor construction with one partition, EOM,alpha1,epsilon0; tie, core-distance and graph/MST equivalence to sklearn are unclaimed. The first synthetic labels agreed but actual core distances failed tolerance. No hidden parameter remapping was applied.

Download the per-bird metrics and occupancy tables below. Full executed-code and resource provenance are retained in the research workspace.

Recommendation: GPU feasibility is demonstrated for this31,061-row representation. Before all-family execution, finalize the eligible cohort, inclusion/QC policy, common support and whether categories must be globally comparable. A global shared fit supports shared categories; independent family fits define different categories and should not be silently substituted. Estimate GPU cost using the chosen full cohort rather than extrapolating these seconds linearly. Keep this exploratory reference and report all sensitivities; do not choose settings for entropy direction. All-family launch, new representations, significance testing, Hopkins and eight embedding variants remain later work.


[Per-bird counts, noise and entropy](bird_metrics.csv) · [Category occupancy counts](occupancy.csv)
