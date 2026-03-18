import { dashboardModel } from '../models/dashboard.model';

export class DashboardController {

  async getStats() {
    return dashboardModel.getStats();
  }
}

export const dashboardController = new DashboardController();
