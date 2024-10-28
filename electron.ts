import path from 'path'
import { app, BrowserWindow } from 'electron'
import { AppDataSource, initializeDatabase } from './src/backend/db/database.js'
import { fileURLToPath } from 'url'
import { IpcManager } from './src/backend/util/IpcManager.js'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-extension-installer';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createWindow() {
  await initializeDatabase()

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.NODE_ENV !== 'production') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }
  
  const ipcManager = new IpcManager(AppDataSource);  
  ipcManager.setupIpcHandlers();

}

app.whenReady().then(async () => {
  await installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})