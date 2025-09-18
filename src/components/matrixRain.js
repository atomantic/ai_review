// Matrix Rain Effect Component - creates falling character animation
const matrixChars =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// Constants to reduce magic number warnings while keeping complexity
const MIN_CHARS = 5;
const MAX_CHARS = 200;
const MIN_DENSITY = 0.1;
const MAX_DENSITY = 1.0;
const MIN_SPEED = 1;
const MAX_SPEED = 10;
const TRAIL_LENGTH = 3;
const COLUMN_WIDTH = 2;
const DEFAULT_DENSITY = 0.5;
const DEFAULT_SPEED = 1;
const TRAIL_OPACITY_STEP = 0.3;
const HEIGHT_DIVISOR = 3;
const RANDOM_DROPS = 5;
const MAX_COLORS = 5;
const SPEED_VARIANCE = 2;
const SCREEN_BUFFER = 5;
const RESET_OFFSET = 10;
const ANIMATION_DELAY = 100;
const SPEED_MULTIPLIER = 10;
const FRAME_RATE = 1000;

const validateCharacters = (characters) => {
  return characters &&
    typeof characters === 'string' &&
    characters.length > MIN_CHARS &&
    characters.length < MAX_CHARS;
};

const validateDensity = (density) => {
  return density >= MIN_DENSITY && density <= MAX_DENSITY;
};

const validateSpeed = (speed) => {
  return speed && typeof speed === 'number' && speed >= MIN_SPEED && speed <= MAX_SPEED;
};

const validateColors = (colors) => {
  return Array.isArray(colors) && colors.length > 0 && colors.length <= MAX_COLORS;
};

const parseOptions = (options) => {
  const defaults = {
    characters: matrixChars,
    colors: ['\x1b[32m', '\x1b[92m', '\x1b[37m'],
    density: DEFAULT_DENSITY,
    speed: DEFAULT_SPEED,
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

const createTrail = (characters, drop, fadeEffect) => {
  if (!fadeEffect) {
    return null;
  }

  const trail = [];
  for (let trailIndex = 0; trailIndex < TRAIL_LENGTH; trailIndex++) {
    trail.push({
      char: characters[Math.floor(Math.random() * characters.length)],
      y: drop.y - (trailIndex + 1),
      opacity: 1.0 - trailIndex * TRAIL_OPACITY_STEP
    });
  }
  return trail;
};

const INITIAL_HEIGHT_RANGE = 100;

const createDrop = (dropIndex, characters, colors, fadeEffect) => {
  const drop = {
    id: dropIndex,
    char: characters[Math.floor(Math.random() * characters.length)],
    y: -Math.floor(Math.random() * INITIAL_HEIGHT_RANGE),
    color: colors[Math.floor(Math.random() * colors.length)],
    brightness: Math.random(),
    trail: null
  };

  drop.trail = createTrail(characters, drop, fadeEffect);
  return drop;
};

const createColumn = (colIndex, config) => {
  const column = {
    id: colIndex,
    x: colIndex * COLUMN_WIDTH,
    active: Math.random() < config.density,
    speed: config.speed + (Math.random() * SPEED_VARIANCE - 1),
    characters: config.characters,
    drops: [],
    lastUpdate: Date.now(),
    fadePositions: []
  };

  const dropsPerColumn = Math.floor(config.height / HEIGHT_DIVISOR) + Math.floor(Math.random() * RANDOM_DROPS);

  for (let dropIndex = 0; dropIndex < dropsPerColumn; dropIndex++) {
    const drop = createDrop(dropIndex, config.characters, config.colors, config.fadeEffect);
    column.drops.push(drop);
  }

  return column;
};

const resetDrop = (drop, config) => {
  drop.y = -Math.floor(Math.random() * RESET_OFFSET);
  drop.char = config.characters[Math.floor(Math.random() * config.characters.length)];
  drop.color = config.colors[Math.floor(Math.random() * config.colors.length)];
};

const updateTrail = (drop) => {
  if (!drop.trail) {
    return;
  }

  drop.trail.forEach((trailPart, k) => {
    trailPart.y = drop.y - (k + 1);
  });
};

const updateColumn = (column, config) => {
  const timeSinceUpdate = Date.now() - column.lastUpdate;
  const shouldUpdate = timeSinceUpdate >= FRAME_RATE / (config.speed * SPEED_MULTIPLIER);

  if (!shouldUpdate) {
    return;
  }

  column.drops.forEach((drop) => {
    drop.y += column.speed;

    if (drop.y > config.height + SCREEN_BUFFER) {
      resetDrop(drop, config);
    }

    updateTrail(drop);
  });

  column.lastUpdate = Date.now();
};

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

const initializeMatrix = (width, height, options = {}) => {
  const config = { ...parseOptions(options), width, height };
  const columnCount = Math.floor(width / COLUMN_WIDTH);
  const columns = [];

  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    const column = createColumn(colIndex, config);
    columns.push(column);
  }

  return createMatrixResult(columns, config);
};

const initializeMatrixAsync = (width, height, options, callback) => {
  const result = initializeMatrix(width, height, options);

  if (callback && typeof callback === 'function') {
    global.setTimeout(() => callback(null, result), ANIMATION_DELAY);
  }

  return result;
};

export { initializeMatrix, initializeMatrixAsync };
