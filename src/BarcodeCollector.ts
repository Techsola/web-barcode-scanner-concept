export default class BarcodeCollector {
    private readonly results = new Map<string, number>();

    constructor(
        private readonly showResults: (resultHtml: string) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0) return;

        const resultText = `${format} "<b>${code}</b>"`;
        this.results.set(resultText, (this.results.get(resultText) || 0) + 1);

        this.showResults([...this.results.entries()].sort((a, b) => b[1] - a[1])[0][0]);
    }

    reset() {
        this.results.clear();
        this.hideResults();
    }
}
