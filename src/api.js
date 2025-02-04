const API_URL = "https://gestionvisitas-production.up.railway.app";  // ⚠️ Reemplaza con tu URL de producción

// ✅ Obtener todos los casos
export const obtenerCasos = async () => {
    try {
        const response = await fetch(`${API_URL}/casos`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los casos:", error);
        return [];
    }
};

// ✅ Crear un nuevo caso con ID personalizado
export const crearCaso = async (caso) => {
    try {
        const response = await fetch(`${API_URL}/casos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(caso),
        });

        return await response.json();
    } catch (error) {
        console.error("Error al crear el caso:", error);
        return null;
    }
};

// ✅ Actualizar un caso existente
export const actualizarCaso = async (id, datos) => {
    try {
        const response = await fetch(`${API_URL}/casos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el caso:", error);
        return null;
    }
};

// ✅ Subir evidencia para un caso
export const subirEvidencia = async (id, archivo) => {
    try {
        const formData = new FormData();
        formData.append("archivo", archivo);

        const response = await fetch(`${API_URL}/casos/${id}/evidencia`, {
            method: "POST",
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Error al subir la evidencia:", error);
        return null;
    }
};
