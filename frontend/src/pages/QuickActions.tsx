import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { quickActionsAPI, teamsAPI, seasonsAPI } from '../services/api';
import { Zap, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { ExpenseCategory, getExpenseCategoryLabel } from '../types';

export default function QuickActions() {
  const [activeTab, setActiveTab] = useState<'registration' | 'expense'>('registration');
  const [selectedSeasonForRegistration, setSelectedSeasonForRegistration] = useState<string>('');
  const [registrationForm, setRegistrationForm] = useState({
    team_id: '',
    player_count: 0,
    fee_per_player: 0,
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [expenseForm, setExpenseForm] = useState({
    team_id: '',
    season_id: '',
    category: ExpenseCategory.OTHER,
    amount: 0,
    description: '',
    payment_date: new Date().toISOString().split('T')[0],
    player_count: 0,
  });

  const queryClient = useQueryClient();
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const { data: teamsForRegistration = [] } = useQuery({
    queryKey: ['teams', selectedSeasonForRegistration],
    queryFn: () => teamsAPI.getAll(selectedSeasonForRegistration || undefined),
    enabled: !!selectedSeasonForRegistration,
  });

  const { data: teamsForExpense = [] } = useQuery({
    queryKey: ['teams', expenseForm.season_id],
    queryFn: () => teamsAPI.getAll(expenseForm.season_id || undefined),
    enabled: !!expenseForm.season_id,
  });

  const registrationMutation = useMutation({
    mutationFn: () =>
      quickActionsAPI.bulkRegistrationFees(
        registrationForm.team_id,
        registrationForm.player_count,
        registrationForm.fee_per_player,
        registrationForm.payment_date,
        registrationForm.notes
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setRegistrationForm({
        team_id: '',
        player_count: 0,
        fee_per_player: 0,
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      alert('Registration fees recorded successfully!');
    },
  });

  const expenseMutation = useMutation({
    mutationFn: () =>
      quickActionsAPI.quickExpense(
        expenseForm.team_id,
        expenseForm.season_id,
        expenseForm.category,
        expenseForm.amount,
        expenseForm.description,
        expenseForm.payment_date,
        expenseForm.player_count || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setExpenseForm({
        team_id: '',
        season_id: '',
        category: ExpenseCategory.OTHER,
        amount: 0,
        description: '',
        payment_date: new Date().toISOString().split('T')[0],
        player_count: 0,
      });
      alert('Expense recorded successfully!');
    },
  });


  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quick Actions</h1>
          <p className="text-text-secondary">Fast entry for common transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-bg-secondary rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('registration')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              activeTab === 'registration'
                ? 'bg-sports-primary text-white'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Registration Fees</span>
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              activeTab === 'expense'
                ? 'bg-sports-primary text-white'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Quick Expense</span>
          </button>
        </div>

        {/* Registration Fees Form */}
        {activeTab === 'registration' && (
          <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-white">Bulk Registration Fees</h2>
            </div>
            <p className="text-text-secondary mb-6">
              Quickly record registration fees for multiple players at once
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                registrationMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Select Season
                  </label>
                  <select
                    value={selectedSeasonForRegistration}
                    onChange={(e) => {
                      setSelectedSeasonForRegistration(e.target.value);
                      setRegistrationForm({ ...registrationForm, team_id: '' });
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    <option value="">Select season first</option>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Team
                  </label>
                  <select
                    value={registrationForm.team_id}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, team_id: e.target.value })}
                    required
                    disabled={!selectedSeasonForRegistration}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary disabled:opacity-50"
                  >
                    <option value="">Select team</option>
                    {teamsForRegistration.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Number of Players
                  </label>
                  <input
                    type="number"
                    value={registrationForm.player_count || ''}
                    onChange={(e) =>
                      setRegistrationForm({ ...registrationForm, player_count: parseInt(e.target.value) || 0 })
                    }
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Fee Per Player ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={registrationForm.fee_per_player || ''}
                    onChange={(e) =>
                      setRegistrationForm({ ...registrationForm, fee_per_player: parseFloat(e.target.value) || 0 })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={registrationForm.payment_date}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, payment_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Total Amount
                  </label>
                  <div className="px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-2xl font-bold text-green-400">
                    ${(registrationForm.player_count * registrationForm.fee_per_player).toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={registrationForm.notes}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  placeholder="Additional notes..."
                />
              </div>
              <button
                type="submit"
                disabled={registrationMutation.isPending}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {registrationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      Record ${(registrationForm.player_count * registrationForm.fee_per_player).toLocaleString()} in
                      Registration Fees
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Quick Expense Form */}
        {activeTab === 'expense' && (
          <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-white">Quick Expense Entry</h2>
            </div>
            <p className="text-text-secondary mb-6">
              Fast expense entry with automatic per-player cost calculation
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                expenseMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Season
                  </label>
                  <select
                    value={expenseForm.season_id}
                    onChange={(e) => {
                      setExpenseForm({ ...expenseForm, season_id: e.target.value, team_id: '' });
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
                    Team
                  </label>
                  <select
                    value={expenseForm.team_id}
                    onChange={(e) => setExpenseForm({ ...expenseForm, team_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    disabled={!expenseForm.season_id}
                  >
                    <option value="">Select team</option>
                    {teamsForExpense.map((team) => (
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
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    {Object.values(ExpenseCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {getExpenseCategoryLabel(cat)}
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
                    value={expenseForm.amount || ''}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="What was purchased?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={expenseForm.payment_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, payment_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Number of Players (Optional)
                  </label>
                  <input
                    type="number"
                    value={expenseForm.player_count || ''}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, player_count: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="For per-player calculation"
                  />
                  {expenseForm.player_count > 0 && expenseForm.amount > 0 && (
                    <p className="text-sm text-text-secondary mt-1">
                      Per player: ${(expenseForm.amount / expenseForm.player_count).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={expenseMutation.isPending}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {expenseMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Record Expense</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
