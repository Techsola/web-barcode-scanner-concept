export default class BarcodeCollector {
    private readonly results = new Array<{
        readonly format: string,
        readonly code: string,
        readCount: number,
    }>();

    private showingResults = false;

    constructor(
        private readonly showCollectionStarting: (duration: number) => void,
        private readonly showResults: (format: string, code: string) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0 || this.showingResults) return;

        if (this.results.length == 0) {
            const duration = 700;
            this.showCollectionStarting(duration);
            setTimeout(() => {
                this.showingResults = true;
                const bestEntry = this.results.sort((a, b) => b.readCount - a.readCount)[0];
                this.showResults(bestEntry.format, bestEntry.code);
            }, duration);
        }

        let entry = this.results.find(r => r.format == format && r.code == code);
        if (!entry) this.results.push(entry = { format, code, readCount: 0 });
        entry.readCount++;
    }

    reset() {
        this.showingResults = false;
        this.results.length = 0;
        this.hideResults();
    }
}
