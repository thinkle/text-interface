/*
 * This code was provided by my teacher:
 *
 * Library code by Tom Hinkle
 * https://www.tomhinkle.net/proj/text-interface
 *
 * MIT License
 *
 * Copyright (c) [2024] [Thomas M. Hinkle]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import "./textInterface.css";

const yesWords = ["yes", "yeah", "yep", "yup", "true", "t", "y", "aye", "yup"];
const noWords = ["no", "n", "false", "f", "nope", "nah"];

export class TextInterface {
  private listener: ((arg0: string) => void) | null = null;
  /*
   * the number of milliseconds taken to display
   * text passed to the output method
   */
  outputAnimationLength: number = 800;

  /*
   * The delay before outputting text
   */
  outputDelay: number = 300;
  shouldStealFocus: boolean = false;

  private outputQueue: [
    "element" | "text",
    any?,
    boolean?,
    ((value: void | PromiseLike<void>) => void)?
  ][];
  private div: HTMLDivElement;
  private inputEl: HTMLDivElement;
  private outputEl: HTMLDivElement;
  private placeholderEl: HTMLDivElement;
  private promptEl: HTMLDivElement;
  private inputWrap: HTMLDivElement;
  private outputting!: boolean;
  private scrollOptions: ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  };
  private promptString: string;
  constructor(
    element = document.body,
    title = "Text Interface",
    placeholder = "Type and hit return...",
    prompt = ""
  ) {
    this.outputQueue = [];
    this.promptString = prompt;
    this.div = document.createElement("div") as HTMLDivElement;
    this.div.classList.add("text-interface");
    element.appendChild(this.div);
    this.div.innerHTML = `
      <h2 class="ti-title">${title}</h2>
      <div class="output">
      </div>
      <label class="prompt-wrap ${prompt ? "has-prompt" : "no-prompt"}">
        <div class="prompt">${this.promptString}</div>
        <div class="input-wrap">         
            <div 
              class="input" 
              contenteditable 
              >
            </div>
            <div class="placeholder">${placeholder}</div>
        </div>
      </label>
    `;
    this.inputWrap = this.div.querySelector(".input-wrap") as HTMLDivElement;
    this.inputEl = this.div.querySelector(".input") as HTMLDivElement;
    this.outputEl = this.div.querySelector(".output") as HTMLDivElement;
    this.placeholderEl = this.div.querySelector(
      ".placeholder"
    ) as HTMLDivElement;
    this.promptEl = this.div.querySelector(".prompt") as HTMLDivElement;
    this.setupInputListener();
    this.promptEl.addEventListener("click", () => this.inputEl.focus());
    this.placeholderEl.addEventListener("click", () => this.inputEl.focus());
    if (this.shouldStealFocus) this.inputEl.focus();
  }

  setPlaceholder(text: string) {
    this.placeholderEl.textContent = text;
  }
  setPrompt(text: string) {
    this.promptString = text;
    this.promptEl.textContent = text;
    if (text && text != "") {
      this.promptEl.parentElement!.classList.add("has-prompt");
      this.promptEl.parentElement!.classList.remove("no-prompt");
    } else {
      this.promptEl.parentElement!.classList.remove("has-prompt");
      this.promptEl.parentElement!.classList.add("no-prompt");
    }
  }

  setTitle(text: string) {
    this.div.querySelector(".ti-title")!.textContent = text;
  }
  hideTitle() {
    this.div.querySelector(".ti-title")!.style.display = "none";
    this.div.querySelector(".output")!.style.marginTop = "1em";
  }
  showTitle() {
    this.div.querySelector(".output")!.style.marginTop = "0";
    this.div.querySelector(".ti-title")!.style.display = "block";
  }

  clear() {
    this.outputEl.innerHTML = "";
  }

  setScrollOptions(options: ScrollIntoViewOptions) {
    this.scrollOptions = options;
  }

  async readChoice(
    choices: string[],
    prompt = "Choose one of the following:",
    error = "You must choose one of the options!"
  ): Promise<string> {
    await this.output(prompt);
    for (let n = 0; n < choices.length; n++) {
      await this.output(`${n + 1}. ${choices[n]}`);
    }
    let textInput = await this.readText();
    // If they've typed the choice, just return the choice
    if (choices.indexOf(textInput) > -1) {
      return textInput;
    }
    // Otherwise, look for a number as an answer
    textInput = textInput.replace(/\D/g, "");
    if (textInput != "") {
      let number = Number(textInput);
      if (!isNaN(number) && number <= choices.length && number > 0) {
        return choices[Math.floor(number) - 1];
      }
    }
    await this.output(error);
    let correction = await this.readChoice(choices, prompt, error);
    return correction;
  }

  async readYesOrNo(errorMessage = "Say yes or no!"): Promise<boolean> {
    let text = await this.readText();
    text = text.toLowerCase();
    text = text.replace(/\s+/, "");
    if (yesWords.indexOf(text) > -1) {
      return true;
    }

    if (noWords.indexOf(text) > -1) {
      return false;
    } else {
      await this.output(errorMessage);
      return await this.readYesOrNo(errorMessage);
    }
  }

  async readNumber(errorMessage = "Please type a number"): Promise<number> {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number)) {
      await this.output(errorMessage);
      return this.readNumber(errorMessage);
    } else {
      return number;
    }
  }

  async readInteger(
    errorMessage = "Please type a whole number"
  ): Promise<number> {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number) || number % 1 != 0) {
      await this.output(errorMessage);
      return this.readInteger(errorMessage);
    } else {
      return number;
    }
  }

  async readIntegerInRange(
    min: number,
    max: number,
    errorMessage = `Please type a whole number within the range of ${min} and ${max}`
  ): Promise<number> {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number) || number % 1 != 0 || number > max || number < min) {
      await this.output(errorMessage);
      let number = await this.readIntegerInRange(min, max, errorMessage);
      return number;
    } else {
      return number;
    }
  }

  async readNumberInRange(
    min: number,
    max: number,
    errorMessage = `Please type a whole number within the range of ${min} and ${max}`
  ): Promise<number> {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number) || number > max || number < min) {
      await this.output(errorMessage);
      let number = await this.readNumberInRange(min, max, errorMessage);
      return number;
    } else {
      return number;
    }
  }

  readText(): Promise<string> {
    if (this.shouldStealFocus) this.inputEl.focus();
    this.inputWrap.classList.add("active");
    this.div.classList.add("ready"); // Show we're ready for input
    this.inputWrap.scrollIntoView(this.scrollOptions);
    return new Promise((resolve, reject) => {
      this.listener = resolve;
    });
  }

  async prompt(prompt: string): Promise<string> {
    await this.output(prompt);
    return this.readText();
  }

  async promptYesOrNo(prompt: string): Promise<boolean> {
    await this.output(prompt);
    return this.readYesOrNo();
  }

  async promptNumber(prompt: string, errorMessage: string): Promise<number> {
    await this.output(prompt);
    return this.readNumber(errorMessage);
  }

  async promptInteger(prompt: string, errorMessage: string): Promise<number> {
    await this.output(prompt);
    return this.readInteger(errorMessage);
  }

  async promptNumberInRange(
    prompt: string,
    min: number,
    max: number,
    errorMessage: string
  ): Promise<number> {
    await this.output(prompt);
    return this.readNumberInRange(min, max, errorMessage);
  }

  async promptIntegerInRange(
    prompt: string,
    min: number,
    max: number,
    errorMessage: string
  ): Promise<number> {
    await this.output(prompt);
    return this.readIntegerInRange(min, max, errorMessage);
  }

  showElement(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      if (this.outputting) {
        this.outputQueue.push(["element", element, undefined, resolve]);
      } else {
        this.outputting = true;
        this.div.classList.remove("ready"); // Hide prompt when outputting
        this.outputEl.appendChild(element);
        element.scrollIntoView(this.scrollOptions);
        setTimeout(() => {
          this.outputting = false;
          this.doNextOutput();
          resolve();
        }, this.outputDelay);
      }
    });
  }

  showHTML(arbitraryHTML: string): Promise<void> {
    let div = document.createElement("div");
    div.innerHTML = arbitraryHTML;
    return this.showElement(div);
  }

  showImage(src: string, alt = "An image"): Promise<void> {
    let img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", alt);
    return this.showElement(img);
  }

  output(text: string, echo = false): Promise<void> {
    return new Promise((resolve) => {
      text = "" + text;
      /* If we are already outputting, wait... */
      if (this.outputting) {
        this.outputQueue.push(["text", text, echo, resolve]);
      } else {
        let output = document.createElement("div");
        output.classList.add("output");
        if (echo) {
          output.classList.add("echo");
        }
        if (!this.outputAnimationLength || echo) {
          output.textContent = text;
          this.outputEl.appendChild(output);
          output.scrollIntoView(this.scrollOptions);
          resolve();
        } else {
          this.outputting = true;
          this.div.classList.remove("ready"); // Hide prompt when outputting
          let delay = this.outputAnimationLength / text.length;
          const animateOutput = () => {
            if (text[0] === "\n") {
              const br = document.createElement("br");
              output.appendChild(br);
            } else {
              const textNode = document.createTextNode(text[0] || "");
              output.appendChild(textNode);
            }
            text = text.substring(1);
            if (text.length) {
              setTimeout(animateOutput, delay);
            } else {
              this.outputting = false;
              this.doNextOutput();
              resolve();
            }
          };
          this.outputEl.appendChild(output);
          output.scrollIntoView(this.scrollOptions);
          setTimeout(animateOutput, this.outputDelay);
        }
      }
    });
  }

  private doNextOutput() {
    if (this.outputQueue.length) {
      let next = this.outputQueue[0];
      this.outputQueue = this.outputQueue.slice(1);
      let nextMode = next[0];
      if (nextMode == "text") {
        let [, text, echo, resolve] = next;
        this.output(text, echo).then(() => resolve && resolve());
      } else {
        // element
        let [, element, , resolve] = next;
        this.showElement(element).then(() => resolve && resolve());
      }
    }
  }

  private setupInputListener() {
    this.inputEl.addEventListener("keyup", (event) => {
      if (this.inputEl.textContent && this.inputEl.textContent != "") {
        this.inputWrap.classList.add("has-text");
      } else {
        this.inputWrap.classList.remove("has-text");
      }

      let isEnter = event.code == "Enter" || event.key == "Enter";
      if (isEnter) {
        let input = this!.inputEl!.textContent!.replace(/\n$/, "");
        let outputText = this.promptString
          ? this.promptString + " " + input
          : input;
        this.output(outputText, true);
        if (this.listener) {
          this.listener(input);
          this.listener = null;
        }
        this.inputWrap.classList.remove("active");
        this.inputWrap.classList.remove("has-text");
        this.div.classList.remove("ready"); // Hide prompt when processing input
        setTimeout(() => {
          this.inputEl.textContent = "";
        }, 1); // after input fires
      }
    });
    this.placeholderEl.addEventListener("click", () => this.inputEl.focus());
  }
}
