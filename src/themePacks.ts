export const lightMode = `
:root {
  --ti-offwhite: #666;
  --ti-grey: #999;
  --ti-black: #f8f9fa;
  --ti-white: #212529;
  --ti-font: system-ui, -apple-system, sans-serif;
  --ti-output-font: Consolas, Monaco, monospace;
  --ti-echo-color: #6c757d;
  --ti-input-color: #495057;
  --ti-caret-color: #007bff;
  --ti-custom-caret: "|";
  --ti-scroll-thumb-color: #ced4da;
  --ti-scroll-thumb-hover-color: #adb5bd;
  --ti-scroll-thumb-active-color: #6c757d;
  --ti-focus-outline: none;
  --ti-focus-border-bottom: 3px solid #007bff;
}
`;

export const darkMode = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ti-offwhite: #aaa;
  --ti-grey: #888;
  --ti-black: #1a1a1a;
  --ti-white: #e0e0e0;
  --ti-font: Inter, system-ui, sans-serif;
  --ti-output-font: JetBrains Mono, Consolas, monospace;
  --ti-echo-color: #888;
  --ti-input-color: #bbb;
  --ti-caret-color: #00d4aa;
  --ti-custom-caret: "▋";
  --ti-scroll-thumb-color: #444;
  --ti-scroll-thumb-hover-color: #666;
  --ti-scroll-thumb-active-color: #888;
  --ti-focus-border-bottom: 2px solid #00d4aa;
  --ti-focus-outline: none;
}
`;

export const greenTerminal = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --ti-offwhite: #00ff00;
  --ti-grey: #00aa00;
  --ti-black: #000000;
  --ti-white: #00ff00;
  --ti-font: 'IBM Plex Mono', 'Courier New', monospace;
  --ti-output-font: 'IBM Plex Mono', 'Courier New', monospace;
  --ti-echo-color: #00cc00;
  --ti-input-color: #00ff00;
  --ti-caret-color: #00ff00;
  --ti-custom-caret: "█";
  --ti-font-size: 18px;
  --ti-scroll-thumb-color: #00aa00;
  --ti-scroll-thumb-hover-color: #00cc00;
  --ti-scroll-thumb-active-color: #00ff00;
  --ti-max-width: 80em;
  --ti-custom-caret: "█";
  --ti-focus-outline: none;
  --ti-output-spacing: 0.2em;
}
`;

export const orangeTerminal = `
@import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap');

:root {
  --ti-offwhite: #ff8c42;
  --ti-grey: #d2691e;
  --ti-black: #1a0f0a;
  --ti-white: #ffa500;
  --ti-font: 'Anonymous Pro', 'Monaco', monospace;
  --ti-output-font: 'Anonymous Pro', 'Monaco', monospace;
  --ti-echo-color: #ff7f00;
  --ti-input-color: #ffab40;
  --ti-caret-color: #ffa500;
  --ti-custom-caret: "▎";
  --ti-scroll-thumb-color: #d2691e;
  --ti-scroll-thumb-hover-color: #ff8c42;
  --ti-scroll-thumb-active-color: #ffa500;
  --ti-max-width: 80em;
  --ti-custom-caret: "█";
  --ti-focus-outline: none;
}
`;

export const futuristic = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Fira+Code:wght@400;500&display=swap');

:root {
  --ti-offwhite: #64ffda;
  --ti-grey: #37474f;
  --ti-black: #0d1117;
  --ti-white: #e1f5fe;
  --ti-font: Orbitron, monospace;
  --ti-output-font: Fira Code, monospace;
  --ti-echo-color: #4fc3f7;
  --ti-input-color: #64ffda;
  --ti-caret-color: #ff4081;
  --ti-custom-caret: "▮";
  --ti-font-size: 16px;
  --ti-max-width: 32em;
  --ti-scroll-thumb-color: #263238;
  --ti-scroll-thumb-hover-color: #37474f;
  --ti-scroll-thumb-active-color: #455a64;
}
`;

export const typewriter = `
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');

:root {
  --ti-offwhite: #8b7355;
  --ti-grey: #a0926b;
  --ti-black: #f4f1e8;
  --ti-white: #2c2416;
  --ti-font: 'Special Elite', 'Courier Prime', monospace;
  --ti-output-font: 'Special Elite', 'Courier Prime', monospace;
  --ti-echo-color: #6b5b47;
  --ti-input-color: #2c2416;
  --ti-caret-color: #2c2416;
  --ti-custom-caret: "|";
  --ti-font-size: 24px;
  --ti-max-width: 40em;
  --ti-scroll-thumb-color: #d4c4a8;
  --ti-scroll-thumb-hover-color: #c7b299;
  --ti-scroll-thumb-active-color: #a0926b;
  --ti-focus-outline: none;
  --ti-focus-border-bottom: 2px solid #2c2416;
  --ti-output-spacing: 0.8em;
}
`;

/**
 * Apply a theme by injecting CSS into the document head at the beginning
 * This ensures user styles can override theme styles
 * @param themeCSS - The CSS string containing :root variables
 * @param id - Optional ID for the style element (defaults to 'text-interface-theme')
 */
export function applyTheme(themeCSS: string, id = "text-interface-theme") {
  // Remove existing theme if it exists
  const existingTheme = document.getElementById(id);
  if (existingTheme) {
    existingTheme.remove();
  }

  // Create new theme style element
  const style = document.createElement("style");
  style.id = id;
  style.textContent = themeCSS;

  // Insert at the beginning of head so user styles can override
  const head = document.head;
  if (head.firstChild) {
    head.insertBefore(style, head.firstChild);
  } else {
    head.appendChild(style);
  }
}

export const vsCodeDark = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

:root {
  --ti-offwhite: #858585;
  --ti-grey: #3c3c3c;
  --ti-black: #1e1e1e;
  --ti-white: #d4d4d4;
  --ti-font: 'Fira Code', 'Consolas', monospace;
  --ti-output-font: 'Fira Code', 'Consolas', monospace;
  --ti-echo-color: #569cd6;
  --ti-input-color: #9cdcfe;
  --ti-caret-color: #ffffff;
  --ti-custom-caret: "|";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #424242;
  --ti-scroll-thumb-hover-color: #4f4f4f;
  --ti-scroll-thumb-active-color: #6f6f6f;
  --ti-focus-outline: 1px solid #007acc;
  --ti-output-spacing: 0.3em;
}
`;

export const dracula = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

:root {
  --ti-offwhite: #6272a4;
  --ti-grey: #44475a;
  --ti-black: #282a36;
  --ti-white: #f8f8f2;
  --ti-font: 'Fira Code', monospace;
  --ti-output-font: 'Fira Code', monospace;
  --ti-echo-color: #8be9fd;
  --ti-input-color: #50fa7b;
  --ti-caret-color: #ff79c6;
  --ti-custom-caret: "▋";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #44475a;
  --ti-scroll-thumb-hover-color: #6272a4;
  --ti-scroll-thumb-active-color: #bd93f9;
  --ti-focus-outline: 2px solid #ff79c6;
  --ti-output-spacing: 0.4em;
}
`;

export const solarizedDark = `
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

:root {
  --ti-offwhite: #586e75;
  --ti-grey: #073642;
  --ti-black: #002b36;
  --ti-white: #839496;
  --ti-font: 'Source Code Pro', monospace;
  --ti-output-font: 'Source Code Pro', monospace;
  --ti-echo-color: #2aa198;
  --ti-input-color: #b58900;
  --ti-caret-color: #dc322f;
  --ti-custom-caret: "█";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #073642;
  --ti-scroll-thumb-hover-color: #586e75;
  --ti-scroll-thumb-active-color: #839496;
  --ti-focus-outline: 1px solid #268bd2;
  --ti-output-spacing: 0.5em;
}
`;

export const monokai = `
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

:root {
  --ti-offwhite: #75715e;
  --ti-grey: #49483e;
  --ti-black: #272822;
  --ti-white: #f8f8f2;
  --ti-font: 'Ubuntu Mono', monospace;
  --ti-output-font: 'Ubuntu Mono', monospace;
  --ti-echo-color: #66d9ef;
  --ti-input-color: #a6e22e;
  --ti-caret-color: #f92672;
  --ti-custom-caret: "▎";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #49483e;
  --ti-scroll-thumb-hover-color: #75715e;
  --ti-scroll-thumb-active-color: #a6e22e;
  --ti-focus-outline: 2px solid #f92672;
  --ti-output-spacing: 0.4em;
}
`;

export const nord = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ti-offwhite: #4c566a;
  --ti-grey: #3b4252;
  --ti-black: #2e3440;
  --ti-white: #d8dee9;
  --ti-font: 'JetBrains Mono', monospace;
  --ti-output-font: 'JetBrains Mono', monospace;
  --ti-echo-color: #81a1c1;
  --ti-input-color: #88c0d0;
  --ti-caret-color: #5e81ac;
  --ti-custom-caret: "▋";
  --ti-font-size: 18px;
  --ti-scroll-thumb-color: #3b4252;
  --ti-scroll-thumb-hover-color: #434c5e;
  --ti-scroll-thumb-active-color: #4c566a;
  --ti-focus-outline: 1px solid #5e81ac;
  --ti-output-spacing: 0.5em;
}
`;

export const solarizedLight = `
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

:root {
  --ti-offwhite: #93a1a1;
  --ti-grey: #eee8d5;
  --ti-black: #fdf6e3;
  --ti-white: #657b83;
  --ti-font: 'Source Code Pro', monospace;
  --ti-output-font: 'Source Code Pro', monospace;
  --ti-echo-color: #2aa198;
  --ti-input-color: #b58900;
  --ti-caret-color: #dc322f;
  --ti-custom-caret: "█";
  --ti-font-size: 18px;
  --ti-scroll-thumb-color: #eee8d5;
  --ti-scroll-thumb-hover-color: #93a1a1;
  --ti-scroll-thumb-active-color: #657b83;
  --ti-focus-outline: 1px solid #268bd2;
  --ti-output-spacing: 0.5em;
}
`;

export const githubLight = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ti-offwhite: #6a737d;
  --ti-grey: #e1e4e8;
  --ti-black: #ffffff;
  --ti-white: #24292e;
  --ti-font: 'JetBrains Mono', 'SFMono-Regular', monospace;
  --ti-output-font: 'JetBrains Mono', 'SFMono-Regular', monospace;
  --ti-echo-color: #0366d6;
  --ti-input-color: #28a745;
  --ti-caret-color: #d73a49;
  --ti-custom-caret: "|";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #e1e4e8;
  --ti-scroll-thumb-hover-color: #c6cbd1;
  --ti-scroll-thumb-active-color: #959da5;
  --ti-focus-outline: 2px solid #0366d6;
  --ti-output-spacing: 0.4em;
}
`;

export const paperLight = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');

:root {
  --ti-offwhite: #9e9e9e;
  --ti-grey: #eeeeee;
  --ti-black: #fafafa;
  --ti-white: #212121;
  --ti-font: 'Roboto Mono', monospace;
  --ti-output-font: 'Roboto Mono', monospace;
  --ti-echo-color: #1976d2;
  --ti-input-color: #388e3c;
  --ti-caret-color: #d32f2f;
  --ti-custom-caret: "▎";
  --ti-font-size: 16px;
  --ti-scroll-thumb-color: #eeeeee;
  --ti-scroll-thumb-hover-color: #e0e0e0;
  --ti-scroll-thumb-active-color: #bdbdbd;
  --ti-focus-outline: 1px solid #1976d2;
  --ti-output-spacing: 0.6em;
}
`;

export const themes = {
  lightMode,
  darkMode,
  greenTerminal,
  orangeTerminal,
  futuristic,
  typewriter,
  vsCodeDark,
  dracula,
  solarizedDark,
  monokai,
  nord,
  solarizedLight,
  githubLight,
  paperLight,
};
