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
  - [Customization](#customization)
    - [Customizable CSS Variables](#customizable-css-variables)
    - [How to Override CSS Variables](#how-to-override-css-variables)
    - [Common Methods for Customization](#common-methods-for-customization)
  - [Complete API Guide](#complete-api-guide)
    - [Class: `TextInterface`](#class-textinterface)
      - [Constructor](#constructor)
    - [Methods](#methods)
      - [The Basics](#the-basics)
      - [Additional outputs](#additional-outputs)
      - [Convenience methods:](#convenience-methods)
      - [Customization:](#customization-1)

## Overview

The Text Interface Library is designed for beginner programmers who want to write simple, interactive programs in a web-based environment. It allows developers to use straightforward commands, similar to traditional programming interfaces, while leveraging the power of JavaScript and modern web development.

### Example Usage

A simple program using this library might look like this:

```javascript
const ti = new TextInterface();
ti.output('What is your name?');
let name = await ti.readText();
ti.output('Hello, ' + name + '!');
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
<script type="module" src="https://cdn.jsdelivr.net/npm/text-interface@latest/dist/main.js"></script>
```

### Simple Script

For simple input and output, you will need to use async/await to handle the asynchronous nature of the library. If you're using a module with top-level await support, you can write code as simple as this:

```javascript
const ti = new TextInterface();
let name = await ti.prompt('What is your name?');
ti.output('Hello, ' + name + '!');
```

If you don't have top-level await support, you can wrap your code in an async function:

```javascript
(async () => {
  const ti = new TextInterface();
  let name = await ti.prompt('What is your name?');
  ti.output('Hello, ' + name + '!');
})();
```

Or, if that feels too sloppy to use with beginners, perhaps you could use a `main` top-level function:

```javascript
async function main() {
  const ti = new TextInterface();
  let name = await ti.prompt('What is your name?');
  ti.output('Hello, ' + name + '!');
}

main();
```

## Customization

The Text Interface Library is designed to be easily customized through CSS variables. This allows users to adjust colors, fonts, sizes, and more without modifying the core library code.

### Customizable CSS Variables

Below is a comprehensive list of the CSS variables you can override for customization:

| Variable Name                  | Default Value        | Description                               |
|--------------------------------|----------------------|-------------------------------------------|
| `--ti-offwhite`                | `#aaa`               | Color for placeholder text               |
| `--ti-grey`                    | `#888`               | Color for borders and secondary elements |
| `--ti-black`                   | `#222`               | Background color                         |
| `--ti-white`                   | `#fefefe`            | Primary text color                       |
| `--ti-font`                    | `Roboto, sans-serif` | Font family for the main text interface  |
| `--ti-output-font`             | `monospace`          | Font family for output text              |
| `--ti-echo-color`              | `#aaa`               | Color for echoed input                   |
| `--ti-scroll-track-color`      | `#222`               | Scrollbar track background color         |
| `--ti-scroll-thumb-color`      | `#888`               | Scrollbar thumb color                    |
| `--ti-scroll-thumb-hover-color`| `#555`               | Scrollbar thumb hover color              |
| `--ti-scroll-thumb-active-color`| `#333`              | Scrollbar thumb active color             |
| `--ti-font-size`               | `1em`                | Base font size                           |
| `--ti-max-height`              | `90vh`               | Maximum height of the interface          |
| `--ti-max-width`               | `28em`               | Maximum width of the interface           |
| `--ti-min-width`               | `20em`               | Minimum width of the interface           |

### How to Override CSS Variables

To override the default styles, simply define the CSS variables in a `<style>` block or an external stylesheet:

```html
<style>
  :root {
    --ti-black: #000;
    --ti-white: #fff;
    --ti-font: 'Arial', sans-serif;
    --ti-echo-color: #ff79c6;
  }
</style>
```

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
- `new TextInterface(element?: HTMLElement, title?: string)`
  - **element**: The parent element where the interface will be created. Defaults to `document.body`.
  - **title**: The title displayed at the top of the interface. Defaults to `"Text Interface"`.

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

- **`.setScrollOptions(options: ScrollIntoViewOptions): void`**  
  Sets custom scroll behavior for elements.

- **.outputAnimationLength**  the output animation duration in milliseconds
- **.outputDelay**  the delay before text output in milliseconds
- **.shouldStealFocus** Whether to focus the input field when reading input
