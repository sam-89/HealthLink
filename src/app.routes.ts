
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AgentWizardComponent } from './pages/agent-wizard.component';
import { AgentDashboardComponent } from './pages/agent-dashboard.component';
import { DocumentCenterComponent } from './pages/document-center.component';
import { AgentDocumentsComponent } from './pages/agent-documents.component';
import { AgentProfileComponent } from './pages/agent-profile.component';
import { AgencyDashboardComponent } from './pages/agency-dashboard.component';
import { AgencyAgentsComponent } from './pages/agency-agents.component';
import { AgencyComplianceComponent } from './pages/agency-compliance.component';
import { AgencySettingsComponent } from './pages/agency-settings.component';
import { OpsDashboardComponent } from './pages/ops-dashboard.component';
import { OpsVerificationComponent, OpsAgenciesComponent, OpsAgentsComponent } from './pages/ops-features.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: LoginComponent
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'agent-dashboard',
        component: AgentDashboardComponent,
        title: 'Dashboard | HealthLink'
      },
      {
        path: 'agent-onboarding',
        component: AgentWizardComponent,
        title: 'Agent Onboarding | HealthLink'
      },
      {
        path: 'agent-documents',
        component: AgentDocumentsComponent,
        title: 'My Documents | HealthLink'
      },
      {
        path: 'agent-profile',
        component: AgentProfileComponent,
        title: 'Profile | HealthLink'
      },
      // Agency Routes
      {
        path: 'agency-dashboard',
        component: AgencyDashboardComponent,
        title: 'Agency Dashboard | HealthLink'
      },
      {
        path: 'agency-agents',
        component: AgencyAgentsComponent,
        title: 'Agents | HealthLink'
      },
      {
        path: 'agency-documents',
        component: DocumentCenterComponent,
        title: 'Document Center | HealthLink'
      },
      {
        path: 'agency-compliance',
        component: AgencyComplianceComponent,
        title: 'Compliance | HealthLink'
      },
      {
        path: 'agency-settings',
        component: AgencySettingsComponent,
        title: 'Settings | HealthLink'
      },
      // Ops Routes
      {
        path: 'ops-dashboard',
        component: OpsDashboardComponent,
        title: 'Ops Dashboard | HealthLink'
      },
      {
        path: 'ops-verification',
        component: OpsVerificationComponent,
        title: 'Verification Queue | HealthLink'
      },
      {
        path: 'ops-documents',
        component: DocumentCenterComponent,
        title: 'Document Review | HealthLink'
      },
      {
        path: 'ops-agencies',
        component: OpsAgenciesComponent,
        title: 'Agencies | HealthLink'
      },
      {
        path: 'ops-agents',
        component: OpsAgentsComponent,
        title: 'All Agents | HealthLink'
      }
    ]
  }
];
        