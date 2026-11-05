# Compu — la police des grands titres

Police de titrage du cours « Chimioarchitecture des psychédéliques », redessinée d’après l’alphabet **OS COMPU BOLD** d’Osamu Sato, reproduit dans _The Art of Computer Designing_ (1990, p. 102-103). Les glyphes du livre (capitales, bas de casse, chiffres, ponctuation) sont détourés et vectorisés ; les accents (à â ä ç é è ê ë î ï ô ö ù û ü ÿ et leurs capitales), les guillemets français, le point médian, les tirets, l’apostrophe et les approches sont dessinés dans la même grammaire : fûts droits, angles vifs, points carrés.

- `seg.py` : repère chaque glyphe sur les deux pages (rangées, colonnes, cellules) et écrit `seg.json` ;
- `build.py` et `build_metrics.py` : détourent et vectorisent chaque glyphe (potrace), calculent lignes de base et hauteurs ;
- `make.py` : assemble la police (métriques, approches, signes ajoutés, accents, crénage) et écrit `Compu.otf` et `compu.woff2`.

Reconstruire (Python 3, `pip install opencv-python numpy fonttools brotli`, et `potrace`) : placer les photographies des pages 102 et 103 du livre sous les noms `p102.jpg` et `p103.jpg` (elles ne sont pas fournies ici), puis :

```
python3 seg.py && python3 build.py && python3 make.py
cp compu.woff2 ../../assets/fonts/
```

Droits : l’alphabet d’origine appartient à son auteur ; cette version redessinée sert au cours. Vérifier les droits avant toute diffusion publique ou réutilisation de la police.
