// stockfishManager.js
export class StockfishManager {
    constructor(onAnalysis) {
        this.worker = null;
        this.onAnalysis = onAnalysis;
    }

    init() {
        if (!this.worker) {
            this.worker = new Worker('stockfishWorker.js');
            this.worker.addEventListener('message', this.handleMessage);
            this.sendCommand('uci');
            this.sendCommand('isready');
            this.sendCommand('ucinewgame');
        }
    }

    handleMessage = (event) => {
        const message = event.data;

        // Parse Stockfish output
        const depthMatch = message.match(/info depth (\d+)/);
        const scoreMatch = message.match(/score cp (-?\d+)/);

        if (depthMatch && scoreMatch) {
            const depth = parseInt(depthMatch[1]);
            const evaluation = parseInt(scoreMatch[1]) / 100;

            this.onAnalysis({
                depth,
                evaluation,
                isAnalyzing: true
            });
        }
    }

    analyzeFen(fen) {
        this.sendCommand('position fen ' + fen);
        this.sendCommand('go depth 20');
    }

    sendCommand(cmd) {
        if (this.worker) {
            this.worker.postMessage(cmd);
        }
    }

    stop() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
}