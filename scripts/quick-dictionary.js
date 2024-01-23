console.log("crying")

document.addEventListener("selectionchange", (event) => {
    const selection = document.getSelection().toString();

    if (!selection || selection == "" || selection.length <= 2) {
        hidePopup();
        return;
    }

    const splitSelection = selection.split(" ");
    if (splitSelection.length == 1) {
        var qdPopup = document.getElementById("quick-dictionary-popup");
        if (!qdPopup) {
            qdPopup = document.createElement("div");
            qdPopup.id = "quick-dictionary-popup";
            document.body.append(qdPopup);
        }

        showPopup();

        try {
            // Use dictionary API to define the text/text phrase.
            fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selection)
            .then(response => {
                if (!response.ok) {
                    qdPopup.innerHTML = "";       
                    qdPopup.append(createLogo(), createFailurePanel(selection));

                    return;
                } else {
                    return response.json()
                }
            }).then(data => {
                console.log(data)
                if (!data || data.length == 0) {
                    hidePopup();
                    return;
                }
                qdPopup.innerHTML = "";

                const result = data[0];
                const options = result.meanings;

                // Find the most likely top definition based on how many definitions per part of speech
                var definitionData;
                var definitionMax = 0;
                for (let option of options) {
                    const newLength = option.definitions.length;
                    if (newLength > definitionMax) {
                        definitionData = option;
                        definitionMax = newLength;
                    }
                }

                const resultPanel = createSuccessPanel(
                    result.word, 
                    result.phonetic, 
                    definitionData.partOfSpeech, 
                    definitionData.definitions.slice(0, 2),
                    definitionData.synonyms.slice(0, 4),
                    result.sourceUrl
                );

                qdPopup.append(createLogo(), resultPanel);
            });
        } catch (error) {
            qdPopup.append(createLogo(), createFailurePanel(selection));
        }
    } else {
        hidePopup();
    }
})

function createLogo() {
    const logoContainer = document.createElement("div");
    logoContainer.id = "logo-container";

    const logoImg = document.createElement("img");
    logoImg.src = chrome.runtime.getURL("images/quick-dictionary-logo-long.png");
    logoImg.alt = "Quick dictionary logo";

    logoContainer.append(logoImg);
    return logoContainer;
}

function createSuccessPanel(word, ipa, pos, definitions, synonyms, sourceUrl) {
    // Create header section
    const selectedWord = document.createElement("h1");
    selectedWord.id = "selected-word";
    selectedWord.textContent = word;

    const qdHeader = document.createElement("div");
    qdHeader.id = "qd-header";

    const separator = document.createElement("p");
    const procunciation = document.createElement("h2");
    if (ipa != "") {
        separator.id = "separator";
        separator.textContent = "•";
    
        procunciation.id = "pronunciation";
        procunciation.textContent = ipa;

        // Add selected word and pronunciation
        qdHeader.append(selectedWord, separator, procunciation);
    } else {
        // Add only selected word
        qdHeader.append(selectedWord);
    }

    // Create body section, including definition
    const breakLine = document.createElement("hr");

    const partOfSpeech = document.createElement("h2");
    partOfSpeech.id = "pos";
    partOfSpeech.textContent = pos;

    const defList = document.createElement("ol");
    defList.id = "definition";
    for (let def of definitions) {
        const newDef = document.createElement("li");
        newDef.textContent = def.definition;
        defList.append(newDef);
    }

    const synonymHeader = document.createElement("h2");
    synonymHeader.id = "synonym-header";
    synonymHeader.textContent = "Synonyms";

    const synList = document.createElement("p");
    synList.id = "synonyms";
    if (synonyms.length == 0) {
        synList.textContent = "None"
    } else {
        for (let syn of synonyms) {
            if (synList.textContent == "") {
                synList.textContent = syn;
            } else {
                synList.textContent = synList.textContent + ", " + syn;
            }
        }
    }

    const sourceBtn = document.createElement("button");
    sourceBtn.classList.add("btn");
    sourceBtn.id = "source-link";
    sourceBtn.textContent = "See Full";
    sourceBtn.onclick = function() {
        window.open(sourceUrl, "_blank");
    }

    const qdBody = document.createElement("div");
    qdBody.id = "results-section";
    qdBody.append(breakLine, partOfSpeech, defList, synonymHeader, synList, sourceBtn);

    // Create wrapper div and add the header + body
    const wrapper = document.createElement("div");
    wrapper.append(qdHeader, qdBody);
    return wrapper;
}

function createFailurePanel(word) {
    console.log("The word you searched for came back with no results.");

    const message = document.createElement("h2");
    message.id = "selected-word";
    message.textContent = "No results found for '" + word + "'.";

    // Create wrapper div and add the header
    const wrapper = document.createElement("div");
    wrapper.append(message);
    return wrapper;
}

function showPopup() {
    const qdPopup = document.getElementById("quick-dictionary-popup");
    
    if (qdPopup) {
        qdPopup.style.display = "block";
    }
}

function hidePopup() {
    const qdPopup = document.getElementById("quick-dictionary-popup");
    
    if (qdPopup) {
        qdPopup.style.display = "none";
    }
}