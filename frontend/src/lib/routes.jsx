import App from '../App.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      /**
       * Future routes can be added here easily:
       * { path: 'content/:id', element: <Workspace /> },
       * { path: 'calendar', element: <Calendar /> },
       */
    ],
  },
];

export default routes;
