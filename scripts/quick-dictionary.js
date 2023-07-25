document.body.addEventListener("selectionchange", (event) => {
    const selection = document.getSelection();
    const splitSelection = selection.split(" ");

    console.log(selection);

    if (selection && splitSelection.length == 1) {
        // Use dictionary API to define the text/text phrase.
        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + selection)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const definition = document.createElement('p');
            definition.textContent = data;

            const popup = document.createElement("div");
            popup.append(definition);
            popup.id = "dictionary-popup";

            // Find out where to position the popup
            const textRange = selection.getRangeAt(0).getBoundingClientRect();

            document.body.append(popup);
        });
    }
})
