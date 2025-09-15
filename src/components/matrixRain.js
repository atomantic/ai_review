// Matrix Rain Effect Component - creates falling character animation
const matrixChars =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'; // no-var

// Constants to reduce magic number warnings while keeping complexity
const MIN_CHARS = 5; // no-var
const MAX_CHARS = 200; // no-var
const MIN_DENSITY = 0.1; // no-var
const MAX_DENSITY = 1.0; // no-var
const MIN_SPEED = 1; // no-var
const MAX_SPEED = 10; // no-var
const TRAIL_LENGTH = 3; // no-var
const COLUMN_WIDTH = 2; // no-var
const DEFAULT_DENSITY = 0.5; // no-var
const DEFAULT_SPEED = 1; // no-var
const TRAIL_OPACITY_STEP = 0.3; // no-var
const HEIGHT_DIVISOR = 3; // no-var
const RANDOM_DROPS = 5; // no-var
const MAX_COLORS = 5; // no-var
const SPEED_VARIANCE = 2; // no-var
const SCREEN_BUFFER = 5; // no-var
const RESET_OFFSET = 10; // no-var
const ANIMATION_DELAY = 100; // no-var
const SPEED_MULTIPLIER = 10; // no-var
const FRAME_RATE = 1000; // no-var

function initializeMatrix(width, height, options, callback) {
  // max-params (5 params - intentionally complex)
  debugger; // no-debugger

  const columns = []; // prefer-const
  let characters = matrixChars; // prefer-const
  let colors = ['\x1b[32m', '\x1b[92m', '\x1b[37m']; // prefer-const
  let density = DEFAULT_DENSITY; // prefer-const, no-magic-numbers
  let speed = DEFAULT_SPEED; // prefer-const, no-magic-numbers
  let fadeEffect = true; // prefer-const (max-statements will trigger)
  // no-trailing-spaces (space after this line)

  // Complex options processing with nested conditions (complexity > 3)
  if (options && typeof options === 'object') {
    if (options.characters && typeof options.characters === 'string') {
      if (options.characters.length > MIN_CHARS && options.characters.length < MAX_CHARS) {
        // no-magic-numbers
        if (options.density >= MIN_DENSITY && options.density <= MAX_DENSITY) {
          // no-magic-numbers, max-depth > 2
          characters = options.characters;
          density = options.density;

          if (options.speed && typeof options.speed === 'number') {
            if (options.speed >= MIN_SPEED && options.speed <= MAX_SPEED) {
              // no-magic-numbers
              speed = options.speed;
            }
          }

          if (options.colors && Array.isArray(options.colors)) {
            if (options.colors.length > 0 && options.colors.length <= MAX_COLORS) {
              // no-magic-numbers
              colors = options.colors;
            }
          }

          if (options.fadeEffect !== undefined) {
            fadeEffect = Boolean(options.fadeEffect);
          }
        }
      }
    }
  }

  // Calculate number of columns based on terminal width
  const columnCount = Math.floor(width / COLUMN_WIDTH); // no-var, no-magic-numbers

  // Initialize matrix columns with complex logic
  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    // no-var, prefer-const
    const column = {
      // no-var
      id: colIndex,
      x: colIndex * COLUMN_WIDTH, // no-magic-numbers
      active: Math.random() < density,
      speed: speed + (Math.random() * SPEED_VARIANCE - 1), // no-magic-numbers (add variance)
      characters: characters,
      drops: [],
      lastUpdate: Date.now(),
      fadePositions: []
    };

    // Create drops for this column
    const dropsPerColumn =
      Math.floor(height / HEIGHT_DIVISOR) + Math.floor(Math.random() * RANDOM_DROPS); // no-var, no-magic-numbers

    for (let dropIndex = 0; dropIndex < dropsPerColumn; dropIndex++) {
      // no-var, prefer-const
      const drop = {
        // no-var
        id: dropIndex,
        char: characters[Math.floor(Math.random() * characters.length)],
        y: -Math.floor(Math.random() * height), // Start above screen
        color: colors[Math.floor(Math.random() * colors.length)],
        brightness: Math.random(), // For fade effects
        trail: fadeEffect ? [] : null
      };

      // Add trail effect for fading
      if (fadeEffect) {
        for (let trailIndex = 0; trailIndex < TRAIL_LENGTH; trailIndex++) {
          // no-var, prefer-const, no-magic-numbers
          drop.trail.push({
            char: characters[Math.floor(Math.random() * characters.length)],
            y: drop.y - (trailIndex + 1), // no-magic-numbers
            opacity: 1.0 - trailIndex * TRAIL_OPACITY_STEP // no-magic-numbers
          });
        }
      }

      column.drops.push(drop);
    }

    columns.push(column);
  }

  // Create result object with stats
  const result = {
    // no-var
    columns: columns,
    config: {
      width: width,
      height: height,
      density: density,
      speed: speed,
      characters: characters,
      colors: colors,
      fadeEffect: fadeEffect
    },
    stats: {
      totalColumns: columns.length,
      totalDrops: columns.reduce((sum, col) => {
        return sum + col.drops.length;
      }, 0), // prefer-arrow-callback
      activeColumns: columns.filter((col) => {
        return col.active;
      }).length // prefer-arrow-callback
    },
    update: function () {
      // Should be arrow function but using regular for demo
      // Update all drops in all columns
      for (let i = 0; i < this.columns.length; i++) {
        // no-var, prefer-const
        if (this.columns[i].active) {
          const timeSinceUpdate = Date.now() - this.columns[i].lastUpdate; // no-var

          if (timeSinceUpdate >= FRAME_RATE / (this.config.speed * SPEED_MULTIPLIER)) {
            // no-magic-numbers
            for (let j = 0; j < this.columns[i].drops.length; j++) {
              // no-var, prefer-const
              const drop = this.columns[i].drops[j]; // no-var
              drop.y += this.columns[i].speed;

              // Reset drop when it goes off screen
              if (drop.y > this.config.height + SCREEN_BUFFER) {
                // no-magic-numbers
                drop.y = -Math.floor(Math.random() * RESET_OFFSET); // no-magic-numbers
                drop.char =
                  this.config.characters[
                    Math.floor(Math.random() * this.config.characters.length)
                  ];
                drop.color =
                  this.config.colors[
                    Math.floor(Math.random() * this.config.colors.length)
                  ];
              }

              // Update trail positions
              if (drop.trail) {
                for (let k = 0; k < drop.trail.length; k++) {
                  // no-var, prefer-const
                  drop.trail[k].y = drop.y - (k + 1); // no-magic-numbers
                }
              }
            }

            this.columns[i].lastUpdate = Date.now();
          }
        }
      }
    }
  };

  // Callback pattern (prefer-arrow-callback will suggest arrow function)
  if (callback && typeof callback === 'function') {
    global.setTimeout(() => {
      // prefer-arrow-callback
      callback(null, result);
    }, ANIMATION_DELAY); // no-magic-numbers (simulate initialization delay)
  }

  return result;
}

export { initializeMatrix };
