const {app, Menu, ipcMain, dialog} = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const QiniuManager = require('./src/utils/QiniuManage')
const {join} = require('path')

const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const fileStore = new Store({name: 'Files Data'})

const createrManager = () => {
  const accessKey = settingsStore.get('accessKey')
  const secretKey = settingsStore.get('secretKey')
  const bucketName = settingsStore.get('bucketName')
  return new QiniuManager(accessKey, secretKey, bucketName)
}
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
  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  ipcMain.on('config-is-saved', () => {
    let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2];
    const switchItems = (toggle) => {
      [1,2,3].forEach(num => {
        qiniuMenu.submenu.items[num].enabled = toggle;
      })
    }
    const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
    if (qiniuIsConfiged) {
      switchItems(true)
    } else {
      switchItems(false)
    }
  });
  app.on('close', () => {
    mainWindow = null;
  })

  ipcMain.on('upload-file', (event, data) => {
    console.log('upload-file')
    const manager = createrManager();
    console.log('upload-file1')
    manager.upLoadFile(data.key, data.path).then(data => {
      console.log(data)
      mainWindow.webContents.send('active-file-uploaded');
    }).catch(err => {
      dialog.showErrorBox('同步失败', '请检测七牛云参数是否正确')
    });
  })
  ipcMain.on('download-file', (even, data) => {
    const {id, key, path} = data;
    const manager = createrManager();
    const fileObj = fileStore.get('files')
    manager.getStat(key).then(response => {
      const serverUpdateTime = Math.floor(response.putTime / 10000)
      const localUpdateTime = fileObj.updateAt;
      if (serverUpdateTime > localUpdateTime || !localUpdateTime) {
        manager.downloadFile(key, path).then(() => {
          mainWindow.webContents.send('file-downloaded', {status: 'downloaded-success',id});
        });
      } else {
        mainWindow.webContents.send('file-downloaded', {status: 'no-new-file',id});
      }
      console.log(response)
      console.log(fileObj[id])
    }).catch(err => {
      console.log(err)
      if (err.statusCode === 612) {
        mainWindow.webContents.send('file-downloaded', {status: 'no-file', id});
      }
    });
  })
  ipcMain.on('upload-all-to-qiniu', () => {
    console.log('upload-all-to-qiniu');
    mainWindow.webContents.send('loading-status', true)
    const manager = createrManager();
    const filesObj = fileStore.get('files') || {};
    const uploadPromiseArr = Object.keys(filesObj).map(key => {
      const file = filesObj[key]
      return manager.upLoadFile(`${file.title}.md`, file.path)
    })
    Promise.all(uploadPromiseArr).then(result => {
      dialog.showMessageBox({
        type: 'info',
        title: `成功上传了${result.length}个文件`,
        message: `成功上传了${result.length}个文件`,
      });
      mainWindow.webContents.send('files-uploaded');
    }).catch(err => {
      dialog.showErrorBox('同步失败', '请检测七牛云参数是否正确')
    }).finally(() => {
      mainWindow.webContents.send('loading-status', false)
    });
    
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
});