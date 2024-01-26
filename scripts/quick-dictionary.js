var detectingSelection = false; 
chrome.storage.sync.set({'enabled': "true"});

document.addEventListener("selectionchange", () => {
    chrome.storage.sync.get(["enabled"]).then((response) => {
        if (response.enabled == "true") {
            detectingSelection = true;
        }
    });
});

document.addEventListener("mouseup", () => {
    chrome.storage.sync.get(["enabled"]).then((response) => {
        if (response.enabled == "true" && detectingSelection == true) {
            detectingSelection = false;
            const selection = document.getSelection().toString();

            if (!selection || selection == "" || selection.length <= 2) {
                hidePopup();
            } else {
                const splitSelection = selection.split(" ");
                if (splitSelection.length == 1) {
                    var qdPopup = document.getElementById("quick-dictionary-popup");
                    var qdShadow = null;

                    if (!qdPopup) {
                        qdPopup = document.createElement("div");
                        qdPopup.id = "quick-dictionary-popup";
                        document.body.append(qdPopup);
                        qdShadow = qdPopup.attachShadow({mode: "open"});
                    } else {
                        qdShadow = qdPopup.shadowRoot;
                    }

                    const sheet = new CSSStyleSheet();
                    sheet.replaceSync(`
                    @font-face {
                        font-family: 'Roboto Slab' !important;
                        src: url("chrome-extension://jffpfohbgkknfbnfngdbaifoleoifgbp/fonts/RobotoSlab-Light.ttf") !important;
                    }
                    
                    .qd-h1, .qd-h2, .qd-h3, .qd-h4, .qd-p, #quick-dictionary-popup li {
                        margin: 0px;
                    }
                    
                    .qd-h1 {
                        font-size: 1.5rem;
                        line-height: normal;
                    }
                    
                    .qd-h2 {
                        font-size: 1.3rem;
                    }
                    
                    .qd-p {
                        font-size: 1rem;
                    }
                    
                    .qd-p, .qd-h2, .qd-h3 {
                        margin: 0px !important;
                    }
                    
                    .qd-hr {
                        border-top: 2px solid var(--GreyQD) !important;
                        margin: 0px !important;
                    }
                    
                    #qd-logo-container {
                        background-color: var(--DarkGreyQD) !important;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        border-radius: var(--smallPadQD) var(--smallPadQD) 0px 0px;
                        padding: var(--smallPadQD);
                    }
                    
                    #qd-logo-container img {
                        height: 10vh;
                        width: auto;
                    }
                    
                    #quick-dictionary-popup {
                        font-family: 'Roboto Slab', serif !important;
                        background-color: var(--BackgroundQD);
                        color: var(--TextQD);
                        width: min-content;
                        min-width: 30%;
                        display: flex;
                        justify-content: center;
                        position: fixed;
                        top: var(--smallGapQD);
                        right: var(--smallGapQD);
                        z-index: +2000;
                        border-radius: var(--smallPadQD);
                        box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .5);
                        overflow: scroll;
                    }
                    
                    #qd-header {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: var(--smallGapQD);
                        padding: var(--smallPadQD) var(--lgPadQD);
                    }
                    
                    #qd-results-header {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: var(--smallGapQD);
                    }
                    
                    #qd-results-section {
                        display: flex;
                        flex-direction: column;
                        padding: var(--smallPadQD) var(--lgPadQD);
                    }
                    
                    #qd-definition {
                        margin-top: var(--smallGapQD);
                    }
                    
                    #qd-definition li {
                        list-style-type: decimal;
                    }
                    
                    #qd-pos {
                        font-style: italic;
                    }
                    
                    #qd-source-link {
                        grid-column: 3;
                        justify-self: end;
                        align-self: end;
                        margin-top: var(--medPadQD);
                    }
                    
                    .qd-button {
                        background: none;
                        border: none;
                        outline: none;
                        box-shadow: none;                       
                        margin: var(--smallPadQD) 0px;
                        background-color: var(--AccentLQD);
                        transition: .3s;
                        width: fit-content;
                        padding: var(--smallPadQD);
                        border-radius: var(--smallGapQD);
                        align-self: flex-end;
                        font-family: 'Roboto Slab', serif !important;
                        color: var(--TextQD);
                    }
                    
                    .qd-button:hover {
                        cursor: pointer;
                        background-color: var(--DarkGreyQD);
                        color: var(--LightQD);
                    }
                    
                    /* Styling for the popup window */
                    /* Created following these instructions: https://medium.com/front-end-weekly/creating-a-toggle-switch-in-css-2d23e496d035 */
                    #qd-popup-body {
                        background-color: var(--LightQD);
                        width: max-content;
                        text-align: center;
                    }
                    
                    #qd-popup-header {
                        font-size: 1.3rem;
                        font-family: 'Roboto Slab', serif;
                        color: var(--DarkQD);
                    }
                    
                    .qd-switch {
                        position: relative;
                        display: inline-block;
                        width: 40px;
                        height: 20px;
                        background-color: var(--GreyQD);
                        border-radius: var(--medPadQD);
                    }
                    
                    .qd-switch::after {
                        content: '';
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background-color: var(--LightQD);
                        top: 1px;
                        left: 1px;
                        transition: 0.3s;
                    }
                    
                    .qd-checkbox {
                        display: none;
                    }
                    
                    .qd-checkbox:checked + .qd-switch::after {
                        left : 20px; 
                    }
                    
                    .qd-checkbox:checked + .qd-switch {
                        background-color: var(--AccentLQD);
                    }
                    `);

                    qdPopup.shadowRoot.adoptedStyleSheets.push(sheet);

                    showPopup();
            
                    try {
                        // Use dictionary API to define the text/text phrase.
                        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selection)
                        .then(response => {
                            if (!response.ok) {
                                return;
                            } else {
                                return response.json()
                            }
                        }).then(data => {
                            if (!data || data.length == 0) {
                                qdShadow.innerHTML = "";       
                                qdShadow.append(createLogo(), createFailurePanel(selection));
                                return;
                            }
                            qdShadow.innerHTML = "";
            
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
                                result.sourceUrls
                            );
            
                            qdShadow.append(createLogo(), resultPanel);
                        });
                    } catch (error) {
                        qdShadow.append(createLogo(), createFailurePanel(selection));
                    }
                } else {
                    hidePopup();
                }            
            }
        } else {
            hidePopup();
        }
    })
})

function createLogo() {
    const logoContainer = document.createElement("div");
    logoContainer.id = "qd-logo-container";

    const logoImg = document.createElement("img");
    logoImg.src = chrome.runtime.getURL("images/quick-dictionary-logo-long.svg");
    logoImg.alt = "Quick dictionary logo";

    logoContainer.append(logoImg);
    return logoContainer;
}

function createSuccessPanel(word, ipa, pos, definitions, synonyms, sourceUrl) {
    // Create header section
    const selectedWord = document.createElement("h1");
    selectedWord.classList.add("qd-h1");
    selectedWord.id = "qd-selected-word";
    selectedWord.textContent = word;

    const qdHeader = document.createElement("div");
    qdHeader.id = "qd-header";

    const separator = document.createElement("p");
    const procunciation = document.createElement("h2");
    if (ipa != "") {
        separator.id = "qd-separator";
        separator.classList.add("qd-p");
        separator.textContent = "•";
    
        procunciation.id = "pronunciation";
        procunciation.classList.add("qd-h2");
        procunciation.textContent = ipa;

        // Add selected word and pronunciation
        qdHeader.append(selectedWord, separator, procunciation);
    } else {
        // Add only selected word
        qdHeader.append(selectedWord);
    }

    // Create body section, including definition
    const breakLine = document.createElement("hr");
    breakLine.classList.add("qd-hr");

    const partOfSpeech = document.createElement("h2");
    partOfSpeech.classList.add("qd-h2");
    partOfSpeech.id = "qd-pos";
    partOfSpeech.textContent = pos;

    const defList = document.createElement("ol");
    defList.id = "qd-definition";
    for (let def of definitions) {
        const newDef = document.createElement("li");
        newDef.textContent = def.definition;
        defList.append(newDef);
    }

    const synonymHeader = document.createElement("h2");
    synonymHeader.classList.add("qd-h2");
    synonymHeader.id = "synonym-header";
    synonymHeader.textContent = "Synonyms";

    const synList = document.createElement("p");
    synList.classList.add("qd-p");
    synList.id = "synonyms";
    if (synonyms.length == 0) {
        synList.textContent = "None";
    } else {
        for (let syn of synonyms) {
            if (synList.textContent == "") {
                synList.textContent = syn;
            } else {
                synList.textContent = synList.textContent + ", " + syn;
            }
        }
    }

    const qdBody = document.createElement("div");
    qdBody.id = "qd-results-section";

    const sourceBtn = document.createElement("button");
    if (sourceUrl[0]) {
        sourceBtn.classList.add("qd-button");
        sourceBtn.id = "source-link";
        sourceBtn.textContent = "See Full";
        sourceBtn.onclick = function() {
            window.open(sourceUrl, "_blank");
        }    

        qdBody.append(breakLine, partOfSpeech, defList, synonymHeader, synList, sourceBtn);
    } else {
        qdBody.append(breakLine, partOfSpeech, defList, synonymHeader, synList);
    }
    


    // Create wrapper div and add the header + body
    const wrapper = document.createElement("div");
    wrapper.append(qdHeader, qdBody);
    return wrapper;
}

function createFailurePanel(word) {
    console.log("The word you searched for came back with no results.");

    const message = document.createElement("h2");
    message.classList.add("qd-h2");
    message.id = "qd-selected-word";
    message.textContent = "No results found for '" + word + "'.";

    const qdHeader = document.createElement("div");
    qdHeader.id = "qd-header";
    qdHeader.append(message)

    // Create wrapper div and add the header
    const wrapper = document.createElement("div");
    wrapper.append(qdHeader);
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