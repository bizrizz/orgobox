async function searchChemical() {
    const chemical = document.getElementById('chemical-input').value;
    if (!chemical) {
        alert('Please enter a chemical formula or name.');
        return;
    }

    // PubChem API URL
    const pubChemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/record/SDF/?record_type=2d&response_type=display`;

    // Use AllOrigins API to bypass CORS
    const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pubChemUrl)}`;

    try {
        const response = await fetch(allOriginsUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, StatusText: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract SDF content from the response
        const sdfContent = data.contents;

        // Display 2D representation using ChemDoodle
        const lineStructureDiv = document.getElementById('line-structure');
        lineStructureDiv.innerHTML = '<h4>2D Structure:</h4>';
        const sketcher = new ChemDoodle.ViewerCanvas('line-structure-sketcher', 400, 300);
        lineStructureDiv.appendChild(sketcher.getHTMLContainer());
        sketcher.loadMolecule(ChemDoodle.readMOL(sdfContent));

        // 3D model view using 3Dmol.js
        const container = document.getElementById('three-d-view');
        container.innerHTML = '<h4>3D Model:</h4>';
        const viewer = $3Dmol.createViewer(container, { backgroundColor: 'white' });
        viewer.addModel(sdfContent, 'sdf'); // Load the fetched SDF content for the 3D model
        viewer.setStyle({}, { stick: {} });
        viewer.zoomTo();
        viewer.render();
    } catch (error) {
        console.error('Error fetching chemical data:', error);
        alert(`There was an error retrieving the chemical information. Details: ${error.message}`);
    }
}
