import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { seasonsAPI } from '../services/api';
import { Plus, Calendar, CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SeasonType, getSeasonTypeLabel, Season } from '../types';

export default function Seasons() {
  const [showForm, setShowForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    season_type: SeasonType.FALL,
    year: new Date().getFullYear(),
    start_date: '',
    end_date: '',
    is_active: true,
    organization_id: undefined as string | undefined,
  });

  const queryClient = useQueryClient();
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: seasonsAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: seasonsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      setShowForm(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating season:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to create season. Please try again.';
      // Handle array of validation errors
      if (Array.isArray(errorMessage)) {
        alert(errorMessage.map((e: any) => e.msg || e).join('\n'));
      } else {
        alert(errorMessage);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Season, 'id' | 'created_at'> }) =>
      seasonsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      setEditingSeason(null);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating season:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to update season. Please try again.';
      if (Array.isArray(errorMessage)) {
        alert(errorMessage.map((e: any) => e.msg || e).join('\n'));
      } else {
        alert(errorMessage);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: seasonsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
    onError: (error: any) => {
      console.error('Error deleting season:', error);
      alert(error?.response?.data?.detail || 'Failed to delete season. Please try again.');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      season_type: SeasonType.FALL,
      year: new Date().getFullYear(),
      start_date: '',
      end_date: '',
      is_active: true,
      organization_id: undefined,
    });
  };

  const handleEdit = (season: Season) => {
    setEditingSeason(season);
    // Format date for input (handle both ISO string and date string formats)
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      // If it's already in YYYY-MM-DD format, return as is
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
      // Otherwise, extract the date part from ISO string
      return dateStr.split('T')[0];
    };
    
    setFormData({
      name: season.name,
      season_type: season.season_type,
      year: season.year,
      start_date: formatDateForInput(season.start_date),
      end_date: formatDateForInput(season.end_date),
      is_active: season.is_active,
      organization_id: (season as any).organization_id,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this season? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSeason(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter a season name');
      return;
    }
    if (!formData.start_date) {
      alert('Please select a start date');
      return;
    }
    if (!formData.end_date) {
      alert('Please select an end date');
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      alert('End date must be after start date');
      return;
    }
    
    // Ensure season_type is the string value (not the enum key)
    const seasonTypeValue = typeof formData.season_type === 'string' 
      ? formData.season_type 
      : (formData.season_type as any).value || formData.season_type;
    
    const payload = {
      name: formData.name.trim(),
      season_type: seasonTypeValue.toLowerCase(), // Ensure lowercase
      year: formData.year,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_active: formData.is_active,
      organization_id: formData.organization_id || undefined,
    };
    
    console.log('Submitting season:', payload); // Debug log
    
    if (editingSeason) {
      updateMutation.mutate({ id: editingSeason.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Seasons</h1>
            <p className="text-text-secondary">Manage sports seasons and their budgets</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Season</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingSeason ? 'Edit Season' : 'Create New Season'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Season Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                    placeholder="Spring 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Season Type
                  </label>
                  <select
                    value={formData.season_type}
                    onChange={(e) =>
                      setFormData({ ...formData, season_type: e.target.value as SeasonType })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  >
                    {Object.values(SeasonType).map((type) => (
                      <option key={type} value={type}>
                        {getSeasonTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-bg-primary border border-white/10 text-white focus:outline-none focus:border-sports-primary"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-bg-primary border-white/10 text-sports-primary focus:ring-sports-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-text-secondary">
                    Active Season
                  </label>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? (editingSeason ? 'Updating...' : 'Creating...')
                    : (editingSeason ? 'Update Season' : 'Create Season')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-bg-primary hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="bg-bg-secondary rounded-lg p-6 border border-white/10 hover:border-sports-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{season.name}</h3>
                  <p className="text-text-secondary text-sm">
                    {getSeasonTypeLabel(season.season_type)} {season.year}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {season.is_active ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-text-secondary" />
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Start:</span>
                  <span className="text-white">
                    {format(new Date(season.start_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">End:</span>
                  <span className="text-white">
                    {format(new Date(season.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(season)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-bg-primary hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(season.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {seasons.length === 0 && (
          <div className="bg-bg-secondary rounded-lg p-12 text-center border border-white/10">
            <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Seasons Yet</h3>
            <p className="text-text-secondary">Create your first season to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
