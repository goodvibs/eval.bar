/**
 * Utility functions for chess evaluations
 */

/**
 * Processes an evaluation score and returns detailed information
 * @param {number|string} evaluation - The evaluation score (number for centipawns, string for mate)
 * @returns {Object} Detailed evaluation information
 */
export const processEvaluation = (evaluation) => {
    const defaultEval = {
        score: 0,
        formattedScore: "0.0",
        advantage: "equal",
        isSignificant: false,
        isDecisive: false,
        isMate: false,
        mateInMoves: null,
        winningColor: null,
        barPercentage: 50,
    };

    // Handle undefined or null evaluations
    if (evaluation === undefined || evaluation === null) {
        return defaultEval;
    }

    // Handle mate scores (strings like "M5" or "-M3")
    if (typeof evaluation === "string") {
        const isWhiteMating = evaluation.startsWith("M");
        const mateNumber = parseInt(evaluation.replace(/[M-]/g, ""));

        if (isNaN(mateNumber)) {
            return defaultEval;
        }

        return {
            score: evaluation,
            formattedScore: evaluation,
            advantage: isWhiteMating ? "white" : "black",
            isSignificant: true,
            isDecisive: true,
            isMate: true,
            mateInMoves: mateNumber,
            winningColor: isWhiteMating ? "white" : "black",
            barPercentage: isWhiteMating ? 98 : 2
        };
    }

    // Handle numerical scores (centipawns)
    const numericEval = Number(evaluation);

    if (isNaN(numericEval)) {
        return defaultEval;
    }

    // Calculate bar percentage using sigmoid function for smooth scaling
    const coefficient = 0.2; // Controls the curve steepness
    const percentage = (1 / (1 + Math.exp(-numericEval * coefficient))) * 100;
    const barPercentage = Math.min(Math.max(percentage, 2), 98); // Clamp between 2-98%

    // Format the score string
    const absScore = Math.abs(numericEval);
    const formattedScore = numericEval > 0
        ? `+${absScore.toFixed(1)}`
        : numericEval < 0
            ? `-${absScore.toFixed(1)}`
            : "0.0";

    // Determine advantage levels
    const advantage = numericEval > 0.2
        ? "white"
        : numericEval < -0.2
            ? "black"
            : "equal";

    const isSignificant = absScore >= 1.5;
    const isDecisive = absScore >= 3.0;
    const winningColor = numericEval > 0 ? "white" : numericEval < 0 ? "black" : null;

    return {
        score: numericEval,
        formattedScore,
        advantage,
        isSignificant,
        isDecisive,
        isMate: false,
        mateInMoves: null,
        winningColor,
        barPercentage
    };
};

/**
 * Formats an evaluation score to a human-readable string
 * @param {number|string} evaluation - The evaluation score
 * @returns {string} Formatted evaluation string
 */
export const formatEvaluation = (evaluation) => {
    const { formattedScore } = processEvaluation(evaluation);
    return formattedScore;
};

/**
 * Gets the percentage for the evaluation bar
 * @param {number|string} evaluation - The evaluation score
 * @returns {number} Percentage value (2-98)
 */
export const getEvaluationBarPercentage = (evaluation) => {
    const { barPercentage } = processEvaluation(evaluation);
    return barPercentage;
};

/**
 * Determines which side (if any) has an advantage
 * @param {number|string} evaluation - The evaluation score
 * @returns {"white"|"black"|"equal"} Which side has an advantage
 */
export const getAdvantage = (evaluation) => {
    const { advantage } = processEvaluation(evaluation);
    return advantage;
};

/**
 * Checks if the evaluation represents a decisive advantage
 * @param {number|string} evaluation - The evaluation score
 * @returns {boolean} True if the advantage is decisive
 */
export const isDecisiveAdvantage = (evaluation) => {
    const { isDecisive } = processEvaluation(evaluation);
    return isDecisive;
};

/**
 * Checks if the position has a forced mate
 * @param {number|string} evaluation - The evaluation score
 * @returns {boolean} True if there is a forced mate
 */
export const isMateScore = (evaluation) => {
    const { isMate } = processEvaluation(evaluation);
    return isMate;
};

/**
 * Gets the mate in X moves if applicable
 * @param {number|string} evaluation - The evaluation score
 * @returns {number|null} Number of moves to mate or null if not a mate
 */
export const getMateInMoves = (evaluation) => {
    const { mateInMoves } = processEvaluation(evaluation);
    return mateInMoves;
};

/**
 * Gets which color is winning based on the evaluation
 * @param {number|string} evaluation - The evaluation score
 * @returns {"white"|"black"|null} Winning color or null if equal
 */
export const getWinningColor = (evaluation) => {
    const { winningColor } = processEvaluation(evaluation);
    return winningColor;
};