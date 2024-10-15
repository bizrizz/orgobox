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
            const compound = parsedData?.Record ? parsedData.Record : null;

            if (compound) {
                // Display compound name
                document.getElementById('compound-name').innerHTML = `<h2>${compound.RecordTitle}</h2>`;

                // Display molecular formula
                const formulaSection = compound.Section.find(section => section.TOCHeading === "Molecular Formula");
                document.getElementById('molecular-formula').innerHTML = formulaSection
                    ? `<h4>Molecular Formula:</h4><p>${formulaSection.Information[0].Value.StringWithMarkup[0].String}</p>`
                    : `<h4>Molecular Formula:</h4><p>Not available</p>`;

                // Display molecular weight
                const weightSection = compound.Section.find(section => section.TOCHeading === "Molecular Weight");
                document.getElementById('molecular-weight').innerHTML = weightSection
                    ? `<h4>Molecular Weight:</h4><p>${weightSection.Information[0].Value.Number[0]}</p>`
                    : `<h4>Molecular Weight:</h4><p>Not available</p>`;

                // Display synonyms
                const synonymsSection = compound.Section.find(section => section.TOCHeading === "Synonyms");
                const synonyms = synonymsSection ? synonymsSection.Information[0].Value.StringWithMarkup.map(item => item.String) : [];
                document.getElementById('synonyms').innerHTML = synonyms.length > 0
                    ? `<h4>Synonyms:</h4><p>${synonyms.join(', ')}</p>`
                    : `<h4>Synonyms:</h4><p>Not available</p>`;

                // Display additional information link
                document.getElementById('more-info').innerHTML = `<h4>More Information:</h4><p><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${compound.RecordNumber}" target="_blank">More details on PubChem</a></p>`;
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
