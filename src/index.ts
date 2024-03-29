import Quagga from '@ericblade/quagga2';
import BarcodeCollector from './BarcodeCollector';

(async function() {
    const previewContainer = document.getElementById('preview')!;
    const collectionProgressAnimation = document.getElementById('collection-progress') as unknown as SVGAnimationElement;
    const resultOverlayElement = document.getElementById('result-overlay')!;
    const resultDisplayElement = document.getElementById('result-display')!;

    const barcodeCollector = new BarcodeCollector(
        duration => {
            collectionProgressAnimation.setAttribute('dur', duration + 'ms');
            collectionProgressAnimation.beginElement();
        },
        (format, code, reads) => {
            const formatDisplay = format.startsWith('code_')
                ? 'Code ' + format.slice('code_'.length)
                : format.replace('_', '-').toUpperCase();

            let html = `${formatDisplay} "<b>${code}</b>"`;

            if (new URLSearchParams(window.location.search).get("debug") != null) {
                html += '<span class="debug">';

                for (const read of reads)
                    html += `<br>${read.format} "<b>${read.code}</b>" (${read.readCount} reads)`;

                html += '</span>';
            }

            resultDisplayElement.innerHTML = html;
            resultOverlayElement.style.display = '';
            if ('vibrate' in navigator) navigator.vibrate(50);
        },
        () => resultOverlayElement.style.display = 'none',
    );

    document.getElementById('reset')!.onclick = () => barcodeCollector.reset();

    Quagga.onDetected(result => {
        if (result.codeResult.code)
            barcodeCollector.onDetected(result.codeResult.format, result.codeResult.code);
    });

    await initializeAndStartQuagga();

    if ('orientation' in screen) {
        screen.orientation.addEventListener('change', async () => {
            Quagga.stop();
            await initializeAndStartQuagga();
        }, false);
    };

    async function initializeAndStartQuagga() {
        const isLandscape = 'orientation' in screen
            ? screen.orientation.type == 'landscape-primary' || screen.orientation.type == 'landscape-secondary'
            : undefined;

        await Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: { facingMode: 'environment', width: 1280 },
                target: previewContainer,
                area: isLandscape
                    ? { left: "30%", top: "40%", right: "30%", bottom: "40%" }
                    : { top: "40%", bottom: "40%" },
            },
            decoder: {
                readers: ['i2of5_reader', 'upc_reader', 'code_128_reader', 'code_39_reader', 'code_93_reader', 'upc_e_reader'],
            },
            frequency: 5,
            numOfWorkers: navigator.hardwareConcurrency,
        });

        Quagga.start();
    }
})();
