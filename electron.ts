import path from 'path'
import { app, BrowserWindow } from 'electron'
import { AppDataSource, initializeDatabase } from './src/backend/db/database.js'
import { fileURLToPath } from 'url'
import { IpcManager } from './src/backend/util/IpcManager.js'
//import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-extension-installer';
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

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173')
  } else {
    // 실행 경로 확인을 위한 로그
    logger.info(`앱 경로: ${app.getAppPath()}`)
    logger.info(`리소스 경로: ${process.resourcesPath}`)
    logger.info(`실행 경로: ${process.execPath}`)
    logger.info(`현재 작업 디렉토리: ${process.cwd()}`)
    logger.info(`__dirname: ${__dirname}`)

    const indexPath = path.join(__dirname, '..', 'dist', 'index.html')
    try {
      logger.info(`시도할 index.html 경로: ${indexPath}`)
      await win.loadFile(indexPath)
      logger.info('메인 윈도우 로딩 성공')
    } catch (error) {
      logger.error(`메인 윈도우 로딩 실패: ${error}`)
      
      // 오류 발생 시 파일 존재 여부 확인
      const fs = require('fs')
      if (fs.existsSync(indexPath)) {
        logger.info('파일이 존재함')
      } else {
        logger.error('파일이 존재하지 않음')
      }
    }
  }
  
  const ipcManager = new IpcManager(AppDataSource);  
  ipcManager.setupIpcHandlers();

}

app.whenReady().then(async () => {
  // await installExtension(REACT_DEVELOPER_TOOLS, {
  //   loadExtensionOptions: {
  //     allowFileAccess: true
  //   }
  // })

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