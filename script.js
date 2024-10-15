// script.js

async function searchChemical() {
    const chemical = document.getElementById('chemical-input').value;
    if (!chemical) {
        alert('Please enter a chemical formula or name.');
        return;
    }

    // Use PubChem API to fetch chemical information
    const pubChemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/JSON`;
    try {
        const response = await fetch(pubChemUrl);
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
