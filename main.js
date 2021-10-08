const {app, BrowserWindow, Menu} = require('electron');
const isDev = require('electron-is-dev');
let mainWindow;
Menu.setApplicationMenu(null)
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      NodeIntegration: true,
    }
  });

  const urlLocation = isDev ? 'http://localhost:3000' : null;
  mainWindow.loadURL(urlLocation);
});