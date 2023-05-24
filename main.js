const { app, BrowserWindow } = require('electron');
//const path = require('path');

let win;

let correctedPath = `file://${__dirname}/dist/mage-wars-codex/assets/mw_icon.png`;

function createWindow() {
	win = new BrowserWindow({
		width: 900,
		height: 1000,
		backgroundColor: '#ffffff',
		icon: correctedPath
	});

	//correctedPath = "file://" + path.normalize(`${__dirname}/dist/index.html`).replace(/\\/g, '/');
	console.log(win);

	win.loadURL(`file://${__dirname}/dist/mage-wars-codex/index.html`);

	win.on('closed', function(){
		win = null
	});

}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});