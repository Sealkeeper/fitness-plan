# Anatomy assets

The muscle/tendon and skeleton meshes in `models.js` are derived from:

- **BodyParts3D**, © The Database Center for Life Science (DBCLS), originally developed by Kousaku Okubo and collaborators. License: [Creative Commons Attribution-ShareAlike 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/). [Original database](https://lifesciencedb.jp/bp3d/).
- **Z-Anatomy — The libre 3D atlas of anatomy**, Gauthier Kervyn (design, 3D, anatomy) and contributors. License: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). [Project and attribution instructions](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/Readme.md).

The combined, aligned assets and mesh metadata were obtained from [Johan Bellander / BodyExplorer](https://github.com/JohanBellander/BodyExplorer), commit `7d04bf3c4de2bd9cb234dd51d7e6857c099afafd`. Its source-code license does not replace the underlying mesh licenses.

Changes in this project: triangle simplification (muscle ratio 0.55; skeleton ratio 0.4; error tolerance 0.0005), deduplication, pruning of unused/degenerate data, vertex quantization and Meshopt compression, and base64 packaging for offline `file://` use. Every surviving anatomical node retains its source name; the mesh mapping includes source and FMA identifiers where supplied. Runtime coordinates are rotated and uniformly scaled for display, using one common transformation for muscles and bones. No muscle is fabricated or relocated independently.

**Derivative meshes remain under their respective original ShareAlike licenses.** Preserve this attribution and license links when redistributing `models.js` or an exported HTML containing its data. The viewer also displays this attribution so exported HTML retains it.

The viewer's original Chinese summaries refer to the relevant sections of **OpenStax, Anatomy and Physiology 2e**:

- [11.3: Axial muscles of the head, neck and back](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back)
- [11.4: Axial muscles of the abdominal wall and thorax](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax)
- [11.5: Muscles of the pectoral girdle and upper limbs](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs)
- [11.6: Appendicular muscles of the pelvic girdle and lower limbs](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs)

These are descriptive reference anatomy, rather than a clinical validation of every vertex or an individualized model. Existing exercise instructions and exercise-to-muscle relationships remain sourced from this project's action library.
