import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { revenuesAPI, seasonsAPI, teamsAPI } from '../services/api';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { RevenueCategory, getRevenueCategoryLabel } from '../types';

export default function Revenues() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [formData, setFormData] = useState({
    season_id: '',
    team_id: '',
    category: RevenueCategory.OTHER,
    description: '',
    amount: 0,
    source: '',
    payment_date: new Date().toISOString().split('T')[0],
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

  const { data: revenues = [] } = useQuery({
    queryKey: ['revenues', selectedSeason, selectedTeam],
    queryFn: () => revenuesAPI.getAll(selectedSeason || undefined, selectedTeam || undefined),
  });

  const createMutation = useMutation({
    mutationFn: revenuesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setShowForm(false);
      setFormData({
        season_id: '',
        team_id: '',
        category: RevenueCategory.OTHER,
        description: '',
        amount: 0,
        source: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: revenuesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      team_id: formData.team_id || undefined,
    });
  };

  const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Revenues</h1>
            <p className="text-text-secondary">Track all revenue sources for your organization</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Revenue</span>
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
            <h2 className="text-xl font-semibold text-white mb-4">Add New Revenue</h2>
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
                    <option value="">Season-wide revenue</option>
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
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as RevenueCategory })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    {Object.values(RevenueCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {getRevenueCategoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="Registration fees, Sponsorship, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Source (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="Sponsor name, fundraiser name, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Notes (Optional)
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
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Revenue'}
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

        {revenues.length > 0 && (
          <div className="bg-bg-secondary rounded-lg p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Total Revenue:</span>
              <span className="text-2xl font-bold text-green-400">
                ${totalRevenues.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {revenues.map((revenue) => (
            <div
              key={revenue.id}
              className="bg-bg-secondary rounded-lg p-6 border border-white/10 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">{revenue.description}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    {getRevenueCategoryLabel(revenue.category)}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-text-secondary">
                  <p>
                    {revenue.team_id
                      ? teams.find((t) => t.id === revenue.team_id)?.name || 'Team'
                      : seasons.find((s) => s.id === revenue.season_id)?.name || 'Season'}
                  </p>
                  <p>Date: {format(new Date(revenue.payment_date), 'MMM d, yyyy')}</p>
                  {revenue.source && <p>Source: {revenue.source}</p>}
                  {revenue.notes && <p className="mt-2">{revenue.notes}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    ${revenue.amount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(revenue.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {revenues.length === 0 && (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <TrendingUp className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Revenues Yet</h3>
            <p className="text-text-secondary">Add your first revenue entry to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
