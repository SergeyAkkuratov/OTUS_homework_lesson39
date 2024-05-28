import Router, { extractParams } from "./router";

describe("Router", () => {
    let router: Router;

    beforeEach(() => {
        router = new Router({ mode: "history" });
        window.history.pushState(null, "/", "/");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should navigate to home route", async () => {
        const onEnter = jest.fn();
        router.addRoute({ path: "/", onEnter });

        await router.navigate("/");
        expect(onEnter).toHaveBeenCalled();
    });

    it("should call onBeforeEnter, onEnter, and onLeave hooks", async () => {
        const onBeforeEnter = jest.fn();
        const onEnter = jest.fn();
        const onLeave = jest.fn();

        router.addRoute({ path: "/about", onBeforeEnter, onEnter, onLeave });
        router.addRoute({ path: "/", onEnter: jest.fn() });

        await router.navigate("/about");
        expect(onBeforeEnter).toHaveBeenCalled();
        expect(onEnter).toHaveBeenCalled();

        await router.navigate("/");
        expect(onLeave).toHaveBeenCalled();
    });

    it("should call onBeforeEnter, and onLeave hooks", async () => {
        const onBeforeEnter = jest.fn();
        const onLeave = jest.fn();

        router.addRoute({ path: "/about", onBeforeEnter, onLeave });
        router.addRoute({ path: "/", onEnter: jest.fn() });

        await router.navigate("/about");
        expect(onBeforeEnter).toHaveBeenCalled();

        await router.navigate("/");
        expect(onLeave).toHaveBeenCalled();
    });

    it("should extract params from path", async () => {
        const onEnter = jest.fn();
        router.addRoute({ path: /^\/user\/(?<id>\d+)$/, onEnter });

        await router.navigate("/user/123");
        expect(onEnter).toHaveBeenCalledWith({ id: "123" });
    });

    it("shouldn't extract params from path", async () => {
        const onEnter = jest.fn();
        router.addRoute({ path: /^\/user\/\d+$/, onEnter });

        await router.navigate("/user/123");
        expect(onEnter).toHaveBeenCalledWith({});
    });

    it("should handle hash mode", async () => {
        router = new Router({ mode: "hash" });
        const onEnter = jest.fn();
        router.addRoute({ path: "/", onEnter });

        window.location.hash = "#/";
        window.dispatchEvent(new HashChangeEvent("hashchange"));

        expect(onEnter).toHaveBeenCalled();
    });

    it("should handle history mode", async () => {
        const onEnter = jest.fn();
        router.addRoute({ path: "/", onEnter });

        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));

        expect(onEnter).toHaveBeenCalled();
    });

    it("should return params for regex path", () => {
        expect(extractParams(/^\/test\/(?<id>\d+)$/, "/test/123")).toEqual({ id: "123" });
    });

    it("should navigate with hash", async () => {
        router = new Router({ mode: "hash" });
        const onEnter = jest.fn();
        router.addRoute({ path: "/", onEnter });

        window.location.hash = "#/";

        await router.navigate("#/");
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        expect(onEnter).toHaveBeenCalled();
    });

    it("should work with funcitons", async () => {
        const onEnter = jest.fn();
        router.addRoute({ path: (path) => path === "/", onEnter });

        await router.navigate("/");
        expect(onEnter).toHaveBeenCalled();
    });

    it("shoiuld delete route by callback function", async () => {
        const onEnter = jest.fn();
        const removeFn = router.addRoute({ path: (path) => path === "/", onEnter });

        await router.navigate("/");
        expect(onEnter).toHaveBeenCalledTimes(1);

        removeFn();
        await router.navigate("/");
        expect(onEnter).toHaveBeenCalledTimes(1);
    });
});
