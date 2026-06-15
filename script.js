// =========================================================================
// CONFIGURACIÓN: Pega aquí la URL exacta que te dio Google Apps Script
// =========================================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE9rlfDeM0YQxzYN-glgEufYp1XRljTdxN3wYXAigAgcUtp_FRW-xzcRTm8uWPdKy9/exec";

// 1. BASE DE DATOS DE PREGUNTAS (Extraídas fielmente del instrumento)
const conductasSexuales = [
    "1. ¿Con cuántas parejas ha participado en conductas sexuales pero no ha tenido relaciones sexuales?",
    "2. ¿Cuántas veces ha dejado un evento social con alguien que acababa de conocer?",
    "3. ¿Cuántas veces ha 'conectado' pero no ha tenido sexo con alguien que no conocía o no conocía bien?",
    "4. ¿Cuántas veces ha salido a bares/fiestas/eventos sociales con la intención de 'conectar' y participar en comportamiento sexual pero sin tener relaciones sexuales?",
    "5. ¿Cuántas veces ha salido a bares/fiestas/eventos sociales con la intención de 'conectar' y tener relaciones sexuales con alguien?",
    "6. ¿Cuántas veces ha tenido una experiencia sexual inesperada o imprevista?",
    "7. ¿Cuántas veces ha tenido un encuentro sexual voluntario del que luego se arrepintió?",
    "8. ¿Con cuántas parejas ha tenido relaciones sexuales?",
    "9. ¿Cuántas veces ha tenido relaciones sexuales vaginales sin condón de látex o poliuretano?",
    "10. ¿Cuántas veces ha tenido relaciones sexuales vaginales sin protección contra el embarazo?",
    "11. ¿Cuántas veces ha dado o recibido sexo oral a un hombre (felación) sin condón?",
    "12. ¿Cuántas veces ha dado o recibido sexo oral a una mujer (cunnilingus) sin protección adecuada (presa dental)?",
    "13. ¿Cuántas veces ha tenido sexo anal sin condón?",
    "14. ¿Cuántas veces usted o su pareja han practicado fisting u otro tipo de penetración anal con objeto sin protección, seguido de sexo anal sin protección?",
    "15. ¿Cuántas veces ha dado o recibido rimming (anilingus) sin protección adecuada (presa dental)?",
    "16. ¿Con cuántas personas ha tenido sexo sin estar en una relación (ej. amigos con beneficios)?",
    "17. ¿Cuántas veces ha tenido sexo con alguien que no conocía bien o que acababa de conocer?",
    "18. ¿Cuántas veces usted o su pareja usaron alcohol o drogas antes o durante el sexo?",
    "19. ¿Cuántas veces ha tenido sexo con una nueva pareja sin antes discutir historia sexual, uso de drogas IV, ITS o parejas actuales?",
    "20. ¿Cuántas veces ha tenido sexo (que sepa) con alguien que tuvo muchas parejas sexuales?",
    "21. ¿Con cuántas parejas ha tenido sexo sin que se hayan realizado pruebas de ITS/VIH previamente (aunque hayan sido sexualmente activos antes)?",
    "22. ¿Con cuántas parejas ha tenido sexo en las que no confiaba plenamente?",
    "23. ¿Cuántas veces (que sepa) ha tenido sexo con alguien que también mantenía relaciones sexuales con otras personas durante el mismo periodo?"
];

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

// 2. CONFIGURACIÓN DE LAS ESCALAS DE RESPUESTA
const escalaConductas = [
    { valor: 0, texto: "Nunca (0)" },
    { valor: 1, texto: "1 vez" },
    { valor: 2, texto: "2 a 3 veces" },
    { valor: 3, texto: "4 a 5 veces" },
    { valor: 4, texto: "6 a 10 veces" },
    { valor: 5, texto: "Más de 10" }
];

const escalaFactores = [
    { valor: 1, texto: "Totalmente en desacuerdo" },
    { valor: 2, texto: "En desacuerdo" },
    { valor: 3, texto: "Neutral" },
    { valor: 4, texto: "De acuerdo" },
    { valor: 5, texto: "Totalmente de acuerdo" }
];

// 3. MOTOR DE RENDERIZADO DEL FORMULARIO
function renderizarPreguntas(arrayPreguntas, contenedorId, prefijoName, opcionesArr) {
    const contenedor = document.getElementById(contenedorId);
    let html = "";

    arrayPreguntas.forEach((pregunta, index) => {
        let name = `${prefijoName}${index + 1}`; 
        html += `
        <div class="question-block">
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

// 4. INICIALIZACIÓN Y MANEJO DEL DOM
document.addEventListener("DOMContentLoaded", () => {
    // Dibujar preguntas al cargar la página
    renderizarPreguntas(conductasSexuales, 'preguntas-cs', 'cs', escalaConductas);
    renderizarPreguntas(factoresAsociados, 'preguntas-fa', 'fa', escalaFactores);

    // Controles de interfaz
    const consentCheckbox = document.getElementById('consent-checkbox');
    const btnStart = document.getElementById('btn-start');
    const consentCard = document.getElementById('consent-card');
    const surveySection = document.getElementById('survey-section');
    const surveyForm = document.getElementById('survey-form');
    const btnSubmit = document.getElementById('btn-submit');
    const loadingMsg = document.getElementById('loading-msg');
    const successScreen = document.getElementById('success-screen');

    // Lógica del consentimiento
    consentCheckbox.addEventListener('change', function() {
        btnStart.disabled = !this.checked;
    });

    btnStart.addEventListener('click', function(e) {
        e.preventDefault();
        consentCard.style.display = 'none';
        surveySection.style.display = 'block';
        window.scrollTo(0, 0);
    });

    // Lógica de envío de datos (Submit)
    surveyForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        btnSubmit.disabled = true;
        loadingMsg.style.display = 'block';

        let respuestasExtraidas = [];
        
        // Extraer respuestas de Conductas Sexuales (23 ítems)
        for(let i = 1; i <= conductasSexuales.length; i++) {
            let seleccion = document.querySelector(`input[name="cs${i}"]:checked`);
            respuestasExtraidas.push(seleccion ? seleccion.value : "");
        }
        
        // Extraer respuestas de Factores Asociados (12 ítems)
        for(let i = 1; i <= factoresAsociados.length; i++) {
            let seleccion = document.querySelector(`input[name="fa${i}"]:checked`);
            respuestasExtraidas.push(seleccion ? seleccion.value : "");
        }

        // Estructura exacta que espera Google Apps Script
        const datosEncuesta = {
            consentimiento: consentCheckbox.checked ? "Aceptado" : "No Aceptado",
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
                surveySection.style.display = 'none';
                successScreen.style.display = 'block';
                window.scrollTo(0, 0);
            } else {
                console.error("Error del servidor:", resultado.message);
                alert("Error al procesar los datos en el servidor. Inténtalo de nuevo.");
                btnSubmit.disabled = false;
                loadingMsg.style.display = 'none';
            }

        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión. Verifica tu internet y vuelve a intentarlo.");
            btnSubmit.disabled = false;
            loadingMsg.style.display = 'none';
        }
    });
});