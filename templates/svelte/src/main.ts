import { mount } from "svelte";
import "./app.css";
import { whenOdysseyLoaded } from "@abcnews/env-utils";
import App from "./App.svelte";

await whenOdysseyLoaded;

const app = mount(App, {
  target: document.getElementById("mountpoint")!,
});

export default app;
