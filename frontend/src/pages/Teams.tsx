import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { teamsAPI, seasonsAPI } from '../services/api';
import { Plus, Users } from 'lucide-react';

export default function Teams() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    age_group: '',
    sport: '',
    gender: '',
    max_players: 20,
    registration_fee: 0,
    season_id: '',
  });

  const queryClient = useQueryClient();
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams', selectedSeason],
    queryFn: () => teamsAPI.getAll(selectedSeason || undefined),
  });

  const createMutation = useMutation({
    mutationFn: teamsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setShowForm(false);
      setFormData({
        name: '',
        age_group: '',
        sport: '',
        gender: '',
        max_players: 20,
        registration_fee: 0,
        season_id: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
            <p className="text-text-secondary">Manage teams and their budgets</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Team</span>
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Filter by Season
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
          >
            <option value="">All Seasons</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Team</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Season
                  </label>
                  <select
                    value={formData.season_id}
                    onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
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
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="U10 Boys Soccer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Age Group
                  </label>
                  <input
                    type="text"
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="U10, U12, U14, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Sport</label>
                  <input
                    type="text"
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="Soccer, Basketball, Baseball, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    <option value="">Select gender</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="coed">Coed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Max Players
                  </label>
                  <input
                    type="number"
                    value={formData.max_players}
                    onChange={(e) =>
                      setFormData({ ...formData, max_players: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Registration Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.registration_fee}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_fee: parseFloat(e.target.value) })
                    }
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
                  {createMutation.isPending ? 'Creating...' : 'Create Team'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-bg-secondary rounded-lg p-6 border border-white/10 hover:border-sports-primary/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sport:</span>
                  <span className="text-white">{team.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Age Group:</span>
                  <span className="text-white">{team.age_group}</span>
                </div>
                {team.gender && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Gender:</span>
                    <span className="text-white capitalize">{team.gender}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Players:</span>
                  <span className="text-white">
                    {team.current_players} / {team.max_players}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Registration Fee:</span>
                  <span className="text-white">${team.registration_fee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
            <p className="text-text-secondary">Create your first team to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
