let mainStr = "";
function logURL(requestDetails) {
    // block wordle from fetching js unless it contains our anuw parameter
    if(requestDetails.url.endsWith("anuw")) return;
    mainStr = requestDetails.url.split('wordle/')[1];
    return {cancel: true};
}
  
window.chrome.webRequest.onBeforeRequest.addListener(logURL, {urls: ["https://www.nytimes.com/games/wordle/main*"]}, ["blocking"]);

// when content script asks for mainStr, hand it over
function fetchMainStr(msg, sender, sendResponse){
    window.chrome.tabs.sendMessage(sender.tab.id, {"wordlePath": mainStr});
}
window.chrome.runtime.onMessage.addListener(fetchMainStr);