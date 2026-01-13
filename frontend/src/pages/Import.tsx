import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import { importAPI } from '../services/api';
import { Upload, Download, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type ImportType = 'seasons' | 'teams' | 'expenses' | 'revenues';

export default function Import() {
  const [selectedType, setSelectedType] = useState<ImportType>('seasons');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  const importMutation = useMutation({
    mutationFn: (data: { type: ImportType; file: File }) => importAPI.importData(data.type, data.file),
    onSuccess: (data) => {
      setImportResult(data);
      setSelectedFile(null);
    },
    onError: (error: any) => {
      setImportResult({
        errors: [error?.response?.data?.detail || 'Import failed'],
        created: 0
      });
    },
  });

  // Calculate upload progress (simplified - shows file size)
  const fileSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0';

  const downloadTemplate = async (type: ImportType) => {
    try {
      const response = await fetch(`/api/v1/import/templates/${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_template.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download template');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    importMutation.mutate({ type: selectedType, file: selectedFile });
  };

  const importTypes: { value: ImportType; label: string; description: string }[] = [
    {
      value: 'seasons',
      label: 'Seasons',
      description: 'Import multiple seasons at once'
    },
    {
      value: 'teams',
      label: 'Teams',
      description: 'Import teams for your seasons'
    },
    {
      value: 'expenses',
      label: 'Expenses',
      description: 'Bulk import expense records'
    },
    {
      value: 'revenues',
      label: 'Revenues',
      description: 'Bulk import revenue records'
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bulk Data Import</h1>
          <p className="text-text-secondary">
            Import data from CSV files for private equity roll-ups and multi-organization management
          </p>
        </div>

        {/* Import Type Selection */}
        <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Select Data Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSelectedType(type.value);
                  setSelectedFile(null);
                  setImportResult(null);
                }}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedType === type.value
                    ? 'border-sports-primary bg-sports-primary/10'
                    : 'border-white/10 bg-bg-primary hover:bg-white/5'
                }`}
              >
                <h3 className="font-semibold text-white mb-1">{type.label}</h3>
                <p className="text-sm text-text-secondary">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Template Download */}
        <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">CSV Template</h2>
              <p className="text-sm text-text-secondary">
                Download a template CSV file with the correct column headers
              </p>
            </div>
            <button
              onClick={() => downloadTemplate(selectedType)}
              className="flex items-center space-x-2 px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-bg-secondary rounded-lg p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Upload CSV File</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center space-x-2 px-6 py-3 bg-bg-primary hover:bg-white/5 text-white font-semibold rounded-lg transition-colors border border-white/10"
              >
                <FileText className="w-5 h-5" />
                <span>{selectedFile ? selectedFile.name : 'Select CSV File'}</span>
              </label>
              {selectedFile && (
                <p className="text-sm text-text-secondary mt-2">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="w-full px-6 py-3 bg-sports-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {importMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Importing... ({fileSizeMB} MB)</span>
                </>
              ) : (
                <span>Import Data</span>
              )}
            </button>
          </div>
        </div>

        {/* Import Results */}
        {importResult && (
          <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Import Results</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {importResult.created > 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {importResult.created} records imported successfully
                  </p>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <p className="text-red-400 text-sm">
                      {importResult.errors.length} errors encountered
                    </p>
                  )}
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-red-400 font-semibold">Errors</h3>
                  </div>
                  <ul className="space-y-1 max-h-60 overflow-y-auto">
                    {importResult.errors.map((error: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-300">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {importResult.created > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    ✅ Import completed successfully! Your data has been added to the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-bg-secondary rounded-lg p-6 border border-white/10 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Import Instructions</h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>
              <strong className="text-white">1. Download Template:</strong> Click "Download Template" to get a CSV file with the correct column headers.
            </p>
            <p>
              <strong className="text-white">2. Fill in Data:</strong> Open the template in Excel or Google Sheets and fill in your data. Make sure to follow the format shown in the template.
            </p>
            <p>
              <strong className="text-white">3. Save as CSV:</strong> Save your file as a CSV (Comma Separated Values) format.
            </p>
            <p>
              <strong className="text-white">4. Upload:</strong> Select your CSV file and click "Import Data" to upload.
            </p>
            <p className="text-yellow-400 mt-4">
              <strong>Note:</strong> You can import multiple seasons and teams at once. This makes it easy to set up new seasons quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
