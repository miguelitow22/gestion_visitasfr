import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-clock/dist/Clock.css";
import { v4 as uuidv4 } from "uuid";

const evaluadores = [
  { nombre: "Jairo", correo: "jairo@empresa.com" },
  { nombre: "Ana", correo: "ana@empresa.com" },
];

const analistas = [
  { nombre: "Carlos", correo: "carlos@empresa.com", telefono: "+573001234567" },
  { nombre: "María", correo: "maria@empresa.com", telefono: "+573002345678" },
];

const regionales = ["Norte", "Sur", "Centro"];
const tiposVisita = [
  "Ingreso", "Seguimiento", "Virtual",
  "Ingreso Bicicletas HA", "Seguimiento Bicicletas HA",
  "Atlas", "Pic Colombia"
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
  const [seContacto, setSeContacto] = useState("Sí");
  const [tipoVisita, setTipoVisita] = useState("Ingreso");
  const [intentoContacto, setIntentoContacto] = useState("1");
  const [motivoNoContacto, setMotivoNoContacto] = useState("");
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("10:00");
  const [direccion, setDireccion] = useState("");
  const [puntoReferencia, setPuntoReferencia] = useState("");
  const [evaluador, setEvaluador] = useState("");
  const [evaluadorEmail, setEvaluadorEmail] = useState("");
  const [analista, setAnalista] = useState("");
  const [analistaEmail, setAnalistaEmail] = useState("");
  const [recontactar, setRecontactar] = useState("Sí");
  const [regional, setRegional] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [isCaseCreated, setIsCaseCreated] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [evidencia, setEvidencia] = useState(null);
  const [ciudad, setCiudad] = useState("");

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
        .select("hora_visita")
        .eq("fecha_visita", fecha.toISOString().split("T")[0]);
      if (!error) {
        setHorariosOcupados(data.map((d) => d.hora_visita));
      }
    }
    verificarDisponibilidad();
  }, [fecha]);

  useEffect(() => {
    if (seContacto === "No") setRegional("");
  }, [seContacto]);

  const generarEnlaceGoogleCalendar = (estado) => {
    if (!fecha || !hora || !direccion || !evaluador || !tipoVisita) {
      alert("Faltan datos obligatorios para agregar al calendario.");
      return "";
    }

    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent(`Visita Domiciliaria - Evaluador: ${evaluador}`);
    const details = encodeURIComponent(`Tipo de visita: ${tipoVisita}\nEvaluador: ${evaluador}`);
    const location = encodeURIComponent(direccion);

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

    if (!evaluadorEmail && seContacto === "Sí") {
      alert("❌ Debes seleccionar un evaluador.");
      return;
    }

    if (seContacto === "Sí" && !regional) {
      alert("❌ Debes seleccionar una regional.");
      return;
    }

    const formularios = {
      "Ingreso": "https://formulario.com/ingreso",
      "Seguimiento": "https://formulario.com/seguimiento",
      "Ingreso Bicicletas HA": "https://formulario.com/bicicletas-ingreso",
      "Seguimiento Bicicletas HA": "https://formulario.com/bicicletas-seguimiento",
      "Atlas": "https://formulario.com/atlas",
      "Pic Colombia": "https://formulario.com/pic-colombia"
    };

    const linkFormulario = formularios[tipoVisita] || "https://formulario.com/default";

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
      evaluador_email: evaluadorEmail,
      evaluador_asignado: evaluador,
      seContacto,
      tipo_visita: seContacto === "Sí" ? tipoVisita : "No aplica",
      intentos_contacto: seContacto === "No" ? parseInt(intentoContacto) : 0,
      motivo_no_programacion: seContacto === "No" ? motivoNoContacto : "",
      fecha_visita: fecha ? fecha.toISOString().split("T")[0] : null,
      hora_visita: hora || null,
      direccion,
      punto_referencia: puntoReferencia,
      recontactar,
      estado: seContacto === "Sí" ? "en curso" : "pendiente",
      linkFormulario,
      regional,
      ciudad
    };

    console.log("📌 Enviando datos:", JSON.stringify(nuevoCaso, null, 2));

    try {
      const response = await fetch("https://gestionvisitas-production.up.railway.app/api/casos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoCaso)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Respuesta del backend:", errorData);
        alert("❌ Hubo un error al registrar el caso: " + (errorData.error || "Error desconocido"));
      } else {
        alert("✅ Caso creado con éxito");
        setIsCaseCreated(true);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("❌ Error al enviar el caso:", error);
      alert("❌ Error en el servidor. Verifica la consola.");
    }
  };

  return (
    <div className="container programar-container">
      <h2>Programar visitas domiciliarias</h2>

      <section className="programar-section">
        <h3>Calendario</h3>
        {isLoading ? (
          <p>Cargando calendario...</p>
        ) : calendarError ? (
          <p style={{ color: "red" }}>No se pudo cargar el calendario.</p>
        ) : (
          <iframe src={calendarUrl} title="Calendario" style={{ border: 0, width: "100%", height: "400px", borderRadius: "12px" }}></iframe>
        )}
      </section>

      <section className="programar-section">
        <h3>Programación</h3>
        <form className="form-container" onSubmit={handleSubmit}>
          {errorMensaje && <p style={{ color: "red" }}>{errorMensaje}</p>}
          <label>Solicitud:</label>
          <input type="text" value={solicitudAtlas} onChange={(e) => setSolicitudAtlas(e.target.value)} required />

          <label>Programador:</label>
          <select value={programador} onChange={(e) => setProgramador(e.target.value)}>
            <option value="HENRY MEDINA">HENRY MEDINA</option>
            <option value="MIRLIN ARTEAGA">MIRLIN ARTEAGA</option>
            <option value="NATALIA AGUDELO">NATALIA AGUDELO</option>
            <option value="SARAY LOPEZ">SARAY LOPEZ</option>
            <option value="JOHANA RODRÍGUEZ">JOHANA RODRÍGUEZ</option>
          </select>

          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Documento:</label>
          <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} required />

          <label>Cliente:</label>
          <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />

          <label>Cargo:</label>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} required />

          <label>Teléfono:</label>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

          <label>Teléfono Secundario:</label>
          <input type="tel" value={telefonoSecundario} onChange={(e) => setTelefonoSecundario(e.target.value)} />

          <label>Teléfono Terciario:</label>
          <input type="tel" value={telefonoTerciario} onChange={(e) => setTelefonoTerciario(e.target.value)} />

          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>¿Se contactó al evaluado?</label>
          <select value={seContacto} onChange={(e) => setSeContacto(e.target.value)}>
            <option value="">Seleccione...</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>

          {seContacto === "Sí" ? (
            <>
              <label>Tipo de Visita:</label>
              <select value={tipoVisita} onChange={(e) => setTipoVisita(e.target.value)}>
                {tiposVisita.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <label>Fecha:</label>
              <DatePicker selected={fecha} onChange={(date) => setFecha(date)} minDate={new Date()} dateFormat="yyyy-MM-dd" required />
              <label>Hora:</label>
              <TimePicker value={hora} onChange={setHora} disableClock required className="time-picker" />
              {horariosOcupados.includes(hora) && <p style={{ color: "red" }}>Este horario ya está ocupado, elige otro.</p>}
              <label>Dirección:</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <label>Punto de Referencia:</label>
              <input type="text" value={puntoReferencia} onChange={(e) => setPuntoReferencia(e.target.value)} />
              <label>Evaluador:</label>
              <select 
                value={evaluador} 
                onChange={(e) => {
                  setEvaluador(e.target.value);
                  const correo = evaluadores.find(ev => ev.nombre === e.target.value)?.correo || "";
                  setEvaluadorEmail(correo);
                }} 
                required
              >
                <option value="">Seleccione un evaluador</option>
                {evaluadores.map((ev, index) => (
                  <option key={index} value={ev.nombre}>{ev.nombre}</option>
                ))}
              </select>
              <label>Regional:</label>
              <select value={regional} onChange={(e) => setRegional(e.target.value)} required>
                <option value="">Seleccione una regional</option>
                {regionales.map((reg, index) => (
                  <option key={index} value={reg}>{reg}</option>
                ))}
              </select>
              <label>Ciudad:</label>
              <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required={seContacto === "Sí"} />
            </>
          ) : (
            <>
              <label>Intento de contacto:</label>
              <select value={intentoContacto} onChange={(e) => setIntentoContacto(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <label>Motivo de No Contacto:</label>
              <input 
                type="text" 
                value={motivoNoContacto} 
                onChange={(e) => setMotivoNoContacto(e.target.value)} 
                required={seContacto === "No"}
              />
              <label>Analista:</label>
              <select onChange={(e) => {
                setAnalista(e.target.value);
                const correo = analistas.find(a => a.nombre === e.target.value)?.correo || "";
                setAnalistaEmail(correo);
              }}>
                <option value="">Seleccione un analista</option>
                {analistas.map(a => (
                  <option key={a.nombre} value={a.nombre}>{a.nombre}</option>
                ))}
              </select>
              <label>¿Se volverá a contactar?</label>
              <select value={recontactar} onChange={(e) => setRecontactar(e.target.value)}>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
              <label>Subir Evidencia:</label>
              <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
            </>
          )}
          <button type="submit" className="btn btn-primary">Programar Visita</button>
          {isCaseCreated && (
            <a
              href={generarEnlaceGoogleCalendar(seContacto === "Sí" ? "programado" : "pendiente")}
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