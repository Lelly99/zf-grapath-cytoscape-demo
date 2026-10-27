# Paper-to-Task-3 mapping audit

- Four-method Task-3 common families: 43.
- Paper tutor families: 68.
- Verified five-method families: 43.
- Identity mapping: 61 verified, 0 ambiguous, and 7 unmatched (7 without an exact local identity).
- Of the verified identities, 43 are in the common four-method Task-3 set and 18 are outside it.
- Matching uses the published numeric tutor ID, the source workbook Colony Info Index/Band Number, and an exact normalized full local band ID; no name-similarity or row-order matching is used.
- Published pupil membership matched exactly for 43/43 verified families.
- Per-recording intervals cannot be confirmed equivalent from the exported entropy tables: the paper table summarizes 10-ms vocal-state windows while Task 3 summarizes segmented syllable category counts, and the available exports do not retain comparable interval identifiers.
- Existing four-method matrix coefficient check: passed (maximum absolute difference: 1.1102230246251565e-16).
- Embeddings and HDBSCAN were not recomputed.
