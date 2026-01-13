import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { transparencyAPI, seasonsAPI } from '../services/api';
import { Eye, TrendingUp, TrendingDown, Users, Download } from 'lucide-react';

export default function Transparency() {
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const activeSeason = seasons.find((s) => s.is_active) || seasons[0];
  const seasonId = selectedSeason || activeSeason?.id || '';

  const { data: report } = useQuery({
    queryKey: ['transparency-report', seasonId],
    queryFn: () => transparencyAPI.getSeasonReport(seasonId),
    enabled: !!seasonId,
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Eye className="w-8 h-8 text-sports-primary" />
            <h1 className="text-3xl font-bold text-white">Financial Transparency</h1>
          </div>
          <p className="text-text-secondary">
            Public financial reports showing where every dollar goes
          </p>
        </div>

        {/* Season Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Season
          </label>
          <select
            value={seasonId}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        {report ? (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">Financial Transparency Report</h2>
                  <p className="text-text-secondary">Complete Financial Breakdown</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-sports-primary hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Budgeted</p>
                  <p className="text-2xl font-bold text-white">${report.total_budgeted.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">${report.total_expenses.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">${report.total_revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm mb-1">Net Result</p>
                  <p
                    className={`text-2xl font-bold ${
                      report.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    ${report.profit_loss.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span>Where Money Was Spent</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(report.expenses_by_category)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
                        <span className="text-text-secondary">{category}</span>
                        <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Where Money Came From</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(report.revenues_by_category)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
                        <span className="text-text-secondary">{category}</span>
                        <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Per-Player Cost Breakdown */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Users className="w-6 h-6 text-sports-primary" />
                <span>Per-Player Cost Breakdown</span>
              </h3>
              <div className="space-y-4">
                {report.player_cost_breakdown.map((breakdown) => (
                  <div key={breakdown.team_id} className="bg-bg-primary rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{breakdown.team_name}</h4>
                      <div className="text-right">
                        <p className="text-text-secondary text-sm">Total Cost</p>
                        <p className="text-2xl font-bold text-white">${breakdown.total_cost.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-text-secondary text-sm mb-1">Players</p>
                        <p className="text-lg font-semibold text-white">{breakdown.player_count}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm mb-1">Cost Per Player</p>
                        <p className="text-lg font-semibold text-green-400">
                          ${breakdown.cost_per_player.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm mb-1">Registration Fees</p>
                        <p className="text-lg font-semibold text-white">
                          ${breakdown.registration_fee.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm mb-1">Other Costs</p>
                        <p className="text-lg font-semibold text-white">
                          ${breakdown.other_costs.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-text-secondary text-sm mb-2">Cost Breakdown by Category:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(breakdown.breakdown_by_category).map(([category, amount]) => (
                          <div
                            key={category}
                            className="px-3 py-1 bg-bg-secondary rounded-lg text-sm border border-white/5"
                          >
                            <span className="text-text-secondary">{category}:</span>{' '}
                            <span className="text-white font-semibold">${amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <Eye className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select a Season</h3>
            <p className="text-text-secondary">Choose a season to view financial transparency report</p>
          </div>
        )}
      </div>
    </div>
  );
}
