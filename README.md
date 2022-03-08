# EveryWordle
![image](https://github.com/anuwhub/EveryWordle/blob/main/icons/96.png?raw=true)  
<sub>Thanks [@lucisalem](https://github.com/lucisalem) for the icon</sub>

EveryWordle allows you to manually select what day of Wordle you'd like to play.  
Slept in and missed a Wordle? Just click the back arrow and Go!  
<img src="https://user-images.githubusercontent.com/60380944/157158061-92da0730-151b-49ed-9e43-c17b554d1f5a.png" width="200">

Play any Wordle from day 0 to doomsday  
<img src="https://user-images.githubusercontent.com/60380944/157158650-59f0aa8e-1c65-493a-bb75-061898a414c5.png" width="200">

## Installation Instructions
### [Chromium browsers](https://en.wikipedia.org/wiki/Chromium_(web_browser)#Active)
- Under [releases](https://github.com/anuwhub/EveryWordle/releases) download the latest release (.zip)
- Go to `chrome://extensions`
- Ensure `Developer mode` at the top right of the page is turned on
- Drag `EveryWordle.zip` onto the page
- You should have successfully installed EveryWordle!

### Firefox
- Under [releases](https://github.com/anuwhub/EveryWordle/releases) download the latest release (.zip)
- Go to `about:debugging#/runtime/this-firefox`
- Click on `Load Temporary Add-on...`
- Select `EveryWordle.zip`
- You should have successfully installed EveryWordle!

If you'd like to have EveryWordle permanently installed on Firefox you will need to set `xpinstall.signatures.required` to `false` in `about:config`. Note: regular Firefox may ignore this, so [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) may be required instead.

## FAQ
### It won't let me install the extension?
Ensure you've followed the steps correctly for your browser type. Otherwise try downloading all the individual files into a single directory and installing the extension via the `manifest.json` file.
### It says `Wordle undefined` at the top of the page?
That means your local storage doesn't have anything in it. If refreshing the page doesn't work, ensure your browser isn't deleting your local storage automatically.
