import Quagga from '@ericblade/quagga2';
import BarcodeCollector from './BarcodeCollector';

(async function() {
    const previewContainer = document.getElementById('preview')!;

    await Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: { facingMode: 'environment', width: 1280 },
            target: previewContainer,
            area: { top: "40%", bottom: "40%" },
        },
        decoder: {
            readers: ['upc_reader', 'upc_e_reader', 'code_128_reader', 'code_39_reader', 'code_93_reader'],
        },
        numOfWorkers: navigator.hardwareConcurrency,
    });

    const collectionProgressAnimation = document.getElementById('collection-progress') as unknown as SVGAnimationElement;
    const resultOverlayElement = document.getElementById('result-overlay')!;
    const resultDisplayElement = document.getElementById('result-display')!;

    const barcodeCollector = new BarcodeCollector(
        () => collectionProgressAnimation.beginElement(),
        (format, code) => {
            resultDisplayElement.innerHTML = `${format} "<b>${code}</b>"`;
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

    Quagga.start();
})();
