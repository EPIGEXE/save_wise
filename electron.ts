import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { initializeDatabase } from './src/backend/db/database.js'
import { logger } from './src/backend/util/logger.js'
import TransactionService from './src/backend/service/TransactionService.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transactionService = new TransactionService();

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

  // IPC 핸들러 설정
  ipcMain.handle('create-transaction', async (_, transactionData) => {
    try {
      logger.info('IPC: 새 거래 생성 요청', { data: transactionData });
      const newTransaction = await transactionService.createTransaction(transactionData);
      return newTransaction;
    } catch (error) {
      logger.error('IPC: 새 거래 생성 중 오류 발생', error);
      throw error;
    }
  });

  ipcMain.handle('get-all-transaction', async () => {
    try {
      logger.info('IPC: 모든 거래 조회 요청');
      const transactions = await transactionService.getAllTransaction();
      return transactions;
    } catch (error) {
      logger.error('IPC: 모든 거래 조회 중 오류 발생', error);
      throw error;
    }
  });

  ipcMain.handle('update-transaction', async (_, transactionData) => {
    try {
      logger.info('IPC: 거래 수정 요청', { data: transactionData });
      await transactionService.updateTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 거래 수정 중 오류 발생', error);
      throw error;
    }
  })

  ipcMain.handle('delete-transaction', async (_, transactionData) => {
    try {
      logger.info('IPC: 거래 삭제 요청', { data: transactionData });
      await transactionService.deleteTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 거래 삭제 중 오류 발생', error);
      throw error;
    }
  })
}


app.whenReady().then(createWindow)

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