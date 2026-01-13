import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import HowToGuide from '../components/HowToGuide';
import { seasonsAPI, budgetsAPI, teamsAPI } from '../services/api';
import type { BudgetSummary, TeamBudgetSummary } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Zap, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const activeSeason = seasons.find((s) => s.is_active);

  const { data: teams = [] } = useQuery({
    queryKey: ['teams', activeSeason?.id],
    queryFn: () => {
      if (!activeSeason?.id) return Promise.resolve([]);
      return teamsAPI.getAll(activeSeason.id);
    },
    enabled: !!activeSeason?.id,
  });

  const { data: summary } = useQuery<BudgetSummary | TeamBudgetSummary>({
    queryKey: ['budget-summary', activeSeason?.id, selectedTeamId],
    queryFn: () => {
      if (selectedTeamId) {
        return budgetsAPI.getTeamSummary(selectedTeamId) as Promise<TeamBudgetSummary>;
      }
      return budgetsAPI.getSummary(activeSeason!.id) as Promise<BudgetSummary>;
    },
    enabled: !!activeSeason,
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <HowToGuide />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-text-secondary">Overview of your sports organization's finances</p>
            </div>
          </div>
        </div>

        {activeSeason && summary ? (
          <>
            <div className="mb-6 p-4 bg-bg-secondary rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">{activeSeason.name}</h2>
                  <p className="text-text-secondary text-sm">
                    {format(new Date(activeSeason.start_date), 'MMM d')} -{' '}
                    {format(new Date(activeSeason.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <Link
                  to="/seasons"
                  className="text-sports-primary hover:text-blue-400 text-sm font-medium"
                >
                  View All Seasons →
                </Link>
              </div>
              
              {/* Team Filter */}
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-text-secondary" />
                  <label className="text-sm font-medium text-text-secondary">Filter by Team:</label>
                </div>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="flex-1 max-w-xs px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {selectedTeamId && (
                  <button
                    onClick={() => setSelectedTeamId('')}
                    className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-text-secondary text-sm mb-1">
                  {selectedTeamId ? 'Team Budgeted' : 'Total Budgeted'}
                </h3>
                <p className="text-2xl font-bold text-white">
                  ${summary.total_budgeted.toLocaleString()}
                </p>
              </div>

              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <h3 className="text-text-secondary text-sm mb-1">
                  {selectedTeamId ? 'Team Expenses' : 'Total Expenses'}
                </h3>
                <p className="text-2xl font-bold text-white">
                  ${summary.total_expenses.toLocaleString()}
                </p>
              </div>

              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <h3 className="text-text-secondary text-sm mb-1">
                  {selectedTeamId ? 'Team Revenue' : 'Total Revenue'}
                </h3>
                <p className="text-2xl font-bold text-white">
                  ${summary.total_revenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      summary.profit_loss >= 0
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    }`}
                  >
                    <DollarSign
                      className={`w-6 h-6 ${
                        summary.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    />
                  </div>
                </div>
                <h3 className="text-text-secondary text-sm mb-1">Profit/Loss</h3>
                <p
                  className={`text-2xl font-bold ${
                    summary.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ${summary.profit_loss.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Remaining Budget</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
                    <span>Available</span>
                    <span>
                      {summary.remaining_budget >= 0 ? (
                        <span className="text-green-400">
                          ${summary.remaining_budget.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-red-400">
                          ${Math.abs(summary.remaining_budget).toLocaleString()} over
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-bg-primary rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        summary.remaining_budget >= 0
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, (summary.remaining_budget / (summary.total_budgeted || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  {summary.total_budgeted > 0
                    ? `${((summary.remaining_budget / summary.total_budgeted) * 100).toFixed(1)}% of budget remaining`
                    : 'No budget set'}
                </p>
              </div>

              <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/quick-actions"
                    className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg hover:bg-white/5 transition-colors border border-yellow-500/20"
                  >
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <span className="text-white font-medium">Quick Entry</span>
                      <p className="text-xs text-text-secondary">Registration fees & expenses</p>
                    </div>
                  </Link>
                  <Link
                    to="/expenses"
                    className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span className="text-white">Add Expense</span>
                  </Link>
                  <Link
                    to="/revenues"
                    className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-white">Add Revenue</span>
                  </Link>
                  <Link
                    to="/transparency"
                    className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-sports-primary" />
                    <span className="text-white">Financial Transparency</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Season</h3>
            <p className="text-text-secondary mb-6">
              Create a season to start tracking your budget
            </p>
            <Link
              to="/seasons"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Create Season</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
