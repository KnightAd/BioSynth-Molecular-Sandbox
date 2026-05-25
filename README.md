# 🧬 BioSynth: Molecular Sandbox & Drug Discovery Dashboard

BioSynth is a premium, high-fidelity scientific web dashboard designed to simulate biological drug discovery processes. Built entirely on standard browser WebGL, HTML5, CSS3, and ES6+ Javascript, it delivers an immersive, dark neon-laboratory dashboard experience with zero compile dependencies.

---

## 🚀 Key Features

1. **3D WebGL Molecular Viewer**
   * Uses **3Dmol.js** to render protein structures dynamically fetched from the **RCSB Protein Data Bank (PDB)**.
   * Toggle between representation styles: **Cartoons (Ribbons)**, **Sticks**, or **Spheres**.
   * Camera controls: Left Click + Drag (Rotate), Right Click + Drag (Pan), Scroll Wheel (Zoom).
   * Fully responsive coordinate projections, centering, and camera reset controls.

2. **2D Sandbox Sketcher**
   * An interactive HTML5 canvas allowing organic chemists to design small molecule compounds.
   * Draw carbon, nitrogen, oxygen, fluorine, chlorine, and sulfur atoms with single or double bonds.
   * Grid snap guidelines, an eraser tool, and full canvas wipe buttons.

3. **Dynamic Bio-Telemetry**
   * Computes molecular weight, empirical formula, rotatable bonds, and estimated octanol-water partition coefficients ($LogP$) on the fly.
   * **Lipinski's Rule of 5 Analyzer**: Monitors four primary oral drug bioavailability thresholds in real-time, mapping dynamic properties into custom progress bars and highlighting status violations.

4. **Autodock Terminal Simulation**
   * Configures docking parameters (search grid box and simulation runs).
   * Triggers a highly visual, terminal-based simulation flow featuring matrix-scanning logs, sound animations, and a randomized DNA nucleotide sequence alignment progress bar.
   * **Thermodynamic Equations**: Computes the actual binding affinity (Gibbs Free Energy $\Delta G$ in kcal/mol) based on drawn compound features, and evaluates the exact physical Inhibitory Constant ($K_i$) using:
     $$K_i = e^{\frac{\Delta G}{RT}}$$
   * On completion, overlays the ligand directly inside the catalytic active site of the receptor (e.g. ASP-25 and ASP-125 of HIV-1 Protease), drawing dotted cyan hydrogen bonds with distance calculations.

5. **Clinical Database Registry**
   * Queries the **NIH PubChem REST API** directly from the browser (no keys required).
   * Pulls chemical formulas, IUPAC names, molecular specifications, and pharmacodynamic synopses for commercial drugs (e.g. *Aspirin*, *Imatinib*, *Ibuprofen*, *Remdesivir*).
   * Direct actions: **Load Compound into Sandbox** (imports 2D coordinates to canvas) or **Load 3D Ligand Geometry** (renders ligand structure alone in the WebGL context).

---

## 🛠️ Technology Stack

* **Structure**: HTML5
* **Styling**: Custom CSS3 utilizing CSS Grid, backdrop-filter glassmorphism, glowing typography, neon borders, and skew animations.
* **Logic**: Vanilla ES6+ Javascript (no bundlers or node_modules required).
* **Libraries via CDN**:
  * **3Dmol.js**: high-performance, object-oriented WebGL molecular modeler.
  * **jQuery**: required runtime handler for 3Dmol.js.
  * **Lucide Icons**: vector iconography.

---

## 📁 Project Structure

```
biosynth-dashboard/
├── index.html          # HTML dashboard grid panels and CDNs
├── styles.css          # Sci-fi color variables, glass controls, animations
├── js/
│   ├── app.js          # Bootloader, WebGL setup, event hooks, telemetry loops
│   ├── database.js     # PubChem and RCSB PDB REST clients
│   ├── sandbox.js      # 2D canvas sketcher and Lipinski math engine
│   └── docking.js      # Docking simulator terminal, score calculator, 3D complex overlays
└── README.md           # Documentation
```

---

## 🏁 How to Run

1. Open a terminal or file explorer and locate the project directory.
2. Double-click `index.html` to open the application directly in any modern WebGL-compatible browser (Chrome, Edge, Firefox, Safari).
3. Ensure you have an internet connection to fetch protein models and PubChem records dynamically.
