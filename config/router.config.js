export default [
  // user
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [

      { path: '/', redirect: '/login' },
      { path: '/login', name: 'login', component: './User/Login' },
      {
        component: '../layouts/BasicLayout',
        routes: [
          // dashboard
          { path: '/user-organization', redirect: '/user-organization/organization' },
          // 用户组织管理
          {
            path: '/user-organization',
            icon: 'form',
            name: '用户组织管理',
            routes: [
              {
                path: '/user-organization/organization',
                name: '组织',
                component: './UserOrganization/Organization',
              },
              {
                path: '/user-organization/user',
                name: '用户',
                component: './UserOrganization/User',
              }
            ],
          },
          // 角色权限管理
          {
            path: '/role-permission',
            icon: 'table',
            name: '角色权限管理',
            routes: [
              {
                path: '/role-permission/resource',
                name: "应用资源",
                component: './RolePermission/Resource'
              },
              {
                path: '/role-permission/menu',
                name: '导航菜单',
                component: './RolePermission/RoleMenu',
              },
              {
                path: '/role-permission/role',
                name: '角色',
                component: './RolePermission/Role',
              }
            ],
          },
          // 安全管理
          {
            name: '安全管理',
            icon: 'safety-certificate',
            path: '/security-management',
            routes: [
              {
                path: '/security-management/network-security',
                name: '网络安全',
                component: './SecurityPolicy/NetworkSecurity/NetworkSecurity',
              },
              {
                path: '/security-management/account-security',
                name: '账户安全',
                component: './SecurityPolicy/AccountSecurity/AccountSecurity',
              },
            ],
          },
          // 日志管理
          {
            name: '日志管理',
            icon: 'profile',
            path: '/log-management',
            routes: [
              // exception
              {
                path: '/log-management/login-log',
                name: '登录日志',
                component: './LogManagement/LoginLog',
              },
              {
                path: '/log-management/anomaly-log',
                name: '异常日志',
                component: './LogManagement/AnomalyLog',
              },
              {
                path: '/log-management/handle-log',
                name: '操作日志',
                component: './LogManagement/HandleLog',
              },
            ],
          },
          {
            component: '404',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },

];
