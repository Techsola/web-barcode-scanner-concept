import Quagga from '@ericblade/quagga2';

(async function() {
    const previewContainer = document.getElementById('preview');

    await Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: { facingMode: 'environment', width: 1280 },
            target: previewContainer,
        },
        decoder: {
            readers: ['upc_reader', 'upc_e_reader', 'code_128_reader', 'code_39_reader', 'code_93_reader'],
        },
        numOfWorkers: navigator.hardwareConcurrency,
    });

    const resultElement = document.getElementById('result');

    let currentTimeout = null;
    let readCount = 0;

    Quagga.onDetected(function(result) {
        if (currentTimeout) clearTimeout(currentTimeout);

        readCount++;
        resultElement.innerText = readCount + ': ' + result.codeResult.format + ' ' + result.codeResult.code;

        currentTimeout = setTimeout(function() { resultElement.innerText = 'No result'; }, 200);
    });

    Quagga.start();
})();
