import './array-extensions';

const enum BarcodeCollectorMode { Waiting, Collecting, ShowingResult }

interface SingleRead {
    readonly format: string,
    readonly code: string,
    readCount: number,
}

export default class BarcodeCollector {
    private readonly reads = new Array<SingleRead>();

    private mode = BarcodeCollectorMode.Waiting;

    constructor(
        private readonly showCollectionStarting: (duration: number) => void,
        private readonly showResults: (format: string, code: string, reads: SingleRead[]) => void,
        private readonly hideResults: () => void) {
    }

    onDetected(format: string, code: string) {
        if (code.length == 0 || this.mode == BarcodeCollectorMode.ShowingResult) return;

        let entry = this.reads.find(r => r.format == format && r.code == code);
        if (!entry) this.reads.push(entry = { format, code, readCount: 0 });
        entry.readCount++;

        if (this.mode == BarcodeCollectorMode.Waiting
            && this.reads.some(r => r.format != 'upc_e' || r.readCount > 1)) {

            this.mode = BarcodeCollectorMode.Collecting;

            const duration = 700;
            this.showCollectionStarting(duration);
            setTimeout(() => this.onCollectionFinished(), duration);
        }
    }

    private onCollectionFinished() {
        this.mode = BarcodeCollectorMode.ShowingResult;

        // Prefer any other barcode before UPC-E due to the high rate of false positives
        const bestEntry = this.reads.maxBy(r => [r.format != 'upc_e', r.readCount])!;
        this.showResults(bestEntry.format, bestEntry.code, this.reads);
    }

    reset() {
        this.mode = BarcodeCollectorMode.Waiting;
        this.reads.length = 0;
        this.hideResults();
    }
}
