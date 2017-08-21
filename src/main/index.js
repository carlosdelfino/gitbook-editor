import { app, BrowserWindow, dialog, ipcMain } from 'electron'

const Store = require('electron-store');
const store = new Store();

// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function createWindow () {
  /**
   * Initial window options
   */
  const customLibrary = store.get('library') || []

  mainWindow = new BrowserWindow({
    height: 600,
    width: 400,
    resizable: false,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)
  // console.log(dialog.showOpenDialog({properties: ['openDirectory']}))

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  ipcMain.on('openLibrary', (event, arg) => {
    openMainWindow()
  })

  ipcMain.on('openIndex', () => {
    openIndexWindow()
  })
}

function openMainWindow () {
  const customWindowSize = store.get('windowSize') || []
  const windowSize = {
    height: customWindowSize[1] || 563,
    width: customWindowSize[0] || 1000
  }
  mainWindow.setSize(windowSize.width, windowSize.height)
  mainWindow.setResizable(true)
  mainWindow.center()
  resizeListener()
}

function openIndexWindow () {
  mainWindow.setResizable(false)
  mainWindow.setSize(400, 600)
  mainWindow.center()
}

function resizeListener () {
  let resizeTimer = null
  mainWindow.on('resize', function () {
    if (mainWindow.isResizable() && !resizeTimer) {
      resizeTimer = setTimeout(function () {
        store.set('windowSize', mainWindow.getSize())
        clearTimeout(resizeTimer)
        resizeTimer = null
      }, 1000)
    }
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
