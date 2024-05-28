type Param = {
    [key: string]: string | number;
}

type RouteConfig = {
    path: string | RegExp | ((path: string | RegExp) => boolean);
    onBeforeEnter?: (params?: Param) => Promise<void> | void;
    onEnter?: (params?: Param) => Promise<void> | void;
    onLeave?: (params?: Param) => Promise<void> | void;
};

export function extractParams(routePath: RegExp, path: string): Param {
    const match = path.match(routePath);
    return match?.groups ?? {};
}

type RouterOptions = {
    mode: 'hash' | 'history';
};

export default class Router {
    private routes: RouteConfig[] = [];

    private currentRoute?: RouteConfig;

    private options: RouterOptions;

    constructor(options: RouterOptions) {
        this.options = options;
        if (this.options.mode === 'hash') {
            window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        } else {
            window.addEventListener('popstate', this.handleRouteChange.bind(this));
        }
        this.handleRouteChange();
    }

    public addRoute(route: RouteConfig) {
        this.routes.push(route);
        return () => {
            this.routes.splice(this.routes.indexOf(route), 1);
        }
    }

    private async handleRouteChange() {
        const path = this.getCurrentPath();
        const route = this.matchRoute(path);

        if (route) {
            const params = route.path instanceof RegExp ? extractParams(route.path, path) : {};

            if (this.currentRoute && this.currentRoute.onLeave) {
                await this.currentRoute.onLeave(params);
            }

            if (route.onBeforeEnter) {
                await route.onBeforeEnter(params);
            }

            this.currentRoute = route;

            if (route.onEnter) {
                await route.onEnter(params);
            }
        }
    }

    private getCurrentPath(): string {
        if (this.options.mode === 'hash') {
            return window.location.hash.slice(1);
        }
        return window.location.pathname;

    }

    private matchRoute(path: string): RouteConfig | undefined {
        return this.routes.find(route => {
            if (typeof route.path === 'string') {
                return route.path === path;
            }
            
            if (route.path instanceof RegExp) {
                return route.path.test(path);
            }

            return route.path(path);
        });
    }

    public navigate(path: string) {
        if (this.options.mode === 'hash') {
            window.location.hash = path;
        } else {
            window.history.pushState(null, path, path);
            this.handleRouteChange();
        }
    }
};