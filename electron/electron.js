const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
var os = require('os');

app.commandLine.hasSwitch('disable-gpu');
app.commandLine.hasSwitch('enable-transparent-visuals')

console.log(os.hostname);

let mainWindow;
let isCompact = false;
global.setCompactMode = () => {
  if (!isCompact) {
    const display = electron.screen.getPrimaryDisplay();
    const width = display.bounds.width;
    mainWindow.setSize(350, 150);
    mainWindow.setPosition(width - 400, 60);
  }
  else {
    mainWindow.setSize(800, 600);
    mainWindow.center();
  }
  isCompact = !isCompact;
};
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      webSecurity: false,
    },
    width: 800,
    height: 600,
    alwaysOnTop: true,
  });
  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === 'modal') {
        // open window as modal
        event.preventDefault();
        Object.assign(options, {
          parent: mainWindow,
          width: 400,
          titleBarStyle: 'native',
          height: 300,
          frame: true,
          webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
            webSecurity: false,
          },
        });
        event.newGuest = new BrowserWindow(options);
      }
    },
  );
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
  );
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
