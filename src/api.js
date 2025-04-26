// api.js

import { API_BASE_URL } from './config'; // Ajusta la ruta según tu proyecto

/**
 * Expresión regular para validar correos electrónicos.
 * @constant {RegExp}
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Función genérica para realizar peticiones HTTP.
 * Lanza error si el status no es 2xx.
 *
 * @param {string} endpoint - Ruta relativa de la API (p.ej. '/api/casos').
 * @param {RequestInit} [options] - Opciones de fetch (método, headers, body, etc.).
 * @returns {Promise<any>} - JSON decodificado de la respuesta.
 * @throws {Error} - Si la respuesta HTTP falla o no se puede parsear JSON.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    credentials: 'include', // incluye cookies si las usas
    ...options,
  });

  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    throw new Error(`Error al parsear JSON de ${url}: ${err.message}`);
  }

  if (!response.ok) {
    const msg = payload?.error || JSON.stringify(payload);
    throw new Error(`HTTP ${response.status} - ${msg}`);
  }

  return payload;
}

/**
 * Obtiene todos los casos.
 *
 * @returns {Promise<Array>} Lista de casos.
 */
export function obtenerCasos() {
  return request('/api/casos', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });
}

/**
 * Crea un nuevo caso en el backend.
 * Realiza validaciones de campos obligatorios y formato de email.
 *
 * @param {object} datos - Datos del caso.
 * @param {string} datos.nombre - Nombre del evaluado.
 * @param {string} datos.telefono - Teléfono de contacto.
 * @param {string} datos.estado - Estado inicial del caso.
 * @param {string} [datos.email] - Email (opcional).
 * @returns {Promise<object>} Caso creado.
 */
export function crearCaso(datos) {
  // Validaciones básicas
  ['nombre', 'telefono', 'estado'].forEach(field => {
    if (!datos[field]) {
      throw new Error(`Falta el campo obligatorio: ${field}`);
    }
  });

  if (datos.email && !emailRegex.test(datos.email)) {
    throw new Error('El correo electrónico ingresado no es válido.');
  }

  return request('/api/casos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}

/**
 * Actualiza un caso existente.
 * Valida que se envíe el ID y el estado del caso.
 *
 * @param {string|number} id - ID del caso a actualizar.
 * @param {object} datos - Campos a actualizar.
 * @returns {Promise<object>} Caso actualizado.
 */
export function actualizarCaso(id, datos) {
  if (!id) throw new Error('ID del caso no proporcionado.');
  if (!datos.estado) throw new Error('Estado del caso no proporcionado.');

  return request(`/api/casos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}

/**
 * Sube un archivo de evidencia asociado a un caso.
 *
 * @param {string|number} id - ID del caso.
 * @param {File} archivo - Archivo de evidencia.
 * @returns {Promise<object>} Respuesta con URL de evidencia.
 */
export function subirEvidencia(id, archivo) {
  if (!id) throw new Error('ID del caso no proporcionado.');
  if (!archivo) throw new Error('Archivo de evidencia no proporcionado.');

  const form = new FormData();
  form.append('archivo', archivo);

  return request(`/api/casos/${id}/evidencia`, {
    method: 'POST',
    body: form,
  });
}

/**
 * Obtiene la URL del calendario desde la configuración de API.
 *
 * @returns {Promise<{ calendar_url: string }>} Objeto con la URL.
 */
export function obtenerCalendarUrl() {
  return request('/api/settings/calendar_url', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
}