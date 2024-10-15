<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organic Chemistry Explorer</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://unpkg.com/3dmol/build/3Dmol-min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chemdoodle@9.1.0/build/chemdoodle.min.js"></script>
</head>
<body>
    <header>
        <h1>Organic Chemistry Explorer</h1>
    </header>
    
    <main>
        <section id="input-section">
            <h2>Find Chemical Structures and Information</h2>
            <input type="text" id="chemical-input" placeholder="Enter chemical formula or name">
            <button onclick="searchChemical()">Search</button>
        </section>

        <section id="results-section">
            <h3>Results:</h3>
            <div id="line-structure"></div>
            <div id="lewis-structure"></div>
            <div id="chemical-names"></div>
            <div id="stereoisomers"></div>
            <div id="chemical-properties"></div>
            <div id="more-info"></div>
            <div id="three-d-view"></div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Organic Chemistry Explorer</p>
    </footer>

    <script>
        async function searchChemical() {
            const chemical = document.getElementById('chemical-input').value;
            if (!chemical) {
                alert('Please enter a chemical formula or name.');
                return;
            }

            // Use PubChem API to fetch chemical information with CORS proxy
            const pubChemUrl = `https://cors-anywhere.herokuapp.com/https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/JSON`;
            try {
                const response = await fetch(pubChemUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const compound = data.PC_Compounds ? data.PC_Compounds[0] : null;

                if (compound) {
                    // Display line structure using ChemDoodle
                    const lineStructureDiv = document.getElementById('line-structure');
                    lineStructureDiv.innerHTML = '<h4>Line Structure:</h4>';
                    const sketcher = new ChemDoodle.SketcherCanvas('line-structure-sketcher', 400, 300);
                    lineStructureDiv.appendChild(sketcher.getHTMLContainer());
                    sketcher.loadMolecule(ChemDoodle.readMOL(compound.props[0].value.sval));
                    
                    // Display Lewis structure (placeholder)
                    document.getElementById('lewis-structure').innerHTML = `<h4>Lewis Structure:</h4><p>Lewis structure for ${chemical}...</p>`;

                    // Display chemical names
                    document.getElementById('chemical-names').innerHTML = `<h4>Names:</h4><p>${compound.props.map(prop => prop.urn.label + ': ' + prop.value.sval).join(', ')}</p>`;

                    // Display stereoisomers (placeholder)
                    document.getElementById('stereoisomers').innerHTML = `<h4>Stereoisomers:</h4><p>Stereoisomers for ${chemical}...</p>`;

                    // Display chemical properties (e.g., molecular weight)
                    document.getElementById('chemical-properties').innerHTML = `<h4>Chemical Properties:</h4><p>Molecular weight: ${compound.props.find(prop => prop.urn.label === 'Molecular Weight').value.fval}</p>`;

                    // Display more information (link to PubChem)
                    document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${compound.id.id.cid}" target="_blank">More details on PubChem</a></p>`;
                } else {
                    alert('No information found for the given chemical.');
                }
            } catch (error) {
                console.error('Error fetching chemical data:', error);
                alert('There was an error retrieving the chemical information. Please try again later.');
            }

            // 3D model view using 3Dmol.js
            const container = document.getElementById('three-d-view');
            container.innerHTML = '<h4>3D Model:</h4>';
            const viewer = $3Dmol.createViewer(container, { backgroundColor: 'white' });
            viewer.addModel('CCO', 'sdf'); // Placeholder: use a proper chemical formula or structure
            viewer.setStyle({}, { stick: {} });
            viewer.zoomTo();
            viewer.render();
        }
    </script>
</body>
</html>
