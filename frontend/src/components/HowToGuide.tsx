import { useState } from 'react';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const steps = [
    {
      id: 'setup',
      title: '1. Initial Setup',
      icon: '🏗️',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Create a Season:</strong>
              <p>Go to <Link to="/seasons" className="text-sports-primary hover:underline">Seasons</Link> and create your first season (e.g., "Spring 2024"). Set the start and end dates.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'teams',
      title: '2. Add Teams',
      icon: '👥',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Create Teams:</strong>
              <p>Go to <Link to="/teams" className="text-sports-primary hover:underline">Teams</Link> and add teams for your season. Include age group, sport, and registration fee.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Set Registration Fees:</strong>
              <p>Enter the registration fee per player when creating each team. This will be used for revenue tracking.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'budget',
      title: '3. Set Budgets',
      icon: '💰',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Create Budget Categories:</strong>
              <p>Go to <Link to="/budgets" className="text-sports-primary hover:underline">Budgets</Link> and set budgeted amounts for categories like equipment, uniforms, field rental, etc.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Budget by Season or Team:</strong>
              <p>You can create budgets for the entire season or specific teams. Team budgets roll up to the season total.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'track',
      title: '4. Track Expenses & Revenue',
      icon: '📊',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Quick Entry for Registration Fees:</strong>
              <p>Use <Link to="/quick-actions" className="text-sports-primary hover:underline">Quick Entry</Link> to quickly record registration fees for multiple players at once.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Record Expenses:</strong>
              <p>Go to <Link to="/expenses" className="text-sports-primary hover:underline">Expenses</Link> to log purchases, equipment, field rentals, etc. Categorize each expense.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Record Revenue:</strong>
              <p>Go to <Link to="/revenues" className="text-sports-primary hover:underline">Revenues</Link> to track registration fees, sponsorships, fundraisers, and other income.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'monitor',
      title: '5. Monitor & Report',
      icon: '📈',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Dashboard Overview:</strong>
              <p>View your financial summary on the <Link to="/" className="text-sports-primary hover:underline">Dashboard</Link>. Filter by team to see team-specific financials.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Financial Reports:</strong>
              <p>Go to <Link to="/reports" className="text-sports-primary hover:underline">Reports</Link> to see detailed breakdowns by category, season, and team.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Financial Transparency:</strong>
              <p>Use <Link to="/transparency" className="text-sports-primary hover:underline">Transparency</Link> to generate public reports showing per-player costs and financial breakdowns for parents.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bulk',
      title: '6. Bulk Import',
      icon: '📥',
      content: (
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Bulk Import Data:</strong>
              <p>Go to <Link to="/import" className="text-sports-primary hover:underline">Import</Link> to bulk import seasons, teams, expenses, and revenues from CSV files.</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white">Download Templates:</strong>
              <p>Download CSV templates, fill in your data, and upload to quickly add multiple seasons or teams.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors z-50"
      >
        <BookOpen className="w-5 h-5" />
        <span>How to Use</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary rounded-lg border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-sports-primary" />
            <h2 className="text-2xl font-bold text-white">How to Use This System</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-bg-primary rounded-lg border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(step.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{step.icon}</span>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                </button>
                {expandedSection === step.id && (
                  <div className="px-4 pb-4">{step.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Use <strong className="text-white">Quick Entry</strong> for fast registration fee recording</li>
            <li>• Filter by team on the Dashboard to see team-specific financials</li>
            <li>• Use <strong className="text-white">Transparency</strong> to share financial reports with parents</li>
            <li>• Use bulk import for managing multiple seasons or teams</li>
            <li>• Set budgets before the season starts to track spending throughout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
