import { ipcMain, IpcMainInvokeEvent } from "electron";
import { logger } from "../util/logger.js";
import TransactionService, { TransactionDto } from "../service/TransactionService.js";
import PaymentMethodService from "../service/PaymentMethodService.js";
import AssetService from "../service/AssetService.js";
import { DataSource } from "typeorm";
import IncomeCategoryService from "../service/IncomCategoryService.js";
import ExpenseCategoryService from "../service/ExpenseCategory.js";
import { Transaction } from "../db/entity/Transaction.js";
import { PaymentMethod } from "../db/entity/PaymentMethod.js";
import { Asset } from "../db/entity/Asset.js";
import { IncomeCategory } from "../db/entity/IncomeCategory.js";
import { ExpenseCategory } from "../db/entity/ExpenseCategory.js";
import AnalysisService from "../service/AnalysisService.js";
import FixedCostService from "../service/FixedCostService.js";
import { FixedCost } from "../db/entity/FixedCost.js";
import GoalService from "../service/Goal.js";
import { Goal } from "../db/entity/Goal.js";
export class IpcManager {
  private transactionService: TransactionService;
  private paymentMethodService: PaymentMethodService;
  private assetService: AssetService;
  private incomeCategoryService: IncomeCategoryService;
  private expenseCategoryService: ExpenseCategoryService;
  private analysisService: AnalysisService;
  private fixedCostService: FixedCostService;
  private goalService: GoalService;

  constructor(dataSource: DataSource) {
    this.transactionService = new TransactionService(dataSource);
    this.paymentMethodService = new PaymentMethodService();
    this.assetService = new AssetService();
    this.incomeCategoryService = new IncomeCategoryService();
    this.expenseCategoryService = new ExpenseCategoryService();
    this.analysisService = new AnalysisService(dataSource);
    this.fixedCostService = new FixedCostService();
    this.goalService = new GoalService(); 
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

    ipcMain.handle('get-all-fixedcost', this.getAllFixedCost.bind(this));
    ipcMain.handle('create-fixedcost', this.createFixedCost.bind(this));
    ipcMain.handle('update-fixedcost', this.updateFixedCost.bind(this));
    ipcMain.handle('delete-fixedcost', this.deleteFixedCost.bind(this));

    ipcMain.handle('get-transactions-chart-data-by-month', this.getTransactionsChartDataByMonth.bind(this));
    ipcMain.handle('get-transactions-chart-data-by-payment-day', this.getTransactionsChartDataByPaymentDay.bind(this));
  
    ipcMain.handle('get-all-goal', this.getAllGoal.bind(this));
    ipcMain.handle('create-goal', this.createGoal.bind(this));
    ipcMain.handle('update-goal', this.updateGoal.bind(this));
    ipcMain.handle('delete-goal', this.deleteGoal.bind(this));
  }

  private async createTransaction(_: IpcMainInvokeEvent, transactionData: TransactionDto) {
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

  private async updateTransaction(_: IpcMainInvokeEvent, transactionData: Transaction) {
    try {
      logger.info('IPC: 거래 수정 요청', { data: transactionData });
      await this.transactionService.updateTransaction(transactionData);
    } catch (error) {
      logger.error('IPC: 거래 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deleteTransaction(_: IpcMainInvokeEvent, transactionData: Transaction) {
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

  private async createPaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: PaymentMethod) {
    try {
      logger.info('IPC: 새 결제 방법 생성 요청', { data: paymentMethodData });
      return await this.paymentMethodService.createPaymentMethod(paymentMethodData);
    } catch (error) {
      logger.error('IPC: 새 결제 방법 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updatePaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: PaymentMethod) {
    try {
      logger.info('IPC: 결제 방법 수정 요청', { data: paymentMethodData });
      await this.paymentMethodService.updatePaymentMethod(paymentMethodData);
    } catch (error) {
      logger.error('IPC: 결제 방법 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deletePaymentMethod(_: IpcMainInvokeEvent, paymentMethodData: PaymentMethod) {
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

  private async createAsset(_: IpcMainInvokeEvent, assetData: Asset) {
    try {
      logger.info('IPC: 새 자산 생성 요청', { data: assetData });
      return await this.assetService.createAsset(assetData);
    } catch (error) {
      logger.error('IPC: 새 자산 생성 중 오류 발생', error);
      throw error;
    }
  } 

  private async updateAsset(_: IpcMainInvokeEvent, assetData: Asset) {
    try {
      logger.info('IPC: 자산 수정 요청', { data: assetData });
      await this.assetService.updateAsset(assetData);
    } catch (error) {
      logger.error('IPC: 자산 수정 중 오류 발생', error);
      throw error;
    }
  } 

  private async deleteAsset(_: IpcMainInvokeEvent, assetData: Asset) {
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

  private async createIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: IncomeCategory) {
    try {
      logger.info('IPC: 새 수입 카테고리 생성 요청', { data: incomeCategoryData });
      return await this.incomeCategoryService.createIncomeCategory(incomeCategoryData);
    } catch (error) {
      logger.error('IPC: 새 수입 카테고리 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: IncomeCategory) {
    try {
      logger.info('IPC: 수입 카테고리 수정 요청', { data: incomeCategoryData });
      await this.incomeCategoryService.updateIncomeCategory(incomeCategoryData);
    } catch (error) {
      logger.error('IPC: 수입 카테고리 수정 중 오류 발생', error);
      throw error;
    }
  } 

  private async deleteIncomeCategory(_: IpcMainInvokeEvent, incomeCategoryData: IncomeCategory) {
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

  private async createExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: ExpenseCategory) {
    try {
      logger.info('IPC: 새 지출 카테고리 생성 요청', { data: expenseCategoryData });
      return await this.expenseCategoryService.createExpenseCategory(expenseCategoryData);
    } catch (error) {
      logger.error('IPC: 새 지출 카테고리 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: ExpenseCategory) {
    try {
      logger.info('IPC: 지출 카테고리 수정 요청', { data: expenseCategoryData });
      await this.expenseCategoryService.updateExpenseCategory(expenseCategoryData);
    } catch (error) {
      logger.error('IPC: 지출 카테고리 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deleteExpenseCategory(_: IpcMainInvokeEvent, expenseCategoryData: ExpenseCategory) {
    try {
      logger.info('IPC: 지출 카테고리 삭제 요청', { data: expenseCategoryData });
      await this.expenseCategoryService.deleteExpenseCategory(expenseCategoryData);
    } catch (error) {
      logger.error('IPC: 지출 카테고리 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getTransactionsChartDataByMonth(_: IpcMainInvokeEvent, year: number, month: number) {
    try {
      logger.info('IPC: 월별 거래 차트 데이터 조회 요청', { year, month });
      return await this.analysisService.getTransactionsChartDataByMonth(year, month);
    } catch (error) {
      logger.error('IPC: 월별 거래 차트 데이터 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async getTransactionsChartDataByPaymentDay(_: IpcMainInvokeEvent, year: number, month: number) {
    try {
      logger.info('IPC: 결제일별 거래 차트 데이터 조회 요청', { year, month });
      return await this.analysisService.getTransactionsChartDataByPaymentDay(year, month);
    } catch (error) {
      logger.error('IPC: 결제일별 거래 차트 데이터 조회 중 오류 발생', error);
      throw error;
    }
  }
  
  private async getAllFixedCost(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 고정비 조회 요청');
      const fixedCosts = await this.fixedCostService.getAllFixedCosts();
      return fixedCosts;
    } catch (error) {
      logger.error('IPC: 모든 고정비 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async createFixedCost(_: IpcMainInvokeEvent, fixedCostData: FixedCost) {
    try {
      logger.info('IPC: 새 고정비 생성 요청', { data: fixedCostData });
      return await this.fixedCostService.createFixedCost(fixedCostData);
    } catch (error) {
      logger.error('IPC: 새 고정비 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateFixedCost(_: IpcMainInvokeEvent, fixedCostData: FixedCost) {
    try {
      logger.info('IPC: 고정비 수정 요청', { data: fixedCostData });
      await this.fixedCostService.updateFixedCost(fixedCostData);
    } catch (error) {
      logger.error('IPC: 고정비 수정 중 오류 발생', error);
      throw error;
    }   
  }

  private async deleteFixedCost(_: IpcMainInvokeEvent, fixedCostData: FixedCost) {
    try {
      logger.info('IPC: 고정비 삭제 요청', { data: fixedCostData });
      await this.fixedCostService.deleteFixedCost(fixedCostData);
    } catch (error) {
      logger.error('IPC: 고정비 삭제 중 오류 발생', error);
      throw error;
    }
  }

  private async getAllGoal(_: IpcMainInvokeEvent) {
    try {
      logger.info('IPC: 모든 목표 조회 요청');
      const goals = await this.goalService.getAllGoals();
      return goals;
    } catch (error) {
      logger.error('IPC: 모든 목표 조회 중 오류 발생', error);
      throw error;
    }
  }

  private async createGoal(_: IpcMainInvokeEvent, goalData: Goal) {
    try {
      logger.info('IPC: 새 목표 생성 요청', { data: goalData });
      return await this.goalService.createGoal(goalData);
    } catch (error) {
      logger.error('IPC: 새 목표 생성 중 오류 발생', error);
      throw error;
    }
  }

  private async updateGoal(_: IpcMainInvokeEvent, goalData: Goal) {
    try {
      logger.info('IPC: 목표 수정 요청', { data: goalData });
      await this.goalService.updateGoal(goalData);
    } catch (error) {
      logger.error('IPC: 목표 수정 중 오류 발생', error);
      throw error;
    }
  }

  private async deleteGoal(_: IpcMainInvokeEvent, goalData: Goal) {
    try {
      logger.info('IPC: 목표 삭제 요청', { data: goalData });
      await this.goalService.deleteGoal(goalData);
    } catch (error) {
      logger.error('IPC: 목표 삭제 중 오류 발생', error);
      throw error;
    }
  }
}