import { matchPath } from 'react-router-dom';
import { AsyncRouteProps, ServerAppState } from './types';
import { isLoadableComponent } from './utils';

/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export function ensureReady(routes: AsyncRouteProps[], pathname?: string) {
  return Promise.all(
    routes.map(route => {
      const match = matchPath(pathname || window.location.pathname, route);
      if (
        match &&
        route &&
        route.component &&
        isLoadableComponent(route.component) &&
        route.component.load
      ) {
        return route.component.load();
      }
      return undefined;
    })
  ).then(() => (window as any).__SERVER_APP_STATE__ as ServerAppState);
}
