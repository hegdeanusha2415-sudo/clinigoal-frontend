import React from 'react';

export const SettingsSection = () => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Platform Settings</h2>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>Platform Name</label>
            <input type="text" defaultValue="Clinigoal" className="setting-input" />
          </div>
          <div className="setting-item">
            <label>Admin Email</label>
            <input type="email" defaultValue="admin@clinigoal.com" className="setting-input" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>

        <div className="settings-card">
          <h3>Payment Settings</h3>
          <div className="setting-item">
            <label>Default Currency</label>
            <select className="setting-input">
              <option>INR - Indian Rupee</option>
            </select>
          </div>
          <button className="btn-primary">Update Payment Settings</button>
        </div>

        <div className="settings-card">
          <h3>Content Settings</h3>
          <div className="setting-item">
            <label>Max Video Size (MB)</label>
            <input type="number" defaultValue="500" className="setting-input" />
          </div>
          <div className="setting-item">
            <label>Max Document Size (MB)</label>
            <input type="number" defaultValue="50" className="setting-input" />
          </div>
          <button className="btn-primary">Update Content Settings</button>
        </div>

        <div className="settings-card">
          <h3>Notification Settings</h3>
          <div className="setting-item checkbox">
            <input type="checkbox" id="email-notifications" defaultChecked />
            <label htmlFor="email-notifications">Email Notifications</label>
          </div>
          <div className="setting-item checkbox">
            <input type="checkbox" id="payment-alerts" defaultChecked />
            <labeal htmlFor="payment-alerts">Payment Alerts</label>
          </div>
          <button className="btn-primary">Save Preferences</button>
        </div>
      </div>
    </div>
  );
};