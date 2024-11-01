import { TextInterface } from "../src/index";
console.log("Off to a great start!");
// Example usage of your library for testing
let app = document.querySelector("#app");
let ti = new TextInterface(app, "Testing Text Interface");

ti.shouldStealFocus = true;
ti.showImage(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/2560px-Taj_Mahal_%28Edited%29.jpeg"
);
ti.output(
  `
  This
  is
  a 
  rather long output
  that is designed
  to make it so I can
  test
  the
  scroll
  function
  of 
  this thing.`
)
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
let keepGoing = true;
while (keepGoing) {
  // Output a random block of 8x8 characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  ti.output(Array.from({ length: 16 }, () =>
    Array.from(
      { length: 16 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("")
  ).join("\n"));
  keepGoing = await ti.promptYesOrNo("Do you want to keep going?");
}