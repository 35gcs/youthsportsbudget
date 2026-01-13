import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { budgetsAPI, seasonsAPI, teamsAPI } from '../services/api';
import { Plus, DollarSign } from 'lucide-react';
import { ExpenseCategory, getExpenseCategoryLabel } from '../types';

export default function Budgets() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [formData, setFormData] = useState({
    season_id: '',
    team_id: '',
    category: '',
    budgeted_amount: 0,
    notes: '',
  });

  const queryClient = useQueryClient();
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams', selectedSeason],
    queryFn: () => teamsAPI.getAll(selectedSeason || undefined),
    enabled: !!selectedSeason,
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets', selectedSeason, selectedTeam],
    queryFn: () => budgetsAPI.getAll(selectedSeason || undefined, selectedTeam || undefined),
  });

  const createMutation = useMutation({
    mutationFn: budgetsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setShowForm(false);
      setFormData({
        season_id: '',
        team_id: '',
        category: '',
        budgeted_amount: 0,
        notes: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      team_id: formData.team_id || undefined,
    });
  };

  const expenseCategories = Object.values(ExpenseCategory);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
            <p className="text-text-secondary">Plan and manage budgets for seasons and teams</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Budget</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Filter by Season
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(e.target.value);
                setSelectedTeam('');
              }}
              className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
            >
              <option value="">All Seasons</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Filter by Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
              disabled={!selectedSeason}
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Season
                  </label>
                  <select
                    value={formData.season_id}
                    onChange={(e) => {
                      setFormData({ ...formData, season_id: e.target.value, team_id: '' });
                    }}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    <option value="">Select season</option>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Team (Optional)
                  </label>
                  <select
                    value={formData.team_id}
                    onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    <option value="">Season-wide budget</option>
                    {teams
                      .filter((t) => t.season_id === formData.season_id)
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getExpenseCategoryLabel(cat)}
                      </option>
                    ))}
                    <option value="total">Total Budget</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Budgeted Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budgeted_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, budgeted_amount: parseFloat(e.target.value) })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Budget'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-bg-primary hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-bg-secondary rounded-lg p-6 border border-white/10 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="w-5 h-5 text-sports-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    {budget.category === 'total'
                      ? 'Total Budget'
                      : getExpenseCategoryLabel(budget.category as ExpenseCategory)}
                  </h3>
                </div>
                <p className="text-text-secondary text-sm">
                  {budget.team_id
                    ? teams.find((t) => t.id === budget.team_id)?.name || 'Team'
                    : seasons.find((s) => s.id === budget.season_id)?.name || 'Season'}
                </p>
                {budget.notes && (
                  <p className="text-text-secondary text-sm mt-2">{budget.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${budget.budgeted_amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {budgets.length === 0 && (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <DollarSign className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Budgets Yet</h3>
            <p className="text-text-secondary">Create your first budget to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
