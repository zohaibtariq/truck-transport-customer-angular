import { Routes } from '@angular/router';
// import {UserManagementModule} from "../alliance/user-management/user-management.module";
// import {ConfigurationsModule} from "../alliance/configurations/configurations.module";

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
  {
    path: 'types',
    loadChildren: () =>
      import('../alliance/types.module').then(
        (m) => m.TypesModule
      ),
  },
  {
    path: 'loads',
    loadChildren: () =>
      import('../alliance/loads/loads.module').then(
        (m) => m.LoadsModule
      ),
  },
  {
    path: 'drivers',
    loadChildren: () =>
      import('../alliance/drivers.module').then(
        (m) => m.DriversModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../alliance/user-management/user-management.module').then(
        (m) => m.UserManagementModule
      ),
  },
  {
    path: 'configs',
    loadChildren: () =>
      import('../alliance/configurations/configurations.module').then(
        (m) => m.ConfigurationsModule
      ),
  },
  // {
  //   path: 'apps/chat',
  //   loadChildren: () =>
  //     import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  // },
  {
    path: '',
    // redirectTo: '/dashboard',
    redirectTo: '/types/customers',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
