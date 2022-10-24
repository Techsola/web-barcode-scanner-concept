export default class BarcodeCollector {
    private readonly results = new Array<{
        readonly format: string,
        readonly code: string,
        readCount: number,
    }>();

    constructor(
        private readonly showResults: (format: string, code: string) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0) return;

        let entry = this.results.find(r => r.format == format && r.code == code);
        if (!entry) this.results.push(entry = { format, code, readCount: 0 });
        entry.readCount++;

        const bestEntry = this.results.sort((a, b) => b.readCount - a.readCount)[0];
        this.showResults(bestEntry.format, bestEntry.code);
    }

    reset() {
        this.results.length = 0;
        this.hideResults();
    }
}
