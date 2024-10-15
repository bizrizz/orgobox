async function searchChemical() {
    const chemical = document.getElementById('chemical-input').value;
    if (!chemical) {
        alert('Please enter a chemical formula or name.');
        return;
    }

    // PubChem API URL
    const pubChemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/JSON`;

    // Use AllOrigins API to bypass CORS
    const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pubChemUrl)}`;

    try {
        const response = await fetch(allOriginsUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, StatusText: ${response.statusText}`);
        }

        const data = await response.json();

        // Properly parse the JSON content returned by AllOrigins
        const jsonResponse = JSON.parse(data.contents); // Extract the actual content
        const compound = jsonResponse.PC_Compounds ? jsonResponse.PC_Compounds[0] : null;

        if (compound) {
            // Display line structure (placeholder)
            document.getElementById('line-structure').innerHTML = `<h4>Line Structure:</h4><p>Line structure for ${chemical}...</p>`;

            // Display Lewis structure (placeholder)
            document.getElementById('lewis-structure').innerHTML = `<h4>Lewis Structure:</h4><p>Lewis structure for ${chemical}...</p>`;

            // Display chemical names
            document.getElementById('chemical-names').innerHTML = `<h4>Names:</h4><p>${compound.props.map(prop => prop.urn.label + ': ' + prop.value.sval).join(', ')}</p>`;

            // Display stereoisomers (placeholder)
            document.getElementById('stereoisomers').innerHTML = `<h4>Stereoisomers:</h4><p>Stereoisomers for ${chemical}...</p>`;

            // Display chemical properties (e.g., molecular weight)
            const molecularWeight = compound.props.find(prop => prop.urn.label === 'Molecular Weight');
            document.getElementById('chemical-properties').innerHTML = `<h4>Chemical Properties:</h4><p>Molecular weight: ${molecularWeight ? molecularWeight.value.fval : 'N/A'}</p>`;

            // Display more information (link to PubChem)
            document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${compound.id.id.cid}" target="_blank">More details on PubChem</a></p>`;
        } else {
            alert('No information found for the given chemical.');
        }
    } catch (error) {
        console.error('Error fetching chemical data:', error);
        alert(`There was an error retrieving the chemical information. Details: ${error.message}`);
    }

    // 3D model view using 3Dmol.js
    const container = document.getElementById('three-d-view');
    container.innerHTML = '<h4>3D Model:</h4>';
    const viewer = $3Dmol.createViewer(container, { backgroundColor: 'white' });
    viewer.addModel('CCO', 'sdf'); // Placeholder: replace with proper model
    viewer.setStyle({}, { stick: {} });
    viewer.zoomTo();
    viewer.render();
}
