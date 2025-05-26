import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { StorageService } from '../../../services/storage';
import { ThemeSettings } from '../../../types';
import { useAppState } from '../../../contexts/AppStateContext'; // Import useAppState
import { applyThemeColors } from '../../../utils/themeUtils'; // Import theme utility
import { saveAs } from 'file-saver';


// Default theme colors (consider extracting from CSS or defining centrally)
const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#0078d4',
  textColor: '#323130',
  backgroundColor: '#f5f5f5',
};

interface AgentSettings {
  agentName: string; // Corresponds to agentFirstName + agentLastName
  agentTitle: string;
  companyName: string;
  agentEmail: string;
  onCallRecipients: string; // Comma-separated emails
  vacationRecipients: string; // Comma-separated emails
  supportRecipients: string; // Comma-separated emails
}

const SettingsPage: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [agentTitle, setAgentTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [onCallRecipients, setOnCallRecipients] = useState('');
  const [vacationRecipients, setVacationRecipients] = useState('');
  const [supportRecipients, setSupportRecipients] = useState('');
  // Theme color states
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_THEME.primaryColor);
  const [textColor, setTextColor] = useState(DEFAULT_THEME.textColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_THEME.backgroundColor);
  // State for PDF attachment
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  // State for storage usage
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [storageUsagePercentage, setStorageUsagePercentage] = useState<number>(0);
  // Remove local state for toggle, use context instead
  // const [showAlphaBeta, setShowAlphaBeta] = useState(false);

  // Get state and update function from context
  const { state: appState, updateShowAlphaBetaFeatures, updateCrmData } = useAppState();

  const [isLoading, setIsLoading] = useState(true); // Keep local loading state for settings page
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    const data = appState.crmData;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'customer-data.json');
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const data = JSON.parse(json);
          updateCrmData(data);
          console.log('Imported data:', data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to format bytes into human-readable format
  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Load settings on component mount and fetch storage usage
  useEffect(() => {
    setIsLoading(true);

    const fetchStorageUsage = () => {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.getBytesInUse((bytesInUse) => {
          const maxStorage = 5 * 1024 * 1024; // 5MB
          const percentage = (bytesInUse / maxStorage) * 100;
          setStorageUsage(bytesInUse);
          setStorageUsagePercentage(percentage);
        });
      } else {
        setStorageUsage(0);
        setStorageUsagePercentage(0);
      }
    };

    fetchStorageUsage();

    Promise.all([
      StorageService.get<AgentSettings>('agentSettings'),
      StorageService.get<ThemeSettings>('themeSettings'),
      // Load PDF settings
      StorageService.get<string>('pdfAttachmentFilename'),
      StorageService.get<string>('pdfAttachmentBase64'),
      // No need to load showAlphaBetaFeatures here, context handles it
    ])
      .then(([agentSettings, themeSettings, loadedPdfFilename, loadedPdfBase64]) => {
        // Load Agent Settings
        if (agentSettings) {
          setAgentName(agentSettings.agentName || '');
          setAgentTitle(agentSettings.agentTitle || '');
          setCompanyName(agentSettings.companyName || '');
          setAgentEmail(agentSettings.agentEmail || '');
          setOnCallRecipients(agentSettings.onCallRecipients || '');
          setVacationRecipients(agentSettings.vacationRecipients || '');
          setSupportRecipients(agentSettings.supportRecipients || '');
        }

        // Load Theme Settings
        if (themeSettings) {
          setPrimaryColor(themeSettings.primaryColor || DEFAULT_THEME.primaryColor);
          setTextColor(themeSettings.textColor || DEFAULT_THEME.textColor);
          setBackgroundColor(themeSettings.backgroundColor || DEFAULT_THEME.backgroundColor);
        } else {
          // Fallback to defaults if no theme settings saved
          setPrimaryColor(DEFAULT_THEME.primaryColor);
          setTextColor(DEFAULT_THEME.textColor);
          // Correctly use default background color in the else block
          setBackgroundColor(DEFAULT_THEME.backgroundColor);
        }
        // Removed the redundant second 'else' block

        // Load PDF settings only
        // setCustomEmailTemplate(loadedTemplate || ''); // Removed template state update
        setPdfFilename(loadedPdfFilename || null);
        setPdfBase64(loadedPdfBase64 || null);

        // Context handles loading showAlphaBetaFeatures
      })
      .catch(error => {
        console.error("Error loading settings:", error);
        // Optionally set an error state to show in the UI
        // Still set default theme colors on error
        setPrimaryColor(DEFAULT_THEME.primaryColor);
        setTextColor(DEFAULT_THEME.textColor);
        setBackgroundColor(DEFAULT_THEME.backgroundColor);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Save settings handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    const agentSettingsToSave: AgentSettings = {
      agentName,
      agentTitle,
      companyName,
      agentEmail,
      onCallRecipients,
      vacationRecipients,
      supportRecipients,
    };

    const themeSettingsToSave: ThemeSettings = {
      primaryColor,
      textColor,
      backgroundColor,
    };

    try {
      // Save agent and theme settings
      // Toggle state is saved immediately via context function, remove from here
      await Promise.all([
        StorageService.set('agentSettings', agentSettingsToSave),
        StorageService.set('themeSettings', themeSettingsToSave),
        // StorageService.set('showAlphaBetaFeatures', showAlphaBeta), // Removed
      ]);

      // Save PDF settings separately
      await StorageService.set('pdfAttachmentFilename', pdfFilename || '');
      // Only save base64 if filename exists to avoid storing large empty strings unnecessarily
      await StorageService.set('pdfAttachmentBase64', pdfFilename ? (pdfBase64 || '') : '');

      // Apply theme immediately after saving
      applyThemeColors(themeSettingsToSave);

      setSaveStatus('success');
      // Hide success message after a delay
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [
    agentName,
    agentTitle,
    companyName,
    agentEmail,
    onCallRecipients,
    vacationRecipients,
    supportRecipients,
    // Add theme colors to dependency array
    primaryColor,
    textColor,
    backgroundColor,
    pdfFilename,
    pdfBase64,
    // showAlphaBeta, // Removed toggle state from dependencies
  ]);

  // --- PDF File Handling ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = loadEvent.target?.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        if (base64Content) {
          setPdfFilename(file.name);
          setPdfBase64(base64Content);
          setSaveStatus('idle'); // Reset save status if file changes
        } else {
          console.error("Error reading PDF file content.");
          setPdfFilename(null);
          setPdfBase64(null);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setPdfFilename(null);
        setPdfBase64(null);
      };
      reader.readAsDataURL(file); // Read as Data URL to get Base64
    } else if (file) {
      alert('Please select a valid PDF file.');
      event.target.value = ''; // Clear the input
      setPdfFilename(null);
      setPdfBase64(null);
    } else {
        // No file selected or selection cancelled
        // Optionally clear state if needed, or leave as is
    }
  };

  const handleClearPdf = () => {
    setPdfFilename(null);
    setPdfBase64(null);
    // Optionally clear the file input visually, though this is tricky
    const fileInput = document.getElementById('pdfAttachment') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
    setSaveStatus('idle'); // Reset save status
  };
  // --- End PDF File Handling ---


  if (isLoading) {
  return <div className="py-10 text-center text-gray-600">Loading settings...</div>;
  }

  return (
    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg my-5">
      <h2 className="mt-0 mb-2 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-800 pb-2">Agent Configuration</h2>
      <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Configure the details used in the email signature.</p>

      <div className="settings-form">
        <div className="mb-4">
          <label htmlFor="agentName" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Agent Name:</label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g., Jane Doe"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="agentTitle" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Agent Title:</label>
          <input
            type="text"
            id="agentTitle"
            value={agentTitle}
            onChange={(e) => setAgentTitle(e.target.value)}
            placeholder="e.g., Support Engineer"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="companyName" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Microsoft"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="agentEmail" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Agent Email:</label>
          <input
            type="email"
            id="agentEmail"
            value={agentEmail}
            onChange={(e) => setAgentEmail(e.target.value)}
            placeholder="e.g., jane.doe@microsoft.com"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* --- Recipient Settings --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">ICS Recipient Emails</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Configure the default recipients for generated .ics files (comma-separated).</p>

        <div className="mb-4">
          <label htmlFor="onCallRecipients" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">On-Call Duty Recipients:</label>
          <textarea
            id="onCallRecipients"
            value={onCallRecipients}
            onChange={(e) => setOnCallRecipients(e.target.value)}
            placeholder="e.g., team1@example.com, manager@example.com"
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vacationRecipients" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Vacation Request Recipients:</label>
          <textarea
            id="vacationRecipients"
            value={vacationRecipients}
            onChange={(e) => setVacationRecipients(e.target.value)}
            placeholder="e.g., hr@example.com, team-calendar@example.com"
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="supportRecipients" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Support Request Recipients:</label>
          <textarea
            id="supportRecipients"
            value={supportRecipients}
            onChange={(e) => setSupportRecipients(e.target.value)}
            placeholder="e.g., support-leads@example.com"
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* --- Theme Customization --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Theme Customization</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Customize the main colors of the extension.</p>

        <div className="mb-4">
          <label htmlFor="primaryColor" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Primary Color:</label>
          <input
            type="color"
            id="primaryColor"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
          <span className="ml-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{primaryColor}</span>
        </div>

        <div className="mb-4">
          <label htmlFor="textColor" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Text Color:</label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
          <span className="ml-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{textColor}</span>
        </div>

        <div className="mb-4">
          <label htmlFor="backgroundColor" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Background Color:</label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <span className="ml-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{backgroundColor}</span>
        </div>

        {/* --- Default PDF Attachment --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Default PDF Attachment</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Add a default PDF attachment to the generated email drafts.</p>

        <div className="mb-4">
            <label htmlFor="pdfAttachment" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">PDF File:</label>
            <input
                type="file"
                id="pdfAttachment"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'block', marginBottom: '10px' }}
                className="text-gray-700 dark:text-gray-300" // Added text color for dark mode
            />
            {pdfFilename && (
                <div className="pdf-info text-gray-700 dark:text-gray-300"> {/* Added text color */}
                    <span>Current file: {pdfFilename}</span>
                    <button onClick={handleClearPdf} className="clear-pdf-button ml-2 text-red-600 dark:text-red-400 hover:underline"> {/* Added styling */}
                        Clear PDF
                    </button>
                </div>
            )}
            {!pdfFilename && <span className="text-gray-700 dark:text-gray-300">No PDF attached.</span>} {/* Added text color */}
        </div>

        {/* --- Storage Usage --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Storage Usage</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">View the current storage usage of the extension.</p>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${storageUsagePercentage}%` }}></div>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            Storage Usage: {formatBytes(storageUsage)} ({storageUsagePercentage.toFixed(2)}%)
          </span>
        </div>

        {/* --- Experimental Features Toggle --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Experimental Features</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Enable access to Alpha/Beta features currently under development.</p>
        <div className="mb-4">
          <label htmlFor="alphaBetaToggle" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">
            Show Alpha/Beta Features:
          </label>
          <label className="switch">
            <input
              type="checkbox"
              id="alphaBetaToggle"
              checked={appState.showAlphaBetaFeatures} // Read from context state
              onChange={(e) => updateShowAlphaBetaFeatures(e.target.checked)} // Call context update function
            />
            <span className="slider round"></span>
          </label>
          <span className="ml-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{appState.showAlphaBetaFeatures ? 'Enabled' : 'Disabled'}</span>
        </div>

        {/* --- Data Export/Import --- */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Data Export/Import</h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400 text-sm">Export or import your customer and contact data.</p>

        <div className="mb-4">
          <button onClick={handleExport} className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-md min-w-[120px] hover:bg-green-700 dark:hover:bg-green-500">
            Export Data
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="importData" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">Import Data:</label>
          <input
            type="file"
            id="importData"
            accept=".json"
            onChange={handleImport}
            className="text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="mt-6 flex items-center">
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md min-w-[120px] hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
          {saveStatus === 'success' && <span className="ml-4 text-sm font-semibold text-green-700 dark:text-green-400">Settings saved!</span>}
          {saveStatus === 'error' && <span className="ml-4 text-sm font-semibold text-red-700 dark:text-red-400">Error saving settings.</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
