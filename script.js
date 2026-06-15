// =========================================================================
// CONFIGURACIÓN: Pega aquí la URL exacta que te dio Google Apps Script
// =========================================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE9rlfDeM0YQxzYN-glgEufYp1XRljTdxN3wYXAigAgcUtp_FRW-xzcRTm8uWPdKy9/exec";

const factoresAsociados = [
    "1. He sentido presión por parte de mis amigos/as o pareja para tener relaciones sexuales sin usar protección (condón).",
    "2. Creo que en una relación heterosexual, la responsabilidad de proponer y usar métodos anticonceptivos recae principalmente en la mujer.",
    "3. Considero que un hombre que insiste mucho en usar condón puede ser visto como desconfiado o exagerado.",
    "4. En mi hogar, recibí una comunicación abierta y de apoyo sobre la sexualidad y la importancia de los métodos de protección. (*)",
    "5. En general, estoy satisfecho/a conmigo mismo/a y siento que soy una persona valiosa. (*)",
    "6. Con frecuencia, tomo decisiones sobre mis encuentros sexuales de forma impulsiva, sin meditar mucho en las posibles consecuencias.",
    "7. Me atrae la idea de vivir experiencias sexuales novedosas y excitantes, incluso si estas conllevan ciertos riesgos.",
    "8. Me siento completamente seguro/a de mi habilidad para negociar el uso del condón con una pareja sexual. (*)",
    "9. Si mi pareja se opusiera a usar condón, me resultaría muy difícil insistir o negarme a tener la relación sexual.",
    "10. En el campus universitario o en sus alrededores, me resulta fácil y accesible conseguir preservativos (ej. dispensadores, botiquín, farmacias cercanas).",
    "11. Siento que existe un ambiente de confianza y privacidad en la universidad para acudir a los servicios de salud o bienestar estudiantil por consejería sexual.",
    "12. Considero que el consumo de alcohol es una parte central y normalizada en los eventos sociales y fiestas de los estudiantes de mi facultad."
];

const escalaFactores = [
    { valor: 1, texto: "Totalmente en desacuerdo" },
    { valor: 2, texto: "En desacuerdo" },
    { valor: 3, texto: "Neutral" },
    { valor: 4, texto: "De acuerdo" },
    { valor: 5, texto: "Totalmente de acuerdo" }
];

function renderizarPreguntas(arrayPreguntas, contenedorId, prefijoName, opcionesArr) {
    const contenedor = document.getElementById(contenedorId);
    let html = "";

    arrayPreguntas.forEach((pregunta, index) => {
        let name = `${prefijoName}${index + 1}`; 
        // Añadimos un delay progresivo para el efecto cascada (0.1s, 0.2s, etc.)
        let delay = index * 0.1; 
        
        html += `
        <div class="question-block" style="animation-delay: ${delay}s">
            <p class="question-text">${pregunta}</p>
            <div class="likert-options">`;
        
        opcionesArr.forEach(opc => {
            html += `
                <label class="likert-option">
                    <input type="radio" name="${name}" value="${opc.valor}" required>
                    <span class="likert-label">${opc.texto}</span>
                </label>`;
        });
        
        html += `
            </div>
        </div>`;
    });
    contenedor.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarPreguntas(factoresAsociados, 'preguntas-fa', 'fa', escalaFactores);

    const modalOverlay = document.getElementById('modal-overlay');
    const consentTextBox = document.getElementById('consent-text-box');
    const consentWrapper = document.getElementById('consent-wrapper');
    const consentCheckbox = document.getElementById('consent-checkbox');
    const btnAcceptModal = document.getElementById('btn-accept-modal');
    const scrollNotice = document.getElementById('scroll-notice');
    const mainSurveyContent = document.getElementById('main-survey-content');
    
    const surveyForm = document.getElementById('survey-form');
    const btnSubmit = document.getElementById('btn-submit');
    const loadingMsg = document.getElementById('loading-msg');
    const successScreen = document.getElementById('success-screen');

    // 1. Validar scroll para desbloquear el checkbox
    consentTextBox.addEventListener('scroll', function() {
        if (this.scrollHeight - this.scrollTop <= this.clientHeight + 5) {
            consentWrapper.classList.add('unlocked');
            consentCheckbox.disabled = false;
            scrollNotice.style.opacity = '0';
            setTimeout(() => scrollNotice.style.display = 'none', 300);
        }
    });

    // 2. Validar checkbox para desbloquear el botón
    consentCheckbox.addEventListener('change', function() {
        btnAcceptModal.disabled = !this.checked;
    });

    // 3. Iniciar la encuesta
    btnAcceptModal.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        mainSurveyContent.style.display = 'block';
        window.scrollTo(0, 0);
    });

    // 4. Enviar respuestas
    surveyForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        btnSubmit.disabled = true;
        loadingMsg.style.display = 'block';

        let respuestasExtraidas = [];
        
        // Relleno de las 23 variables del SRS para mantener la matriz intacta
        for(let i = 0; i < 23; i++) {
            respuestasExtraidas.push(""); 
        }
        
        for(let i = 1; i <= factoresAsociados.length; i++) {
            let seleccion = document.querySelector(`input[name="fa${i}"]:checked`);
            respuestasExtraidas.push(seleccion ? seleccion.value : "");
        }

        const datosEncuesta = {
            consentimiento: "Aceptado",
            respuestas: respuestasExtraidas 
        };

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "cors", 
                headers: {
                    "Content-Type": "text/plain;charset=utf-8" 
                },
                body: JSON.stringify(datosEncuesta)
            });

            const resultado = await response.json();

            if (resultado.status === "success") {
                mainSurveyContent.style.display = 'none';
                successScreen.style.display = 'block';
                window.scrollTo(0, 0);
            } else {
                alert("Error al procesar los datos. Inténtalo de nuevo.");
                btnSubmit.disabled = false;
                loadingMsg.style.display = 'none';
            }

        } catch (error) {
            alert("Error de conexión. Verifica tu internet y vuelve a intentarlo.");
            btnSubmit.disabled = false;
            loadingMsg.style.display = 'none';
        }
    });
});