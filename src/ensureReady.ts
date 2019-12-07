import { matchPath } from "react-router-dom";
import { AsyncRouteProps } from "./types";
import { isLoadableComponent } from "./utils";

/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export function ensureReady(routes: AsyncRouteProps[], pathname?: string) {
  const prefetch = Promise.all(
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
  );

  let data: any;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval(
      "(" +
        (document as any).getElementById("server-app-state").textContent +
        ")"
    );
  }
  return prefetch.then(() => data);
}
