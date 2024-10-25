import { DataSource } from "typeorm";
import { Transaction } from "./entity/Transaction.js";
import path from 'path';
import { app } from 'electron';
import { PaymentMethod } from "./entity/PaymentMethod.js";
import { Asset } from "./entity/Asset.js";
const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: dbPath,
    entities: [Transaction, PaymentMethod, Asset],
    synchronize: true,
    logging: false
});
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("데이터베이스 연결 성공");
        return AppDataSource;
    }
    catch (error) {
        console.error("데이터베이스 연결 실패:", error);
        throw error;
    }
};
export default { AppDataSource, initializeDatabase };
//# sourceMappingURL=database.js.map