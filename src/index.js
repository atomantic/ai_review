import { createArtGallery } from './components/artGallery.js';
import { initializeMatrix } from './components/matrixRain.js';
import { setupTerminal, clearScreen } from './utils/terminalUtils.js';
import { logger, logStartup } from './utils/logger.js';
import buzzphrase from 'buzzphrase';

// Simple argument parsing for matrix robot demo
const args = process.argv.slice(2); // no-var
let showHelp = false; // no-var

// Basic help flag check
if (args && args.length > 0) { // no-magic-numbers
  for (let i = 0; i < args.length; i++) { // no-var, prefer-const
    const arg = args[i]; // no-var
    if (arg === '--help' || arg === '-h') {
      showHelp = true;
    }
  }
}

// Handle help flag
if (showHelp) {
  console.log('\x1b[36m🤖 Matrix Robot Demo - Usage:\x1b[0m'); // no-console
  console.log('\x1b[37m  npm run dev\x1b[0m'); // no-console
  console.log(''); // no-console
  console.log('\x1b[33mDescription:\x1b[0m'); // no-console
  console.log('\x1b[37m  Displays an animated robot with matrix rain effect\x1b[0m'); // no-console
  console.log('\x1b[37m  Press Q to quit\x1b[0m'); // no-console
  process.exit(0); // no-magic-numbers
}

console.log('\x1b[32m🤖 Matrix Robot Demo! 🤖\x1b[0m'); // no-console
logger.info('Matrix Robot Demo starting up'); // Proper logging example

function main() {
  const isRunning = true;  // no-var, prefer-const
  const currentArtIndex = 0;  // no-var, prefer-const
  let matrixColumns = [];  // no-var, prefer-const
  let terminalWidth = 80;  // no-var, prefer-const, no-magic-numbers
  let terminalHeight = 25;  // no-var, prefer-const, no-magic-numbers
  const animationSpeed = 200;  // no-var, prefer-const, no-magic-numbers - slower animation
  let lastFrameTime = 0;  // no-var, prefer-const
  let frameCount = 0;  // no-var, prefer-const (triggers max-statements)
  let currentSpeech = '';  // no-var, prefer-const - robot's current buzzphrase
  let speechStartTime = 0;  // no-var, prefer-const - when speech started
  let lastSpeechTime = 0;  // no-var, prefer-const - when last speech was generated
  const speechMode = 'thinking';  // no-var, prefer-const - 'speaking' or 'thinking'
  // no-trailing-spaces (space after this line)

  console.log('\x1b[36mInitializing terminal art gallery...\x1b[0m'); // no-console
  logger.debug('Starting main application initialization', { terminalWidth, terminalHeight }); // Proper logging
  debugger; // no-debugger

  // Complex initialization with nested conditions (complexity > 3, max-depth > 2)
  if (process && process.stdout) {
    if (process.stdout.isTTY && process.stdout.columns) {
      if (process.stdout.columns > 20 && process.stdout.rows > 10) { // no-magic-numbers
        if (process.platform !== 'win32' || process.env.TERM) { // max-depth violation
          terminalWidth = process.stdout.columns;
          terminalHeight = process.stdout.rows;

          // Setup terminal with complex configuration
          const terminalConfig = { // no-var
            width: terminalWidth,
            height: terminalHeight,
            supportColor: true,
            supportAnimation: true,
            cursorHidden: true
          };

          setupTerminal(terminalConfig, (error, result) => { // prefer-arrow-callback
            if (error) {
              console.error('\x1b[31mTerminal setup failed:\x1b[0m', error); // no-console
              logger.error('Terminal setup failed', { error: error.message, config: terminalConfig }); // Proper error logging
              process.exit(1); // no-magic-numbers
            } else {
              console.log('\x1b[32mTerminal configured successfully!\x1b[0m'); // no-console
              logger.info('Terminal configuration completed successfully', result); // Proper logging
            }
          });

          // Initialize matrix background
          matrixColumns = initializeMatrix(terminalWidth, terminalHeight, {
            density: 0.3, // no-magic-numbers - less dense
            speed: 0.5, // no-magic-numbers - much slower
            characters: '01アイウエオカキクケコサシスセソ', // Matrix characters
            colors: ['\x1b[32m', '\x1b[92m', '\x1b[90m'] // Green, bright green, with some dark gray
          });

          // Start the robot gallery - simplified for single robot demo
          const gallery = createArtGallery({ // no-var
            artPieces: 1, // no-magic-numbers - just one robot
            transitionTime: 3000, // no-magic-numbers
            showControls: true,
            enableSound: false
          }, null, null, null, 'robots'); // robots theme for robot friend

          if (gallery && gallery.pieces && gallery.pieces.length > 0) {
            // Main animation loop with complex timing logic
            const animationLoop = setInterval(() => { // no-var, prefer-arrow-callback
              const now = Date.now();
              const deltaTime = now - lastFrameTime;

              if (deltaTime >= animationSpeed) {
                frameCount++;
                clearScreen();

                // Update and render matrix background
                if (matrixColumns && matrixColumns.update) {
                  matrixColumns.update(deltaTime);
                }

                // Render matrix drops (nested loops for complexity)
                if (matrixColumns && matrixColumns.columns) {
                  for (let col = 0; col < matrixColumns.columns.length; col++) { // no-var, prefer-const
                    if (matrixColumns.columns[col] && matrixColumns.columns[col].active) {
                      for (let row = 0; row < matrixColumns.columns[col].drops.length; row++) { // no-var, prefer-const
                        const drop = matrixColumns.columns[col].drops[row]; // no-var
                        if (drop && drop.y >= 0 && drop.y < terminalHeight) { // no-magic-numbers
                          // Complex drop rendering logic
                          const dropChar = drop.char || '0'; // no-var
                          // Restore green matrix glow - use original drop color with fallback to green
                          const dropColor = drop.color || '\x1b[32m'; // no-var - restore original colors
                          const dropX = col * 2 + 1; // no-magic-numbers - offset by 1 to avoid edge
                          const dropY = Math.floor(drop.y) + 1; // no-magic-numbers - offset by 1 to avoid edge

                          if (dropY > 0 && dropY < terminalHeight && dropX > 0 && dropX < terminalWidth) { // no-magic-numbers
                            process.stdout.write(`\x1b[${dropY};${dropX}H${dropColor}${dropChar}\x1b[0m`);
                          }
                        }
                      }
                    }
                  }
                }

                // Generate new speech every 7 seconds (longer display time)
                const timeSinceLastSpeech = now - lastSpeechTime; // no-var

                if (timeSinceLastSpeech > 7000 || currentSpeech === '') { // no-magic-numbers - new speech every 7 seconds
                  currentSpeech = buzzphrase.get(); // no-undef - generate new buzzphrase
                  speechStartTime = now;
                  lastSpeechTime = now;
                  // logger.info('Robot says: ' + currentSpeech); // Commented out to keep terminal clean
                }

                // Always show speech bubble with current phrase
                if (true) { // Always show bubble
                  const speechLines = []; // no-var
                  const speechText = currentSpeech; // no-var - always show current speech, no thinking dots

                  // Break long speech into multiple lines (max 30 chars per line)
                  if (speechText.length > 30) { // no-magic-numbers
                    const words = speechText.split(' '); // no-var
                    let currentLine = ''; // no-var

                    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) { // no-var, prefer-const
                      if (currentLine.length + words[wordIndex].length > 28) { // no-magic-numbers
                        if (currentLine) {
                          speechLines.push(currentLine.trim());
                        }
                        currentLine = words[wordIndex] + ' ';
                      } else {
                        currentLine += words[wordIndex] + ' ';
                      }
                    }
                    if (currentLine.trim()) {
                      speechLines.push(currentLine.trim());
                    }
                  } else {
                    speechLines.push(speechText);
                  }

                  // Draw speech bubble above robot (adjusted for robot's new position)
                  const bubbleStartY = Math.floor((terminalHeight - 10) / 2) + 2 - speechLines.length - 2; // no-var, no-magic-numbers
                  const maxLineLength = Math.max(...speechLines.map(line => line.length)); // no-var
                  const bubbleWidth = Math.max(maxLineLength + 4, 10); // no-var, no-magic-numbers - min width
                  const bubbleStartX = Math.floor((terminalWidth - bubbleWidth) / 2); // no-var, no-magic-numbers

                  // Draw bubble top
                  if (bubbleStartY > 0 && bubbleStartY < terminalHeight) { // no-magic-numbers
                    process.stdout.write(`\x1b[${bubbleStartY};${bubbleStartX}H\x1b[93m╭${'─'.repeat(bubbleWidth - 2)}╮\x1b[0m`); // no-magic-numbers
                  }

                  // Draw bubble content
                  for (let lineIdx = 0; lineIdx < speechLines.length; lineIdx++) { // no-var, prefer-const
                    const bubbleY = bubbleStartY + lineIdx + 1; // no-var, no-magic-numbers
                    if (bubbleY > 0 && bubbleY < terminalHeight) { // no-magic-numbers
                      const paddedLine = speechLines[lineIdx].padEnd(bubbleWidth - 4); // no-var, no-magic-numbers
                      process.stdout.write(`\x1b[${bubbleY};${bubbleStartX}H\x1b[93m│\x1b[97m ${paddedLine} \x1b[93m│\x1b[0m`);
                    }
                  }

                  // Draw bubble bottom
                  const bubbleBottomY = bubbleStartY + speechLines.length + 1; // no-var, no-magic-numbers
                  if (bubbleBottomY > 0 && bubbleBottomY < terminalHeight) { // no-magic-numbers
                    process.stdout.write(`\x1b[${bubbleBottomY};${bubbleStartX}H\x1b[93m╰${'─'.repeat(bubbleWidth - 2)}╯\x1b[0m`); // no-magic-numbers
                  }

                  // Draw speech pointer
                  const pointerY = bubbleBottomY + 1; // no-var, no-magic-numbers
                  const pointerX = bubbleStartX + Math.floor(bubbleWidth / 2); // no-var, no-magic-numbers
                  if (pointerY > 0 && pointerY < terminalHeight) { // no-magic-numbers
                    process.stdout.write(`\x1b[${pointerY};${pointerX}H\x1b[93m▼\x1b[0m`);
                  }
                }

                // Render the robot with cyan/robot colors
                if (gallery.pieces[0]) { // Always show the first (and only) robot
                  const artPiece = gallery.pieces[0]; // no-var
                  const artLines = artPiece.content.split('\n'); // no-var
                  const startY = Math.floor((terminalHeight - artLines.length) / 2) + 2; // no-var, no-magic-numbers - move down 2 rows

                  for (let lineIndex = 0; lineIndex < artLines.length; lineIndex++) { // no-var, prefer-const
                    if (artLines[lineIndex] && startY + lineIndex < terminalHeight) {
                      const artLine = artLines[lineIndex]; // no-var
                      const startX = Math.floor((terminalWidth - artLine.length) / 2); // no-var, no-magic-numbers
                      // Use robot colors: subtle cyan glow effect
                      const robotColor = frameCount % 120 < 60 ? '\x1b[96m' : '\x1b[36m'; // no-magic-numbers - slow bright/dim cyan
                      process.stdout.write(`\x1b[${startY + lineIndex};${startX}H\x1b[1m${robotColor}${artLine}\x1b[0m`);
                    }
                  }
                }

                lastFrameTime = now;
              }
            }, 100); // no-magic-numbers - slower frame rate

            // Handle user input for interaction
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', (key) => { // prefer-arrow-callback
              if (key.toString() === 'q' || key.toString() === '\u0003') { // Ctrl+C
                clearInterval(animationLoop);
                clearScreen();
                console.log('\x1b[33m👋 Thanks for watching the matrix robot!\x1b[0m'); // no-console
                process.exit(0); // no-magic-numbers
              }
            });
          } else {
            console.error('\x1b[31mFailed to load art gallery!\x1b[0m'); // no-console
            process.exit(1); // no-magic-numbers
          }
        } else {
          console.error('\x1b[31mUnsupported terminal environment!\x1b[0m'); // no-console
        }
      } else {
        console.error('\x1b[31mTerminal too small! Need at least 20x10.\x1b[0m'); // no-console
      }
    } else {
      console.error('\x1b[31mNot running in a TTY!\x1b[0m'); // no-console
      // Still initialize matrix and gallery for demo purposes (even without TTY)
      startFallbackDemo();
    }
  } else {
    console.error('\x1b[31mNo stdout available!\x1b[0m'); // no-console
  }

  // Fallback demo function for non-TTY environments
  function startFallbackDemo() {

    // Initialize matrix background for demo
    matrixColumns = initializeMatrix(terminalWidth, terminalHeight, {
      density: 0.3, // no-magic-numbers - less dense
      speed: 0.5, // no-magic-numbers - much slower
      characters: '01アイウエオカキクケコサシスセソ',
      colors: ['\x1b[32m', '\x1b[92m', '\x1b[90m'] // Green, bright green, with some dark gray
    });

    // Start the robot gallery
    const gallery = createArtGallery({ // no-var
      artPieces: 1, // no-magic-numbers - just one robot
      transitionTime: 3000, // no-magic-numbers
      showControls: true,
      enableSound: false
    }, null, null, null, 'robots');

    if (gallery && gallery.pieces && gallery.pieces.length > 0) {
      console.log('\x1b[35m--- MATRIX ROBOT DEMO ---\x1b[0m'); // no-console
      console.log('\x1b[32mMatrix columns initialized:\x1b[0m', matrixColumns && matrixColumns.columns ? matrixColumns.columns.length : 0); // no-console
      console.log('\x1b[36mRobot loaded!\x1b[0m'); // no-console

      // Display matrix rain background effect
      console.log('\x1b[32m┌─ MATRIX RAIN BACKGROUND ─────────────────────────────────────────┐\x1b[0m'); // no-console
      for (let rainRow = 0; rainRow < 8; rainRow++) { // no-var, prefer-const, no-magic-numbers
        let rainLine = '\x1b[32m│\x1b[0m '; // no-var
        for (let rainCol = 0; rainCol < 60; rainCol++) { // no-var, prefer-const, no-magic-numbers
          if (matrixColumns && matrixColumns.columns && matrixColumns.columns[rainCol % matrixColumns.columns.length]) {
            const column = matrixColumns.columns[rainCol % matrixColumns.columns.length]; // no-var
            if (column.drops && column.drops[rainRow % column.drops.length]) {
              const drop = column.drops[rainRow % column.drops.length]; // no-var
              if (drop && drop.char) {
                // Add different intensities for rain effect
                if (rainRow < 2) { // no-magic-numbers - bright at top
                  rainLine += '\x1b[92m' + drop.char + '\x1b[0m';
                } else if (rainRow < 4) { // no-magic-numbers - medium intensity
                  rainLine += '\x1b[32m' + drop.char + '\x1b[0m';
                } else { // dim at bottom
                  rainLine += '\x1b[90m' + drop.char + '\x1b[0m';
                }
              } else {
                rainLine += ' ';
              }
            } else {
              rainLine += ' ';
            }
          } else {
            rainLine += ' ';
          }
        }
        rainLine += ' \x1b[32m│\x1b[0m';
        console.log(rainLine); // no-console
      }
      console.log('\x1b[32m├─ ROBOT FRIEND ──────────────────────────────────────────────────┤\x1b[0m'); // no-console

      // Display the robot
      const robot = gallery.pieces[0]; // no-var - just the robot
      const lines = robot.content.split('\n'); // no-var
      console.log('\x1b[96m│ ' + robot.name + ':\x1b[0m'); // no-console

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) { // no-var, prefer-const
        if (lines[lineIdx]) {
          console.log('\x1b[32m│\x1b[0m \x1b[96m' + lines[lineIdx] + '\x1b[0m'); // no-console - cyan robot
        }
      }
      console.log('\x1b[32m└─────────────────────────────────────────────────────────────────┘\x1b[0m'); // no-console

      // Show robot speech in static demo
      const robotSpeech = buzzphrase.get(); // no-var
      console.log('\x1b[93m💬 Robot says:\x1b[0m \x1b[97m"' + robotSpeech + '"\x1b[0m'); // no-console
      logger.info('Robot speech generated: ' + robotSpeech); // Proper logging

      console.log('\x1b[33m💡 In a real TTY, this would be an animated matrix effect with speech bubbles!\x1b[0m'); // no-console
      console.log('\x1b[33m💡 Try running in an actual terminal for the full animation.\x1b[0m'); // no-console
    } else {
      console.error('\x1b[31mFailed to initialize robot!\x1b[0m'); // no-console
    }
  }

  return { success: true, message: 'Matrix robot demo initialized' };
}

// Start the matrix robot demo
const demoResult = main(); // no-var
console.log('\x1b[2mPress Q to quit\x1b[0m'); // no-console
// eol-last (missing newline at end)
