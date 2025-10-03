# Text Interface Library

**Library code by Tom Hinkle**  
https://www.tomhinkle.net/proj/text-interface

# Table of Contents

- [Text Interface Library](#text-interface-library)
- [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Example Usage](#example-usage)
    - [Key Features](#key-features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Simple Script](#simple-script)
  - [Customization \& Theming](#customization--theming)
    - [Built-in Themes](#built-in-themes)
    - [Creating Custom Themes](#creating-custom-themes)
    - [Customizable CSS Variables](#customizable-css-variables)
    - [Manual CSS Override](#manual-css-override)
    - [Theme System Features](#theme-system-features)
    - [Common Methods for Customization](#common-methods-for-customization)
  - [Complete API Guide](#complete-api-guide)
    - [Class: `TextInterface`](#class-textinterface)
      - [Constructor](#constructor)
    - [Methods](#methods)
      - [The Basics](#the-basics)
      - [Additional outputs](#additional-outputs)
      - [Convenience methods:](#convenience-methods)
      - [Customization:](#customization)
  - [Terminal-Style Configuration](#terminal-style-configuration)
    - [Basic Shell Setup](#basic-shell-setup)
    - [Different Shell Styles](#different-shell-styles)
    - [Terminal Theming Examples](#terminal-theming-examples)
    - [Interactive Shell Example](#interactive-shell-example)
    - [Customizing Prompt Behavior](#customizing-prompt-behavior)

## Overview

The Text Interface Library is designed for beginner programmers who want to write simple, interactive programs in a web-based environment. It allows developers to use straightforward commands, similar to traditional programming interfaces, while leveraging the power of JavaScript and modern web development.

### Example Usage

A simple program using this library might look like this:

```javascript
const ti = new TextInterface();
ti.output("What is your name?");
let name = await ti.readText();
ti.output("Hello, " + name + "!");
```

### Key Features

- **Simple API** for basic text I/O operations.
- **Async/Await Support** to handle user input without blocking the web page.
- **Terminal-Like Interface** that mimics an old-school look, fully customizable through CSS.
- **Pre-built Methods** for different input types:
  - `readText()` for text input.
  - `readNumber()` for numeric input.
  - `readYesOrNo()` for boolean input.
  - `readChoice()` for selecting from a list of choices.
- **Customizable** with CSS variables to change the appearance, and the ability to output
  arbitrary HTML content.

## Getting Started

Just want to play around? [Here is a codepen to try it out](https://codepen.io/thinkle-iacs/pen/JjQgrGy)

### Installation

If you're using a modern web development environment, you can install the Text Interface Library via npm:

```bash
npm install text-interface
```

Not using a build process? You can just drop a script tag into your HTML:

```html
<!-- Include the library via CDN -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/text-interface@latest/dist/main.js"
></script>
```

### Simple Script

For simple input and output, you will need to use async/await to handle the asynchronous nature of the library. If you're using a module with top-level await support, you can write code as simple as this:

```javascript
const ti = new TextInterface();
let name = await ti.prompt("What is your name?");
ti.output("Hello, " + name + "!");
```

If you don't have top-level await support, you can wrap your code in an async function:

```javascript
(async () => {
  const ti = new TextInterface();
  let name = await ti.prompt("What is your name?");
  ti.output("Hello, " + name + "!");
})();
```

Or, if that feels too sloppy to use with beginners, perhaps you could use a `main` top-level function:

```javascript
async function main() {
  const ti = new TextInterface();
  let name = await ti.prompt("What is your name?");
  ti.output("Hello, " + name + "!");
}

main();
```

## Customization & Theming

The Text Interface Library is designed to be easily customized through CSS variables and comes with a comprehensive theming system. You can either use built-in themes or create your own custom themes.

### Built-in Themes

The library includes several pre-designed themes that you can apply instantly:

```javascript
import { applyTheme, themes } from "text-interface/themes";

// Apply any built-in theme
applyTheme(themes.dracula);
applyTheme(themes.vsCodeDark);
applyTheme(themes.typewriter);
```

**Available Themes:**

- `lightMode` - Clean light theme with modern fonts
- `darkMode` - Sophisticated dark theme with Inter and JetBrains Mono
- `greenTerminal` - Classic retro terminal with green on black
- `orangeTerminal` - Warm amber terminal theme
- `futuristic` - Sci-fi inspired with cyan and pink accents
- `typewriter` - Vintage typewriter aesthetic with aged paper colors
- `vsCodeDark` - Authentic VS Code dark theme
- `dracula` - Popular purple/pink/cyan developer theme
- `solarizedDark` - The famous scientifically-designed dark palette
- `solarizedLight` - Light version of Solarized
- `monokai` - Classic Sublime Text theme
- `nord` - Arctic-inspired frost and aurora colors
- `github` - GitHub's clean light theme
- `paper` - Minimal paper-like light theme

### Creating Custom Themes

You can create your own themes by defining CSS custom properties:

```javascript
import { applyTheme } from "text-interface/themes";

const myCustomTheme = `
:root {
  --ti-black: #1a1a2e;
  --ti-white: #eee;
  --ti-caret-color: #ff6b6b;
  --ti-font: 'Fira Code', monospace;
  --ti-output-spacing: 0.8em;
}
`;

applyTheme(myCustomTheme);
```

### Customizable CSS Variables

Below is a comprehensive list of the CSS variables you can override:

| Variable Name                    | Default Value        | Description                      |
| -------------------------------- | -------------------- | -------------------------------- |
| `--ti-black`                     | `#222`               | Background color                 |
| `--ti-white`                     | `#fefefe`            | Primary text color               |
| `--ti-grey`                      | `#888`               | Borders and secondary elements   |
| `--ti-offwhite`                  | `#aaa`               | Placeholder and muted text       |
| `--ti-font`                      | `Roboto, sans-serif` | Font family for the interface    |
| `--ti-output-font`               | `monospace`          | Font family for output text      |
| `--ti-echo-font`                 | `monospace`          | Font family for echoed input     |
| `--ti-echo-color`                | `#aaa`               | Color for echoed input           |
| `--ti-input-color`               | `#aaa`               | Color for input text             |
| `--ti-caret-color`               | `#fefefe`            | Color of the cursor              |
| `--ti-custom-caret`              | `"█"`                | Character used for custom cursor |
| `--ti-custom-caret-shape`        | `block`              | Shape of the cursor when typing  |
| `--ti-font-size`                 | `1em`                | Base font size                   |
| `--ti-max-height`                | `90vh`               | Maximum height of the interface  |
| `--ti-max-width`                 | `28em`               | Maximum width of the interface   |
| `--ti-min-width`                 | `20em`               | Minimum width of the interface   |
| `--ti-output-spacing`            | `0.5em`              | Spacing between output lines     |
| `--ti-input-padding`             | `0`                  | Padding around input area        |
| `--ti-focus-outline`             | `auto`               | Focus outline style              |
| `--ti-focus-border-bottom`       | `none`               | Bottom border when focused       |
| `--ti-scroll-thumb-color`        | `#888`               | Scrollbar thumb color            |
| `--ti-scroll-thumb-hover-color`  | `#555`               | Scrollbar thumb hover color      |
| `--ti-scroll-thumb-active-color` | `#333`               | Scrollbar thumb active color     |
| `--ti-scroll-track-color`        | `#222`               | Scrollbar track background       |

### Manual CSS Override

For fine-grained control, you can override CSS variables manually:

```html
<style>
  :root {
    --ti-black: #000;
    --ti-white: #fff;
    --ti-font: "Arial", sans-serif;
    --ti-echo-color: #ff79c6;
    --ti-output-spacing: 1em;
  }
</style>
```

### Theme System Features

- **Automatic font loading** - Themes include Google Fonts imports
- **User override friendly** - Themes are inserted at the beginning of `<head>` so your styles take precedence
- **Consistent API** - All themes follow the same variable naming convention
- **Hot-swappable** - Change themes instantly without page reload

### Common Methods for Customization

The Text Interface Library provides methods to customize the behavior of the interface programmatically:

```javascript
const ti = new TextInterface();
ti.outputAnimationLength = 1000; // Set the output animation duration in milliseconds
ti.outputDelay = 500; // Set the delay before text output in milliseconds
ti.shouldStealFocus = true; // Automatically focus the input field when reading input
```

## Complete API Guide

### Class: `TextInterface`

#### Constructor

- `new TextInterface(element?: HTMLElement, title?: string, placeholder?: string, prompt?: string)`
  - **element**: The parent element where the interface will be created. Defaults to `document.body`.
  - **title**: The title displayed at the top of the interface. Defaults to `"Text Interface"`.
  - **placeholder**: The placeholder text shown when input is empty. Defaults to `"Type and hit return..."`.
  - **prompt**: The prompt string shown before the input (like `$` or `>` in terminals). Defaults to `""`.

### Methods

#### The Basics

You could limit yourself to just these when teaching at an introductory level.

- **`output(text: string): void`**  
  Outputs text to the interface.

- **`setTitle(text: string): void`**  
  Sets the title of the interface on the screen.

- **`clear(): void`**  
  Clears the output area.

- **`readText(): Promise<string>`**  
  Reads text input from the user.

- **`prompt(prompt: string): Promise<string>`**  
  Outputs a prompt and reads text input from the user.

#### Additional outputs

- **`showImage(src: string, alt?: string): void`**  
  Appends an image to the output area.

- **`showElement(element: HTMLElement): void`**  
  Appends a given element to the output area.

- **`showHTML(arbitraryHTML: string): void`**  
  Appends raw HTML to the output area.

#### Convenience methods:

- **`readChoice(choices: string[], prompt?: string, error?: string): Promise<string>`**  
  Prompts the user to choose from a list of options and returns the selected option.

- **`readYesOrNo(errorMessage?: string): Promise<boolean>`**  
  Prompts the user for a "yes" or "no" answer and returns a boolean.

- **`promptYesOrNo(prompt: string): Promise<boolean>`**  
  Outputs a prompt and reads a "yes" or "no" answer from the user.

- **`promptNumber(prompt: string, errorMessage: string): Promise<number>`**  
  Outputs a prompt and reads a number input from the user.

- **`promptInteger(prompt: string, errorMessage: string): Promise<number>`**  
  Outputs a prompt and reads an integer input from the user.

- **`promptNumberInRange(prompt: string, min: number, max: number, errorMessage: string): Promise<number>`**  
  Outputs a prompt and reads a number within a range from the user.

- **`promptIntegerInRange(prompt: string, min: number, max: number, errorMessage: string): Promise<number>`**  
  Outputs a prompt and reads an integer within a range from the user.

- **`readNumber(errorMessage?: string): Promise<number>`**  
  Prompts the user for a number and returns it. Repeats if the input is invalid.

- **`readInteger(errorMessage?: string): Promise<number>`**  
  Prompts the user for an integer and returns it. Repeats if the input is invalid.

- **`readIntegerInRange(min: number, max: number, errorMessage?: string): Promise<number>`**  
  Prompts the user for an integer within a specific range and returns it.

- **`readNumberInRange(min: number, max: number, errorMessage?: string): Promise<number>`**  
  Prompts the user for a number within a specific range and returns it.

#### Customization:

- **`setPlaceholder(text: string): void`**  
  Updates the placeholder text shown in the input field.

- **`setPrompt(text: string): void`**  
  Updates the prompt string shown before the input (like `$` or `>` in terminals).

- **`hideTitle(): void`**  
  Hides the title/header of the interface.

- **`showTitle(): void`**  
  Shows the title/header of the interface.

- **`.setScrollOptions(options: ScrollIntoViewOptions): void`**  
  Sets custom scroll behavior for elements.

- **.outputAnimationLength** the output animation duration in milliseconds
- **.outputDelay** the delay before text output in milliseconds
- **.shouldStealFocus** Whether to focus the input field when reading input

## Terminal-Style Configuration

The Text Interface Library can be configured to look and behave like a classic terminal or shell. Here are some common configurations:

### Basic Shell Setup

```javascript
// Create a terminal-like interface
const terminal = new TextInterface(
  document.body,
  "Terminal",
  "Enter command...",
  "$ " // Classic shell prompt
);

// Apply a terminal theme
import { applyTheme, themes } from "text-interface/themes";
applyTheme(themes.greenTerminal);

// Configure for terminal behavior
terminal.outputAnimationLength = 0; // Instant output like real terminals
terminal.shouldStealFocus = true; // Auto-focus for seamless typing

// Customize dynamically
terminal.setPrompt("user@localhost:~$ "); // Change prompt
terminal.hideTitle(); // Hide title for full-screen terminal feel
```

### Different Shell Styles

```javascript
// Bash-style
const bash = new TextInterface(
  document.body,
  "bash",
  "command",
  "user@host:~$ "
);

// Windows Command Prompt style
const cmd = new TextInterface(
  document.body,
  "Command Prompt",
  "command",
  "C:\\> "
);

// PowerShell style
const ps = new TextInterface(
  document.body,
  "PowerShell",
  "command",
  "PS C:\\> "
);

// Root/admin style
const root = new TextInterface(document.body, "root", "command", "# ");

// Custom prompt with colors (requires theme support)
const custom = new TextInterface(
  document.body,
  "Custom Shell",
  "command",
  "→ "
);
```

### Terminal Theming Examples

```javascript
// Classic green terminal
applyTheme(themes.greenTerminal);
const retro = new TextInterface(
  document.body,
  "SYSTEM-1",
  "INPUT COMMAND",
  "> "
);

// Amber terminal (like old monitors)
applyTheme(themes.orangeTerminal);
const amber = new TextInterface(document.body, "TERMINAL", "READY", "$ ");

// Modern dark terminal
applyTheme(themes.vsCodeDark);
const modern = new TextInterface(document.body, "Terminal", "command", "❯ ");
```

### Interactive Shell Example

```javascript
const shell = new TextInterface(document.body, "MyShell v1.0", "command", "$ ");
applyTheme(themes.greenTerminal);

// Simple command processor
async function runShell() {
  shell.output("Welcome to MyShell! Type 'help' for commands.");

  let currentUser = "user";

  while (true) {
    const command = await shell.readText();
    const [cmd, ...args] = command.split(" ");

    if (cmd === "help") {
      shell.output(
        "Available commands: help, date, clear, exit, su, fullscreen"
      );
    } else if (cmd === "date") {
      shell.output(new Date().toString());
    } else if (cmd === "clear") {
      shell.clear();
    } else if (cmd === "su" && args[0]) {
      currentUser = args[0];
      const prompt = currentUser === "root" ? "# " : "$ ";
      shell.setPrompt(`${currentUser}@localhost:~${prompt}`);
      shell.output(`Switched to user: ${currentUser}`);
    } else if (cmd === "fullscreen") {
      shell.hideTitle(); // Hide title for immersive terminal
      shell.output("Entered fullscreen mode");
    } else if (cmd === "exit") {
      shell.output("Goodbye!");
      break;
    } else {
      shell.output(`Command not found: ${command}`);
    }
  }
}

runShell();
```

### Customizing Prompt Behavior

The prompt string supports any text or Unicode characters:

```javascript
// Different prompt styles
"$ "; // Classic Unix shell
"C:\\> "; // Windows command prompt
">>> "; // Python REPL style
"→ "; // Modern minimal
"⚡ "; // Fun with emojis
"[user@host]$ "; // Full context prompt
```

**Note:** The prompt automatically appears only when the interface is ready for input, giving you authentic terminal behavior where the prompt shows the system is waiting for commands.
