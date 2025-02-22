import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { v4 as uuidv4 } from "uuid";

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
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [direccion, setDireccion] = useState("");
  const [puntoReferencia, setPuntoReferencia] = useState("");
  const [evaluador, setEvaluador] = useState("");
  const [analista, setAnalista] = useState("");
  const [recontactar, setRecontactar] = useState("Sí");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoCaso = {
      casoId,
      solicitudAtlas,
      programador,
      nombre,
      documento,
      cliente,
      cargo,
      telefono,
      telefonoSecundario,
      telefonoTerciario,
      email,
      seContacto,
      tipoVisita: seContacto === "Sí" ? tipoVisita : "No aplica",
      intentoContacto: seContacto === "No" ? intentoContacto : "No aplica",
      motivoNoContacto: seContacto === "No" ? motivoNoContacto : "No aplica",
      fecha,
      hora,
      direccion,
      puntoReferencia,
      evaluador,
      analista,
      recontactar,
    };

    console.log("Caso Programado:", nuevoCaso);
    alert("Visita programada con éxito");
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
        <h3>Pendiente de Programar</h3>
        <p>Aquí se mostrarán los casos que aún no han sido programados.</p>
      </section>

      <section className="programar-section">
        <h3>Programación</h3>
        <form className="form-container" onSubmit={handleSubmit}>
          <label>ID Atlas (Solicitud):</label>
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
                <option value="Ingreso">Ingreso</option>
                <option value="Seguimiento">Seguimiento</option>
                <option value="Ingreso Bicicletas HA">Ingreso Bicicletas HA</option>
                <option value="Seguimiento Bicicletas HA">Seguimiento Bicicletas HA</option>
                <option value="Atlas">Atlas</option>
                <option value="Pic Colombia">Pic Colombia</option>
              </select>
              <label>Fecha:</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              <label>Hora:</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
              <label>Dirección:</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <label>Punto de Referencia:</label>
              <input type="text" value={puntoReferencia} onChange={(e) => setPuntoReferencia(e.target.value)} />
              <label>Evaluador:</label>
              <input type="text" value={evaluador} onChange={(e) => setEvaluador(e.target.value)} required />
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
              <input type="text" value={motivoNoContacto} onChange={(e) => setMotivoNoContacto(e.target.value)} />
              <label>Analista:</label>
              <input type="text" value={analista} onChange={(e) => setAnalista(e.target.value)} required />
              <label>¿Se volverá a contactar?</label>
              <select value={recontactar} onChange={(e) => setRecontactar(e.target.value)}>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </>
          )}
          <button type="submit" className="btn btn-primary">Programar Visita</button>
        </form>
      </section>
    </div>
  );
}

export default Programar;