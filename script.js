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
            const compound = data?.PC_Compounds ? data.PC_Compounds[0] : null;
            console.log('Chemical data fetched successfully.');

            if (compound) {
                // Display compound name
                document.getElementById('compound-name').innerHTML = `<h2>${chemical.charAt(0).toUpperCase() + chemical.slice(1)}</h2>`;

                // Display molecular formula
                document.getElementById('molecular-formula').innerHTML = `<h4>Molecular Formula:</h4><p>${compound.props.find(prop => prop.urn.label === 'Molecular Formula').value.sval}</p>`;

                // Display molecular weight
                document.getElementById('molecular-weight').innerHTML = `<h4>Molecular Weight:</h4><p>${compound.props.find(prop => prop.urn.label === 'Molecular Weight').value.fval}</p>`;

                // Display synonyms
                document.getElementById('synonyms').innerHTML = `<h4>Synonyms:</h4><p>${compound.props.filter(prop => prop.urn.label.includes('Name')).map(prop => prop.value.sval).join(', ')}</p>`;

                // Display additional information link
                document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${compound.id.id.cid}" target="_blank">More details on PubChem</a></p>`;
            } else {
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
