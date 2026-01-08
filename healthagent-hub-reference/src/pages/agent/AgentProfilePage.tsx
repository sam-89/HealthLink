import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Building2, Save, Edit2, Key, Bell, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface License {
  id: string;
  state: string;
  number: string;
  expirationDate: string;
  linesOfAuthority: string[];
  status: 'active' | 'expired' | 'pending';
}

const MOCK_LICENSES: License[] = [
  { id: '1', state: 'California', number: 'CA-2024-123456', expirationDate: '2025-12-15', linesOfAuthority: ['Health', 'Life'], status: 'active' },
  { id: '2', state: 'Texas', number: 'TX-2024-789012', expirationDate: '2024-12-31', linesOfAuthority: ['Health'], status: 'expired' },
  { id: '3', state: 'Florida', number: 'FL-2024-345678', expirationDate: '2025-06-20', linesOfAuthority: ['Health', 'Life', 'Variable'], status: 'active' },
];

const STATES = ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'New York', 'Texas'];

export function AgentProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);

  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: user?.email || 'sarah@healthlink.com',
    phone: '(555) 123-4567',
    npn: '12345678',
    dateOfBirth: '1985-03-15',
    address: {
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'California',
      zip: '90001',
    },
    agency: 'MetroHealth Agency',
    startDate: '2024-01-15',
  });

  const [notifications, setNotifications] = useState({
    emailExpiring: true,
    emailApprovals: true,
    emailCompliance: false,
    smsExpiring: true,
    smsUrgent: true,
  });

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile changes have been saved.',
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: 'Password Reset Email Sent',
      description: 'Check your email for password reset instructions.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-muted-foreground">Insurance Agent</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <StatusBadge variant="complete">Active</StatusBadge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {profile.agency}
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-muted-foreground">NPN</p>
              <p className="font-mono font-bold text-lg">{profile.npn}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your contact and identification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="mt-1.5" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>NPN (National Producer Number)</Label>
                  <Input value={profile.npn} disabled className="mt-1.5" />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Street Address</Label>
                    <Input
                      value={profile.address.street}
                      onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
                      disabled={!isEditing}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={profile.address.city}
                      onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                      disabled={!isEditing}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select
                      value={profile.address.state}
                      onValueChange={(val) => setProfile({ ...profile, address: { ...profile.address, state: val } })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      value={profile.address.zip}
                      onChange={(e) => setProfile({ ...profile, address: { ...profile.address, zip: e.target.value } })}
                      disabled={!isEditing}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>State Licenses</CardTitle>
                <CardDescription>Your active insurance licenses and lines of authority</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Add License
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map(license => (
                  <div key={license.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{license.state}</h4>
                          <p className="text-sm font-mono text-muted-foreground">{license.number}</p>
                        </div>
                      </div>
                      <StatusBadge variant={license.status === 'active' ? 'complete' : license.status === 'expired' ? 'rejected' : 'pending'}>
                        {license.status}
                      </StatusBadge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Expires: {license.expirationDate}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {license.linesOfAuthority.map(loa => (
                          <span key={loa} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                            {loa}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4" /> Email Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">License Expiration Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified 30, 14, and 7 days before expiration</p>
                    </div>
                    <Switch
                      checked={notifications.emailExpiring}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailExpiring: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Document Approvals</p>
                      <p className="text-sm text-muted-foreground">When your documents are approved or rejected</p>
                    </div>
                    <Switch
                      checked={notifications.emailApprovals}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailApprovals: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compliance Updates</p>
                      <p className="text-sm text-muted-foreground">Weekly compliance status summaries</p>
                    </div>
                    <Switch
                      checked={notifications.emailCompliance}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailCompliance: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Phone className="w-4 h-4" /> SMS Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Urgent Expiration Alerts</p>
                      <p className="text-sm text-muted-foreground">Text alerts 3 days before license expires</p>
                    </div>
                    <Switch
                      checked={notifications.smsExpiring}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsExpiring: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Urgent Action Required</p>
                      <p className="text-sm text-muted-foreground">Critical compliance issues that need immediate attention</p>
                    </div>
                    <Switch
                      checked={notifications.smsUrgent}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsUrgent: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => toast({ title: 'Preferences Saved', description: 'Your notification settings have been updated.' })}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Key className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handlePasswordChange}>
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}