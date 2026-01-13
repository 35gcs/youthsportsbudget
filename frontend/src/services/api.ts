import axios from 'axios';
import type {
  User,
  Season,
  Team,
  Budget,
  Expense,
  Revenue,
  BudgetSummary,
  TeamBudgetSummary,
  AuthResponse,
  LoginCredentials,
  ExpenseCategory,
  RevenueCategory,
  Organization,
  PlayerCostBreakdown,
  TransparencyReport,
} from '../types';

const api = axios.create({
  baseURL: (import.meta.env as any)?.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - no auth needed for now
api.interceptors.request.use((config) => {
  // Auth removed - all routes are public
  return config;
});

// Response interceptor - simplified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just log errors, don't redirect
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, fullName: string, role: string = 'viewer'): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      full_name: fullName,
      role,
    });
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Seasons API
export const seasonsAPI = {
  getAll: async (): Promise<Season[]> => {
    const response = await api.get<Season[]>('/seasons/');
    return response.data;
  },

  create: async (data: Omit<Season, 'id' | 'created_at'>): Promise<Season> => {
    const response = await api.post<Season>('/seasons/', data);
    return response.data;
  },

  getById: async (id: string): Promise<Season> => {
    const response = await api.get<Season>(`/seasons/${id}`);
    return response.data;
  },

  update: async (id: string, data: Omit<Season, 'id' | 'created_at'>): Promise<Season> => {
    const response = await api.put<Season>(`/seasons/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/seasons/${id}`);
  },
};

// Teams API
export const teamsAPI = {
  getAll: async (seasonId?: string): Promise<Team[]> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<Team[]>('/teams/', { params });
    return response.data;
  },

  create: async (data: Omit<Team, 'id' | 'created_at' | 'current_players'>): Promise<Team> => {
    const response = await api.post<Team>('/teams/', data);
    return response.data;
  },

  getById: async (id: string): Promise<Team> => {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  },
};

// Budgets API
export const budgetsAPI = {
  getAll: async (seasonId?: string, teamId?: string): Promise<Budget[]> => {
    const params: any = {};
    if (seasonId) params.season_id = seasonId;
    if (teamId) params.team_id = teamId;
    const response = await api.get<Budget[]>('/budgets/', { params });
    return response.data;
  },

  create: async (data: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> => {
    const response = await api.post<Budget>('/budgets/', data);
    return response.data;
  },

  getSummary: async (seasonId: string): Promise<BudgetSummary> => {
    const response = await api.get<BudgetSummary>('/budgets/summary', {
      params: { season_id: seasonId },
    });
    return response.data;
  },

  getTeamSummary: async (teamId: string): Promise<TeamBudgetSummary> => {
    const response = await api.get<TeamBudgetSummary>(`/budgets/team/${teamId}/summary`);
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async (seasonId?: string, teamId?: string, category?: ExpenseCategory): Promise<Expense[]> => {
    const params: any = {};
    if (seasonId) params.season_id = seasonId;
    if (teamId) params.team_id = teamId;
    if (category) params.category = category;
    const response = await api.get<Expense[]>('/expenses/', { params });
    return response.data;
  },

  create: async (data: Omit<Expense, 'id' | 'created_by' | 'created_at'>): Promise<Expense> => {
    const response = await api.post<Expense>('/expenses/', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

// Revenues API
export const revenuesAPI = {
  getAll: async (seasonId?: string, teamId?: string, category?: RevenueCategory): Promise<Revenue[]> => {
    const params: any = {};
    if (seasonId) params.season_id = seasonId;
    if (teamId) params.team_id = teamId;
    if (category) params.category = category;
    const response = await api.get<Revenue[]>('/revenues/', { params });
    return response.data;
  },

  create: async (data: Omit<Revenue, 'id' | 'created_by' | 'created_at'>): Promise<Revenue> => {
    const response = await api.post<Revenue>('/revenues/', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/revenues/${id}`);
  },
};

// Organizations API
export const organizationsAPI = {
  getAll: async (): Promise<Organization[]> => {
    const response = await api.get<Organization[]>('/organizations/');
    return response.data;
  },

  create: async (data: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> => {
    const response = await api.post<Organization>('/organizations/', data);
    return response.data;
  },

  getById: async (id: string): Promise<Organization> => {
    const response = await api.get<Organization>(`/organizations/${id}`);
    return response.data;
  },
};

// Quick Actions API
export const quickActionsAPI = {
  bulkRegistrationFees: async (teamId: string, playerCount: number, feePerPlayer: number, paymentDate: string, notes?: string) => {
    const response = await api.post('/quick/bulk-registration-fees', {
      team_id: teamId,
      player_count: playerCount,
      fee_per_player: feePerPlayer,
      payment_date: paymentDate,
      notes,
    });
    return response.data;
  },

  quickExpense: async (teamId: string, seasonId: string, category: ExpenseCategory, amount: number, description: string, paymentDate: string, playerCount?: number) => {
    const response = await api.post('/quick/quick-expense', {
      team_id: teamId,
      amount,
      description,
      payment_date: paymentDate,
      player_count: playerCount,
    }, {
      params: { 
        category,
        season_id: seasonId,
      },
    });
    return response.data;
  },
};

// Transparency API
export const transparencyAPI = {
  getSeasonReport: async (seasonId: string): Promise<TransparencyReport> => {
    const response = await api.get<TransparencyReport>(`/transparency/season/${seasonId}/report`);
    return response.data;
  },

  getOrganizationReport: async (orgId: string, seasonId?: string): Promise<TransparencyReport> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<TransparencyReport>(`/transparency/organization/${orgId}/report`, { params });
    return response.data;
  },

  getTeamPlayerCosts: async (teamId: string): Promise<PlayerCostBreakdown> => {
    const response = await api.get<PlayerCostBreakdown>(`/transparency/team/${teamId}/player-costs`);
    return response.data;
  },
};

// Import API
export const importAPI = {
  importData: async (type: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/import/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadTemplate: async (type: string): Promise<Blob> => {
    const response = await api.get(`/import/templates/${type}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
