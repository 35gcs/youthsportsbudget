import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { budgetsAPI, seasonsAPI, expensesAPI, revenuesAPI } from '../services/api';
import { FileText, Download } from 'lucide-react';
import { getExpenseCategoryLabel, getRevenueCategoryLabel } from '../types';

export default function Reports() {
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const { data: summary } = useQuery({
    queryKey: ['budget-summary', selectedSeason],
    queryFn: () => budgetsAPI.getSummary(selectedSeason),
    enabled: !!selectedSeason,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', selectedSeason],
    queryFn: () => expensesAPI.getAll(selectedSeason),
    enabled: !!selectedSeason,
  });

  const { data: revenues = [] } = useQuery({
    queryKey: ['revenues', selectedSeason],
    queryFn: () => revenuesAPI.getAll(selectedSeason),
    enabled: !!selectedSeason,
  });

  const expensesByCategory = expenses.reduce((acc, exp) => {
    const cat = getExpenseCategoryLabel(exp.category);
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const revenuesByCategory = revenues.reduce((acc, rev) => {
    const cat = getRevenueCategoryLabel(rev.category);
    acc[cat] = (acc[cat] || 0) + rev.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
            <p className="text-text-secondary">Financial reports and analytics</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select Season
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
          >
            <option value="">Select a season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSeason && summary ? (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Financial Summary</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-sports-primary hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Budgeted</p>
                  <p className="text-2xl font-bold text-white">
                    ${summary.total_budgeted.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${summary.total_expenses.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${summary.total_revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Profit/Loss</p>
                  <p
                    className={`text-2xl font-bold ${
                      summary.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    ${summary.profit_loss.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Expenses by Category */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-text-secondary">{category}</span>
                      <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Revenues by Category */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Revenues by Category</h3>
              <div className="space-y-3">
                {Object.entries(revenuesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-text-secondary">{category}</span>
                      <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select a Season</h3>
            <p className="text-text-secondary">Choose a season to view financial reports</p>
          </div>
        )}
      </div>
    </div>
  );
}
