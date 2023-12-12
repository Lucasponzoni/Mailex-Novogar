document.addEventListener('DOMContentLoaded', function () {
    const printButton = document.getElementById('printButton');
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none';

    printButton.addEventListener('click', function () {
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = ''; // Limpiar el contenido antes de cargar de nuevo

        spinner.style.display = 'block';
        setTimeout(() => {
            const apiToken = 'K83ClpymGxQ9IvVoVW4hNs51hJQVIaM8L98V0Bp5kOYeuXMFPle9f28wUCic';
            const numeroEtiqueta = document.getElementById('numeroEtiqueta').value;

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
                return response.text();
            })
            .then(data => {
                const modifiedData = data.replaceAll('<img src="https://mexlv.epresis.com/uploads//logo_pdf/xtEe54u0WCBmmPFILietaa90P.jpg" height="50">', '<img src="./img/LogoMailexconNovogar.png" height="63">')
                    .replaceAll('Remitente', 'NOVOGAR WEB')
                    .replaceAll('Destinatario', 'DESTINATARIO')
                    .replaceAll('margin-top: 50px', 'margin-top: 0')
                    .replaceAll('HORARIO:  -', '');


                const displayArea = document.createElement('div');
                displayArea.innerHTML = modifiedData;

                const previewContainer = document.getElementById('previewContainer');
                previewContainer.innerHTML = '';
                previewContainer.appendChild(displayArea);

                        // Eliminar el borde de la clase .box si existe
                const boxes = displayArea.querySelectorAll('.box');
                boxes.forEach(box => {
                box.style.border = 'solid black 3px'; // Corrección: 'backgroundColor' en lugar de 'background'
                });


                const destinatarioElement = displayArea.querySelector('.dato.destinatario');
                if (destinatarioElement) {
                    const destinatarioNombre = destinatarioElement.textContent.trim().toUpperCase();
                    const nuevoTexto = `${destinatarioNombre}`;
                    destinatarioElement.textContent = nuevoTexto;

                    const contentWidth = 10;
                    const contentHeight = 15;

                    const heightInCm = contentHeight / 1;

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

                // Ocultar el spinner después de procesar la respuesta
                spinner.style.display = 'none';
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
                // En caso de error, ocultar el spinner también
                spinner.style.display = 'none';
            });
        }, 1000); // Esperar al menos 1 segundo antes de realizar la solicitud a la API
    });
});

