/* ==========================================================================
   BIOSYNTH // DATABASE MODULE (API CLIENT)
   ========================================================================== */

const BioSynthDatabase = {
    // RCSB Protein Data Bank API Base URLs
    PDB_DOWNLOAD_URL: 'https://files.rcsb.org/download/',
    PDB_INFO_URL: 'https://data.rcsb.org/rest/v1/core/entry/',

    // PubChem API Base URLs
    PUBCHEM_PUG_URL: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/',

    // Predefined Famous Proteins Biosensor Information (75+ Curated Entries)
    famousProteins: {
        // --- CATEGORY: Viral & Infectious Diseases ---
        '1HSG': {
            name: 'HIV-1 Protease',
            category: 'Viral & Infectious Diseases',
            organism: 'Human immunodeficiency virus 1 (HIV-1)',
            function: 'Viral Polyprotein Processing',
            description: 'An aspartic protease enzyme crucial for HIV replication. It cleaves newly synthesized polyproteins to create mature infectious viral components. Major target for HIV protease inhibitor therapies.',
            activeResidues: [25, 125],
            dockingLog: 'HYDROGEN BONDS IDENTIFIED: Asp-25-O & Asp-125-O clamp ligand (2.82 Å)'
        },
        '6M0J': {
            name: 'SARS-CoV-2 Spike RBD',
            category: 'Viral & Infectious Diseases',
            organism: 'SARS-CoV-2 / Homo sapiens',
            function: 'Viral Cellular Attachment Gateway',
            description: 'The structural spike glycoprotein receptor-binding domain of COVID-19 complexed with the human cellular receptor angiotensin-converting enzyme 2 (ACE2). Essential interface for cellular entry.',
            activeResidues: [417, 489, 505],
            dockingLog: 'CONTACT INTERACTION: RBD Lys-417 & Tyr-489 polar interface locked'
        },
        '6LU7': {
            name: 'SARS-CoV-2 Main Protease (Mpro)',
            category: 'Viral & Infectious Diseases',
            organism: 'SARS-CoV-2',
            function: 'Viral Replication Polyprotein Cleavage',
            description: 'The main protease (Mpro or 3CLpro) of SARS-CoV-2, which processes polyproteins translated from viral RNA. Essential for viral replication and a primary target for Paxlovid.',
            activeResidues: [41, 145, 163],
            dockingLog: 'CATALYTIC DYAD DETECTED: His-41 & Cys-145 hydrogen bridge mapped'
        },
        '2I9B': {
            name: 'HIV-1 Reverse Transcriptase',
            category: 'Viral & Infectious Diseases',
            organism: 'Human immunodeficiency virus 1 (HIV-1)',
            function: 'Viral RNA Reverse Transcription',
            description: 'A multi-functional polymerase that transcribes viral single-stranded RNA into double-stranded DNA. Targeted by reverse transcriptase inhibitors (NRTIs/NNRTIs) like AZT.',
            activeResidues: [110, 185, 186],
            dockingLog: 'POLYMERASE ACTIVE SITE: Asp-110 & Asp-186 magnesium chelates locked'
        },
        '1Z2A': {
            name: 'Influenza Hemagglutinin',
            category: 'Viral & Infectious Diseases',
            organism: 'Influenza A virus',
            function: 'Viral Host Adhesion',
            description: 'An antigenic glycoprotein found on the surface of influenza viruses. It mediates binding of the virus to sialic acid on host cell membranes, triggering cellular endocytosis.',
            activeResidues: [136, 190, 226],
            dockingLog: 'SIALIC ACID SLOT: Tyr-98 & His-183 hydrogen network confirmed'
        },
        '3HEG': {
            name: 'Cholera Toxin B-pentamer',
            category: 'Viral & Infectious Diseases',
            organism: 'Vibrio cholerae',
            function: 'Host Membrane Translocation',
            description: 'The receptor-binding subunit of the cholera enterotoxin, forming a stable pentameric ring that binds to ganglioside GM1 receptors on intestinal epithelial cell surfaces.',
            activeResidues: [51, 57, 95],
            dockingLog: 'GANGLIOSIDE GM1 BINDING: Trp-88 stacking interactions aligned'
        },

        // --- CATEGORY: Blood & Oxygen Transporters ---
        '4HHB': {
            name: 'Human Hemoglobin (Deoxy)',
            category: 'Blood & Oxygen Transporters',
            organism: 'Homo sapiens (Human)',
            function: 'Oxygen Transport Metalloprotein',
            description: 'The iron-containing oxygen-transport metalloprotein in red blood cells. It carries oxygen from the respiratory organs (lungs) to body tissues, releasing it to power cellular respiration.',
            activeResidues: [58, 87, 92],
            dockingLog: 'HEME PROXIMAL COORDINATION DETECTED: His-92 & Heme Fe center'
        },
        '1HHO': {
            name: 'Human Hemoglobin (Oxy)',
            category: 'Blood & Oxygen Transporters',
            organism: 'Homo sapiens (Human)',
            function: 'Oxygen Transport Metalloprotein',
            description: 'The oxygen-bound conformation of hemoglobin, showing the structural transition (R-state) that increases oxygen affinity across the tetrameric subunits.',
            activeResidues: [58, 87, 92],
            dockingLog: 'OXYGENATION AXIS LOCKED: Distal His-58 coordinates oxygen ligand'
        },
        '1MBO': {
            name: 'Sperm Whale Myoglobin',
            category: 'Blood & Oxygen Transporters',
            organism: 'Physeter catodon (Sperm Whale)',
            function: 'Intramuscular Oxygen Storage',
            description: 'The primary oxygen-binding protein in muscle tissues of marine mammals. First protein structure ever solved by X-ray crystallography (John Kendrew, 1958).',
            activeResidues: [64, 93, 97],
            dockingLog: 'GLOBIN POCKET SECURED: Proximal His-93 coordinates oxygen reservoir'
        },
        '1A4F': {
            name: 'Human Serum Albumin',
            category: 'Blood & Oxygen Transporters',
            organism: 'Homo sapiens (Human)',
            function: 'Blood Osmotic & Transport Carrier',
            description: 'The most abundant protein in human plasma. It regulates blood osmotic pressure and binds water, cations, fatty acids, hormones, and clinical drugs to transport them.',
            activeResidues: [214, 242, 348],
            dockingLog: 'SUDLOW I BINDING SITE: Trp-214 pocket interactions mapped'
        },
        '1WLA': {
            name: 'Human Lactoferrin',
            category: 'Blood & Oxygen Transporters',
            organism: 'Homo sapiens (Human)',
            function: 'Innate Immune Antimicrobial Carrier',
            description: 'An iron-binding glycoprotein present in secretory fluids (milk, tears). Sequesters free iron to inhibit bacterial growth and exhibits direct bactericidal properties.',
            activeResidues: [92, 249, 252],
            dockingLog: 'SYNERGISTIC ANION SITE: Tyr-92 Fe chelator network coordinates'
        },

        // --- CATEGORY: Fluorescent & Bioluminescent ---
        '1EMA': {
            name: 'Green Fluorescent Protein (GFP)',
            category: 'Fluorescent & Bioluminescent',
            organism: 'Aequorea victoria (Jellyfish)',
            function: 'Bioluminescence Biomarker',
            description: 'A protein that exhibits bright green fluorescence when exposed to blue or ultraviolet light. Extensively used in molecular biology as a reporter gene to track cellular dynamics.',
            activeResidues: [66, 96, 222],
            dockingLog: 'GFP BETA-BARREL FLUOROPHORE: Arg-96 electrostatic lock active'
        },
        '1BFP': {
            name: 'Blue Fluorescent Protein (BFP)',
            category: 'Fluorescent & Bioluminescent',
            organism: 'Aequorea victoria (Jellyfish Mutant)',
            function: 'Mutant Bioluminescence Marker',
            description: 'A genetically engineered variant of GFP (containing Tyr66His mutation) that emits brilliant blue fluorescence. Used for dual-color cellular imaging.',
            activeResidues: [66, 96, 222],
            dockingLog: 'HISTIDINE-CHROMOPHORE ALIGNMENT: His-66 blue emission mapped'
        },
        '3V03': {
            name: 'Firefly Luciferase',
            category: 'Fluorescent & Bioluminescent',
            organism: 'Photinus pyralis (Firefly)',
            function: 'Oxidative Bioluminescence Catalysis',
            description: 'An enzyme that catalyzes the chemical oxidation of D-luciferin in the presence of ATP and oxygen, producing a highly efficient green-yellow light.',
            activeResidues: [247, 340, 348],
            activeSite: [340],
            dockingLog: 'LUCIFERIN ACTIVE CAVITY: Lys-529 coordinates phosphate transition'
        },

        // --- CATEGORY: Hormones, Signals & Receptors ---
        '2HI4': {
            name: 'Human Insulin Hexamer',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Blood Glucose Regulation Hormone',
            description: 'The zinc-stabilized hexameric storage form of insulin. Insulin acts on cells to trigger glucose absorption, glycogen storage, and lipogenesis.',
            activeResidues: [8, 10, 21],
            dockingLog: 'ZINC INTERACTION: His-10 coordinates zinc-stabilized hexamer'
        },
        '4MQT': {
            name: 'Insulin Receptor Kinase',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Glucose Signal Transduction',
            description: 'The intracellular tyrosine kinase domain of the human insulin receptor. Activation triggers phosphorylation events that signal glucose entry into muscle and fat cells.',
            activeResidues: [1030, 1150],
            dockingLog: 'KINASE ATP SLOT: Lys-1030 & Asp-1150 coordinate docking'
        },
        '1GCN': {
            name: 'Glucagon Peptide',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Blood Glucose Elevation Hormone',
            description: 'A single-chain peptide hormone that works opposite to insulin, stimulating glycogenolysis and gluconeogenesis in the liver to raise blood sugar levels.',
            activeResidues: [1, 9, 28],
            dockingLog: 'RECEPTOR-BINDING TERMINUS: His-1 & Asp-9 polar nodes active'
        },
        '3HHR': {
            name: 'Growth Hormone Complex',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Cellular Growth & Proliferation',
            description: 'Human growth hormone (hGH) complexed with its extracellular receptor. Governs somatic cell growth, cellular division, and bone development.',
            activeResidues: [43, 172, 175],
            dockingLog: 'RECEPTOR HYDROPHOBIC INTERACTION: Trp-104 receptor cleft active'
        },
        '1A8I': {
            name: 'Leu-Enkephalin Peptide',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Endogenous Opioid Neurotransmission',
            description: 'An endogenous pentapeptide (Tyr-Gly-Gly-Phe-Leu) with morphine-like analgesic effects. Binds to opioid receptors in the central nervous system to damp pain signals.',
            activeResidues: [1, 4, 5],
            dockingLog: 'TYROSINE PHENOL CLAMP: Tyr-1 binding locus aligned'
        },

        // --- CATEGORY: Genetics, CRISPR & Ribosome ---
        '1BNA': {
            name: 'B-DNA Double Helix',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Synthetic Construct (Oligonucleotide)',
            function: 'Drew-Dickerson DNA Double Helix',
            description: 'The classic synthetic B-DNA double helix structure solved by Drew and Dickerson in 1981. It represents the structural foundations of genetic storage, double-helix geometry, and minor-groove dynamics.',
            activeResidues: [5, 6, 17, 18],
            dockingLog: 'MINOR GROOVE CLAMPING SEQUENCE CONFIRMED: DNA Base Target'
        },
        '1AOI': {
            name: 'Nucleosome Core Particle',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Xenopus laevis (Frog)',
            function: 'Genomic Packaging Core',
            description: 'The fundamental unit of eukaryotic chromatin. Consists of 147 base pairs of DNA wrapped in 1.75 superhelical turns around an octamer core of histone proteins (H2A, H2B, H3, H4).',
            activeResidues: [45, 78, 83],
            dockingLog: 'HISTONE TAIL INTERACTIONS: Basic Lys & Arg histone bands mapped'
        },
        '4F5S': {
            name: 'CRISPR-Cas9 Endonuclease',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Streptococcus pyogenes',
            function: 'RNA-Guided DNA Cleavage',
            description: 'The bacterial RNA-guided DNA endonuclease that drives CRISPR adaptive immunity. Now widely harnessed for gene-editing and genomic reprogramming.',
            activeResidues: [10, 840, 863],
            dockingLog: 'RUV-C endonuclease core: Asp-10 & His-840 target DNA'
        },
        '3J3Q': {
            name: '70S Bacterial Ribosome',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Thermus thermophilus',
            function: 'Cellular Protein Synthesis (Translation)',
            description: 'The molecular machine that translates mRNA into proteins. Consists of a small (30S) and large (50S) subunit, containing diverse RNA strands and amino acid complexes.',
            activeResidues: [46, 52, 98],
            dockingLog: 'TRANSLATION PEPTIDYL CENTER: Ribosomal RNA residues mapped'
        },
        '1TUP': {
            name: 'p53 Tumor Suppressor',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Homo sapiens (Human)',
            function: 'Cellular DNA Damage Checkpoint',
            description: 'The "guardian of the genome". A transcription factor that arrests cellular division or activates apoptosis in response to DNA damage, preventing cancer development.',
            activeResidues: [120, 248, 273],
            dockingLog: 'DNA ANCHOR HOTSPOT: Arg-248 & Arg-273 sequence clamps mapped'
        },

        // --- CATEGORY: Enzymes & Metabolic Catalysts ---
        '1LYS': {
            name: 'Egg White Lysozyme',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Gallus gallus (Chicken)',
            function: 'Antibacterial Cell Wall Cleavage',
            description: 'An enzyme that cleaves peptidoglycan cell walls in Gram-positive bacteria, protecting tissues from infection. First enzyme structure solved (David Phillips, 1965).',
            activeResidues: [35, 52, 108],
            dockingLog: 'CATALYTIC CLAMP: Glu-35 & Asp-52 glycosidic cleavers active'
        },
        '1E8A': {
            name: 'Acetylcholinesterase (AChE)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Torpedo californica (Electric Ray)',
            function: 'Synaptic Signal Termination',
            description: 'An extremely fast enzyme that hydrolyzes acetylcholine neurotransmitters at synaptic junctions. Major target for nerve agents, organophosphates, and Alzheimer therapeutics.',
            activeResidues: [200, 327, 440],
            dockingLog: 'CATALYTIC TRIAD ACTIVE: Ser-200 & His-440 esterase active'
        },
        '1RD8': {
            name: 'RuBisCO Enzyme',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Spinacia oleracea (Spinach)',
            function: 'Photosynthetic Carbon Fixation',
            description: 'Ribulose-1,5-bisphosphate carboxylase/oxygenase. Catalyzes the first major step of carbon fixation in photosynthesis. The most abundant enzyme on Earth.',
            activeResidues: [175, 201, 328],
            dockingLog: 'CARBON FIXATION COMPLEX: Lys-201 active-site magnesium bound'
        },
        '2C1A': {
            name: 'Carbonic Anhydrase II',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Homo sapiens (Human)',
            function: 'Respiratory Gas Buffer Equilibrium',
            description: 'An extremely rapid metalloenzyme that hydrates carbon dioxide into bicarbonate and protons. Crucial for respiration, ocular pressure, and pH balance.',
            activeResidues: [94, 96, 119],
            dockingLog: 'ZINC METAL CORE: His-94 & His-96 coordinate structural zinc'
        },
        '2SOD': {
            name: 'Superoxide Dismutase (SOD)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Homo sapiens (Human)',
            function: 'Superoxide Free Radical Detoxification',
            description: 'An essential antioxidant enzyme that dismutates highly reactive superoxide oxygen free radicals into oxygen and hydrogen peroxide, shielding cells from oxidative stress.',
            activeResidues: [46, 61, 118],
            dockingLog: 'ACTIVE COPPER CHANNEL: His-61 bridges copper & zinc centers'
        },
        '1AL1': {
            name: 'Alkaline Phosphatase',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Escherichia coli',
            function: 'Phosphate Hydrolysis',
            description: 'A dimeric metalloenzyme containing zinc and magnesium ions. Catalyzes the dephosphorylation of diverse organic compounds at basic pH values.',
            activeResidues: [102, 328, 360],
            dockingLog: 'BIMETALLIC CORE ACTIVE: Ser-102 coordinates zinc dephosphorylation'
        },
        '3B75': {
            name: 'Bovine Trypsin',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Bos taurus (Cow)',
            function: 'Dietary Protein Digestion',
            description: 'A serine protease found in the digestive system. It cleaves peptide bonds primarily at the carboxyl side of lysine and arginine residues.',
            activeResidues: [57, 102, 195],
            dockingLog: 'TRYPSIN SERINE TRIAD: Ser-195 nucleophilic attack active'
        },

        // --- CATEGORY: Membrane Channels & GPCRs ---
        '1BL8': {
            name: 'KcsA Potassium Channel',
            category: 'Membrane Channels & GPCRs',
            organism: 'Streptomyces lividans',
            function: 'Selective Potassium Conduction',
            description: 'A tetrameric membrane channel that selectively allows potassium ions to cross cell membranes. Proves the structural mechanism of ion selectivity (Roderick MacKinnon, Nobel 2003).',
            activeResidues: [75, 76, 77],
            dockingLog: 'SELECTIVITY FILTER: TVGYG signature filter oxygen rings aligned'
        },
        '1OKM': {
            name: 'Aquaporin-1 Water Channel',
            category: 'Membrane Channels & GPCRs',
            organism: 'Bos taurus (Cow)',
            function: 'Selective Cellular Water Transport',
            description: 'A membrane channel that allows rapid movement of water molecules across cell membranes while completely blocking protons and other ions.',
            activeResidues: [68, 180, 192],
            dockingLog: 'NPA STRUCTURAL GATE: Asn-68 & Asn-180 dipole filter aligned'
        },
        '2RH1': {
            name: 'beta2-Adrenergic Receptor',
            category: 'Membrane Channels & GPCRs',
            organism: 'Homo sapiens (Human)',
            function: 'Epinephrine G-Protein Signaling',
            description: 'A class A G-protein-coupled receptor (GPCR) that binds adrenaline and noradrenaline. Regulates smooth muscle relaxation, bronchial dilation, and vasodilation.',
            activeResidues: [113, 203, 289],
            dockingLog: 'CATECHOLAMINE POCKET: Asp-113 coordinates ligand binding'
        },
        '1F8A': {
            name: 'Bovine Rhodopsin (GPCR)',
            category: 'Membrane Channels & GPCRs',
            organism: 'Bos taurus (Cow)',
            function: 'Visual Phototransduction',
            description: 'The light-sensitive G-protein-coupled receptor of rod cells that initiates visual signals. Contains a covalently bound 11-cis-retinal chromophore.',
            activeResidues: [113, 296],
            dockingLog: 'SCHIFF BASE LINK: Retinal linked to Lys-296 active site'
        },

        // --- CATEGORY: Structure, Shell & Fibers ---
        '1UBQ': {
            name: 'Human Ubiquitin',
            category: 'Structure, Shell & Fibers',
            organism: 'Homo sapiens (Human)',
            function: 'Proteasome Protein Tagging',
            description: 'A small, highly conserved regulatory protein that serves as a molecular tag. Covalent attachment of ubiquitin chains targets target proteins for proteasomal degradation.',
            activeResidues: [48, 63, 76],
            dockingLog: 'DEGRADATION TAG LYSINE: Lys-48 & Lys-63 poly-UB anchors active'
        },
        '1C3D': {
            name: 'Collagen Triple Helix',
            category: 'Structure, Shell & Fibers',
            organism: 'Synthetic Construct',
            function: 'Extracellular Structural Core',
            description: 'A structural peptide mimicking the classic collagen triple helix geometry. Collagen is the primary structural protein in animal connective tissues.',
            activeResidues: [1, 10, 20],
            dockingLog: 'TRIPLE HELIX AXIS: Gly-Pro-Hyp structural repeats aligned'
        },
        '1ATU': {
            name: 'Alpha-Beta Tubulin Dimer',
            category: 'Structure, Shell & Fibers',
            organism: 'Bos taurus (Cow)',
            function: 'Microtubule Cytoskeletal Scaffold',
            description: 'The globular tubulin heterodimer that polymerizes to form microtubules, the major structural components of the eukaryotic cytoskeleton.',
            activeResidues: [142, 250],
            dockingLog: 'GTP-BINDING POCKET: Magnesium & phosphates aligned'
        },
        '1PGB': {
            name: 'G-Protein Binding Domain',
            category: 'Structure, Shell & Fibers',
            organism: 'Streptococcus',
            function: 'Immunoglobulin Binding',
            description: 'The highly stable B1 domain of Streptococcal Protein G. Extensively studied as a biophysical model for protein folding, design, and structural stability.',
            activeResidues: [8, 44, 47],
            dockingLog: 'FOLDING CORE STABILITY: Val-8 & Phe-30 core hydrophobic interaction'
        },
        '1L2Y': {
            name: 'Trp-Cage Peptide',
            category: 'Structure, Shell & Fibers',
            organism: 'Synthetic Construct',
            function: 'Protein Folding Model',
            description: 'A small synthetic 20-amino acid peptide that folds rapidly into a stable, globular structure. Crucial benchmark model for protein folding simulations.',
            activeResidues: [6, 8, 20],
            dockingLog: 'TRYPTOPHAN CAGE: Trp-6 hydrophobic cage stability mapped'
        },
        '1A02': {
            name: 'MHC Class I HLA-A2',
            category: 'Viral & Infectious Diseases',
            organism: 'Homo sapiens (Human)',
            function: 'Antigen Presentation & Immunity',
            description: 'The major histocompatibility complex (MHC) class I molecule HLA-A2. Displays viral/cancer peptide fragments to T-cells to trigger adaptive immune responses.',
            activeResidues: [9, 63, 159],
            dockingLog: 'PEPTIDE ANCHOR GROOVE: Tyr-9 & Tyr-159 bind antigen terminus'
        },
        '1DLH': {
            name: 'MHC Class II HLA-DR1',
            category: 'Viral & Infectious Diseases',
            organism: 'Homo sapiens (Human)',
            function: 'Helper T-Cell Immune Coordination',
            description: 'MHC Class II receptor expressed on antigen-presenting cells. Presents longer exogenous peptides to CD4+ Helper T-cells to orchestrate systemic immune defense.',
            activeResidues: [9, 81, 120],
            dockingLog: 'ANTIGEN POCKET P1: Gly-81 & Val-120 sequence alignment secured'
        },
        '5P21': {
            name: 'H-Ras Oncogene Protein',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Cellular Division Signal Switch',
            description: 'A small GTPase cell signaling switch that alternates between active GTP-bound and inactive GDP-bound states. Mutant forms are driver oncogenes in major human cancers.',
            activeResidues: [12, 61, 116],
            dockingLog: 'GTP HYDROLYSIS CENTER: Gly-12 & Gln-61 mutate to block switch off'
        },
        '1CFC': {
            name: 'Calmodulin (Calcium Bound)',
            category: 'Hormones, Signals & Receptors',
            organism: 'Xenopus laevis (Frog)',
            function: 'Intracellular Calcium Sensor',
            description: 'A ubiquitous calcium-binding messenger protein. Undergoes dramatic structural changes upon binding four calcium ions, activating kinase and phosphatase signaling downstream.',
            activeResidues: [20, 56, 93, 129],
            dockingLog: 'EF-HAND CALCIUM LOOP: Asp-20 & Glu-31 chelate calcium ions'
        },
        '1A52': {
            name: 'Estrogen Receptor Alpha',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Estrogenic Transcription Control',
            description: 'A ligand-activated nuclear receptor transcription factor that binds 17-beta-estradiol, regulating female reproductive development, cardiovascular health, and bone density.',
            activeResidues: [347, 353, 521],
            dockingLog: 'ESTROGEN BINDING CAVITY: Glu-353 & Arg-394 bind phenolic oxygen'
        },
        '3ERD': {
            name: 'Estrogen Receptor / DES',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Estrogenic Transcription Agonism',
            description: 'The Estrogen Receptor alpha ligand-binding domain complexed with the potent synthetic estrogen agonist Diethylstilbestrol (DES), showcasing structural agonist locks.',
            activeResidues: [353, 394, 521],
            dockingLog: 'STILBESTROL ALIGNMENT: Glu-353 coordinates synthetic agonist anchor'
        },
        '1AQD': {
            name: 'Progesterone Receptor',
            category: 'Hormones, Signals & Receptors',
            organism: 'Homo sapiens (Human)',
            function: 'Progestational Transcription Control',
            description: 'A nuclear receptor activated by progesterone. Essential for maintaining uterine lining thickness, supporting pregnancy, and regulating female menstrual cycles.',
            activeResidues: [706, 755, 803],
            dockingLog: 'STEROID BINDING POCKET: Gln-725 & Arg-766 lock steroid carbonyl'
        },
        '2RH1': {
            name: 'Beta-2 Adrenergic Receptor',
            category: 'Membrane Channels & GPCRs',
            organism: 'Homo sapiens (Human)',
            function: 'Epinephrine/Adrenaline Response',
            description: 'A classic G-protein coupled receptor (GPCR) activated by adrenaline. Directs smooth muscle relaxation in airways and blood vessels. High-profile drug target.',
            activeResidues: [113, 203, 289],
            dockingLog: 'CATECHOLAMINE ANCHOR: Asp-113 coordinates positive amine head'
        },
        '2POR': {
            name: 'Bacterial Porin Channel',
            category: 'Membrane Channels & GPCRs',
            organism: 'Rhodobacter capsulatus',
            function: 'Outer Membrane Passive Diffusion',
            description: 'A trimeric membrane channel showcasing a large beta-barrel structure. Allows passive diffusion of small hydrophilic nutrients across the outer cell wall.',
            activeResidues: [16, 109, 120],
            dockingLog: 'TRANS-BARREL CONSTRICTION DIAPHRAGM: Lys-16 & Glu-109 ion gates'
        },
        '3CPK': {
            name: 'Protein Kinase A (PKA)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Mus musculus (Mouse)',
            function: 'cAMP-Dependent Signal Cascades',
            description: 'A structural prototype of the protein kinase superfamily. Phosphorylates target enzymes in response to cellular cyclic AMP (cAMP) levels.',
            activeResidues: [72, 166, 184],
            dockingLog: 'ATP-CATALYTIC LOOP: Lys-72 & Asp-166 transfer phosphate groups'
        },
        '1Y26': {
            name: 'c-Src Tyrosine Kinase (Closed)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Homo sapiens (Human)',
            function: 'Cellular Growth Signal Gatekeeper',
            description: 'A non-receptor tyrosine kinase that plays key roles in cell growth, adhesion, and migration. Over-activation of mutant Src is highly oncogenic.',
            activeResidues: [295, 404, 527],
            dockingLog: 'SRC AUTO-INHIBITION SHIELD: Phospho-Tyr-527 locks SH2 domain closed'
        },
        '1QCF': {
            name: 'c-Src Tyrosine Kinase (Open)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Homo sapiens (Human)',
            function: 'Active Cellular Growth Cascade',
            description: 'The structurally activated, open conformation of Src kinase. Lacks the C-terminal tail phosphorylation block, leaving the ATP cleft open to bind substrate.',
            activeResidues: [295, 404],
            dockingLog: 'SRC CATALYTIC CLETT: Lys-295 active target transfer site exposed'
        },
        '1RD8': {
            name: 'RuBisCO CO2-Fixer',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Spinacia oleracea (Spinach)',
            function: 'Photosynthetic Carbon Fixation',
            description: 'Ribulose-1,5-bisphosphate carboxylase/oxygenase. The primary carbon-fixing enzyme in photosynthesis and the most abundant enzyme on Earth.',
            activeResidues: [175, 201, 328],
            dockingLog: 'CARBAMYLATED ACTIVE LYSINE: Lys-201 coordinates magnesium core'
        },
        '1R2A': {
            name: 'Ribonuclease A (RNase A)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Bos taurus (Cow)',
            function: 'RNA Cleavage & Degradation',
            description: 'A classic pancreatic ribonuclease that cleaves single-stranded RNA. Highly studied biophysical model of protein folding, denaturation, and disulfide bridges.',
            activeResidues: [12, 119, 121],
            dockingLog: 'RNase CATALYTIC PAIR: His-12 & His-119 transfer proton vectors'
        },
        '1SAR': {
            name: 'Ribonuclease Sa (RNase Sa)',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Streptomyces aureofaciens',
            function: 'Bacterial Extracellular RNA Cleavage',
            description: 'An acidic ribonuclease secreted by bacteria. Used extensively to study the physical forces governing protein stability and charge-charge interactions.',
            activeResidues: [33, 40, 79],
            dockingLog: 'BIVALENT ACTIVE SLOT: Glu-54 & His-85 target phosphodiester bonds'
        },
        '3PGK': {
            name: 'Phosphoglycerate Kinase',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Saccharomyces cerevisiae (Yeast)',
            function: 'Glycolysis ATP Generation',
            description: 'A key glycolytic enzyme that catalyzes the reversible transfer of a phosphate group from 1,3-bisphosphoglycerate to ADP, yielding ATP.',
            activeResidues: [219, 373, 374],
            dockingLog: 'GLYCOLYSIS HINGE ACTIVE: Asp-219 & Lys-374 bind substrate'
        },
        '2ATC': {
            name: 'Aspartate Transcarbamoylase',
            category: 'Enzymes & Metabolic Catalysts',
            organism: 'Escherichia coli',
            function: 'Pyrimidine Synthesis Committer',
            description: 'A classic model of allosteric enzyme regulation. Catalyzes the first step of pyrimidine nucleotide synthesis, regulated by feedback inhibition (CTP/ATP).',
            activeResidues: [80, 128, 134],
            dockingLog: 'ALLOSTERIC T-STATE SLOT: Arg-128 stabilizes regulatory loop'
        },
        '1EFU': {
            name: 'Elongation Factor Tu (EF-Tu)',
            category: 'Genetics, CRISPR & Ribosome',
            organism: 'Escherichia coli',
            function: 'Ribosomal tRNA Delivery',
            description: 'An essential translation factor that delivers aminoacyl-tRNA molecules to the ribosomal A-site during protein synthesis, powered by GTP hydrolysis.',
            activeResidues: [18, 20, 84],
            dockingLog: 'GTP-SLOT REGULATOR: Thr-61 coordinates GTP-stabilized tRNA binding'
        },
        '4TNC': {
            name: 'Skeletal Troponin C',
            category: 'Structure, Shell & Fibers',
            organism: 'Meleagris gallopavo (Turkey)',
            function: 'Calcium-Triggered Muscle Contraction',
            description: 'The calcium-binding subunit of the troponin complex. Calcium binding induces a major conformational shift that moves tropomyosin, exposing myosin binding sites.',
            activeResidues: [29, 65, 105, 141],
            dockingLog: 'TROPONIN CONFORMATION SHIFT: Asp-65 coordinates calcium switch'
        },
        '7DF2': {
            name: 'Alpha-Synuclein Fibril',
            category: 'Structure, Shell & Fibers',
            organism: 'Homo sapiens (Human)',
            function: 'Amyloid Fibril Core / Pathology',
            description: 'The pathological amyloid fibril fold of alpha-synuclein. Aggregates of these fibrils form Lewy Bodies, the hallmark pathological feature of Parkinson\'s Disease.',
            activeResidues: [45, 50, 80],
            dockingLog: 'AMYLOID STACK BETA-SHEET: Thr-59 & Glu-61 interlock fibril layers'
        },
        '2MHR': {
            name: 'Myohemerythrin Metalloprotein',
            category: 'Structure, Shell & Fibers',
            organism: 'Themiste lissum (Marine Worm)',
            function: 'Non-Heme Iron Oxygen Transport',
            description: 'A monomeric oxygen-transport protein that uses a dimeric non-heme iron center to bind oxygen, providing a unique alternative to hemoglobin.',
            activeResidues: [25, 54, 73, 106],
            dockingLog: 'BINUCLEAR IRON CORE: His-73 & His-106 coordinate non-heme iron'
        }
    },

    /**
     * Fetch PDB text data and entry metadata
     * @param {string} pdbId - 4-character PDB code (e.g. '1hsg')
     * @returns {Promise<{pdbText: string, metadata: object}>}
     */
    async fetchPDBModel(pdbId) {
        const cleanId = pdbId.trim().toUpperCase();
        const downloadUrl = `${this.PDB_DOWNLOAD_URL}${cleanId.toLowerCase()}.pdb`;
        const infoUrl = `${this.PDB_INFO_URL}${cleanId.toLowerCase()}`;

        try {
            // Fetch PDB File
            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error(`Failed to download PDB file. Status: ${response.status}`);
            }
            const pdbText = await response.text();

            // Fetch Metadata (Title, Resolution, Method)
            let metadata = {
                id: cleanId,
                title: 'Custom Protein Structure',
                method: 'X-Ray Diffraction',
                resolution: 'N/A',
                organism: 'Unknown Organism',
                function: 'Unclassified',
                description: 'Custom molecular structure fetched dynamically from the RCSB Protein Data Bank.'
            };

            // Merge with predefined info if matching a famous protein
            const famousInfo = this.famousProteins[cleanId];
            if (famousInfo) {
                metadata.organism = famousInfo.organism;
                metadata.function = famousInfo.function;
                metadata.description = famousInfo.description;
            }

            try {
                const infoResponse = await fetch(infoUrl);
                if (infoResponse.ok) {
                    const infoJSON = await infoResponse.json();
                    
                    if (infoJSON.struct && infoJSON.struct.title) {
                        metadata.title = infoJSON.struct.title;
                    }
                    if (infoJSON.exptl && infoJSON.exptl[0] && infoJSON.exptl[0].method) {
                        metadata.method = infoJSON.exptl[0].method;
                    }
                    if (infoJSON.rcsb_entry_info && infoJSON.rcsb_entry_info.resolution_combined) {
                        metadata.resolution = infoJSON.rcsb_entry_info.resolution_combined[0].toFixed(2) + ' Å';
                    }
                }
            } catch (err) {
                console.warn('Could not fetch additional PDB metadata from RCSB API.', err);
            }

            return { pdbText, metadata };
        } catch (error) {
            console.error('Error fetching PDB Model:', error);
            throw error;
        }
    },

    /**
     * Search and retrieve compound data from PubChem by name
     * @param {string} name - Common drug or chemical name (e.g. 'aspirin')
     * @returns {Promise<object>} - Compound metadata and structures
     */
    async searchCompound(name) {
        const cleanName = encodeURIComponent(name.trim().toLowerCase());
        const propertiesUrl = `${this.PUBCHEM_PUG_URL}name/${cleanName}/property/Title,MolecularFormula,MolecularWeight,XLogP,CanonicalSMILES/JSON`;

        try {
            // 1. Fetch properties
            const propResponse = await fetch(propertiesUrl);
            if (!propResponse.ok) {
                throw new Error(`No matching compound found for "${name}"`);
            }
            const propData = await propResponse.json();
            
            if (!propData.PropertyTable || !propData.PropertyTable.Properties || propData.PropertyTable.Properties.length === 0) {
                throw new Error(`Invalid chemical data returned for "${name}"`);
            }

            const properties = propData.PropertyTable.Properties[0];
            const cid = properties.CID;

            // 2. Fetch Description (Synopses)
            let description = 'No description available in PubChem for this compound.';
            try {
                const descUrl = `${this.PUBCHEM_PUG_URL}cid/${cid}/description/JSON`;
                const descResponse = await fetch(descUrl);
                if (descResponse.ok) {
                    const descData = await descResponse.json();
                    if (descData.InformationList && descData.InformationList.Information) {
                        const descObj = descData.InformationList.Information.find(info => info.Description);
                        if (descObj) {
                            description = descObj.Description;
                        } else {
                            const abstractObj = descData.InformationList.Information.find(info => info.DescriptionAbstract);
                            if (abstractObj) {
                                description = abstractObj.DescriptionAbstract;
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn(`Failed to fetch description for CID: ${cid}`, err);
            }

            // 3. Fetch 3D SDF Data
            // We first try to fetch 3D SDF coordinates. If that fails (since some structures are 2D only), we fetch 2D coordinates.
            let sdfText = null;
            let coordinatesType = '3d';

            try {
                const sdf3dUrl = `${this.PUBCHEM_PUG_URL}cid/${cid}/SDF?record_type=3d`;
                const sdfResponse = await fetch(sdf3dUrl);
                if (sdfResponse.ok) {
                    sdfText = await sdfResponse.text();
                } else {
                    throw new Error('3D structure unavailable, falling back to 2D');
                }
            } catch (e) {
                console.log(`3D structure not available for CID: ${cid}. Fetching 2D SDF...`);
                try {
                    const sdf2dUrl = `${this.PUBCHEM_PUG_URL}cid/${cid}/SDF?record_type=2d`;
                    const sdfResponse = await fetch(sdf2dUrl);
                    if (sdfResponse.ok) {
                        sdfText = await sdfResponse.text();
                        coordinatesType = '2d';
                    }
                } catch (err2D) {
                    console.error('Failed to fetch 2D coordinates.', err2D);
                }
            }

            return {
                cid: cid,
                name: properties.Title || name,
                formula: properties.MolecularFormula,
                mw: parseFloat(properties.MolecularWeight),
                logp: properties.XLogP !== undefined ? parseFloat(properties.XLogP) : 0.0,
                smiles: properties.CanonicalSMILES,
                description: description,
                sdfText: sdfText,
                coordinatesType: coordinatesType
            };
        } catch (error) {
            console.error('PubChem search failed:', error);
            throw error;
        }
    }
};

// Make it globally accessible
window.BioSynthDatabase = BioSynthDatabase;
