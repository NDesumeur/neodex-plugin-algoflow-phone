// AlgoFlow : voir les algorithmes travailler, étape par étape. Tris (8), recherches (2) et parcours de graphes sur une grille (4),
// avec le pseudo-code qui s'allume, les compteurs, l'explication et la complexité. Chaque algorithme est un générateur : ses étapes
// sont enregistrées d'avance, on peut donc avancer, reculer et changer la vitesse à volonté.
const CSS = `
.afTop{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.afGrid{display:grid;grid-template-columns:minmax(0,1fr) clamp(300px,24vw,380px);gap:16px}
@media (max-width:980px){.afGrid{grid-template-columns:minmax(0,1fr)}}
.afCan{width:100%;display:block;image-rendering:pixelated;background:#0b0816;border:2px solid var(--line);touch-action:none}
.afRow{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0}
.afRange{-webkit-appearance:none;appearance:none;height:12px;background:var(--bg0);border:2px solid var(--line);outline:none;width:150px}
.afRange::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:22px;background:var(--magenta);border:2px solid #000;cursor:var(--cp,pointer)}
.afCode{font:16px/1.5 monospace;background:var(--bg0);border:2px solid var(--line);padding:6px 0;white-space:pre-wrap;overflow-x:auto}
.afCode div{padding:2px 10px;color:var(--muted)}
.afCode div.on{background:rgba(var(--pkr),.3);color:#fff}
.afStats{font:15px/1.5 monospace;color:var(--lilac);display:grid;grid-template-columns:1fr 1fr;gap:2px 10px;margin:8px 0}
.afStats b{color:#fff}
.afHelp{font-size:15px;line-height:1.55;color:var(--lilac)}
.afHelp b{color:#fff}
.afMsg{font:16px monospace;color:#ffd34f;min-height:22px;margin-top:6px}
.afLegend{font-size:14px;line-height:1.8;color:var(--muted);margin-top:4px}
.afLegend i{display:inline-block;width:13px;height:13px;margin:0 4px 0 10px;vertical-align:-1px}
`;
const C = {bar: '#5a4a8a', cmp: '#ffd34f', swap: '#ff4fb0', done: '#6ae06a', pivot: '#4fc3ff', dim: '#2a2244', wall: '#8a7aa8', mud: '#5a3a1a', start: '#6ae06a', goal: '#ff4fb0', open: '#4fc3ff', seen: '#2e3a6a', path: '#ffd34f'};
// ---------- les tris : chaque yield est une étape {a, line, hl, done, msg} ----------
function* bubble(a) { const n = a.length; for (let i = 0; i < n - 1; i++) { let sw = false; for (let j = 0; j < n - 1 - i; j++) { yield {line: 2, cmp: [j, j + 1]}; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw = true; yield {line: 3, swap: [j, j + 1]}; } } yield {line: 4, sorted: n - 1 - i}; if (!sw) break; } }
function* insertion(a) { for (let i = 1; i < a.length; i++) { const v = a[i]; let j = i - 1; yield {line: 1, pivot: [i]}; while (j >= 0) { yield {line: 2, cmp: [j, j + 1]}; if (a[j] <= v) break; a[j + 1] = a[j]; yield {line: 3, swap: [j, j + 1]}; j--; } a[j + 1] = v; yield {line: 4, swap: [j + 1]}; } }
function* selection(a) { const n = a.length; for (let i = 0; i < n - 1; i++) { let m = i; for (let j = i + 1; j < n; j++) { yield {line: 2, cmp: [m, j]}; if (a[j] < a[m]) { m = j; yield {line: 3, pivot: [m]}; } } if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; yield {line: 4, swap: [i, m]}; } yield {line: 4, sorted: i}; } }
function* merge(a, lo = 0, hi = a.length) { if (hi - lo < 2) return; const mid = (lo + hi) >> 1; yield {line: 1, range: [lo, hi]}; yield* merge(a, lo, mid); yield* merge(a, mid, hi); const L = a.slice(lo, mid), R = a.slice(mid, hi); let i = 0, j = 0, k = lo; while (i < L.length && j < R.length) { yield {line: 3, cmp: [lo + i, mid + j], range: [lo, hi]}; a[k++] = L[i] <= R[j] ? L[i++] : R[j++]; yield {line: 4, swap: [k - 1], range: [lo, hi]}; } while (i < L.length) { a[k++] = L[i++]; yield {line: 4, swap: [k - 1]}; } while (j < R.length) { a[k++] = R[j++]; yield {line: 4, swap: [k - 1]}; } }
function* quick(a, lo = 0, hi = a.length - 1) { if (lo >= hi) { if (lo === hi) yield {line: 0, sorted: lo}; return; } const p = a[hi]; let i = lo; yield {line: 1, pivot: [hi], range: [lo, hi + 1]}; for (let j = lo; j < hi; j++) { yield {line: 2, cmp: [j, hi], pivot: [hi]}; if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; yield {line: 3, swap: [i, j], pivot: [hi]}; i++; } } [a[i], a[hi]] = [a[hi], a[i]]; yield {line: 4, swap: [i, hi], sorted: i}; yield* quick(a, lo, i - 1); yield* quick(a, i + 1, hi); }
function* heap(a) { const n = a.length; function* sift(s, e) { let r = s; while (2 * r + 1 <= e) { let c = 2 * r + 1, sw = r; yield {line: 2, cmp: [sw, c]}; if (a[sw] < a[c]) sw = c; if (c + 1 <= e) { yield {line: 2, cmp: [sw, c + 1]}; if (a[sw] < a[c + 1]) sw = c + 1; } if (sw === r) return; [a[r], a[sw]] = [a[sw], a[r]]; yield {line: 3, swap: [r, sw]}; r = sw; } } for (let s = (n >> 1) - 1; s >= 0; s--) yield* sift(s, n - 1); for (let e = n - 1; e > 0; e--) { [a[0], a[e]] = [a[e], a[0]]; yield {line: 4, swap: [0, e], sorted: e}; yield* sift(0, e - 1); } }
function* shell(a) { for (let gap = a.length >> 1; gap > 0; gap >>= 1) { yield {line: 1, msg: 'écart ' + gap}; for (let i = gap; i < a.length; i++) { const v = a[i]; let j = i; while (j >= gap) { yield {line: 2, cmp: [j - gap, j]}; if (a[j - gap] <= v) break; a[j] = a[j - gap]; yield {line: 3, swap: [j, j - gap]}; j -= gap; } a[j] = v; yield {line: 4, swap: [j]}; } } }
function* counting(a) { const max = Math.max(...a), cnt = Array(max + 1).fill(0); for (let i = 0; i < a.length; i++) { cnt[a[i]]++; yield {line: 1, cmp: [i]}; } let k = 0; for (let v = 0; v <= max; v++) for (let c = 0; c < cnt[v]; c++) { a[k++] = v; yield {line: 3, swap: [k - 1]}; } }
const SORTS = {
  bubble: ['Tri à bulles', bubble, 'O(n²)', 'O(1)', 'Compare chaque paire de voisins et les échange s\'ils sont dans le désordre : les grands remontent à la fin comme des bulles. Simple, mais lent.', ['pour i de 0 à n-2', '  pour j de 0 à n-2-i', '    si a[j] > a[j+1]', '      échanger a[j] et a[j+1]', '  a[n-1-i] est à sa place']],
  insertion: ['Tri par insertion', insertion, 'O(n²)', 'O(1)', 'Prend chaque élément et le glisse à sa place parmi ceux déjà triés, comme on range des cartes dans sa main. Très rapide sur un tableau presque trié.', ['pour i de 1 à n-1', '  v ← a[i]', '  tant que a[j] > v', '    décaler a[j] vers la droite', '  poser v à sa place']],
  selection: ['Tri par sélection', selection, 'O(n²)', 'O(1)', 'Cherche le plus petit élément du reste et le met devant. Toujours le même nombre de comparaisons, mais très peu d\'échanges.', ['pour i de 0 à n-2', '  pour j de i+1 à n-1', '    si a[j] < a[min]', '      min ← j', '  échanger a[i] et a[min]']],
  merge: ['Tri fusion', merge, 'O(n log n)', 'O(n)', 'Coupe le tableau en deux, trie chaque moitié (en recommençant), puis fusionne les deux moitiés triées. Toujours rapide, mais il lui faut de la place en plus.', ['trier(a, début, fin)', '  couper en deux au milieu', '  trier chaque moitié', '  comparer les têtes des deux moitiés', '  recopier la plus petite']],
  quick: ['Tri rapide', quick, 'O(n log n) en moyenne, O(n²) au pire', 'O(log n)', 'Choisit un pivot, met les plus petits à gauche et les plus grands à droite, puis recommence de chaque côté. Le plus utilisé en pratique ; lent sur un tableau déjà trié avec ce choix de pivot (le dernier).', ['trier(a, bas, haut)', '  pivot ← a[haut]', '  pour j de bas à haut-1 : comparer au pivot', '    plus petit : l\'envoyer à gauche', '  poser le pivot entre les deux, recommencer']],
  heap: ['Tri par tas', heap, 'O(n log n)', 'O(1)', 'Range le tableau en tas (chaque parent plus grand que ses enfants), sort la racine (le plus grand) à la fin, répare le tas, et recommence.', ['construire le tas', '  pour chaque nœud, du bas vers le haut', '    comparer au plus grand enfant', '    descendre le nœud si besoin', 'échanger la racine et la fin du tas']],
  shell: ['Tri de Shell', shell, 'entre O(n log² n) et O(n²)', 'O(1)', 'Un tri par insertion sur des éléments éloignés (écart n/2, puis n/4…), qui rapproche vite les éléments de leur place, puis un dernier passage à écart 1.', ['écart ← n/2', '  tant que écart > 0 : pour chaque i', '    comparer a[j-écart] et a[j]', '      décaler de écart', '    poser v ; écart ← écart/2']],
  counting: ['Tri par comptage', counting, 'O(n + k)', 'O(k)', 'Ne compare jamais : compte combien de fois chaque valeur apparaît, puis réécrit le tableau dans l\'ordre. Imbattable quand les valeurs sont de petits entiers.', ['compter chaque valeur', '  cnt[a[i]] ← cnt[a[i]] + 1', 'pour chaque valeur v dans l\'ordre', '  écrire v, cnt[v] fois']],
};
// ---------- les recherches ----------
function* linear(a, t) { for (let i = 0; i < a.length; i++) { yield {line: 1, cmp: [i]}; if (a[i] === t) { yield {line: 2, found: i}; return; } } yield {line: 3, msg: 'absent'}; }
function* binary(a, t) { let lo = 0, hi = a.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; yield {line: 1, range: [lo, hi + 1], cmp: [mid]}; if (a[mid] === t) { yield {line: 2, found: mid}; return; } if (a[mid] < t) lo = mid + 1; else hi = mid - 1; yield {line: a[mid] < t ? 3 : 4, range: [lo, hi + 1]}; } yield {line: 5, msg: 'absent'}; }
const SEARCHES = {
  linear: ['Recherche linéaire', linear, 'O(n)', 'Regarde les cases une par une jusqu\'à trouver. Marche même si le tableau n\'est pas trié.', ['pour i de 0 à n-1', '  regarder a[i]', '  trouvé : renvoyer i', 'absent']],
  binary: ['Recherche dichotomique', binary, 'O(log n)', 'Sur un tableau trié : regarde le milieu, et jette la moitié où la valeur ne peut pas être. 1000 cases ? 10 regards suffisent.', ['tant que bas ≤ haut', '  milieu ← (bas + haut) / 2', '  trouvé : renvoyer milieu', '  trop petit : bas ← milieu + 1', '  trop grand : haut ← milieu - 1', 'absent']],
};
// ---------- les graphes : une grille, des murs, de la boue (coût 5) ----------
const GW = 32, GH = 18;
function* graphSearch(kind, walls, mud, s, t) {
  const N = GW * GH, dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), seen = new Uint8Array(N), cost = i => mud[i] ? 5 : 1;
  const h = i => Math.abs(i % GW - t % GW) + Math.abs(((i / GW) | 0) - ((t / GW) | 0));
  const nb = i => { const x = i % GW, y = (i / GW) | 0, o = []; if (y > 0) o.push(i - GW); if (x < GW - 1) o.push(i + 1); if (y < GH - 1) o.push(i + GW); if (x > 0) o.push(i - 1); return o.filter(j => !walls[j]); };
  let open = [s]; dist[s] = 0; const inOpen = new Uint8Array(N); inOpen[s] = 1;
  while (open.length) {
    let k = 0;
    if (kind === 'dfs') k = open.length - 1;
    else if (kind === 'dijkstra' || kind === 'astar') { let best = Infinity; open.forEach((i, j) => { const f = dist[i] + (kind === 'astar' ? h(i) : 0); if (f < best) { best = f; k = j; } }); }
    const cur = open.splice(k, 1)[0]; inOpen[cur] = 0;
    if (seen[cur]) continue; seen[cur] = 1;
    yield {line: 1, cur, seen, open: inOpen};
    if (cur === t) break;
    for (const j of nb(cur)) {
      if (seen[j]) continue;
      const d = dist[cur] + (kind === 'bfs' || kind === 'dfs' ? 1 : cost(j));
      // DFS empile toujours (la dernière poussée sera la prochaine visitée), les autres ne gardent que le meilleur coût
      if (kind === 'dfs') { dist[j] = d; prev[j] = cur; open.push(j); inOpen[j] = 1; }
      else if (d < dist[j]) { dist[j] = d; prev[j] = cur; if (!inOpen[j]) { open.push(j); inOpen[j] = 1; } }
    }
    yield {line: 3, cur, seen, open: inOpen};
  }
  const path = []; if (seen[t]) for (let i = t; i !== -1; i = prev[i]) path.unshift(i);
  let pc = 0; for (let k = 1; k < path.length; k++) pc += cost(path[k]);
  yield {line: 4, seen, open: inOpen, path, pathCost: pc};
}
const GRAPHS = {
  bfs: ['Parcours en largeur', 'BFS : explore en cercles autour du départ, couche par couche. Trouve le chemin le plus court en nombre de cases, mais ignore la boue.', 'O(V + E)'],
  dfs: ['Parcours en profondeur', 'DFS : fonce dans une direction tant qu\'il peut, et ne revient en arrière que coincé. Trouve un chemin, rarement le plus court.', 'O(V + E)'],
  dijkstra: ['Dijkstra', 'Dijkstra (1956) : explore toujours la case la moins chère depuis le départ. Il tient compte de la boue (coût 5) et trouve le chemin le moins cher.', 'O((V + E) log V)'],
  astar: ['A*', 'A* : comme Dijkstra, mais il ajoute une estimation de la distance restante (Manhattan). Il fonce vers l\'arrivée et visite beaucoup moins de cases, pour le même chemin.', 'O(E) dans les bons cas'],
};
// la course : deux tris sur le même tableau, une étape chacun à la fois ; le premier qui a fini gagne
function sortFrames(algo, arr) {
  const a = arr.slice(), out = [{a: a.slice(), line: -1, nCmp: 0, nWr: 0, sorted: new Set()}]; let cmp = 0, wr = 0, sorted = new Set();
  for (const s of SORTS[algo][1](a)) { if (s.cmp) cmp++; if (s.swap) wr += s.swap.length; if (s.sorted !== undefined) { sorted = new Set(sorted); sorted.add(s.sorted); } out.push({...s, a: a.slice(), nCmp: cmp, nWr: wr, sorted}); if (out.length > 60000) break; }
  out.push({a: a.slice(), line: -1, nCmp: cmp, nWr: wr, sorted: new Set(a.map((_, i) => i)), msg: 'trié !'});
  return out;
}
const raceWinner = (la, lb) => la === lb ? -1 : la < lb ? 0 : 1;
const GCODE = ['ouverts ← {départ}', 'prendre une case ouverte (selon l\'algorithme)', '  arrivée ? terminé', '  ouvrir ses voisines pas encore vues', 'remonter le chemin depuis l\'arrivée'];
export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const { el, toast } = ctx.host;
  ctx.host.addStyle(CSS);
  // vérification : chaque tri trie vraiment, les recherches trouvent, A* et Dijkstra donnent le même coût
  { const r = Array.from({length: 40}, (_, i) => (i * 37 + 11) % 50 + 1), ok = Object.values(SORTS).every(([, f]) => { const a = r.slice(); for (const _ of f(a)); return a.every((v, i) => !i || a[i - 1] <= v); });
    const s = [...r].sort((x, y) => x - y), fl = g => { let last; for (const st of g) last = st; return last; };
    const walls = new Uint8Array(GW * GH), mud = new Uint8Array(GW * GH); for (let y = 0; y < GH - 4; y++) walls[y * GW + 10] = 1; for (let y = 5; y < GH; y++) mud[y * GW + 20] = 1;
    const d = fl(graphSearch('dijkstra', walls, mud, 0, GW * GH - 1)), a = fl(graphSearch('astar', walls, mud, 0, GW * GH - 1));
    const rr = r.slice(0, 30); console.assert(raceWinner(sortFrames('insertion', rr.slice().sort((x, y) => x - y)).length, sortFrames('selection', rr.slice().sort((x, y) => x - y)).length) === 0 && sortFrames('quick', rr).at(-1).a.every((v, i, q) => !i || q[i - 1] <= v), 'algoflow : course');
    console.assert(ok && fl(binary(s, s[17])).found === s.indexOf(s[17]) && fl(linear(r, 999)).msg === 'absent' && d.pathCost === a.pathCost && d.path.length > 0, 'algoflow : tris, recherches, chemins'); }
  let data = null; try { data = await ctx.folder.read('algoflow'); } catch {}
  const st = {mode: data?.mode || 'sort', sort: data?.sort || 'quick', search: data?.search || 'binary', graph: data?.graph || 'astar', race: Array.isArray(data?.race) && data.race.every(k => SORTS[k]) ? data.race : ['bubble', 'quick'], n: data?.n || 48, order: data?.order || 'random', speed: data?.speed || 30};
  let saveT = 0; const save = () => { clearTimeout(saveT); saveT = setTimeout(() => ctx.folder.write('algoflow', {...st, walls: [...walls].join(''), mud: [...mud].join(''), s: gs, t: gt}).catch(() => {}), 500); };
  const walls = new Uint8Array(GW * GH), mud = new Uint8Array(GW * GH); const fits = typeof data?.walls === 'string' && data.walls.length === GW * GH; let gs = fits ? data.s : 2 * GW + 3, gt = fits ? data.t : (GH - 3) * GW + GW - 4;
  if (fits) for (let i = 0; i < GW * GH; i++) { walls[i] = +data.walls[i]; mud[i] = +(data.mud?.[i] || 0); }
  else { for (let y = 3; y < GH - 3; y++) walls[y * GW + 11] = 1; for (let x = 11; x < 24; x++) walls[(GH - 4) * GW + x] = 1; for (let y = 0; y < 9; y++) walls[y * GW + 21] = 1; for (let y = 6; y < GH; y++) for (let x = 24; x < 27; x++) mud[y * GW + x] = 1; }
  // ---------- l'interface ----------
  view.innerHTML = '';
  const wrap = el('div', 'appWrap wide'), head = el('div', 'agHead'), top = el('div', 'afTop'), lay = el('div', 'afGrid'), main = el('div'), side = el('div', 'sysCard px');
  head.append(el('span', 'label', 'AlgoFlow · les algorithmes pas à pas')); lay.append(main, side); wrap.append(head, top, lay); view.append(wrap);
  const can = el('canvas', 'afCan'), g = can.getContext('2d'); can.width = 960; can.height = 540; can.id = 'af_canvas';
  const ctrl = el('div', 'afRow'), opts = el('div', 'afRow'), msg = el('div', 'afMsg'), legend = el('div', 'afLegend');
  main.append(can, msg, ctrl, opts, legend);
  const play = el('button', 'btn px main', '▶'), back = el('button', 'btn px', '◀ Étape'), fwd = el('button', 'btn px', 'Étape ▶'), reset = el('button', 'btn px', '⟲'), end = el('button', 'btn px', '⏭'), speed = el('input', 'afRange');
  play.id = 'af_play'; end.id = 'af_end'; reset.title = 'Revenir au début'; end.title = 'Aller à la fin'; speed.type = 'range'; speed.min = 1; speed.max = 200; speed.value = st.speed; speed.title = 'Vitesse (étapes par seconde)';
  ctrl.append(play, back, fwd, reset, end, el('span', 'hint', 'Vitesse'), speed);
  const title = el('span', 'label'), code = el('div', 'afCode'), stats = el('div', 'afStats'), help = el('p', 'afHelp');
  stats.id = 'af_stats'; side.append(title, code, stats, help);
  let frames = [], fi = 0, playing = false, base = [], raceF = null, mudPen = false;
  // les étapes sont précalculées : chaque image garde le tableau à ce moment-là (ou l'état de la grille)
  function build() {
    playing = false; play.textContent = '▶'; frames = []; fi = 0;
    if (st.mode === 'graph') {
      const gen = graphSearch(st.graph, walls, mud, gs, gt); let n = 0;
      for (const s of gen) { frames.push({line: s.line, seen: s.seen.slice(), open: s.open.slice(), cur: s.cur, path: s.path, pathCost: s.pathCost, visited: s.seen.reduce((a, v) => a + v, 0)}); if (++n > 4000) break; }
    } else if (st.mode === 'race') {
      raceF = st.race.map(k => sortFrames(k, base)); frames = Array.from({length: Math.max(...raceF.map(f => f.length))}, () => ({}));
    } else {
      const a = base.slice(), gen = st.mode === 'sort' ? SORTS[st.sort][1](a) : SEARCHES[st.search][1](a, target);
      let cmp = 0, wr = 0, sorted = new Set(); frames.push({a: a.slice(), line: -1, nCmp: 0, nWr: 0, sorted: new Set()});
      for (const s of gen) { if (s.cmp) cmp++; if (s.swap) wr += s.swap.length; if (s.sorted !== undefined) { sorted = new Set(sorted); sorted.add(s.sorted); } frames.push({...s, a: a.slice(), nCmp: cmp, nWr: wr, sorted}); if (frames.length > 60000) break; }
      if (st.mode === 'sort') frames.push({a: a.slice(), line: -1, nCmp: cmp, nWr: wr, sorted: new Set(a.map((_, i) => i)), msg: 'trié !'});
    }
    drawSide(); draw();
  }
  let target = 0;
  function makeArray() {
    const n = st.n; let a = Array.from({length: n}, (_, i) => Math.round((i + 1) * 100 / n));
    if (st.order === 'random' || st.mode === 'search') for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    if (st.order === 'reversed') a.reverse();
    if (st.order === 'nearly') for (let k = 0; k < Math.max(1, n / 12); k++) { const i = Math.floor(Math.random() * (n - 1)); [a[i], a[i + 1]] = [a[i + 1], a[i]]; }
    if (st.order === 'few') a = a.map(v => Math.ceil(v / 25) * 25);
    if (st.mode === 'search' && st.search === 'binary') a.sort((x, y) => x - y);
    base = a; target = a[Math.floor(Math.random() * a.length)];
  }
  function draw() {
    const f = frames[fi] || {};
    g.fillStyle = '#0b0816'; g.fillRect(0, 0, can.width, can.height);
    if (st.mode === 'graph') {
      const cw = can.width / GW, ch = can.height / GH;
      for (let i = 0; i < GW * GH; i++) {
        const x = (i % GW) * cw, y = ((i / GW) | 0) * ch;
        let c = walls[i] ? C.wall : f.path?.includes(i) ? C.path : i === f.cur ? '#ffffff' : f.open?.[i] ? C.open : f.seen?.[i] ? (mud[i] ? '#4a3a3a' : C.seen) : mud[i] ? C.mud : '#120e22';
        if (i === gs) c = C.start; if (i === gt) c = C.goal;
        g.fillStyle = c; g.fillRect(Math.floor(x), Math.floor(y), Math.ceil(cw) - 1, Math.ceil(ch) - 1);
      }
      const last = frames[frames.length - 1];
      // le message est fait de morceaux séparés pour que NeoDex traduise le texte sans toucher aux nombres
      if (frames.length > 1 && fi === frames.length - 1) msg.replaceChildren(...(last.path?.length ? ['Chemin trouvé :', ' ' + (last.path.length - 1) + ' ', 'pas, coût', ' ' + last.pathCost + ', ' + last.visited + ' ', 'cases visitées.'] : ['Pas de chemin : l\'arrivée est enfermée.']).map(t => el('span', '', t)));
      else msg.textContent = 'Touche : mur (ou boue, selon le bouton) · glisse le départ (vert) ou l\'arrivée (rose).';
    } else if (st.mode === 'race') {
      const half = can.height / 2, lens = raceF.map(r => r.length - 1), win = raceWinner(...lens);
      raceF.forEach((rf, k) => {
        const s = rf[Math.min(fi, rf.length - 1)], a = s.a, n = a.length, bw = can.width / n, mx = Math.max(...a, 1), y0 = k * half, done = fi >= rf.length - 1;
        g.fillStyle = k ? '#0e0a1c' : '#0b0816'; g.fillRect(0, y0, can.width, half);
        for (let i = 0; i < n; i++) {
          let c = s.sorted?.has(i) ? C.done : C.bar;
          if (s.range && (i < s.range[0] || i >= s.range[1])) c = C.dim;
          if (s.pivot?.includes(i)) c = C.pivot; if (s.cmp?.includes(i)) c = C.cmp; if (s.swap?.includes(i)) c = C.swap;
          const h = Math.max(2, Math.round(a[i] / mx * (half - 50)));
          g.fillStyle = c; g.fillRect(Math.floor(i * bw), y0 + half - h, Math.max(1, Math.ceil(bw) - (bw > 4 ? 2 : 0)), h);
        }
        g.font = 'bold 26px monospace'; g.fillStyle = done && win === k ? '#ffd34f' : '#ffffff';
        g.fillText(SORTS[st.race[k]][0] + ' · ' + Math.min(fi, lens[k]) + ' / ' + lens[k] + (done ? (win === k ? '  1er !' : win < 0 ? '  égalité' : '  fini') : ''), 10, y0 + 32);
      });
      g.fillStyle = '#3a2f5a'; g.fillRect(0, half - 1, can.width, 2);
      if (fi >= frames.length - 1) { const w = raceWinner(...lens); msg.replaceChildren(...(w < 0 ? ['Égalité :', ' ' + lens[0] + ' ', 'étapes chacun.'] : [SORTS[st.race[w]][0], ' ', 'gagne :', ' ' + lens[w] + ' ', 'étapes contre', ' ' + lens[1 - w] + '.']).map(t => el('span', '', t))); }
      else msg.replaceChildren(el('span', '', 'Même tableau, une étape chacun à la fois.'));
    } else {
      const a = f.a || base, n = a.length, bw = can.width / n, mx = Math.max(...a, 1);
      const inRange = i => !f.range || (i >= f.range[0] && i < f.range[1]);
      for (let i = 0; i < n; i++) {
        let c = f.sorted?.has(i) ? C.done : C.bar;
        if (!inRange(i)) c = C.dim;
        if (f.pivot?.includes(i)) c = C.pivot; if (f.cmp?.includes(i)) c = C.cmp; if (f.swap?.includes(i)) c = C.swap; if (f.found === i) c = C.done;
        const h = Math.max(2, Math.round(a[i] / mx * (can.height - 26)));
        g.fillStyle = c; g.fillRect(Math.floor(i * bw), can.height - h, Math.max(1, Math.ceil(bw) - (bw > 4 ? 2 : 0)), h);
        if (st.mode === 'search' && bw >= 22) { g.fillStyle = '#fff'; g.font = '16px monospace'; g.fillText(String(a[i]), Math.floor(i * bw) + 1, can.height - h - 4); }
      }
      const parts = st.mode === 'search' ? ['Valeur cherchée :', ' ' + target + ' ', ...(f.found !== undefined ? ['— trouvée à la case', ' ' + f.found] : f.msg === 'absent' ? ['— absente.'] : [])] : f.msg?.startsWith('écart') ? ['écart', f.msg.slice(5)] : f.msg ? [f.msg] : [];
      msg.replaceChildren(...parts.map(t => el('span', '', t)));
    }
    for (const [i, d] of [...code.children].entries()) d.classList.toggle('on', i === f.line);
    stats.replaceChildren();
    const add = (k, v) => { const s = el('span', '', k + ' '); s.append(el('b', '', String(v))); stats.append(s); };
    add('Étape', fi + ' / ' + (frames.length - 1));
    if (st.mode === 'graph') { add('Cases vues', f.visited ?? 0); add('Chemin', f.path?.length ? (f.path.length - 1) + ' pas' : '—'); }
    else if (st.mode === 'race') raceF.forEach((rf, k) => { const s = rf[Math.min(fi, rf.length - 1)]; add(SORTS[st.race[k]][0], s.nCmp + ' / ' + s.nWr); });
    else { add('Comparaisons', f.nCmp ?? 0); add(st.mode === 'sort' ? 'Écritures' : 'Taille', st.mode === 'sort' ? f.nWr ?? 0 : base.length); }
  }
  function drawTop() {
    top.replaceChildren(...[['sort', 'Tris'], ['race', 'Course'], ['search', 'Recherche'], ['graph', 'Graphes']].map(([k, t]) => { const b = el('button', 'btn px' + (st.mode === k ? ' main' : ''), t); b.dataset.mode = k; b.onclick = () => { st.mode = k; save(); drawTop(); drawOpts(); makeArray(); build(); }; return b; }));
  }
  function drawOpts() {
    opts.replaceChildren(); legend.replaceChildren();
    const list = st.mode === 'sort' ? SORTS : st.mode === 'search' ? SEARCHES : GRAPHS, key = st.mode;
    if (st.mode === 'race') for (const k of [0, 1]) {  // deux rangées : le tri du haut et celui du bas
      const row = el('div', 'afRow'); row.append(el('span', 'hint', k ? 'En bas' : 'En haut'));
      for (const [a, v] of Object.entries(SORTS)) { const b = el('button', 'btn px' + (st.race[k] === a ? ' main' : ''), v[0]); b.dataset.race = k + a; b.onclick = () => { st.race[k] = a; save(); drawOpts(); build(); }; row.append(b); }
      opts.append(row);
    }
    else for (const [k, v] of Object.entries(list)) { const b = el('button', 'btn px' + (st[key] === k ? ' main' : ''), v[0]); b.dataset.algo = k; b.onclick = () => { st[key] = k; save(); drawOpts(); if (st.mode === 'search') makeArray(); build(); }; opts.append(b); }
    if (st.mode !== 'graph') {
      const n = el('input', 'afRange'); n.type = 'range'; n.min = 8; n.max = 160; n.value = st.n; n.title = 'Nombre d\'éléments'; n.onchange = () => { st.n = +n.value; save(); makeArray(); build(); };
      const row = el('div', 'afRow'); row.append(el('span', 'hint', 'Éléments'), n);
      if (st.mode !== 'search') for (const [k, t] of [['random', 'Au hasard'], ['nearly', 'Presque trié'], ['reversed', 'À l\'envers'], ['few', 'Peu de valeurs']]) { const b = el('button', 'btn px' + (st.order === k ? ' main' : ''), t); b.onclick = () => { st.order = k; save(); drawOpts(); makeArray(); build(); }; row.append(b); }
      const nw = el('button', 'btn px', 'Nouveau tableau'); nw.onclick = () => { makeArray(); build(); }; row.append(nw);
      opts.after(row); opts._row?.remove(); opts._row = row;
      for (const [c, t] of [[C.cmp, 'comparés'], [C.swap, 'écrits'], [C.pivot, 'pivot / minimum'], [C.done, 'à sa place'], [C.dim, 'hors de la zone']]) { const i = el('i'); i.style.background = c; legend.append(i, t); }
    } else {
      opts._row?.remove(); opts._row = null;
      const clr = el('button', 'btn px', 'Effacer les murs'), maze = el('button', 'btn px', 'Labyrinthe');
      clr.onclick = () => { walls.fill(0); mud.fill(0); save(); build(); }; maze.onclick = () => { genMaze(); save(); build(); };
      // téléphone : un bouton choisit ce que pose le doigt (sur PC : Maj + clic pour la boue)
      const pen = el('button', 'btn px' + (mudPen ? ' main' : ''), mudPen ? 'Le doigt pose : boue' : 'Le doigt pose : murs'); pen.onclick = () => { mudPen = !mudPen; drawOpts(); };
      opts.append(clr, maze, pen);
      for (const [c, t] of [[C.start, 'départ'], [C.goal, 'arrivée'], [C.open, 'à explorer'], [C.seen, 'vues'], [C.mud, 'boue (coût 5)'], [C.path, 'chemin']]) { const i = el('i'); i.style.background = c; legend.append(i, t); }
    }
  }
  function drawSide() {
    if (st.mode === 'graph') { const [n, d, cx] = GRAPHS[st.graph]; title.textContent = n; code.replaceChildren(...GCODE.map(l => el('div', '', l))); help.innerHTML = ''; help.append(d, el('br'), 'Complexité : ', el('b', '', cx)); }
    else if (st.mode === 'sort') { const [n, , t, m, d, lines] = SORTS[st.sort]; title.textContent = n; code.replaceChildren(...lines.map(l => el('div', '', l))); help.innerHTML = ''; help.append(d, el('br'), 'Temps : ', el('b', '', t), ' · mémoire : ', el('b', '', m)); }
    else if (st.mode === 'race') { title.textContent = 'Course de tris'; code.replaceChildren(...st.race.map(k => el('div', '', SORTS[k][0] + ' : ' + SORTS[k][2]))); help.innerHTML = ''; help.append('Les deux tris rangent le même tableau, une étape (une comparaison ou une écriture) chacun à la fois. Le premier qui a fini gagne.', el('br'), 'Chiffres : comparaisons / écritures.'); }
    else { const [n, , t, d, lines] = SEARCHES[st.search]; title.textContent = n; code.replaceChildren(...lines.map(l => el('div', '', l))); help.innerHTML = ''; help.append(d, el('br'), 'Temps : ', el('b', '', t)); }
  }
  function genMaze() {  // labyrinthe parfait par exploration aléatoire, sur les cases impaires
    walls.fill(1); mud.fill(0); const st2 = [[1, 1]]; walls[GW + 1] = 0;
    while (st2.length) { const [x, y] = st2[st2.length - 1], d = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dy]) => x + dx > 0 && x + dx < GW - 1 && y + dy > 0 && y + dy < GH - 1 && walls[(y + dy) * GW + x + dx]);
      if (!d.length) { st2.pop(); continue; } const [dx, dy] = d[Math.floor(Math.random() * d.length)]; walls[(y + dy / 2) * GW + x + dx / 2] = 0; walls[(y + dy) * GW + x + dx] = 0; st2.push([x + dx, y + dy]); }
    gs = GW + 1; gt = (GH - 3) * GW + GW - 3; walls[gt] = 0; for (let k = 0; k < 40; k++) { const i = Math.floor(Math.random() * GW * GH); if (walls[i] && i % GW > 0 && i % GW < GW - 1 && i > GW && i < GW * (GH - 1)) walls[i] = 0; }  // quelques murs en moins : plusieurs chemins
  }
  // la souris sur la grille : murs, boue, départ et arrivée
  let drag = null;
  const cellAt = e => { const r = can.getBoundingClientRect(); const x = Math.floor((e.clientX - r.left) / r.width * GW), y = Math.floor((e.clientY - r.top) / r.height * GH); return x >= 0 && y >= 0 && x < GW && y < GH ? y * GW + x : -1; };
  can.onpointerdown = e => { if (st.mode !== 'graph') return; const i = cellAt(e); if (i < 0) return; can.setPointerCapture(e.pointerId);
    drag = i === gs ? 's' : i === gt ? 't' : (e.shiftKey || mudPen) ? (mud[i] ? 'unmud' : 'mud') : walls[i] ? 'erase' : 'wall'; paint(i); };
  can.onpointermove = e => { if (drag) { const i = cellAt(e); if (i >= 0) paint(i); } };
  can.onpointerup = () => { if (drag) { drag = null; save(); build(); } };
  function paint(i) {
    if (drag === 's' || drag === 't') { if (!walls[i] && i !== (drag === 's' ? gt : gs)) { if (drag === 's') gs = i; else gt = i; } }
    else if (i !== gs && i !== gt) { if (drag === 'wall') { walls[i] = 1; mud[i] = 0; } else if (drag === 'erase') walls[i] = 0; else if (drag === 'mud') { mud[i] = 1; walls[i] = 0; } else mud[i] = 0; }
    frames = [{}]; fi = 0; draw();
  }
  // le lecteur
  let acc = 0, lastT = 0;
  function loop(t) { if (!playing) return; if (t && lastT) { acc += (t - lastT) / 1000 * st.speed; while (acc >= 1 && fi < frames.length - 1) { fi++; acc--; } } lastT = t || 0; draw(); if (fi >= frames.length - 1) { playing = false; play.textContent = '▶'; return; } requestAnimationFrame(loop); }
  play.onclick = () => { if (fi >= frames.length - 1) fi = 0; playing = !playing; play.textContent = playing ? '❚❚' : '▶'; lastT = 0; acc = 0; if (playing) requestAnimationFrame(loop); };
  back.onclick = () => { playing = false; play.textContent = '▶'; fi = Math.max(0, fi - 1); draw(); };
  fwd.onclick = () => { playing = false; play.textContent = '▶'; fi = Math.min(frames.length - 1, fi + 1); draw(); };
  reset.onclick = () => { playing = false; play.textContent = '▶'; fi = 0; draw(); };
  end.onclick = () => { playing = false; play.textContent = '▶'; fi = frames.length - 1; draw(); };
  speed.oninput = () => { st.speed = +speed.value; save(); };
  ctx.onClose?.(() => { playing = false; });
  drawTop(); drawOpts(); makeArray(); build();
}
