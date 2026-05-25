/* ==========================================================================
   BIOSYNTH // SANDBOX ENGINE (2D MOLECULAR BUILDER & ANALYZER)
   ========================================================================== */

const BioSynthSandbox = {
    canvas: null,
    ctx: null,
    atoms: [],
    bonds: [],
    
    // Editor State
    currentAtom: 'C',
    currentBondOrder: 1,
    isEraserActive: false,
    
    // Interactions
    selectedAtomIndex: null,
    hoveredAtomIndex: null,
    dragStartAtomIndex: null,
    isDragging: false,
    mousePos: { x: 0, y: 0 },
    
    // Element Configurations
    elements: {
        C: { name: 'Carbon', weight: 12.011, valency: 4, color: '#00ff66', radius: 14 },
        N: { name: 'Nitrogen', weight: 14.007, valency: 3, color: '#0088ff', radius: 14 },
        O: { name: 'Oxygen', weight: 15.999, valency: 2, color: '#ff3b30', radius: 14 },
        F: { name: 'Fluorine', weight: 18.998, valency: 1, color: '#bf5af2', radius: 12 },
        Cl: { name: 'Chlorine', weight: 35.45, valency: 1, color: '#ffd60a', radius: 16 },
        S: { name: 'Sulfur', weight: 32.06, valency: 2, color: '#ff9f0a', radius: 16 }
    },
    
    GRID_SIZE: 30,
    SNAP_RADIUS: 15,

    init() {
        this.canvas = document.getElementById('sandbox-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Register Event Listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        this.setupToolbar();
        this.clear();
        this.draw();
    },

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height || 350;
        this.draw();
    },

    setupToolbar() {
        // Atom Selection
        const atomButtons = document.querySelectorAll('.atom-btn');
        atomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                atomButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentAtom = btn.getAttribute('data-atom');
                this.isEraserActive = false;
                document.getElementById('btn-eraser').classList.remove('active');
            });
        });

        // Bond Style
        const bondSingle = document.getElementById('bond-single');
        const bondDouble = document.getElementById('bond-double');
        const btnEraser = document.getElementById('btn-eraser');
        
        bondSingle.addEventListener('click', () => {
            bondSingle.classList.add('active');
            bondDouble.classList.remove('active');
            btnEraser.classList.remove('active');
            this.currentBondOrder = 1;
            this.isEraserActive = false;
        });

        bondDouble.addEventListener('click', () => {
            bondDouble.classList.add('active');
            bondSingle.classList.remove('active');
            btnEraser.classList.remove('active');
            this.currentBondOrder = 2;
            this.isEraserActive = false;
        });

        btnEraser.addEventListener('click', () => {
            btnEraser.classList.add('active');
            bondSingle.classList.remove('active');
            bondDouble.classList.remove('active');
            this.isEraserActive = true;
        });

        // Clear Sandbox
        document.getElementById('btn-clear-sandbox').addEventListener('click', () => {
            this.clear();
        });
    },

    clear() {
        this.atoms = [];
        this.bonds = [];
        this.selectedAtomIndex = null;
        this.hoveredAtomIndex = null;
        this.dragStartAtomIndex = null;
        this.isDragging = false;
        
        this.draw();
        this.analyze();
    },

    // --- INTERACTION LOGIC ---

    getMouseCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    findAtomAtCoords(coords) {
        for (let i = 0; i < this.atoms.length; i++) {
            const atom = this.atoms[i];
            const dist = Math.hypot(atom.x - coords.x, atom.y - coords.y);
            const radius = this.elements[atom.element].radius;
            if (dist <= radius + 10) {
                return i;
            }
        }
        return null;
    },

    handleMouseDown(e) {
        const coords = this.getMouseCoords(e);
        const clickedAtomIndex = this.findAtomAtCoords(coords);
        
        if (this.isEraserActive) {
            if (clickedAtomIndex !== null) {
                this.deleteAtom(clickedAtomIndex);
            }
            return;
        }

        if (clickedAtomIndex !== null) {
            // Clicked existing atom - start dragging bond
            this.selectedAtomIndex = clickedAtomIndex;
            this.dragStartAtomIndex = clickedAtomIndex;
            this.isDragging = true;
        } else {
            // Clicked empty canvas - create atom
            const snapped = this.snapToGrid(coords);
            const newId = this.atoms.length > 0 ? Math.max(...this.atoms.map(a => a.id)) + 1 : 0;
            const newAtom = {
                id: newId,
                x: snapped.x,
                y: snapped.y,
                element: this.currentAtom
            };
            this.atoms.push(newAtom);
            
            // If an atom was previously selected, bond them!
            if (this.selectedAtomIndex !== null) {
                this.addBond(this.selectedAtomIndex, this.atoms.length - 1, this.currentBondOrder);
            }
            
            this.selectedAtomIndex = this.atoms.length - 1;
            this.draw();
            this.analyze();
        }
    },

    handleMouseMove(e) {
        this.mousePos = this.getMouseCoords(e);
        this.hoveredAtomIndex = this.findAtomAtCoords(this.mousePos);
        
        if (this.isDragging && this.dragStartAtomIndex !== null) {
            this.draw();
            // Draw temporary dragging bond line
            const startAtom = this.atoms[this.dragStartAtomIndex];
            this.ctx.beginPath();
            this.ctx.moveTo(startAtom.x, startAtom.y);
            this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
            this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        } else {
            this.draw();
        }
    },

    handleMouseUp(e) {
        if (this.isDragging && this.dragStartAtomIndex !== null) {
            const coords = this.getMouseCoords(e);
            const releaseAtomIndex = this.findAtomAtCoords(coords);
            
            if (releaseAtomIndex !== null && releaseAtomIndex !== this.dragStartAtomIndex) {
                // Dragged to a different existing atom - add bond
                this.addBond(this.dragStartAtomIndex, releaseAtomIndex, this.currentBondOrder);
                this.selectedAtomIndex = releaseAtomIndex;
            } else if (releaseAtomIndex === null) {
                // Dragged and released on empty space - create atom and bond it!
                const snapped = this.snapToGrid(coords);
                const startAtom = this.atoms[this.dragStartAtomIndex];
                
                // Don't place on top of start atom
                if (Math.hypot(startAtom.x - snapped.x, startAtom.y - snapped.y) > 20) {
                    const newId = this.atoms.length > 0 ? Math.max(...this.atoms.map(a => a.id)) + 1 : 0;
                    const newAtom = {
                        id: newId,
                        x: snapped.x,
                        y: snapped.y,
                        element: this.currentAtom
                    };
                    this.atoms.push(newAtom);
                    this.addBond(this.dragStartAtomIndex, this.atoms.length - 1, this.currentBondOrder);
                    this.selectedAtomIndex = this.atoms.length - 1;
                }
            }
        }
        
        this.isDragging = false;
        this.dragStartAtomIndex = null;
        this.draw();
        this.analyze();
    },

    handleMouseLeave() {
        this.isDragging = false;
        this.dragStartAtomIndex = null;
        this.hoveredAtomIndex = null;
        this.draw();
    },

    snapToGrid(coords) {
        const snapX = Math.round(coords.x / this.GRID_SIZE) * this.GRID_SIZE;
        const snapY = Math.round(coords.y / this.GRID_SIZE) * this.GRID_SIZE;
        return { x: snapX, y: snapY };
    },

    // --- CHEMICAL CONTEXT UTILS ---

    addBond(idx1, idx2, order) {
        const id1 = this.atoms[idx1].id;
        const id2 = this.atoms[idx2].id;
        
        // Check if bond already exists
        const existingBondIndex = this.bonds.findIndex(b => 
            (b.atom1 === id1 && b.atom2 === id2) || (b.atom1 === id2 && b.atom2 === id1)
        );
        
        if (existingBondIndex !== -1) {
            // Update bond order if clicked again
            this.bonds[existingBondIndex].order = order;
        } else {
            this.bonds.push({ atom1: id1, atom2: id2, order: order });
        }
    },

    deleteAtom(idx) {
        const id = this.atoms[idx].id;
        // Delete bonds
        this.bonds = this.bonds.filter(b => b.atom1 !== id && b.atom2 !== id);
        // Delete atom
        this.atoms.splice(idx, 1);
        this.selectedAtomIndex = null;
        this.draw();
        this.analyze();
    },

    // --- CANVAS RENDERING ENGINE ---

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(0, 255, 102, 0.02)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += this.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw Bonds
        this.bonds.forEach(bond => {
            const atom1 = this.atoms.find(a => a.id === bond.atom1);
            const atom2 = this.atoms.find(a => a.id === bond.atom2);
            if (atom1 && atom2) {
                this.drawBondLine(atom1.x, atom1.y, atom2.x, atom2.y, bond.order);
            }
        });

        // Draw Atoms
        this.atoms.forEach((atom, idx) => {
            const cfg = this.elements[atom.element];
            const isHovered = idx === this.hoveredAtomIndex;
            const isSelected = idx === this.selectedAtomIndex;
            
            // Outer glow for active/hover states
            if (isSelected || isHovered) {
                this.ctx.beginPath();
                this.ctx.arc(atom.x, atom.y, cfg.radius + 6, 0, 2 * Math.PI);
                this.ctx.strokeStyle = isSelected ? varColor('--primary-green-glow') : 'rgba(255,255,255,0.15)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            // Atom Circle
            this.ctx.beginPath();
            this.ctx.arc(atom.x, atom.y, cfg.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#0f1420';
            this.ctx.fill();
            this.ctx.strokeStyle = cfg.color;
            this.ctx.lineWidth = isHovered ? 3 : 2;
            this.ctx.stroke();

            // Label text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `bold ${cfg.radius + 1}px 'Space Grotesk', sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(atom.element, atom.x, atom.y);
        });
    },

    drawBondLine(x1, y1, x2, y2, order) {
        this.ctx.strokeStyle = '#8a99ad';
        this.ctx.lineWidth = 3;
        
        if (order === 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else if (order === 2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy);
            
            // Offset vector perpendicular to bond line
            const ox = (-dy / len) * 4;
            const oy = (dx / len) * 4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1 + ox, y1 + oy);
            this.ctx.lineTo(x2 + ox, y2 + oy);
            this.ctx.moveTo(x1 - ox, y1 - oy);
            this.ctx.lineTo(x2 - ox, y2 - oy);
            this.ctx.stroke();
        }
    },

    // --- BIO-TELEMETRY & LIPINSKI ENGINE ---

    analyze() {
        if (this.atoms.length === 0) {
            this.updateUI(0, '-', 0, 0, 0, 0, { pass: true, count: 4 });
            return;
        }

        // 1. Calculate implicit hydrogens and molecular weights
        let totalWeight = 0;
        let hydrogenCount = 0;
        let hbd = 0; // H-Bond Donors
        let hba = 0; // H-Bond Acceptors
        let formulaCounts = {};

        // Track bonds per atom
        const atomValencies = this.atoms.map(atom => {
            const connections = this.bonds.filter(b => b.atom1 === atom.id || b.atom2 === atom.id);
            const bondedSum = connections.reduce((sum, b) => sum + b.order, 0);
            const standardValency = this.elements[atom.element].valency;
            const hydrogens = Math.max(0, standardValency - bondedSum);
            
            hydrogenCount += hydrogens;
            
            // HBD calculation: any Hydrogen attached to N, O
            if (atom.element === 'N' || atom.element === 'O') {
                hbd += hydrogens;
            }
            
            // HBA calculation: all N, O, F atoms in the molecule
            if (atom.element === 'N' || atom.element === 'O' || atom.element === 'F') {
                hba += 1;
            }

            return {
                id: atom.id,
                element: atom.element,
                hydrogens: hydrogens
            };
        });

        // Sum atom weights
        this.atoms.forEach(atom => {
            totalWeight += this.elements[atom.element].weight;
            formulaCounts[atom.element] = (formulaCounts[atom.element] || 0) + 1;
        });
        
        // Add Hydrogens to weight
        totalWeight += hydrogenCount * 1.008;
        if (hydrogenCount > 0) {
            formulaCounts['H'] = hydrogenCount;
        }

        // 2. Generate chemical formula string (Hill System: C, then H, then alphabetical)
        let formula = '';
        if (formulaCounts['C']) {
            formula += `C${formulaCounts['C'] > 1 ? formulaCounts['C'] : ''}`;
        }
        if (formulaCounts['H']) {
            formula += `H${formulaCounts['H'] > 1 ? formulaCounts['H'] : ''}`;
        }
        
        Object.keys(formulaCounts)
            .filter(el => el !== 'C' && el !== 'H')
            .sort()
            .forEach(el => {
                formula += `${el}${formulaCounts[el] > 1 ? formulaCounts[el] : ''}`;
            });

        // 3. Estimate LogP (Empirical fragment-based scoring)
        let estLogP = 0.0;
        this.atoms.forEach(atom => {
            if (atom.element === 'C') estLogP += 0.45;
            if (atom.element === 'F') estLogP += 0.20;
            if (atom.element === 'Cl') estLogP += 0.75;
            if (atom.element === 'O') estLogP -= 0.40;
            if (atom.element === 'N') estLogP -= 0.35;
            if (atom.element === 'S') estLogP += 0.15;
        });
        estLogP += hydrogenCount * 0.08;
        
        // Ring compensation (if cyclic, reduce LogP slightly for entropy)
        const isCyclic = this.atoms.length > 2 && this.bonds.length >= this.atoms.length;
        if (isCyclic) {
            estLogP -= 0.25;
        }

        // 4. Calculate Rotatable Bonds (single bonds not terminal)
        let rotatableBonds = 0;
        this.bonds.forEach(bond => {
            if (bond.order === 1) {
                // Find atomic elements
                const a1 = this.atoms.find(a => a.id === bond.atom1);
                const a2 = this.atoms.find(a => a.id === bond.atom2);
                if (a1 && a2) {
                    // Check if both atoms connect to other things (not terminal)
                    const conn1 = this.bonds.filter(b => b.atom1 === a1.id || b.atom2 === a1.id).length;
                    const conn2 = this.bonds.filter(b => b.atom1 === a2.id || b.atom2 === a2.id).length;
                    if (conn1 > 1 && conn2 > 1) {
                        rotatableBonds++;
                    }
                }
            }
        });

        // 5. Lipinski Verdict
        let failedCount = 0;
        if (totalWeight > 500) failedCount++;
        if (estLogP > 5.0) failedCount++;
        if (hbd > 5) failedCount++;
        if (hba > 10) failedCount++;
        
        const lipinskiScore = {
            pass: failedCount === 0,
            count: 4 - failedCount
        };

        this.updateUI(totalWeight, formula, estLogP, rotatableBonds, hbd, hba, lipinskiScore);
    },

    updateUI(mw, formula, logp, rotb, hbd, hba, score) {
        document.getElementById('tel-mw').innerHTML = `${mw.toFixed(2)} <span class="unit">g/mol</span>`;
        document.getElementById('tel-formula').innerText = formula;
        document.getElementById('tel-logp').innerText = logp.toFixed(2);
        document.getElementById('tel-rotb').innerText = rotb;

        // Dynamic elements for Lipinski bars
        this.updateRuleBar('rule-mw', 'val-mw', mw, 500, `${mw.toFixed(0)} Da`);
        this.updateRuleBar('rule-logp', 'val-logp', logp, 5.0, logp.toFixed(1));
        this.updateRuleBar('rule-hbd', 'val-hbd', hbd, 5, hbd.toString());
        this.updateRuleBar('rule-hba', 'val-hba', hba, 10, hba.toString());

        // Update Docking panel descriptor in parent scope
        const dockLigandDesc = document.getElementById('dock-ligand-val');
        if (dockLigandDesc) {
            dockLigandDesc.innerText = this.atoms.length > 0 
                ? `Sandbox: ${formula} (${this.atoms.length} atoms)` 
                : 'Sandbox Sketch (0 atoms)';
        }

        // Verdict Badge
        const verdict = document.getElementById('lipinski-verdict');
        if (score.pass) {
            verdict.className = 'score-badge pass';
            verdict.innerText = `PASS (${score.count}/4)`;
        } else {
            verdict.className = 'score-badge fail';
            verdict.innerText = `FAIL (${score.count}/4)`;
        }
    },

    updateRuleBar(itemId, valId, val, max, label) {
        const item = document.getElementById(itemId);
        const valueElement = document.getElementById(valId);
        const fill = item.querySelector('.rule-fill');
        
        valueElement.innerText = label;
        
        let percentage = (val / max) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        
        fill.style.width = `${percentage}%`;

        if (val > max) {
            item.classList.add('violation');
        } else {
            item.classList.remove('violation');
        }
    },

    /**
     * Helper to import an external compound coordinates into 2D canvas
     * Generates a circular/ring coordinate mapping for PubChem search imports
     */
    importStructure(sdfText) {
        this.clear();
        if (!sdfText) return;
        
        // Simple SDF parser for atoms and bonds
        const lines = sdfText.split('\n');
        let atomCount = 0;
        let bondCount = 0;
        let lineIdx = 3; // SDF starts atom counts on line 4 (0-indexed 3)
        
        if (lines.length < 5) return;
        
        const countsLine = lines[3];
        atomCount = parseInt(countsLine.substring(0, 3).trim());
        bondCount = parseInt(countsLine.substring(3, 6).trim());
        
        const tempAtoms = [];
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        // Parse Atoms
        for (let i = 0; i < atomCount; i++) {
            const line = lines[4 + i];
            if (!line) continue;
            
            const x = parseFloat(line.substring(0, 10).trim());
            const y = parseFloat(line.substring(10, 20).trim());
            const symbol = line.substring(31, 34).trim();
            
            // Check if symbol is in our supported palette, default to Carbon
            const finalSymbol = this.elements[symbol] ? symbol : 'C';
            
            tempAtoms.push({
                id: i,
                x: x,
                y: y,
                element: finalSymbol
            });
            
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        // Center and scale atoms to fit beautifully in canvas
        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;
        const sdfWidth = maxX - minX || 1;
        const sdfHeight = maxY - minY || 1;
        
        const scale = Math.min(
            (this.canvas.width - 100) / sdfWidth, 
            (this.canvas.height - 100) / sdfHeight, 
            40 // Upper scale cap
        );

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        this.atoms = tempAtoms.map(atom => {
            const screenX = canvasCenterX + (atom.x - midX) * scale;
            const screenY = canvasCenterY - (atom.y - midY) * scale; // Flip Y coordinates
            const snapped = this.snapToGrid({ x: screenX, y: screenY });
            
            return {
                id: atom.id,
                x: snapped.x,
                y: snapped.y,
                element: atom.element
            };
        });

        // Parse Bonds
        const startBondLine = 4 + atomCount;
        for (let j = 0; j < bondCount; j++) {
            const line = lines[startBondLine + j];
            if (!line) continue;
            
            const a1 = parseInt(line.substring(0, 3).trim()) - 1;
            const a2 = parseInt(line.substring(3, 6).trim()) - 1;
            const order = parseInt(line.substring(6, 9).trim());
            
            const cleanOrder = (order === 2) ? 2 : 1;
            
            if (a1 >= 0 && a1 < atomCount && a2 >= 0 && a2 < atomCount) {
                this.bonds.push({
                    atom1: a1,
                    atom2: a2,
                    order: cleanOrder
                });
            }
        }
        
        this.selectedAtomIndex = this.atoms.length > 0 ? this.atoms.length - 1 : null;
        this.draw();
        this.analyze();
    }
};

// CSS helper for javascript colors
function varColor(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

// Make it globally accessible
window.BioSynthSandbox = BioSynthSandbox;
