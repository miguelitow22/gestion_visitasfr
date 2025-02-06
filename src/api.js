import API_BASE_URL from './main.jsx';


// ✅ Expresión regular para validar emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Función para manejar respuestas y errores HTTP
async function handleResponse(response) {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            console.error("❌ Respuesta del backend:", errorData);
            throw new Error(`❌ Error HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        } catch {
            throw new Error(`❌ Error HTTP ${response.status}: Respuesta no válida`);
        }
    }
    return response.json();
}

// 🔹 Obtener todos los casos con manejo de errores mejorado
export async function obtenerCasos() {
    try {
        const response = await fetch(`${API_BASE_URL}/casos`, {
            method: "GET",
            headers: { "Accept": "application/json" },
            cache: "no-store",
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Error en obtenerCasos:", error);
        return [];
    }
}

// 🔹 Crear un caso con validaciones y manejo de errores
export async function crearCaso(datosCaso) {
    try {
        const camposRequeridos = ["id", "nombre", "telefono", "email", "estado"];
        for (const campo of camposRequeridos) {
            if (!datosCaso[campo]) {
                throw new Error(`❌ Falta el campo obligatorio: ${campo}`);
            }
        }

        // ✅ Validar formato de email antes de enviarlo
        if (!emailRegex.test(datosCaso.email)) {
            throw new Error("❌ El correo electrónico ingresado no es válido.");
        }

        const response = await fetch(`${API_BASE_URL}/casos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: datosCaso.id,
                nombre: datosCaso.nombre,
                documento: datosCaso.documento || "",
                telefono: datosCaso.telefono,
                email: datosCaso.email,
                estado: datosCaso.estado,
                tipo_visita: datosCaso.tipo_visita || "",
                direccion: datosCaso.direccion || "",
                punto_referencia: datosCaso.punto_referencia || "",
                fecha_visita: datosCaso.fecha_visita || "",
                hora_visita: datosCaso.hora_visita || "",
                intentos_contacto: datosCaso.intentos_contacto || 0,
                motivo_no_programacion: datosCaso.motivo_no_programacion || "",
                evaluador_email: datosCaso.evaluador_email || "",
                evaluador_asignado: datosCaso.evaluador_asignado || "",
            }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Error en crearCaso:", error);
        return null;
    }
}

// 🔹 Actualizar un caso con validaciones mejoradas
export async function actualizarCaso(id, datos) {
    try {
        if (!id) throw new Error("❌ ID del caso no proporcionado.");
        if (!datos.estado) throw new Error("❌ Estado del caso no proporcionado.");

        const response = await fetch(`${API_BASE_URL}/casos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                estado: datos.estado,
                tipo_visita: datos.tipo_visita || "",
                direccion: datos.direccion || "",
                punto_referencia: datos.punto_referencia || "",
                fecha_visita: datos.fecha_visita || "",
                hora_visita: datos.hora_visita || "",
                intentos_contacto: datos.intentos_contacto || 0,
                motivo_no_programacion: datos.motivo_no_programacion || "",
                evaluador_asignado: datos.evaluador_asignado || "",
            }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Error en actualizarCaso:", error);
        return null;
    }
}

// 🔹 Subir evidencia para un caso con validaciones
export async function subirEvidencia(id, archivo) {
    try {
        if (!id) throw new Error("❌ ID del caso no proporcionado.");
        if (!archivo) throw new Error("❌ Archivo de evidencia no proporcionado.");

        const formData = new FormData();
        formData.append("archivo", archivo);

        const response = await fetch(`${API_BASE_URL}/casos/${id}/evidencia`, {
            method: "POST",
            body: formData,
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Error en subirEvidencia:", error);
        return null;
    }
}
