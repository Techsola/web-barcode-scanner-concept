import Quagga from '@ericblade/quagga2';

(async function() {
    const previewContainer = document.getElementById('preview');

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

    const resultOverlayElement = document.getElementById('result-overlay');
    const resultDisplayElement = document.getElementById('result-display');
    const results = new Map();

    document.getElementById('reset').onclick = function() {
        results.clear();
        resultOverlayElement.style.display = 'none';
    };

    Quagga.onDetected(function(result) {
        const resultText = `${result.codeResult.format} "<b>${result.codeResult.code}</b>"`;
        results.set(resultText, (results.get(resultText) || 0) + 1);

        resultDisplayElement.innerHTML = [...results.entries()]
            .sort((a, b) => b[1] - a[1])
            .splice(0, 3)
            .map(entry => `${entry[0]} (${entry[1]} reads)`)
            .join('<br>');

        if (resultOverlayElement.style.display == 'none') {
            resultOverlayElement.style.display = null;
            if ('vibrate' in navigator) navigator.vibrate(50);
        }
    });

    Quagga.start();
})();
