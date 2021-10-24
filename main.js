const {app, Menu, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const {join} = require('path')
let mainWindow, settingWindow;
// Menu.setApplicationMenu(null)
app.on('ready', () => {
  const urlLocation = isDev ? 'http://localhost:3000' : null;
  mainWindow = new AppWindow({
    width: 1024,
    height: 680,
  }, urlLocation);
  mainWindow.loadURL(urlLocation);
  mainWindow.webContents.openDevTools();
  app.on('close', () => {
    mainWindow = null;
  })

  ipcMain.on('open-settings-window', () => {
    const urlLocation = `${join(__dirname, './src/view/setting.html')}`;
    console.log('urlLocation:',urlLocation);
    settingWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow,
    }, urlLocation);
    settingWindow.loadURL(urlLocation);
    settingWindow.removeMenu();
    settingWindow.webContents.openDevTools();
    app.on('close', () => {
      settingWindow = null;
    })
  })
  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
});