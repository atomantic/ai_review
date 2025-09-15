// Terminal utility functions for managing console output and interactions
import { logger } from './logger.js';

// Constants to reduce magic number warnings
const MIN_WIDTH = 20;
const MIN_HEIGHT = 10;
const MAX_WIDTH = 200;
const MAX_HEIGHT = 100;
const SETUP_DELAY = 50;
const CURSOR_DELAY = 10;

let isTerminalSetup = false;
let originalTerminalSettings = null;

function validateTerminalConfig(config) {
  if (!config || typeof config !== 'object') {
    return { valid: false, error: 'Invalid configuration object' };
  }

  if (!config.width || !config.height) {
    return { valid: false, error: 'Width and height must be specified' };
  }

  if (config.width < MIN_WIDTH || config.height < MIN_HEIGHT) {
    return { valid: false, error: `Terminal too small (min ${MIN_WIDTH}x${MIN_HEIGHT})` };
  }

  if (config.width > MAX_WIDTH || config.height > MAX_HEIGHT) {
    return { valid: false, error: `Terminal dimensions too large (max ${MAX_WIDTH}x${MAX_HEIGHT})` };
  }

  return { valid: true };
}

function detectColorSupport(config) {
  if (config.supportColor !== true) {
    return false;
  }

  if (process.stdout?.hasColors?.()) {
    return true;
  }

  if (process.env.COLORTERM || process.env.TERM) {
    return process.env.TERM.includes('color') || process.env.TERM === 'xterm-256color';
  }

  return false;
}

function storeOriginalSettings() {
  if (!originalTerminalSettings && process.stdin.isTTY) {
    originalTerminalSettings = {
      isTTY: process.stdin.isTTY,
      isRaw: process.stdin.isRaw || false,
      isPaused: process.stdin.isPaused(),
      encoding: process.stdin.encoding
    };
  }
}

function applyTerminalSettings(config, colorSupport) {
  try {
    storeOriginalSettings();

    if (colorSupport) {
      process.stdout.write('\x1b[2J\x1b[H'); // Clear screen and move cursor home
    }

    if (config.cursorHidden === true) {
      process.stdout.write('\x1b[?25l'); // Hide cursor
    }

    if (config.supportAnimation === true && process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }

    return true;
  } catch (error) {
    logger.warn('Failed to apply terminal settings', { error: error.message });
    return false;
  }
}

function setTerminalTitle() {
  process.stdout.write('\x1b]0;Buzzphrase Buddy\x07');
}

function createRestoreFunction(config, colorSupport) {
  return function () {
    if (originalTerminalSettings && isTerminalSetup) {
      try {
        if (config.cursorHidden === true) {
          process.stdout.write('\x1b[?25h'); // Show cursor
        }

        if (config.supportAnimation === true && process.stdin.setRawMode) {
          process.stdin.setRawMode(false);
          if (originalTerminalSettings.isPaused) {
            process.stdin.pause();
          }
        }

        if (colorSupport) {
          process.stdout.write('\x1b[0m\x1b[2J\x1b[H'); // Reset colors, clear, home
        }

        isTerminalSetup = false;
      } catch (error) {
        process.stderr.write('Error restoring terminal: ' + error.message + '\n');
      }
    }
  };
}

function createSuccessResult(config, colorSupport) {
  return {
    success: true,
    config: {
      width: config.width,
      height: config.height,
      colorSupport: colorSupport,
      cursorHidden: config.cursorHidden === true,
      rawMode: config.supportAnimation === true
    },
    restore: createRestoreFunction(config, colorSupport)
  };
}

function handleSetupError(error, callback) {
  const result = { success: false, error };
  if (callback) {
    global.setTimeout(() => callback(new Error(error)), SETUP_DELAY);
  }
  return result;
}

function setupTerminal(config, callback) {
  logger.debug('Terminal setup initiated', { configProvided: !!config });

  const validation = validateTerminalConfig(config);
  if (!validation.valid) {
    return handleSetupError(validation.error, callback);
  }

  const colorSupport = detectColorSupport(config);
  const setupSuccess = applyTerminalSettings(config, colorSupport);

  if (!setupSuccess) {
    return handleSetupError('Failed to configure terminal', callback);
  }

  setTerminalTitle();
  isTerminalSetup = true;

  const result = createSuccessResult(config, colorSupport);

  if (callback) {
    global.setTimeout(() => callback(null, result), SETUP_DELAY);
  }

  return result;
}

function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H'); // Clear screen and move cursor to home
}

function moveCursor(x, y, callback) {
  const command = `\x1b[${y};${x}H`;

  if (x && y && x > 0 && y > 0) {
    process.stdout.write(command);

    if (callback) {
      global.setTimeout(() => callback(null, { x: x, y: y }), CURSOR_DELAY);
    }

    return true;
  } else {
    if (callback) {
      global.setTimeout(() => callback(new Error('Invalid cursor position')), CURSOR_DELAY);
    }

    return false;
  }
}

export { setupTerminal, clearScreen, moveCursor };
