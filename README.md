# eval.bar

eval.bar is an open-source chess analysis tool that helps you analyze your games using Stockfish. Pull your games from Chess.com, or upload a PGN; then, use the built-in analysis tool or export your games to Lichess.org.

![eval-bar-demo-trimmed-1.5x.gif](public%2Feval-bar-demo-trimmed-1.5x.gif)

## Import Sources
- Chess.com (Enter a Chess.com username to pull the user's games)
    - Username stored in local storage and used to pull games on page load
- PGN (paste a game in Portable Game Notation to analyze)

## Analysis Features
- In-browser analysis using a WebAssembly port of Stockfish
- View best moves/lines and evaluation scores
- Visualize overall position evaluation with an evaluation bar
- Play moves on the board to see how the evaluation changes

## Export Features
- Export games to Lichess.org for further analysis
- Download or copy a game as PGN

## To-Do

### Major Features
- Add a "Game Review" feature that provides a full game analysis, much like the "Game Review" feature on Chess.com
  - A graph of evaluation over the course of the game
  - A "grade" for each move:
    - Blunder
    - Mistake
    - Inaccuracy
    - Good move
    - Excellent move
    - Best move
    - Great move
    - Brilliant move
  - A list of "key moments" in the game
  - Other statistics
- Add an opening explorer
  - Show the most common moves in the current position
  - Show the win/draw/loss percentages for each move
  - Show the ECO information for the current position
- Add a "Game Library" feature that allows users to save games for later analysis
- Complex PGN support (variations)
- Add support for other chess engines
    - Leela Chess Zero
    - Others
    - Maybe even compare the evaluations of multiple engines
- Add support for more variants (low priority)

### Minor Features
- Add support for imports from Lichess
- Add support for importing games from PGN files
- Add FEN (Forsyth-Edwards Notation) support

## Stack
- Built with React, Vite, and Tailwind CSS
- Hosted using Google Firebase Hosting

## Contributing
Please contribute! I'm open to any and all contributions. Feel free to either implement a feature from the to-do list or suggest a new feature. If you find a bug, please open an issue.

## Long-Term Vision
I want to make eval.bar an analysis tool on par with or better than ChessBase, SCID, and other serious analysis tools. This is a lofty goal and will take a lot of work.