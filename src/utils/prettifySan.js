
// Unicode symbols for chess pieces
const PIECE_SYMBOLS = {
    false: {
        K: "♔", // King
        Q: "♕", // Queen
        R: "♖", // Rook
        B: "♗", // Bishop
        N: "♘", // Knight
        P: "♙"  // Pawn (usually implicit in SAN)
    },
    true: {
        K: "♚", // King
        Q: "♛", // Queen
        R: "♜", // Rook
        B: "♝", // Bishop
        N: "♞", // Knight
        P: "♟"  // Pawn (usually implicit in SAN)
    }
};

/**
 * Converts a chess move in Standard Algebraic Notation (SAN) to a prettier version
 * using Unicode chess symbols.
 *
 * @param {string} san - The chess move in SAN format (e.g., "Nf3", "e4", "Qxd5+")
 * @param {boolean} [filled=false] - Whether to use filled chess symbols (default: false)
 * @returns {string} The prettified chess move with Unicode symbols
 */
export function prettifySan(san, filled=true) {
    const symbols = PIECE_SYMBOLS[filled];
    let result = '';
    for (let i = 0; i < san.length; i++) {
        const char = san[i];
        if (char in symbols) {
          result += symbols[char];
        }
        else {
            result += char;
        }
    }

    return result;
}