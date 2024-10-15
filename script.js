document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM fully loaded and parsed.');

    function loadScript(src, callback) {
        console.log(`Attempting to load script: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = function () {
            console.log(`Script loaded successfully: ${src}`);
            callback();
        };
        script.onerror = function () {
            console.error(`Failed to load script: ${src}`);
            alert(`Error loading script: ${src}. Please try again.`);
        };
        document.head.appendChild(script);
    }

    // Load OpenChemLib dynamically
    loadScript('https://unpkg.com/openchemlib/full.js', function () {
        if (typeof OCL === 'undefined') {
            console.error('OpenChemLib (OCL) did not initialize correctly.');
            alert('Failed to initialize OpenChemLib. Please refresh the page.');
            return;
        }

        console.log('OpenChemLib loaded and ready to use.');

        // Attach the function to the search button once OpenChemLib is loaded
        const searchButton = document.querySelector("button");
        if (searchButton) {
            searchButton.addEventListener("click", function () {
                console.log('Search button clicked.');
                searchChemical();
            });
        } else {
            console.error('Search button not found.');
        }
    });

    async function searchChemical() {
        console.log('searchChemical function invoked.');
        const chemical = document.getElementById('chemical-input').value;
        if (!chemical) {
            alert('Please enter a chemical formula or name.');
            return;
        }

        console.log(`Searching for chemical: ${chemical}`);

        // PubChem API URL
        const pubChemUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemical}/record/SDF/?record_type=2d&response_type=display`;

        // Use AllOrigins API to bypass CORS
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pubChemUrl)}`;

        try {
            console.log('Fetching chemical data...');
            const response = await fetch(allOriginsUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}, StatusText: ${response.statusText}`);
            }

            const data = await response.json();
            const sdfContent = data.contents;
            console.log('Chemical data fetched successfully.');

            // Display the compound name
            document.getElementById('compound-name').innerHTML = `<h2>${chemical.charAt(0).toUpperCase() + chemical.slice(1)}</h2>`;

            // Display 2D representation using OpenChemLib
            if (typeof OCL !== 'undefined') {
                console.log('Rendering 2D structure using OpenChemLib.');
                const molecule = OCL.Molecule.fromMolfile(sdfContent);
                const svg = molecule.toSVG(400, 300); // SVG rendering
                document.getElementById('line-structure-sketcher').innerHTML = svg;
            } else {
                throw new Error('OpenChemLib (OCL) is not initialized.');
            }

            // 3D model view using 3Dmol.js
            console.log('Rendering 3D model using 3Dmol.js.');
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
});
