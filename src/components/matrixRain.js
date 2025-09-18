// Matrix Rain Effect Component - creates falling character animation
const matrixChars =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// Configuration constants organized by category
const CONFIG = {
  BOUNDS: {
    MIN_CHARS: 5,
    MAX_CHARS: 200,
    MIN_DENSITY: 0.1,
    MAX_DENSITY: 1.0,
    MIN_SPEED: 1,
    MAX_SPEED: 10,
    MAX_COLORS: 5
  },
  ANIMATION: {
    TRAIL_LENGTH: 3,
    COLUMN_WIDTH: 2,
    HEIGHT_DIVISOR: 3,
    RANDOM_DROPS: 5,
    SPEED_VARIANCE: 2,
    SCREEN_BUFFER: 5,
    RESET_OFFSET: 10,
    ANIMATION_DELAY: 100,
    SPEED_MULTIPLIER: 10,
    FRAME_RATE: 1000,
    INITIAL_HEIGHT_RANGE: 100
  },
  DEFAULTS: {
    DENSITY: 0.5,
    SPEED: 1,
    TRAIL_OPACITY_STEP: 0.3
  }
};

/**
 * Validates character string input
 * @param {string} characters - Character string to validate
 * @returns {boolean} True if valid
 */
const validateCharacters = (characters) => {
  return characters &&
    typeof characters === 'string' &&
    characters.length > CONFIG.BOUNDS.MIN_CHARS &&
    characters.length < CONFIG.BOUNDS.MAX_CHARS;
};

/**
 * Validates density value
 * @param {number} density - Density value to validate
 * @returns {boolean} True if valid
 */
const validateDensity = (density) => {
  return density >= CONFIG.BOUNDS.MIN_DENSITY && density <= CONFIG.BOUNDS.MAX_DENSITY;
};

/**
 * Validates speed value
 * @param {number} speed - Speed value to validate
 * @returns {boolean} True if valid
 */
const validateSpeed = (speed) => {
  return speed && typeof speed === 'number' && speed >= CONFIG.BOUNDS.MIN_SPEED && speed <= CONFIG.BOUNDS.MAX_SPEED;
};

/**
 * Validates colors array
 * @param {Array} colors - Colors array to validate
 * @returns {boolean} True if valid
 */
const validateColors = (colors) => {
  return Array.isArray(colors) && colors.length > 0 && colors.length <= CONFIG.BOUNDS.MAX_COLORS;
};

/**
 * Parses and validates options with defaults
 * @param {Object} options - Configuration options
 * @returns {Object} Validated configuration object
 */
const parseOptions = (options) => {
  const defaults = {
    characters: matrixChars,
    colors: ['\x1b[32m', '\x1b[92m', '\x1b[37m'],
    density: CONFIG.DEFAULTS.DENSITY,
    speed: CONFIG.DEFAULTS.SPEED,
    fadeEffect: true
  };

  if (!options || typeof options !== 'object') {
    return defaults;
  }

  const result = { ...defaults };

  if (validateCharacters(options.characters) && validateDensity(options.density)) {
    result.characters = options.characters;
    result.density = options.density;

    if (validateSpeed(options.speed)) {
      result.speed = options.speed;
    }

    if (validateColors(options.colors)) {
      result.colors = options.colors;
    }

    if (options.fadeEffect !== undefined) {
      result.fadeEffect = Boolean(options.fadeEffect);
    }
  }

  return result;
};

/**
 * Creates trail effect for a drop
 * @param {string} characters - Available characters
 * @param {Object} drop - Drop object
 * @param {boolean} fadeEffect - Whether to create trail
 * @returns {Array|null} Trail array or null
 */
const createTrail = (characters, drop, fadeEffect) => {
  if (!fadeEffect) {
    return null;
  }

  const trail = [];
  for (let trailIndex = 0; trailIndex < CONFIG.ANIMATION.TRAIL_LENGTH; trailIndex++) {
    trail.push({
      char: characters[Math.floor(Math.random() * characters.length)],
      y: drop.y - (trailIndex + 1),
      opacity: 1.0 - trailIndex * CONFIG.DEFAULTS.TRAIL_OPACITY_STEP
    });
  }
  return trail;
};

/**
 * Creates a single drop object
 * @param {number} dropIndex - Drop index
 * @param {string} characters - Available characters
 * @param {Array} colors - Available colors
 * @param {boolean} fadeEffect - Whether to add trail effect
 * @returns {Object} Drop object
 */
const createDrop = (dropIndex, characters, colors, fadeEffect) => {
  const drop = {
    id: dropIndex,
    char: characters[Math.floor(Math.random() * characters.length)],
    y: -Math.floor(Math.random() * CONFIG.ANIMATION.INITIAL_HEIGHT_RANGE),
    color: colors[Math.floor(Math.random() * colors.length)],
    brightness: Math.random(),
    trail: null
  };

  drop.trail = createTrail(characters, drop, fadeEffect);
  return drop;
};

/**
 * Creates a matrix column with drops
 * @param {number} colIndex - Column index
 * @param {Object} config - Configuration object
 * @returns {Object} Column object
 */
const createColumn = (colIndex, config) => {
  const column = {
    id: colIndex,
    x: colIndex * CONFIG.ANIMATION.COLUMN_WIDTH,
    active: Math.random() < config.density,
    speed: config.speed + (Math.random() * CONFIG.ANIMATION.SPEED_VARIANCE - 1),
    characters: config.characters,
    drops: [],
    lastUpdate: Date.now(),
    fadePositions: []
  };

  const dropsPerColumn = Math.floor(config.height / CONFIG.ANIMATION.HEIGHT_DIVISOR) + Math.floor(Math.random() * CONFIG.ANIMATION.RANDOM_DROPS);

  for (let dropIndex = 0; dropIndex < dropsPerColumn; dropIndex++) {
    const drop = createDrop(dropIndex, config.characters, config.colors, config.fadeEffect);
    column.drops.push(drop);
  }

  return column;
};

/**
 * Resets a drop to the top of the screen
 * @param {Object} drop - Drop object to reset
 * @param {Object} config - Configuration object
 */
const resetDrop = (drop, config) => {
  drop.y = -Math.floor(Math.random() * CONFIG.ANIMATION.RESET_OFFSET);
  drop.char = config.characters[Math.floor(Math.random() * config.characters.length)];
  drop.color = config.colors[Math.floor(Math.random() * config.colors.length)];
};

/**
 * Updates trail positions for a drop
 * @param {Object} drop - Drop object with trail
 */
const updateTrail = (drop) => {
  if (!drop.trail) {
    return;
  }

  drop.trail.forEach((trailPart, k) => {
    trailPart.y = drop.y - (k + 1);
  });
};

/**
 * Updates a single column's animation
 * @param {Object} column - Column object to update
 * @param {Object} config - Configuration object
 */
const updateColumn = (column, config) => {
  const timeSinceUpdate = Date.now() - column.lastUpdate;
  const shouldUpdate = timeSinceUpdate >= CONFIG.ANIMATION.FRAME_RATE / (config.speed * CONFIG.ANIMATION.SPEED_MULTIPLIER);

  if (!shouldUpdate) {
    return;
  }

  column.drops.forEach((drop) => {
    drop.y += column.speed;

    if (drop.y > config.height + CONFIG.ANIMATION.SCREEN_BUFFER) {
      resetDrop(drop, config);
    }

    updateTrail(drop);
  });

  column.lastUpdate = Date.now();
};

/**
 * Creates the matrix result object
 * @param {Array} columns - Array of column objects
 * @param {Object} config - Configuration object
 * @returns {Object} Matrix result object with update method
 */
const createMatrixResult = (columns, config) => {
  return {
    columns,
    config,
    stats: {
      totalColumns: columns.length,
      totalDrops: columns.reduce((sum, col) => sum + col.drops.length, 0),
      activeColumns: columns.filter((col) => col.active).length
    },
    update() {
      this.columns.forEach((column) => {
        if (column.active) {
          updateColumn(column, this.config);
        }
      });
    }
  };
};

/**
 * Initializes the matrix rain effect
 * @param {number} width - Terminal width
 * @param {number} height - Terminal height
 * @param {Object} options - Configuration options
 * @returns {Object} Matrix animation object
 */
const initializeMatrix = (width, height, options = {}) => {
  const config = { ...parseOptions(options), width, height };
  const columnCount = Math.floor(width / CONFIG.ANIMATION.COLUMN_WIDTH);
  const columns = [];

  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    const column = createColumn(colIndex, config);
    columns.push(column);
  }

  return createMatrixResult(columns, config);
};

/**
 * Initializes matrix with callback support (async pattern)
 * @param {number} width - Terminal width
 * @param {number} height - Terminal height
 * @param {Object} options - Configuration options
 * @param {Function} callback - Callback function
 * @returns {Object} Matrix animation object
 */
const initializeMatrixAsync = (width, height, options, callback) => {
  const result = initializeMatrix(width, height, options);

  if (callback && typeof callback === 'function') {
    global.setTimeout(() => callback(null, result), CONFIG.ANIMATION.ANIMATION_DELAY);
  }

  return result;
};

export { initializeMatrix, initializeMatrixAsync };
