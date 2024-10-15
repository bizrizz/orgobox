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
        const jsonResponse = JSON.parse(data.contents);
        console.log('Parsed JSON response:', jsonResponse);

        const compound = jsonResponse.PC_Compounds ? jsonResponse.PC_Compounds[0] : null;

        if (compound) {
            const props = compound.props || [];

            // Extracting relevant properties
            const molecularWeightProp = props.find(prop => prop.urn.label === 'Molecular Weight');
            const molecularWeight = molecularWeightProp ? molecularWeightProp.value.fval : 'N/A';

            const synonyms = compound.synonyms ? compound.synonyms.join(', ') : 'N/A';

            const molecularFormula = props.find(prop => prop.urn.label === 'Molecular Formula');
            const molecularFormulaValue = molecularFormula ? molecularFormula.value.sval : 'N/A';

            const compoundCID = compound.id && compound.id.id && compound.id.id.cid ? compound.id.id.cid : null;

            // Update the HTML to display the information
            document.getElementById('compound-name').innerHTML = `<h2>${chemical.charAt(0).toUpperCase() + chemical.slice(1)}</h2>`;
            document.getElementById('molecular-formula').innerHTML = `<h4>Molecular Formula:</h4><p>${molecularFormulaValue}</p>`;
            document.getElementById('molecular-weight').innerHTML = `<h4>Molecular Weight:</h4><p>${molecularWeight} g/mol</p>`;
            document.getElementById('synonyms').innerHTML = `<h4>Synonyms:</h4><p>${synonyms}</p>`;
            document.getElementById('safety').innerHTML = `<h4>Chemical Safety:</h4><p>Safety information not available from this endpoint</p>`;

            // Display more information (link to PubChem)
            if (compoundCID) {
                document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${compoundCID}" target="_blank">More details on PubChem</a></p>`;
            } else {
                document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p>No additional information available</p>`;
            }
        } else {
            alert('No information found for the given chemical.');
        }
    } catch (error) {
        console.error('Error fetching chemical data:', error);
        alert(`There was an error retrieving the chemical information. Details: ${error.message}`);
    }
}
