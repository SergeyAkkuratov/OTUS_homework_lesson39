import "./style.css";
import Router from "./router";

const router = new Router({ mode: "hash" });

router.addRoute({
    path: "/",
    onEnter: async () => {
        console.log("Entered home route");
    },
});

router.addRoute({
    path: "/about",
    onBeforeEnter: async () => {
        console.log("Before entering about route");
    },
    onEnter: async () => {
        console.log("Entered about route");
    },
    onLeave: async () => {
        console.log("Leaving about route");
    },
});

router.addRoute({
    path: /^\/user\/(?<id>\d+)$/,
    onEnter: async (params) => {
        console.log(`Entered user route with ID: ${params?.id}`);
    },
});

document.getElementById("home")?.addEventListener("click", () => router.navigate("/"));
document.getElementById("about")?.addEventListener("click", () => router.navigate("/about"));
document.getElementById("user")?.addEventListener("click", () => router.navigate("/user/123"));
