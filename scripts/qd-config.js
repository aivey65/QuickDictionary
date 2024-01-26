window.addEventListener("load", () => {
    chrome.storage.sync.get(["enabled"]).then((response) => {
        console.log("loading", response.enabled)
        if (response.enabled == "true") {
            document.getElementById("qd-toggle").checked = true;
        } else {
            document.getElementById("qd-toggle").checked = false;
        }
    })
}); 

document.getElementById("qd-toggle").addEventListener("change", () => {
    console.log("changing here")

    var enabled = document.getElementById("qd-toggle").checked == true ? "true" : "false";
    chrome.storage.sync.set({"enabled": enabled});
});