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
  listener: ((arg0: string) => void) | null = null;
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

  private outputQueue: ["element" | "text", any?, boolean?][];
  private div: HTMLDivElement;
  private inputEl: HTMLDivElement;
  private outputEl: HTMLDivElement;
  private placeholderEl: HTMLDivElement;
  private inputWrap: HTMLDivElement;
  private outputting!: boolean;

  constructor(element = document.body, title = "Text Interface") {
    this.outputQueue = [];
    this.div = document.createElement("div") as HTMLDivElement;
    this.div.classList.add("text-interface");
    element.appendChild(this.div);
    this.div.innerHTML = `
      <h2 class="ti-title">${title}</h2>
      <div class="output">
      </div>
      <div class="input-wrap">
          <div 
             class="input" 
             contenteditable 
             placeholder="Type here...">
          </div>
          <div class="placeholder">Type and hit return...</div>
      </div>
    `;
    this.inputWrap = this.div.querySelector(".input-wrap") as HTMLDivElement;
    this.inputEl = this.div.querySelector(".input") as HTMLDivElement;
    this.outputEl = this.div.querySelector(".output") as HTMLDivElement;
    this.placeholderEl = this.div.querySelector(
      ".placeholder"
    ) as HTMLDivElement;
    this.setupInputListener();
    if (this.shouldStealFocus) this.inputEl.focus();
  }

  setTitle(text: string) {
    this.div.querySelector(".ti-title")!.textContent = text;
  }

  clear() {
    this.outputEl.innerHTML = "";
  }

  async readChoice(
    choices: string[],
    prompt = "Choose one of the following:",
    error = "You must choose one of the options!"
  ): Promise<string> {
    this.output(prompt);
    for (let n = 0; n < choices.length; n++) {
      this.output(`${n + 1}. ${choices[n]}`);
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
    this.output(error);
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
      this.output(errorMessage);
      return await this.readYesOrNo(errorMessage);
    }
  }

  async readNumber(errorMessage = "Please type a number"): Promise<number> {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number)) {
      this.output(errorMessage);
      return this.readNumber(errorMessage);
    } else {
      return number;
    }
  }

  readText(): Promise<string> {
    if (this.shouldStealFocus) this.inputEl.focus();
    this.inputWrap.classList.add("active");
    this.inputWrap.scrollIntoView();
    return new Promise((resolve, reject) => {
      this.listener = resolve;
    });
  }

  showElement(element: HTMLElement) {
    if (this.outputting) {
      this.outputQueue.push(["element", element]);
    } else {
      this.outputting = true;
      this.outputEl.appendChild(element);
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        this.outputting = false;
        this.doNextOutput();
      }, this.outputDelay);
    }
  }

  showHTML(arbitraryHTML: string) {
    let div = document.createElement("div");
    div.innerHTML = arbitraryHTML;
    this.showElement(div);
  }

  showImage(src: string, alt = "An image") {
    let img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", alt);
    this.showElement(img);
  }

  output(text: string, echo = false) {
    text = "" + text;
    /* If we are already outputting, wait... */
    if (this.outputting) {
      this.outputQueue.push(["text", text, echo]);
    } else {
      let output = document.createElement("div");
      output.classList.add("output");
      if (echo) {
        output.classList.add("echo");
      }
      if (!this.outputAnimationLength || echo) {
        output.textContent = text;
      } else {
        this.outputting = true;
        let delay = this.outputAnimationLength / text.length;
        const animateOutput = () => {
          output.textContent += text[0] || "";
          text = text.substring(1);
          if (text.length) {
            setTimeout(animateOutput, delay);
          } else {
            this.outputting = false;
            this.doNextOutput();
          }
        };
        setTimeout(animateOutput, this.outputDelay);
      }
      this.outputEl.appendChild(output);
      output.scrollIntoView({ behavior: "smooth" });
    }
  }

  private doNextOutput() {
    if (this.outputQueue.length) {
      let next = this.outputQueue[0];
      this.outputQueue = this.outputQueue.slice(1);
      let nextMode = next[0];
      let nextArgs = next.slice(1);
      if (nextMode == "text") {
        this.output(...nextArgs);
      } else {
        // image
        this.showElement(...nextArgs);
      }
    }
  }

  private setupInputListener() {
    this.inputEl.addEventListener("keypress", (event) => {
      let isEnter = event.code == "Enter";
      if (isEnter) {
        let input = this!.inputEl!.textContent!.replace(/\n$/, "");
        this.output(input, true);
        if (this.listener) {
          this.listener(input);
          this.listener = null;
        }
        this.inputWrap.classList.remove("active");
        setTimeout(() => {
          this.inputEl.textContent = "";
        }, 1); // after input fires
      }
    });
    this.placeholderEl.addEventListener("click", () => this.inputEl.focus());
  }
}
