import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { AppDataSource, initializeDatabase } from '@/backend/db/database'
import { Transaction } from '@/backend/db/entity/Transaction'

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
  ipcMain.handle('save-transaction', async (_, transaction) => {
    const transactionRepository = AppDataSource.getRepository(Transaction)
    const newTransaction = transactionRepository.create(transaction)
    await transactionRepository.save(newTransaction)
    return newTransaction
  })

  ipcMain.handle('get-transactions', async (_, date) => {
    const transactionRepository = AppDataSource.getRepository(Transaction)
    return await transactionRepository.find({ where: { date } })
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