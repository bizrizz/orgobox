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
        const sdfContent = data.contents;

        // Display the compound name
        document.getElementById('compound-name').innerHTML = `<h2>${chemical.charAt(0).toUpperCase() + chemical.slice(1)}</h2>`;

        // Display 2D representation using OpenChemLib
        const molecule = OCL.Molecule.fromMolfile(sdfContent);
        const svg = molecule.toSVG(400, 300); // SVG rendering
        document.getElementById('line-structure-sketcher').innerHTML = svg;

        // 3D model view using 3Dmol.js
        const container = document.getElementById('three-d-view');
        container.innerHTML = '';
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
