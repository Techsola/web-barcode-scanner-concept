export default class BarcodeCollector {
    private readonly results = new Array<{ readonly resultHtml: string, readCount: number }>();

    constructor(
        private readonly showResults: (resultHtml: string) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0) return;

        const resultHtml = `${format} "<b>${code}</b>"`;

        let entry = this.results.find(r => r.resultHtml == resultHtml);
        if (!entry) this.results.push(entry = { resultHtml, readCount: 0 });
        entry.readCount++;

        this.showResults(this.results.sort((a, b) => b.readCount - a.readCount)[0].resultHtml);
    }

    reset() {
        this.results.length = 0;
        this.hideResults();
    }
}
