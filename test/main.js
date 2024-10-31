import { TextInterface } from "../src/index";
console.log("Off to a great start!");
// Example usage of your library for testing
let app = document.querySelector("#app");
let ti = new TextInterface(app, "Testing Text Interface");

ti.shouldStealFocus = true;
let name = await ti.prompt("What is your name?");
let num = await ti.promptIntegerInRange("Enter a number between 1 and 10!", 1, 10);
ti.output("Hello, " + name);
ti.output(`${num+1} is my favorite number - so close!`);
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
