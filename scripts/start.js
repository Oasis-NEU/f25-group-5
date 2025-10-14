/*

D O   N O T   M O D I F Y   T H I S   F I L E
=============================================
IF YOU MODIFY THIS FILE
YOU MAY BREAK THE CORE MODULE LOADING SYSTEM

==> IF YOU NEED TO ADD A SCRIPT TO THE PROJECT <==
    TYPE THIS COMMAND IN YOUR TERMINAL:

        npm run add-module <yourModuleName.js>

    Example: npm run add-module websiteLoader.js

    THE COMMAND WILL ADD THIS FILE FOR YOU.

=============================================
D O   N O T   M O D I F Y   T H I S   F I L E

*/

const script_paths = [
    "scripts/moduleLoaderTest.js",
    "scripts/helloWorld.js"
];

console.log("Starting Extension Services");

script_paths.forEach(script_path => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(script_path);
    script.onload = () => {
        console.log(script_path + " loaded");
    };
    document.head.appendChild(script);
});