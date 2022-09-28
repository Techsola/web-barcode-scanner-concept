import Quagga from '@ericblade/quagga2';

(async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment', width: 3480, height: 2160 },
    });

    const previewElement = document.getElementById('preview');
    previewElement.srcObject = stream;
    await previewElement.play();

    const barcodeDetector = new BarcodeDetector({
        formats: ['code_128', 'code_39', 'code_93', 'upc_a', 'upc_e'],
    });

    const resultOverlayElement = document.getElementById('result-overlay');
    const resultDisplayElement = document.getElementById('result-display');
    const results = new Map();

    document.getElementById('reset').onclick = function() {
        results.clear();
        resultOverlayElement.style.display = 'none';
    };

    while (true) {
        const barcodes = await barcodeDetector.detect(previewElement);
        const barcode = findNearestToCenter(barcodes);

        if (barcode != null) {
            const resultText = `${barcode.format} "<b>${barcode.rawValue}</b>"`;
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
        }
    }

    function findNearestToCenter(barcodes) {
        let nearest = null;
        let nearestDistance = 0;

        const videoCenter = previewElement.videoHeight / 2;

        for (const barcode of barcodes) {
            const barcodeCenter = barcode.boundingBox.y + barcode.boundingBox.height / 2;
            const distance = Math.abs(videoCenter - barcodeCenter);

            if (nearest == null || distance < nearestDistance) {
                nearest = barcode;
                nearestDistance = distance;
            }
        }

        return nearest;
    }
})();
