import path from 'path'
import { app, BrowserWindow } from 'electron'
import { AppDataSource, initializeDatabase } from './src/backend/db/database.js'
import { fileURLToPath } from 'url'
import { IpcManager } from './src/backend/util/IpcManager.js'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-extension-installer';
import CreditCardSettlementManager from './src/backend/core/CreditCardSettlementManager.js'
import { logger } from './src/backend/util/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createWindow() {
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

  try {
    const dataSource = await initializeDatabase();
    const creditCardSettlementManager = new CreditCardSettlementManager(dataSource);
    await creditCardSettlementManager.initialize();
  } catch (error) {
    logger.error('CreditCardSettlementManager 초기화 실패', error);
  }

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