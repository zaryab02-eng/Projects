import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';
import { notify } from "../utils/notify";

/**
 * Diagnostic Page - Check Firebase and environment configuration
 * Access at /diagnostic (development only)
 */
export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    envVars: {},
    firebase: {},
    media: {},
    network: {},
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      envVars: {},
      firebase: {},
      media: {},
      network: {},
    };

    // Check environment variables (without exposing values)
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_FIREBASE_DATABASE_URL',
    ];

    requiredVars.forEach((varName) => {
      const value = import.meta.env[varName];
      results.envVars[varName] = {
        configured: !!value,
        length: value ? value.length : 0,
      };
    });

    // Check Firebase initialization
    try {
      const { database } = await import('../services/firebase.js');
      results.firebase.initialized = !!database;
      results.firebase.error = null;
    } catch (error) {
      results.firebase.initialized = false;
      results.firebase.error = error.message;
    }

    // Check media files
    const mediaFiles = [
      '/videos/background.mp4',
      '/videos/final.mp4',
      '/videos/level1.mp4',
      '/videos/wrong.mp4',
      '/sounds/final.mp3',
      '/sounds/unlock.mp3',
      '/sounds/wrong.mp3',
    ];

    for (const file of mediaFiles) {
      try {
        const response = await fetch(file, { method: 'HEAD' });
        results.media[file] = {
          accessible: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type'),
        };
      } catch (error) {
        results.media[file] = {
          accessible: false,
          error: error.message,
        };
      }
    }

    // Check network connectivity
    results.network.online = navigator.onLine;
    results.network.userAgent = navigator.userAgent;
    results.network.platform = navigator.platform;

    setDiagnostics(results);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      notify.success("Copied to clipboard.");
    });
  };

  const generateReport = () => {
    let report = '=== DIAGNOSTIC REPORT ===\n\n';
    
    report += '--- Environment Variables ---\n';
    Object.entries(diagnostics.envVars).forEach(([key, value]) => {
      report += `${key}: ${value.configured ? `✓ (${value.length} chars)` : '✗ MISSING'}\n`;
    });

    report += '\n--- Firebase ---\n';
    report += `Initialized: ${diagnostics.firebase.initialized ? '✓' : '✗'}\n`;
    if (diagnostics.firebase.error) {
      report += `Error: ${diagnostics.firebase.error}\n`;
    }

    report += '\n--- Media Files ---\n';
    Object.entries(diagnostics.media).forEach(([file, status]) => {
      report += `${file}: ${status.accessible ? '✓' : '✗'} (${status.status || status.error})\n`;
    });

    report += '\n--- Network ---\n';
    report += `Online: ${diagnostics.network.online ? 'Yes' : 'No'}\n`;
    report += `User Agent: ${diagnostics.network.userAgent}\n`;
    report += `Platform: ${diagnostics.network.platform}\n`;

    return report;
  };

  const allEnvVarsConfigured = Object.values(diagnostics.envVars).every(v => v.configured);
  const allMediaAccessible = Object.values(diagnostics.media).every(v => v.accessible);

  return (
    <div className="viewport-container cyber-grid overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-cyber-accent glow-text mb-2">
            DIAGNOSTICS
          </h1>
          <p className="text-white text-opacity-70">
            System configuration and connectivity check
          </p>
        </div>

        {/* Environment Variables */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {allEnvVarsConfigured ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              Environment Variables
            </h2>
          </div>

          <div className="space-y-2">
            {Object.entries(diagnostics.envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-cyber-surface p-3 rounded">
                <span className="font-mono text-sm text-white">{key}</span>
                <div className="flex items-center gap-2">
                  {value.configured ? (
                    <>
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-green-500 text-sm">
                        {value.length} chars
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500" size={16} />
                      <span className="text-red-500 text-sm">MISSING</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!allEnvVarsConfigured && (
            <div className="mt-4 bg-cyber-danger bg-opacity-20 p-3 rounded border border-cyber-danger">
              <p className="text-cyber-danger font-bold text-sm">
                ⚠️ Missing environment variables! Check your .env file.
              </p>
              <p className="text-white text-opacity-70 text-sm mt-1">
                See CHECK_FIREBASE_CONFIG.md for instructions.
              </p>
            </div>
          )}
        </div>

        {/* Firebase */}
        <div className="card mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            {diagnostics.firebase.initialized ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-red-500" size={24} />
            )}
            Firebase Connection
          </h2>

          <div className="bg-cyber-surface p-3 rounded">
            {diagnostics.firebase.initialized ? (
              <p className="text-green-500">✓ Firebase initialized successfully</p>
            ) : (
              <div>
                <p className="text-red-500 mb-2">✗ Firebase initialization failed</p>
                {diagnostics.firebase.error && (
                  <p className="text-white text-opacity-70 text-sm font-mono">
                    Error: {diagnostics.firebase.error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Media Files */}
        <div className="card mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            {allMediaAccessible ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <AlertCircle className="text-yellow-500" size={24} />
            )}
            Media Files
          </h2>

          <div className="space-y-2">
            {Object.entries(diagnostics.media).map(([file, status]) => (
              <div key={file} className="flex items-center justify-between bg-cyber-surface p-2 rounded">
                <span className="font-mono text-xs text-white">{file}</span>
                <div className="flex items-center gap-2">
                  {status.accessible ? (
                    <>
                      <CheckCircle className="text-green-500" size={14} />
                      <span className="text-green-500 text-xs">
                        {status.contentType}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500" size={14} />
                      <span className="text-red-500 text-xs">
                        {status.status || 'Failed'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network */}
        <div className="card mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            {diagnostics.network.online ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-red-500" size={24} />
            )}
            Network
          </h2>

          <div className="space-y-2">
            <div className="bg-cyber-surface p-3 rounded">
              <p className="text-white text-sm">
                <strong>Status:</strong>{' '}
                {diagnostics.network.online ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  <span className="text-red-500">Offline</span>
                )}
              </p>
            </div>
            <div className="bg-cyber-surface p-3 rounded">
              <p className="text-white text-sm break-words">
                <strong>User Agent:</strong> {diagnostics.network.userAgent}
              </p>
            </div>
            <div className="bg-cyber-surface p-3 rounded">
              <p className="text-white text-sm">
                <strong>Platform:</strong> {diagnostics.network.platform}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={runDiagnostics}
            className="btn-primary"
          >
            Rerun Diagnostics
          </button>
          <button
            onClick={() => copyToClipboard(generateReport())}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Copy size={20} />
            Copy Report
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
