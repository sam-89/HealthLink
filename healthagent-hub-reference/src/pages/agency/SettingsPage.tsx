import { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Users,
  Save,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { toast } from '@/hooks/use-toast';

export function SettingsPage() {
  const [agencyInfo, setAgencyInfo] = useState({
    name: 'MetroHealth Agency',
    email: 'contact@metrohealth.com',
    phone: '(555) 123-4567',
    address: '123 Healthcare Blvd, Suite 400',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    npn: '98765432',
    taxId: '**-***1234',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    licenseExpiry: true,
    complianceUpdates: true,
    weeklyDigest: false,
    newAgentAlerts: true,
    documentUploads: true,
  });

  const [teamMembers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@metrohealth.com', role: 'Administrator' },
    { id: '2', name: 'Jane Manager', email: 'jane@metrohealth.com', role: 'Manager' },
    { id: '3', name: 'Bob Coordinator', email: 'bob@metrohealth.com', role: 'Coordinator' },
  ]);

  const handleSaveAgencyInfo = () => {
    toast({ title: 'Settings saved', description: 'Agency information has been updated.' });
  };

  const handleSaveNotifications = () => {
    toast({ title: 'Preferences saved', description: 'Notification settings have been updated.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your agency settings and preferences</p>
      </div>

      <Tabs defaultValue="agency" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agency" className="gap-2">
            <Building2 className="w-4 h-4" />
            Agency Info
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Agency Information Tab */}
        <TabsContent value="agency">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
              <CardDescription>Update your agency's public profile and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Agency Name</Label>
                  <Input
                    value={agencyInfo.name}
                    onChange={(e) => setAgencyInfo({ ...agencyInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Agency NPN</Label>
                  <Input
                    value={agencyInfo.npn}
                    onChange={(e) => setAgencyInfo({ ...agencyInfo, npn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={agencyInfo.email}
                      onChange={(e) => setAgencyInfo({ ...agencyInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={agencyInfo.phone}
                      onChange={(e) => setAgencyInfo({ ...agencyInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  placeholder="Street address"
                  value={agencyInfo.address}
                  onChange={(e) => setAgencyInfo({ ...agencyInfo, address: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={agencyInfo.city}
                    onChange={(e) => setAgencyInfo({ ...agencyInfo, city: e.target.value })}
                  />
                  <Input
                    placeholder="State"
                    value={agencyInfo.state}
                    onChange={(e) => setAgencyInfo({ ...agencyInfo, state: e.target.value })}
                  />
                  <Input
                    placeholder="ZIP"
                    value={agencyInfo.zip}
                    onChange={(e) => setAgencyInfo({ ...agencyInfo, zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAgencyInfo} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important updates via email' },
                  { key: 'licenseExpiry', label: 'License Expiry Warnings', description: 'Get notified 30 days before agent licenses expire' },
                  { key: 'complianceUpdates', label: 'Compliance Updates', description: 'Alerts when compliance status changes' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of agency activity' },
                  { key: 'newAgentAlerts', label: 'New Agent Onboarding', description: 'Notifications when agents complete onboarding steps' },
                  { key: 'documentUploads', label: 'Document Uploads', description: 'Alerts when new documents are uploaded for review' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage who has access to the agency portal</CardDescription>
              </div>
              <Button className="gap-2">
                <Users className="w-4 h-4" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm px-2 py-1 rounded bg-muted">{member.role}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                    </div>
                    <select className="px-3 py-2 rounded-md border bg-background">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Requirements</p>
                      <p className="text-sm text-muted-foreground">Enforce strong password policy for all team members</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login History</p>
                      <p className="text-sm text-muted-foreground">View recent login activity</p>
                    </div>
                    <Button variant="outline">View Logs</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
