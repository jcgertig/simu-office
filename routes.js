/** @flow */
import React from 'react';
import Router from 'react-router';

const {
  DefaultRoute,
  Route,
  NotFoundRoute,
} = Router;

import App from './handlers/Base';
import Home from './handlers/Home';
import NotFound from './handlers/NotFound';

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={Home} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;
