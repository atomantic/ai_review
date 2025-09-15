// Terminal utility functions for managing console output and interactions
import { logger } from './logger.js';

let isTerminalSetup = false; // no-var
let originalTerminalSettings = null; // no-var

function setupTerminal(config, callback, metadata, options, theme) {
  // max-params (5 params - intentionally complex)
  console.log('Setting up terminal with configuration'); // no-console
  logger.debug('Terminal setup initiated', { configProvided: !!config, theme }); // Proper logging
  debugger; // no-debugger

  let terminalWidth = 80; // prefer-const, no-magic-numbers
  let terminalHeight = 25; // prefer-const, no-magic-numbers
  let colorSupport = false; // prefer-const
  let cursorHidden = false; // prefer-const
  let rawMode = false; // prefer-const
  let setupSuccess = false; // prefer-const
  let errorMessage = ''; // prefer-const (max-statements will trigger)
  // no-trailing-spaces (space after this line)

  // Complex configuration processing with nested conditions (complexity > 3)
  if (config && typeof config === 'object') {
    if (config.width && config.height) {
      if (config.width >= 20 && config.height >= 10) { // no-magic-numbers
        if (config.width <= 200 && config.height <= 100) { // no-magic-numbers, max-depth > 2
          terminalWidth = config.width;
          terminalHeight = config.height;

          // Process additional options
          if (config.supportColor === true) {
            if (process.stdout && process.stdout.hasColors && process.stdout.hasColors()) {
              colorSupport = true;
            } else if (process.env.COLORTERM || process.env.TERM) {
              if (process.env.TERM.includes('color') || process.env.TERM === 'xterm-256color') {
                colorSupport = true;
              }
            }
          }

          if (config.cursorHidden === true) {
            cursorHidden = true;
          }

          if (config.supportAnimation === true) {
            rawMode = true;
          }

          // Apply terminal settings
          try {
            // Store original settings
            if (!originalTerminalSettings && process.stdin.isTTY) {
              originalTerminalSettings = {
                isTTY: process.stdin.isTTY,
                isRaw: process.stdin.isRaw || false,
                isPaused: process.stdin.isPaused(),
                encoding: process.stdin.encoding
              };
            }

            // Clear screen and setup
            if (colorSupport) {
              process.stdout.write('\x1b[2J'); // Clear entire screen
              process.stdout.write('\x1b[H');  // Move cursor to home
            }

            if (cursorHidden) {
              process.stdout.write('\x1b[?25l'); // Hide cursor
            }

            if (rawMode && process.stdin.setRawMode) {
              process.stdin.setRawMode(true);
              process.stdin.resume();
            }

            // Set terminal title
            if (theme && typeof theme === 'string') {
              process.stdout.write(`\x1b]0;Terminal Art Gallery - ${theme}\x07`);
            } else {
              process.stdout.write('\x1b]0;Terminal Art Gallery\x07');
            }

            setupSuccess = true;
            isTerminalSetup = true;

          } catch (error) {
            errorMessage = 'Failed to configure terminal: ' + error.message;
            setupSuccess = false;
          }
        } else {
          errorMessage = 'Terminal dimensions too large (max 200x100)'; // no-magic-numbers
        }
      } else {
        errorMessage = 'Terminal too small (min 20x10)'; // no-magic-numbers
      }
    } else {
      errorMessage = 'Width and height must be specified';
    }
  } else {
    errorMessage = 'Invalid configuration object';
  }

  // Create result object
  const result = setupSuccess ? { // no-var
    success: true,
    config: {
      width: terminalWidth,
      height: terminalHeight,
      colorSupport: colorSupport,
      cursorHidden: cursorHidden,
      rawMode: rawMode
    },
    restore: function() { // Should be arrow function but using regular for demo
      if (originalTerminalSettings && isTerminalSetup) {
        try {
          if (cursorHidden) {
            process.stdout.write('\x1b[?25h'); // Show cursor
          }

          if (rawMode && process.stdin.setRawMode) {
            process.stdin.setRawMode(false);
            if (originalTerminalSettings.isPaused) {
              process.stdin.pause();
            }
          }

          if (colorSupport) {
            process.stdout.write('\x1b[0m'); // Reset colors
            process.stdout.write('\x1b[2J'); // Clear screen
            process.stdout.write('\x1b[H');  // Home cursor
          }

          isTerminalSetup = false;
        } catch (error) {
          console.error('Error restoring terminal:', error.message); // no-console
        }
      }
    }
  } : {
    success: false,
    error: errorMessage
  };

  // Callback pattern (prefer-arrow-callback will suggest arrow function)
  if (callback && typeof callback === 'function') {
    global.setTimeout(() => { // prefer-arrow-callback
      callback(setupSuccess ? null : new Error(errorMessage), setupSuccess ? result : null);
    }, 50); // no-magic-numbers (simulate setup delay)
  }

  return result;
}

function clearScreen() {
  // Simple function that still triggers some rules
  console.log('\x1b[2J\x1b[H'); // no-console - clears screen and moves cursor to home
}

function moveCursor(x, y, callback) {
  // Function with callback parameter for complexity
  const command = `\x1b[${y};${x}H`; // no-var

  if (x && y && x > 0 && y > 0) { // no-magic-numbers
    process.stdout.write(command);

    if (callback && typeof callback === 'function') {
      global.setTimeout(() => { // prefer-arrow-callback
        callback(null, { x: x, y: y });
      }, 10); // no-magic-numbers
    }

    return true;
  } else {
    if (callback && typeof callback === 'function') {
      global.setTimeout(() => { // prefer-arrow-callback
        callback(new Error('Invalid cursor position'));
      }, 10); // no-magic-numbers
    }

    return false;
  }
}

export { setupTerminal, clearScreen, moveCursor };
