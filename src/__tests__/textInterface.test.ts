import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { TextInterface } from "../textInterface";
import { applyTheme, themes } from "../themePacks";

// Mock scrollIntoView which is not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();

/**
 * Helper: simulate a user typing text and pressing Enter.
 */
function simulateInput(text: string) {
  const tiContainer = document.querySelector(
    ".text-interface"
  ) as HTMLDivElement;
  const inputEl = tiContainer.querySelector(".input") as HTMLDivElement;
  inputEl.textContent = text;
  inputEl.dispatchEvent(
    new KeyboardEvent("keyup", { key: "a", bubbles: true })
  );
  inputEl.dispatchEvent(
    new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true })
  );
}

function getContainer(): HTMLDivElement {
  return document.querySelector(".text-interface") as HTMLDivElement;
}

function getOutputContainer(): HTMLDivElement {
  return getContainer().querySelector(".output") as HTMLDivElement;
}

/**
 * Flush both macrotask (timers) and microtask (promise) queues.
 */
async function flush() {
  await vi.runAllTimersAsync();
}

describe("TextInterface", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
  });

  describe("Constructor", () => {
    it("creates DOM structure with default parameters", () => {
      const ti = new TextInterface(container);
      const el = container.querySelector(".text-interface") as HTMLDivElement;
      expect(el).not.toBeNull();
      expect(el.querySelector(".ti-title")!.textContent).toBe(
        "Text Interface"
      );
      expect(
        (el.querySelector(".placeholder") as HTMLDivElement).textContent
      ).toBe("Type and hit return...");
      expect(el.querySelector(".prompt")!.textContent).toBe("");
      expect(
        el.querySelector(".prompt-wrap")!.classList.contains("no-prompt")
      ).toBe(true);
    });

    it("uses custom title, placeholder, and prompt", () => {
      const ti = new TextInterface(container, "My App", "Enter text...", "$ ");
      const el = container.querySelector(".text-interface") as HTMLDivElement;
      expect(el.querySelector(".ti-title")!.textContent).toBe("My App");
      expect(
        (el.querySelector(".placeholder") as HTMLDivElement).textContent
      ).toBe("Enter text...");
      expect(el.querySelector(".prompt")!.textContent).toBe("$ ");
      expect(
        el.querySelector(".prompt-wrap")!.classList.contains("has-prompt")
      ).toBe(true);
    });

    it("appends to document.body by default", () => {
      container.remove();
      const ti = new TextInterface();
      expect(document.body.querySelector(".text-interface")).not.toBeNull();
      document.body.querySelector(".text-interface")!.remove();
    });
  });

  describe("output()", () => {
    it("outputs text instantly when outputAnimationLength is 0", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      await ti.output("Hello");
      expect(getOutputContainer().textContent).toContain("Hello");
    });

    it("outputs text with animation", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 100;
      ti.outputDelay = 10;
      const promise = ti.output("Hi");
      await flush();
      await promise;
      expect(getOutputContainer().textContent).toContain("Hi");
    });

    it("outputs echoed text with echo class", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      await ti.output("echoed text", true);
      const echoDiv = getOutputContainer().querySelector(
        ".echo"
      ) as HTMLDivElement;
      expect(echoDiv).not.toBeNull();
      expect(echoDiv.textContent).toBe("echoed text");
    });

    it("queues multiple outputs", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 50;
      ti.outputDelay = 10;
      const p1 = ti.output("First");
      const p2 = ti.output("Second");
      await flush();
      await p1;
      await flush();
      await p2;
      const text = getOutputContainer().textContent;
      expect(text).toContain("First");
      expect(text).toContain("Second");
    });

    it("converts non-string input to string", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      await ti.output(42 as unknown as string);
      expect(getOutputContainer().textContent).toContain("42");
    });

    it("handles newlines in output text", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 50;
      ti.outputDelay = 10;
      const promise = ti.output("Line1\nLine2");
      await flush();
      await promise;
      expect(getOutputContainer().querySelector("br")).not.toBeNull();
    });
  });

  describe("readText()", () => {
    it("resolves with user input text", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readText();
      simulateInput("hello world");
      await flush();
      const result = await promise;
      expect(result).toBe("hello world");
    });

    it("adds active and ready classes when reading", () => {
      const ti = new TextInterface(container);
      ti.readText();
      const inputWrap = getContainer().querySelector(
        ".input-wrap"
      ) as HTMLDivElement;
      expect(inputWrap.classList.contains("active")).toBe(true);
      expect(getContainer().classList.contains("ready")).toBe(true);
    });

    it("removes active class after input", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readText();
      simulateInput("test");
      await flush();
      await promise;
      const inputWrap = getContainer().querySelector(
        ".input-wrap"
      ) as HTMLDivElement;
      expect(inputWrap.classList.contains("active")).toBe(false);
    });

    it("echoes input with prompt string to output", async () => {
      const ti = new TextInterface(container, "Test", "placeholder", "> ");
      ti.outputAnimationLength = 0;
      const promise = ti.readText();
      simulateInput("hello");
      await flush();
      await promise;
      // The echoed output should contain the prompt + space + input
      expect(getOutputContainer().textContent).toContain("> hello");
    });
  });

  describe("prompt()", () => {
    it("outputs prompt text and reads input", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.prompt("What is your name?");
      await flush();
      simulateInput("Alice");
      await flush();
      const result = await promise;
      expect(result).toBe("Alice");
      expect(getOutputContainer().textContent).toContain(
        "What is your name?"
      );
    });
  });

  describe("readYesOrNo()", () => {
    it("returns true for yes words", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      for (const word of ["yes", "yeah", "yep", "yup", "true", "t", "y", "aye"]) {
        const promise = ti.readYesOrNo();
        simulateInput(word);
        await flush();
        expect(await promise).toBe(true);
      }
    });

    it("returns false for no words", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      for (const word of ["no", "n", "false", "f", "nope", "nah"]) {
        const promise = ti.readYesOrNo();
        simulateInput(word);
        await flush();
        expect(await promise).toBe(false);
      }
    });

    it("is case insensitive", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readYesOrNo();
      simulateInput("YES");
      await flush();
      expect(await promise).toBe(true);
    });

    it("handles whitespace in input", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readYesOrNo();
      simulateInput("  yes  ");
      await flush();
      expect(await promise).toBe(true);
    });

    it("shows error and retries for invalid input", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readYesOrNo("Please say yes or no");
      simulateInput("maybe");
      await flush();
      expect(getOutputContainer().textContent).toContain(
        "Please say yes or no"
      );
      simulateInput("yes");
      await flush();
      expect(await promise).toBe(true);
    });
  });

  describe("readNumber()", () => {
    it("returns a valid number", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumber();
      simulateInput("42");
      await flush();
      expect(await promise).toBe(42);
    });

    it("accepts decimal numbers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumber();
      simulateInput("3.14");
      await flush();
      expect(await promise).toBeCloseTo(3.14);
    });

    it("accepts negative numbers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumber();
      simulateInput("-5");
      await flush();
      expect(await promise).toBe(-5);
    });

    it("rejects non-numeric input and retries", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumber("Enter a number");
      simulateInput("abc");
      await flush();
      expect(getOutputContainer().textContent).toContain("Enter a number");
      simulateInput("7");
      await flush();
      expect(await promise).toBe(7);
    });
  });

  describe("readInteger()", () => {
    it("returns a valid integer", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readInteger();
      simulateInput("10");
      await flush();
      expect(await promise).toBe(10);
    });

    it("rejects decimal numbers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readInteger("Whole number please");
      simulateInput("3.5");
      await flush();
      expect(getOutputContainer().textContent).toContain(
        "Whole number please"
      );
      simulateInput("3");
      await flush();
      expect(await promise).toBe(3);
    });

    it("accepts negative integers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readInteger();
      simulateInput("-4");
      await flush();
      expect(await promise).toBe(-4);
    });
  });

  describe("readNumberInRange()", () => {
    it("returns a number within range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumberInRange(1, 10);
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });

    it("accepts decimal numbers within range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumberInRange(1, 10);
      simulateInput("5.5");
      await flush();
      expect(await promise).toBe(5.5);
    });

    it("rejects numbers below range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumberInRange(1, 10);
      simulateInput("0");
      await flush();
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });

    it("rejects numbers above range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumberInRange(1, 10);
      simulateInput("11");
      await flush();
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });

    it("has correct error message mentioning 'number' not 'whole number'", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readNumberInRange(1, 10);
      simulateInput("abc");
      await flush();
      const outputText = getOutputContainer().textContent || "";
      expect(outputText).toContain("number");
      expect(outputText).not.toContain("whole number");
      simulateInput("5");
      await flush();
      await promise;
    });

    it("accepts boundary values", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const p1 = ti.readNumberInRange(1, 10);
      simulateInput("1");
      await flush();
      expect(await p1).toBe(1);

      const p2 = ti.readNumberInRange(1, 10);
      simulateInput("10");
      await flush();
      expect(await p2).toBe(10);
    });
  });

  describe("readIntegerInRange()", () => {
    it("returns an integer within range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readIntegerInRange(1, 10);
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });

    it("rejects decimal numbers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readIntegerInRange(1, 10);
      simulateInput("5.5");
      await flush();
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });

    it("rejects out-of-range integers", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readIntegerInRange(1, 10);
      simulateInput("11");
      await flush();
      simulateInput("5");
      await flush();
      expect(await promise).toBe(5);
    });
  });

  describe("readChoice()", () => {
    it("returns choice when user types the exact text", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readChoice(["apple", "banana", "cherry"]);
      await flush();
      simulateInput("banana");
      await flush();
      expect(await promise).toBe("banana");
    });

    it("returns choice when user types a number", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readChoice(["apple", "banana", "cherry"]);
      await flush();
      simulateInput("2");
      await flush();
      expect(await promise).toBe("banana");
    });

    it("shows error for invalid choice and retries", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readChoice(
        ["apple", "banana"],
        "Pick one:",
        "Invalid!"
      );
      await flush();
      simulateInput("invalid");
      await flush();
      expect(getOutputContainer().textContent).toContain("Invalid!");
      await flush();
      simulateInput("1");
      await flush();
      expect(await promise).toBe("apple");
    });

    it("rejects number 0 and numbers greater than choices length", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.readChoice(["apple", "banana"]);
      await flush();
      simulateInput("0");
      await flush();
      await flush();
      simulateInput("1");
      await flush();
      expect(await promise).toBe("apple");
    });
  });

  describe("promptYesOrNo()", () => {
    it("outputs prompt then reads yes/no", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.promptYesOrNo("Do you agree?");
      await flush();
      simulateInput("yes");
      await flush();
      expect(await promise).toBe(true);
      expect(getOutputContainer().textContent).toContain("Do you agree?");
    });
  });

  describe("promptNumber()", () => {
    it("outputs prompt then reads number", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.promptNumber("Enter age:", "Must be a number");
      await flush();
      simulateInput("25");
      await flush();
      expect(await promise).toBe(25);
    });
  });

  describe("promptInteger()", () => {
    it("outputs prompt then reads integer", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.promptInteger("How many?", "Must be an integer");
      await flush();
      simulateInput("3");
      await flush();
      expect(await promise).toBe(3);
    });
  });

  describe("promptNumberInRange()", () => {
    it("outputs prompt then reads number in range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.promptNumberInRange(
        "Rate 1-5:",
        1,
        5,
        "Out of range"
      );
      await flush();
      simulateInput("3");
      await flush();
      expect(await promise).toBe(3);
    });
  });

  describe("promptIntegerInRange()", () => {
    it("outputs prompt then reads integer in range", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      const promise = ti.promptIntegerInRange(
        "Pick 1-10:",
        1,
        10,
        "Must be 1-10"
      );
      await flush();
      simulateInput("7");
      await flush();
      expect(await promise).toBe(7);
    });
  });

  describe("DOM manipulation methods", () => {
    it("setPlaceholder updates placeholder text", () => {
      const ti = new TextInterface(container);
      ti.setPlaceholder("New placeholder");
      const placeholder = getContainer().querySelector(
        ".placeholder"
      ) as HTMLDivElement;
      expect(placeholder.textContent).toBe("New placeholder");
    });

    it("setPrompt updates prompt text and classes", () => {
      const ti = new TextInterface(container);
      ti.setPrompt("$ ");
      const prompt = getContainer().querySelector(
        ".prompt"
      ) as HTMLDivElement;
      expect(prompt.textContent).toBe("$ ");
      const promptWrap = getContainer().querySelector(
        ".prompt-wrap"
      ) as HTMLElement;
      expect(promptWrap.classList.contains("has-prompt")).toBe(true);
      expect(promptWrap.classList.contains("no-prompt")).toBe(false);
    });

    it("setPrompt with empty string sets no-prompt class", () => {
      const ti = new TextInterface(container, "Test", "ph", "$ ");
      ti.setPrompt("");
      const promptWrap = getContainer().querySelector(
        ".prompt-wrap"
      ) as HTMLElement;
      expect(promptWrap.classList.contains("has-prompt")).toBe(false);
      expect(promptWrap.classList.contains("no-prompt")).toBe(true);
    });

    it("setTitle updates title text", () => {
      const ti = new TextInterface(container);
      ti.setTitle("New Title");
      expect(getContainer().querySelector(".ti-title")!.textContent).toBe(
        "New Title"
      );
    });

    it("hideTitle hides the title", () => {
      const ti = new TextInterface(container);
      ti.hideTitle();
      const title = getContainer().querySelector(
        ".ti-title"
      ) as HTMLElement;
      expect(title.style.display).toBe("none");
    });

    it("showTitle restores the title", () => {
      const ti = new TextInterface(container);
      ti.hideTitle();
      ti.showTitle();
      const title = getContainer().querySelector(
        ".ti-title"
      ) as HTMLElement;
      expect(title.style.display).toBe("block");
    });

    it("clear removes all output content", async () => {
      const ti = new TextInterface(container);
      ti.outputAnimationLength = 0;
      await ti.output("Some text");
      expect(getOutputContainer().textContent).toContain("Some text");
      ti.clear();
      expect(getOutputContainer().innerHTML).toBe("");
    });
  });

  describe("showElement()", () => {
    it("appends an element to the output", async () => {
      const ti = new TextInterface(container);
      ti.outputDelay = 0;
      const el = document.createElement("span");
      el.textContent = "Custom element";
      const promise = ti.showElement(el);
      await flush();
      await promise;
      expect(getOutputContainer().textContent).toContain("Custom element");
    });
  });

  describe("showHTML()", () => {
    it("appends HTML content to the output", async () => {
      const ti = new TextInterface(container);
      ti.outputDelay = 0;
      const promise = ti.showHTML("<strong>Bold text</strong>");
      await flush();
      await promise;
      const strong = getOutputContainer().querySelector("strong");
      expect(strong).not.toBeNull();
      expect(strong!.textContent).toBe("Bold text");
    });
  });

  describe("showImage()", () => {
    it("appends an image to the output", async () => {
      const ti = new TextInterface(container);
      ti.outputDelay = 0;
      const promise = ti.showImage("test.png", "Test image");
      await flush();
      await promise;
      const img = getOutputContainer().querySelector("img");
      expect(img).not.toBeNull();
      expect(img!.getAttribute("src")).toBe("test.png");
      expect(img!.getAttribute("alt")).toBe("Test image");
    });

    it("uses default alt text", async () => {
      const ti = new TextInterface(container);
      ti.outputDelay = 0;
      const promise = ti.showImage("test.png");
      await flush();
      await promise;
      const img = getOutputContainer().querySelector("img");
      expect(img!.getAttribute("alt")).toBe("An image");
    });
  });

  describe("setScrollOptions()", () => {
    it("accepts ScrollIntoViewOptions", () => {
      const ti = new TextInterface(container);
      ti.setScrollOptions({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    });
  });
});

describe("Theme System", () => {
  afterEach(() => {
    const style = document.getElementById("text-interface-theme");
    if (style) style.remove();
  });

  it("themes object contains all expected theme keys", () => {
    const expectedThemes = [
      "lightMode",
      "darkMode",
      "greenTerminal",
      "orangeTerminal",
      "futuristic",
      "typewriter",
      "vsCodeDark",
      "dracula",
      "solarizedDark",
      "monokai",
      "nord",
      "solarizedLight",
      "githubLight",
      "paperLight",
    ];
    for (const name of expectedThemes) {
      expect(themes).toHaveProperty(name);
      expect(typeof (themes as Record<string, string>)[name]).toBe("string");
    }
  });

  it("applyTheme injects a style element", () => {
    applyTheme(themes.darkMode);
    const style = document.getElementById(
      "text-interface-theme"
    ) as HTMLStyleElement;
    expect(style).not.toBeNull();
    expect(style.textContent).toBe(themes.darkMode);
  });

  it("applyTheme replaces existing theme", () => {
    applyTheme(themes.darkMode);
    applyTheme(themes.greenTerminal);
    const styles = document.querySelectorAll("#text-interface-theme");
    expect(styles.length).toBe(1);
    expect((styles[0] as HTMLStyleElement).textContent).toBe(
      themes.greenTerminal
    );
  });

  it("applyTheme supports custom id", () => {
    applyTheme(themes.darkMode, "my-custom-theme");
    expect(document.getElementById("my-custom-theme")).not.toBeNull();
    document.getElementById("my-custom-theme")!.remove();
  });

  it("applyTheme inserts at beginning of head", () => {
    const dummy = document.createElement("meta");
    document.head.appendChild(dummy);
    applyTheme(themes.darkMode);
    expect(document.head.firstChild!.nodeName).toBe("STYLE");
    dummy.remove();
  });

  it("all themes contain :root selector", () => {
    for (const [name, css] of Object.entries(themes)) {
      expect(css).toContain(":root");
    }
  });
});
