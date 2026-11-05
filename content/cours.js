/* ─── 00-site ─── */
/* ════════════════════════════════════════════════════════════════════════════
   Kaléidoscopiques Psychédéliques — tout le contenu du site (dépôt « kaleidoscope »).
   Ce fichier est assemblé à partir des morceaux du dossier build/ (outils/assembler.js) :
   métadonnées, chapitres, objectifs, diapositives, fiches des substances, glossaire, panneaux,
   archives historiques, questions à la salle, QRM, cas, arbres, cartes de révision, structures.
   Mini-balisage des textes : [[terme]] glossaire · {{id}} panneau (substance, cible, archive) ·
   ((diapo|texte)) lien vers une diapositive · **gras** · _italique_ · → flèche dessinée.
   ════════════════════════════════════════════════════════════════════════════ */
window.COURS = {};
var C = window.COURS;
C.mols = {}; C.slides = [];

C.site = {
  id: 'psyche',
  title1: 'Kaléidoscopiques',
  title2: 'Psychédéliques',
  tagline: 'Introduction à une psychopharmacologie dissidente',
  short: 'Introduction à une psychopharmacologie dissidente : neurobiologie, essais cliniques et pratique des thérapies assistées, en psychiatrie et en addictologie',
  kicker: 'Cours pour les internes de psychiatrie',
  author: 'Dr Ewen Kervadec',
  authorShort: 'E. Kervadec',
  role: 'CCA, Département de psychiatrie et d’addictologie, Hôpital universitaire Paul-Brousse',
  roleShort: 'CCA · Hôpital Paul-Brousse',
  place: 'DES de psychiatrie · Villejuif · 2026',
  year: '2026',
  heroTitle: true,
  /* Image d’accueil : une figure de nacre rose et mauve, pensive (image fournie par l’auteur ; droits à vérifier avant une
     diffusion publique), recadrée en carré pour le médaillon de la couverture et de l’accueil. */
  cover: { img: 'assets/img/couverture-cercle.jpg', alt: 'Une figure de nacre rose et mauve, assise, le menton dans la main, sur un fond mauve' },
  lede: 'Comment une molécule qui agit quelques heures pourrait aider des patients pendant des mois ; ce que montrent vraiment les essais ; et ce qu’il faut savoir pour en parler, conseiller, accompagner.',
  sessionTitle: 'Un cours interactif',
  session: 'Le cours alterne des séquences courtes, une diapositive par molécule, des schémas dynamiques (le récepteur 5-HT2A, le cerveau bayésien, le paysage des attracteurs en relief, le cycle de l’addiction, le jour de la session) et des questions à la salle, dont trois pour finir.',
  asof: 'octobre 2026',
  version: 'Version 1.4.1 du 2 novembre 2026',
  pharmaNav: 'Substances',
  pharmaTitle: 'Les substances',
  molWord: 'substances', molWord1: 'substance', molWordCap: 'Substance', molWordCaps: 'Substances',
  paneHint: 'Substances, cibles et archives s’ouvrent ici.',
  pharmaIntro: 'Neuf substances rangées par mécanisme : les psychédéliques classiques (agonistes des récepteurs 5-HT2A), un entactogène, un dissociatif et une substance atypique. Pour chacune : origine, mécanisme, durée des effets, doses étudiées, données cliniques, risques, interactions et statut en France (octobre 2026). Filtre par profil, puis ouvre une fiche.',
  histTitle: 'Histoire des psychédéliques',
  histIntro: 'Des cérémonies mazatèques au laboratoire de Sandoz, de la mescaline de Sainte-Anne aux essais de phase 3 : une histoire de rencontres, d’enthousiasmes, d’excès, d’interdits et de retours.',
  sources: [
    'Hipólito I, Mago J, Rosas FE, Carhart-Harris R. Pattern breaking: a complex systems approach to psychedelic medicine. _Neurosci Conscious_ 2023;2023(1):niad017.',
    'Carhart-Harris RL, Friston KJ. REBUS and the anarchic brain: toward a unified model of the brain action of psychedelics. _Pharmacol Rev_ 2019;71:316–344.',
    'Carhart-Harris RL et al. Canalization and plasticity in psychopathology. _Neuropharmacology_ 2023;226:109398.',
    'Johnson MW, Richards WA, Griffiths RR. Human hallucinogen research: guidelines for safety. _J Psychopharmacol_ 2008;22:603–620.',
    'Romeo B, Kervadec E et al. The intensity of the psychedelic experience is reliably associated with clinical improvements: a systematic review and meta-analysis. _Neurosci Biobehav Rev_ 2025;172:106086.',
    'Romeo B, Kervadec E et al. Safety and risk assessment of psychedelic psychotherapy: a meta-analysis and systematic review. _Psychiatry Res_ 2024;335:115880.',
    'Kervadec E et al. Thirty years of ibogaine research: a literature review on clinical perspectives. _J Clin Psychopharmacol_ 2026. doi:10.1097/JCP.0000000000002197.',
    'Essais cliniques : Carhart-Harris 2021 et Goodwin 2022 (_NEJM_), Raison 2023 (_JAMA_), Bogenschutz 2022 (_JAMA Psychiatry_), Mitchell 2021 (_Nat Med_), COMP005/COMP006 et DT120 (communiqués 2025–2026), étude PAD (Luquiens, _Addiction_ 2025) ; essais français : PSILOTRAZ (NCT07210112), PAPAUD (ANR-23-CE17-0034), ADELY (Fonds de lutte contre les addictions).',
    'Société psychédélique française. _Psychédéliques : manuel de réduction des risques_, 2022 (CC BY-NC-SA 4.0).',
    'Verroust V. Les conséquences heuristiques de la découverte des champignons divinatoires du Mexique, en France (1953–1971). Thèse, EHESS.',
    'ANSM ; réponse ministérielle à la question écrite n° 1949 (JO, 27 mai 2025) ; OFDT ; BfArM ; TGA ; FDA (octobre 2026).'
  ],
  foot: 'Contenu rédigé d’après la littérature scientifique, les essais publiés ou annoncés et les sources réglementaires citées dans chaque diapositive (état d’octobre 2026). Les textes sont reformulés ; les schémas sont originaux. Ressource pédagogique : en France, ces substances sont des stupéfiants et ne s’utilisent qu’en essai clinique autorisé (sauf l’eskétamine) ; rien ici n’est une incitation à l’usage, ni un avis médical.'
};
C.sisters = [];

C.chapters = [
  { id: 'ouv', n: '00', t: 'Ouverture', mins: 3, emblem: 'spiral', sub: 'Bâle, un soir d’avril 1943.' },
  { id: 'hist', n: '01', t: 'Histoire', mins: 12, emblem: 'hourglass', sub: 'Des champignons sacrés aux essais de phase 3.' },
  { id: 'pharma', n: '02', t: 'Pharmacologie', mins: 20, emblem: 'pills', sub: 'Sept molécules, de quinze minutes à trente-six heures.' },
  { id: 'neuro', n: '03', t: 'Neurobiologie', mins: 18, emblem: 'valley', sub: 'Du récepteur 5-HT2A au paysage des croyances.' },
  { id: 'clin', n: '04', t: 'Clinique', mins: 21, emblem: 'scale', sub: 'Dépression, anxiété, addictions, trauma : peser les preuves.' },
  { id: 'meth', n: '05', t: 'Méthode', mins: 19, emblem: 'arch', sub: 'Préparer, accompagner, intégrer.' },
  { id: 'cadre', n: '06', t: 'Cadre et avenir', mins: 7, emblem: 'grid', sub: 'Le droit, le monde, les questions ouvertes.' },
  { id: 'clot', n: '07', t: 'Clôture', mins: 5, emblem: 'loop', sub: 'Répondre, retenir.' }
];

C.objectives = {
  O1: { t: 'Définir un psychédélique et classer les substances selon leur mécanisme : classiques (5-HT2A), entactogènes, dissociatifs, atypiques.', sid: 'familles' },
  O2: { t: 'Situer les grandes étapes de l’histoire des psychédéliques en médecine, de 1943 à 2026.', sid: 'premiere-vague' },
  O3: { t: 'Connaître la pharmacologie pratique : durées d’action, tolérance, toxicité, interactions dangereuses.', sid: 'durees' },
  O4: { t: 'Expliquer l’action des psychédéliques classiques, du récepteur 5-HT2A à la plasticité et aux réseaux.', sid: 'neurone' },
  O5: { t: 'Expliquer le modèle bayésien (REBUS) et l’approche des systèmes complexes appliqués à la psychopathologie.', sid: 'bayes' },
  O6: { t: 'Résumer les preuves dans la dépression, l’anxiété, les addictions et le trouble de stress post-traumatique, et leurs limites.', sid: 'depression' },
  O7: { t: 'Lire un essai de psychédélique de façon critique : aveugle, attentes, contrôle, durabilité, généralisation.', sid: 'lire-essai' },
  O8: { t: 'Décrire une thérapie assistée par psychédéliques : sélection, préparation, session, intégration.', sid: 'parcours' },
  O9: { t: 'Reconnaître les contre-indications et gérer une expérience difficile.', sid: 'crise' },
  O10: { t: 'Accueillir un patient qui consomme ou envisage de consommer des psychédéliques, et connaître le cadre légal français.', sid: 'consultation' }
};

C.classes = {
  cl: { t: 'Psychédéliques classiques' }, en: { t: 'Entactogène' }, di: { t: 'Dissociatif' }, at: { t: 'Atypique' }
};
C.tileGroups = [
  { id: 'cl', t: 'Psychédéliques classiques', nbn: 'agonistes 5-HT2A', mols: ['psilocybine', 'lsd', 'dmt', 'ayahuasca', 'meodmt', 'mescaline'] },
  { id: 'en', t: 'Entactogène', nbn: 'libération de 5-HT (SERT), NA, DA', mols: ['mdma'] },
  { id: 'di', t: 'Dissociatif', nbn: 'antagoniste NMDA', mols: ['ketamine'] },
  { id: 'at', t: 'Atypique (onirogène)', nbn: 'NMDA, κ-opioïde, SERT, hERG…', mols: ['ibogaine'] }
];
C.filters = [
  ['p3', 'Essais de phase 3'], ['addic', 'Données en addictologie'], ['court', 'Effets courts (≤ 2 h)'], ['long', 'Effets longs (≥ 8 h)'],
  ['coeur', 'Risque cardiovasculaire notable'], ['interac', 'Interactions graves'], ['amm', 'Médicament autorisé quelque part'], ['acces', 'Accès encadré à l’étranger'], ['nature', 'D’origine naturelle']
];
C.molFields = [
  ['origin', 'Origine'], ['pk', 'Voie, délai, durée'], ['dose', 'Doses étudiées'], ['effects', 'Effets recherchés'],
  ['ae', 'Effets indésirables'], ['serious', 'Risques graves'], ['inter', 'Interactions'], ['evidence', 'Données cliniques'],
  ['status', 'Statut'], ['rdr', 'Réduction des risques']
];
C.pharmaCols = [{ k: 'cls', l: 'Famille' }, { k: 'target', l: 'Cible principale' }, { k: 'dur', l: 'Durée des effets' }, { k: 'stat', l: 'Statut en France' }];

/* Déroulé du cours (page d’accueil) : minutes depuis le début ; elles règlent la largeur des cartes, sans être affichées.
   \u00AD : césure possible dans un mot long, quand la carte est étroite. */
C.plan = [
  { from: 0, to: 3, t: 'Ouverture', m: 'Un vélo à Bâle, un soir d’avril 1943.', sid: 'couverture' },
  { from: 3, to: 15, t: 'Histoire', m: 'Les mots, les familles, María Sabina, Sandoz, Sainte-Anne, l’interdit, la renaissance.', sid: 'sec-hist' },
  { from: 15, to: 35, t: 'Pharmaco\u00ADlogie', m: 'L’expérience, les structures, les durées ; sept molécules une à une ; tolérance, toxicité, interactions.', sid: 'sec-pharma' },
  { from: 35, to: 53, t: 'Neuro\u00ADbiologie', m: 'Le récepteur 5-HT2A, le neurone, la plasticité, les réseaux, le cerveau bayésien, briser les patterns, le cycle de l’addiction.', sid: 'sec-neuro' },
  { from: 53, to: 58, t: 'Pause', m: 'Cinq minutes ; le paysage des croyances tourne à l’écran, en relief.', sid: 'pause' },
  { from: 58, to: 79, t: 'Clinique', m: 'Dépression, anxiété, addictions, TSPT ; ce que montrent les enquêtes ; lire un essai.', sid: 'sec-clin' },
  { from: 79, to: 98, t: 'Méthode', m: 'Critères d’inclusion, préparation, la session et sa salle, l’expérience difficile, l’intégration, l’éthique, la consultation.', sid: 'sec-meth' },
  { from: 98, to: 105, t: 'Cadre et avenir', m: 'Le droit français, la recherche en France, le monde, ce qui reste à savoir.', sid: 'sec-cadre' },
  { from: 105, to: 110, t: 'Clôture', m: 'Trois questions à la salle, sept messages, les publications ; merci.', sid: 'q-recepteur' }
];

/* Pages des laboratoires (texte d’introduction et diapositives liées) */
C.labs = {
  durees: { p: 'Chaque courbe figure l’intensité des effets ressentis au fil des heures après une prise unique, aux doses des études (allure d’après les études de pharmacocinétique et de pharmacodynamie). Le temps est en heures, sur un axe régulier : la longueur d’une courbe est sa durée. Allume ou éteins une substance, puis compare : la DMT inhalée dure moins qu’un rendez-vous ; l’ibogaïne, plus d’une journée, sort du cadre. Le bouton « kétansérine » montre ce que change un antagoniste 5-HT2A donné une heure après le LSD (Becker 2023).', sids: ['durees', 'interactions'] },
  recepteur: { p: 'Un neurone pyramidal de la couche V du cortex, ses dendrites apicales couvertes de récepteurs 5-HT2A. Avance étape par étape : la psilocybine devient psilocine, se fixe, le neurone s’excite, le glutamate déferle, le BDNF et TrkB entrent en jeu, de nouvelles épines poussent. Modèle qualitatif, d’après Aghajanian et Marek (1997), Ly (2018), Shao (2021), Vargas (2023) et Moliner (2023).', sids: ['neurone', 'plasticite'] },
  bayes: { p: 'Une croyance est une distribution : le prior dit ce que l’on attend, la vraisemblance ce que disent les sens, le postérieur ce que l’on en conclut. Sa largeur, ou plutôt son inverse, la précision, fixe le poids de chacun. Règle la précision du prior et regarde le postérieur suivre ou ignorer les données ; puis applique le modèle REBUS (Carhart-Harris et Friston 2019) : sous psychédélique, la précision des croyances de haut niveau se relâche.', sids: ['bayes', 'rebus'] },
  paysage: { p: 'Le paysage des états possibles d’un système, en relief : chaque vallée est un attracteur, sa profondeur mesure la force d’une habitude ou d’une croyance (sa précision). Chauffe le système (température), aplatis le paysage (psychédélique), puis laisse-le refroidir et creuse un autre chemin (intégration). Fais glisser le paysage pour le faire tourner. D’après Hipólito et al. (2023) et Carhart-Harris et al. (2023).', sids: ['patterns', 'integration'] },
  addiction: { p: 'Le cycle de l’addiction en trois temps (Koob et Volkow 2016) : l’intoxication et la récompense captée (ganglions de la base), le sevrage et les affects négatifs (amygdale étendue, axe du stress), la préoccupation et le craving (cortex préfrontal). À chaque temps, ce que fait l’addiction et ce que les psychédéliques pourraient y changer, avec le niveau de preuve : surtout animal pour les circuits, humain et préliminaire pour la clinique. D’après Koob et Volkow (_Lancet Psychiatry_ 2016) et la figure de revue PSYCOMADD (2023).', sids: ['addiction-neuro'] },
  intensite: { p: 'La méta-analyse de Romeo, Kervadec et al. (« The intensity of the psychedelic experience is reliably associated with clinical improvements », _Neurosci Biobehav Rev_ 2025) : dans les études cliniques et naturalistiques, plus l’expérience psychédélique est intense, plus l’amélioration est grande. La corrélation est plus forte dans les troubles de l’humeur, en cadre clinique et dans les études prospectives.', sids: ['intensite'] },
  seance: { p: 'Une session de psilocybine, heure par heure : ce que vit le patient, ce que font les deux accompagnants, ce que l’on surveille. Fais glisser le curseur ou avance au clic.', sids: ['seance', 'crise'] }
};

/* ─── history ─── */
/* Archives : anecdotes historiques et culturelles vérifiées (sources dans chaque fiche).
   y : année affichée ; sid : diapositive où elle apparaît ; img : portrait (illustration fournie par l’auteur). */
C.history = [
  { id: 'h-eleusis', y: 'Antiquité', place: 'Éleusis, Grèce', t: 'Le breuvage des mystères',
    body: 'Pendant près de deux mille ans, les initiés aux mystères d’Éleusis buvaient le kykéon, un mélange d’orge et de menthe pouliot, avant une révélation dont ils ne devaient rien dire. En 1978, Wasson, Hofmann et Ruck proposent que l’orge ait porté de l’ergot, cousin naturel du LSD. Des fragments d’ergot ont été retrouvés dans un temple des deux déesses en Catalogne ; les hellénistes restent sceptiques.',
    src: 'Wasson, Hofmann et Ruck, _The Road to Eleusis_, 1978 ; Wikipédia', sid: 'avant-labos' },
  { id: 'h-moreau', y: '1845', place: 'Paris', t: 'Un aliéniste au club des haschischins',
    body: 'Jacques-Joseph Moreau de Tours, de retour d’Orient, prend lui-même du haschich pour comprendre la folie : il y voit le même délire que dans le rêve. _Du hachisch et de l’aliénation mentale_ (1845) fait de la drogue un modèle expérimental de la maladie mentale. Il fréquente le club des haschischins, avec Baudelaire et Gautier, et cofonde les _Annales médico-psychologiques_.',
    src: 'Moreau de Tours 1845 ; Wikipédia', sid: 'france-mescaline' },
  { id: 'h-lambarene', y: '1864–1966', place: 'Gabon, puis France', t: 'L’iboga en pharmacie',
    body: 'En 1864, un médecin de marine, Griffon du Bellay, rapporte du Gabon la racine d’iboga, utilisée dans les rites du Bwiti. L’ibogaïne est isolée en 1901. De 1939 au milieu des années 1960, la France vend en pharmacie le Lambarène, des comprimés d’extrait de _Tabernanthe_ contenant environ 8 mg d’ibogaïne, contre la fatigue et la dépression ; des sportifs s’en servent comme stimulant.',
    more: 'En 1962, Howard Lotsof, un jeune héroïnomane new-yorkais, remarque qu’après une prise d’ibogaïne il n’a plus envie d’héroïne : c’est l’origine de l’intérêt actuel en addictologie, et des cliniques du Mexique.',
    src: 'Erowid, chronologie de l’ibogaïne', sid: 'france-mescaline' },
  { id: 'h-sartre', y: '1935', place: 'Hôpital Sainte-Anne, Paris', t: 'Sartre et les crustacés', img: 'assets/img/portraits/sartre.webp', imgAlt: 'Jean-Paul Sartre en illustration, bras croisés, entouré de crabes et d’un homard',
    body: 'En février 1935, Jean-Paul Sartre travaille sur l’imagination. Son ancien condisciple Daniel Lagache lui injecte de la mescaline à Sainte-Anne. Il voit des parapluies-vautours, des chaussures-squelettes, des crabes et des poulpes. Pendant des mois, des crustacés le suivent dans la rue ; il finit par décider de ne plus y prêter attention.',
    more: 'Simone de Beauvoir raconte l’épisode dans _La Force de l’âge_ (1960). Sartre attribuera à la mescaline une dépression de deux ans. Des créatures à la démarche de crabe traversent _La Nausée_ (1938).',
    src: 'Beauvoir 1960 ; Chacruna ; JSTOR Daily', sid: 'france-mescaline' },
  { id: 'h-hofmann', y: '1943', place: 'Sandoz, Bâle', t: 'Le jour du vélo', img: 'assets/img/portraits/hofmann.webp', imgAlt: 'Albert Hofmann en illustration, tenant un buvard',
    body: 'Albert Hofmann a synthétisé le LSD-25 en 1938, en cherchant un stimulant circulatoire dans les dérivés de l’ergot de seigle. Le 16 avril 1943, il en absorbe par mégarde une trace. Le 19, il en prend volontairement 250 µg, une dose qu’il croit prudente. Il rentre chez lui à vélo, persuadé de devenir fou ; le lendemain, il se réveille avec un sentiment de renouveau.',
    more: 'Hofmann isolera aussi la psilocybine des champignons mexicains (1958). Il appelait le LSD son « enfant terrible », préférait le mot « enthéogène », et qualifiait de criminelle son administration à des sujets non informés par la CIA. Il est mort en 2008, à 102 ans.',
    src: 'Hofmann, _LSD, mon enfant terrible_, 1979 ; Wikipédia', sid: 'velo' },
  { id: 'h-pont', y: '1951', place: 'Pont-Saint-Esprit, Gard', t: 'Le pain maudit',
    body: 'Mi-août 1951, plus de 250 habitants tombent malades après avoir mangé le pain d’une même boulangerie : nausées, puis hallucinations et convulsions. Une cinquantaine sont internés, sept meurent. Les médecins concluent à l’ergotisme. En 2009, un livre affirme que la CIA aurait testé du LSD sur la ville ; l’historien Steven Kaplan juge la thèse cliniquement incohérente.',
    src: 'Gabbai et al., _BMJ_ 1951 ; Wikipédia', sid: 'interdit' },
  { id: 'h-huxley', y: '1953', place: 'Los Angeles', t: 'Les portes de la perception', img: 'assets/img/portraits/huxley.webp', imgAlt: 'Aldous Huxley en illustration, assis en tailleur, un livre à la main',
    body: 'En mai 1953, Humphry Osmond donne de la mescaline à Aldous Huxley, chez lui. Huxley en tire _Les Portes de la perception_ (1954), titre emprunté à William Blake, puis _Le Ciel et l’Enfer_ (1956) et _Île_ (1962). Le 22 novembre 1963, le jour de l’assassinat de Kennedy, mourant, il écrit à sa femme : « LSD, 100 µg, i.m. » ; elle lui fait deux injections.',
    src: 'Wikipédia', sid: 'osmond-huxley' },
  { id: 'h-sabina', y: '1955', place: 'Huautla de Jiménez, Oaxaca', t: 'María Sabina et les « enfants saints »', img: 'assets/img/portraits/sabina.webp', imgAlt: 'María Sabina en illustration, tenant un champignon',
    body: 'Les 29 et 30 juin 1955, la curandera mazatèque María Sabina accepte qu’un banquier new-yorkais, R. Gordon Wasson, participe à une _velada_. Son récit, « Seeking the Magic Mushroom », paraît dans _Life_ le 13 mai 1957. Hippies et célébrités affluent ; sa maison est brûlée, elle est rejetée par une partie de son village. Elle dira que les champignons ont perdu leur force.',
    more: 'En 1962, Albert Hofmann lui fait goûter des pilules de psilocybine de synthèse. Le lendemain, elle dit que l’esprit des champignons est bien dans les pilules. Elle meurt dans la pauvreté en 1985.',
    src: 'Wikipédia ; Estrada 1977', sid: 'avant-labos' },
  { id: 'h-michaux', y: '1955', place: 'Paris', t: 'Misérable miracle',
    body: 'Le 2 janvier 1955, à l’invitation de Jean Paulhan, le poète Henri Michaux prend de la mescaline dans son appartement. Il recommencera plusieurs fois, jusqu’à une surdose dont un médecin le tire. Il en sort un livre, _Misérable miracle_ (1956), et des centaines de « dessins mescaliniens », faits après coup, à l’encre, comme des vibrations.',
    src: 'Studio International ; Centre Pompidou', sid: 'france-mescaline' },
  { id: 'h-osmond', y: '1956–1957', place: 'Weyburn, Saskatchewan', t: 'Le mot « psychédélique »', img: 'assets/img/portraits/osmond.webp', imgAlt: 'Humphry Osmond en illustration, la main levée',
    body: 'Humphry Osmond, psychiatre britannique installé au Saskatchewan, traite l’alcoolisme par une dose de LSD et revendique 50 % de succès ; Bill Wilson, cofondateur des Alcooliques anonymes, en prend lui-même. Pour nommer ces substances, Huxley propose « phanérothyme ». Osmond répond par une rime : « To fathom Hell or soar angelic, just take a pinch of psychedelic ».',
    src: 'Wikipédia ; New York Academy of Sciences', sid: 'osmond-huxley' },
  { id: 'h-heim', y: '1958', place: 'Muséum et Sainte-Anne, Paris', t: 'La psilocybine, une découverte franco-suisse',
    body: 'Le mycologue Roger Heim, du Muséum national d’histoire naturelle, accompagne les Wasson au Mexique, identifie et cultive les _Psilocybe_. Il en envoie à Sandoz, où Albert Hofmann isole la psilocybine. En 1958, Jean Delay, Pierre Pichot et Roger Heim publient ses effets chez quatre volontaires et quatorze patients de Sainte-Anne : un « psychodysleptique ».',
    src: 'Delay et al., _CR Acad Sci_ 1958 ; V. Verroust, thèse (EHESS)', sid: 'france-mescaline' },
  { id: 'h-goodfriday', y: '1962', place: 'Marsh Chapel, Boston', t: 'Le Vendredi saint',
    body: 'Le 20 avril 1962, Walter Pahnke donne en double aveugle de la psilocybine ou de la niacine (un placebo actif) à vingt étudiants en théologie, pendant l’office du Vendredi saint. Presque tous ceux qui ont reçu la psilocybine décrivent une expérience mystique. Vingt-cinq ans plus tard, ils la jugent encore authentique ; mais l’un d’eux avait dû être contenu et avait reçu de la chlorpromazine.',
    src: 'Doblin 1991 ; Wikipédia', sid: 'premiere-vague' },
  { id: 'h-harvard', y: '1960–1963', place: 'Harvard, Cambridge', t: 'Le projet psilocybine',
    body: 'Timothy Leary et Richard Alpert commandent de la psilocybine à Sandoz et en donnent à des étudiants, à des détenus, à eux-mêmes. Leurs collègues s’inquiètent ; en 1962, l’État impose la présence d’un médecin. Alpert est renvoyé le 27 mai 1963 pour en avoir donné à un étudiant. Leary deviendra une figure de la contre-culture.',
    src: 'Wikipédia', sid: 'interdit' },
  { id: 'h-mdma', y: '1976–1985', place: 'Californie', t: '« Adam », puis « Ecstasy »',
    body: 'Le chimiste Alexander Shulgin fait découvrir la MDMA au psychothérapeute Leo Zeff, qui la fait connaître à de nombreux confrères : ils l’appellent « Adam », comme un retour à l’innocence. Rebaptisée « Ecstasy », elle gagne les boîtes de nuit. En 1985, elle est classée en urgence parmi les stupéfiants ; MAPS naît en 1986 pour en défendre l’usage médical.',
    src: 'Sessa, Higbed et Nutt, _Front Psychiatry_ 2019', sid: 'tspt-mdma' },
  { id: 'h-strassman', y: '1990–1995', place: 'Université du Nouveau-Mexique', t: 'La molécule de l’esprit',
    body: 'Le psychiatre Rick Strassman obtient de donner de la DMT par voie intraveineuse à des volontaires : environ 400 doses à une soixantaine de personnes. C’est la première étude américaine sur un psychédélique chez l’humain depuis vingt ans. Plusieurs participants décrivent des rencontres avec des « entités ».',
    src: 'Strassman, _DMT: The Spirit Molecule_, 2001 ; Wikipédia', sid: 'renaissance' },
  { id: 'h-mckenna', y: '1992', place: 'Californie', t: 'La dose héroïque et le singe défoncé', img: 'assets/img/portraits/mckenna.webp', imgAlt: 'Terence McKenna en illustration, tenant un champignon',
    body: 'L’ethnobotaniste Terence McKenna popularise la « dose héroïque » : cinq grammes de champignons séchés, seul, à jeun, dans le noir et le silence. Dans _Food of the Gods_ (1992), il soutient que les champignons auraient fait évoluer le cerveau et le langage de nos ancêtres. La théorie du « singe défoncé » n’a aucune base en paléoanthropologie : un récit séduisant n’est pas une preuve.',
    src: 'Wikipédia', sid: 'renaissance' },
  { id: 'h-daime', y: '1999–2007', place: 'Paris', t: 'L’ayahuasca au tribunal',
    body: 'En 1999, des membres d’une Église du Santo Daime sont arrêtés à Paris. Condamnés en 2004, ils sont relaxés en appel en janvier 2005 : une décoction de plantes n’est pas, en droit, une substance classée. Quelques mois plus tard, les plantes de l’ayahuasca et leurs principes actifs sont inscrits sur la liste des stupéfiants ; le Conseil d’État confirme en 2007.',
    src: 'Chacruna 2023', sid: 'avant-labos' },
  { id: 'h-hopkins', y: '2006', place: 'Johns Hopkins, Baltimore', t: 'Une expérience parmi les plus significatives d’une vie',
    body: 'Roland Griffiths donne en double aveugle de la psilocybine ou du méthylphénidate à 36 volontaires sans expérience des psychédéliques. Quatorze mois plus tard, 67 % rangent la session de psilocybine parmi les cinq expériences les plus significatives de leur vie sur le plan spirituel, et 64 % disent que leur bien-être a augmenté.',
    src: 'Griffiths et al., _Psychopharmacology_ 2006 et 2008', sid: 'renaissance' },
  { id: 'h-fda', y: '2024', place: 'FDA, Silver Spring', t: 'Neuf voix contre deux',
    body: 'Le 4 juin 2024, le comité consultatif de la FDA vote contre la MDMA dans le TSPT : 9 voix contre 2 sur l’efficacité, 10 contre 1 sur le rapport bénéfice/risque. En août, la FDA refuse et demande un nouvel essai ; trois articles sont rétractés après la révélation d’une faute grave d’un thérapeute envers une participante. Le promoteur licencie les trois quarts de ses salariés.',
    src: 'Wikipédia ; FDA 2024', sid: 'tspt-mdma' },
  { id: 'h-nimes', y: '2023–2026', place: 'CHU de Nîmes', t: 'Les premiers essais français',
    body: 'L’ANSM autorise en septembre 2023 le premier essai français de psilocybine, chez des patients sevrés de l’alcool et déprimés. Publiée en 2025, l’étude PAD trouve 55 % d’abstinence à 12 semaines sous 25 mg contre 11 % sous 1 mg. Le 1er juillet 2026, le premier patient de l’essai de phase 3 ERPPAD reçoit sa dose, à Nîmes ; huit CHU y participent.',
    src: 'CHU de Nîmes 2025, 2026 ; JO du 27 mai 2025', sid: 'alcool' }
];

/* ─── mols ─── */
/* Fiches des substances. Sources : voir le champ src de chaque fiche (état d’octobre 2026). */
Object.assign(C.mols, {
  psilocybine: {
    dci: 'Psilocybine', brand: 'champignons « magiques » · COMP360', cls: 'cl', struct: 'psilocybine',
    nbn: 'Sérotonine · agoniste partiel 5-HT2A (via la psilocine)',
    tags: ['p3', 'addic', 'interac', 'acces', 'nature'],
    note: 'la plus étudiée ; phase 3 positive',
    target: '5-HT2A (agoniste partiel)', dur: '4–6 h', stat: 'Stupéfiant ; essais autorisés (Sainte-Anne, Nîmes, Paul-Brousse)',
    lead: 'Le psychédélique de référence de la recherche clinique : une session d’une journée, deux essais de phase 3 positifs dans la dépression résistante, des essais en cours dans l’alcool, en France.',
    mech: '[[promedicament|Promédicament]] : déphosphorylée en **psilocine** (intestin, foie), qui active les récepteurs {{c-5ht2a|5-HT2A}} (agoniste partiel), mais aussi 5-HT1A et 5-HT2C. L’occupation des 5-HT2A atteint 72 % et prédit l’intensité ressentie (Madsen 2019).',
    origin: 'Plus de 200 espèces de champignons, dont _Psilocybe cubensis_ et, en France, _Psilocybe semilanceata_ ; « truffes » (sclérotes) vendues légalement aux Pays-Bas. Isolée en 1958 par Albert Hofmann, à partir des champignons mexicains cultivés par Roger Heim.',
    pk: 'Voie orale. Début en 20–40 min, pic vers 1–2 h, fin en 4–6 h. Psilocine glucuronidée puis éliminée par le rein.',
    dose: ['Essais : 25 mg de psilocybine de synthèse (COMP360), ou une dose ajustée au poids (de l’ordre de 0,2 à 0,4 mg/kg)', 'Contrôles : 1 mg, 10 mg, niacine, placebo', 'Champignons séchés : la teneur varie d’un facteur 5 ou plus selon l’espèce et la récolte'],
    effects: 'Perceptions modifiées, émotions amplifiées, souvenirs, sentiment d’unité ; [[experience-mystique|expérience mystique]] à forte dose.',
    ae: ['Céphalées (fréquentes, parfois le lendemain), nausées', 'Anxiété à la montée ; hausse modérée de la pression artérielle et de la fréquence cardiaque', 'Fatigue, troubles du sommeil la nuit suivante'],
    serious: ['[[bad-trip|Expérience difficile]] avec comportements dangereux hors cadre', 'Décompensation psychotique ou maniaque chez les sujets vulnérables', 'Idées et comportements suicidaires observés dans tous les bras des essais (Goodwin 2022)'],
    inter: ['**Lithium** : crises convulsives (contre-indication)', 'ISRS, IRSNa : effet atténué ; IMAO : effet potentialisé', 'Tramadol : abaisse le seuil épileptogène'],
    evidence: ['Dépression résistante : COMP005 (MADRS −3,6) et COMP006 (−3,8) à 6 semaines', 'Épisode dépressif : Raison 2023 (−12,3) ; non supérieure à l’escitalopram sur le critère principal (2021)', 'Alcool : Bogenschutz 2022 ; essais français (PAD, ERPPAD, PAPAUD)', 'Tabac, détresse liée au cancer ; anorexie et TOC en pilote'],
    status: 'France : stupéfiant ; essais autorisés par l’ANSM. États-Unis : dossier COMP360 en cours d’examen (bon de priorité, avril 2026). Accès encadré : Australie (2023), Allemagne (compassionnel, 2025), Tchéquie (2026), Suisse.',
    rdr: ['Identifier l’espèce : confusion possible avec des champignons toxiques', 'Commencer bas ; jamais seul ; pas de mélange (alcool, cannabis, lithium)'],
    pearls: ['La teneur des champignons est imprévisible : c’est une des raisons de la psilocybine de synthèse en recherche', 'Une session de 25 mg demande une journée : 6 à 8 heures de présence'],
    hist: 'María Sabina et la _velada_ de 1955 ; Life, 1957 ; Hofmann isole la psilocybine en 1958 ; Delay, Pichot et Heim la testent à Sainte-Anne la même année.',
    sids: ['mol-psilocybine', 'structures', 'durees', 'depression', 'alcool'],
    src: 'Madsen 2019 ; Ley 2023 ; essais cités ; Compass Pathways 2025–2026 ; CHU de Nîmes ; SPF 2022'
  },

  lsd: {
    dci: 'LSD', brand: 'diéthylamide de l’acide lysergique · DT120 (ex-MM120)', cls: 'cl', struct: 'lsd',
    nbn: 'Sérotonine · agoniste 5-HT2A (large spectre)',
    tags: ['p3', 'addic', 'long', 'interac', 'acces'],
    note: 'actif au microgramme ; 8–12 h',
    target: '5-HT2A et d’autres (5-HT1A, 5-HT2B, D2…)', dur: '8–12 h', stat: 'Stupéfiant',
    lead: 'Actif à quelques dizaines de microgrammes, le LSD est revenu en phase 3 dans le trouble anxieux généralisé et la dépression, parfois sans psychothérapie associée.',
    mech: 'Agoniste des récepteurs {{c-5ht2a|5-HT2A}}, mais aussi 5-HT1A, {{c-5ht2b|5-HT2B}}, dopaminergiques D2 et adrénergiques. Une boucle extracellulaire du récepteur se referme sur lui comme un couvercle : il s’en détache très lentement (Wacker 2017), d’où sa puissance et sa durée.',
    origin: 'Semi-synthétique, dérivé de l’acide lysergique de l’ergot de seigle (_Claviceps purpurea_). Synthétisé en 1938, effets découverts en 1943 par Albert Hofmann (Sandoz) ; vendu de 1947 à 1966 sous le nom de Delysid.',
    pk: 'Voie orale (buvard, comprimé orodispersible). Début en 30–60 min, pic vers 2–3 h, fin en 8–12 h (8,5 h en moyenne pour 100 µg).',
    dose: ['Essais : 100 µg (dose de référence), 50 µg (bras intermédiaire de Panorama), 200 µg', 'Microdose : 10–20 µg (sans effet démontré au-delà du placebo)', 'Buvards de rue : de 50 à 200 µg, ou un autre produit (NBOMe)'],
    effects: 'Perceptions modifiées intenses, émotions, pensée accélérée, dissolution de l’ego à forte dose ; longue durée.',
    ae: ['« Illusions » le jour de la prise (68 % des patients sous 100 µg dans Panorama)', 'Nausées, céphalées ; hausse de la pression artérielle et de la fréquence cardiaque', 'Anxiété, fatigue, insomnie'],
    serious: ['Expérience difficile prolongée ; décompensation chez les sujets vulnérables', '[[hppd|HPPD]] (troubles perceptifs persistants), rare', 'Buvards frelatés (NBOMe) : convulsions, décès'],
    inter: ['**Lithium** : crises convulsives (contre-indication)', 'ISRS : effet atténué', '[[ketanserine|Kétansérine]] 40 mg 1 h après : effets réduits à 3,5 h au lieu de 8,5 h (Becker 2023)'],
    evidence: ['Trouble anxieux généralisé : phase 2b (HAM-A −5 à 4 semaines) ; Voyage (−5,4, d = 0,81) et Panorama (−5,1) à 12 semaines', 'Épisode dépressif : Emerge, sans psychothérapie (MADRS −8,1 à 6 semaines)', 'Alcool : méta-analyse de six essais des années 1960 (OR 1,96)'],
    status: 'France : stupéfiant (depuis 1966). Suisse : usage compassionnel limité. États-Unis : désignation « breakthrough » (anxiété 2024, dépression 2026), dossier prévu en 2027.',
    rdr: ['Faire analyser le buvard ; une amertume ou un engourdissement évoquent un NBOMe', 'Prévoir une journée entière et un accompagnant sobre'],
    hist: 'Le « jour du vélo » (19 avril 1943) ; des milliers de patients traités dans les années 1950–1960 ; interdit en 1966.',
    sids: ['mol-lsd', 'velo', 'durees', 'anxiete', 'depression'],
    src: 'Wacker 2017 ; Becker 2023 ; Ley 2023 ; Definium 2025–2026 ; Krebs et Johansen 2012 ; SPF 2022'
  },

  dmt: {
    dci: 'DMT', brand: 'N,N-diméthyltryptamine', cls: 'cl', struct: 'dmt',
    nbn: 'Sérotonine · agoniste 5-HT2A',
    tags: ['court', 'nature'],
    note: 'inhalée ou IV : ≈ 15 min',
    target: '5-HT2A', dur: '≈ 15 min (inhalée, IV) ; 4–6 h dans l’ayahuasca', stat: 'Stupéfiant',
    lead: 'Le plus court des psychédéliques classiques : une immersion totale de quelques minutes, compatible avec une consultation.',
    mech: 'Agoniste des récepteurs {{c-5ht2a|5-HT2A}} (et d’autres récepteurs sérotoninergiques). Par voie orale, elle est détruite par la {{c-mao|MAO-A}} de l’intestin et du foie : il faut l’inhaler, l’injecter, ou l’associer à un IMAO ({{ayahuasca|ayahuasca}}).',
    origin: 'Présente dans de nombreuses plantes (_Psychotria viridis_, _Mimosa hostilis_…) et à l’état de traces chez les mammifères ; synthétique en recherche.',
    pk: 'Inhalée ou intraveineuse : début en quelques secondes, pic à 2–5 min, fin en 15–20 min.',
    dose: ['Recherche : intraveineuse, de 0,05 à 0,4 mg/kg (Strassman, 1990–1995) ; perfusions continues dans les essais récents', 'Essais de phase 2 dans la dépression (formes intraveineuses ou inhalées)'],
    effects: 'Immersion visionnaire brutale, sentiment d’entrer dans un « autre monde », rencontres d’« entités » souvent rapportées.',
    ae: ['Hausse marquée et brève de la fréquence cardiaque et de la pression artérielle', 'Anxiété intense à la montée'],
    serious: ['Expérience terrifiante sans préparation ; chute pendant l’inhalation'],
    inter: ['IMAO : la DMT devient active par voie orale et dure plus longtemps (ayahuasca)', 'Lithium : risque convulsif'],
    evidence: ['Phase 1 et 2 : faisabilité, sécurité ; signaux antidépresseurs à confirmer'],
    status: 'France : stupéfiant, comme les plantes de l’ayahuasca depuis 2005.',
    rdr: ['Être assis ou allongé avant l’inhalation ; une personne sobre à côté'],
    hist: 'Rick Strassman, 1990–1995 : la première étude américaine sur un psychédélique en vingt ans, popularisée sous le nom de « molécule de l’esprit ».',
    sids: ['mol-dmt', 'durees', 'renaissance'],
    src: 'Strassman 2001 ; SPF 2022 ; Nichols 2016'
  },

  ayahuasca: {
    dci: 'Ayahuasca', brand: 'DMT + β-carbolines (IMAO-A)', cls: 'cl', struct: 'harmine',
    nbn: 'Sérotonine · DMT rendue active par un IMAO-A réversible',
    tags: ['interac', 'nature'],
    note: 'DMT + IMAO : attention aux interactions',
    target: '5-HT2A (DMT) + MAO-A (harmine)', dur: '4–6 h', stat: 'Stupéfiant (plantes classées en 2005)',
    lead: 'Un breuvage amazonien associant une source de DMT à des inhibiteurs de la MAO-A : un usage rituel et des retraites, avec des interactions potentiellement graves.',
    mech: 'La liane _Banisteriopsis caapi_ apporte des [[beta-carbolines|β-carbolines]] (harmine, harmaline, tétrahydroharmine) qui inhibent de façon réversible la {{c-mao|MAO-A}} ; la DMT des feuilles de _Psychotria viridis_ échappe alors à la dégradation intestinale et atteint le cerveau.',
    origin: 'Amazonie (Pérou, Brésil, Colombie, Équateur) ; Églises syncrétiques brésiliennes (Santo Daime, União do Vegetal) ; retraites internationales.',
    pk: 'Voie orale. Début en 30–60 min, pic vers 1,5–2 h, fin en 4–6 h. Vomissements fréquents (« la purge »).',
    dose: ['Très variable d’une préparation à l’autre ; recherche : doses standardisées en DMT et en harmine'],
    effects: 'Visions, souvenirs, émotions intenses ; dans l’analyse poolée de Romeo, Kervadec et al. (2025), expériences mystiques plus intenses qu’avec la psilocybine (Romeo, Kervadec et al. 2025).',
    ae: ['Nausées, vomissements, diarrhée', 'Hausse de la pression artérielle et de la fréquence cardiaque'],
    serious: ['**Syndrome sérotoninergique** avec ISRS, IRSNa, MDMA, tramadol, 5-MeO-DMT', 'Décompensations psychiatriques ; accidents dans des retraites non encadrées'],
    inter: ['ISRS, IRSNa, clomipramine, tramadol, MDMA, 5-MeO-DMT : à proscrire', 'Lithium : risque convulsif', 'Aliments riches en tyramine : prudence (IMAO réversible)'],
    evidence: ['Un petit essai randomisé brésilien (29 patients) dans la dépression résistante', 'Données observationnelles dans les communautés religieuses'],
    status: 'France : plantes et principes actifs classés stupéfiants en 2005, après la relaxe en appel de membres du Santo Daime ; Conseil d’État, 2007.',
    rdr: ['Vérifier les traitements en cours bien avant une retraite (fenêtre pour les ISRS et IMAO)', 'Se méfier des retraites sans médecin ni accompagnants identifiés'],
    hist: 'Le procès parisien du Santo Daime (1999–2007).',
    sids: ['mol-dmt', 'avant-labos', 'interactions'],
    src: 'SPF 2022 ; Chacruna 2023 ; Romeo, Kervadec et al., PNPBP 2025'
  },

  meodmt: {
    dci: '5-MeO-DMT', brand: '5-méthoxy-DMT · GH001, BPL-003', cls: 'cl', struct: 'meodmt',
    nbn: 'Sérotonine · agoniste 5-HT1A et 5-HT2A',
    tags: ['p3', 'court', 'interac', 'nature'],
    note: 'quelques minutes ; classé stupéfiant en 2026',
    target: '5-HT1A et 5-HT2A', dur: '15–30 min (inhalée)', stat: 'Stupéfiant depuis le 10 juin 2026',
    lead: 'Une tryptamine très puissante et très brève, développée sous forme inhalée ou nasale pour des sessions de moins d’une heure.',
    mech: 'Agoniste des récepteurs 5-HT1A, pour lesquels il est très affin, et {{c-5ht2a|5-HT2A}} ; peu de visions, une « dissolution » rapide du sentiment de soi.',
    origin: 'Plantes, et sécrétion du crapaud du désert de Sonora (_Incilius alvarius_), dont la collecte inquiète les naturalistes ; synthétique en recherche.',
    pk: 'Inhalée : début en quelques secondes, pic en quelques minutes, fin en 15–30 min ; sortie de session en moins d’une heure (GH001).',
    dose: ['Essais : schémas inhalés ou intranasaux individualisés, sur une seule journée'],
    effects: 'Perte brutale des repères, sentiment d’unité ou d’effacement du soi, sans scénario visuel.',
    ae: ['Anxiété intense possible à la montée', 'Nausées'],
    serious: ['Décès rapportés en association avec des IMAO (harmala)', 'Pertes de connaissance, chutes'],
    inter: ['**IMAO** (ayahuasca, harmaline) : association dangereuse', 'Lithium : risque convulsif'],
    evidence: ['Dépression résistante, GH001 inhalé (phase 2b, 81 patients) : MADRS −15,5 vs placebo à J8 ; rémission 57,5 % vs 0 %', 'BPL-003 intranasal : phase 3 lancée en 2026'],
    status: 'France : classé stupéfiant par décision de l’ANSM du 12 mai 2026 (en vigueur le 10 juin 2026), avec six autres tryptamines.',
    rdr: ['Jamais avec un IMAO ; toujours allongé, accompagné'],
    sids: ['mol-dmt', 'durees', 'interactions'],
    src: 'GH Research 2025 ; AtaiBeckley 2026 ; ANSM 2026 (Vidal) ; SPF 2022'
  },

  mescaline: {
    dci: 'Mescaline', brand: '3,4,5-triméthoxyphénéthylamine', cls: 'cl', struct: 'mescaline',
    nbn: 'Sérotonine · agoniste 5-HT2A (phénéthylamine)',
    tags: ['long', 'nature'],
    note: 'la plus longue des classiques',
    target: '5-HT2A', dur: '12–14 h', stat: 'Stupéfiant',
    lead: 'Le psychédélique des premiers psychiatres et des écrivains : une phénéthylamine, active à plusieurs centaines de milligrammes, pour une très longue journée.',
    mech: 'Agoniste des récepteurs {{c-5ht2a|5-HT2A}}, peu puissant (doses en centaines de milligrammes). À dose équivalente, son expérience ne diffère pas de celle du LSD ou de la psilocybine (Ley 2023).',
    origin: 'Cactus : peyotl (_Lophophora williamsii_), San Pedro (_Echinopsis pachanoi_). Isolée en 1897, synthétisée en 1919.',
    pk: 'Voie orale. Début lent (1–2 h), pic vers 3–4 h, fin en 12–14 h pour 500 mg.',
    dose: ['Recherche : 300 à 500 mg (500 mg ≈ 100 µg de LSD ≈ 20 mg de psilocybine)'],
    effects: 'Couleurs et formes, empathie, longue durée ; constantes de forme décrites par Klüver (1926).',
    ae: ['Nausées et vomissements fréquents à la montée', 'Hausse de la pression artérielle et de la fréquence cardiaque'],
    serious: ['Expérience difficile prolongée ; décompensation chez les sujets vulnérables'],
    inter: ['Lithium : risque convulsif', 'ISRS : effet atténué'],
    evidence: ['Pas d’essai thérapeutique moderne randomisé ; études chez le volontaire sain'],
    status: 'France : stupéfiant. États-Unis : usage sacramentel du peyotl protégé pour l’Église amérindienne.',
    hist: 'Sartre à Sainte-Anne (1935), Huxley (1953), Michaux (1955) : la mescaline des intellectuels et des psychiatres.',
    sids: ['mol-mescaline', 'france-mescaline', 'durees'],
    src: 'Ley et al., Neuropsychopharmacology 2023 ; Klüver 1926 ; SPF 2022'
  },

  mdma: {
    dci: 'MDMA', brand: '3,4-méthylènedioxyméthamphétamine · « ecstasy »', cls: 'en', struct: 'mdma',
    nbn: 'Monoamines · libérateur de sérotonine (via SERT), de noradrénaline et de dopamine',
    tags: ['p3', 'coeur', 'interac', 'acces'],
    note: 'TSPT ; refus FDA 2024, re-dépôt 2026',
    target: 'SERT (libération de 5-HT), NET, DAT', dur: '4–6 h', stat: 'Stupéfiant',
    lead: 'Un entactogène : ouverture, empathie, baisse de la peur, peu de visions. Étudiée dans le TSPT, refusée par la FDA en 2024, autorisée sur prescription en Australie.',
    mech: 'Substrat du {{c-sert|SERT}} (et du NET, du DAT) : elle entre dans le neurone et inverse le transporteur, d’où une libération massive de sérotonine, de noradrénaline et de dopamine ; libération d’ocytocine et de cortisol.',
    origin: 'Synthétisée par Merck en 1912 ; redécouverte par Alexander Shulgin, utilisée en psychothérapie (« Adam ») avant de devenir l’« ecstasy » des fêtes.',
    pk: 'Voie orale. Début en 30–60 min, pic vers 1,5–2 h, fin en 4–6 h ; métabolisée par le CYP2D6.',
    dose: ['Essais (TSPT) : 80 à 120 mg, puis une demi-dose complémentaire 1,5 à 2 h plus tard ; trois sessions à un mois d’intervalle'],
    effects: 'Empathie, sentiment de proximité, baisse de la peur et de l’autocritique, envie de parler.',
    ae: ['Serrement des mâchoires, bruxisme, sueurs, perte d’appétit', 'Tachycardie, hausse tensionnelle', 'Baisse de moral et fatigue les jours suivants'],
    serious: ['**Hyperthermie**, rhabdomyolyse', '[[hyponatremie|Hyponatrémie]] (sécrétion inappropriée d’ADH et boissons abondantes)', 'Syndrome sérotoninergique ; usage compulsif possible'],
    inter: ['IMAO : à proscrire (syndrome sérotoninergique)', 'ISRS : effet atténué (le SERT bloqué ne laisse plus entrer la MDMA)', 'Inhibiteurs du CYP2D6 (ritonavir, paroxétine, fluoxétine) : concentrations augmentées'],
    evidence: ['TSPT : deux essais de phase 3 (90 et 104 patients) ; CAPS-5 −24,4 vs −13,9 (d = 0,91)', 'Refus de la FDA en 2024 (aveugle, attentes, durabilité, sécurité)'],
    status: 'France : stupéfiant. Australie : prescription par des psychiatres autorisés depuis juillet 2023. États-Unis : nouveau dépôt du dossier en 2026 (Resilient Pharmaceuticals).',
    rdr: ['Boire régulièrement mais sans excès ; faire des pauses au frais', 'Ne pas associer à l’alcool ni à d’autres stimulants ; faire analyser les comprimés'],
    hist: 'Shulgin, Zeff, « Adam » ; classée en urgence en 1985 ; MAPS fondée en 1986.',
    sids: ['mol-mdma', 'familles', 'tspt-mdma', 'toxicite'],
    src: 'Mitchell et al., Nat Med 2021, 2023 ; FDA 2024 ; TGA 2023 ; Sessa et al. 2019 ; SPF 2022'
  },

  ketamine: {
    dci: 'Kétamine', brand: 'Kétalar · eskétamine : Spravato', cls: 'di', struct: 'ketamine',
    nbn: 'Glutamate · antagoniste du récepteur NMDA',
    tags: ['court', 'amm', 'addic'],
    note: 'seule à avoir une AMM (eskétamine)',
    target: 'NMDA (antagoniste)', dur: '1–2 h (IV)', stat: 'AMM : anesthésie ; eskétamine (dépression résistante)',
    lead: 'Un anesthésique dissociatif devenu antidépresseur rapide : la seule molécule de ce cours qui dispose d’une AMM en psychiatrie en France (eskétamine).',
    mech: 'Antagoniste non compétitif du récepteur {{c-nmda|NMDA}} ; en aval, bouffée de glutamate, récepteurs [[ampa|AMPA]], BDNF, [[mtor|mTOR]] et synaptogenèse : une voie commune avec les psychédéliques, par une autre porte. L’eskétamine est son énantiomère S.',
    origin: 'Synthétisée en 1962 (Parke-Davis), anesthésique depuis 1970 ; effet antidépresseur rapide décrit en 2000.',
    pk: 'Kétamine IV : 0,5 mg/kg en 40 min, dissociation pendant la perfusion, effets aigus dissipés en 1–2 h ; effet antidépresseur en 24 h, quelques jours. Eskétamine nasale : pic en 20–40 min.',
    dose: ['Kétamine IV : 0,5 mg/kg en 40 min (cadre de prescription compassionnelle de l’ANSM, mars 2026 : idées suicidaires sévères, à l’hôpital, seconde dose possible à 24–48 h)', 'Eskétamine : 56 à 84 mg deux fois par semaine en induction, avec un ISRS ou un IRSNa'],
    effects: 'Dissociation, sensation de flotter hors du corps, perceptions déformées ; antidépresseur rapide.',
    ae: ['Dissociation, vertiges, sédation, nausées', 'Hausse transitoire de la pression artérielle (pic vers 40 min)'],
    serious: ['Abus et dépendance', 'Cystite ulcéreuse en usage chronique', 'Psychose, manie'],
    inter: ['Dépresseurs du SNC (benzodiazépines, opioïdes, alcool) : sédation accrue', 'Psychostimulants, IMAO : surveiller la pression artérielle'],
    evidence: ['Eskétamine : TRANSFORM-2 −3,5 points de MADRS ; SUSTAIN-1, rechutes réduites (HR 0,49) ; ESCAPE-TRD, rémission 27,1 % vs 17,6 % sous quétiapine LP'],
    status: 'France : stupéfiant ; AMM en anesthésie ; eskétamine (Spravato) en dépression résistante, à l’hôpital (SMR modéré, HAS 2024) ; kétamine IV en prescription compassionnelle (ANSM, 2026).',
    rdr: ['Usage récréatif : risque de chute, d’accident, de « k-hole » ; ne jamais associer à l’alcool ou aux opioïdes'],
    hist: 'De l’anesthésie de guerre (Vietnam) à la dépression : Berman 2000, Zarate 2006 ; Spravato autorisé en 2019.',
    sids: ['mol-ketamine', 'familles', 'neurone'],
    src: 'RCP Spravato ; HAS 2024 ; ANSM 2026 ; TRANSFORM-2, SUSTAIN-1, ESCAPE-TRD ; SPF 2022'
  },

  ibogaine: {
    dci: 'Ibogaïne', brand: 'iboga · noribogaïne', cls: 'at', struct: 'ibogaine',
    nbn: 'Cibles multiples · NMDA, κ-opioïde, SERT, nicotiniques… et hERG',
    tags: ['long', 'coeur', 'addic', 'nature'],
    note: 'opioïdes ; risque cardiaque',
    target: 'NMDA, κ-opioïde, SERT, hERG…', dur: '24–36 h', stat: 'Stupéfiant (depuis 2007)',
    lead: 'L’alcaloïde de la racine d’iboga, réputé interrompre le sevrage et le craving des opioïdes ; un « onirogène » qui dure plus d’une journée, avec un vrai risque cardiaque.',
    mech: 'Une dizaine de cibles : antagoniste {{c-nmda|NMDA}}, agoniste {{c-kor|κ-opioïde}}, inhibiteur du SERT et du DAT, antagoniste nicotinique ; son métabolite, la [[noribogaine|noribogaïne]], a une longue demi-vie. Bloque aussi les canaux potassiques cardiaques {{c-herg|hERG}}.',
    origin: 'Écorce de racine de _Tabernanthe iboga_ (Gabon, Cameroun) ; rites du Bwiti. Isolée en 1901 ; vendue en France (Lambarène) de 1939 aux années 1960.',
    pk: 'Voie orale. Début en 1–3 h ; phase visionnaire de 4 à 8 h, puis une longue phase de réflexion ; 24–36 h, effets résiduels plusieurs jours.',
    dose: ['Plusieurs milligrammes par kilo, en milieu hospitalier dans les essais, avec monitorage cardiaque ; associée au magnésium dans l’étude de Stanford (2024)'],
    effects: 'Visions de type rêve éveillé (souvenirs, scènes de vie), puis introspection ; atténuation du syndrome de sevrage des opioïdes.',
    ae: ['Ataxie, nausées, vomissements', 'Bradycardie, insomnie prolongée'],
    serious: ['**Allongement du QT**, torsades de pointes, **mort subite** : 19 décès recensés de 1990 à 2008, surtout en sevrage', 'Interactions avec les opioïdes et la méthadone pendant le sevrage'],
    inter: ['Médicaments allongeant le QT, inhibiteurs du CYP2D6', 'Opioïdes : risque accru lors du sevrage', 'Lithium et sérotoninergiques : à éviter'],
    evidence: ['Séries ouvertes de sevrage des opioïdes ; pas d’essai randomisé publié', 'Vétérans avec traumatisme crânien (Stanford, 30 patients, ouvert) : amélioration du fonctionnement, du TSPT et de la dépression à un mois'],
    status: 'France : iboga et ibogaïne classés stupéfiants en mars 2007, après deux décès et des alertes sur des dérives sectaires (MIVILUDES). Texas : 50 millions de dollars pour des essais (2025).',
    rdr: ['ECG et bilan (potassium, magnésium) indispensables ; jamais seul ; méfiance envers les retraites et cliniques non médicalisées'],
    hist: 'Howard Lotsof, 1962 : l’héroïnomane qui n’a plus envie d’héroïne. Trente ans de recherche clinique : Kervadec et al., _J Clin Psychopharmacol_ 2026.',
    sids: ['mol-ibogaine', 'autres-addictions', 'toxicite', 'durees'],
    src: 'Alper et al. ; Cherian et al., Nat Med 2024 ; Afssaps 2007 ; Texas Tribune 2026 ; SPF 2022'
  }
});

/* ─── terms ─── */
/* Glossaire. k : catégorie (rec, tr, enz, can, cpt, cli, pk, hist, mol, reg, mod, ech, exp, meth, neuro). */
C.terms = {
  /* ── Mots et familles ── */
  'psychedelique': { t: 'Psychédélique', k: 'cpt', en: 'psychedelic', def: 'Au sens pharmacologique, agoniste des récepteurs 5-HT2A qui modifie les perceptions, les émotions et le sentiment de soi (psilocybine, LSD, DMT, mescaline). Le mot, forgé par Humphry Osmond en 1956–1957, signifie « qui rend l’esprit visible ».', more: 'Dans l’usage courant, le mot englobe aussi la MDMA (entactogène), la kétamine (dissociatif) et l’ibogaïne (atypique), dont les mécanismes diffèrent.', see: ['entactogene', 'dissociatif', 'onirogene'], panes: ['c-5ht2a'] },
  'psychotomimetique': { t: 'Psychotomimétique', k: 'hist', en: 'psychotomimetic', def: 'Qui imite la psychose. Premier regard porté sur le LSD et la mescaline dans les années 1950 : des « modèles » expérimentaux de la schizophrénie.', more: 'Delay et Deniker parlaient de « psychodysleptiques » ; Moreau de Tours, en 1845, voyait déjà dans le haschich un modèle de la folie.', vs: ['psychedelique', 'entheogene'] },
  'entheogene': { t: 'Enthéogène', k: 'hist', en: 'entheogen', def: 'Qui fait naître le divin en soi : terme proposé en 1979 pour les usages rituels et religieux des plantes psychoactives ; Albert Hofmann le préférait à « hallucinogène ».', vs: ['psychedelique'] },
  'entactogene': { t: 'Entactogène', k: 'cpt', en: 'entactogen, empathogen', def: 'Substance qui favorise le sentiment de contact avec soi et les autres (empathie, ouverture), avec peu d’effets visuels : la MDMA en est le modèle.', more: 'Mécanisme : libération de sérotonine par le transporteur SERT, et de noradrénaline, de dopamine et d’ocytocine.', panes: ['c-sert'] },
  'dissociatif': { t: 'Dissociatif', k: 'cpt', en: 'dissociative', def: 'Substance qui produit un détachement du corps et de l’environnement, par blocage des récepteurs NMDA du glutamate : kétamine, phencyclidine, protoxyde d’azote.', panes: ['c-nmda'] },
  'onirogene': { t: 'Onirogène', k: 'cpt', en: 'oneirogen', def: 'Qui produit un état proche du rêve éveillé, avec des visions de scènes et de souvenirs : terme appliqué à l’ibogaïne.' },
  'tryptamine': { t: 'Tryptamine', k: 'mol', en: 'tryptamine', def: 'Famille de molécules construites sur un noyau indole et une chaîne éthylamine, comme la sérotonine : psilocine, DMT, 5-MeO-DMT ; le LSD et l’ibogaïne contiennent aussi un indole.', vs: ['phenethylamine', 'lysergamide'] },
  'lysergamide': { t: 'Lysergamide', k: 'mol', en: 'lysergamide', def: 'Amide de l’acide lysergique, l’alcaloïde de l’ergot de seigle : le LSD et l’ergine (LSA) des graines de certaines lianes.', vs: ['tryptamine'] },
  'phenethylamine': { t: 'Phénéthylamine', k: 'mol', en: 'phenethylamine', def: 'Famille construite sur un cycle benzénique et une chaîne éthylamine, comme la dopamine : mescaline, 2C-B, et aussi les amphétamines et la MDMA.', vs: ['tryptamine'] },
  'illusion': { t: 'Illusion', k: 'cli', en: 'illusion', def: 'Perception déformée d’un objet réel (une surface qui ondule, des couleurs avivées). C’est l’effet le plus fréquent des psychédéliques aux doses habituelles.', vs: ['hallucination', 'pseudo-hallucination'] },
  'hallucination': { t: 'Hallucination', k: 'cli', en: 'hallucination', def: 'Perception sans objet, vécue comme réelle. Rare sous psychédéliques aux doses habituelles : le sujet garde en général la conscience d’être sous l’effet d’un produit.', vs: ['illusion', 'pseudo-hallucination'] },
  'pseudo-hallucination': { t: 'Pseudo-hallucination', k: 'cli', en: 'pseudo-hallucination', def: 'Perception sans objet reconnue comme irréelle par le sujet (des visions les yeux fermés, par exemple).', vs: ['hallucination', 'illusion'] },
  'synesthesie': { t: 'Synesthésie', k: 'exp', en: 'synaesthesia', def: 'Mélange des sens : voir la musique, entendre des couleurs. Fréquente sous psychédéliques.' },
  'suggestibilite': { t: 'Suggestibilité', k: 'exp', en: 'suggestibility', def: 'Tendance à accepter les idées et les attitudes d’autrui. Elle augmente sous LSD (Carhart-Harris 2015) : ce que dit l’accompagnant pèse plus que d’habitude.', more: 'D’où l’importance d’une attitude non directive et des garde-fous éthiques.', see: ['set', 'setting'] },
  'dissolution-ego': { t: 'Dissolution de l’ego', k: 'exp', en: 'ego dissolution', def: 'Affaiblissement transitoire du sentiment d’être un soi séparé, parfois jusqu’à un sentiment d’unité avec l’environnement ; vécu comme libérateur ou terrifiant.', see: ['experience-mystique'] },
  'experience-mystique': { t: 'Expérience mystique', k: 'exp', en: 'mystical-type experience', def: 'Expérience d’unité, de sacré, de vérité ressentie, de transcendance du temps et de l’espace, d’humeur positive et d’ineffabilité ; mesurée par le MEQ-30.', more: 'Son intensité est associée à l’amélioration clinique (méta-analyse de Romeo, Kervadec et al. 2025, r = 0,33).', see: ['meq30'] },
  'bad-trip': { t: 'Expérience difficile', k: 'exp', en: 'challenging experience, bad trip', def: 'Moment d’angoisse intense, de peur de mourir ou de devenir fou, de méfiance, parfois de confusion, sous l’effet d’un psychédélique. Le plus souvent transitoire ; bien accompagnée, elle peut être utile.', more: 'Prise en charge : présence calme, réassurance, inviter à traverser plutôt qu’à fuir ; diazépam si besoin ; éviter halopéridol et contention.', see: ['ceq'] },
  'hppd': { t: 'HPPD', k: 'cli', en: 'hallucinogen persisting perception disorder', def: 'Trouble persistant des perceptions dû aux hallucinogènes : traînées, halos, images rémanentes, patterns, qui persistent ou reviennent après l’intoxication, en étant reconnus comme anormaux.', more: 'Rare dans les essais ; plus fréquent après des usages festifs et des mélanges (cannabis). Diagnostic d’élimination.' },

  /* ── Pharmacologie ── */
  'agoniste': { t: 'Agoniste', k: 'cpt', en: 'agonist', def: 'Molécule qui se fixe à un récepteur et l’active, comme le ferait le ligand naturel. Les psychédéliques classiques sont des agonistes des récepteurs 5-HT2A.', see: ['agoniste-partiel', 'biais-fonctionnel'] },
  'agoniste-partiel': { t: 'Agoniste partiel', k: 'cpt', en: 'partial agonist', def: 'Agoniste qui, même en occupant tous les récepteurs, n’atteint pas l’effet maximal du ligand naturel ; la psilocine est un agoniste partiel de 5-HT2A.' },
  'biais-fonctionnel': { t: 'Biais fonctionnel', k: 'cpt', en: 'functional selectivity, biased agonism', def: 'Capacité d’un agoniste à activer préférentiellement une voie de signalisation d’un récepteur (protéine G ou β-arrestine). Une piste pour séparer l’effet thérapeutique de l’effet hallucinogène.' },
  'gq': { t: 'Protéine Gq', k: 'neuro', en: 'Gq protein', def: 'Protéine G couplée aux récepteurs 5-HT2A : elle active la phospholipase C, d’où l’IP3, la libération de calcium et l’excitation du neurone.' },
  'promedicament': { t: 'Promédicament', k: 'pk', en: 'prodrug', def: 'Molécule inactive transformée dans l’organisme en molécule active : la psilocybine perd son phosphate et devient la psilocine.' },
  'tachyphylaxie': { t: 'Tachyphylaxie', k: 'pk', en: 'tachyphylaxis', def: 'Tolérance rapide : l’effet diminue dès les prises répétées. Après quelques prises quotidiennes d’un psychédélique classique, l’effet s’émousse ; il revient en une à deux semaines.', more: 'La tolérance est croisée entre LSD, psilocybine et mescaline : un même récepteur, désensibilisé.' },
  'ketanserine': { t: 'Kétansérine', k: 'mol', en: 'ketanserin', def: 'Antagoniste des récepteurs 5-HT2A (et α1), ancien antihypertenseur. Elle bloque l’effet de la psilocybine et du LSD ; donnée une heure après le LSD, elle en réduit la durée de 8,5 à 3,5 heures (Becker 2023).', panes: ['c-5ht2a'] },
  'beta-carbolines': { t: 'β-carbolines', k: 'mol', en: 'β-carbolines', def: 'Alcaloïdes de la liane _Banisteriopsis caapi_ (harmine, harmaline, tétrahydroharmine) qui inhibent de façon réversible la MAO-A : ils rendent la DMT active par voie orale dans l’ayahuasca.', panes: ['c-mao'] },
  'noribogaine': { t: 'Noribogaïne', k: 'mol', en: 'noribogaine', def: 'Métabolite actif de l’ibogaïne, à longue demi-vie : il prolonge les effets et le risque d’allongement du QT.', panes: ['c-herg'] },
  'herg': { t: 'Canal hERG', k: 'can', en: 'hERG potassium channel', def: 'Canal potassique de la repolarisation cardiaque : le bloquer allonge le QT et expose aux torsades de pointes. L’ibogaïne le bloque.', panes: ['c-herg'] },
  'syndrome-serotoninergique': { t: 'Syndrome sérotoninergique', k: 'cli', en: 'serotonin syndrome', def: 'Excès de stimulation sérotoninergique : agitation, confusion, sueurs, tremblement, myoclonies, hyperréflexie, hyperthermie ; potentiellement mortel. Risque majeur quand un IMAO (ayahuasca) est associé à un ISRS, à la MDMA, au tramadol ou à la 5-MeO-DMT.' },
  'hyponatremie': { t: 'Hyponatrémie', k: 'cli', en: 'hyponatraemia', def: 'Baisse du sodium sanguin. Sous MDMA : sécrétion inappropriée d’hormone antidiurétique et boissons abondantes ; confusion, convulsions, œdème cérébral.' },
  'microdosage': { t: 'Microdosage', k: 'cli', en: 'microdosing', def: 'Prise répétée de doses infraperceptives (par exemple 10–20 µg de LSD) pour améliorer l’humeur ou la créativité. Dans un essai en auto-aveugle de 191 participants, les effets ne différaient pas du placebo (Szigeti 2021).' },

  /* ── Neurobiologie ── */
  'neurone-pyramidal': { t: 'Neurone pyramidal de la couche V', k: 'neuro', en: 'layer V pyramidal neuron', def: 'Grand neurone glutamatergique du cortex, dont la dendrite apicale monte vers la surface ; il intègre l’information et la renvoie vers le thalamus et d’autres aires. Ses dendrites portent une forte densité de récepteurs 5-HT2A.', panes: ['c-5ht2a'] },
  'ampa': { t: 'Récepteur AMPA', k: 'rec', en: 'AMPA receptor', def: 'Récepteur ionotrope du glutamate responsable de la transmission excitatrice rapide ; son activation déclenche la libération de BDNF et la cascade de plasticité commune aux psychédéliques et à la kétamine.', see: ['mtor'] },
  'bdnf': { t: 'BDNF', k: 'neuro', en: 'brain-derived neurotrophic factor', def: 'Facteur neurotrophique qui, en se liant à TrkB, favorise la croissance des épines et des dendrites et la consolidation des apprentissages.', panes: ['c-trkb'] },
  'mtor': { t: 'mTOR', k: 'neuro', en: 'mechanistic target of rapamycin', def: 'Kinase qui commande la synthèse de protéines synaptiques ; en aval de TrkB, elle relaie la croissance des épines induite par la kétamine et les psychédéliques (Ly 2018).' },
  'psychoplastogene': { t: 'Psychoplastogène', k: 'neuro', en: 'psychoplastogen', def: 'Molécule qui induit rapidement une plasticité structurale (neurites, épines) après une seule administration : psychédéliques, kétamine (Ly et al. 2018).', see: ['periode-critique'] },
  'epine': { t: 'Épine dendritique', k: 'neuro', en: 'dendritic spine', def: 'Petite protubérance d’une dendrite qui porte une synapse excitatrice. Une dose de psilocybine en augmente la densité d’environ 10 % chez la souris, pendant au moins un mois (Shao 2021).' },
  'periode-critique': { t: 'Période critique', k: 'neuro', en: 'critical period', def: 'Fenêtre du développement pendant laquelle un apprentissage est facile, puis se referme. Chez la souris adulte, les psychédéliques rouvrent la période d’apprentissage de la récompense sociale, pour une durée proportionnelle à celle de leurs effets (Nardou 2023).' },
  'head-twitch': { t: 'Head-twitch', k: 'neuro', en: 'head-twitch response', def: 'Secousse rapide de la tête chez la souris, provoquée par les agonistes 5-HT2A et absente chez les souris sans ce récepteur : le test qui prédit l’effet hallucinogène chez l’humain.' },
  'dmn': { t: 'Réseau du mode par défaut', k: 'neuro', en: 'default mode network', def: 'Ensemble d’aires (cortex préfrontal médian, cingulaire postérieur, hippocampe…) actives quand on pense à soi, au passé, à l’avenir. Hyperactif dans la rumination ; désorganisé sous psilocybine.' },
  'entropie': { t: 'Entropie cérébrale', k: 'neuro', en: 'brain entropy', def: 'Imprévisibilité de l’activité cérébrale spontanée. Elle augmente sous psychédélique et suit la richesse de l’expérience (hypothèse du « cerveau entropique », Carhart-Harris 2014).', see: ['criticite'] },
  'criticite': { t: 'Criticité', k: 'mod', en: 'criticality', def: 'Régime d’un système complexe à la frontière de l’ordre et du désordre, où il est à la fois stable et adaptable. Les psychédéliques rapprocheraient le cerveau de ce point.' },
  'constantes-forme': { t: 'Constantes de forme', k: 'neuro', en: 'form constants', def: 'Quatre patterns géométriques décrits par Heinrich Klüver sous mescaline (1926) : tunnels, spirales, treillis, toiles d’araignée. Ils s’expliquent par la carte log-polaire du champ visuel sur le cortex visuel primaire.' },
  'v1': { t: 'Cortex visuel primaire (V1)', k: 'neuro', en: 'primary visual cortex', def: 'Première aire corticale de la vision. Le champ visuel y est projeté de façon déformée : le centre est agrandi, et la position autour du point fixé se lit selon le logarithme de la distance et l’angle (carte log-polaire).' },

  /* ── Modèles ── */
  'prior': { t: 'Prior', k: 'mod', en: 'prior', def: 'Croyance avant les données : ce que le cerveau attend. Dans le modèle bayésien, c’est une distribution, plus ou moins précise.', see: ['vraisemblance', 'posterieur', 'precision'] },
  'vraisemblance': { t: 'Vraisemblance', k: 'mod', en: 'likelihood', def: 'Ce que disent les données (les sens, la mémoire) : la probabilité de ce que l’on perçoit selon chaque état possible du monde.', see: ['prior', 'posterieur'] },
  'posterieur': { t: 'Postérieur', k: 'mod', en: 'posterior', def: 'Croyance après les données : le produit du prior et de la vraisemblance. Sa moyenne est la moyenne des deux, pondérée par leurs précisions.', see: ['prior', 'precision'] },
  'precision': { t: 'Précision', k: 'mod', en: 'precision', def: 'Inverse de la variance d’une distribution : la confiance accordée à une croyance ou à une donnée. Une croyance très précise ignore presque toute donnée contraire.', more: 'Le modèle REBUS propose que les psychédéliques diminuent la précision des croyances de haut niveau.', see: ['rebus'] },
  'erreur-prediction': { t: 'Erreur de prédiction', k: 'mod', en: 'prediction error', def: 'Différence entre ce que le cerveau prédit et ce qu’il reçoit. Pondérée par sa précision, elle sert à mettre à jour les croyances (codage prédictif).' },
  'energie-libre': { t: 'Principe de l’énergie libre', k: 'mod', en: 'free-energy principle', def: 'Principe (Karl Friston) selon lequel le cerveau minimise la surprise en ajustant ses modèles du monde ou en agissant sur lui. REBUS l’applique aux psychédéliques.' },
  'rebus': { t: 'REBUS', k: 'mod', en: 'RElaxed Beliefs Under pSychedelics', def: 'Modèle de Carhart-Harris et Friston (2019) : les psychédéliques relâchent la précision des croyances de haut niveau, ce qui laisse l’information ascendante peser davantage et permet de réviser des croyances rigides.', see: ['precision', 'recuit-simule'] },
  'recuit-simule': { t: 'Recuit (~ _neural annealing_)', k: 'mod', en: 'annealing', def: 'Image empruntée à la métallurgie, et aux algorithmes d’optimisation qui l’imitent (_simulated annealing_) : on « chauffe » un système pour qu’il quitte un minimum local, puis on le refroidit lentement pour qu’il se fixe dans une meilleure configuration. REBUS l’applique au cerveau sous psychédélique : c’est le _neural annealing_.' },
  'attracteur': { t: 'Attracteur', k: 'mod', en: 'attractor', def: 'État vers lequel un système dynamique tend à revenir, comme une bille au fond d’une vallée. En psychopathologie : rumination, craving, compulsion.', see: ['canalisation', 'multistabilite'] },
  'canalisation': { t: 'Canalisation', k: 'mod', en: 'canalization', def: 'Approfondissement d’un chemin à force d’être emprunté, comme l’eau creuse son lit (Waddington). Pour Carhart-Harris et al. (2023), la psychopathologie se développe par canalisation, en réponse défensive à l’adversité.', see: ['attracteur'] },
  'multistabilite': { t: 'Multistabilité', k: 'mod', en: 'multistability', def: 'Capacité d’un système à disposer de plusieurs états stables et à passer de l’un à l’autre. Pour Hipólito et al. (2023), c’est la définition dynamique de la santé mentale.', see: ['flexibilite-psychologique'] },
  'flexibilite-psychologique': { t: 'Flexibilité psychologique', k: 'cpt', en: 'psychological flexibility', def: 'Capacité à rester en contact avec le moment présent, y compris avec des pensées et émotions difficiles, et à agir selon ses valeurs. Notion centrale de l’ACT ; mesurée par l’AAQ-II.', more: 'Dans les enquêtes de Romeo, Kervadec et al., elle augmente après une expérience psychédélique marquante, d’autant plus que l’expérience était intense.', see: ['aaq2', 'act'] },

  /* ── Échelles ── */
  'meq30': { t: 'MEQ-30', k: 'ech', en: 'Mystical Experience Questionnaire', def: 'Questionnaire de 30 items sur l’expérience mystique, en quatre facteurs : unité (mystique), humeur positive, transcendance du temps et de l’espace, ineffabilité. Expérience « complète » si au moins 60 % du maximum sur chaque facteur.', more: 'Une version française a été validée par Fauvel et al.', see: ['experience-mystique'] },
  'asc5d': { t: '5D-ASC', k: 'ech', en: 'Five-Dimensional Altered States of Consciousness', def: 'Questionnaire des états modifiés de conscience : illimitation océanique, angoisse de dissolution, restructuration visionnaire, altérations auditives, baisse de vigilance ; une version en onze facteurs (11D-ASC) le détaille.' },
  'ebi': { t: 'EBI', k: 'ech', en: 'Emotional Breakthrough Inventory', def: 'Questionnaire de la « percée émotionnelle » : affronter et libérer des émotions difficiles pendant l’expérience ; prédit l’amélioration (Roseman 2019).' },
  'ceq': { t: 'CEQ', k: 'ech', en: 'Challenging Experience Questionnaire', def: 'Questionnaire de l’expérience difficile : peur, deuil, peur de la folie, isolement, détresse physique, paranoïa, sentiment de mort (Barrett 2016).', see: ['bad-trip'] },
  'aaq2': { t: 'AAQ-II', k: 'ech', en: 'Acceptance and Action Questionnaire II', def: 'Questionnaire de 7 items qui mesure l’inflexibilité psychologique (évitement expérientiel) ; un score plus bas signe plus de flexibilité.', see: ['flexibilite-psychologique'] },
  'madrs': { t: 'MADRS', k: 'ech', en: 'Montgomery–Åsberg Depression Rating Scale', def: 'Échelle de dépression en 10 items, notée de 0 à 60 ; critère principal des essais de psilocybine. Une différence de 2 à 3 points avec le placebo est l’ordre de grandeur des antidépresseurs.' },
  'ham-a': { t: 'HAM-A', k: 'ech', en: 'Hamilton Anxiety Rating Scale', def: 'Échelle d’anxiété en 14 items, notée de 0 à 56 ; critère principal des essais du LSD dans le trouble anxieux généralisé.' },
  'caps5': { t: 'CAPS-5', k: 'ech', en: 'Clinician-Administered PTSD Scale for DSM-5', def: 'Entretien structuré de référence pour le diagnostic et la sévérité du trouble de stress post-traumatique ; critère principal des essais de la MDMA.' },

  /* ── Méthode et clinique ── */
  'set': { t: 'Set', k: 'meth', en: 'set (mindset)', def: 'L’état d’esprit avec lequel on aborde l’expérience : intentions, attentes, humeur, histoire, personnalité. Terme employé dès 1958, popularisé par Leary en 1961.', see: ['setting'] },
  'setting': { t: 'Setting', k: 'meth', en: 'setting', def: 'Le cadre de l’expérience : lieu, personnes présentes, musique, moment, culture. Avec le set, l’une des deux variables qui façonnent l’expérience autant que la dose.', see: ['set'] },
  'integration': { t: 'Intégration', k: 'meth', en: 'integration', def: 'Travail qui suit la session : mettre en mots l’expérience, en dégager un sens personnel, la relier à ses valeurs et la traduire en changements concrets.', see: ['flexibilite-psychologique', 'act'] },
  'act': { t: 'Thérapie d’acceptation et d’engagement (ACT)', k: 'meth', en: 'acceptance and commitment therapy', def: 'Thérapie comportementale de troisième vague visant la flexibilité psychologique : acceptation, défusion, présent, soi comme contexte, valeurs, action engagée. Le modèle ACE l’adapte aux psychédéliques.', see: ['flexibilite-psychologique'] },
  'placebo-actif': { t: 'Placebo actif', k: 'meth', en: 'active placebo', def: 'Substance qui produit des effets ressentis sans l’effet thérapeutique attendu (niacine, méthylphénidate, diphénhydramine, très faible dose), pour préserver l’aveugle.' },
  'levee-aveugle': { t: 'Levée fonctionnelle de l’aveugle', k: 'meth', en: 'functional unblinding', def: 'Situation où les participants devinent leur groupe à partir des effets ressentis : plus de 90 % dans certains essais de psychédéliques. Elle gonfle l’écart avec le contrôle.' },
  'stupefiant': { t: 'Stupéfiant', k: 'reg', en: 'narcotic (controlled substance)', def: 'Substance inscrite sur la liste fixée par l’arrêté du 22 février 1990 et mise à jour par l’ANSM : production, détention, usage interdits sauf autorisation. Psilocybine, LSD, DMT, mescaline, MDMA, ibogaïne, 5-MeO-DMT (depuis juin 2026) en font partie.' },
  'usage-compassionnel': { t: 'Usage compassionnel', k: 'reg', en: 'compassionate use', def: 'Accès à un médicament non autorisé, hors essai, pour des patients sans alternative : la psilocybine en Allemagne (2025) ou en Suisse ; la kétamine IV en France (2026).' },
  'reduction-risques': { t: 'Réduction des risques', k: 'reg', en: 'harm reduction', def: 'Politique de santé publique, inscrite dans la loi (2004, 2016), qui vise à limiter les dommages des usages sans exiger l’abstinence : information, analyse des produits, accompagnement.' },
  'ergotisme': { t: 'Ergotisme', k: 'hist', en: 'ergotism', def: 'Intoxication par l’ergot de seigle (_Claviceps purpurea_), dont les alcaloïdes sont des cousins du LSD : « mal des ardents » médiéval, convulsions, gangrènes, hallucinations.' },
  'velada': { t: 'Velada', k: 'hist', en: 'velada', def: 'Cérémonie nocturne de guérison ou de divination des Mazatèques, avec chants et champignons, guidée par un curandero ou une curandera comme María Sabina.' },
  'bwiti': { t: 'Bwiti', k: 'hist', en: 'Bwiti', def: 'Tradition spirituelle du Gabon et du Cameroun dont les initiations utilisent la racine d’iboga.' },
  'psycholytique': { t: 'Thérapie psycholytique', k: 'hist', en: 'psycholytic therapy', def: 'Approche européenne des années 1950–1960 : de petites doses répétées de LSD au service d’une psychothérapie d’inspiration analytique, pour « dissoudre » les défenses.', vs: ['psychedelique-therapie'] },
  'psychedelique-therapie': { t: 'Thérapie psychédélique', k: 'hist', en: 'psychedelic therapy', def: 'Approche nord-américaine des années 1950–1960 : une forte dose, préparée et accompagnée, visant une expérience décisive ; ancêtre direct des protocoles actuels.', vs: ['psycholytique'] }
};

/* ─── panes ─── */
/* Panneaux des cibles moléculaires. */
C.panes = {
  'c-5ht2a': { type: 'target', k: 'rec', fam: 'Sérotonine', t: '5-HT2A', sub: 'récepteur sérotoninergique 2A · RCPG couplé à Gq',
    lead: 'Le récepteur nécessaire à l’effet des psychédéliques classiques : le bloquer (kétansérine) supprime l’expérience ; son occupation en prédit l’intensité.',
    where: 'Très dense sur les dendrites apicales des neurones pyramidaux de la couche V du cortex associatif (préfrontal, cingulaire, pariétal) et du cortex visuel ; aussi dans le claustrum et le thalamus. Une partie des récepteurs est intracellulaire (Vargas 2023).',
    does: 'Couplé à Gq (phospholipase C, IP3, calcium) : il excite le neurone et favorise la libération de glutamate. Selon la molécule, il recrute plus ou moins la β-arrestine : c’est le [[biais-fonctionnel|biais fonctionnel]].',
    block: 'Antagonistes : kétansérine (supprime l’effet psychédélique), et de nombreux antipsychotiques de 2e génération, la mirtazapine, la trazodone (sommeil, moindre agitation).',
    stim: 'Agonistes : psilocine, LSD, DMT, mescaline. Effets : perceptions modifiées, émotions amplifiées, relâchement des croyances ; chez la souris, le [[head-twitch|head-twitch]].',
    mols: ['psilocybine', 'lsd', 'dmt', 'meodmt', 'mescaline', 'ayahuasca'],
    src: 'Vollenweider 1998 ; Madsen 2019 ; Vargas 2023 ; Nichols 2016' },
  'c-5ht2b': { type: 'target', k: 'rec', fam: 'Sérotonine', t: '5-HT2B', sub: 'récepteur sérotoninergique 2B · RCPG couplé à Gq',
    lead: 'Le récepteur des valves cardiaques : sa stimulation chronique est la crainte théorique du microdosage répété.',
    where: 'Valves cardiaques, artères pulmonaires, intestin ; peu dans le cerveau.',
    does: 'Stimulé de façon prolongée, il fait proliférer les fibroblastes des valves : valvulopathies décrites avec la fenfluramine, le benfluorex (Mediator) et le pergolide.',
    stim: 'Le LSD et la psilocine l’activent ; c’est sur lui que la structure du LSD a été obtenue (Wacker 2017). Une prise isolée n’expose pas à ce risque ; des prises quotidiennes prolongées, en théorie, si.',
    mols: ['lsd', 'psilocybine', 'mdma'],
    src: 'Wacker 2017 ; Nichols 2016' },
  'c-sert': { type: 'target', k: 'tr', fam: 'Sérotonine', t: 'SERT', sub: 'transporteur de la sérotonine · gène SLC6A4',
    lead: 'La porte d’entrée de la MDMA : elle l’emprunte et l’inverse, libérant massivement la sérotonine.',
    where: 'Membrane des neurones sérotoninergiques du raphé et de leurs terminaisons ; plaquettes.',
    does: 'Recapte la sérotonine de la fente synaptique. Les ISRS le bloquent ; la MDMA, substrat, le fait fonctionner à l’envers.',
    block: 'Les ISRS empêchent la MDMA d’entrer : son effet est atténué. L’ibogaïne l’inhibe aussi.',
    mols: ['mdma', 'ibogaine'],
    src: 'Nichols 2016' },
  'c-mao': { type: 'target', k: 'enz', fam: 'Monoamines', t: 'MAO-A', sub: 'monoamine oxydase A · enzyme mitochondriale',
    lead: 'L’enzyme qui détruit la DMT dans l’intestin : l’inhiber rend la DMT active par la bouche, c’est le principe de l’ayahuasca.',
    where: 'Membrane externe des mitochondries ; intestin, foie, cerveau.',
    does: 'Dégrade sérotonine, noradrénaline, dopamine, tyramine et tryptamines comme la DMT.',
    block: 'Les β-carbolines de la liane (harmine, harmaline) l’inhibent de façon réversible : DMT active par voie orale, mais risque de syndrome sérotoninergique avec les ISRS, la MDMA, le tramadol, la 5-MeO-DMT.',
    mols: ['ayahuasca', 'dmt', 'meodmt'],
    src: 'SPF 2022' },
  'c-nmda': { type: 'target', k: 'can', fam: 'Glutamate', t: 'NMDA', sub: 'récepteur ionotrope du glutamate · canal calcique',
    lead: 'La cible de la kétamine, et l’une de celles de l’ibogaïne : le bloquer produit une dissociation et, en aval, une bouffée de plasticité.',
    where: 'Partout dans le cerveau, notamment sur les interneurones GABA qui freinent les neurones pyramidaux.',
    does: 'Canal activé par le glutamate quand la membrane est déjà dépolarisée : un détecteur de coïncidence, au cœur de l’apprentissage.',
    block: 'Kétamine (antagoniste non compétitif) : désinhibition des neurones pyramidaux, bouffée de glutamate, récepteurs AMPA, BDNF, mTOR, synaptogenèse ; effet antidépresseur rapide.',
    mols: ['ketamine', 'ibogaine'],
    src: 'RCP Spravato ; Nichols 2016' },
  'c-trkb': { type: 'target', k: 'rec', fam: 'Neurotrophines', t: 'TrkB', sub: 'récepteur tyrosine kinase B · récepteur du BDNF',
    lead: 'Le récepteur de la plasticité : les antidépresseurs s’y fixent faiblement, le LSD et la psilocine mille fois plus fort (Moliner 2023).',
    where: 'Membrane des neurones, dans les épines dendritiques et les terminaisons.',
    does: 'Lié par le BDNF, il active mTOR et la synthèse de protéines synaptiques : croissance des épines, consolidation des apprentissages.',
    stim: 'Le LSD et la psilocine s’y fixent directement et potentialisent le BDNF, indépendamment de 5-HT2A chez la souris : une plasticité sans hallucination serait possible.',
    mols: ['lsd', 'psilocybine', 'ketamine'],
    src: 'Moliner et al., Nat Neurosci 2023 ; Ly et al. 2018' },
  'c-kor': { type: 'target', k: 'rec', fam: 'Opioïdes', t: 'κ-opioïde', sub: 'récepteur opioïde kappa · RCPG couplé à Gi',
    lead: 'Le récepteur opioïde de la dysphorie et du stress, cible de l’ibogaïne (et de la salvinorine A).',
    where: 'Noyau accumbens, amygdale, hypothalamus ; ligand naturel : la dynorphine.',
    does: 'Freine la libération de dopamine ; impliqué dans les affects négatifs du sevrage et de la rechute.',
    stim: 'L’ibogaïne et la noribogaïne s’y fixent : une des hypothèses de leur effet sur le sevrage des opioïdes.',
    mols: ['ibogaine'],
    src: 'Nichols 2016' },
  'c-herg': { type: 'target', k: 'can', fam: 'Cœur', t: 'hERG', sub: 'canal potassique Kv11.1 · repolarisation cardiaque',
    lead: 'Le canal dont le blocage allonge le QT : la raison des morts subites sous ibogaïne.',
    where: 'Cellules cardiaques (courant potassique IKr).',
    does: 'Repolarise le myocarde ; le bloquer allonge l’intervalle QT et expose aux torsades de pointes.',
    block: 'L’ibogaïne et la noribogaïne le bloquent : ECG, kaliémie et magnésémie avant toute administration ; pas d’association avec d’autres médicaments allongeant le QT.',
    mols: ['ibogaine'],
    src: 'Alper et al. ; Meisner et al. 2016' }
};

/* ─── slides-1 ─── */
/* Diapositives — 00 Ouverture et 01 Histoire.
   b : affiché en lecture et en projection ; more : lecture seulement ; notes : notes de l’enseignant ;
   f: true ou step: true : apparition au clic en projection ; mins : minutes prévues ; lvl: 'plus' : approfondissement. */
C.slides.push(

/* ───────── 00 · Ouverture ───────── */
{ id: 'couverture', ch: 'ouv', kind: 'cover', t: 'Kaléidoscopiques Psychédéliques', short: 'Couverture', mins: 1,
  sub: 'Introduction à une psychopharmacologie dissidente' },

{ id: 'velo', ch: 'ouv', t: 'Bâle, 19 avril 1943 : un chimiste rentre à vélo', short: 'Le jour du vélo', mins: 1.5,
  b: [
    { hist: 'h-hofmann', d: '19 avril : 250 µg, une dose qu’il croit prudente. Le retour à vélo, la peur de devenir fou ; le lendemain, un sentiment de renouveau.' },
    { pair: { lab: 'Une utilité à définir', q: 'Vous dirigez la recherche de Sandoz en 1943. Une molécule active à un quart de milligramme bouleverse la perception pendant huit heures. À quoi proposeriez-vous qu’elle serve ?' }, d: 'Un quart de milligramme, huit heures de perception bouleversée : à quoi la faire servir ?', f: true }
  ],
  more: [{ p: 'Sandoz commercialisera le LSD en 1947 sous le nom de Delysid, pour la psychothérapie et pour l’étude des psychoses : on invitait même les psychiatres à le prendre eux-mêmes, pour éprouver de l’intérieur ce que vivent leurs patients. C’est l’idée de [[psychotomimetique|psychose modèle]], qui précède celle de traitement.' }],
  src: 'Hofmann, LSD mon enfant terrible (1979) ; Wikipédia' },

/* ───────── 01 · Histoire ───────── */
{ id: 'sec-hist', ch: 'hist', kind: 'section', t: 'Histoire', short: 'Histoire', mins: 0.5,
  sub: 'Des champignons sacrés aux essais de phase 3.' },

{ id: 'mots', ch: 'hist', t: 'Psychédélique : « qui rend l’esprit visible »', short: 'Les mots', mins: 1, obj: ['O1'],
  b: [
    { def: { t: 'Psychédélique', p: 'Du grec _psychê_ (l’esprit, l’âme) et _dêloun_ (rendre visible, manifester). Mot proposé en 1956–1957 par le psychiatre Humphry Osmond, en réponse à Aldous Huxley qui suggérait « phanérothyme ».', src: 'Osmond, Annals of the New York Academy of Sciences, 1957' }, d: '_psychê_, l’esprit ; _dêloun_, rendre visible. Le mot d’Osmond, en 1957.' },
    { cols: [
      { tag: '1950', h: 'Psychotomimétique', d: 'Qui imite la psychose', p: 'Qui imite la psychose : le regard des premiers chercheurs, qui y voyaient un modèle de la schizophrénie.' },
      { tag: '1957', h: 'Psychédélique', d: 'Qui manifeste l’esprit', p: 'Qui manifeste l’esprit : le regard d’Osmond et de Huxley, centré sur l’expérience.' },
      { tag: 'Pharmacologie', h: 'Hallucinogène', d: 'Le mot du droit, trompeur', p: 'Le mot des classifications et du droit ; trompeur, car les hallucinations vraies sont rares.' },
      { tag: '1979', h: 'Enthéogène', d: 'Qui fait naître le divin', p: 'Qui fait naître le divin en soi : le mot des usages rituels, que préférait Albert Hofmann.' }
    ], reveal: 'heads', f: true },
    { call: 'key', t: 'Aux doses habituelles, on voit surtout des **[[illusion|illusions]]** (le réel déformé, embelli, animé) et des [[pseudo-hallucination|pseudo-hallucinations]] reconnues comme telles ; une perception sans objet, non critiquée, est rare.', d: 'Surtout des **illusions** et des pseudo-hallucinations ; l’hallucination vraie est rare.', f: true }
  ],
  more: [{ p: 'Les deux rimes échangées par lettre sont restées célèbres : Huxley, « To make this mundane world sublime, take half a gram of phanerothyme » ; Osmond, « To fathom Hell or soar angelic, just take a pinch of psychedelic ».' }],
  src: 'Osmond 1957 ; NYAS ; SPF 2022' },

{ id: 'familles', ch: 'hist', t: 'Quatre familles, une seule définition stricte', short: 'Les familles', mins: 1.5, obj: ['O1'],
  b: [
    { viz: 'tiles', gridCols: 'minmax(0,2.3fr) repeat(3,minmax(0,1fr))' },
    { p: 'Au sens strict, un **psychédélique classique** est un [[agoniste]] des récepteurs {{c-5ht2a|5-HT2A}} : psilocybine, LSD, DMT, mescaline. Les autres « cousins » produisent des états modifiés par d’autres voies.', d: 'Psychédélique classique = **agoniste 5-HT2A** ; les « cousins » passent par d’autres voies.' },
        { ul: [
          '**Entactogène** : la {{mdma|MDMA}} libère la sérotonine (et la noradrénaline, la dopamine, l’ocytocine) : empathie, ouverture, peu de visions.',
          '**Dissociatif** : la {{ketamine|kétamine}} bloque les récepteurs {{c-nmda|NMDA}} : détachement, sensation de flotter hors du corps.',
          '**Atypique** : l’{{ibogaine|ibogaïne}} touche une dizaine de cibles ; ses visions ressemblent à des rêves éveillés (« onirogène »).'
        ], d: ['**Entactogène** · la MDMA libère la sérotonine', '**Dissociatif** · la kétamine bloque NMDA', '**Atypique** · l’ibogaïne, une dizaine de cibles'], step: true }
  ],
  more: [{ p: 'Les trois familles chimiques des classiques : les [[tryptamine|tryptamines]] (psilocybine, DMT, 5-MeO-DMT), les [[lysergamide|lysergamides]] (LSD) et les [[phenethylamine|phénéthylamines]] (mescaline). Elles partagent le même récepteur, d’où des effets voisins et une tolérance croisée.' }],
  src: 'Nichols 2016 ; SPF 2022' },

{ id: 'avant-labos', ch: 'hist', t: 'Avant les laboratoires : des usages rituels', short: 'Les usages rituels', mins: 1.5,
  b: [
    { split: [
      [{ hist: 'h-sabina', d: '1955 : un banquier new-yorkais assiste à sa _velada_ ; l’article de _Life_ attire les foules, sa maison est brûlée.' }],
      [{ ul: [
        '**Champignons** (_Psilocybe_) : _veladas_ mazatèques de l’Oaxaca, nuits de chants pour guérir et deviner ; un édit colonial les interdit dès 1620.',
        '**Peyotl** (mescaline) : Huichols, Tarahumaras ; l’Église amérindienne (Native American Church) l’utilise comme sacrement.',
        '**Ayahuasca** (DMT et IMAO) : Amazonie ; Églises syncrétiques brésiliennes (Santo Daime, União do Vegetal).',
        '**Iboga** (ibogaïne) : rites d’initiation du Bwiti au Gabon, décrits par un médecin de marine français en 1864.'
      ], d: ['**Champignons** · Mazatèques, Oaxaca', '**Peyotl** · Huichols, Native American Church', '**Ayahuasca** · Amazonie, Santo Daime', '**Iboga** · le Bwiti, au Gabon'], step: true }]
    ], r: '1fr' }
  ],
  more: [{ p: 'Un rite encadre l’expérience : un guide, un lieu, un moment, des chants, un sens partagé. C’est déjà ce que la clinique appellera _set and setting_. À Éleusis, pendant près de deux mille ans, les initiés buvaient le kykéon ; l’hypothèse d’un breuvage à l’ergot (Wasson, Hofmann et Ruck, 1978) reste discutée.' }],
  src: 'SPF 2022 (chap. histoire, V. Verroust) ; Wasson 1957 ; Estrada 1977' },

{ id: 'premiere-vague', ch: 'hist', t: 'La première vague (1947–1966)', short: 'La première vague', mins: 1.5, obj: ['O2'],
  b: [
    { steps: [
      { t: '1947 · Delysid', d: 'Offert aux chercheurs : 40 000 patients', p: 'Sandoz diffuse le LSD aux chercheurs du monde entier : de 1950 à 1965, plus d’un millier d’articles et quelque 40 000 patients traités.' },
      { t: '1950–1960 · Deux méthodes', d: 'Petites doses en Europe, une forte dose en Amérique', p: '[[psycholytique|Psycholytique]] en Europe (petites doses répétées, au service de la psychanalyse) ; [[psychedelique-therapie|psychédélique]] en Amérique du Nord (une forte dose, une expérience décisive).' },
      { t: '1953–1960 · Weyburn', d: 'Une dose de LSD contre l’alcoolisme', p: 'Osmond et Hoffer traitent l’alcoolisme par une dose de LSD dans un hôpital du Saskatchewan ; Bill Wilson, cofondateur des Alcooliques anonymes, en prend lui-même.' },
      { t: '1962 · Vendredi saint', d: 'La psilocybine et l’expérience mystique', p: 'À Boston, Walter Pahnke donne de la psilocybine ou de la niacine à vingt étudiants en théologie : presque tous ceux du premier groupe décrivent une expérience mystique.' }
    ], reveal: 'heads' },
    { kpis: [{ v: 'OR 1,96', l: 'méta-analyse de six essais randomisés des années 1960 (536 patients) : une dose de LSD réduit le mésusage d’alcool (Krebs et Johansen 2012)' }], d: [{ v: 'OR 1,96', l: '6 essais, 536 patients : une dose de LSD réduit le mésusage d’alcool (Krebs 2012)' }], f: true }
  ],
  more: [{ p: 'Ces essais étaient souvent mal contrôlés selon les critères actuels ; mais la méta-analyse de Krebs et Johansen ne retient que des essais randomisés, et l’effet y est homogène (I² = 0). Il a fallu cinquante ans pour qu’on la fasse.' }],
  src: 'Krebs et Johansen, J Psychopharmacol 2012 ; Doblin 1991' },

{ id: 'osmond-huxley', ch: 'hist', t: 'Le psychiatre et l’écrivain', short: 'Osmond et Huxley', mins: 1.5,
  b: [
    { split: [[{ hist: 'h-osmond', d: 'Une dose de LSD contre l’alcoolisme ; et le mot, en rime : « just take a pinch of psychedelic ».' }], [{ hist: 'h-huxley', d: 'La mescaline lui inspire _Les Portes de la perception_ ; mourant, il demande « LSD, 100 µg, i.m. ».' }]] }
  ],
  src: 'Wikipédia ; NYAS' },

{ id: 'france-mescaline', ch: 'hist', t: 'En France : la folie comme laboratoire', short: 'La France et la mescaline', mins: 1.5,
  b: [
    { split: [
      [{ hist: 'h-sartre', d: 'Une injection de mescaline à Sainte-Anne : des crustacés le suivent pendant des mois.' }],
      [{ ul: [
        '**1845** · Moreau de Tours, aliéniste, publie _Du hachisch et de l’aliénation mentale_ : la drogue comme modèle expérimental de la folie.',
        '**1955** · Henri Michaux prend de la mescaline avec Jean Paulhan ; _Misérable miracle_ paraît en 1956.',
        '**1958** · Jean Delay, Pierre Pichot et Roger Heim publient les effets de la psilocybine chez 18 sujets, à Sainte-Anne : un « psychodysleptique ».',
        '**1939–1966** · Lambarène, comprimés d’extrait d’iboga (≈ 8 mg d’ibogaïne), vendus en pharmacie contre la fatigue.'
      ], d: ['**1845** · Moreau de Tours : la drogue, modèle de la folie', '**1955** · Michaux et la mescaline', '**1958** · la psilocybine à Sainte-Anne', '**1939–1966** · l’iboga en pharmacie'], step: true }]
    ], r: '1fr' }
  ],
  src: 'Moreau de Tours 1845 ; Delay et al., CR Acad Sci 1958 ; Verroust (thèse, EHESS)' },

{ id: 'interdit', ch: 'hist', t: '1966–1971 : l’interdit', short: 'L’interdit', mins: 1.5, obj: ['O2'],
  b: [
    { steps: [
      { t: '1960–1963 · Harvard', d: 'Leary et Alpert, sans cadre', p: 'Timothy Leary et Richard Alpert distribuent la psilocybine sans cadre ; Alpert est renvoyé en 1963.' },
      { t: '1966', d: 'Le LSD interdit, le Delysid retiré', p: 'La Californie interdit le LSD ; Sandoz retire le Delysid ; en France, le LSD passe au tableau des stupéfiants.' },
      { t: '1970–1971', d: 'Annexe I : « sans intérêt thérapeutique »', p: 'Annexe I aux États-Unis (_Controlled Substances Act_) ; Convention des Nations unies sur les substances psychotropes : « sans intérêt thérapeutique ».' },
      { t: '1971–1990', d: 'Vingt ans sans recherche', p: 'La recherche s’arrête presque partout pendant vingt ans.' }
    ], reveal: 'heads' },
    { call: 'note', lab: 'Une rumeur', t: 'Pont-Saint-Esprit, août 1951 : plus de 250 intoxiqués, une cinquantaine d’internés, sept morts. L’hypothèse d’une expérience secrète de LSD a été réfutée : délai de plus de 36 heures et troubles digestifs, c’est l’[[ergotisme]] du pain de seigle.', d: 'Pont-Saint-Esprit, 1951 : pas du LSD, l’[[ergotisme]] du pain de seigle.', f: true }
  ],
  src: 'SPF 2022 ; Le Quotidien du pharmacien ; Gabbai et al., BMJ 1951' },

{ id: 'renaissance', ch: 'hist', t: 'La renaissance (1990–2026)', short: 'La renaissance', mins: 1.5, obj: ['O2'],
  b: [
    { split: [
      [{ steps: [
        { t: '1990–1995', d: 'Strassman et la DMT', p: 'Rick Strassman donne environ 400 doses de DMT à une soixantaine de volontaires : la première étude américaine en vingt ans.' },
        { t: '2006', d: 'Johns Hopkins : l’expérience mystique', p: 'Johns Hopkins : la psilocybine provoque des expériences mystiques ; à 14 mois, deux tiers les rangent parmi les cinq plus significatives de leur vie.' },
        { t: '2016–2022', d: 'Phases 2 : dépression, alcool, tabac', p: 'Essais de phase 2 dans la dépression, l’alcool, le tabac, la fin de vie.' },
        { t: '2025–2026', d: 'Premières phases 3 positives', p: 'Premiers essais de phase 3 positifs (psilocybine, LSD) ; dossiers déposés à la FDA.' }
      ], reveal: 'heads' }],
      [{ hist: 'h-mckenna', d: 'La « dose héroïque » ; et la théorie du « singe défoncé », sans aucune base.' }]
    ], r: '1fr' }
  ],
  src: 'Strassman 2001 ; Griffiths et al. 2006, 2008 ; Compass Pathways ; Definium' }
);

/* ─── slides-2 ─── */
/* Diapositives — 02 Pharmacologie et 03 Neurobiologie. */
C.slides.push(

/* ───────── 02 · Pharmacologie ───────── */
{ id: 'sec-pharma', ch: 'pharma', kind: 'section', t: 'Pharmacologie', short: 'Pharmacologie', mins: 0.5,
  sub: 'Sept molécules, de quinze minutes à trente-six heures.' },

{ id: 'experience', ch: 'pharma', t: 'Ce que l’on ressent : les sens, la pensée, le soi', short: 'L’expérience', mins: 1.5, obj: ['O1'],
  b: [
    { split: [
      [{ html: '<figure class="vid"><video poster="assets/video/paves.jpg" muted loop playsinline preload="none" controls aria-label="Reproduction d’effets visuels : des pavés qui ondulent, se colorent et se couvrent de patterns géométriques"><source src="assets/video/paves.mp4" type="video/mp4"><source src="assets/video/paves.webm" type="video/webm"></video><figcaption>Reproduction d’effets visuels (vidéo : Symmetric Vision) : surfaces qui respirent, couleurs avivées, patterns géométriques sur le réel.</figcaption></figure>' }],
      [{ cols: [
        { tag: 'Les sens', h: 'Perceptions', p: 'Couleurs avivées, surfaces qui ondulent, patterns géométriques, [[synesthesie|synesthésies]], visions les yeux fermés, temps dilaté.' },
        { tag: 'La pensée', h: 'Émotions et pensées', p: 'Émotions amplifiées (euphorie ou angoisse), souvenirs, idées vécues comme des évidences, boucles de pensée, [[suggestibilite|suggestibilité]] accrue.' },
        { tag: 'Le soi', h: 'Le sentiment de soi', p: '[[dissolution-ego|Dissolution de l’ego]], sentiment d’unité, [[experience-mystique|expérience « mystique »]] : ineffable, sacrée, hors du temps.' }
      ], reveal: 'heads' }]
    ], r: '1fr', only: 'read' },
    { split: [
      [{ html: '<figure class="vid vid-big"><video poster="assets/video/paves.jpg" muted loop playsinline preload="none" controls aria-label="Reproduction d’effets visuels : des pavés qui ondulent, se colorent et se couvrent de patterns géométriques"><source src="assets/video/paves.mp4" type="video/mp4"><source src="assets/video/paves.webm" type="video/webm"></video><figcaption>Reproduction d’effets visuels · Symmetric Vision</figcaption></figure>' }],
      [{ cols: [
        { tag: 'Les sens', h: 'Perception' },
        { tag: 'La pensée', h: 'Émotion et cognition' },
        { tag: 'Le soi', h: 'Le sentiment de soi' }
      ], k: 'xp-words', step: true }]
    ], r: '2.5fr', only: 'deck' }
  ],
  more: [{ p: 'Ces effets dépendent de la dose, de l’état d’esprit (_set_) et du cadre (_setting_). L’intensité se mesure par des questionnaires : le [[meq30|MEQ-30]] pour l’expérience mystique, le [[asc5d|5D-ASC]] pour les états modifiés de conscience (voir ((mesurer|Mesurer l’expérience))).' }],
  src: 'SPF 2022 ; vidéo Symmetric Vision' },

{ id: 'structures', ch: 'pharma', t: 'Des cousins de la sérotonine', short: 'Les structures', mins: 1, obj: ['O3'],
  b: [
    { formula: ['serotonine', 'psilocine', 'dmt', 'lsd', 'mescaline'], names: { serotonine: 'sérotonine', psilocine: 'psilocine', dmt: 'DMT', lsd: 'LSD', mescaline: 'mescaline' }, w: 200 },
    { p: 'Le noyau [[tryptamine|indole]] de la sérotonine se retrouve dans la psilocine, la DMT et le LSD ; la mescaline est une [[phenethylamine|phénéthylamine]], comme la dopamine. Tous se fixent au même récepteur, {{c-5ht2a|5-HT2A}}.', d: 'Un noyau **indole** commun (sauf la mescaline, une phénéthylamine) ; une même cible : {{c-5ht2a|5-HT2A}}.', f: true },
    { call: 'key', t: 'La **psilocybine** est un [[promedicament|promédicament]] : les phosphatases de l’intestin et du foie lui retirent son phosphate ; c’est la **psilocine**, plus lipophile, qui entre dans le cerveau.', d: 'La **psilocybine** est un promédicament : c’est la **psilocine** qui entre dans le cerveau.', f: true }
  ],
  src: 'Structures : RDKit ; Nichols 2016' },

{ id: 'durees', ch: 'pharma', t: 'Quinze minutes ou trente-six heures', short: 'Les durées', mins: 1.5, obj: ['O3'],
  b: [
    { viz: 'durees', steps: [{ on: ['psilocybine'] }, { on: ['psilocybine', 'lsd', 'mescaline'] }, { on: ['dmt', 'meodmt', 'ketamine', 'psilocybine', 'lsd', 'mescaline'] }, { on: ['dmt', 'meodmt', 'ketamine', 'psilocybine', 'mdma', 'lsd', 'mescaline', 'ibogaine'] }, { on: ['lsd', 'lsdk'], ket: true }] }
  ],
  more: [{ p: 'La durée commande l’organisation des soins : une session de DMT ou de 5-MeO-DMT tient dans une consultation, une session de psilocybine dans une journée d’hôpital de jour, le LSD et la mescaline demandent une longue journée, l’ibogaïne une hospitalisation avec monitorage cardiaque.' }],
  src: 'Ley et al. 2023 ; Becker et al. 2023 ; SPF 2022' },

/* Une diapositive par molécule principale : pharmacologie (cible, délai, dose, repère) et histoire (au clic). */
{ id: 'mol-psilocybine', ch: 'pharma', t: 'La psilocybine : des champignons sacrés aux essais de phase 3', short: 'La psilocybine', mins: 2, obj: ['O3'],
  b: [{ mol: 'psilocybine', cls: 'Psychédélique classique · tryptamine',
    facts: [
      ['Cible', '[[promedicament|Promédicament]] : déphosphorylée en **psilocine**, agoniste partiel des récepteurs {{c-5ht2a|5-HT2A}} (aussi 5-HT1A, 5-HT2C)', '**Psilocine** (promédicament) : agoniste {{c-5ht2a|5-HT2A}}'],
      ['Délai, pic, fin', 'Voie orale : 20–40 min, 1–2 h, 4–6 h'],
      ['Dose étudiée', '25 mg de psilocybine de synthèse (COMP360) ; contrôles à 1 ou 10 mg', '25 mg (contrôle : 1 mg)'],
      ['Repère', 'L’occupation des 5-HT2A (jusqu’à 72 %) prédit l’intensité ressentie (Madsen 2019)', null]
    ],
    hist: [
      ['1955', 'R. Gordon Wasson participe à une _velada_ de María Sabina, dans l’Oaxaca', 'Wasson chez María Sabina'],
      ['1957', '« Seeking the Magic Mushroom » paraît dans _Life_', 'L’article de _Life_'],
      ['1958', 'Hofmann isole la psilocybine ; Delay, Pichot et Heim la testent à Sainte-Anne', 'Hofmann l’isole ; Sainte-Anne la teste'],
      ['2025–2026', 'COMP005 et COMP006 : deux phases 3 positives dans la dépression résistante', 'Deux phases 3 positives']
    ],
    img: { src: 'assets/img/champignons.jpg', alt: 'Des champignons à psilocybine qui poussent sur un pain de mycélium, sous une lumière violette' } }],
  src: 'Madsen 2019 ; Hofmann 1958 ; Delay et al. 1958 ; Compass Pathways 2025–2026' },

{ id: 'mol-lsd', ch: 'pharma', t: 'Le LSD : actif au microgramme', short: 'Le LSD', mins: 2, obj: ['O3'],
  b: [{ mol: 'lsd', cls: 'Psychédélique classique · ergoline',
    facts: [
      ['Cible', 'Agoniste {{c-5ht2a|5-HT2A}}, mais aussi 5-HT1A, {{c-5ht2b|5-HT2B}}, D2 : un profil large', 'Agoniste {{c-5ht2a|5-HT2A}}, profil large'],
      ['Délai, pic, fin', 'Voie orale : 30–60 min, 2–3 h, 8–12 h'],
      ['Dose étudiée', '100 µg dans les essais de phase 3 ; 50 µg en bras intermédiaire (Panorama)', '100 µg (phase 3)'],
      ['Repère', 'Une boucle du récepteur se referme sur la molécule comme un couvercle : sa puissance et sa durée (Wacker 2017)', 'Piégé sous un « couvercle »']
    ],
    hist: [
      ['1938', 'Albert Hofmann le synthétise chez Sandoz, à partir de l’ergot de seigle', 'Synthèse par Hofmann'],
      ['1943', 'Le « jour du vélo », le 19 avril'],
      ['1947–1966', 'Vendu sous le nom de Delysid ; des milliers de patients traités', 'Le Delysid'],
      ['2025–2026', 'Phase 3 dans l’anxiété généralisée (Voyage, Panorama) et la dépression (Emerge)', 'Phases 3 : anxiété, dépression']
    ],
    por: 'hofmann' }],
  src: 'Wacker et al., Cell 2017 ; Hofmann 1979 ; Definium 2025–2026' },

{ id: 'mol-dmt', ch: 'pharma', t: 'DMT, ayahuasca, 5-MeO-DMT : les tryptamines brèves', short: 'DMT et ayahuasca', mins: 1.5, obj: ['O3'],
  b: [{ mol: 'dmt', dur: ['dmt', 'meodmt', 'ayahuasca'], cls: 'Psychédéliques classiques · tryptamines',
    facts: [
      ['Cibles', 'DMT : agoniste {{c-5ht2a|5-HT2A}} ; 5-MeO-DMT : surtout 5-HT1A, peu de visions', 'DMT : 5-HT2A ; 5-MeO-DMT : 5-HT1A'],
      ['Délai, durée', 'Inhalée ou intraveineuse : quelques secondes, 15–20 min ; ayahuasca par voie orale : 4–6 h', 'Inhalée : 15–20 min ; ayahuasca : 4–6 h'],
      ['Ayahuasca', 'La DMT des feuilles (_Psychotria viridis_) est détruite par la {{c-mao|MAO-A}} intestinale ; les [[beta-carbolines|β-carbolines]] de la liane (_Banisteriopsis caapi_) l’en protègent', 'DMT + un IMAO (la liane)'],
      ['Essais', '5-MeO-DMT inhalée (GH001), phase 2b : MADRS −15,5 contre placebo à 8 jours', '5-MeO-DMT : phase 2b positive']
    ],
    hist: [
      ['1990–1995', 'Rick Strassman : la première étude américaine sur un psychédélique en vingt ans', 'Strassman, la première étude en vingt ans'],
      ['1999–2007', 'Le procès parisien du Santo Daime ; l’ayahuasca classée stupéfiant en 2005', 'Le procès du Santo Daime'],
      ['2026', 'La 5-MeO-DMT classée stupéfiant en France (10 juin)', 'La 5-MeO-DMT classée stupéfiant']
    ] }],
  src: 'Strassman 2001 ; Barker 2018 ; GH Research 2024 ; ANSM 2026' },

{ id: 'mol-mescaline', ch: 'pharma', t: 'La mescaline : le cactus des psychiatres et des écrivains', short: 'La mescaline', mins: 1.5, obj: ['O3'],
  b: [{ mol: 'mescaline', cls: 'Psychédélique classique · phénéthylamine',
    facts: [
      ['Cible', 'Agoniste {{c-5ht2a|5-HT2A}} peu puissant : des centaines de milligrammes', 'Agoniste {{c-5ht2a|5-HT2A}}, peu puissant'],
      ['Délai, pic, fin', 'Voie orale : 1–2 h, 3–4 h, 12–14 h (500 mg)', '12–14 h (500 mg)'],
      ['Équivalence', '500 mg ≈ 100 µg de LSD ≈ 20 mg de psilocybine : des expériences comparables (Ley 2023)', '500 mg ≈ 100 µg de LSD ≈ 20 mg de psilocybine'],
      ['Sources', 'Peyotl (_Lophophora williamsii_), San Pedro (_Echinopsis pachanoi_)', 'Peyotl, San Pedro']
    ],
    hist: [
      ['1897', 'Arthur Heffter l’isole du peyotl'],
      ['1919', 'Ernst Späth la synthétise'],
      ['1935', 'Sartre en reçoit une injection à Sainte-Anne', 'Sartre, à Sainte-Anne'],
      ['1953', 'Huxley la prend avec Osmond ; _Les Portes de la perception_ paraissent en 1954', 'Huxley, _Les Portes de la perception_']
    ],
    por: 'huxley' }],
  src: 'Ley et al., Neuropsychopharmacology 2023 ; Heffter 1897 ; Späth 1919 ; Huxley 1954' },

{ id: 'mol-mdma', ch: 'pharma', t: 'La MDMA : un entactogène', short: 'La MDMA', mins: 1.5, obj: ['O3'],
  b: [{ mol: 'mdma', cls: 'Entactogène · phénéthylamine',
    facts: [
      ['Cible', 'Substrat du {{c-sert|SERT}} (et du NET, du DAT) : elle inverse le transporteur et libère sérotonine, noradrénaline, dopamine ; et de l’ocytocine', 'Inverse le {{c-sert|SERT}} : libère la sérotonine'],
      ['Délai, pic, fin', 'Voie orale : 30–60 min, 1,5–2 h, 4–6 h ; métabolisée par le CYP2D6', '4–6 h ; CYP2D6'],
      ['Dose étudiée', '80 à 120 mg, puis une demi-dose 1,5 à 2 h plus tard ; trois sessions (TSPT)', '80–120 mg ; trois sessions'],
      ['Essais', 'MAPP1 et MAPP2 : CAPS-5 −24,4 contre −13,9 ; refus de la FDA en 2024, nouveau dépôt en 2026', 'Deux phases 3 positives ; refus de la FDA']
    ],
    hist: [
      ['1912', 'Synthèse chez Merck'],
      ['1976–1985', 'Alexander Shulgin la fait connaître ; Leo Zeff l’utilise en psychothérapie (« Adam »)', 'Shulgin, Zeff : la psychothérapie'],
      ['1985', 'Classement en urgence aux États-Unis ; MAPS est fondée en 1986', 'Classement en urgence'],
      ['2024', 'Refus de la FDA : aveugle, attentes, durabilité', 'Refus de la FDA']
    ] }],
  src: 'Mitchell et al., Nat Med 2021 et 2023 ; FDA 2024 ; Resilient Pharmaceuticals 2026' },

{ id: 'mol-ketamine', ch: 'pharma', t: 'Kétamine et eskétamine : un dissociatif devenu antidépresseur', short: 'La kétamine', mins: 1.5, obj: ['O3'],
  b: [{ mol: 'ketamine', cls: 'Dissociatif · arylcyclohexylamine',
    facts: [
      ['Cible', 'Antagoniste non compétitif du récepteur {{c-nmda|NMDA}} : bouffée de glutamate, [[ampa|AMPA]], BDNF, [[mtor|mTOR]] et synaptogenèse', 'Antagoniste {{c-nmda|NMDA}} : glutamate, BDNF'],
      ['Délai, durée', 'IV, 0,5 mg/kg en 40 min : dissociation pendant la perfusion ; effet antidépresseur en 24 h', 'Un effet antidépresseur en 24 h'],
      ['Eskétamine', 'Énantiomère S, par voie nasale : 56 à 84 mg deux fois par semaine en induction, avec un ISRS ou un IRSNa', 'Voie nasale, avec un ISRS ou un IRSNa'],
      ['Essais', 'ESCAPE-TRD : rémission 27,1 % contre 17,6 % sous quétiapine LP', 'Rémission 27 % vs 18 % (ESCAPE-TRD)']
    ],
    hist: [
      ['1962', 'Synthèse chez Parke-Davis ; anesthésique à partir de 1970', 'Un anesthésique'],
      ['2000', 'Un effet antidépresseur rapide (Berman)'],
      ['2019', 'L’eskétamine (Spravato) autorisée en Europe', 'L’eskétamine autorisée'],
      ['2026', 'Kétamine IV : cadre compassionnel de l’ANSM (idées suicidaires sévères)', 'Kétamine IV : cadre compassionnel']
    ] }],
  src: 'Berman et al. 2000 ; Zarate et al. 2006 ; Reif et al., NEJM 2023 ; HAS 2024 ; ANSM 2026' },

{ id: 'mol-ibogaine', ch: 'pharma', t: 'L’ibogaïne : une dizaine de cibles, un cœur à surveiller', short: 'L’ibogaïne', mins: 1.5, obj: ['O3'],
  b: [{ mol: 'ibogaine', cls: 'Atypique (onirogène) · alcaloïde indolique',
    facts: [
      ['Cibles', 'Antagoniste {{c-nmda|NMDA}}, agoniste {{c-kor|κ-opioïde}}, faible antagoniste μ, inhibiteur du SERT et du DAT ; métabolisée par le CYP2D6 en [[noribogaine|noribogaïne]] (demi-vies : 2,5 h et 13 h)', '{{c-nmda|NMDA}}, {{c-kor|κ-opioïde}}, SERT, DAT ; noribogaïne'],
      ['Délai, durée', 'Voie orale : 1–3 h ; visions 4–8 h ; 24–36 h au total', '24–36 h au total'],
      ['Risque', 'Bloque les canaux {{c-herg|hERG}} : allongement du QT, torsades de pointes ; 34 décès publiés', '**QT long** : torsades de pointes, décès'],
      ['Revue', 'Trente ans de recherche clinique (1990–2025) : 24 études et 38 cas ; aucun essai contrôlé positif dans les opioïdes, un petit essai positif dans la cocaïne (Kervadec et al., _J Clin Psychopharmacol_ 2026)', 'Aucun essai contrôlé positif dans les opioïdes (Kervadec et al. 2026)']
    ],
    hist: [
      ['1901', 'Isolée de l’écorce de racine de _Tabernanthe iboga_', 'Isolée de l’iboga'],
      ['1939–années 1960', 'Lambarène : des comprimés vendus en pharmacie, en France', 'Lambarène, en pharmacie'],
      ['1962', 'Howard Lotsof : l’envie d’héroïne disparaît', 'Lotsof : plus d’envie d’héroïne'],
      ['2007', 'Iboga et ibogaïne classées stupéfiants en France', 'Stupéfiant en France'],
      ['2025', 'Texas : 50 millions de dollars pour des essais', 'Texas : 50 M$ pour des essais']
    ] }],
  src: 'Kervadec et al., J Clin Psychopharmacol 2026 ; Cherian et al., Nat Med 2024 ; MIVILUDES ; Texas SB 2308 (2025)' },

{ id: 'tolerance', ch: 'pharma', t: 'Une tolérance rapide, une dépendance rare', short: 'Tolérance et dépendance', mins: 1.5, obj: ['O3'],
  b: [
    { kpis: [
      { v: 'jours', l: 'après quelques prises quotidiennes, l’effet s’émousse ([[tachyphylaxie]]) ; il revient en une à deux semaines' },
      { v: 'croisée', l: 'tolérance croisée entre LSD, psilocybine et mescaline : un même récepteur, désensibilisé' },
      { v: '0,2 %', l: 'des 9 233 usagers de champignons dans l’année ont consulté aux urgences (Global Drug Survey 2017)' }
    ], d: [{ v: 'jours', l: 'l’effet s’émousse, puis revient en une à deux semaines' }, { v: 'croisée', l: 'entre LSD, psilocybine et mescaline' }, { v: '0,2 %', l: 'des usagers de champignons aux urgences dans l’année' }], step: true },
    { p: 'Les animaux ne s’auto-administrent pas les psychédéliques classiques, et il n’y a pas de syndrome de sevrage : le risque addictif est faible. Ce n’est pas le cas de la kétamine, ni de la MDMA, dont l’usage peut devenir compulsif.', d: 'Ni auto-administration, ni sevrage ; sauf la kétamine et la MDMA.', f: true }
  ],
  more: [{ p: 'Aux urgences, les raisons de consultation étaient l’anxiété ou la panique et la méfiance ou la paranoïa (68 % chacune) ; tous sauf un étaient revenus à la normale en 24 heures. Facteurs rapportés : un mauvais état d’esprit, un mauvais lieu, les mélanges (Kopra et al. 2022).' }],
  src: 'Kopra et al., J Psychopharmacol 2022 ; Nichols 2016' },

{ id: 'toxicite', ch: 'pharma', t: 'Peu toxiques, pas inoffensives', short: 'La toxicité', mins: 1.5, obj: ['O3'],
  b: [
    { table: { head: ['Substance', 'Corps', 'Esprit'], rows: [
      ['Psychédéliques classiques', 'Tachycardie, hausse tensionnelle modérée, nausées, céphalées ; pas de toxicité directe connue', 'Anxiété, panique, [[bad-trip|expérience difficile]] ; décompensation psychotique ou maniaque chez les sujets vulnérables ; [[hppd|HPPD]]'],
      ['MDMA', 'Hyperthermie, [[hyponatremie|hyponatrémie]], hausse tensionnelle, syndrome sérotoninergique en association', 'Descente dépressive les jours suivants ; usage compulsif possible'],
      ['Kétamine', 'Hausse tensionnelle, nausées ; cystite ulcéreuse en usage chronique', 'Dissociation ; abus et dépendance'],
      ['Ibogaïne', '**Allongement du QT** ([[herg|hERG]]), troubles du rythme, morts subites', 'Visions prolongées, confusion, ataxie']
    ] }, d: { rows: [['Classiques', 'Tachycardie, HTA modérée, nausées', 'Angoisse ; psychose ou manie si vulnérable ; [[hppd|HPPD]]'], ['MDMA', 'Hyperthermie, hyponatrémie', 'Descente dépressive ; usage compulsif'], ['Kétamine', 'Cystite (usage chronique)', 'Dissociation ; dépendance'], ['Ibogaïne', '**QT long**, morts subites', 'Confusion, ataxie']] }, reveal: 'cells' },
    { kpis: [{ v: '9', l: 'événements indésirables graves pour plus de 1 000 administrations dans les essais (méta-analyse de Romeo, Kervadec et al., 2024 : 30 études ; un seul en phase aiguë)' }], d: [{ v: '9', l: 'événements graves pour plus de 1 000 administrations (Romeo, Kervadec et al. 2024)' }], f: true }
  ],
  more: [{ p: 'Dans la méta-analyse de sécurité de Romeo, Kervadec et al. (_Psychiatry Res_ 2024), aucune tentative de suicide n’a été observée pendant la phase aiguë ; trois auto-agressions sont survenues ensuite. Les effets fréquents étaient la hausse de la fréquence cardiaque et de la pression artérielle, les nausées, les céphalées et l’anxiété.' }],
  src: 'Romeo, Kervadec et al., Psychiatry Res 2024 ; Alper et al. ; SPF 2022' },

{ id: 'interactions', ch: 'pharma', t: 'Trois associations à connaître par cœur', short: 'Les interactions', mins: 1.5, obj: ['O3', 'O9'],
  b: [
    { cols: [
      { k: 'warn', tag: 'Convulsions', h: 'Lithium + psychédélique', d: '47 % de convulsions dans 62 récits (Nayak 2021) : **contre-indication**', p: 'Sur 62 récits en ligne d’association lithium–psychédélique classique, 47 % décrivent une crise convulsive, 39 % un recours aux urgences ; aucun avec la lamotrigine (Nayak 2021). **Contre-indication.**' },
      { k: 'warn', tag: 'Syndrome sérotoninergique', h: 'IMAO + sérotoninergiques', d: 'Ayahuasca + ISRS, MDMA, tramadol : syndrome sérotoninergique', p: 'L’ayahuasca contient des IMAO (harmine) : danger avec ISRS, IRSNa, MDMA, tramadol, 5-MeO-DMT. Le [[syndrome-serotoninergique|syndrome sérotoninergique]] peut être mortel.' },
      { k: 'warn', tag: 'Convulsions', h: 'Tramadol', d: 'Sérotoninergique et épileptogène', p: 'Abaisse le seuil épileptogène et est sérotoninergique : à éviter avec tous ces produits.' }
    ], reveal: 'heads' },
    { call: 'note', lab: 'Et les antidépresseurs ?', t: 'Les ISRS **atténuent** l’effet des psychédéliques classiques (moins de récepteurs 5-HT2A disponibles) sans danger majeur ; la plupart des essais les arrêtent avant la session, ce qui expose au syndrome d’arrêt et à la rechute.', d: 'Les ISRS **atténuent** l’effet, sans danger majeur ; on les arrête souvent avant la session.', f: true }
  ],
  src: 'Nayak et al., Pharmacopsychiatry 2021 ; SPF 2022 ; Johnson et al. 2008' },

/* ───────── 03 · Neurobiologie ───────── */
{ id: 'sec-neuro', ch: 'neuro', kind: 'section', t: 'Neurobiologie', short: 'Neurobiologie', mins: 0.5,
  sub: 'Du récepteur 5-HT2A au paysage des croyances.' },

{ id: 'recepteur', ch: 'neuro', t: 'Un récepteur nécessaire : 5-HT2A', short: 'Le récepteur 5-HT2A', mins: 1.5, obj: ['O4'],
  b: [
    { kpis: [
      { v: 'bloqué', l: 'la kétansérine, antagoniste 5-HT2A, supprime presque tout l’effet de la psilocybine (Vollenweider 1998) et du LSD (Preller 2017)' },
      { v: '72 %', l: 'd’occupation maximale des récepteurs 5-HT2A en TEP après 3 à 30 mg de psilocybine ; l’intensité ressentie suit l’occupation (Madsen 2019)' },
      { v: 'un couvercle', l: 'une boucle du récepteur se referme sur le LSD et le piège : il s’en détache très lentement (Wacker 2017)' }
    ], d: [{ v: 'bloqué', l: 'par la kétansérine : plus d’effet' }, { v: '72 %', l: 'd’occupation en TEP : l’intensité suit' }, { v: 'un couvercle', l: 'qui piège le LSD (Wacker 2017)' }], step: true },
    { p: 'Le {{c-5ht2a|récepteur 5-HT2A}} est un récepteur couplé à la protéine [[gq|Gq]] : il excite le neurone. Il est très dense sur les **neurones pyramidaux de la couche V** du cortex associatif, ceux qui intègrent l’information et la renvoient vers le thalamus et les autres aires.', d: 'Un récepteur excitateur ([[gq|Gq]]), dense sur les **neurones pyramidaux de la couche V**.', f: true }
  ],
  more: [{ p: 'Chez la souris, l’agonisme 5-HT2A produit un tic caractéristique, le [[head-twitch|head-twitch]] (secousse de la tête), absent chez les souris dépourvues du récepteur : c’est le test qui permet de prédire si une molécule sera hallucinogène chez l’humain.' }],
  src: 'Vollenweider et al. 1998 ; Preller et al. 2017 ; Madsen et al. 2019 ; Wacker et al. 2017' },

{ id: 'neurone', ch: 'neuro', t: 'Ce qui se passe dans un neurone pyramidal', short: 'Le neurone pyramidal', mins: 3, obj: ['O4'],
  b: [
    { viz: 'recepteur', steps: [{ s: 1 }, { s: 2 }, { s: 3 }, { s: 4 }, { s: 5 }, { s: 6 }, { s: 7 }] }
  ],
  more: [{ p: 'Les psychédéliques sont des [[psychoplastogene|psychoplastogènes]] : en quelques heures, ils font pousser neurites et épines dendritiques dans le cortex préfrontal, par une cascade qui passe par le glutamate, les récepteurs [[ampa|AMPA]], le BDNF, {{c-trkb|TrkB}} et [[mtor|mTOR]] (Ly et al. 2018) — la même voie que la kétamine, par une autre porte d’entrée.' }],
  src: 'Aghajanian et Marek 1997 ; Ly et al. 2018 ; Shao et al. 2021 ; Vargas et al. 2023 ; Moliner et al. 2023' },

{ id: 'plasticite', ch: 'neuro', t: 'Une fenêtre de plasticité', short: 'La plasticité', mins: 2, obj: ['O4'],
  b: [
    { cols: [
      { tag: 'Épines', h: '+ 10 %', d: 'Une dose, un mois d’épines en plus (souris)', p: 'Une dose de psilocybine augmente d’environ 10 % la densité et la taille des épines du cortex frontal de la souris, en 24 heures, pour au moins un mois (Shao 2021).' },
      { tag: 'Périodes critiques', h: 'de 2 jours à 4 semaines', d: 'Rouvertes, de la kétamine à l’ibogaïne', p: 'Chez la souris adulte, cinq substances rouvrent la période critique d’apprentissage social : kétamine 48 h, psilocybine et MDMA 2 semaines, LSD 3 semaines, ibogaïne 4 semaines, comme la durée de leurs effets chez l’humain (Nardou 2023).' },
      { tag: 'TrkB', h: '× 1 000', d: 'LSD et psilocine se fixent au récepteur du BDNF', p: 'Le LSD et la psilocine se fixent directement au récepteur du BDNF, avec une affinité mille fois supérieure à celle des antidépresseurs (Moliner 2023).' }
    ], reveal: 'heads' },
    { call: 'key', t: 'Une fenêtre, pas une guérison : ce qui est appris pendant la fenêtre (en thérapie, dans la vie) compte autant que la molécule. C’est l’argument neurobiologique en faveur de l’**intégration**.', d: 'Une fenêtre, pas une guérison : ce qui est appris pendant compte autant que la molécule.', f: true }
  ],
  src: 'Shao et al., Neuron 2021 ; Nardou et al., Nature 2023 ; Moliner et al., Nat Neurosci 2023' },

{ id: 'reseaux', ch: 'neuro', t: 'Des réseaux qui se désynchronisent', short: 'Les réseaux', mins: 1.5, obj: ['O4'],
  b: [
    { split: [
      [{ fig: 'reseaux', cap: 'Schéma : à l’état ordinaire, des réseaux bien séparés ; sous psilocybine, ils se désorganisent et communiquent davantage entre eux.', d: '' }],
      [
        { ul: [
          'Le [[dmn|réseau du mode par défaut]] (pensée sur soi, rumination) perd sa cohérence interne (Carhart-Harris 2012).',
          'La psilocybine modifie la connectivité trois fois plus que le méthylphénidate ; l’ampleur du changement suit l’intensité de l’expérience (Siegel 2024).',
          'L’activité spontanée devient plus imprévisible : l’[[entropie|entropie]] cérébrale augmente.'
        ], d: ['Le [[dmn|mode par défaut]] perd sa cohérence', 'La connectivité change trois fois plus que sous méthylphénidate', 'L’[[entropie|entropie]] cérébrale augmente'], step: true },
        { p: 'Quelques semaines plus tard, de petites différences persistent, notamment entre l’hippocampe antérieur et le réseau du mode par défaut.', d: 'Des traces persistent des semaines.', f: true }
      ]
    ], r: '1fr' }
  ],
  src: 'Carhart-Harris et al., PNAS 2012 ; Siegel et al., Nature 2024' },

{ id: 'bayes', ch: 'neuro', t: 'Le cerveau bayésien : croire, c’est parier', short: 'Le cerveau bayésien', mins: 3, obj: ['O5'],
  b: [
    { viz: 'bayes', steps: [{ s: 'prior' }, { s: 'data' }, { s: 'post' }, { s: 'stuck' }, { s: 'rebus' }, { s: 'new' }, { s: 'risk' }] }
  ],
  more: [{ p: 'Pour une croyance gaussienne, la moyenne du postérieur est la moyenne du prior et des données, pondérées par leurs [[precision|précisions]] (l’inverse de la variance) : μpost = (πprior·μprior + πdonnées·μdonnées) / (πprior + πdonnées). Une croyance très précise ignore presque toute donnée contraire : c’est la rigidité.' }],
  src: 'Carhart-Harris et Friston, Pharmacol Rev 2019 ; Hipólito et al. 2023' },

{ id: 'rebus', ch: 'neuro', t: 'REBUS : des croyances relâchées', short: 'REBUS', mins: 1, obj: ['O5'],
  b: [
    { steps: [
      { t: 'En haut de la hiérarchie', d: 'Les croyances abstraites, riches en 5-HT2A', p: 'Les croyances les plus abstraites (sur soi, le monde, l’avenir) seraient portées par les réseaux associatifs, dont le mode par défaut, riches en récepteurs 5-HT2A.' },
      { t: 'Le relâchement', d: 'Moins de précision : les données pèsent plus', p: 'Les psychédéliques diminuent la précision de ces croyances : l’information qui monte des sens et de la mémoire pèse davantage.' },
      { t: 'Le recuit (~ _neural annealing_)', d: 'Chauffer, puis refroidir autrement', p: 'Une image venue de la métallurgie, reprise par les algorithmes d’optimisation (_[[recuit-simule|simulated annealing]]_) : on « chauffe » un système pour qu’il quitte un minimum local, puis il refroidit dans une nouvelle configuration.' }
    ], reveal: 'heads' },
    { call: 'note', lab: 'Une hypothèse', t: 'REBUS est un cadre théorique élégant, encore peu testé directement ; des variantes proposent que les psychédéliques puissent aussi **renforcer** certaines croyances, selon le contexte (Safron 2020).', d: 'Une hypothèse élégante, encore peu testée.', f: true }
  ],
  src: 'Carhart-Harris et Friston 2019 ; Safron 2020' },

{ id: 'patterns', ch: 'neuro', t: 'Briser les patterns : le paysage des attracteurs', short: 'Briser les patterns', mins: 3, obj: ['O5'],
  b: [
    { viz: 'paysage', steps: [{ s: 'sain' }, { s: 'canal' }, { s: 'pris' }, { s: 'chaleur' }, { s: 'sortie' }, { s: 'integ' }, { s: 'chaos' }] }
  ],
  more: [{ p: 'Hipólito, Mago, Rosas et Carhart-Harris (2023) décrivent la psychopathologie comme un [[attracteur|attracteur]] trop profond : la rumination, le craving, la compulsion creusent leur propre vallée à force d’être répétés ([[canalisation]], comme l’eau creuse son lit). La santé, c’est la [[multistabilite|multistabilité]] : plusieurs états stables, et la possibilité de passer de l’un à l’autre, ce que les cliniciens appellent la [[flexibilite-psychologique|flexibilité psychologique]].' }],
  src: 'Hipólito et al., Neurosci Conscious 2023 ; Carhart-Harris et al., Neuropharmacology 2023' },

{ id: 'addiction-neuro', ch: 'neuro', t: 'Addiction : un cycle, trois cibles possibles', short: 'Addiction et neurobiologie', mins: 2.5, obj: ['O4'],
  b: [
    { viz: 'addiction', steps: [{ s: 1 }, { s: 2 }, { s: 3 }, { s: 4 }] }
  ],
  more: [{ p: 'Le cycle de Koob et Volkow décrit l’addiction comme une boucle : l’intoxication (ganglions de la base), le sevrage et ses affects négatifs (amygdale étendue), la préoccupation et le craving (cortex préfrontal). Les hypothèses sur les psychédéliques viennent surtout de modèles animaux ; chez l’humain, les données sont celles de petits essais et d’enquêtes.' }],
  src: 'Koob et Volkow, Lancet Psychiatry 2016 ; Volkow, Koob et McLellan, NEJM 2016 ; figure de revue PSYCOMADD (2023) ; Luquiens 2025' }
);

/* ─── slides-3 ─── */
/* Diapositives — pause et 04 Clinique. */
C.slides.push(

{ id: 'pause', ch: 'neuro', kind: 'pause', t: 'Pause', short: 'Pause', mins: 5,
  b: [
    { p: 'Cinq minutes. Le paysage continue de tourner.' },
    { viz: 'paysage', ambient: true }
  ] },

/* ───────── 04 · Clinique ───────── */
{ id: 'sec-clin', ch: 'clin', kind: 'section', t: 'Clinique', short: 'Clinique', mins: 0.5,
  sub: 'Dépression, anxiété, addictions, trauma : peser les preuves.' },

{ id: 'preuves', ch: 'clin', t: 'D’où viennent les preuves', short: 'Les preuves', mins: 1.5, obj: ['O6'],
  b: [
    { steps: [
      { t: 'Enquêtes naturalistiques', d: 'Beaucoup d’usagers, beaucoup de biais', p: 'Des centaines ou des milliers d’usagers, interrogés après coup : des signaux, mais des biais de sélection et de mémoire.' },
      { t: 'Essais ouverts', d: 'Faisabilité, sécurité', p: 'Quelques dizaines de patients, sans groupe contrôle : faisabilité et sécurité.' },
      { t: 'Essais randomisés de phase 2', d: 'Une centaine de patients, un contrôle', p: 'Une centaine de patients, contre placebo, faible dose ou antidépresseur.' },
      { t: 'Phase 3', d: 'Des centaines de patients, depuis 2025', p: 'Plusieurs centaines de patients, plusieurs pays, critères réglementaires : depuis 2025.' }
    ], reveal: 'heads' },
    { call: 'trap', t: 'Deux difficultés propres aux psychédéliques : l’**aveugle** est presque impossible (les patients savent ce qu’ils ont reçu) et la molécule est souvent donnée **avec une psychothérapie** : qu’est-ce qui soigne ?', d: 'Deux pièges : l’**aveugle** presque impossible, la **psychothérapie** associée.', f: true }
  ],
  src: 'Synthèse ; Williams, Barnett et Szigeti, JAMA Psychiatry 2026' },

{ id: 'depression', ch: 'clin', t: 'Dépression : du pilote à la phase 3', short: 'La dépression', mins: 2.5, obj: ['O6'],
  b: [
    { table: { head: ['Essai', 'Patients', 'Comparaison', 'Résultat principal'], rows: [
      ['Carhart-Harris 2021, _NEJM_', '59, dépression modérée à sévère', 'psilocybine 2 × 25 mg vs escitalopram 6 semaines', 'QIDS-SR −8 vs −6 : non significatif ; rémission 57 % vs 28 % (critère secondaire)'],
      ['Goodwin 2022, _NEJM_', '233, dépression résistante', '25 mg vs 10 mg vs 1 mg, dose unique', 'MADRS −6,6 (25 vs 1 mg) à 3 semaines ; effet atténué à 12 semaines'],
      ['Raison 2023, _JAMA_', '104, épisode dépressif', '25 mg vs niacine', 'MADRS −12,3 à 6 semaines'],
      ['COMP005, 2025', '258, dépression résistante', '25 mg vs placebo, dose unique', 'MADRS **−3,6** à 6 semaines'],
      ['COMP006, 2026', '581, dépression résistante', '2 doses de 25, 10 ou 1 mg', 'MADRS **−3,8** à 6 semaines (25 vs 1 mg) ; bénéfice maintenu à 26 semaines chez 39 %'],
      ['Emerge (LSD), 2026', '149, épisode dépressif', 'LSD 100 µg vs placebo, sans psychothérapie', 'MADRS −8,1 à 6 semaines ; rémission 24 % vs 3 %']
    ], src: 'Publications et communiqués des promoteurs (Compass Pathways, Definium) ; résultats de phase 3 non encore tous publiés' }, d: { head: ['Essai', 'Patients', 'Résultat principal'], src: '', rows: [['Carhart-Harris 2021', '59', 'vs escitalopram : non significatif'], ['Goodwin 2022', '233', 'MADRS −6,6 à 3 semaines'], ['Raison 2023', '104', 'MADRS −12,3 à 6 semaines'], ['COMP005, 2025', '258', 'MADRS **−3,6**'], ['COMP006, 2026', '581', 'MADRS **−3,8**'], ['Emerge (LSD), 2026', '149', 'MADRS −8,1, sans psychothérapie']] }, reveal: 'cells' },
    { call: 'key', t: 'Plus l’essai est grand et contrôlé, plus l’écart avec le contrôle se rapproche de celui des antidépresseurs ; l’intérêt tient alors à la **rapidité** et à la **durée** après une ou deux prises.', d: 'Plus l’essai est grand, plus l’écart rejoint celui des antidépresseurs ; restent la **rapidité** et la **durée**.', f: true }
  ],
  more: [{ p: 'La psilocybine de Compass (COMP360) fait l’objet d’un dépôt de demande d’autorisation auprès de la FDA, accéléré par un « bon de priorité » d’avril 2026 ; la décision n’est pas rendue au 31 octobre 2026. Usona attend ses résultats de phase 3 dans l’épisode dépressif.' }],
  src: 'Carhart-Harris 2021 ; Goodwin 2022 ; Raison 2023 ; Compass Pathways 2025–2026 ; Definium 2026' },

{ id: 'anxiete', ch: 'clin', t: 'Anxiété et fin de vie', short: 'Anxiété et fin de vie', mins: 2, obj: ['O6'],
  b: [
    { cols: [
      { tag: 'Trouble anxieux généralisé', h: 'Le LSD, en une prise', d: 'Phase 3 : HAM-A −5 points (Voyage, Panorama)', p: 'Phase 2b (198 patients) : HAM-A −5 points à 4 semaines avec 100 µg. Phase 3 Voyage (214) : −5,4 à 12 semaines, réponse 43 % vs 16 % ; Panorama (245) : −5,1. Un bras à 50 µg pour limiter la levée de l’aveugle.' },
      { tag: 'Cancer et fin de vie', h: 'La psilocybine', d: 'Moins d’anxiété, moins de dépression, durablement (2016)', p: 'Deux essais croisés de 2016 (51 et 29 patients) : baisse rapide et durable de l’anxiété et de la dépression liées au cancer. L’Union européenne finance depuis 2024 un essai multicentrique en soins palliatifs (PsyPal, 6,5 M€).' }
    ], reveal: 'heads' },
    { call: 'note', t: 'Le jour de la prise, 68 % des patients de Panorama sous 100 µg décrivent des « illusions » : l’effet aigu est le prix à payer, et l’argument d’un accompagnement.', d: '68 % décrivent des « illusions » le jour de la prise.', f: true }
  ],
  src: 'MM120 phase 2b, JAMA 2025 ; Definium 2026 ; Griffiths et al. 2016 ; Ross et al. 2016 ; Commission européenne 2024' },

{ id: 'alcool', ch: 'clin', t: 'Alcool : la plus ancienne indication', short: 'L’alcool', mins: 2.5, obj: ['O6'],
  b: [
    { kpis: [
      { v: 'OR 1,96', l: 'six essais du LSD des années 1960, 536 patients (Krebs et Johansen 2012)' },
      { v: '9,7 % vs 23,6 %', l: 'de jours de forte consommation sur 32 semaines, psilocybine vs placebo actif, 95 patients (Bogenschutz 2022)' },
      { v: '55 % vs 11 %', l: 'd’abstinence à 12 semaines, 30 patients sevrés et déprimés, Nîmes (étude PAD, Luquiens 2025)' }
    ], d: [{ v: 'OR 1,96', l: 'le LSD, années 1960' }, { v: '9,7 % vs 23,6 %', l: 'de jours de forte consommation, psilocybine (2022)' }, { v: '55 % vs 11 %', l: 'd’abstinence à 12 semaines, étude PAD (Nîmes, 2025)' }], step: true },
    { call: 'fr', t: 'Quatre essais dans l’alcool : **PAD** puis **ERPPAD** (Nîmes), **PAPAUD** (psilocybine, Paul-Brousse), **ADELY** (LSD pendant le sevrage) ; voir ((recherche-france|la recherche en France)).', d: 'Quatre essais dans l’alcool : **PAD**, **ERPPAD**, **PAPAUD**, **ADELY**.', f: true }
  ],
  more: [{ p: 'Dans l’étude PAD, 93 % des patients ont deviné leur groupe, et la rechute (35 % vs 50 %) ne différait pas significativement : un pilote prometteur, pas une preuve. Dans l’essai de Bogenschutz, la psilocybine s’ajoutait à une psychothérapie manualisée de douze semaines (entretien motivationnel et TCC).' }],
  src: 'Krebs et Johansen 2012 ; Bogenschutz et al., JAMA Psychiatry 2022 ; CHU de Nîmes 2025–2026' },

{ id: 'autres-addictions', ch: 'clin', t: 'Tabac, cannabis, opioïdes', short: 'Les autres addictions', mins: 2, obj: ['O6'],
  b: [
    { cols: [
      { tag: 'Tabac', h: 'Une session contre un patch', d: 'À 6 mois : 17 abstinents sous psilocybine, 4 sous patch', p: 'Pilote ouvert : 80 % d’abstinents à 6 mois, 67 % à 12 mois (15 patients). Essai randomisé (82 fumeurs, plus 13 semaines de TCC) : 17 abstinents à 6 mois sous psilocybine, 4 sous patch (_JAMA Netw Open_, 2026).' },
      { tag: 'Cannabis', h: 'Une enquête naturalistique', d: '152 usagers : moins de cannabis après une expérience marquante', p: 'Chez 152 usagers ayant vécu une expérience psychédélique marquante : baisse du CUDIT, de la fréquence et de la durée d’intoxication, liée à l’intensité de l’expérience (Romeo, Kervadec et al. 2024).' },
      { tag: 'Opioïdes', h: 'L’ibogaïne', d: 'Des séries ouvertes, aucun essai contrôlé positif, un cœur à risque', p: 'Des séries ouvertes de sevrage, mais aucun essai contrôlé positif (Kervadec et al. 2026) ; un risque cardiaque réel (34 décès publiés). Le Texas finance depuis 2025 des essais, à hauteur de 50 millions de dollars.' }
    ], reveal: 'heads' }
  ],
  src: 'Johnson et al. 2014, 2017, 2026 ; Romeo, Kervadec et al., J Psychoactive Drugs 2024 ; Alper et al. ; Texas Tribune 2026' },

{ id: 'tspt-mdma', ch: 'clin', t: 'TSPT : l’histoire en suspens de la MDMA', short: 'TSPT et MDMA', mins: 2, obj: ['O6', 'O7'],
  b: [
    { steps: [
      { t: '2021–2023', d: 'Deux phases 3 positives (CAPS-5 −24 vs −14)', p: 'Deux essais de phase 3 (90 et 104 patients, trois sessions de MDMA et une psychothérapie) : CAPS-5 −24,4 vs −13,9 (d = 0,91) ; 67–71 % ne remplissent plus les critères, contre 32–48 % sous placebo.' },
      { t: 'Juin 2024', d: 'Avis défavorable des experts de la FDA', p: 'Comité consultatif de la FDA : 9 voix contre 2 sur l’efficacité, 10 contre 1 sur le rapport bénéfice/risque.' },
      { t: 'Août 2024', d: 'Refus ; trois articles rétractés', p: 'Refus de la FDA ; trois articles rétractés après une faute grave d’un thérapeute envers une participante dans un essai de phase 2.' },
      { t: '2025–2026', d: 'Nouveau dépôt, sans nouvel essai', p: 'Le promoteur, renommé Resilient, redépose son dossier sans nouvel essai ; la méthylone, un cousin de la MDMA, est en phase 3.' }
    ], reveal: 'heads' }
  ],
  src: 'Mitchell et al., Nat Med 2021, 2023 ; FDA 2024 ; Psychedelic Alpha 2026' },

{ id: 'autres-indications', ch: 'clin', lvl: 'plus', t: 'Ailleurs : beaucoup de pistes, peu de preuves', short: 'Autres pistes', mins: 1,
  b: [
    { ul: [
      '**TOC, anorexie mentale** : petits essais ouverts, centrés sur la faisabilité et la sécurité.',
      '**Dépression bipolaire** : quelques patients de type II en essai ouvert ; le risque de virage maniaque reste le principal frein.',
      '**Douleur, céphalées, démence** : hypothèses précliniques ou séries de cas.',
      '**Microdosage** : dans un essai en auto-aveugle (191 participants), les effets ne différaient pas du placebo (Szigeti 2021).'
    ], d: ['**TOC, anorexie** : petits essais ouverts', '**Bipolarité** : le risque de virage', '**Douleur, démence** : préclinique', '**Microdosage** : pas mieux que le placebo'], step: true }
  ],
  src: 'Szigeti et al., eLife 2021' },

{ id: 'enquetes', ch: 'clin', t: 'Ce que montrent les enquêtes naturalistiques', short: 'Les enquêtes', mins: 2, obj: ['O6'],
  b: [
    { kpis: [
      { v: '160', l: 'usagers d’alcool : moins de jours de consommation et AUDIT plus bas après l’expérience, d’autant plus que l’expérience était intense et que la flexibilité augmentait (Kervadec, Fauvel et al. 2024)' },
      { v: '1 657', l: 'participants réunis : l’intensité mystique dépend de l’intention (spirituelle, thérapeutique), de la substance, de la dose ; l’alcool concomitant l’émousse (Romeo, Kervadec et al. 2025)' },
      { v: '804', l: 'participants : mêmes déterminants de l’état modifié de conscience pour les psychédéliques, les dissociatifs et les entactogènes (2026)' }
    ], d: [{ v: '160', l: 'usagers d’alcool : moins de consommation après l’expérience (Kervadec, Fauvel et al. 2024)' }, { v: '1 657', l: 'participants : ce qui fait l’intensité mystique (Romeo, Kervadec et al. 2025)' }, { v: '804', l: 'participants : psychédéliques, dissociatifs, entactogènes (Romeo, Kervadec et al. 2026)' }], step: true },
    { p: 'Un fil commun : la **[[flexibilite-psychologique|flexibilité psychologique]]** ([[aaq2|AAQ-II]]) augmente après une expérience marquante, surtout chez ceux qui partaient de plus loin (Romeo, Kervadec et al. 2025).', d: 'Un fil commun : la **[[flexibilite-psychologique|flexibilité psychologique]]** augmente.', f: true }
  ],
  more: [{ p: 'Ces enquêtes rétrospectives, conduites en France par l’équipe de Paul-Brousse (PSYCOMADD, Université Paris-Saclay) avec le Laboratoire mémoire, cerveau et cognition (Université Paris Cité), décrivent des usages naturalistiques : elles génèrent des hypothèses, elles ne prouvent pas un effet. L’étude prospective PSY-FLEX prend le relais.' }],
  src: 'Kervadec, Fauvel et al., Alcohol Alcohol 2024 ; Romeo, Kervadec et al., PNPBP 2025, J Psychoactive Drugs 2025 ; Romeo et al., PNPBP 2026' },

{ id: 'intensite', ch: 'clin', t: 'L’intensité de l’expérience compte', short: 'L’intensité compte', mins: 2, obj: ['O6'],
  b: [
    { viz: 'intensite', steps: [{ s: 1 }, { s: 2 }, { s: 3 }, { s: 4 }] }
  ],
  more: [{ p: 'Méta-analyse de Romeo, Kervadec et al. (« The intensity of the psychedelic experience is reliably associated with clinical improvements », _Neurosci Biobehav Rev_ 2025) : corrélation globale r = 0,33 entre l’intensité de l’expérience et l’amélioration clinique. Une corrélation n’établit pas que l’expérience soit la cause de l’amélioration ; elle invite à soigner ce qui la favorise : la préparation, l’intention, la dose, le cadre.' }],
  src: 'Romeo, Kervadec et al., Neurosci Biobehav Rev 2025' },

{ id: 'lire-essai', ch: 'clin', t: 'Lire un essai de psychédélique', short: 'Lire un essai', mins: 2.5, obj: ['O7'],
  b: [
    { split: [
      [{ table: { k: 'compact', head: ['Question', 'Pourquoi'], rows: [
      ['L’aveugle a-t-il tenu ?', 'Plus de 90 % des patients devinent leur groupe ; le bras contrôle, déçu, peut aller plus mal.'],
      ['Quel contrôle ?', 'Placebo inerte ou actif (niacine, méthylphénidate), très faible dose, antidépresseur ?'],
      ['Quelle psychothérapie ?', 'La même préparation, le même accompagnement, la même intégration dans les deux bras ?'],
      ['Qui a été inclus ?', 'Des patients motivés, sans antécédent psychotique ni bipolaire, souvent déjà initiés.'],
      ['Combien de temps ?', 'Effet à 3 ou 6 semaines ; que reste-t-il à 6 mois ?'],
      ['Qui finance, qui publie ?', 'Beaucoup de phases 3 ne sont encore connues que par communiqué.']
    ] }, d: { rows: [['L’aveugle a-t-il tenu ?', '90 % devinent leur groupe'], ['Quel contrôle ?', 'Inerte, actif, faible dose ?'], ['Quelle psychothérapie ?', 'La même dans les deux bras ?'], ['Qui a été inclus ?', 'Des patients très sélectionnés'], ['Combien de temps ?', 'Et à 6 mois ?'], ['Qui finance, qui publie ?', 'Souvent un communiqué']] }, reveal: 'cells' }],
      [{ img: 'assets/img/placebo.jpg', alt: 'Dessin : dans la salle d’attente d’un essai, des patients assis regardent un autre groupe danser une ronde en pyjama ; légende : « So I’m guessing we’re in the placebo group »', cap: '« Je suppose qu’on est dans le groupe placebo. »', credit: 'D’après un dessin de Paul Noth', k: 'cartoon', f: true }]
    ], r: '1.9fr', d: { r: '1.15fr' } },
    { call: 'key', t: 'À aveugle égal (tout le monde en ouvert), psychédéliques et antidépresseurs font jeu égal : 24 essais, une fraction de point d’écart (Williams, Barnett et Szigeti, _JAMA Psychiatry_ 2026).', d: 'À aveugle égal, psychédéliques et antidépresseurs font jeu égal (Williams 2026).', f: true }
  ],
  src: 'Williams, Barnett et Szigeti, JAMA Psychiatry 2026 ; Luquiens 2025 ; FDA 2024' }
);

/* ─── slides-4 ─── */
/* Diapositives — 05 Méthode, 06 Cadre et avenir, 07 Clôture. */
C.slides.push(

/* ───────── 05 · Méthode ───────── */
{ id: 'sec-meth', ch: 'meth', kind: 'section', t: 'Méthode', short: 'Méthode', mins: 0.5,
  sub: 'Préparer, accompagner, intégrer.' },

{ id: 'selection', ch: 'meth', t: 'Critères d’inclusion et de non-inclusion', short: 'Inclusion et non-inclusion', mins: 2, obj: ['O8', 'O9'],
  b: [
    { split: [
      [{ h: 'Critères d’inclusion' }, { ul: [
        'Épisode dépressif, souvent résistant ; trouble anxieux généralisé ; trouble de l’usage de l’alcool ou du tabac ; détresse liée à un cancer ; TSPT (MDMA).',
        'Patients informés, volontaires, capables de s’engager dans la préparation et l’intégration.'
      ], d: ['Dépression, anxiété, alcool, tabac, cancer, TSPT', 'Volontaires, informés, engagés'] }],
      [{ h: 'Critères de non-inclusion' }, { ul: [
        'Antécédent personnel, ou familial au premier degré, de **trouble psychotique** ou de **trouble bipolaire**.',
        'Hypertension non contrôlée, cardiopathie, trouble du rythme ; grossesse, allaitement.',
        '**Lithium**, IMAO, tramadol ; risque suicidaire aigu.'
      ], d: ['**Psychose** ou **bipolarité**, personnelle ou familiale', 'Cœur, HTA ; grossesse', '**Lithium**, IMAO, tramadol ; risque suicidaire'], step: true }]
    ], r: '1fr', k: 'top' },
    { call: 'note', t: 'Les antidépresseurs sont le plus souvent arrêtés avant la session (ils émoussent l’effet) : une décroissance à encadrer, avec son risque de rechute.', d: 'Les antidépresseurs souvent arrêtés avant : une décroissance à encadrer.', f: true }
  ],
  src: 'Johnson, Richards et Griffiths, J Psychopharmacol 2008 ; protocoles des essais' },

{ id: 'parcours', ch: 'meth', t: 'Un parcours en trois temps', short: 'Le parcours', mins: 1.5, obj: ['O8'],
  b: [
    { steps: [
      { t: 'Préparer', d: 'Plusieurs rencontres : alliance, intentions, consentement', p: 'Une à plusieurs rencontres avant la session (au moins huit heures en quatre rencontres dans les recommandations de sécurité de 2008) : alliance, histoire de vie, intentions, attentes, consentement.' },
      { t: 'Accompagner', d: 'Une journée, deux accompagnants', p: 'Une journée de six à huit heures, dans une pièce calme et chaleureuse, avec deux accompagnants formés ; un médecin joignable.' },
      { t: 'Intégrer', d: 'Mettre en mots, changer concrètement', p: 'Une rencontre le lendemain, puis quelques sessions : mettre en mots, donner du sens, transformer en changements concrets.' }
    ], reveal: 'heads' },
    { p: 'Ce que l’on appelle « [[set|set]] » (l’état d’esprit) et « [[setting|setting]] » (le cadre) ne sont pas des accessoires : ce sont des variables thérapeutiques.', d: '_Set_ et _setting_ : des variables thérapeutiques.', f: true }
  ],
  src: 'Johnson et al. 2008 ; protocoles COMPASS, Imperial, Hopkins' },

{ id: 'preparer', ch: 'meth', t: 'Préparer : le « set »', short: 'Préparer', mins: 2, obj: ['O8'],
  b: [
    { cols: [
      { tag: 'Connaître', h: 'La personne', d: 'Histoire, traumatismes, attentes', p: 'Son histoire, ses traumatismes, ses relations, ses croyances, ce qu’elle espère et ce qu’elle redoute.' },
      { tag: 'Informer', h: 'Ce qui peut arriver', d: 'Les effets, l’angoisse possible, la durée', p: 'Les effets possibles, y compris l’angoisse, la paranoïa, des souvenirs pénibles ; la durée ; le retour à la normale.' },
      { tag: 'Convenir', h: 'Des règles', d: 'Rester dans la salle ; le toucher, s’il est accepté', p: 'Rester dans la salle ; le toucher (une main tenue) n’est proposé que s’il a été accepté à l’avance ; pas de décision importante pendant la session.' },
      { tag: 'Orienter', h: 'Une attitude', d: '« Faire confiance, lâcher prise, rester ouvert »', p: 'Une consigne souvent donnée : « faire confiance, lâcher prise, rester ouvert » ; aller vers ce qui est difficile plutôt que le fuir.' }
    ], reveal: 'heads' }
  ],
  more: [{ p: 'La préparation n’installe pas un contenu : elle installe une confiance. Les recommandations de 2008 demandent d’ajouter du temps de préparation, ou de renoncer à la session, si la confiance n’est pas établie.' }],
  src: 'Johnson et al. 2008 ; Hipólito et al. 2023' },

{ id: 'seance', ch: 'meth', t: 'Le jour de la session', short: 'La session', mins: 2.5, obj: ['O8'],
  b: [
    { viz: 'seance', steps: [{ h: -1 }, { h: 0 }, { h: 0.75 }, { h: 2 }, { h: 4 }, { h: 6 }, { h: 7.5 }] }
  ],
  src: 'Johnson et al. 2008 ; protocoles d’essais (psilocybine 25 mg)' },

{ id: 'salle', ch: 'meth', t: 'La salle de session', short: 'La salle', mins: 1.5, obj: ['O8'],
  b: [
    { split: [
      [{ fig: 'salle' }],
      [{ ul: [
        'Une pièce calme, à la lumière douce, plutôt un salon qu’une chambre d’hôpital : un divan ou un lit, des couvertures, des coussins, des plantes, quelques objets personnels.',
        'Un masque pour les yeux et un casque : une liste de musique préparée, sans paroles au pic.',
        'Deux accompagnants présents toute la journée, un médecin joignable ; de l’eau, des mouchoirs ; des toilettes à côté.',
        'Une surveillance discrète : pression artérielle et pouls aux heures prévues, pas de matériel envahissant.'
      ], only: 'read' },
      { img: 'assets/img/salle-cippres.jpg', alt: 'Une salle de session réelle : lit d’hôpital habillé de coussins et d’un plaid, lampes à la lumière chaude, plantes, une grande sculpture ronde au mur, des points de lumière au plafond', cap: 'Une vraie salle : la clinique CIPPRes (CNWL et Imperial College London), à Londres.', credit: 'Photo : Thomas Angus / Imperial College London', k: 'room', f: true }]
    ], r: '1fr' }
  ],
  src: 'Johnson, Richards et Griffiths, J Psychopharmacol 2008 ; photo Thomas Angus / Imperial College London' },

{ id: 'crise', ch: 'meth', t: 'Quand l’expérience devient difficile', short: 'L’expérience difficile', mins: 2, obj: ['O9'],
  b: [
    { steps: [
      { t: 'Présence', d: '« C’est l’effet du produit, il va passer, je suis là »', p: 'Rester calme, proche, rassurant : « c’est l’effet de la substance, il va passer, vous êtes en sécurité, je suis là ».' },
      { t: 'Orientation', d: 'Traverser plutôt que fuir', p: 'Inviter à traverser plutôt qu’à fuir : respirer, nommer ce qui arrive, explorer la peur au lieu de lutter contre elle.' },
      { t: 'Contact', d: 'Une main tenue, si c’est convenu', p: 'Une main tenue, si cela a été convenu ; ajuster la musique, la lumière, la position.' },
      { t: 'Médicament', d: 'Si besoin : diazépam ; pas d’halopéridol', p: 'Si l’angoisse déborde : diazépam 10 mg per os. Éviter l’halopéridol ; l’hôpital et la contention en tout dernier recours.' }
    ], reveal: 'heads' },
    { call: 'urg', t: 'Hors cadre (fête, retraite, urgences), même logique : environnement calme, une personne sobre et rassurante, chercher un mélange (MDMA, alcool, lithium, IMAO) et une complication somatique (hyperthermie, convulsion, trouble du rythme).', d: 'Hors cadre : le calme, une personne sobre ; chercher un mélange et une complication somatique.', f: true }
  ],
  src: 'Johnson et al. 2008 ; SPF 2022 ; Kopra et al. 2022' },

{ id: 'integration', ch: 'meth', t: 'Intégrer : creuser un autre chemin', short: 'L’intégration', mins: 2, obj: ['O8'],
  b: [
    { split: [
      [{ cols: [
        { tag: 'Accepter', h: 'Accept', d: 'Accueillir ce qui a été vécu', p: 'Accueillir ce qui a été vécu, même pénible, sans le juger.' },
        { tag: 'Se relier', h: 'Connect', d: 'À soi, aux autres', p: 'À soi, aux autres, à ses valeurs.' },
        { tag: 'Incarner', h: 'Embody', d: 'Traduire en actes', p: 'Traduire en actes, dans le corps et le quotidien.' }
      ], reveal: 'heads' }],
      [{ ul: [
        'Le modèle ACE (Watts et Luoma 2020) applique la [[act|thérapie d’acceptation et d’engagement]] et sa notion de [[flexibilite-psychologique|flexibilité psychologique]].',
        'Dans le paysage des attracteurs : changer les renforçateurs (lieux, entourage, routines) pour que l’ancienne vallée se comble.',
        'Pendant la fenêtre de plasticité, ce qui est répété s’imprime : choisir ce que l’on répète.'
      ], d: ['Le modèle ACE : la [[act|thérapie d’acceptation et d’engagement]]', 'Changer les renforçateurs : l’ancienne vallée se comble', 'Choisir ce que l’on répète pendant la fenêtre'], step: true }]
    ], r: '1fr' }
  ],
  src: 'Watts et Luoma 2020 ; Hipólito et al. 2023 ; Nardou et al. 2023' },

{ id: 'mesurer', ch: 'meth', t: 'Mesurer l’expérience', short: 'Mesurer', mins: 1.5,
  b: [
    { table: { head: ['Échelle', 'Ce qu’elle mesure'], rows: [
      ['[[meq30|MEQ-30]]', 'L’expérience mystique : unité, humeur positive, transcendance du temps et de l’espace, ineffabilité ; « complète » si au moins 60 % du maximum sur chaque facteur'],
      ['[[asc5d|5D-ASC]] (11D-ASC)', 'Les états modifiés de conscience : illimitation océanique, angoisse de dissolution, restructuration visionnaire…'],
      ['[[ebi|EBI]]', 'La percée émotionnelle (_emotional breakthrough_)'],
      ['[[ceq|CEQ]]', 'L’expérience difficile : peur, deuil, folie, isolement, détresse physique, paranoïa'],
      ['[[aaq2|AAQ-II]]', 'L’inflexibilité psychologique, avant et après']
    ] }, d: { rows: [['[[meq30|MEQ-30]]', 'L’expérience mystique'], ['[[asc5d|5D-ASC]]', 'Les états modifiés de conscience'], ['[[ebi|EBI]]', 'La percée émotionnelle'], ['[[ceq|CEQ]]', 'L’expérience difficile'], ['[[aaq2|AAQ-II]]', 'La flexibilité psychologique']] }, reveal: 'cells' }
  ],
  more: [{ p: 'Une version française du MEQ-30 a été validée à partir de récits rétrospectifs de l’expérience la plus marquante (Fauvel et al.) ; celle du 5D-ASC aussi (Kervadec, Mathieu et al. 2026). Les enquêtes de Paul-Brousse utilisent ces échelles et l’AAQ-II.' }],
  src: 'Barrett et al. 2015 ; Studerus et al. 2010 ; Roseman et al. 2019 ; Barrett et al. 2016 ; Bond et al. 2011' },

{ id: 'ethique', ch: 'meth', t: 'Une vulnérabilité particulière', short: 'L’éthique', mins: 1.5, obj: ['O8'],
  b: [
    { ul: [
      '**Suggestibilité** accrue : ce que dit l’accompagnant pèse plus que d’habitude ; une attitude non directive protège.',
      '**Faux souvenirs** : ne pas interpréter à la place du patient ce qui surgit (« abus » retrouvés, vies antérieures…).',
      '**Limites** : le toucher, la dépendance au thérapeute, les transgressions sexuelles ; une faute grave dans un essai de MDMA a conduit à rétracter trois articles.',
      '**Garde-fous** : consentement préalable écrit, deux accompagnants, enregistrement vidéo, supervision, formation.'
    ], d: ['**Suggestibilité** : rester non directif', '**Faux souvenirs** : ne pas interpréter', '**Limites** : toucher, emprise, abus', '**Garde-fous** : deux accompagnants, vidéo, supervision'], step: true }
  ],
  src: 'Hipólito et al. 2023 ; Carhart-Harris et al. 2015 ; Psychopharmacology 2024 (rétractations)' },

{ id: 'consultation', ch: 'meth', t: 'En consultation : un patient vous en parle', short: 'La consultation', mins: 2, obj: ['O10'],
  b: [
    { steps: [
      { t: 'Accueillir', d: 'Sans juger : quoi, quand, avec qui, pourquoi', p: 'Sans juger ni encourager : demander ce qu’il a pris ou compte prendre, quand, où, avec qui, pourquoi.' },
      { t: 'Chercher', d: 'Contre-indications, interactions (**lithium**)', p: 'Les contre-indications (psychose, bipolarité, cœur) et les interactions : **lithium**, IMAO, tramadol, antidépresseurs.' },
      { t: 'Informer', d: 'Risques, statut légal, essais en cours', p: 'Les risques, l’absence de preuve hors essai, le statut de stupéfiant ; les essais en cours en France.' },
      { t: 'Réduire les risques', d: 'Jamais seul, faible dose, pas de mélange', p: 'S’il le fait quand même : jamais seul, une personne sobre, une faible dose d’abord, pas de mélange, des produits analysés, un lieu sûr.' },
      { t: 'Revoir', d: 'En reparler après', p: 'Proposer d’en reparler après : intégrer une expérience, repérer une complication (angoisse, HPPD, décompensation).' }
    ], reveal: 'heads' }
  ],
  more: [{ p: 'La réduction des risques est une politique de santé publique inscrite dans la loi (2004, modifiée en 2016). Le manuel de la Société psychédélique française (2022) est une ressource à connaître ; certaines structures proposent des consultations dédiées (Addictions France, Bordeaux, depuis 2024).' }, { cta: [{ l: 'Arbre : un patient vous parle de psychédéliques', href: '#/raisonner/patient' }] }],
  src: 'SPF 2022 ; Nayak et al. 2021 ; Code de la santé publique, art. L3411-8' },

/* ───────── 06 · Cadre et avenir ───────── */
{ id: 'sec-cadre', ch: 'cadre', kind: 'section', t: 'Cadre et avenir', short: 'Cadre et avenir', mins: 0.5,
  sub: 'Le droit, le monde, les questions ouvertes.' },

{ id: 'droit-france', ch: 'cadre', t: 'En France : des stupéfiants, des essais', short: 'Le droit en France', mins: 1.5, obj: ['O10'],
  b: [
    { ul: [
      'Psilocybine, LSD, DMT, mescaline, MDMA : classés **stupéfiants** ; tout usage est interdit sauf autorisation expresse de l’ANSM. L’usage simple est passible d’un an d’emprisonnement et de 3 750 € d’amende.',
      'La recherche passe par des essais autorisés par l’ANSM (règlement européen 536/2014) : une dizaine sont en cours ou en préparation (diapositive suivante).',
      'Seule l’**eskétamine** (Spravato) a une AMM : dépression résistante de l’adulte, à l’hôpital, avec un ISRS ou un IRSNa.',
      'Présenter ces produits « sous un jour favorable » est interdit ; la réduction des risques est, elle, protégée par la loi.'
    ], d: ['Des **stupéfiants** : usage interdit hors ANSM', 'La recherche : des essais autorisés', 'Seule l’**eskétamine** a une AMM', 'La réduction des risques, protégée par la loi'], step: true }
  ],
  src: 'Arrêté du 22 février 1990 ; CSP art. L3421-1 et L3421-4 ; réponse ministérielle, JO du 27 mai 2025 ; HAS 2024' },

{ id: 'recherche-france', ch: 'cadre', t: 'La recherche en France (octobre 2026)', short: 'La recherche en France', mins: 2, obj: ['O10'],
  b: [
    { table: { head: ['Où', 'Essai'], rows: [
      ['Sainte-Anne (GHU Paris)', '**COMP006** : psilocybine (COMP360) dans la dépression résistante, phase 3 internationale ; centre français ouvert à l’été 2024'],
      ['Sainte-Anne (GHU Paris)', '**PSILOTRAZ** : psilocybine 25 mg, avec ou sans trazodone, qui bloque en partie les 5-HT2A ; 112 patients ; l’expérience est-elle nécessaire ? (depuis 2026)'],
      ['Paul-Brousse (Villejuif)', '**PAPAUD** : psilocybine dans le trouble de l’usage d’alcool, une ou quatre sessions contre placebo ; 45 patients (ANR, 2024–2028)'],
      ['Créteil, Paris, Villejuif, Amiens', '**ADELY** : LSD 100 ou 300 µg contre niacine pendant le sevrage d’alcool ; 210 patients (Fonds de lutte contre les addictions)'],
      ['CHU de Nîmes', '**PAD** (pilote, 2025) puis **ERPPAD** (phase 3, 8 CHU) dans l’alcool ; des pilotes en neuro-imagerie et dans les crises non épileptiques psychogènes']
    ] }, d: { rows: [['Sainte-Anne', '**COMP006** : psilocybine, dépression résistante (phase 3)'], ['Sainte-Anne', '**PSILOTRAZ** : psilocybine, avec ou sans trazodone'], ['Paul-Brousse', '**PAPAUD** : psilocybine et alcool'], ['Créteil, Paris, Villejuif, Amiens', '**ADELY** : LSD pendant le sevrage d’alcool'], ['Nîmes', '**PAD**, **ERPPAD** : alcool']] }, reveal: 'cells' }
  ],
  src: 'ClinicalTrials.gov NCT07210112 (PSILOTRAZ) ; ANR-23-CE17-0034 (PAPAUD) ; IReSP, Fonds de lutte contre les addictions (ADELY) ; GHU Paris ; CHU de Nîmes' },

{ id: 'monde', ch: 'cadre', t: 'Ailleurs dans le monde (octobre 2026)', short: 'Dans le monde', mins: 1.5,
  b: [
    { table: { head: ['Pays', 'Cadre'], rows: [
      ['Suisse', 'Usage compassionnel « limité » depuis 2014 (MDMA, LSD, psilocybine) : plus de 700 patients fin 2024'],
      ['Australie', 'Depuis le 1er juillet 2023, des psychiatres autorisés prescrivent la MDMA (TSPT) et la psilocybine (dépression résistante) ; peu de patients, plus de 24 000 dollars australiens par parcours'],
      ['Allemagne', 'Programme d’usage compassionnel de la psilocybine (dépression résistante), approuvé en juillet 2025'],
      ['Tchéquie', 'Psilocybine thérapeutique autorisée par la loi depuis le 1er janvier 2026, en établissements spécialisés ; mise en pratique attendue fin 2026'],
      ['États-Unis', 'Bons de priorité de la FDA (avril 2026) pour deux psilocybines et la méthylone ; dossiers en cours ; services de psilocybine encadrés par l’Oregon et le Colorado, hors médicament']
    ] }, d: { rows: [['Suisse', 'Usage compassionnel depuis 2014'], ['Australie', 'Prescription autorisée depuis 2023'], ['Allemagne', 'Usage compassionnel (2025)'], ['Tchéquie', 'Psilocybine autorisée par la loi (2026)'], ['États-Unis', 'Dossiers à la FDA ; Oregon, Colorado']] }, reveal: 'cells' }
  ],
  src: 'OFSP ; TGA ; BfArM ; NUDZ 2026 ; FDA ; Compass Pathways 2026' },

{ id: 'questions-ouvertes', ch: 'cadre', t: 'Ce qui reste à savoir', short: 'Les questions ouvertes', mins: 1.5,
  b: [
    { cols: [
      { tag: 'Le voyage', h: 'Faut-il « vivre » l’expérience ?', d: 'Des analogues sans voyage agissent chez l’animal', p: 'Des analogues non hallucinogènes (tabernanthalog) gardent des effets antidépresseurs chez l’animal ; le LSD sans psychothérapie (Emerge) fait mieux que le placebo.' },
      { tag: 'La durée', h: 'Combien de sessions ?', d: 'Redoser, à quel rythme ?', p: 'Réponse rapide, mais combien de temps ? Faut-il redoser, et à quel rythme ?' },
      { tag: 'Les patients', h: 'Pour qui ?', d: 'Prédire la réponse, élargir', p: 'Prédire la réponse, inclure les patients exclus des essais, protéger les plus vulnérables.' },
      { tag: 'Le soin', h: 'À quel prix ?', d: 'Deux soignants, une journée', p: 'Deux soignants une journée entière : former, financer, rendre l’accès équitable.' }
    ], reveal: 'heads' }
  ],
  src: 'Cameron et al., Nature 2021 ; Definium 2026 ; Psychology Today 2026' },

/* ───────── 07 · Clôture ───────── */
{ id: 'q-recepteur', ch: 'clot', kind: 'question', t: 'Question 1 · un récepteur', short: 'Question 1 : le récepteur', mins: 1, obj: ['O4'],
  b: [{ vote: 'pq-5ht2a', kind: 'fin' }], src: 'Vollenweider et al. 1998 ; Preller et al. 2017 ; Becker et al. 2023' },
{ id: 'q-chiffre', ch: 'clot', kind: 'question', t: 'Question 2 · un chiffre', short: 'Question 2 : le chiffre', mins: 1, obj: ['O7'],
  b: [{ vote: 'pq-madrs', kind: 'fin' }], src: 'COMP005 (2025) ; COMP006 (2026)' },
{ id: 'q-association', ch: 'clot', kind: 'question', t: 'Question 3 · une association', short: 'Question 3 : l’association', mins: 1, obj: ['O9'],
  b: [{ vote: 'pq-lithium', kind: 'fin' }], src: 'Nayak et al., Pharmacopsychiatry 2021' },

{ id: 'messages', ch: 'clot', t: 'Sept messages', short: 'Sept messages', mins: 1.5,
  b: [
    { ol: [
      'Un psychédélique classique est un **agoniste 5-HT2A** ; MDMA, kétamine et ibogaïne sont des cousins aux mécanismes et aux risques différents.',
      'Peu toxiques pour le corps, sauf l’ibogaïne (cœur) ; **jamais avec le lithium** ; le risque psychique tient à la vulnérabilité et au contexte.',
      'Du récepteur au réseau : glutamate, BDNF, plasticité, désynchronisation : une **fenêtre d’apprentissage**.',
      'Des croyances moins précises, un paysage aplati : **briser un pattern rigide**, puis en apprendre un autre.',
      'Des preuves solides mais des effets **modestes en phase 3** ; l’aveugle et les attentes sont à questionner.',
      'Une méthode : sélectionner, préparer, accompagner à deux, **intégrer** ; l’intensité de l’expérience compte.',
      'En France : des stupéfiants, des essais ; **accueillir sans juger, informer, réduire les risques**.'
    ], d: ['Classique = **agoniste 5-HT2A** ; des cousins différents', 'Peu toxiques, sauf l’ibogaïne ; **jamais avec le lithium**', 'Une **fenêtre de plasticité**', '**Briser un pattern**, puis en apprendre un autre', 'Des effets **modestes en phase 3**', 'Préparer, accompagner, **intégrer**', '**Accueillir sans juger, informer, réduire les risques**'], step: true }
  ], src: 'Synthèse du cours' },

{ id: 'publications', ch: 'clot', t: 'Publications', short: 'Publications', mins: 0.5,
  b: [
    { pubs: [
      { a: '**Kervadec E**, Fauvel B et al.', t: 'Psychédéliques et addictions : réémergence d’une modalité thérapeutique pour le traitement des troubles liés à l’usage de substances', j: 'L’Information psychiatrique', y: '2023', x: '99(10)' },
      { a: '**Kervadec E**, Fauvel B et al.', t: 'Reduction of alcohol use and increase in psychological flexibility after a naturalistic psychedelic experience: a retrospective survey', j: 'Alcohol and Alcoholism', y: '2024', x: '59(2):agad078' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'Safety and risk assessment of psychedelic psychotherapy: a meta-analysis and systematic review', j: 'Psychiatry Research', y: '2024', x: '335:115880' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'Significant psychedelic experiences evaluated for mystical characteristics associated with cannabis use reduction and psychological flexibility improvement', j: 'Journal of Psychoactive Drugs', y: '2024' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'The intensity of the psychedelic experience is reliably associated with clinical improvements: a systematic review and meta-analysis', j: 'Neuroscience and Biobehavioral Reviews', y: '2025', x: '172:106086' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'Exploring factors associated with the intensity of a mystical experience following naturalistic psychedelic use: a retrospective survey', j: 'Progress in Neuro-Psychopharmacology and Biological Psychiatry', y: '2025', x: '111300' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'Exploring factors affecting psychological flexibility after psychedelic experiences', j: 'Journal of Psychoactive Drugs', y: '2025' },
      { a: 'Romeo B, **Kervadec E** et al.', t: 'Modulators of altered states of consciousness across psychedelic, dissociative, and entactogen use: a retrospective naturalistic study using the 5D-ASC', j: 'Progress in Neuro-Psychopharmacology and Biological Psychiatry', y: '2026', x: '111621' },
      { a: '**Kervadec E**, Mathieu P et al.', t: 'Psychometric validation of the French version of the five-dimensional altered states of consciousness questionnaire (5D-ASC) and associated 11 OAV subscales', j: 'Progress in Neuro-Psychopharmacology and Biological Psychiatry', y: '2026', x: '147:111770' },
      { a: '**Kervadec E**, Bezo A, Serreau R et al.', t: 'Thirty years of ibogaine research: a literature review on clinical perspectives', j: 'Journal of Clinical Psychopharmacology', y: '2026' }
    ], more: 'En cours : PSY-FLEX, étude prospective naturalistique ; les représentations des psychédéliques en population générale (enquête).' }
  ],
  src: 'Département de psychiatrie et d’addictologie, Hôpital Paul-Brousse (PSYCOMADD, Université Paris-Saclay)' },

{ id: 'merci', ch: 'clot', kind: 'thanks', t: 'Merci', short: 'Merci', mins: 0.5,
  sub: 'pour votre attention, et pour vos questions',
  b: [{ viz: 'kaleido' }],
  src: 'Fin du cours' }

);

/* ─── interact ─── */
/* Questions à la salle (sans vote ni décompte : la réponse vient au clic), QRM d’entraînement, cas progressifs. */
C.votes = {
  'pq-5ht2a': {
    stem: 'Quel médicament, donné avant la psilocybine, supprime presque entièrement son effet psychédélique ?',
    opts: ['L’halopéridol (antagoniste D2)', 'La kétansérine (antagoniste 5-HT2A)', 'La naloxone (antagoniste opioïde)', 'Le flumazénil (antagoniste des benzodiazépines)'],
    ans: 1, why: 'L’effet des psychédéliques classiques passe par les récepteurs 5-HT2A : la kétansérine le supprime presque entièrement (psilocybine, Vollenweider 1998 ; LSD, Preller 2017) et, donnée une heure après le LSD, en raccourcit les effets de 8,5 à 3,5 heures (Becker 2023). L’halopéridol n’en bloque qu’une partie et n’est pas recommandé en cas d’expérience difficile.', src: 'Vollenweider 1998 ; Preller 2017 ; Becker 2023' },
  'pq-madrs': {
    stem: 'Dans les deux essais de phase 3 de la psilocybine dans la dépression résistante (2025–2026), quelle est la différence moyenne de MADRS avec le groupe contrôle, à six semaines ?',
    opts: ['Environ 1 point', 'Environ 4 points', 'Environ 12 points', 'Environ 20 points'],
    ans: 1, why: '−3,6 points contre placebo (COMP005, 258 patients, une dose de 25 mg) et −3,8 points contre 1 mg (COMP006, 581 patients, deux doses). C’est l’ordre de grandeur des antidépresseurs contre placebo, après une ou deux prises seulement. Les petits essais de phase 2 montraient des écarts bien plus grands (−12,3 dans Raison 2023).', src: 'Compass Pathways 2025–2026 ; Raison et al. 2023' },
  'pq-lithium': {
    stem: 'Un patient bipolaire, stable sous lithium, vous annonce qu’il prendra des champignons à psilocybine ce week-end. Quel est le risque le plus spécifique de cette association ?',
    opts: ['Un syndrome sérotoninergique', 'Une crise convulsive', 'Une intoxication au lithium par interaction rénale', 'Une hypoglycémie'],
    ans: 1, why: 'Sur 62 récits d’association lithium–psychédélique classique, 47 % décrivent une crise convulsive et 39 % un recours aux urgences ; aucun avec la lamotrigine (Nayak 2021). S’y ajoute le risque de virage maniaque propre au trouble bipolaire, qui fait de toute façon exclure ces patients des essais.', src: 'Nayak et al., Pharmacopsychiatry 2021' }
};

C.quiz = {
  'q-definition': { tag: 'QRM · définitions', src: 'Nichols 2016 ; SPF 2022',
    stem: 'Concernant les psychédéliques classiques, quelles propositions sont exactes ?',
    opts: ['Ce sont des agonistes des récepteurs 5-HT2A', 'La MDMA en fait partie', 'Il existe une tolérance croisée entre LSD, psilocybine et mescaline', 'Aux doses habituelles, ils provoquent surtout des hallucinations vraies, non critiquées', 'La mescaline est une phénéthylamine'],
    ans: [0, 2, 4],
    why: ['Exact : c’est leur définition pharmacologique.', 'Faux : la MDMA est un entactogène, qui libère la sérotonine par le transporteur.', 'Exact : un même récepteur, désensibilisé.', 'Faux : surtout des illusions et des pseudo-hallucinations reconnues comme telles.', 'Exact, comme la dopamine ; psilocine, DMT et LSD sont des indolamines.'],
    short: 'A, C, E : 5-HT2A, tolérance croisée, phénéthylamine.' },
  'q-durees': { tag: 'QRM · pharmacocinétique', src: 'Ley 2023 ; SPF 2022',
    stem: 'Quelles durées d’effet sont correctes, après une prise unique aux doses des études ?',
    opts: ['DMT inhalée : une quinzaine de minutes', 'Psilocybine 25 mg par voie orale : 4 à 6 heures', 'LSD 100 µg : 2 à 3 heures', 'Mescaline : environ 12 heures', 'Ibogaïne : 1 à 2 heures'],
    ans: [0, 1, 3],
    why: ['Exact : la DMT seule, non protégée par un IMAO, est vite dégradée.', 'Exact.', 'Faux : 8 à 12 heures (8,5 heures en moyenne dans l’étude de Becker 2023).', 'Exact : 12 à 14 heures pour 500 mg (Ley 2023).', 'Faux : 24 à 36 heures, et des effets résiduels plus longs (noribogaïne).'],
    short: 'A, B, D.' },
  'q-interactions': { tag: 'QRM · interactions', src: 'Nayak 2021 ; Johnson 2008 ; SPF 2022',
    stem: 'Concernant les interactions des psychédéliques, quelles propositions sont exactes ?',
    opts: ['L’association au lithium expose à des crises convulsives', 'L’ayahuasca associée à un ISRS expose à un syndrome sérotoninergique', 'Les ISRS atténuent l’effet des psychédéliques classiques', 'L’halopéridol est le traitement de première intention d’une expérience difficile', 'Le tramadol peut être associé sans précaution'],
    ans: [0, 1, 2],
    why: ['Exact : 47 % des récits analysés (Nayak 2021).', 'Exact : l’ayahuasca contient des IMAO (harmine, harmaline).', 'Exact : moins de récepteurs 5-HT2A disponibles ; d’où leur arrêt dans la plupart des essais.', 'Faux : réassurance d’abord, puis une benzodiazépine (diazépam 10 mg) ; l’halopéridol est à éviter.', 'Faux : il abaisse le seuil épileptogène et il est sérotoninergique.'],
    short: 'A, B, C.' },
  'q-recepteur': { tag: 'QRM · neurobiologie', src: 'Madsen 2019 ; Moliner 2023 ; Vargas 2023',
    stem: 'Concernant le récepteur 5-HT2A et la plasticité, quelles propositions sont exactes ?',
    opts: ['C’est un récepteur couplé à la protéine Gq, excitateur', 'Il est très dense sur les neurones pyramidaux de la couche V du cortex', 'La kétansérine potentialise l’effet de la psilocybine', 'Le LSD et la psilocine se lient directement au récepteur TrkB', 'La sérotonine, qui ne traverse pas la membrane, n’active pas les récepteurs 5-HT2A intracellulaires'],
    ans: [0, 1, 3, 4],
    why: ['Exact.', 'Exact, sur leurs dendrites apicales.', 'Faux : elle la bloque.', 'Exact, avec une affinité environ mille fois supérieure à celle des antidépresseurs (Moliner 2023).', 'Exact : c’est l’explication proposée par Vargas (2023) au fait que la sérotonine ne reproduise pas la plasticité des psychédéliques.'],
    short: 'A, B, D, E.' },
  'q-rebus': { tag: 'QRM · modèle bayésien', src: 'Carhart-Harris et Friston 2019',
    stem: 'Concernant le modèle REBUS, quelles propositions sont exactes ?',
    opts: ['La précision d’une croyance est l’inverse de sa variance', 'Les psychédéliques diminueraient la précision des croyances de haut niveau', 'Avec un prior très précis, le postérieur suit les données', 'L’information ascendante (sens, mémoire) pèse davantage sous psychédélique', 'Le modèle est démontré chez l’humain'],
    ans: [0, 1, 3],
    why: ['Exact.', 'Exact : c’est le cœur du modèle (RElaxed Beliefs Under pSychedelics).', 'Faux : il reste près du prior ; c’est la rigidité.', 'Exact.', 'Faux : c’est un cadre théorique cohérent avec de nombreuses données, mais peu testé directement.'],
    short: 'A, B, D.' },
  'q-patterns': { tag: 'QRM · systèmes complexes', src: 'Hipólito et al. 2023',
    stem: 'Selon l’approche des systèmes complexes (Hipólito et al. 2023), quelles propositions sont exactes ?',
    opts: ['La psychopathologie peut être vue comme un attracteur trop profond', 'La santé mentale correspond à la multistabilité', 'Aplatir le paysage est un but thérapeutique en soi', 'La déstabilisation doit être suivie d’une intégration', 'Un excès de désordre peut aussi être pathologique'],
    ans: [0, 1, 3, 4],
    why: ['Exact : rumination, craving, compulsion creusent leur vallée.', 'Exact : plusieurs états stables et la possibilité de passer de l’un à l’autre.', 'Faux : c’est une stratégie transitoire, pas un état souhaitable.', 'Exact : changer les renforçateurs pour que l’ancienne vallée se comble.', 'Exact : les auteurs citent la schizophrénie.'],
    short: 'A, B, D, E.' },
  'q-depression': { tag: 'QRM · dépression', src: 'Carhart-Harris 2021 ; Goodwin 2022 ; Compass ; Definium',
    stem: 'Concernant les essais dans la dépression, quelles propositions sont exactes ?',
    opts: ['Dans COMP005, la différence de MADRS à 6 semaines est d’environ −3,6 points', 'Le critère principal de l’essai psilocybine contre escitalopram (2021) est significatif', 'L’essai Emerge a testé le LSD sans psychothérapie', 'Dans l’essai de Goodwin (2022), des idées ou comportements suicidaires ont été observés dans tous les bras', 'La psilocybine est autorisée par la FDA en octobre 2026'],
    ans: [0, 2, 3],
    why: ['Exact (IC95 −5,7 à −1,5).', 'Faux : QIDS-SR −8 vs −6, non significatif ; seuls des critères secondaires favorisaient la psilocybine.', 'Exact, avec arrêt des antidépresseurs.', 'Exact, numériquement plus fréquents à 25 mg.', 'Faux : dossier en cours d’examen (bon de priorité d’avril 2026).'],
    short: 'A, C, D.' },
  'q-addiction': { tag: 'QRM · addictologie', src: 'Krebs 2012 ; Bogenschutz 2022 ; Luquiens 2025 ; Romeo 2024',
    stem: 'Concernant les psychédéliques en addictologie, quelles propositions sont exactes ?',
    opts: ['Une méta-analyse d’essais des années 1960 montre un effet du LSD sur le mésusage d’alcool', 'Dans l’essai de Bogenschutz (2022), la psilocybine réduit les jours de forte consommation', 'ERPPAD est un essai de phase 3 français dans le trouble de l’usage de l’alcool', 'L’ibogaïne est dénuée de risque cardiaque', 'Dans l’enquête de Romeo, Kervadec et al. (2024) sur le cannabis, la baisse de consommation est liée à l’intensité de l’expérience'],
    ans: [0, 1, 2, 4],
    why: ['Exact : OR 1,96, six essais, 536 patients.', 'Exact : 9,7 % vs 23,6 % sur 32 semaines.', 'Exact : 172 patients, 8 CHU, depuis juillet 2026.', 'Faux : allongement du QT, troubles du rythme, morts subites.', 'Exact (MEQ, p = 0,01 au premier mois).'],
    short: 'A, B, C, E.' },
  'q-mdma': { tag: 'QRM · MDMA et TSPT', src: 'Mitchell 2021 ; FDA 2024',
    stem: 'Concernant la MDMA dans le TSPT, quelles propositions sont exactes ?',
    opts: ['La FDA l’a autorisée en 2024', 'Le comité consultatif de la FDA a voté contre, en juin 2024', 'Trois articles ont été rétractés après une faute éthique dans un essai', 'Le premier essai de phase 3 montrait un effet de taille d ≈ 0,9 sur la CAPS-5', 'La MDMA agit surtout comme agoniste 5-HT2A'],
    ans: [1, 2, 3],
    why: ['Faux : refus en août 2024, nouvel essai demandé.', 'Exact : 9–2 sur l’efficacité, 10–1 sur le rapport bénéfice/risque.', 'Exact.', 'Exact : d = 0,91.', 'Faux : elle libère la sérotonine (et la noradrénaline, la dopamine) par les transporteurs.'],
    short: 'B, C, D.' },
  'q-methode': { tag: 'QRM · méthode', src: 'Johnson, Richards et Griffiths 2008',
    stem: 'Selon les recommandations de sécurité de 2008, quelles propositions sont exactes ?',
    opts: ['Au moins deux accompagnants sont présents', 'La préparation compte au moins huit heures, en quatre rencontres', 'Le toucher n’est proposé que s’il a été accepté à l’avance', 'Le patient peut rentrer seul en voiture le soir', 'Un entretien est prévu le lendemain'],
    ans: [0, 1, 2, 4],
    why: ['Exact : le patient n’est jamais seul.', 'Exact (pour les volontaires sains ; les essais thérapeutiques varient).', 'Exact.', 'Faux : retour accompagné, pas de conduite le jour même.', 'Exact.'],
    short: 'A, B, C, E.' },
  'q-crise': { tag: 'QRM · expérience difficile', src: 'Johnson 2008 ; SPF 2022',
    stem: 'Face à une expérience difficile pendant une session, que faut-il faire ?',
    opts: ['Rassurer : l’effet est transitoire, la personne est en sécurité', 'Inviter à traverser la peur plutôt qu’à la fuir', 'Contenir le patient dès les premiers signes d’angoisse', 'Si l’angoisse déborde, donner du diazépam', 'Chercher une association (lithium, IMAO, MDMA, alcool)'],
    ans: [0, 1, 3, 4],
    why: ['Exact.', 'Exact.', 'Faux : la contention aggrave ; elle est un dernier recours.', 'Exact : 10 mg per os dans les recommandations.', 'Exact, surtout hors cadre.'],
    short: 'A, B, D, E.' },
  'q-ci': { tag: 'QRM · contre-indications', src: 'Johnson 2008 ; protocoles des essais',
    stem: 'Quelles situations font habituellement exclure un patient d’un essai de psilocybine ?',
    opts: ['Un frère atteint de schizophrénie', 'Un trouble bipolaire de type I', 'Une hypertension non contrôlée', 'Un traitement par lithium', 'Un épisode dépressif résistant à deux antidépresseurs'],
    ans: [0, 1, 2, 3],
    why: ['Exact : antécédent familial au premier degré de psychose.', 'Exact.', 'Exact.', 'Exact.', 'Faux : c’est l’indication des essais COMP005 et COMP006.'],
    short: 'A, B, C, D.' },
  'q-essai': { tag: 'QRM · lecture critique', src: 'Williams, Barnett et Szigeti 2026 ; Luquiens 2025',
    stem: 'Concernant la lecture critique des essais de psychédéliques, quelles propositions sont exactes ?',
    opts: ['La plupart des patients devinent leur groupe', 'La niacine a servi de placebo actif', 'À conditions d’aveugle égales, l’écart avec les antidépresseurs donnés en ouvert est faible', 'Les petits essais montrent souvent des effets plus grands que les phases 3', 'Une enquête rétrospective peut établir un lien de causalité'],
    ans: [0, 1, 2, 3],
    why: ['Exact : 93 % dans l’étude PAD.', 'Exact (Raison 2023, Vendredi saint 1962).', 'Exact : une fraction de point sur 24 essais (Williams 2026).', 'Exact.', 'Faux : elle génère des hypothèses.'],
    short: 'A, B, C, D.' },
  'q-legal': { tag: 'QRM · cadre légal', src: 'CSP ; ANSM ; HAS ; NUDZ',
    stem: 'Concernant le cadre légal, quelles propositions sont exactes (octobre 2026) ?',
    opts: ['En France, la psilocybine est un stupéfiant', 'L’eskétamine a une AMM dans la dépression résistante', 'Un psychiatre français peut prescrire de la psilocybine hors essai', 'La réduction des risques est inscrite dans la loi', 'La Tchéquie autorise la psilocybine thérapeutique depuis le 1er janvier 2026'],
    ans: [0, 1, 3, 4],
    why: ['Exact.', 'Exact, à l’hôpital, avec un ISRS ou un IRSNa.', 'Faux : uniquement dans un essai autorisé par l’ANSM.', 'Exact (2004, modifiée en 2016).', 'Exact, en établissements spécialisés ; mise en pratique attendue fin 2026.'],
    short: 'A, B, D, E.' },

  /* Cas progressifs */
  'c1-q1': { tag: 'Cas · Mme P.', src: 'Compass ; CHU de Nîmes ; ANSM',
    stem: 'Mme P. vous demande si elle peut « avoir de la psilocybine » pour sa dépression. Que pouvez-vous lui dire ?',
    opts: ['Qu’il n’existe pas d’autorisation en France hors essai clinique', 'Que des essais de phase 3 sont positifs, avec un effet modeste face au contrôle', 'Que la psilocybine est autorisée en Europe depuis 2025', 'Que l’eskétamine est une option autorisée dans la dépression résistante', 'Que l’efficacité est démontrée à long terme'],
    ans: [0, 1, 3],
    why: ['Exact.', 'Exact : −3,6 et −3,8 points de MADRS.', 'Faux : programmes compassionnels en Allemagne, loi en Tchéquie ; pas d’autorisation européenne.', 'Exact.', 'Faux : les données au-delà de six mois sont limitées.'],
    short: 'A, B, D.' },
  'c1-q2': { tag: 'Cas · Mme P.', src: 'SPF 2022 ; Johnson 2008',
    stem: 'Sous venlafaxine 225 mg/j, elle part pour une retraite de « truffes » aux Pays-Bas dans quinze jours et veut arrêter son traitement la veille. Que lui conseillez-vous ?',
    opts: ['Ne pas arrêter brutalement la venlafaxine : risque de syndrome d’arrêt et de rechute', 'Sous venlafaxine, l’effet risque d’être atténué', 'Le risque majeur est un syndrome sérotoninergique avec la psilocybine seule', 'Vérifier qu’aucun breuvage contenant un IMAO (ayahuasca) ne lui sera proposé', 'Ne pas être seule, ne pas mélanger, prévoir de revenir en parler'],
    ans: [0, 1, 3, 4],
    why: ['Exact : la venlafaxine s’arrête progressivement.', 'Exact.', 'Faux : le risque est faible avec la psilocybine seule ; il devient majeur avec un IMAO.', 'Exact.', 'Exact : réduction des risques et suivi.'],
    short: 'A, B, D, E.' },
  'c1-q3': { tag: 'Cas · Mme P.', src: 'Johnson 2008 ; SPF 2022',
    stem: 'Elle revient trois semaines plus tard : angoissée, elle voit des traînées derrière les objets en mouvement et des halos colorés, en critiquant ces perceptions. Que retenez-vous ?',
    opts: ['Un trouble persistant des perceptions (HPPD) est possible', 'C’est un épisode psychotique : antipsychotique à forte dose', 'Rassurer, éviter le cannabis et les autres psychotropes, réévaluer', 'Proposer un temps pour intégrer l’expérience', 'Rechercher des éléments en faveur d’une autre cause (neurologique, toxique)'],
    ans: [0, 2, 3, 4],
    why: ['Exact : perceptions critiquées, persistantes après l’intoxication.', 'Faux : la critique est conservée ; pas d’argument pour une psychose.', 'Exact : le cannabis aggraverait les troubles.', 'Exact.', 'Exact : diagnostic d’élimination.'],
    short: 'A, C, D, E.' },
  'c2-q1': { tag: 'Cas · M. T.', src: 'CHU de Nîmes 2026 ; protocoles des essais',
    stem: 'M. T., 52 ans, trouble sévère de l’usage de l’alcool, sevré depuis trois semaines, BDI à 22, aucun antécédent psychotique. Il demande à participer à l’essai ERPPAD. Qu’est-ce qui est exact ?',
    opts: ['L’essai compare deux sessions de 25 mg à deux sessions de 3 mg', 'Le critère principal est le délai avant le premier épisode de consommation excessive', 'Un traitement par lithium ne pose pas de problème', 'La psilocybine s’ajoute à un programme de prévention de la rechute', 'Il recevra sûrement la forte dose'],
    ans: [0, 1, 3],
    why: ['Exact.', 'Exact, sur six mois.', 'Faux : contre-indication.', 'Exact.', 'Faux : randomisation en double aveugle.'],
    short: 'A, B, D.' },
  'c2-q2': { tag: 'Cas · M. T.', src: 'Johnson 2008',
    stem: 'Quarante minutes après la prise, il se redresse, agrippe le fauteuil : « je suis en train de mourir ». Fréquence cardiaque 112, PA 150/90. Que faites-vous ?',
    opts: ['Vous restez près de lui, vous le rassurez : c’est l’effet, il va passer', 'Vous l’invitez à respirer et à décrire ce qu’il ressent', 'Vous appelez immédiatement le SAMU', 'Vous lui tenez la main, comme convenu lors de la préparation', 'Si l’angoisse persiste malgré tout, diazépam 10 mg'],
    ans: [0, 1, 3, 4],
    why: ['Exact : la montée est souvent le moment le plus anxieux.', 'Exact.', 'Faux : constantes attendues sous psilocybine ; surveiller, sans médicaliser à l’excès.', 'Exact, si cela a été accepté avant.', 'Exact.'],
    short: 'A, B, D, E.' },
  'c2-q3': { tag: 'Cas · M. T.', src: 'Hipólito 2023 ; Watts et Luoma 2020',
    stem: 'Trois semaines plus tard, il dit que « quelque chose a bougé » dans son rapport à l’alcool ; mais ses amis boivent tous les soirs au café en bas de chez lui. Que proposez-vous en intégration ?',
    opts: ['Travailler sur les situations à risque et les renforçateurs (lieux, entourage, horaires)', 'Relier l’expérience à ses valeurs et à des actions concrètes', 'Lui expliquer ce que signifie son expérience', 'Renforcer le programme de prévention de la rechute', 'Lui proposer une nouvelle session la semaine suivante pour consolider'],
    ans: [0, 1, 3],
    why: ['Exact : laisser l’ancienne vallée se combler.', 'Exact : modèle ACE.', 'Faux : interpréter à sa place expose à la suggestion ; l’aider à formuler son propre sens.', 'Exact.', 'Faux : le protocole fixe les sessions ; la tolérance et la sécurité imposent un espacement.'],
    short: 'A, B, D.' }
};
C.qcm = ['q-definition', 'q-durees', 'q-interactions', 'q-recepteur', 'q-rebus', 'q-patterns', 'q-depression', 'q-addiction', 'q-mdma', 'q-methode', 'q-crise', 'q-ci', 'q-essai', 'q-legal'];

C.cases = [
  { id: 'cas-p', t: 'Mme P., 38 ans : une dépression qui résiste', steps: [
    { vig: 'Mme P., 38 ans, épisode dépressif caractérisé depuis dix-huit mois, malgré la sertraline puis la venlafaxine (225 mg/j, depuis quatre mois). MADRS 31. Elle a lu un article sur la psilocybine et vous demande si elle peut en bénéficier.', q: 'c1-q1', after: 'Vous lui présentez les données, le cadre français et les options autorisées. Elle vous remercie, mais vous confie qu’elle a réservé une retraite aux Pays-Bas.' },
    { vig: 'Elle part dans quinze jours et pense arrêter la venlafaxine la veille « pour que ça marche ».', q: 'c1-q2', after: 'Vous lui déconseillez l’arrêt brutal et faites le point sur les risques. Elle part sans changer son traitement.' },
    { vig: 'Trois semaines après son retour, elle consulte : angoisse, traînées visuelles derrière les objets en mouvement, halos colorés autour des lumières ; elle sait que « ce n’est pas réel ».', q: 'c1-q3', after: 'Examen neurologique normal. Vous la rassurez, conseillez d’éviter le cannabis, et proposez deux consultations pour revenir sur l’expérience. Les troubles s’estompent en quelques semaines.' }
  ] },
  { id: 'cas-t', t: 'M. T., 52 ans : l’alcool, une session, et après', steps: [
    { vig: 'M. T., 52 ans, trouble sévère de l’usage de l’alcool, trois cures en dix ans, sevré depuis trois semaines dans votre service. Humeur triste, BDI à 22. Pas d’antécédent psychotique ni bipolaire, pas de traitement en cours.', q: 'c2-q1', after: 'Il est inclus après bilan cardiologique et trois sessions de préparation.' },
    { vig: 'Le jour de la session, quarante minutes après la prise, il se redresse brusquement.', q: 'c2-q2', after: 'Après dix minutes de présence et de respiration, l’angoisse décroît ; il remet son bandeau et la musique reprend. Il dira plus tard que ce fut « le passage le plus important ».' },
    { vig: 'Trois semaines plus tard, à la session d’intégration.', q: 'c2-q3', after: 'Vous construisez avec lui un plan concret : un autre trajet pour rentrer, un ami sobre, des activités le soir, et le programme de prévention de la rechute de l’essai.' }
  ] }
];

/* ─── trees ─── */
/* Arbres de décision (page « Raisonner ») : l’interne choisit chaque branche avant de voir la suite.
   n : nœuds (q, opts[{l, s, to}]) ou feuilles (leaf, tag, sub) ; cases : chemin attendu (ans = indice de l’option). */
C.trees = {
  patient: { label: 'Un patient vous en parle', t: 'Un patient vous parle de psychédéliques', intro: 'En consultation, en garde ou aux urgences : trois situations, trois chemins. D’après les recommandations de sécurité (Johnson et al. 2008), le manuel de réduction des risques de la SPF (2022) et les données sur les interactions (Nayak et al. 2021).',
    src: 'Johnson et al. 2008 ; SPF 2022 ; Nayak et al. 2021', root: 'n1',
    n: {
      n1: { q: 'Que vous dit-il ?', ref: '', hint: 'Commencer par écouter, sans juger : substance, dose, contexte, raison de la prise.', opts: [{ l: 'Il en a pris et ne va pas bien', s: 'il en a pris', to: 'n2' }, { l: 'Il compte en prendre', s: 'il compte en prendre', to: 'n3' }, { l: 'Il demande un traitement', s: 'il demande un traitement', to: 'l-essai' }] },
      n2: { q: 'Qu’est-ce qui domine ?', ref: 'Johnson 2008 ; SPF 2022', opts: [{ l: 'Une angoisse aiguë, encore sous l’effet', s: 'angoisse aiguë', to: 'l-crise' }, { l: 'Des signes psychotiques ou maniaques qui persistent', s: 'psychose ou manie', to: 'l-psy' }, { l: 'Des troubles visuels persistants, critiqués', s: 'troubles visuels', to: 'l-hppd' }, { l: 'Le besoin de comprendre ce qu’il a vécu', s: 'besoin de comprendre', to: 'l-integ' }] },
      n3: { q: 'Antécédent psychotique ou bipolaire, personnel ou familial, cardiopathie, ou traitement à risque (lithium, IMAO, tramadol) ?', ref: 'Nayak 2021 ; Johnson 2008', opts: [{ l: 'Oui', s: 'oui', to: 'l-ci' }, { l: 'Non', s: 'non', to: 'l-rdr' }] },
      'l-essai': { leaf: 'Informer et orienter', tag: 'orienter', sub: 'Pas d’accès hors essai en France ; présenter les données et leurs limites, les essais en cours (ERPPAD pour l’alcool), et les traitements autorisés, dont l’eskétamine dans la dépression résistante.', ref: 'ANSM ; HAS' },
      'l-crise': { leaf: 'Mettre au calme et rassurer', tag: 'apaiser', sub: 'Lieu calme, une personne rassurante, constantes ; chercher un mélange et une complication somatique ; diazépam si l’angoisse déborde ; éviter halopéridol et contention.', ref: 'Johnson 2008' },
      'l-psy': { leaf: 'Traiter comme un épisode psychotique ou maniaque', tag: 'soigner', sub: 'Bilan somatique et toxicologique, hospitalisation si besoin, traitement de l’épisode ; rechercher un trouble sous-jacent révélé.', ref: 'SPF 2022' },
      'l-hppd': { leaf: 'Évoquer un HPPD', tag: 'rassurer', sub: 'Diagnostic d’élimination (neurologique, toxique) ; rassurer, éviter le cannabis et les psychotropes ; le plus souvent, amélioration en semaines ou mois.', ref: 'SPF 2022' },
      'l-integ': { leaf: 'Proposer d’intégrer', tag: 'intégrer', sub: 'Quelques consultations pour mettre en mots l’expérience, sans l’interpréter à sa place, et la relier à ses valeurs et à des changements concrets.', ref: 'Watts et Luoma 2020' },
      'l-ci': { leaf: 'Déconseiller fermement', tag: 'déconseiller', sub: 'Expliquer le risque (convulsions sous lithium, syndrome sérotoninergique avec un IMAO, décompensation) ; ne jamais arrêter un thymorégulateur pour « essayer » ; garder le lien.', ref: 'Nayak 2021' },
      'l-rdr': { leaf: 'Informer et réduire les risques', tag: 'réduire les risques', sub: 'Statut légal, absence de preuve hors essai ; s’il le fait quand même : pas seul, une personne sobre, faible dose d’abord, pas de mélange, produit analysé, lieu sûr ; proposer d’en reparler.', ref: 'SPF 2022' }
    },
    cases: [
      { id: 'l', label: 'M. L.', text: 'M. L., 41 ans, trouble bipolaire de type I, stable sous lithium depuis six ans, vous annonce qu’il participera à une cérémonie de champignons le mois prochain.',
        path: { n1: { ans: 1, why: 'Il n’a encore rien pris : on est dans la prévention.', data: '« Je compte en prendre. »' }, n3: { ans: 0, why: 'Lithium et trouble bipolaire : double contre-indication.', data: 'Lithium ; trouble bipolaire de type I.' } },
        end: 'Vous expliquez le risque de crise convulsive et de virage maniaque, conseillez de ne pas y aller et surtout de ne pas arrêter le lithium ; vous proposez d’en reparler avant le départ.' },
      { id: 'a', label: 'Mme A.', text: 'Mme A., 29 ans, consulte un mois après une retraite d’ayahuasca : des halos colorés et des traînées visuelles persistent ; elle sait qu’ils ne sont pas réels, et s’en inquiète.',
        path: { n1: { ans: 0, why: 'Elle en a pris et va moins bien.', data: 'Une retraite il y a un mois.' }, n2: { ans: 2, why: 'Perceptions persistantes et critiquées : tableau d’HPPD.', data: 'Halos, traînées, critique conservée.' } },
        end: 'Examen neurologique, rassurance, éviction du cannabis, réévaluation à un mois ; deux consultations pour revenir sur l’expérience.' },
      { id: 'd', label: 'M. D.', text: 'M. D., 55 ans, dépression résistante à trois antidépresseurs, a vu un reportage et vous demande de la psilocybine.',
        path: { n1: { ans: 2, why: 'Il demande un traitement, pas un conseil d’usage.', data: '« Pouvez-vous m’en prescrire ? »' } },
        end: 'Vous présentez les données (phase 3 positive, effet modeste), l’absence d’accès hors essai en France, et discutez de l’eskétamine, de la potentialisation et de l’ECT.' }
    ]
  }
};

/* ─── cards ─── */
/* Cartes de révision espacée (FSRS-6) : une question, une réponse courte, la source, la diapositive. */
C.cards = [
  { id: 'k01', ch: 'hist', q: 'Que signifie « psychédélique », et qui a proposé le mot ?', a: '« Qui rend l’esprit visible » (psychê + dêloun) ; Humphry Osmond, en 1956–1957, en réponse à Huxley.', src: 'Osmond 1957', sid: 'mots' },
  { id: 'k02', ch: 'hist', q: 'Aux doses habituelles, les psychédéliques donnent-ils surtout des hallucinations ?', a: 'Non : surtout des illusions (le réel déformé) et des pseudo-hallucinations critiquées.', src: 'SPF 2022', sid: 'mots' },
  { id: 'k03', ch: 'hist', q: 'Quelle est la définition pharmacologique d’un psychédélique classique ?', a: 'Un agoniste des récepteurs 5-HT2A (psilocybine, LSD, DMT, mescaline).', src: 'Nichols 2016', sid: 'familles' },
  { id: 'k04', ch: 'hist', q: 'Comment classer la MDMA, la kétamine et l’ibogaïne ?', a: 'MDMA : entactogène (libère la sérotonine) ; kétamine : dissociatif (antagoniste NMDA) ; ibogaïne : atypique, onirogène (cibles multiples).', src: 'SPF 2022', sid: 'familles' },
  { id: 'k05', ch: 'hist', q: 'Quand et comment Albert Hofmann découvre-t-il les effets du LSD ?', a: 'Le 16 avril 1943 par accident, puis le 19 avril 1943 en prenant 250 µg ; il rentre chez lui à vélo (« Bicycle Day »).', src: 'Hofmann 1979', sid: 'velo' },
  { id: 'k06', ch: 'hist', q: 'Quelle fut la première grande indication étudiée pour le LSD, et que montre la méta-analyse de 2012 ?', a: 'L’alcoolisme ; six essais randomisés des années 1960, 536 patients : OR 1,96 de réduction du mésusage (Krebs et Johansen).', src: 'Krebs et Johansen 2012', sid: 'premiere-vague' },
  { id: 'k07', ch: 'hist', q: 'Quelle différence entre thérapie « psycholytique » et « psychédélique » ?', a: 'Psycholytique : petites doses répétées au service de la psychanalyse (Europe) ; psychédélique : une forte dose pour une expérience décisive (Amérique du Nord).', src: 'Osmond ; Sandison', sid: 'premiere-vague' },
  { id: 'k08', ch: 'hist', q: 'Que s’est-il passé à Pont-Saint-Esprit en août 1951 ?', a: 'Une intoxication collective par du pain de seigle (ergotisme) : plus de 250 malades, sept morts ; la thèse d’une expérience de LSD est réfutée.', src: 'Gabbai et al., BMJ 1951', sid: 'interdit' },
  { id: 'k09', ch: 'hist', q: 'Quand les psychédéliques ont-ils été interdits ?', a: '1966 (Californie, retrait du Delysid, tableau des stupéfiants en France), 1970 (annexe I aux États-Unis), 1971 (Convention des Nations unies).', src: 'SPF 2022', sid: 'interdit' },
  { id: 'k10', ch: 'hist', q: 'Qu’ont publié Delay, Pichot et Heim en 1958 ?', a: 'Les effets psycho-physiologiques de la psilocybine chez 18 sujets, à Sainte-Anne : un « psychodysleptique ».', src: 'Delay et al., CR Acad Sci 1958', sid: 'france-mescaline' },
  { id: 'k11', ch: 'pharma', q: 'Pourquoi la psilocybine est-elle un promédicament ?', a: 'Des phosphatases lui retirent son phosphate : c’est la psilocine, plus lipophile, qui agit dans le cerveau.', src: 'Nichols 2016', sid: 'structures' },
  { id: 'k12', ch: 'pharma', q: 'Durée des effets : DMT inhalée, psilocybine, LSD, mescaline, ibogaïne ?', a: '≈ 15 min ; 4–6 h ; 8–12 h ; 12–14 h ; 24–36 h.', src: 'Ley 2023 ; SPF 2022', sid: 'durees' },
  { id: 'k13', ch: 'pharma', q: 'Que fait la kétansérine donnée une heure après le LSD ?', a: 'Elle ramène la durée moyenne des effets de 8,5 à 3,5 heures (Becker 2023).', src: 'Becker et al. 2023', sid: 'durees' },
  { id: 'k14', ch: 'pharma', q: 'Pourquoi espace-t-on les sessions de psychédéliques ?', a: 'Tachyphylaxie : après quelques prises quotidiennes l’effet s’émousse ; tolérance croisée entre LSD, psilocybine et mescaline.', src: 'Nichols 2016', sid: 'tolerance' },
  { id: 'k15', ch: 'pharma', q: 'Quel est le risque somatique principal de l’ibogaïne ?', a: 'Allongement du QT (blocage hERG), troubles du rythme, morts subites (19 décès recensés de 1990 à 2008).', src: 'Alper et al.', sid: 'toxicite' },
  { id: 'k16', ch: 'pharma', q: 'Quel est le risque de l’association lithium + psychédélique classique ?', a: 'Les crises convulsives (47 % des récits analysés, 39 % avec recours aux urgences) : contre-indication.', src: 'Nayak et al. 2021', sid: 'interactions' },
  { id: 'k17', ch: 'pharma', q: 'Pourquoi l’ayahuasca est-elle dangereuse avec un ISRS ?', a: 'Elle contient des IMAO (harmine, harmaline) : risque de syndrome sérotoninergique.', src: 'SPF 2022', sid: 'interactions' },
  { id: 'k18', ch: 'pharma', q: 'Combien d’événements indésirables graves dans les essais, selon la méta-analyse de Romeo, Kervadec et al. (2024) ?', a: 'Neuf pour plus de 1 000 administrations (30 études), un seul en phase aiguë.', src: 'Romeo, Kervadec et al. 2024', sid: 'toxicite' },
  { id: 'k19', ch: 'neuro', q: 'Quels arguments montrent que le récepteur 5-HT2A est nécessaire à l’effet psychédélique ?', a: 'La kétansérine bloque l’effet ; l’occupation 5-HT2A en TEP prédit l’intensité (jusqu’à 72 %) ; le head-twitch disparaît sans le récepteur.', src: 'Vollenweider 1998 ; Madsen 2019', sid: 'recepteur' },
  { id: 'k20', ch: 'neuro', q: 'Sur quels neurones les récepteurs 5-HT2A sont-ils les plus denses ?', a: 'Sur les dendrites apicales des neurones pyramidaux de la couche V du cortex associatif.', src: 'Aghajanian et Marek 1997', sid: 'neurone' },
  { id: 'k21', ch: 'neuro', q: 'Quelle cascade relie le récepteur 5-HT2A à la croissance des épines ?', a: 'Excitation → glutamate → récepteurs AMPA → BDNF → TrkB → mTOR → épines et dendrites.', src: 'Ly et al. 2018', sid: 'neurone' },
  { id: 'k22', ch: 'neuro', q: 'Qu’ont montré Vargas et al. (2023) ?', a: 'Des récepteurs 5-HT2A intracellulaires : les psychédéliques lipophiles les atteignent, pas la sérotonine, d’où une plasticité propre aux psychédéliques.', src: 'Vargas et al., Science 2023', sid: 'neurone' },
  { id: 'k23', ch: 'neuro', q: 'Qu’ont montré Moliner et al. (2023) ?', a: 'Le LSD et la psilocine se fixent directement à TrkB, avec une affinité environ mille fois supérieure à celle des antidépresseurs.', src: 'Moliner et al., Nat Neurosci 2023', sid: 'plasticite' },
  { id: 'k24', ch: 'neuro', q: 'Combien de temps la psilocybine rouvre-t-elle la période critique d’apprentissage social chez la souris ?', a: 'Deux semaines (kétamine 48 h, MDMA 2 semaines, LSD 3, ibogaïne 4) : comme la durée des effets chez l’humain.', src: 'Nardou et al., Nature 2023', sid: 'plasticite' },
  { id: 'k25', ch: 'neuro', q: 'Que fait la psilocybine aux réseaux cérébraux ?', a: 'Elle les désynchronise, surtout le réseau du mode par défaut (> 3 fois plus que le méthylphénidate) ; l’entropie de l’activité augmente.', src: 'Siegel et al., Nature 2024', sid: 'reseaux' },
  { id: 'k27', ch: 'neuro', q: 'Qu’est-ce que la précision d’une croyance, et que devient le postérieur si elle est grande ?', a: 'L’inverse de sa variance ; le postérieur reste près du prior et ignore presque les données contraires.', src: 'Carhart-Harris et Friston 2019', sid: 'bayes' },
  { id: 'k28', ch: 'neuro', q: 'Que propose le modèle REBUS ?', a: 'Les psychédéliques relâchent la précision des croyances de haut niveau : l’information ascendante pèse davantage, comme dans un recuit (~ _neural annealing_).', src: 'Carhart-Harris et Friston 2019', sid: 'rebus' },
  { id: 'k29', ch: 'neuro', q: 'Comment Hipólito et al. (2023) définissent-ils la santé mentale ?', a: 'Par la multistabilité : plusieurs états stables et la possibilité de passer de l’un à l’autre ; la psychopathologie est un attracteur trop profond.', src: 'Hipólito et al. 2023', sid: 'patterns' },
  { id: 'k30', ch: 'neuro', q: 'Que faut-il après la déstabilisation, selon l’approche des systèmes complexes ?', a: 'L’intégration : creuser un autre chemin et laisser l’ancienne vallée se combler (renforçateurs, entourage, habitudes).', src: 'Hipólito et al. 2023', sid: 'patterns' },
  { id: 'k31', ch: 'clin', q: 'Résultats des deux phases 3 de la psilocybine dans la dépression résistante ?', a: 'MADRS −3,6 contre placebo (COMP005) et −3,8 contre 1 mg (COMP006) à six semaines.', src: 'Compass Pathways 2025–2026', sid: 'depression' },
  { id: 'k32', ch: 'clin', q: 'Que montre l’essai psilocybine contre escitalopram (2021) ?', a: 'Pas de différence significative sur le critère principal (QIDS-SR −8 vs −6) ; des critères secondaires en faveur de la psilocybine.', src: 'Carhart-Harris et al., NEJM 2021', sid: 'depression' },
  { id: 'k33', ch: 'clin', q: 'Quel essai a testé le LSD sans psychothérapie, et avec quel résultat ?', a: 'Emerge (2026) : 100 µg dans l’épisode dépressif, MADRS −8,1 vs placebo à six semaines.', src: 'Definium 2026', sid: 'depression' },
  { id: 'k34', ch: 'clin', q: 'Que montre l’étude PAD (Nîmes) ?', a: 'Chez 30 patients sevrés et déprimés : abstinence à 12 semaines 55 % (25 mg) vs 11 % (1 mg), mais 93 % ont deviné leur groupe.', src: 'Luquiens, Addiction 2025', sid: 'alcool' },
  { id: 'k35', ch: 'clin', q: 'Pourquoi la FDA a-t-elle refusé la MDMA en 2024 ?', a: 'Aveugle et attentes, effets indésirables « positifs » non recueillis, durabilité, défauts de sélection ; et une faute éthique ayant conduit à rétracter trois articles.', src: 'FDA 2024', sid: 'tspt-mdma' },
  { id: 'k36', ch: 'clin', q: 'Quelle est la corrélation entre intensité de l’expérience et amélioration (Romeo, Kervadec et al. 2025) ?', a: 'r = 0,33 ; plus forte dans les troubles de l’humeur (0,41), en cadre clinique (0,50) et en prospectif (0,43).', src: 'Romeo, Kervadec et al. 2025', sid: 'intensite' },
  { id: 'k37', ch: 'clin', q: 'Que conclut la méta-analyse de Williams, Barnett et Szigeti (2026) ?', a: 'À conditions d’aveugle égales, la thérapie psychédélique ne fait pas mieux que les antidépresseurs donnés en ouvert.', src: 'JAMA Psychiatry 2026', sid: 'lire-essai' },
  { id: 'k38', ch: 'meth', q: 'Quelles sont les contre-indications habituelles d’une session ?', a: 'Antécédent personnel ou familial (1er degré) de psychose ou de bipolarité ; HTA non contrôlée, cardiopathie ; grossesse ; lithium, IMAO, tramadol.', src: 'Johnson et al. 2008', sid: 'selection' },
  { id: 'k39', ch: 'meth', q: 'Que font les accompagnants pendant une expérience difficile ?', a: 'Présence calme et rassurante, inviter à traverser la peur, une main tenue si convenu ; diazépam 10 mg si besoin ; éviter halopéridol et contention.', src: 'Johnson et al. 2008', sid: 'crise' },
  { id: 'k40', ch: 'meth', q: 'Que signifie ACE dans le modèle d’intégration de Watts et Luoma ?', a: 'Accept, Connect, Embody : accepter, se relier, incarner — la flexibilité psychologique de l’ACT.', src: 'Watts et Luoma 2020', sid: 'integration' },
  { id: 'k41', ch: 'meth', q: 'Que mesure le MEQ-30, et quand parle-t-on d’expérience mystique « complète » ?', a: 'L’expérience mystique (4 facteurs) ; « complète » si au moins 60 % du maximum sur chaque facteur.', src: 'Barrett et al. 2015', sid: 'mesurer' },
  { id: 'k42', ch: 'cadre', q: 'Quel est le statut de la psilocybine en France (octobre 2026) ?', a: 'Stupéfiant : usage interdit sauf autorisation de l’ANSM, c’est-à-dire en essai clinique (PAD, ERPPAD).', src: 'Arrêté du 22 février 1990 ; JO 2025', sid: 'droit-france' },
  { id: 'k43', ch: 'cadre', q: 'Quels pays permettent un accès encadré à la psilocybine hors essai ?', a: 'Suisse (compassionnel, 2014), Australie (2023), Allemagne (compassionnel, 2025), Tchéquie (loi, 2026).', src: 'OFSP ; TGA ; BfArM ; NUDZ', sid: 'monde' }
];

/* ─── zz-fin ─── */
/* Portes de l’accueil et liste des laboratoires (en fin de fichier : les décomptes sont connus). */
C.labList = [
  ['durees', 'arch', 'Les durées', 'De quinze minutes à trente-six heures : les courbes d’effet des neuf substances, heure par heure ; et le « bouton d’arrêt » de la kétansérine.', { viz: 'durees' }],
  ['recepteur', 'funnel', 'Le neurone pyramidal', 'De la psilocybine à la psilocine, du récepteur 5-HT2A au glutamate, au BDNF, à TrkB et aux nouvelles épines : la cascade, étape par étape.', { viz: 'recepteur' }],
  ['bayes', 'bell', 'Le cerveau bayésien', 'Prior, données, postérieur : règle la précision des croyances et applique le modèle REBUS.', { viz: 'bayes' }],
  ['paysage', 'valley', 'Le paysage des attracteurs', 'Une bille dans un paysage en relief : canalisation, température, aplatissement, intégration. Briser un pattern, puis en creuser un autre.', { viz: 'paysage' }],
  ['addiction', 'grid', 'Le cycle de l’addiction', 'Intoxication, sevrage, préoccupation : les circuits du cycle de Koob et Volkow, ce que fait l’addiction, ce que les psychédéliques pourraient y changer.', { viz: 'addiction' }],
  ['intensite', 'scale', 'L’intensité compte', 'La méta-analyse de Romeo, Kervadec et al. (2025) : la corrélation entre l’intensité de l’expérience et l’amélioration, selon le trouble, le cadre et le type d’étude.', { viz: 'intensite' }],
  ['seance', 'loop', 'Le jour de la session', 'Heure par heure : ce que vit le patient, ce que font les accompagnants, ce que l’on surveille.', { viz: 'seance' }]
];
C.doors = [
  ['#/labos', 'grid', 'Laboratoires', 'Sept schémas à manipuler : les durées, le neurone pyramidal, le cerveau bayésien, le paysage des attracteurs en relief, le cycle de l’addiction, l’intensité, le jour de la session.'],
  ['#/pharmacopee', 'pills', 'Substances', Object.keys(C.mols).length + ' fiches : origine, mécanisme, durée, doses étudiées, preuves, risques, interactions et statut en France.'],
  ['#/histoire', 'hourglass', 'Histoire', C.history.length + ' archives, d’Éleusis à Nîmes : María Sabina, Hofmann, Sartre, Huxley, le Vendredi saint, l’interdit et la renaissance.'],
  ['#/entrainement', 'arch', 'S’entraîner', 'Deux cas cliniques progressifs, ' + C.qcm.length + ' QRM, un arbre de décision et ' + C.cards.length + ' cartes de révision espacée.']
];

/* ─── structures : coordonnées 2D calculées avec RDKit, ibogaïne et noribogaïne dessinées à la main (tools/mols.py) ─── */
C.structures = {"serotonine":{"f":"C10H12N2O","a":[["N",2.419,-2.329,0,2],["C",2.109,-1.378,0,2],["C",1.131,-1.171,0,2],["C",0.821,-0.22,0,0],["C",1.408,0.589,0,1],["N",0.82,1.398,0,1],["C",-0.131,1.088,0,0],["C",-0.997,1.587,0,1],["C",-1.863,1.087,0,1],["C",-1.862,0.087,0,0],["O",-2.728,-0.414,0,1],["C",-0.996,-0.413,0,1],["C",-0.13,0.088,0,0]],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,2],[4,5,1],[5,6,1],[6,7,1],[7,8,2],[8,9,1],[9,10,1],[9,11,2],[11,12,1],[12,3,1],[12,6,2]],"rc":[[0.558,0.589,5],[-0.997,0.587,6]]},"psilocybine":{"f":"C12H17N2O4P","a":[["C",-3.755,1.024,0,3],["N",-2.891,0.521,0,0],["C",-2.894,-0.479,0,3],["C",-2.023,1.019,0,2],["C",-1.159,0.516,0,2],["C",-0.291,1.014,0,0],["C",-0.184,2.008,0,1],["N",0.794,2.213,0,1],["C",1.292,1.347,0,0],["C",2.269,1.135,0,1],["C",2.575,0.185,0,1],["C",1.905,-0.558,0,1],["C",0.927,-0.346,0,0],["O",0.256,-1.089,0,0],["P",0.563,-2.04,0,0],["O",0.87,-2.992,0,0],["O",-0.389,-2.347,0,1],["O",1.515,-1.734,0,1],["C",0.621,0.605,0,0]],"b":[[0,1,1],[1,2,1],[1,3,1],[3,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,1],[8,9,2],[9,10,1],[10,11,2],[11,12,1],[12,13,1],[13,14,1],[14,15,2],[14,16,1],[14,17,1],[12,18,2],[18,5,1],[18,8,1]],"rc":[[0.446,1.437,5],[1.598,0.395,6]]},"psilocine":{"f":"C12H16N2O","a":[["C",-3.587,0.398,0,3],["N",-2.72,-0.1,0,0],["C",-2.718,-1.1,0,3],["C",-1.855,0.402,0,2],["C",-0.988,-0.096,0,2],["C",-0.123,0.406,0,0],["C",-0.021,1.401,0,1],["N",0.957,1.611,0,1],["C",1.459,0.746,0,0],["C",2.437,0.54,0,1],["C",2.749,-0.41,0,1],["C",2.081,-1.155,0,1],["C",1.102,-0.949,0,0],["O",0.435,-1.694,0,1],["C",0.791,0.001,0,0]],"b":[[0,1,1],[1,2,1],[1,3,1],[3,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,1],[8,9,2],[9,10,1],[10,11,2],[11,12,1],[12,13,1],[12,14,2],[14,5,1],[14,8,1]],"rc":[[0.613,0.833,5],[1.77,-0.204,6]]},"dmt":{"f":"C12H16N2","a":[["C",0.011,-3.085,0,3],["N",0.68,-2.341,0,0],["C",1.658,-2.548,0,3],["C",0.37,-1.39,0,2],["C",1.039,-0.646,0,2],["C",0.729,0.304,0,0],["C",1.316,1.114,0,1],["N",0.728,1.922,0,1],["C",-0.223,1.612,0,0],["C",-1.089,2.112,0,1],["C",-1.955,1.611,0,1],["C",-1.954,0.611,0,1],["C",-1.088,0.112,0,1],["C",-0.222,0.612,0,0]],"b":[[0,1,1],[1,2,1],[1,3,1],[3,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,1],[8,9,2],[9,10,1],[10,11,2],[11,12,1],[12,13,2],[13,5,1],[13,8,1]],"rc":[[0.466,1.113,5],[-1.089,1.112,6]]},"meodmt":{"f":"C13H18N2O","a":[["C",-3.92,0.568,0,3],["N",-3.053,0.07,0,0],["C",-3.051,-0.93,0,3],["C",-2.188,0.572,0,2],["C",-1.321,0.074,0,2],["C",-0.456,0.576,0,0],["C",-0.354,1.571,0,1],["N",0.624,1.781,0,1],["C",1.126,0.916,0,0],["C",2.104,0.71,0,1],["C",2.416,-0.24,0,1],["C",1.748,-0.985,0,0],["O",2.059,-1.935,0,0],["C",3.038,-2.141,0,3],["C",0.77,-0.779,0,1],["C",0.458,0.171,0,0]],"b":[[0,1,1],[1,2,1],[1,3,1],[3,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,1],[8,9,1],[9,10,2],[10,11,1],[11,12,1],[12,13,1],[11,14,2],[14,15,1],[15,5,1],[15,8,2]],"rc":[[0.28,1.003,5],[1.437,-0.034,6]]},"lsd":{"f":"C20H25N3O","a":[["C",1.54,2.628,0,3],["C",0.673,2.121,0,2],["N",-0.199,2.618,0,0],["C",-0.196,3.623,0,2],["C",0.675,4.124,0,3],["C",-1.082,2.108,0,0],["O",-1.945,2.61,0,0],["C",-1.081,1.092,0,1],["C",-1.936,0.566,0,2],["N",-1.913,-0.44,0,0],["C",-2.767,-0.958,0,3],["C",-1.035,-0.92,0,1],["C",-0.999,-1.937,0,2],["C",-0.106,-2.399,0,0],["C",0.198,-3.356,0,1],["N",1.216,-3.355,0,1],["C",1.513,-2.39,0,0],["C",2.404,-1.931,0,1],["C",2.437,-0.919,0,1],["C",1.576,-0.385,0,1],["C",0.7,-0.872,0,0],["C",-0.173,-0.393,0,0],["C",-0.201,0.61,0,1],["C",0.702,-1.848,0,0]],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[2,5,1],[5,6,2],[5,7,1],[7,8,1],[8,9,1],[9,10,1],[9,11,1],[11,12,1],[12,13,1],[13,14,2],[14,15,1],[15,16,1],[16,17,2],[17,18,1],[18,19,2],[19,20,1],[20,21,1],[21,22,2],[20,23,2],[22,7,1],[21,11,1],[23,13,1],[23,16,1]],"rc":[[0.705,-2.67,5],[-1.056,0.086,6],[-0.152,-1.395,6],[1.555,-1.391,6]]},"mescaline":{"f":"C11H17NO3","a":[["C",0.695,2.466,0,3],["O",-0.172,1.967,0,0],["C",-0.172,0.967,0,0],["C",-1.039,0.468,0,1],["C",-1.04,-0.533,0,0],["C",-1.906,-1.032,0,2],["C",-1.907,-2.032,0,2],["N",-2.773,-2.531,0,2],["C",-0.174,-1.033,0,1],["C",0.692,-0.534,0,0],["O",1.558,-1.035,0,0],["C",2.424,-0.535,0,3],["C",0.693,0.466,0,0],["O",1.56,0.965,0,0],["C",1.56,1.965,0,3]],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,2],[4,5,1],[5,6,1],[6,7,1],[4,8,1],[8,9,2],[9,10,1],[10,11,1],[9,12,1],[12,13,1],[13,14,1],[12,2,2]],"rc":[[-0.173,-0.033,6]]},"mdma":{"f":"C11H15NO2","a":[["C",-3.71,0.324,0,3],["N",-2.843,0.824,0,1],["C",-1.978,0.323,0,1],["C",-1.978,-0.677,0,3],["C",-1.111,0.822,0,2],["C",-0.246,0.322,0,0],["C",-0.246,-0.678,0,1],["C",0.619,-1.179,0,1],["C",1.486,-0.68,0,0],["O",2.437,-0.99,0,0],["C",3.025,-0.181,0,2],["O",2.438,0.629,0,0],["C",1.486,0.32,0,0],["C",0.621,0.821,0,1]],"b":[[0,1,1],[1,2,1],[2,3,1],[2,4,1],[4,5,1],[5,6,1],[6,7,2],[7,8,1],[8,9,1],[9,10,1],[10,11,1],[11,12,1],[12,13,1],[13,5,2],[12,8,2]],"rc":[[2.174,-0.18,5],[0.62,-0.179,6]]},"ketamine":{"f":"C13H16ClNO","a":[["C",-1.659,1.174,0,3],["N",-1.021,0.405,0,1],["C",-0.034,0.569,0,0],["C",-0.389,1.504,0,2],["C",0.242,2.278,0,2],["C",1.23,2.115,0,2],["C",1.589,1.182,0,2],["C",0.956,0.409,0,0],["O",1.339,-0.512,0,0],["C",-0.076,-0.451,0,0],["C",0.789,-0.944,0,1],["C",0.791,-1.942,0,1],["C",-0.073,-2.441,0,1],["C",-0.939,-1.947,0,1],["C",-0.941,-0.949,0,0],["Cl",-1.807,-0.451,0,0]],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,2],[2,9,1],[9,10,2],[10,11,1],[11,12,2],[12,13,1],[13,14,2],[14,15,1],[7,2,1],[14,9,1]],"rc":[[0.599,1.343,6],[-0.075,-1.446,6]]},"esketamine":{"f":"C13H16ClNO","a":[["C",-1.659,1.174,0,3],["N",-1.021,0.405,0,1],["C",-0.034,0.569,0,0],["C",-0.389,1.504,0,2],["C",0.242,2.278,0,2],["C",1.23,2.115,0,2],["C",1.589,1.182,0,2],["C",0.956,0.409,0,0],["O",1.339,-0.512,0,0],["C",-0.076,-0.451,0,0],["C",0.789,-0.944,0,1],["C",0.791,-1.942,0,1],["C",-0.073,-2.441,0,1],["C",-0.939,-1.947,0,1],["C",-0.941,-0.949,0,0],["Cl",-1.807,-0.451,0,0]],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,2],[2,9,1],[9,10,2],[10,11,1],[11,12,2],[12,13,1],[13,14,2],[14,15,1],[7,2,1],[14,9,1]],"rc":[[0.599,1.343,6],[-0.075,-1.446,6]]},"ibogaine":{"f":"C20H26N2O","a":[["C",1.921,2.122,0,0],["C",3.384,1.811,0,1],["C",4.372,2.945,0,0],["C",3.915,4.372,0,0],["C",2.451,4.683,0,1],["C",1.445,3.567,0,1],["C",5.872,2.945,0,0],["C",6.348,4.372,0,0],["N",5.122,5.177,0,1],["C",6.695,1.683,0,2],["C",8.195,1.537,0,2],["N",9.183,2.598,0,0],["C",7.72,4.866,0,1],["C",9,4.116,0,1],["C",8.177,5.634,0,2],["C",9.457,4.902,0,1],["C",10.756,5.616,0,2],["C",10.317,4.848,0,1],["C",9.713,3.476,0,2],["C",11.378,3.787,0,2],["C",12.787,4.226,0,3],["O",0.905,1.019,0,0],["C",1.354,-0.412,0,3]],"b":[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[2,6,1],[6,7,2],[7,8,1],[8,3,1],[6,9,1],[9,10,1],[10,11,1],[11,13,1],[13,12,1],[12,7,1],[12,14,1,"w"],[14,15,1,"b"],[15,16,1,"b"],[17,16,1,"w"],[17,13,1,"h"],[11,18,1,"w"],[18,15,1,"b"],[17,19,1],[19,20,1],[0,21,1],[21,22,1]],"rc":[[2.914,3.251,6],[5.126,3.962,5]]},"noribogaine":{"f":"C19H24N2O","a":[["C",1.921,2.122,0,0],["C",3.384,1.811,0,1],["C",4.372,2.945,0,0],["C",3.915,4.372,0,0],["C",2.451,4.683,0,1],["C",1.445,3.567,0,1],["C",5.872,2.945,0,0],["C",6.348,4.372,0,0],["N",5.122,5.177,0,1],["C",6.695,1.683,0,2],["C",8.195,1.537,0,2],["N",9.183,2.598,0,0],["C",7.72,4.866,0,1],["C",9,4.116,0,1],["C",8.177,5.634,0,2],["C",9.457,4.902,0,1],["C",10.756,5.616,0,2],["C",10.317,4.848,0,1],["C",9.713,3.476,0,2],["C",11.378,3.787,0,2],["C",12.787,4.226,0,3],["O",0.905,1.019,0,1]],"b":[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[2,6,1],[6,7,2],[7,8,1],[8,3,1],[6,9,1],[9,10,1],[10,11,1],[11,13,1],[13,12,1],[12,7,1],[12,14,1,"w"],[14,15,1,"b"],[15,16,1,"b"],[17,16,1,"w"],[17,13,1,"h"],[11,18,1,"w"],[18,15,1,"b"],[17,19,1],[19,20,1],[0,21,1]],"rc":[[2.914,3.251,6],[5.126,3.962,5]]},"harmine":{"f":"C13H12N2O","a":[["C",-3.761,0.554,0,3],["O",-3.095,-0.193,0,0],["C",-2.116,0.01,0,0],["C",-1.802,0.96,0,1],["C",-0.823,1.163,0,1],["C",-0.158,0.416,0,0],["C",-0.472,-0.533,0,0],["C",-1.451,-0.736,0,1],["N",0.334,-1.125,0,1],["C",1.146,-0.541,0,0],["C",2.123,-0.754,0,0],["C",2.428,-1.707,0,3],["N",2.796,-0.014,0,0],["C",2.492,0.938,0,1],["C",1.515,1.151,0,1],["C",0.842,0.411,0,0]],"b":[[0,1,1],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,6,1],[6,7,2],[6,8,1],[8,9,1],[9,10,1],[10,11,1],[10,12,2],[12,13,1],[13,14,2],[14,15,1],[7,2,1],[15,9,2],[15,5,1]],"rc":[[0.338,-0.274,5],[-1.137,0.213,6],[1.819,0.198,6]]},"ketanserine":{"f":"C22H22FN3O3","a":[["O",3.823,0.962,0,0],["C",2.958,1.463,0,0],["C",2.958,2.463,0,0],["C",2.093,2.964,0,1],["C",2.094,3.964,0,1],["C",2.96,4.463,0,0],["F",2.961,5.463,0,0],["C",3.826,3.962,0,1],["C",3.825,2.962,0,1],["C",2.091,0.964,0,1],["C",1.226,1.464,0,2],["C",0.359,0.965,0,2],["N",0.358,-0.035,0,0],["C",-0.508,-0.534,0,2],["C",-0.509,-1.534,0,2],["N",-1.375,-2.033,0,0],["C",-1.376,-3.033,0,0],["O",-0.51,-3.534,0,0],["N",-2.242,-3.533,0,1],["C",-3.108,-3.032,0,0],["C",-3.974,-3.531,0,1],["C",-4.84,-3.031,0,1],["C",-4.839,-2.031,0,1],["C",-3.973,-1.531,0,1],["C",-3.107,-2.032,0,0],["C",-2.241,-1.533,0,0],["O",-2.24,-0.533,0,0],["C",1.224,-0.535,0,2],["C",2.09,-0.036,0,2]],"b":[[0,1,2],[1,2,1],[2,3,1],[3,4,2],[4,5,1],[5,6,1],[5,7,2],[7,8,1],[1,9,1],[9,10,1],[10,11,1],[11,12,1],[12,13,1],[13,14,1],[14,15,1],[15,16,1],[16,17,2],[16,18,1],[18,19,1],[19,20,2],[20,21,1],[21,22,2],[22,23,1],[23,24,2],[24,25,1],[25,26,2],[12,27,1],[27,28,1],[8,2,2],[28,9,1],[25,15,1],[24,19,1]],"rc":[[2.959,3.463,6],[-2.241,-2.533,6],[-3.974,-2.531,6],[1.225,0.464,6]]}};

/* ─── notes de l’enseignant : chiffrées (AES-GCM, clé PBKDF2-SHA256) ; le site les déchiffre avec le mot de passe ─── */
C.notesLock = {"v":1,"it":200000,"salt":"J2ilOdSEvJ2qGo/l+ldM6g==","iv":"DHmAay28ynPC0cE4","ct":"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"};
