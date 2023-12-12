document.getElementById('printButton').addEventListener('click', function () {
    const apiToken = 'K83ClpymGxQ9IvVoVW4hNs51hJQVIaM8L98V0Bp5kOYeuXMFPle9f28wUCic';
    const numeroEtiqueta = document.getElementById('numeroEtiqueta').value; // Obtener el número de etiqueta ingresado

    const requestData = {
        api_token: apiToken,
        ids: numeroEtiqueta
    };

    fetch('https://mexlv.epresis.com/api/v1/public/print_etiquetas.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Obtener la respuesta como texto HTML
    })
    .then(data => {
        const modifiedData = data.replaceAll('<img src="https://mexlv.epresis.com/uploads//logo_pdf/xtEe54u0WCBmmPFILietaa90P.jpg" height="50">', '<img src="./img/LogoMailexconNovogar.png" height="65">')
            .replaceAll('Remitente', 'NOVOGAR WEB')
            .replaceAll('Destinatario', 'DESTINATARIO')
            .replaceAll('margin-top: 50px', 'margin-top: 0')
            .replaceAll('HORARIO:  -', '');

        const displayArea = document.createElement('div');
        displayArea.innerHTML = modifiedData;

        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(displayArea);

        const destinatarioElement = displayArea.querySelector('.dato.destinatario');
        if (destinatarioElement) {
            const destinatarioNombre = destinatarioElement.textContent.trim().toUpperCase();
            const nuevoTexto = `${destinatarioNombre}`;
            destinatarioElement.textContent = nuevoTexto;

            const contentWidth = 10; // Ancho del PDF en centímetros (10 cm)
            const contentHeight = 15; // Alto del PDF en centímetros (15 cm)

            const heightInCm = contentHeight / 1; // Convertir pulgadas a centímetros

            const moveUpDistance = 0;
            let moveLeftDistance = 0;
            let moveRightDistance = 0;

            if (document.querySelectorAll('.no-page-break')) {
                moveLeftDistance = -0.2;
            }

            displayArea.style.position = 'relative';
            displayArea.style.top = `${moveUpDistance}cm`;
            displayArea.style.left = `${moveLeftDistance}cm`;
            displayArea.style.right = `${moveRightDistance}cm`;

            const opt = {
                margin: 0,
                filename: `${destinatarioNombre} - Etiqueta.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 4 },
                jsPDF: { unit: 'cm', format: [contentWidth, heightInCm], orientation: 'portrait' }
            };

            html2pdf().from(displayArea).set(opt).save();
            displayArea.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
    });
});
