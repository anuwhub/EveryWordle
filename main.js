console.log(`%c[EveryWordle] %cEveryWordle loaded!`, `color: #6aaa64`, ``);

const scriptContent = `
// modify JS Date object
function replaceDate(i){
    let newDate = new Date(2021,5,19+i).setHours(0,0,0,0);
    let timeDiff = Date.now() - newDate;
    const origDate = Date;
    const origUTC = Date.UTC;
    const origParse = Date.parse;
    const origNow = Date.now;

    window.Date = function(d) {
        return function Date(A, B, C, D, E, F, G) {
            return A === undefined ? new d(origNow() - timeDiff) : B === undefined ? new d(A) : C === undefined ? new d(A,B) : D === undefined ? new d(A,B,C) : E === undefined ? new d(A,B,C,D) : F === undefined ? new d(A,B,C,D,E) : G === undefined ? new d(A,B,C,D,E,F) : new d(A,B,C,D,E,F,G)
        }
    }(window.Date);
    window.Date.prototype = origDate.prototype
    window.Date.now = function now() {
        return origNow() - timeDiff;
    }
    window.Date.UTC = origUTC;
    window.Date.parse = origParse;
    Object.defineProperty(window.Date.prototype, "constructor", {
        value: window.Date
    });
}

// refresh with day param
function changeDay(d){
    let oldStorage = JSON.parse(localStorage["nyt-wordle-state"]);
    // if same day, no need to do anything special
    if(new Date(oldStorage.lastPlayedTs).setHours(0,0,0,0) == new Date(2021,5,19+d).setHours(0,0,0,0)){
        params.day = d;
        return;
    }
    // reset lastPlayedTs
    oldStorage.lastPlayedTs = null;
    localStorage["nyt-wordle-state"] = JSON.stringify(oldStorage);

    // refresh page with new date
    window.location.replace(window.location.pathname + "?day=" + d);
}

function addButtons(){
    let leftMenu = document.getElementsByTagName('game-app')[0].shadowRoot.querySelector('.menu-left');
    let title = document.getElementsByTagName('game-app')[0].shadowRoot.querySelector('.title');

    let daySwitcher = document.createElement("div");
    daySwitcher.setAttribute('id', 'daySwitcher');
    // keep Wordle title in center of screen
    daySwitcher.style.width = 0;
    daySwitcher.style.display = 'flex';
    daySwitcher.style.alignItems = 'center';

    // add left arrow
    let previousDayButton = document.createElement("button");
    previousDayButton.setAttribute('id', 'day-button');
    previousDayButton.setAttribute('class', 'icon');
    previousDayButton.setAttribute('ariaLabel', 'day');
    let previousDaySVG = document.createElement("img");
    previousDaySVG.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/en/b/bd/Left_arrow_icon.svg');
    previousDayButton.appendChild(previousDaySVG);
    previousDayButton.addEventListener("click", () => dayInput.value--);
    daySwitcher.appendChild(previousDayButton);

    // add day text
    let midDiv = document.createElement("div");
    let dayInput = document.createElement("input");
    dayInput.setAttribute('id', 'dayInput');
    dayInput.setAttribute('type', 'number');
    dayInput.setAttribute('min', 0);
    dayInput.setAttribute('value', params.day);
    dayInput.style.width = '50px';
    dayInput.style.padding = '0';
    dayInput.style.border = '0';
    dayInput.style.textAlign = 'center';
    dayInput.innerText = params.day;
    let timeTravel = document.createElement("button");
    timeTravel.innerText = "Go!";
    timeTravel.style.width = '50px';
    timeTravel.style.outlineStyle = 'auto';
    timeTravel.addEventListener("click", (() => {
        let d = +dayInput.value;
        changeDay(d);
    }));
    midDiv.appendChild(dayInput);
    midDiv.appendChild(timeTravel);
    daySwitcher.appendChild(midDiv);

    // add right arrow
    let nextDayButton = document.createElement("button");
    nextDayButton.setAttribute('id', 'day-button');
    nextDayButton.setAttribute('class', 'icon');
    nextDayButton.setAttribute('ariaLabel', 'day');
    let nextDaySVG = document.createElement("img");
    nextDaySVG.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/en/e/e0/Right_arrow_icon.svg');
    nextDayButton.appendChild(nextDaySVG);
    nextDayButton.addEventListener("click", () => dayInput.value++);
    daySwitcher.appendChild(nextDayButton);

    leftMenu.appendChild(daySwitcher);
    title.innerText = "Wordle "+params.day;
};

let params = [];
let origParams = window.location.search;
origParams.slice(1).split('&').forEach(x=>params[x.split('=')[0]] = +x.split('=')[1]);

// if URL day query param exists, replace with specified day
if(typeof params.day != 'undefined') replaceDate(params.day);
// otherwise refresh with day param
else changeDay(Math.round(((new Date()).setHours(0,0,0,0) - new Date(2021,5,19).setHours(0,0,0,0))/864e5));

// Remove this script from the page, prevent clutter. Remove this line if you want the script to remain viewable in the DOM
document.currentScript.parentElement.removeChild(document.currentScript);
`

// Create a script tag and inject it into the document.
const scriptElement = document.createElement('script');
scriptElement.innerHTML = scriptContent;
document.documentElement.prepend(scriptElement);

// fetch original js, mod it, place it on page
window.addEventListener("DOMContentLoaded", function(event) {
    console.log(`%c[EveryWordle] %cFetching original main.js`, `color: #6aaa64`, ``);
    chrome.runtime.sendMessage("gimme mainstr");
});
chrome.runtime.onMessage.addListener((m) => fetch(`https://www.nytimes.com/games/wordle/${m.wordlePath}?anuw`).then(x=>x.text()).then(x=>patchJS(x)).then(x=>patchHTML(x)));

// modify js
function patchJS(src){
    console.log(`%c[EveryWordle] %cPatching main.js...`, `color: #6aaa64`, ``);
    let newSrc = src;

    // add buttons (execute after wordle's js has finished modifying the DOM)
    newSrc = newSrc.replace(`({});`, `({}); addButtons();`);

    // add input css
    newSrc = newSrc.replace(`.toaster`, `input[type=number]::-webkit-inner-spin-button, \\ninput[type=number]::-webkit-outer-spin-button { \\n-webkit-appearance: none; \\nmargin: 0; \\n}\\ninput[type=number] {\\n-moz-appearance: textfield;\\n}\\n .toaster`);

    // prevent annoying tutorial pop-up
    newSrc = newSrc.replace(`key:"showHelpModal",value:function(){var e=this.$game.querySelector("game-modal");e.appendChild(document.createElement("game-help")),e.setAttribute("open","")}`, `key:"showHelpModal",value:function(){}`);

    console.log(`%c[EveryWordle] %cPatched main.js!`, `color: #6aaa64`, ``);
    return newSrc;
}

// insert modified JS into page
function patchHTML(src){
    console.log(`%c[EveryWordle] %cPatching HTML...`, `color: #6aaa64`, ``);

    const newScript = document.createElement("script");
    newScript.innerHTML = src;
    document.body.appendChild(newScript);

    console.log(`%c[EveryWordle] %cPatched HTML!`, `color: #6aaa64`, ``);
    return src;
}