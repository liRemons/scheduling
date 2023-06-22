import React from 'react';
import PlanForm from '../pages/planForm';
import PlanList from '../pages/planList';

export default [
  {
    path: '/planForm',
    element: <PlanForm />,
  },
  {
    path: '/planList',
    element: <PlanList />,
  },
];
