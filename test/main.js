import { TextInterface, themes, applyTheme } from "../src/index";
console.log("Off to a great start!");
// Example usage of your library for testing

let app = document.querySelector("#app");
let ti = new TextInterface(app, "Testing Text Interface", "Say something", "");
ti.hideTitle();


ti.shouldStealFocus = true;
/* M */
ti.outputAnimationLength = 1nord00;
let keepTheming = true;
while (keepTheming) {
  let themeChoice = await ti.prompt("Choose a theme");
  if (!themes[themeChoice]) {
    themeChoice = await ti.readChoice(Object.keys(themes), "Pick a theme: ");
  }
  applyTheme(themes[themeChoice]);
  let prompt = await ti.prompt("Choose a prompt character (or nothing):");
  ti.setPrompt(prompt);
  await ti.output("Well this is certainly fun, isn't it!");
}
ti.outputAnimationLength = 500;
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