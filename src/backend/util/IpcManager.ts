import { ipcMain, IpcMainInvokeEvent } from "electron";
import { logger } from "../util/logger.js";
import TransactionService from "../service/TransactionService.js";
import PaymentMethodService from "../service/PaymentMethodService.js";
import AssetService from "../service/AssetService.js";
import { DataSource } from "typeorm";
import IncomeCategoryService from "../service/IncomCategoryService.js";
import ExpenseCategoryService from "../service/ExpenseCategory.js";

export class IpcManager {
  private transactionService: TransactionService;
  private paymentMethodService: PaymentMethodService;
  private assetService: AssetService;
  private incomeCategoryService: IncomeCategoryService;
  private expenseCategoryService: ExpenseCategoryService;

  constructor(dataSource: DataSource) {
    this.transactionService = new TransactionService(dataSource);
    this.paymentMethodService = new PaymentMethodService();
    this.assetService = new AssetService();
    this.incomeCategoryService = new IncomeCategoryService();
    this.expenseCategoryService = new ExpenseCategoryService();
  }

  setupIpcHandlers() {
    ipcMain.handle('get-all-transaction', this.getAllTransaction.bind(this));
    ipcMain.handle('create-transaction', this.createTransaction.bind(this));
    ipcMain.handle('update-transaction', this.updateTransaction.bind(this));
    ipcMain.handle('delete-transaction', this.deleteTransaction.bind(this));

    ipcMain.handle('get-all-paymentmethod', this.getAllPaymentMethod.bind(this));
    ipcMain.handle('create-paymentmethod', this.createPaymentMethod.bind(this));
    ipcMain.handle('update-paymentmethod', this.updatePaymentMethod.bind(this));
    ipcMain.handle('delete-paymentmethod', this.deletePaymentMethod.bind(this));

    ipcMain.handle('get-all-asset', this.getAllAsset.bind(this));
    ipcMain.handle('create-asset', this.createAsset.bind(this));
    ipcMain.handle('update-asset', this.updateAsset.bind(this));
    ipcMain.handle('delete-asset', this.deleteAsset.bind(this));

    ipcMain.handle('get-all-incomecategory', this.getAllIncomeCategory.bind(this));
    ipcMain.handle('create-incomecategory', this.createIncomeCategory.bind(this));
    ipcMain.handle('update-incomecategory', this.updateIncomeCategory.bind(this));
    ipcMain.handle('delete-incomecategory', this.deleteIncomeCategory.bind(this));

    ipcMain.handle('get-all-expensecategory', this.getAllExpenseCategory.bind(this));
    ipcMain.handle('create-expensecategory', this.createExpenseCategory.bind(this));
    ipcMain.handle('update-expensecategory', this.updateExpenseCategory.bind(this));
    ipcMain.handle('delete-expensecategory', this.deleteExpenseCategory.bind(this));
  }

  private async createTransaction(_: IpcMainInvokeEvent, transactionData: any) {
    try {
      logger.info('IPC: 새 거래 생성 요청', { data: transactionData });
      return await this.transactionService.createTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 새 거래 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllTransaction(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 거래 조회 요청');
      const transactions = await this.transactionService.getAllTransaction();
      return transactions;
    } catch (error) {
      logger.error('IPC: 모든 거래 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async updateTransaction(_: IpcMainInvokeEvent, transactionData: any) {
    try {
      logger.info('IPC: 거래 수정 요청', { data: transactionData });
      await this.transactionService.updateTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 거래 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deleteTransaction(_: IpcMainInvokeEvent, transactionData: any) {
    try {
      logger.info('IPC: 거래 삭제 요청', { data: transactionData });
      await this.transactionService.deleteTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 거래 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllPaymentMethod(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 결제 방법 조회 요청');
      const paymentMethods = await this.paymentMethodService.getAllPaymentMethod();
      return paymentMethods;
    } catch (error) {
      logger.error('IPC: 모든 결제 방법 조회 중 오류 발생', error);
      throw error;
    }
  } 

  private async createPaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: any) {
    try {
      const { id, ...paymentMethodWithoutId } = paymentMethodData;
      logger.info('IPC: 새 결제 방법 생성 요청', { data: paymentMethodWithoutId });
      return await this.paymentMethodService.createPaymentMethod(paymentMethodWithoutId);
    } catch (error) {
      logger.error('IPC: 새 결제 방법 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updatePaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: any) {
    try {
      logger.info('IPC: 결제 방법 수정 요청', { data: paymentMethodData });
      await this.paymentMethodService.updatePaymentMethod(paymentMethodData);
    } catch (error) {
      logger.error('IPC: 결제 방법 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deletePaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: any) {
    try {
      logger.info('IPC: 결제 방법 삭제 요청', { data: paymentMethodData });
      await this.paymentMethodService.deletePaymentMethod(paymentMethodData);
    } catch (error) {
      logger.error('IPC: 결제 방법 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllAsset(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 자산 조회 요청');
      const assets = await this.assetService.getAllAssets();
      return assets;
    } catch (error) {
      logger.error('IPC: 모든 자산 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async createAsset(_: IpcMainInvokeEvent, assetData: any) {
    try {
      logger.info('IPC: 새 자산 생성 요청', { data: assetData });
      const { id, ...assetWithoutId } = assetData;
      return await this.assetService.createAsset(assetWithoutId);
    } catch (error) {
      logger.error('IPC: 새 자산 생성 중 오류 발생', error);
      throw error;
    }
  } 

  private async updateAsset(_: IpcMainInvokeEvent, assetData: any) {
    try {
      logger.info('IPC: 자산 수정 요청', { data: assetData });
      await this.assetService.updateAsset(assetData);
    } catch (error) {
      logger.error('IPC: 자산 수정 중 오류 발생', error);
      throw error;
    }
  } 

  private async deleteAsset(_: IpcMainInvokeEvent, assetData: any) {
    try {
      logger.info('IPC: 자산 삭제 요청', { data: assetData });
      await this.assetService.deleteAsset(assetData);
    } catch (error) {
      logger.error('IPC: 자산 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllIncomeCategory(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 수입 카테고리 조회 요청');
      const incomeCategories = await this.incomeCategoryService.getAllIncomeCategories();
      return incomeCategories;
    } catch (error) {
      logger.error('IPC: 모든 수입 카테고리 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async createIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: any) {
    try {
      logger.info('IPC: 새 수입 카테고리 생성 요청', { data: incomeCategoryData });
      const { id, ...incomeCategoryWithoutId } = incomeCategoryData;
      return await this.incomeCategoryService.createIncomeCategory(incomeCategoryWithoutId);
    } catch (error) {
      logger.error('IPC: 새 수입 카테고리 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: any) {
    try {
      logger.info('IPC: 수입 카테고리 수정 요청', { data: incomeCategoryData });
      await this.incomeCategoryService.updateIncomeCategory(incomeCategoryData);
    } catch (error) {
      logger.error('IPC: 수입 카테고리 수정 중 오류 발생', error);
      throw error;
    }
  } 

  private async deleteIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: any) {
    try {
      logger.info('IPC: 수입 카테고리 삭제 요청', { data: incomeCategoryData });
      await this.incomeCategoryService.deleteIncomeCategory(incomeCategoryData);
    } catch (error) {
      logger.error('IPC: 수입 카테고리 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllExpenseCategory(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 지출 카테고리 조회 요청');
      const expenseCategories = await this.expenseCategoryService.getAllExpenseCategories();
      return expenseCategories;
    } catch (error) {
      logger.error('IPC: 모든 지출 카테고리 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async createExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: any) {
    try {
      logger.info('IPC: 새 지출 카테고리 생성 요청', { data: expenseCategoryData });
      const { id, ...expenseCategoryWithoutId } = expenseCategoryData;
      return await this.expenseCategoryService.createExpenseCategory(expenseCategoryWithoutId);
    } catch (error) {
      logger.error('IPC: 새 지출 카테고리 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: any) {
    try {
      logger.info('IPC: 지출 카테고리 수정 요청', { data: expenseCategoryData });
      await this.expenseCategoryService.updateExpenseCategory(expenseCategoryData);
    } catch (error) {
      logger.error('IPC: 지출 카테고리 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deleteExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: any) {
    try {
      logger.info('IPC: 지출 카테고리 삭제 요청', { data: expenseCategoryData });
      await this.expenseCategoryService.deleteExpenseCategory(expenseCategoryData);
    } catch (error) {
      logger.error('IPC: 지출 카테고리 삭제 중 오류 발생', error);
      throw error;
    }
  }
}