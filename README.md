
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
