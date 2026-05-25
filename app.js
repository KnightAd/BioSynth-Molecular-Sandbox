/* ==========================================================================
   BIOSYNTH // APP COORDINATOR & STATE CONTROLLER
   ========================================================================== */

const BioSynthApp = {
    glViewer: null,
    activePDBText: null,
    activePDBId: '1HSG',
    
    // UI References
    pdbSelect: null,
    customPdbGroup: null,
    customPdbInput: null,
    customPdbBtn: null,
    
    tabButtons: null,
    tabContents: null,
    
    // PubChem Integration References
    dbSearchInput: null,
    dbSearchBtn: null,
    dbLoader: null,
    dbError: null,
    dbResultBox: null,
    importedSdfText: null,

    async init() {
        this.cacheDOM();
        this.populateProteinDropdown(); // Programmatically populate the 58+ protein targets!
        this.bindEvents();
        this.initializeStatusTelemetry();
        
        // Initialize 2D Sandbox
        window.BioSynthSandbox.init();
        
        // Initialize Docking Simulator
        window.BioSynthDocking.init();
        
        // Initialize 3Dmol.js WebGL Viewer
        this.initWebGLViewer();
        
        // Boot with default Protein (1HSG)
        await this.loadProtein('1HSG');
    },

    populateProteinDropdown() {
        const select = document.getElementById('pdb-select');
        if (!select) return;

        // Clear existing options except 'custom'
        const customOption = select.querySelector('option[value="custom"]');
        select.innerHTML = '';

        const registry = window.BioSynthDatabase.famousProteins;
        const categories = {};

        // Group by category
        Object.keys(registry).forEach(pdbId => {
            const protein = registry[pdbId];
            const catName = protein.category || 'General Structures';
            if (!categories[catName]) {
                categories[catName] = [];
            }
            categories[catName].push({ id: pdbId, ...protein });
        });

        // Create optgroup elements sorted alphabetically
        Object.keys(categories).sort().forEach(catName => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = catName.toUpperCase();

            categories[catName].sort((a,b) => a.id.localeCompare(b.id)).forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = `${p.id} // ${p.name}`;
                if (p.id === '1HSG') opt.selected = true; // default select
                optgroup.appendChild(opt);
            });

            select.appendChild(optgroup);
        });

        // Re-append custom option
        if (customOption) {
            select.appendChild(customOption);
        }
    },

    cacheDOM() {
        this.pdbSelect = document.getElementById('pdb-select');
        this.customPdbGroup = document.querySelector('.custom-pdb-group');
        this.customPdbInput = document.getElementById('pdb-custom-input');
        this.customPdbBtn = document.getElementById('pdb-custom-btn');
        
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        this.dbSearchInput = document.getElementById('db-search-input');
        this.dbSearchBtn = document.getElementById('db-search-btn');
        this.dbLoader = document.getElementById('db-loader');
        this.dbError = document.getElementById('db-error');
        this.dbResultBox = document.getElementById('db-result-box');
    },

    bindEvents() {
        // Protein Select
        this.pdbSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'custom') {
                this.customPdbGroup.classList.remove('hidden');
            } else {
                this.customPdbGroup.classList.add('hidden');
                this.loadProtein(val);
            }
        });

        // Custom PDB fetch
        this.customPdbBtn.addEventListener('click', () => {
            const val = this.customPdbInput.value.trim();
            if (val.length === 4) {
                this.loadProtein(val);
            } else {
                alert('PDB ID must be exactly 4 characters.');
            }
        });

        // 3D Visualizer Style Toggles
        document.getElementById('btn-spin').addEventListener('click', (e) => {
            const btn = e.currentTarget;
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');
            
            if (this.glViewer) {
                this.glViewer.spin(isActive);
                document.getElementById('spin-status').innerText = isActive ? 'ON' : 'OFF';
            }
        });

        document.getElementById('btn-style-stick').addEventListener('click', () => {
            this.setProteinStyle('stick');
        });
        document.getElementById('btn-style-sphere').addEventListener('click', () => {
            this.setProteinStyle('sphere');
        });
        document.getElementById('btn-style-cartoon').addEventListener('click', () => {
            this.setProteinStyle('cartoon');
        });
        
        document.getElementById('btn-reset-cam').addEventListener('click', () => {
            if (this.glViewer) {
                this.glViewer.zoomTo();
                this.glViewer.render();
            }
        });

        // Tab Switches
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabButtons.forEach(b => b.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // PubChem Search
        this.dbSearchBtn.addEventListener('click', () => this.searchChemicalDatabase());
        this.dbSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.searchChemicalDatabase();
        });

        // PubChem Action Buttons
        document.getElementById('btn-import-sandbox').addEventListener('click', () => {
            if (this.importedSdfText) {
                window.BioSynthSandbox.importStructure(this.importedSdfText);
                this.writeDockingLog('Chemical imported into Sandbox canvas successfully.', 'success');
                
                // Slide back to sandbox tab view automatically
                const sandboxTabBtn = document.querySelector('[data-tab="docking-tab"]');
                if (sandboxTabBtn) sandboxTabBtn.click();
            }
        });

        document.getElementById('btn-view-3d').addEventListener('click', () => {
            if (this.importedSdfText) {
                this.loadSDFInto3DViewer(this.importedSdfText);
            }
        });
    },

    initializeStatusTelemetry() {
        // Loop system-load counts dynamically to give console a highly alive feeling
        setInterval(() => {
            const loadVal = (Math.random() * 2.3 + 0.05).toFixed(2) + '%';
            const loadEl = document.getElementById('sys-load');
            if (loadEl) loadEl.innerText = loadVal;
        }, 3000);
        
        // Render beautiful vector Lucide icons
        lucide.createIcons();
    },

    // --- 3DMOL VISUALIZER SETUP ---

    initWebGLViewer() {
        // Create 3Dmol viewer context inside #mol-viewer element
        try {
            this.glViewer = $3Dmol.createViewer("mol-viewer", { 
                defaultcolors: $3Dmol.rasmolElementColors 
            });
            this.glViewer.setBackgroundColor('#07090e'); // Match panel backgrounds
            document.getElementById('webgl-status').innerText = 'ACTIVE';
            document.getElementById('webgl-status').className = 'value ok';
        } catch (error) {
            console.error('Failed to initialize WebGL context:', error);
            document.getElementById('webgl-status').innerText = 'ERROR';
            document.getElementById('webgl-status').className = 'value text-red';
        }
    },

    async loadProtein(pdbId) {
        if (!this.glViewer) return;
        
        this.activePDBId = pdbId.toUpperCase();
        this.writeDockingLog(`Fetching protein target model: PDB ${this.activePDBId}...`, 'system');
        
        try {
            const { pdbText, metadata } = await window.BioSynthDatabase.fetchPDBModel(this.activePDBId);
            this.activePDBText = pdbText;

            // Load model into 3Dmol
            this.glViewer.clear();
            this.glViewer.addModel(pdbText, "pdb");
            
            // Set Style (Cartoon / Ribbon by default is beautiful)
            this.glViewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            
            // Zoom camera to fit model
            this.glViewer.zoomTo();
            this.glViewer.render();

            // Update UI Labels
            document.getElementById('active-pdb-id').innerText = metadata.id;
            document.getElementById('active-pdb-title').innerText = metadata.title;
            
            // Update Docking view
            document.getElementById('dock-receptor-val').innerText = `${metadata.id} (${metadata.title.substring(0, 20)}...)`;
            
            const metaContainer = document.querySelector('.pdb-meta');
            metaContainer.innerHTML = `
                <span><strong>PDB ID:</strong> <span id="active-pdb-id">${metadata.id}</span></span>
                <span><strong>Method:</strong> ${metadata.method}</span>
                <span><strong>Res:</strong> ${metadata.resolution}</span>
            `;

            // Update Biophysical Details Profile Card
            document.getElementById('prof-organism').innerText = metadata.organism;
            document.getElementById('prof-function').innerText = metadata.function;
            document.getElementById('prof-desc').innerText = metadata.description;

            this.writeDockingLog(`Target protein PDB ${metadata.id} loaded into WebGL viewer.`, 'success');
            
            // Highlight styling selection state
            this.updateStyleButtons('cartoon');
        } catch (error) {
            this.writeDockingLog(`Failed to load target PDB: ${this.activePDBId}. Check connection/ID.`, 'error');
            alert(`Error loading PDB ID ${this.activePDBId}. Check your internet connection or try another ID.`);
        }
    },

    setProteinStyle(style) {
        if (!this.glViewer || !this.activePDBText) return;

        this.glViewer.setStyle({}, {}); // Clear old styling
        
        if (style === 'stick') {
            this.glViewer.setStyle({}, { stick: { radius: 0.25 } });
        } else if (style === 'sphere') {
            this.glViewer.setStyle({}, { sphere: { scale: 0.9 } });
        } else if (style === 'cartoon') {
            this.glViewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        }

        this.glViewer.render();
        this.updateStyleButtons(style);
    },

    updateStyleButtons(activeStyle) {
        const buttons = {
            stick: document.getElementById('btn-style-stick'),
            sphere: document.getElementById('btn-style-sphere'),
            cartoon: document.getElementById('btn-style-cartoon')
        };
        
        Object.keys(buttons).forEach(style => {
            if (style === activeStyle) {
                buttons[style].classList.add('active');
            } else {
                buttons[style].classList.remove('active');
            }
        });
        
        document.getElementById('style-status').innerText = activeStyle.toUpperCase();
    },

    // --- PUBCHEM CHEMICAL DATABASE SEARCH ---

    async searchChemicalDatabase() {
        const name = this.dbSearchInput.value.trim();
        if (!name) return;

        this.dbLoader.classList.remove('hidden');
        this.dbError.classList.add('hidden');
        this.dbResultBox.classList.add('hidden');
        
        try {
            const data = await window.BioSynthDatabase.searchCompound(name);
            
            this.importedSdfText = data.sdfText;

            // Fill card data
            document.getElementById('comp-name').innerText = data.name;
            document.getElementById('comp-cid').innerText = `CID: ${data.cid}`;
            document.getElementById('comp-desc').innerText = data.description;
            document.getElementById('comp-formula').innerText = data.formula;
            document.getElementById('comp-mw').innerText = `${data.mw.toFixed(2)} g/mol`;
            document.getElementById('comp-logp').innerText = data.logp.toFixed(2);
            document.getElementById('comp-smiles').innerText = data.smiles;

            this.dbLoader.classList.add('hidden');
            this.dbResultBox.classList.remove('hidden');
        } catch (error) {
            this.dbLoader.classList.add('hidden');
            this.dbError.classList.remove('hidden');
        }
    },

    /**
     * Loads small molecules alone inside the 3D WebGL viewer
     */
    loadSDFInto3DViewer(sdfText) {
        if (!this.glViewer || !sdfText) return;

        this.writeDockingLog('Rendering fetched chemical ligand geometry in 3D...', 'system');
        
        this.glViewer.clear();
        this.glViewer.addModel(sdfText, "sdf");
        
        // Styled like sticks and colored beautifully by element
        this.glViewer.setStyle({}, { stick: { colorscheme: 'cyanCarbon', radius: 0.25 } });
        
        this.glViewer.zoomTo();
        this.glViewer.render();

        document.getElementById('active-pdb-id').innerText = 'LIGAND';
        document.getElementById('active-pdb-title').innerText = document.getElementById('comp-name').innerText;
        document.getElementById('style-status').innerText = 'STICK';

        this.writeDockingLog(`3D structure CID ${document.getElementById('comp-cid').innerText} active in WebGL.`, 'success');
    },

    writeDockingLog(text, type) {
        if (window.BioSynthDocking) {
            window.BioSynthDocking.writeToTerminal(text, type);
        }
    }
};

// Start application when DOM is fully prepared
document.addEventListener('DOMContentLoaded', () => {
    BioSynthApp.init().catch(err => console.error('BioSynth bootstrap failed:', err));
});

// Bind globally for console operations
window.BioSynthApp = BioSynthApp;
