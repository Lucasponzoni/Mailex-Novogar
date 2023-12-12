document.getElementById('printButton').addEventListener('click', function () {
    const apiToken = 'K83ClpymGxQ9IvVoVW4hNs51hJQVIaM8L98V0Bp5kOYeuXMFPle9f28wUCic';
    const guiaIds = '101943489';

    const requestData = {
        api_token: apiToken,
        ids: guiaIds
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
        // Realizar modificaciones al HTML recibido en cada página
        const modifiedData = data
            .replaceAll('<img src="https://mexlv.epresis.com/uploads//logo_pdf/xtEe54u0WCBmmPFILietaa90P.jpg" height="50">', '<img src="./img/LogoMailexconNovogar.png" height="60">')
            .replaceAll('Remitente', 'NOVOGAR WEB')
            .replaceAll('margin-top: 50px', 'margin-top: 0')
            .replaceAll('HORARIO:  -', ''); // Realizar todos los reemplazos necesarios

        // Mostrar la etiqueta modificada en pantalla
        const displayArea = document.createElement('div');
        displayArea.innerHTML = modifiedData;
        document.body.appendChild(displayArea);

        // Obtener el ancho del contenido modificado
        const contentWidth = 10; // Ancho del PDF en centímetros (10 cm)
        const contentHeight = 15; // Alto del PDF en centímetros (15 cm)

        // Calcular la altura en centímetros (1 pulgada = 2.54 cm)
        const heightInCm = contentHeight / 1; // Convertir pulgadas a centímetros

        // Mover el contenido hacia arriba (por ejemplo, 2 cm)
        const moveUpDistance = 0; // Cambia este valor según sea necesario

        // Determinar la distancia lateral según la cantidad de páginas o la altura sobrepasando los 15 cm
        const pages = displayArea.querySelectorAll('.clase-que-identifica-las-paginas');
        let moveLeftDistance = 0; // Valor predeterminado si no se cumple ninguna condición

        if (document.querySelector('.no-page-break')) {
            moveLeftDistance = -0.2; // Aplicar -0.2 si existe la etiqueta no-page-break
        }
        
        // Aplicar estilo para mover hacia arriba y lateralmente
        displayArea.style.position = 'relative';
        displayArea.style.top = `${moveUpDistance}cm`;
        displayArea.style.left = `${moveLeftDistance}cm`;

        // Obtener la primera etiqueta destinatario y modificar el texto
        const destinatarioElement = displayArea.querySelector('.dato.destinatario');
        if (destinatarioElement) {
            const destinatarioNombre = destinatarioElement.textContent.trim().toUpperCase();
            const nuevoTexto = `${destinatarioNombre}`;
            destinatarioElement.textContent = nuevoTexto;

            // Convertir el HTML modificado a PDF usando html2pdf.js
            const opt = {
                margin: 0,
                filename: `${destinatarioNombre} - Etiqueta.pdf`, // Usar interpolación de cadenas
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 4 },
                jsPDF: { unit: 'cm', format: [contentWidth, heightInCm], orientation: 'portrait' }
                // Ajusta el formato del PDF según tus necesidades
            };

            html2pdf().from(displayArea).set(opt).save(); // Convertir todas las páginas al PDF

            // Mostrar la etiqueta en pantalla
            displayArea.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
        // Manejar errores aquí
    });
});
