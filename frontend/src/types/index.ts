export enum UserRole {
  ADMIN = "admin",
  COACH = "coach",
  VIEWER = "viewer",
}

export enum SeasonType {
  SPRING = "spring",
  SUMMER = "summer",
  FALL = "fall",
  WINTER = "winter",
}

export enum ExpenseCategory {
  EQUIPMENT = "equipment",
  UNIFORMS = "uniforms",
  FIELD_RENTAL = "field_rental",
  REFEREE_FEES = "referee_fees",
  COACHING_STIPENDS = "coaching_stipends",
  TRAVEL = "travel",
  TOURNAMENT_FEES = "tournament_fees",
  INSURANCE = "insurance",
  FIRST_AID = "first_aid",
  AWARDS = "awards",
  MARKETING = "marketing",
  ADMINISTRATION = "administration",
  OTHER = "other",
}

export enum RevenueCategory {
  REGISTRATION_FEES = "registration_fees",
  SPONSORSHIPS = "sponsorships",
  FUNDRAISERS = "fundraisers",
  CONCESSIONS = "concessions",
  MERCHANDISE = "merchandise",
  DONATIONS = "donations",
  OTHER = "other",
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  created_at: string;
}

export interface Season {
  id: string;
  name: string;
  season_type: SeasonType;
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  season_id: string;
  name: string;
  age_group: string;
  sport: string;
  gender?: string;
  coach_id?: string;
  max_players: number;
  current_players: number;
  registration_fee: number;
  created_at: string;
}

export interface Budget {
  id: string;
  season_id: string;
  team_id?: string;
  category: string;
  budgeted_amount: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  season_id: string;
  team_id?: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vendor?: string;
  receipt_number?: string;
  payment_date: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface Revenue {
  id: string;
  season_id: string;
  team_id?: string;
  category: RevenueCategory;
  description: string;
  amount: number;
  source?: string;
  payment_date: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface BudgetSummary {
  season_id: string;
  season_name: string;
  total_budgeted: number;
  total_expenses: number;
  total_revenue: number;
  remaining_budget: number;
  profit_loss: number;
}

export interface TeamBudgetSummary {
  team_id: string;
  team_name: string;
  total_budgeted: number;
  total_expenses: number;
  total_revenue: number;
  remaining_budget: number;
  profit_loss: number;
  player_count: number;
  registration_fees_collected: number;
  registration_fees_expected: number;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  is_public: boolean;
  created_at: string;
}

export interface PlayerCostBreakdown {
  team_id: string;
  team_name: string;
  total_cost: number;
  player_count: number;
  cost_per_player: number;
  registration_fee: number;
  other_costs: number;
  breakdown_by_category: Record<string, number>;
}

export interface TransparencyReport {
  organization_id: string;
  organization_name: string;
  season_id?: string;
  total_budgeted: number;
  total_expenses: number;
  total_revenue: number;
  expenses_by_category: Record<string, number>;
  revenues_by_category: Record<string, number>;
  player_cost_breakdown: PlayerCostBreakdown[];
  profit_loss: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Helper functions for display
export const getExpenseCategoryLabel = (category: ExpenseCategory): string => {
  const labels: Record<ExpenseCategory, string> = {
    [ExpenseCategory.EQUIPMENT]: "Equipment",
    [ExpenseCategory.UNIFORMS]: "Uniforms & Apparel",
    [ExpenseCategory.FIELD_RENTAL]: "Field/Facility Rental",
    [ExpenseCategory.REFEREE_FEES]: "Referee/Umpire Fees",
    [ExpenseCategory.COACHING_STIPENDS]: "Coaching Stipends",
    [ExpenseCategory.TRAVEL]: "Travel & Transportation",
    [ExpenseCategory.TOURNAMENT_FEES]: "Tournament Fees",
    [ExpenseCategory.INSURANCE]: "Insurance",
    [ExpenseCategory.FIRST_AID]: "First Aid & Medical",
    [ExpenseCategory.AWARDS]: "Awards & Trophies",
    [ExpenseCategory.MARKETING]: "Marketing & Promotion",
    [ExpenseCategory.ADMINISTRATION]: "Administration",
    [ExpenseCategory.OTHER]: "Other",
  };
  return labels[category] || category;
};

export const getRevenueCategoryLabel = (category: RevenueCategory): string => {
  const labels: Record<RevenueCategory, string> = {
    [RevenueCategory.REGISTRATION_FEES]: "Registration Fees",
    [RevenueCategory.SPONSORSHIPS]: "Sponsorships",
    [RevenueCategory.FUNDRAISERS]: "Fundraisers",
    [RevenueCategory.CONCESSIONS]: "Concessions",
    [RevenueCategory.MERCHANDISE]: "Merchandise Sales",
    [RevenueCategory.DONATIONS]: "Donations",
    [RevenueCategory.OTHER]: "Other",
  };
  return labels[category] || category;
};

export const getSeasonTypeLabel = (type: SeasonType): string => {
  const labels: Record<SeasonType, string> = {
    [SeasonType.SPRING]: "Spring",
    [SeasonType.SUMMER]: "Summer",
    [SeasonType.FALL]: "Fall",
    [SeasonType.WINTER]: "Winter",
  };
  return labels[type] || type;
};
