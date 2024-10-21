import { DataSource } from "typeorm"
import { Transaction } from "./entity/Transaction"
import path from 'path'
import { app } from 'electron'

const dbPath = path.join(app.getPath('userData'), 'database.sqlite')

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  entities: [Transaction],
  synchronize: true,
  logging: false
})

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log("데이터베이스 연결 성공")
    return AppDataSource
  } catch (error) {
    console.error("데이터베이스 연결 실패:", error)
    throw error
  }
}

export default { AppDataSource, initializeDatabase }