'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Eye, EyeSlash, Shield, Key } from '@phosphor-icons/react';

export const Security = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordSubmit = () => {
    // Handle password change logic
    console.log('Password change submitted:', passwordForm);
  };

  return (
    <div className="bg-content1 rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-2 text-foreground">
        Security
      </h1>
      <p className="text-default-600 mb-8">
        Keep your account secure with these security settings.
      </p>

      <div className="space-y-6">
        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key size={20} className="text-default-600" />
              <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current password
                </label>
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  classNames={{
                    input: "!text-foreground",
                    inputWrapper: "border-default-300"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New password
                </label>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  classNames={{
                    input: "!text-foreground",
                    inputWrapper: "border-default-300"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm new password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  classNames={{
                    input: "!text-foreground",
                    inputWrapper: "border-default-300"
                  }}
                />
              </div>

              <Button color="primary" onPress={handlePasswordSubmit}>
                Update Password
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-default-600" />
              <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">SMS Authentication</p>
                  <p className="text-default-600 text-sm">Receive codes via text message</p>
                </div>
                <Button variant="bordered" size="sm" color="success">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Authenticator App</p>
                  <p className="text-default-600 text-sm">Use an authenticator app like Google Authenticator</p>
                </div>
                <Button variant="bordered" size="sm" color="success">
                  Setup
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Backup Codes</p>
                  <p className="text-default-600 text-sm">Generate backup codes for recovery</p>
                </div>
                <Button variant="bordered" size="sm">
                  Generate
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Login Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Recent Login Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Current session</p>
                  <p className="text-default-600 text-sm">Chrome on Windows • New York, NY</p>
                  <p className="text-default-600 text-xs">2 hours ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-success text-xs">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-default-200 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Previous session</p>
                  <p className="text-default-600 text-sm">Safari on iPhone • New York, NY</p>
                  <p className="text-default-600 text-xs">1 day ago</p>
                </div>
                <Button variant="light" size="sm" color="danger">
                  Revoke
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-default-200 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Desktop session</p>
                  <p className="text-default-600 text-sm">Firefox on Windows • New York, NY</p>
                  <p className="text-default-600 text-xs">3 days ago</p>
                </div>
                <Button variant="light" size="sm" color="danger">
                  Revoke
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-default-200">
              <Button variant="bordered" color="danger" size="sm">
                Sign out of all devices
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Account Recovery */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Account Recovery</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Recovery email</p>
                  <p className="text-default-600 text-sm">backup@example.com</p>
                </div>
                <Button variant="light" size="sm">
                  Update
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Recovery phone</p>
                  <p className="text-default-600 text-sm">+1 (555) ***-1234</p>
                </div>
                <Button variant="light" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};