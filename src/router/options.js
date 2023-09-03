import React from 'react';
import PlanForm from '../pages/planForm';
import PlanList from '../pages/planList';
import UserList from '../pages/userList';
import Login from '../pages/login';

export default [
  {
    path: '/planForm',
    element: <PlanForm />,
  },
  {
    path: '/planList',
    element: <PlanList />,
  },
  {
    path: '/userList',
    element: <UserList />
  },
  {
    path: '/login',
    element: <Login />
  }
];
