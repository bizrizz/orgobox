document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM fully loaded and parsed.');

    async function searchChemical() {
        console.log('searchChemical function invoked.');
        const chemical = document.getElementById('chemical-input').value;
        if (!chemical) {
            alert('Please enter a chemical formula or name.');
            return;
        }

        console.log(`Searching for chemical: ${chemical}`);

        // PubChem API URL
        const pubChemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/JSON`;

        // Use AllOrigins API to bypass CORS
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pubChemUrl)}`;

        try {
            console.log('Fetching chemical data...');
            const response = await fetch(allOriginsUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, StatusText: ${response.statusText}`);
            }

            const data = await response.json();
            const parsedData = JSON.parse(data.contents);

            if (parsedData && parsedData.PC_Compounds && parsedData.PC_Compounds.length > 0) {
                const compoundInfo = parsedData.PC_Compounds[0];

                // Display compound name
                document.getElementById('compound-name').innerHTML = `<h2>${chemical.charAt(0).toUpperCase() + chemical.slice(1)}</h2>`;

                // Display molecular formula
                const molecularFormula = compoundInfo.props?.find(prop => prop.urn.label === 'Molecular Formula');
                document.getElementById('molecular-formula').innerHTML = molecularFormula
                    ? `<h4>Molecular Formula:</h4><p>${molecularFormula.value.sval}</p>`
                    : `<h4>Molecular Formula:</h4><p>Not available</p>`;

                // Display molecular weight
                const molecularWeight = compoundInfo.props?.find(prop => prop.urn.label === 'Molecular Weight');
                document.getElementById('molecular-weight').innerHTML = molecularWeight
                    ? `<h4>Molecular Weight:</h4><p>${molecularWeight.value.fval}</p>`
                    : `<h4>Molecular Weight:</h4><p>Not available</p>`;

                // Display synonyms
                const synonyms = compoundInfo.props?.filter(prop => prop.urn.label.includes('Name')).map(prop => prop.value.sval);
                document.getElementById('synonyms').innerHTML = synonyms && synonyms.length > 0
                    ? `<h4>Synonyms:</h4><p>${synonyms.join(', ')}</p>`
                    : `<h4>Synonyms:</h4><p>Not available</p>`;

                // Display additional information link
                const cid = compoundInfo.id?.id?.cid;
                document.getElementById('more-info').innerHTML = cid
                    ? `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${cid}" target="_blank">More details on PubChem</a></p>`
                    : `<h4>More Information:</h4><p>Not available</p>`;

            } else {
                console.log('Parsed data structure:', parsedData);
                alert('No information found for the given chemical.');
            }
        } catch (error) {
            console.error('Error fetching chemical data:', error);
            alert(`There was an error retrieving the chemical information. Details: ${error.message}`);
        }
    }

    // Attach the function to the search button
    document.querySelector("button").addEventListener("click", searchChemical);
});
