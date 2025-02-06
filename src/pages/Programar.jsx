import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

function Programar() {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [calendarError, setCalendarError] = useState(false);
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc_c_QPVfV0LyH5eLN85Ww8ZVkb2XNaDwsnU5Mz9EXq-eyFbw/viewform?embedded=true";

  useEffect(() => {
    async function fetchCalendarUrl() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("settings").select("calendar_url").single();

        if (error || !data?.calendar_url) {
          console.error("❌ Error cargando el calendario:", error?.message || "No se encontró un calendario en Supabase.");
          setCalendarError(true);
          return;
        }

        setCalendarUrl(data.calendar_url);
      } catch (error) {
        console.error("❌ Error inesperado al cargar el calendario:", error.message);
        setCalendarError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (!calendarUrl) fetchCalendarUrl();
  }, [calendarUrl]);

  return (
    <div className="container programar-container">
      <h2>Programar visitas domiciliarias</h2>

      <section className="programar-section">
        <h3>Verificar disponibilidad</h3>
        <p>Consulta el calendario para verificar la disponibilidad de los analistas.</p>
        {isLoading ? (
          <p>Cargando calendario...</p>
        ) : calendarError ? (
          <p style={{ color: "red" }}>No se pudo cargar el calendario. Verifica la configuración en Supabase.</p>
        ) : (
          <iframe
            src={calendarUrl}
            title="Calendario de Disponibilidad"
            style={{ border: 0, width: "100%", height: "400px" }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
        )}
        {calendarUrl && (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
          >
            Abrir en Google Calendar
          </a>
        )}
      </section>

      <section className="programar-section">
        <h3>Formulario de Programación de Visitas</h3>
        <p>Llena el siguiente formulario para registrar la programación de la visita.</p>
        <a
          href={googleFormUrl}
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Formato digital
        </a>
      </section>
    </div>
  );
}

export default Programar;
