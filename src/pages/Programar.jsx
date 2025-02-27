import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { crearCaso } from "../api";
import "../styles.css"; // Asegúrate de que este archivo se importe correctamente desde main

const evaluadores = [
  { nombre: "Jairo", correo: "jairo@empresa.com" },
  { nombre: "Ana", correo: "ana@empresa.com" },
  { nombre: "Carlos", correo: "carlos@empresa.com" }
];

function Programar() {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [calendarError, setCalendarError] = useState(false);
  const [casoId] = useState(uuidv4());
  const [solicitudAtlas, setSolicitudAtlas] = useState("");
  const [programador, setProgramador] = useState("HENRY MEDINA");
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoSecundario, setTelefonoSecundario] = useState("");
  const [telefonoTerciario, setTelefonoTerciario] = useState("");
  const [email, setEmail] = useState("");
  const [seContacto, setSeContacto] = useState("");
  const [tipoVisita, setTipoVisita] = useState("Ingreso");
  const [intentoContacto, setIntentoContacto] = useState("1");
  const [motivoNoContacto, setMotivoNoContacto] = useState("");
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [direccion, setDireccion] = useState("");
  const [puntoReferencia, setPuntoReferencia] = useState("");
  const [evaluador, setEvaluador] = useState("");
  const [evaluadorEmail, setEvaluadorEmail] = useState("");
  const [analista, setAnalista] = useState("");
  const [recontactar, setRecontactar] = useState("Sí");
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  useEffect(() => {
    async function fetchCalendarUrl() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("settings").select("calendar_url").single();
        if (error || !data?.calendar_url) {
          setCalendarError(true);
          return;
        }
        setCalendarUrl(data.calendar_url);
      } catch (error) {
        setCalendarError(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (!calendarUrl) fetchCalendarUrl();
  }, [calendarUrl]);

  useEffect(() => {
    async function verificarDisponibilidad() {
      if (!fecha) return;
      const { data, error } = await supabase
        .from("casos")
        .select("hora_visita") // ✅ CAMBIADO `hora` → `hora_visita`
        .eq("fecha_visita", fecha.toISOString().split("T")[0]); // ✅ CAMBIADO `fecha` → `fecha_visita`
      if (!error) {
        setHorariosOcupados(data.map((d) => d.hora_visita));
      }
    }
    verificarDisponibilidad();
  }, [fecha]);

  const generarEnlaceGoogleCalendar = () => {
    if (!fecha || !hora || !direccion || !evaluador || !tipoVisita) {
      alert("Faltan datos obligatorios para agregar al calendario.");
      return "";
    }

    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent(`Visita Domiciliaria - Evaluador: ${evaluador}`);
    const details = encodeURIComponent(`Tipo de visita: ${tipoVisita}\nEvaluador: ${evaluador}`);
    const location = encodeURIComponent(direccion);

    // Formato de fecha/hora para Google Calendar (YYYYMMDDTHHMMSSZ)
    const [horaInicio, minutos] = hora.split(":");
    const horaFin = (parseInt(horaInicio) + 1) % 24;
    const formattedDate = fecha.toISOString().split("T")[0].replace(/-/g, "");

    const startTime = `${formattedDate}T${horaInicio}${minutos}00`;
    const endTime = `${formattedDate}T${horaFin.toString().padStart(2, "0")}${minutos}00`;

    return `${baseUrl}&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (horariosOcupados.includes(hora)) {
      alert("Este horario ya está ocupado, por favor selecciona otro.");
      return;
    }

    if (!evaluadorEmail) {
      alert("❌ Debes seleccionar un evaluador.");
      return;
    }

    const nuevoCaso = {
      id: casoId,
      solicitud: solicitudAtlas,
      programador,
      nombre,
      documento,
      cliente,
      cargo,
      telefono,
      telefonosecundario: telefonoSecundario,
      telefonoterciario: telefonoTerciario,
      email,
      evaluador_email: evaluadorEmail, // ✅ Enviar automáticamente el correo
      evaluador_asignado: evaluador,   // ✅ Guardamos el nombre del evaluador
      seContacto,
      tipo_visita: seContacto === "Sí" ? tipoVisita : "No aplica",
      intentos_contacto: seContacto === "No" ? parseInt(intentoContacto) : 0,
      motivo_no_programacion: seContacto === "No" ? motivoNoContacto : "",
      fecha_visita: fecha ? fecha.toISOString().split("T")[0] : null,
      hora_visita: hora || null,
      direccion,
      punto_referencia: puntoReferencia,
      recontactar,
      estado: "pendiente",
    };

    console.log("📌 Enviando datos:", JSON.stringify(nuevoCaso, null, 2));

    try {
      const response = await crearCaso(nuevoCaso);
      if (response) {
        alert("✅ Visita programada con éxito");
      } else {
        alert("❌ Hubo un error al registrar el caso.");
      }
    } catch (error) {
      console.error("❌ Error al enviar el caso:", error);
      alert("❌ Error en el servidor. Verifica la consola.");
    }
  };

  return (
    <div className="container programar-container">
      <h2 className="title">Programar Visitas Domiciliarias</h2>

      <section className="calendar-section">
        <h3>Calendario</h3>
        {isLoading ? (
          <p>Cargando calendario...</p>
        ) : calendarError ? (
          <p style={{ color: "red" }}>No se pudo cargar el calendario.</p>
        ) : (
          <button className="btn btn-calendar" onClick={() => window.open(calendarUrl, "_blank")}>
            📅 Ver Calendario
          </button>
        )}
      </section>

      <section className="form-section">
        <h3>Formulario de Programación</h3>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID Atlas (Solicitud):</label>
            <input type="text" value={solicitudAtlas} onChange={(e) => setSolicitudAtlas(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Programador:</label>
            <select value={programador} onChange={(e) => setProgramador(e.target.value)}>
              <option value="HENRY MEDINA">HENRY MEDINA</option>
              <option value="MIRLIN ARTEAGA">MIRLIN ARTEAGA</option>
              <option value="NATALIA AGUDELO">NATALIA AGUDELO</option>
              <option value="SARAY LOPEZ">SARAY LOPEZ</option>
              <option value="JOHANA RODRÍGUEZ">JOHANA RODRÍGUEZ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Documento:</label>
            <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Cliente:</label>
            <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Cargo:</label>
            <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Teléfono Secundario:</label>
            <input type="tel" value={telefonoSecundario} onChange={(e) => setTelefonoSecundario(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Teléfono Terciario:</label>
            <input type="tel" value={telefonoTerciario} onChange={(e) => setTelefonoTerciario(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>¿Se contactó al evaluado?</label>
            <select value={seContacto} onChange={(e) => setSeContacto(e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {seContacto === "Sí" ? (
            <>
              <div className="form-group">
                <label>Tipo de Visita:</label>
                <select value={tipoVisita} onChange={(e) => setTipoVisita(e.target.value)}>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Seguimiento">Seguimiento</option>
                  <option value="Ingreso Bicicletas HA">Ingreso Bicicletas HA</option>
                  <option value="Seguimiento Bicicletas HA">Seguimiento Bicicletas HA</option>
                  <option value="Atlas">Atlas</option>
                  <option value="Pic Colombia">Pic Colombia</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <DatePicker selected={fecha} onChange={(date) => setFecha(date)} minDate={new Date()} dateFormat="yyyy-MM-dd" required />
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <TimePicker value={hora} onChange={setHora} disableClock required />
                {horariosOcupados.includes(hora) && <p style={{ color: "red" }}>Este horario ya está ocupado, elige otro.</p>}
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Punto de Referencia:</label>
                <input type="text" value={puntoReferencia} onChange={(e) => setPuntoReferencia(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Evaluador:</label>
                <select 
                  value={evaluador} 
                  onChange={(e) => {
                    setEvaluador(e.target.value); // 🔹 Guarda el nombre del evaluador
                    const correo = evaluadores.find(ev => ev.nombre === e.target.value)?.correo || "";
                    setEvaluadorEmail(correo); // 🔹 Asigna automáticamente el correo
                  }} 
                  required
                >
                  <option value="">Seleccione un evaluador</option>
                  {evaluadores.map((ev, index) => (
                    <option key={index} value={ev.nombre}>{ev.nombre}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Intento de contacto:</label>
                <select value={intentoContacto} onChange={(e) => setIntentoContacto(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="form-group">
                <label>Motivo de No Contacto:</label>
                <input type="text" value={motivoNoContacto} onChange={(e) => setMotivoNoContacto(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Analista:</label>
                <input type="text" value={analista} onChange={(e) => setAnalista(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>¿Se volverá a contactar?</label>
                <select value={recontactar} onChange={(e) => setRecontactar(e.target.value)}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary">Programar Visita</button>
          {seContacto === "Sí" && fecha && hora && direccion && evaluador && tipoVisita && (
            <a
              href={generarEnlaceGoogleCalendar()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-google"
            >
              📅 Agregar a Google Calendar
            </a>
          )}
        </form>
      </section>
    </div>
  );
}

export default Programar;