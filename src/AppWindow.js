const {BrowserWindow} = require('electron')

class AppWindow extends BrowserWindow {
  constructor(windowConfig, urlLocation) {
    const defaultConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      show: false,
      backgroundColor: '#efefef',
    }
    const config = {...defaultConfig, ...windowConfig}
    super(config)
    this.loadURL(urlLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow