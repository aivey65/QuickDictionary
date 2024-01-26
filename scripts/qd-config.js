window.addEventListener("load", () => {
    chrome.storage.sync.get(["enabled"]).then((response) => {
        if (response.enabled == "true") {
            document.getElementById("qd-toggle").checked = true;
        } else {
            document.getElementById("qd-toggle").checked = false;
        }
    })
}); 

document.getElementById("qd-toggle").addEventListener("change", () => {
    var enabled = document.getElementById("qd-toggle").checked == true ? "true" : "false";
    chrome.storage.sync.set({"enabled": enabled});
});