export async function analyzeOnLichess(pgn, useApi = false) {
    if (useApi) {
        try {
            const response = await fetch('https://lichess.org/api/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `pgn=${encodeURIComponent(pgn)}`
            });

            if (!response.ok) {
                throw new Error('Failed to import game to Lichess');
            }

            const data = await response.json();
            window.open(data.url, '_blank');
        } catch (error) {
            console.error('Error importing to Lichess:', error);
            // Fallback to direct URL method
            const moves = pgn.replace(/\n/g, ' ').replace(/\[.*?\]/g, '').trim();
            const urlMoves = moves.replace(/\s+/g, '_');
            window.open(`https://lichess.org/analysis/pgn/${urlMoves}`, '_blank');
        }
    } else {
        // Direct URL method - faster but doesn't save the game
        const moves = pgn.replace(/\n/g, ' ').replace(/\[.*?\]/g, '').trim();
        const urlMoves = moves.replace(/\s+/g, '_');
        window.open(`https://lichess.org/analysis/pgn/${urlMoves}`, '_blank');
    }
}