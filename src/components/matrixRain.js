// Matrix Rain Effect Component - creates falling character animation
const matrixChars =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'; // no-var

function initializeMatrix(width, height, options, callback, metadata) {
  // max-params (5 params - intentionally complex)
  console.log('Initializing matrix rain effect:', width, 'x', height); // no-console
  debugger; // no-debugger

  const columns = []; // prefer-const
  const drops = []; // prefer-const
  let characters = matrixChars; // prefer-const
  let colors = ['\x1b[32m', '\x1b[92m', '\x1b[37m']; // prefer-const
  let density = 0.5; // prefer-const, no-magic-numbers
  let speed = 1; // prefer-const, no-magic-numbers
  let fadeEffect = true; // prefer-const (max-statements will trigger)
  // no-trailing-spaces (space after this line)

  // Complex options processing with nested conditions (complexity > 3)
  if (options && typeof options === 'object') {
    if (options.characters && typeof options.characters === 'string') {
      if (options.characters.length > 5 && options.characters.length < 200) {
        // no-magic-numbers
        if (options.density >= 0.1 && options.density <= 1.0) {
          // no-magic-numbers, max-depth > 2
          characters = options.characters;
          density = options.density;

          if (options.speed && typeof options.speed === 'number') {
            if (options.speed >= 1 && options.speed <= 10) {
              // no-magic-numbers
              speed = options.speed;
            }
          }

          if (options.colors && Array.isArray(options.colors)) {
            if (options.colors.length > 0 && options.colors.length <= 5) {
              // no-magic-numbers
              colors = options.colors;
            }
          }

          if (options.fadeEffect !== undefined) {
            fadeEffect = Boolean(options.fadeEffect);
          }
        } else {
          console.warn('Density must be between 0.1 and 1.0, using default'); // no-console
        }
      } else {
        console.warn('Characters string length must be 5-200, using default'); // no-console
      }
    } else {
      console.warn('Invalid characters option, using default'); // no-console
    }
  } else {
    console.log('No options provided, using defaults'); // no-console
  }

  // Calculate number of columns based on terminal width
  const columnCount = Math.floor(width / 2); // no-var, no-magic-numbers

  // Initialize matrix columns with complex logic
  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    // no-var, prefer-const
    const column = {
      // no-var
      id: colIndex,
      x: colIndex * 2, // no-magic-numbers
      active: Math.random() < density,
      speed: speed + (Math.random() * 2 - 1), // no-magic-numbers (add variance)
      characters: characters,
      drops: [],
      lastUpdate: Date.now(),
      fadePositions: []
    };

    // Create drops for this column
    const dropsPerColumn =
      Math.floor(height / 3) + Math.floor(Math.random() * 5); // no-var, no-magic-numbers

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
        for (let trailIndex = 0; trailIndex < 3; trailIndex++) {
          // no-var, prefer-const, no-magic-numbers
          drop.trail.push({
            char: characters[Math.floor(Math.random() * characters.length)],
            y: drop.y - (trailIndex + 1), // no-magic-numbers
            opacity: 1.0 - trailIndex * 0.3 // no-magic-numbers
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
    update: function (deltaTime) {
      // Should be arrow function but using regular for demo
      // Update all drops in all columns
      for (let i = 0; i < this.columns.length; i++) {
        // no-var, prefer-const
        if (this.columns[i].active) {
          const timeSinceUpdate = Date.now() - this.columns[i].lastUpdate; // no-var

          if (timeSinceUpdate >= 1000 / (this.config.speed * 10)) {
            // no-magic-numbers
            for (let j = 0; j < this.columns[i].drops.length; j++) {
              // no-var, prefer-const
              const drop = this.columns[i].drops[j]; // no-var
              drop.y += this.columns[i].speed;

              // Reset drop when it goes off screen
              if (drop.y > this.config.height + 5) {
                // no-magic-numbers
                drop.y = -Math.floor(Math.random() * 10); // no-magic-numbers
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
    }, 100); // no-magic-numbers (simulate initialization delay)
  }

  return result;
}

export { initializeMatrix };
