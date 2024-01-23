document.addEventListener("selectionchange", (event) => {
    const selection = document.getSelection().toString();
    console.log(selection);

    if (!selection || selection == "" || selection.length <=2) {
        return;
    }

    const splitSelection = selection.split(" ");

    if (splitSelection.length == 1) {
        try {
            // Use dictionary API to define the text/text phrase.
            fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selection)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                if (data.length == 0) {
                    return;
                }

                const result = data[0];
                const options = result.meanings;

                // Find the part of speech with the most results. I believe that is likely to be the correct one.
                var definitionData;
                var definitionMax = 0;

                for (let option of options) {
                    const newLength = option.definitions.length;
                    if (newLength > definitionMax) {
                        definitionData = option;
                        definitionMax = newLength;
                    }
                }

                document.getElementById("selected-word").textContent = result.word;
                document.getElementById("procunciation").textContent = result.phonetic;
                document.getElementById("pos").textContent = definitionData.partOfSpeech;
                document.getElementById("definition").textContent = definitionData.definitions[0].definition;

                // Add a link to the full definition
                document.getElementById("source-link").onclick = function() {
                    window.open(result.sourceUrls[0], "_blank");
                }
                
                // Add synonyms section for the word
                const synonyms = document.getElementById("synonyms");
                synonyms.textContent = ""; // Reset the list of synonyms
                const synLength = definitionData.synonyms.length;
                var count = 0;

                while (count < 5 && count < synLength) {
                    var synonym = definitionData.synonyms[count];

                    if (synonyms.textContent == "") {
                        synonyms.textContent = synonym;
                    } else {
                        synonyms.textContent = synonyms.textContent + ", " + synonym;
                    }

                    count++;
                }

                if (synonyms.textContent == "") {
                    synonyms.textContent = "None";
                    synonyms.classList.replace("full-list", "empty-list");
                } else {
                    synonyms.classList.replace("empty-list", "full-list");
                }
            });
        } catch (error) {
            console.log("caught!")
            document.getElementById("selected-word").textContent = "No results found for '" + selection + "'.";
        }
    }
})
