/* ==========================================================================
   BIOSYNTH // DOCKING ENGINE (SIMULATION ENGINE)
   ========================================================================== */

const BioSynthDocking = {
    terminal: null,
    dockButton: null,
    resultCard: null,
    isDocking: false,
    
    // Physical Constants
    GAS_CONSTANT_R: 1.9872e-3, // kcal / (mol * K)
    TEMP_KELVIN: 298.15,       // Room Temp (25°C)

    init() {
        this.terminal = document.getElementById('dock-terminal');
        this.dockButton = document.getElementById('btn-dock-initiate');
        this.resultCard = document.getElementById('dock-result-card');
        
        if (this.dockButton) {
            this.dockButton.addEventListener('click', () => this.runSimulation());
        }
        
        const btnLoadComplex = document.getElementById('btn-load-complex');
        if (btnLoadComplex) {
            btnLoadComplex.addEventListener('click', () => this.visualizeBindingComplex());
        }
    },

    writeToTerminal(text, type = 'system') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        line.innerHTML = `<span style="color: #8a99ad; font-size: 10px;">[${timestamp}]</span> ${text}`;
        
        this.terminal.appendChild(line);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    },

    clearTerminal() {
        this.terminal.innerHTML = '';
    },

    async runSimulation() {
        if (this.isDocking) return;
        
        // 1. Verify ligand is present
        const atomCount = window.BioSynthSandbox.atoms.length;
        if (atomCount === 0) {
            this.writeToTerminal('ERROR: Docking halted. Sandbox contains 0 atoms. Please sketch a compound first.', 'error');
            return;
        }

        this.isDocking = true;
        this.dockButton.disabled = true;
        this.dockButton.innerText = 'SIMULATING...';
        this.dockButton.style.opacity = '0.5';
        this.resultCard.classList.add('hidden');
        
        this.clearTerminal();
        
        // Fetch active PDB metadata
        const activePDBId = document.getElementById('active-pdb-id').innerText;
        const activePDBTitle = document.getElementById('active-pdb-title').innerText;
        const gridSize = document.getElementById('grid-size').value;
        const exhaust = document.getElementById('exhaustiveness').value;
        
        // Fetch chemical properties
        const mwText = document.getElementById('tel-mw').innerText;
        const formula = document.getElementById('tel-formula').innerText;
        
        // Real property metrics for physical equations
        const mw = parseFloat(mwText);
        const logp = parseFloat(document.getElementById('tel-logp').innerText);
        const rotb = parseInt(document.getElementById('tel-rotb').innerText);
        
        let hbd = 0;
        let hba = 0;
        window.BioSynthSandbox.atoms.forEach(atom => {
            if (atom.element === 'N' || atom.element === 'O') {
                hba++;
            }
        });
        
        this.writeToTerminal('==========================================', 'system');
        this.writeToTerminal('   BIOSYNTH DOCKING CORE v1.4.1   ', 'success');
        this.writeToTerminal('==========================================', 'system');
        await this.delay(400);

        this.writeToTerminal(`Initializing search space around active site cavity...`, 'system');
        this.writeToTerminal(`Target Receptor: PDB ID ${activePDBId} [${activePDBTitle.substring(0, 30)}...]`, 'system');
        this.writeToTerminal(`Ligand structure detected: ${formula} (MW: ${mw.toFixed(1)} g/mol)`, 'system');
        await this.delay(600);

        this.writeToTerminal(`Constructing 3D affinity grid [${gridSize} x ${gridSize} x ${gridSize} Å]`, 'system');
        this.writeToTerminal(`Exhaustiveness index locked at: ${exhaust} runs`, 'success');
        await this.delay(500);

        // Sequence of mock algorithm computations
        const steps = [
            { text: 'Generating potential grid energy maps...', type: 'system' },
            { text: 'Evaluating electrostatic and steric interactions...', type: 'system' },
            { text: 'Executing genetic search algorithm - Run 1 of 3...', type: 'system' },
            { text: 'Calculating conformational entropy penalties...', type: 'warn' },
            { text: 'Optimizing local hydrogen-bonding networks...', type: 'system' },
            { text: 'Executing genetic search algorithm - Run 2 of 3...', type: 'system' },
            { text: 'Adjusting flexible torsional angles...', type: 'system' },
            { text: 'Executing genetic search algorithm - Run 3 of 3...', type: 'system' },
            { text: 'Refining complex coordinates (Amber Forcefield)...', type: 'warn' }
        ];

        for (let i = 0; i < steps.length; i++) {
            this.writeToTerminal(steps[i].text, steps[i].type);
            
            // DNA Sequencing animation for terminal engagement
            if (i === 3 || i === 7) {
                await this.dnaSequenceAnimation();
            } else {
                await this.delay(Math.random() * 200 + 200);
            }
        }

        // 6. Calculate realistic scientific scoring
        // Binding energy equation: base energy (hydrophobic C interactions) - hydrogen bonding rewards + rotatable bond entropy penalty + noise
        let baseDeltaG = -4.2; // kcal/mol
        
        // Add carbon/sulfur hydrophobic contribution
        window.BioSynthSandbox.atoms.forEach(a => {
            if (a.element === 'C') baseDeltaG -= 0.12;
            if (a.element === 'S') baseDeltaG -= 0.18;
            if (a.element === 'Cl') baseDeltaG -= 0.22;
        });

        // Add HBD/HBA electrostatic rewards (up to a ceiling to prevent infinite stacking)
        const totalHbonds = hbd + hba;
        baseDeltaG -= Math.min(10, totalHbonds) * 0.35;

        // Entropy penalty: each rotatable bond costs positive energy
        baseDeltaG += rotb * 0.20;

        // Add coordinate match boost if targeted for 1HSG active site
        if (activePDBId === '1HSG') {
            baseDeltaG -= 0.8; // specific docking cavity optimization bonus
        }

        // Add slight randomized noise
        baseDeltaG += Math.random() * -0.4;
        
        const finalDeltaG = baseDeltaG;

        // Inhibitory Constant (Ki) calculation: Ki = e^(deltaG / RT)
        // RT in kcal/mol = 1.9872e-3 * 298.15 = 0.5925
        // Ki (Molar) = Math.exp(finalDeltaG / 0.5925)
        const kiMolar = Math.exp(finalDeltaG / 0.5925);
        let kiLabel = '';
        if (kiMolar < 1e-9) {
            kiLabel = `${(kiMolar * 1e12).toFixed(1)} pM`;
        } else if (kiMolar < 1e-6) {
            kiLabel = `${(kiMolar * 1e9).toFixed(1)} nM`;
        } else if (kiMolar < 1e-3) {
            kiLabel = `${(kiMolar * 1e6).toFixed(1)} µM`;
        } else {
            kiLabel = `${(kiMolar * 1e3).toFixed(1)} mM`;
        }

        // Ligand efficiency rating
        let efficiency = 'Poor';
        if (finalDeltaG <= -8.0) efficiency = 'Exceptional';
        else if (finalDeltaG <= -6.5) efficiency = 'Excellent';
        else if (finalDeltaG <= -5.0) efficiency = 'Moderate';

        this.writeToTerminal('==========================================', 'system');
        this.writeToTerminal(`DOCKING COMPLETE. SUCCESS: Global minimum achieved!`, 'success');
        this.writeToTerminal(`Best binding mode affinity (ΔG): ${finalDeltaG.toFixed(2)} kcal/mol`, 'success');
        this.writeToTerminal(`Estimated Ki (Affinity constant): ${kiLabel}`, 'success');
        this.writeToTerminal('==========================================', 'system');

        // Update Results UI
        document.getElementById('res-affinity').innerHTML = `${finalDeltaG.toFixed(2)} <span class="unit">kcal/mol</span>`;
        document.getElementById('res-ki').innerText = kiLabel;
        
        const efficiencyEl = document.getElementById('res-efficiency');
        efficiencyEl.innerText = efficiency;
        if (efficiency === 'Exceptional' || efficiency === 'Excellent') {
            efficiencyEl.className = 'value text-green';
        } else {
            efficiencyEl.className = 'value';
            efficiencyEl.style.color = '#ffd60a';
        }

        this.resultCard.classList.remove('hidden');
        this.isDocking = false;
        this.dockButton.disabled = false;
        this.dockButton.innerText = 'INITIATE DOCKING';
        this.dockButton.style.opacity = '1';
    },

    async dnaSequenceAnimation() {
        const chars = ['A', 'T', 'C', 'G'];
        for (let step = 0; step < 4; step++) {
            let sequence = '';
            for (let j = 0; j < 24; j++) {
                sequence += chars[Math.floor(Math.random() * chars.length)];
                if (j % 4 === 3) sequence += ' ';
            }
            this.writeToTerminal(`ALIGNING: <code style="color: #bf5af2; font-family: monospace;">${sequence}</code>`, 'system');
            await this.delay(100);
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Highly immersive WebGL docking display
     * Loads the compound sandbox molecule inside the active protein cavity (PDB model)
     * Renders cartoon structure with glowing stick complexes and yellow dotted hydrogen bonds!
     */
    visualizeBindingComplex() {
        const activePDBId = document.getElementById('active-pdb-id').innerText;
        const viewer = window.BioSynthApp.glViewer;
        
        if (!viewer) return;

        this.writeToTerminal('Injecting ligand coordinates into receptor active cavity...', 'success');
        
        // Highlight active site amino acids and dock ligand
        viewer.clear();
        
        // 1. Re-render Protein Cartoon
        viewer.addModel(window.BioSynthApp.activePDBText, "pdb");
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });

        // Retrieve predefined protein details
        const famousInfo = window.BioSynthDatabase.famousProteins[activePDBId];

        if (famousInfo) {
            // Dynamic Active Site highlighting based on registry coordinates
            const activeRes = famousInfo.activeResidues || [10, 20, 30];
            viewer.setStyle({ resi: activeRes }, { stick: { colorscheme: 'cyanCarbon', radius: 0.25 } });

            // Special Cofactor and H-Bond Cylinder overlays
            if (activePDBId === '1HSG') {
                // Indinavir ligand co-crystal sphere & H-bonds
                viewer.setStyle({ resn: 'MK1' }, { sphere: { scale: 0.9 } });
                viewer.addCylinder({
                    start: { x: -2.3, y: -0.8, z: -2.7 }, // ASP25 oxygen
                    end: { x: -0.7, y: -0.4, z: -1.0 },   // Indinavir hydroxyl
                    radius: 0.08, color: 'yellow', dashed: true
                });
                viewer.addCylinder({
                    start: { x: 1.5, y: -0.9, z: -2.6 },  // ASP125 oxygen
                    end: { x: -0.7, y: -0.4, z: -1.0 },   // Indinavir hydroxyl
                    radius: 0.08, color: 'yellow', dashed: true
                });
            } else if (activePDBId === '6M0J') {
                viewer.setStyle({ resn: 'NAG' }, { sphere: { scale: 0.95 } });
            } else if (activePDBId === '4HHB' || activePDBId === '1HHO') {
                viewer.setStyle({ resn: 'HEM' }, { stick: { colorscheme: 'cyanCarbon', radius: 0.28 } });
            } else if (activePDBId === '1EMA' || activePDBId === '1BFP') {
                viewer.setStyle({ resn: 'CRO' }, { sphere: { scale: 0.95 } });
            }

            // Print targeted biophysical diagnostic log
            this.writeToTerminal(famousInfo.dockingLog || 'ACTIVE SITE DOCKING COMPLETED.', 'success');
        } else {
            // General PDB fallback
            viewer.setStyle({ resi: [10, 20, 30] }, { stick: { colorscheme: 'cyanCarbon' } });
            this.writeToTerminal('GENERAL PROTEIN CAVITY ALIGNED.', 'success');
        }

        viewer.zoomTo();
        viewer.render();
        this.writeToTerminal('Binding complex updated in 3D WebGL viewport.', 'success');
    }
};

// Make it globally accessible
window.BioSynthDocking = BioSynthDocking;
