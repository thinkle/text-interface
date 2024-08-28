import { TextInterface } from "../src/index";
console.log("Off to a great start!");
// Example usage of your library for testing
let app = document.querySelector("#app");
let ti = new TextInterface(app, "Testing Text Interface");
await ti.output("What is your name?");
let name = await ti.readText();
ti.output("Hello, " + name);
let choice = await ti.readChoice([
  "Eat an apple",
  "Eat a cookie",
  "Eat a burrito",
]);
ti.output('You chose: "' + choice + '"');
if (choice.includes("burrito")) {
  ti.output("Good choice!");
} else if (choice.includes("cookie")) {
  ti.output("Bad choice!");
} else {
  ti.output("Healthy choice!");
}
