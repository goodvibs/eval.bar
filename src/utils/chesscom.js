import {FEN} from "cm-chess";

export function extractPgnHeaders(pgn) {
    const headers = {};
    const headerRegex = /^\[(\w+)\s+"([^"]+)"\]/gm;
    let match;

    while ((match = headerRegex.exec(pgn)) !== null) {
        headers[match[1]] = match[2];
    }

    return headers;
}

export function isSupportedVariant(headers) {
    // List of supported variants
    const supportedVariants = [
        undefined,  // Standard chess (no Variant tag)
        'Standard' // Some sites explicitly mark standard games
    ];

    // Variant is unsupported
    if (!supportedVariants.includes(headers.Variant)) {
        throw new Error(`Unsupported chess variant: ${headers.Variant}`);
    }

    // Check for custom positions through FEN
    if (headers.SetUp === '1' && headers.FEN) {
        if (headers.FEN !== FEN.start) {
            throw new Error('Custom position games are not supported');
        }
    }

    return true;
}

export function formatTimeControl(timeControl) {
    if (!timeControl) return 'Unknown';

    // Handle daily games
    if (timeControl === '1/86400') return 'Daily';

    // Handle standard time format (e.g., '600', '180+1')
    const [baseTime, increment] = timeControl.split('+').map(Number);

    if (isNaN(baseTime)) return timeControl; // Return original if parsing fails

    let timeStr = '';

    // Convert base time from seconds to minutes if >= 60 seconds
    if (baseTime >= 60) {
        timeStr = `${baseTime / 60} min`;
    } else {
        timeStr = `${baseTime} sec`;
    }

    // Add increment if it exists
    if (increment) {
        timeStr += ` + ${increment} sec`;
    }

    return timeStr;
}

/**
 * Process a chess.com game into a standard format
 * @param {Object} game - Raw game object from Chess.com API
 * @returns {Object} Processed game object
 */
export function processChesscomGame(game) {
    // Extract headers from PGN and check if supported
    const headers = extractPgnHeaders(game.pgn);
    let isSupported = true;
    try {
        isSupportedVariant(headers);
    } catch (e) {
        isSupported = false;
    }

    return {
        id: game.url,
        white: game.white.username,
        black: game.black.username,
        whiteElo: game.white.rating,
        blackElo: game.black.rating,
        date: new Date(game.end_time * 1000),
        result: game.white.result === 'win' ? '1-0' :
            game.black.result === 'win' ? '0-1' :
                '½-½',
        timeControl: formatTimeControl(game.time_control),
        pgn: game.pgn,
        // Add fields from headers
        eco: headers.ECO,
        opening: headers.Opening,
        variant: headers.Variant,
        isSupported,
        event: headers.Event,
        finalPosition: game.fen // For the preview
    };
}

/**
 * Fetch a list of games for a Chess.com user for a specific month
 * @param {string} username - Chess.com username
 * @param {number|string} year - Year (YYYY)
 * @param {number|string} month - Month (1-12)
 * @returns {Promise<Array>} Array of processed game objects
 */
export async function fetchChesscomGames(username, year, month) {
    try {
        const response = await fetch(
            `https://api.chess.com/pub/player/${username}/games/${year}/${month.toString().padStart(2, '0')}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        const data = await response.json();
        return data.games.map(processChesscomGame);
    } catch (error) {
        console.error('Error fetching Chess.com sidebar:', error);
        throw error;
    }
}

/**
 * Parse Chess.com game date in YYYY.MM.DD format
 * @param {string} dateStr - Date string in Chess.com format
 * @returns {Object} Object with year and month
 */
function parseChesscomDate(dateStr) {
    try {
        const dateParts = dateStr.split('.');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);

        // Validate year and month
        if (isNaN(year) || isNaN(month) || year < 2000 || month < 1 || month > 12) {
            throw new Error('Invalid date format');
        }

        return { year, month };
    } catch (e) {
        // If date parsing fails, use current month as fallback
        const currentDate = new Date();
        return {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1 // months are 0-based
        };
    }
}

/**
 * Fetch a single Chess.com game by its ID
 * @param {string} gameType - Game type ('live' or 'daily')
 * @param {string} gameId - Chess.com game ID
 * @returns {Promise<Object>} Object containing the PGN and game details
 */
export async function fetchChesscomGame(gameType, gameId) {
    if (!gameId) {
        throw new Error('No game ID provided');
    }

    try {
        // Step 1: Get game metadata from the callback endpoint
        const gameMetaResponse = await fetch(`https://www.chess.com/callback/live/game/${gameId}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!gameMetaResponse.ok) {
            throw new Error('Failed to fetch game metadata');
        }

        const gameMeta = await gameMetaResponse.json();

        // Check if we have valid PGN headers
        if (!gameMeta.game || !gameMeta.game.pgnHeaders) {
            throw new Error('Game data is incomplete or in an unexpected format');
        }

        // Get player usernames
        const whiteUsername = gameMeta.game.pgnHeaders.White;
        if (!whiteUsername) {
            throw new Error('Could not identify players in this game');
        }

        // Parse the date to get year and month
        const { year, month } = parseChesscomDate(gameMeta.game.pgnHeaders.Date);

        // Step 2: Fetch all games for this month for the white player
        const gamesArchive = await fetchChesscomGames(whiteUsername, year, month);

        // Step 3: Find the specific game by ID in the archive
        const gameIdStr = gameId.toString();
        const targetGame = gamesArchive.find(game =>
            game.id.includes(gameIdStr) ||
            (game.id.includes('/game/') && game.id.includes(gameIdStr))
        );

        if (!targetGame) {
            throw new Error('Game not found in archive. Try a more recent game.');
        }

        // Return the pgn and game object
        return {
            pgn: targetGame.pgn,
            game: targetGame
        };
    } catch (error) {
        console.error('Error fetching Chess.com game:', error);
        throw error;
    }
}