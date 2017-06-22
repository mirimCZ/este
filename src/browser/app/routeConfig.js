// @flow
import type { State } from '../../common/types';
import HttpError from 'found/lib/HttpError';
import React from 'react';
import queryFirebase from './queryFirebase';
import { makeRouteConfig, Route } from 'found/lib/jsx';
import { onUsersPresence } from '../../common/users/actions';
import fetch from 'isomorphic-fetch'

// Pages
import App from './App';
import FieldsPage from '../fields/FieldsPage';
import HomePage from '../home/HomePage';
import IntlPage from '../intl/IntlPage';
import MePage from '../me/MePage';
import OfflinePage from '../offline/OfflinePage';
import ProfilePage from '../me/ProfilePage';
import SettingsPage from '../me/SettingsPage';
import SignInPage from '../auth/SignInPage';
import TodosPage from '../todos/TodosPage';
import UsersPage from '../users/UsersPage';
import HeroesPage from '../heroes/HeroesPage';

// Custom route to require viewer aka authenticated user.
const AuthorizedRoute = () => {};
AuthorizedRoute.createRoute = props => ({
  ...props,
  render: ({ Component, match, props }) => {
    const state: State = match.context.store.getState();
    if (!state.users.viewer) {
      // No redirect, just 401 Unauthorized, so we don't have to handle pesky
      // redirections manually. Check app/renderError.
      throw new HttpError(401);
    }
    return <Component {...props} />;
  },
});

const routeConfig = makeRouteConfig(
  <Route path="/" Component={App}>
    <Route Component={HomePage} />
    <Route path="fields" Component={FieldsPage} />
    <Route path="intl" Component={IntlPage} />
    <AuthorizedRoute path="me" Component={MePage}>
      <Route path="profile" Component={ProfilePage} />
      <Route path="settings" Component={SettingsPage} />
    </AuthorizedRoute>
    <Route path="offline" Component={OfflinePage} />
    <Route path="signin" Component={SignInPage} />
    <Route path="todos" Component={TodosPage} />
    <Route
      path="heroes"
      Component={HeroesPage}
      getData={() => (
        fetch('https://gateway.marvel.com:443/v1/public/characters?apikey=5ee9ebc6e58d747fa165a039cf3ca442')
          .then(response => response.json())
          .then(json => {
            console.log('test it');
            console.log(json)
          })
      )}
    />
    <Route
      path="heroes-broken"
      Component={HeroesPage}
      getData={() => (
        fetch('http://localhost:3004/api/heroes')
          .then(response => response.json())
          .then(json => {
            console.log('test it');
            console.log(json)
          })
      )}
    />
    <Route
      path="users"
      Component={UsersPage}
      getData={queryFirebase(
        ref => [ref.child('users-presence'), 'value', onUsersPresence],
        // ref => [ref.child('what-ever').limitToFirst(1), 'value', onWhatEver],
      )}
    />
  </Route>,
);

export default routeConfig;
