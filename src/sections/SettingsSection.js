import React from 'react';

const SettingsSection = ({
  settings,
  handleSettingsChange,
  saveSettings,
  resetSettings
}) => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Platform Settings</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={resetSettings}>
            Reset Defaults
          </button>
          <button className="btn-primary" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-group">
          <h3>General Settings</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                placeholder="Enter platform name"
              />
            </div>

            <div className="form-group">
              <label>Platform Email</label>
              <input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => handleSettingsChange('platformEmail', e.target.value)}
                placeholder="admin@platform.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange('currency', e.target.value)}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>Review Management</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.autoApproveReviews}
                  onChange={(e) => handleSettingsChange('autoApproveReviews', e.target.checked)}
                />
                <span className="checkmark"></span>
                Auto-approve new reviews
              </label>
              <p className="setting-description">
                Automatically approve all new student reviews (Currently disabled)
              </p>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>Notifications</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notificationEmails}
                  onChange={(e) => handleSettingsChange('notificationEmails', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable email notifications
              </label>
              <p className="setting-description">
                Receive email alerts for new enrollments, payments, and reviews
              </p>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>System Configuration</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                />
                <span className="checkmark"></span>
                Maintenance Mode
              </label>
              <p className="setting-description">
                Temporarily disable platform access for maintenance
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingsChange('maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="500"
                />
              </div>

              <div className="form-group">
                <label>Session Timeout (min)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingsChange('theme', e.target.value)}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-group danger-zone">
          <h3>Danger Zone</h3>
          <div className="danger-actions">
            <button className="btn-danger">
              Delete All Data
            </button>
            <button className="btn-warning">
              Clear Cache
            </button>
            <button className="btn-secondary">
              Export All Data
            </button>
          </div>
          <p className="danger-warning">
            These actions are irreversible. Please proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;