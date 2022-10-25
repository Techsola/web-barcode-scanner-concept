import './array-extensions';

const enum BarcodeCollectorMode { Waiting, Collecting, ShowingResult }

export default class BarcodeCollector {
    private readonly results = new Array<{
        readonly format: string,
        readonly code: string,
        readCount: number,
    }>();

    private mode = BarcodeCollectorMode.Waiting;

    constructor(
        private readonly showCollectionStarting: (duration: number) => void,
        private readonly showResults: (format: string, code: string) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0 || this.mode == BarcodeCollectorMode.ShowingResult) return;

        let entry = this.results.find(r => r.format == format && r.code == code);
        if (!entry) this.results.push(entry = { format, code, readCount: 0 });
        entry.readCount++;

        if (this.mode == BarcodeCollectorMode.Waiting
            && this.results.some(r => r.format != 'upc_e' || r.readCount > 1)) {

            this.mode = BarcodeCollectorMode.Collecting;

            const duration = 700;
            this.showCollectionStarting(duration);
            setTimeout(() => this.onCollectionFinished(), duration);
        }
    }

    private onCollectionFinished() {
        this.mode = BarcodeCollectorMode.ShowingResult;
        const bestEntry = this.results.maxBy(r => r.readCount)!;
        this.showResults(bestEntry.format, bestEntry.code);
    }

    reset() {
        this.mode = BarcodeCollectorMode.Waiting;
        this.results.length = 0;
        this.hideResults();
    }
}
