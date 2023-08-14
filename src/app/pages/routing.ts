import { Routes } from '@angular/router';
// import {UserManagementModule} from "../trucktransport/user-management/user-management.module";
// import {ConfigurationsModule} from "../trucktransport/configurations/configurations.module";

const Routing: Routes = [
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  // },
  // {
  //   path: 'builder',
  //   loadChildren: () =>
  //     import('./builder/builder.module').then((m) => m.BuilderModule),
  // },
  // {
  //   path: 'crafted/pages/profile',
  //   loadChildren: () =>
  //     import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  // },
  // {
  //   path: 'crafted/account',
  //   loadChildren: () =>
  //     import('../modules/account/account.module').then((m) => m.AccountModule),
  // },
  // {
  //   path: 'crafted/pages/wizards',
  //   loadChildren: () =>
  //     import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  // },
  // {
  //   path: 'crafted/widgets',
  //   loadChildren: () =>
  //     import('../modules/widgets-examples/widgets-examples.module').then(
  //       (m) => m.WidgetsExamplesModule
  //     ),
  // },
  // {
  //   path: 'types',
  //   loadChildren: () =>
  //     import('../trucktransport/types.module').then(
  //       (m) => m.TypesModule
  //     ),
  // },
  {
    path: 'loads',
    loadChildren: () =>
      import('../trucktransport/loads/loads.module').then(
        (m) => m.LoadsModule
      ),
  },
  // {
  //   path: 'drivers',
  //   loadChildren: () =>
  //     import('../trucktransport/drivers.module').then(
  //       (m) => m.DriversModule
  //     ),
  // },
  // {
  //   path: 'users',
  //   loadChildren: () =>
  //     import('../trucktransport/user-management/user-management.module').then(
  //       (m) => m.UserManagementModule
  //     ),
  // },
  // {
  //   path: 'configs',
  //   loadChildren: () =>
  //     import('../trucktransport/configurations/configurations.module').then(
  //       (m) => m.ConfigurationsModule
  //     ),
  // },
  // {
  //   path: 'apps/chat',
  //   loadChildren: () =>
  //     import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  // },
  {
    path: '',
    // redirectTo: '/dashboard',
    redirectTo: '/loads/all',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
