# Mage Wars Codex

Mage Wars Codex is a companion app for the Mage Wars Arena boardgame of Arcane Wonders. It features an easily-searchable dictionary for key words and rules, as well as a spellcard catalog and spellbook (deck) builder. Since this is a hobby project created for personal use, I did not include all of the Mage Wars Academy cards in the catalog as I do not have those in my collection. Nevertheless, this app could be a great addition for anyone's game who plays Arena-only.

The app can be accessed here: (Mage Wars Codex)[https://mrosan.github.io/MageWarsCodex]

# Developer notes

This is a practice project written in Angular, first created on a deadline. As a result it still lacks a certain amount of polish and many of the solutions are "temporary". The app was written with a definite scope in mind; I do not expect to scale the app further as the boardgame is unlikely to expand on its features in the future. See the _TODO list_ section for the next planned changes in the app that I might or might not find the time for to implement. 

## Build and use

Prerequisites: [NPM](https://www.npmjs.com/)
- Run `npm install` to install dependencies.
- Run `npm start` to build and run.
- Navigate to `http://localhost:4200/` in your browser.

To create a desktop app, run `electron-packager . --platform=<platform>` where <platform> is e.g. `win32` on Windows. Read more at [electron-packager](https://github.com/electron/electron-packager).

## TODO list
- Make the cards load from a remote database instead of having them locally.
- Make the app mobile-friendly (i.e. improve styling for smaller screens)
  - ...and then create a mobile app too.
- Improve filters and filter handling.
- Make the code better maintainable
  - Base component for listing cards.
  - FilterService should be responsible for all filtering features.
  - Type improvements.
- Error handling for importing invalid spellbooks.
  - Also for .json data files if database is implemented.
- Add the remaining Mage Wars Academy cards and rules.
- Improve catalog-loading (time, indication).
