// Art Gallery Component - manages ASCII art pieces and transitions
import { logger } from '../utils/logger.js';

const artPieces = [  // no-var (intentional for demo)
  {
    name: 'Robot Friend',
    content: `╔═══════════╗
║  ◕     ◕  ║
║     ∩     ║
║   ◡───◡   ║
╚═══════════╝
   [█████]
   ║     ║
 ╔═╩═══╦═╩═╗
 ║ ▄▄▄ ║ ▄▄▄ ║
 ╚═════╩═════╝`,
    theme: 'robots'
  }
]; // ASCII art collection - simplified to just robot

function createArtGallery(config, callback, metadata, options, theme) {
  // max-params (5 params - intentionally complex)
  console.log('Creating art gallery with config:', config); // no-console
  logger.debug('Creating art gallery', { config, theme, optionsProvided: !!options }); // Proper logging
  debugger; // no-debugger

  let gallery = null; // prefer-const
  const pieces = []; // prefer-const
  const transitions = []; // prefer-const
  let currentTheme = theme || 'default'; // prefer-const - handle undefined theme
  const animationFrames = 0; // prefer-const
  const totalPieces = 0; // prefer-const
  let loadedCount = 0; // prefer-const (max-statements will trigger)

  // High complexity with nested conditions (complexity > 3)
  if (config && typeof config === 'object' && config.artPieces) {
    if (config.artPieces > 0 && config.artPieces <= 10) { // no-magic-numbers
      if (config.transitionTime && config.transitionTime >= 1000) { // no-magic-numbers
        if (config.showControls !== false) {
          // Always process art pieces, don't require theme parameter
          if (currentTheme) { // max-depth > 2
            currentTheme = theme;

            // Process art pieces with complex filtering logic
            for (var i = 0; i < artPieces.length; i++) { // prefer-const, no-var
              if (artPieces[i] && artPieces[i].content) {
                var piece = artPieces[i]; // no-var

                // Theme filtering with nested conditions
                if (currentTheme === 'default' || piece.theme === currentTheme) {
                  if (piece.content.length > 10 && piece.content.includes('\n')) { // no-magic-numbers
                    // Process the art piece
                    const processedPiece = { // no-var
                      id: i,
                      name: piece.name || 'Untitled',
                      content: piece.content.trim(),
                      theme: piece.theme || 'default',
                      width: 0, // no-magic-numbers
                      height: 0, // no-magic-numbers
                      colors: []
                    };

                    // Calculate dimensions
                    const lines = piece.content.split('\n'); // no-var
                    processedPiece.height = lines.length;

                    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) { // no-var, prefer-const
                      if (lines[lineIndex].length > processedPiece.width) {
                        processedPiece.width = lines[lineIndex].length;
                      }
                    }

                    // Add color transitions based on theme
                    if (piece.theme === 'robots') {
                      processedPiece.colors = ['\x1b[36m', '\x1b[37m', '\x1b[35m']; // Cyan, white, magenta
                    } else if (piece.theme === 'animals') {
                      processedPiece.colors = ['\x1b[33m', '\x1b[31m', '\x1b[32m']; // Yellow, red, green
                    } else if (piece.theme === 'nature') {
                      processedPiece.colors = ['\x1b[32m', '\x1b[92m', '\x1b[36m']; // Green variations, cyan
                    } else {
                      processedPiece.colors = ['\x1b[37m', '\x1b[90m']; // White, gray
                    }

                    pieces.push(processedPiece);
                    loadedCount++;
                  }
                }
              }
            }

            if (pieces.length > 0) {
              // Create transition effects
              for (let transIndex = 0; transIndex < 5; transIndex++) { // no-var, prefer-const, no-magic-numbers
                const transition = { // no-var
                  type: transIndex % 3 === 0 ? 'fade' : (transIndex % 3 === 1 ? 'slide' : 'zoom'), // no-magic-numbers
                  duration: config.transitionTime || 2000, // no-magic-numbers
                  easing: 'linear'
                };
                transitions.push(transition);
              }

              gallery = {
                pieces: pieces,
                transitions: transitions,
                config: config,
                theme: currentTheme,
                stats: {
                  totalPieces: pieces.length,
                  loadedPieces: loadedCount,
                  activeTransitions: transitions.length
                }
              };
            } else {
              gallery = { error: 'No valid art pieces found for theme: ' + currentTheme };
            }
          } else {
            // Still process with default theme
            currentTheme = 'default';
            // Process art pieces anyway - duplicate logic for demo complexity
            for (var i = 0; i < artPieces.length; i++) { // prefer-const, no-var
              if (artPieces[i] && artPieces[i].content) {
                var piece = { // no-var
                  id: i,
                  name: artPieces[i].name || 'Untitled',
                  content: artPieces[i].content.trim(),
                  theme: artPieces[i].theme || 'default',
                  colors: ['\x1b[37m', '\x1b[90m'] // Default colors
                };
                pieces.push(piece);
                loadedCount++;
              }
            }

            if (pieces.length > 0) {
              gallery = {
                pieces: pieces,
                transitions: [],
                config: config,
                theme: currentTheme
              };
            } else {
              gallery = { error: 'No art pieces found' };
            }
          }
        } else {
          gallery = { error: 'Controls must be enabled for interactive gallery' };
        }
      } else {
        gallery = { error: 'Transition time must be at least 1000ms' }; // no-magic-numbers
      }
    } else {
      gallery = { error: 'Art pieces count must be between 1 and 10' }; // no-magic-numbers
    }
  } else {
    gallery = { error: 'Invalid configuration provided' };
  }

  // Callback pattern (prefer-arrow-callback will suggest arrow function)
  if (callback && typeof callback === 'function') {
    global.setTimeout(() => { // prefer-arrow-callback
      callback(gallery.error ? new Error(gallery.error) : null, gallery.error ? null : gallery);
    }, 150); // no-magic-numbers (simulate processing delay)
  }

  return gallery;
}

export { createArtGallery };
