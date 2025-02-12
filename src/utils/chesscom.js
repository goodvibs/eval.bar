function formatTimeControl(timeControl) {
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

export async function fetchChesscomGames(username, year, month) {
    try {
        const response = await fetch(
            `https://api.chess.com/pub/player/${username}/games/${year}/${month.toString().padStart(2, '0')}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }

        const data = await response.json();
        return data.games.map(game => ({
            id: game.url,
            white: game.white.username,
            black: game.black.username,
            whiteRating: game.white.rating,
            blackRating: game.black.rating,
            date: new Date(game.end_time * 1000),
            result: game.white.result === 'win' ? '1-0' :
                game.black.result === 'win' ? '0-1' :
                    '½-½',
            timeControl: formatTimeControl(game.time_control),
            pgn: game.pgn
        }));
    } catch (error) {
        console.error('Error fetching Chess.com games:', error);
        throw error;
    }
}