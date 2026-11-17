# AlgoFlow

Watch algorithms work, step by step: bars light up when they are compared or moved, the pseudo-code follows line by line, and counters tell how much work each method needed.

*Version française : [README.md](README.md)*

![AlgoFlow](screenshots/1.jpg)

## Phone version

- Same screen as on PC, in one column.
- In Graphs, the **Your finger places: walls / mud** button replaces Shift + click: tap the grid to place walls or mud.
- Same settings as on PC (same id `neodex.algoflow`).

## Sorts

8 sorts: bubble, insertion, selection, merge, quick, heap, Shell, counting. Choose the number of elements (8 to 160) and the start: **random**, **nearly sorted**, **reversed** or **few values**. That's where differences really show: insertion sort flies on a nearly sorted array, quicksort struggles on a reversed one.

Colours: yellow = compared, pink = written, blue = pivot or minimum, green = in place, grey = outside the current range.

## Search

**Linear** search (cell by cell) and **binary** search (on a sorted array, cut in half at each look). The searched value is picked at random; **New array** picks another.

## Graphs

A 40 × 24 grid you draw: **click** for a wall, **Shift+click** for mud (cost 5), drag the start (green) or the goal (pink). **Maze** generates one. Then compare the 4 traversals: **breadth-first**, **depth-first**, **Dijkstra** (takes mud into account) and **A\*** (like Dijkstra, but it aims at the goal and visits fewer cells).

## The player

**▶** runs, **◀ Step / Step ▶** go one step back or forward, **⟲** goes back to the start, **⏭** goes to the end. The slider sets the speed (1 to 200 steps per second). Alongside: the pseudo-code with the current line, the counters (comparisons, writes, cells seen), the explanation and the complexity.

## Data

The chosen algorithm, the speed and the drawn grid are kept in the plugin folder. Permission: `storage` only.

## Version 1.1.0

- Larger text, pseudo-code and counters; the graph grid has bigger cells (32 × 18); the app uses the full width.
- New **Race** mode: two sorts work on the same array side by side (one on top, one below), one step each at a time; the first to finish wins.
