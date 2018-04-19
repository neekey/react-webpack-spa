import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import Main from './main';
import routes from './routes';

const history = useRouterHistory(createHistory)({
  basename: `${document.location.protocol}//${document.location.host}`,
});

const rootRoute = {
  path: '/',
  component: Main,
  indexRoute: {
    onEnter: (nextState, replace) => replace('/home'),
  },
  childRoutes: [
    ...routes,
    {
      path: '*',
      onEnter: (nextState, replace) => replace('/home'),
    },
  ],
};

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render((<Router history={history} routes={rootRoute} />), document.getElementById('main'));
