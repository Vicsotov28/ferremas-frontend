import { useState } from "react";
import { enviarContacto } from "../services/api";

function Contacto({ cambiarPagina, usuarioActual }) {
  const [formulario, setFormulario] = useState({
    nombre: usuarioActual?.nombre || "",
    email: usuarioActual?.email || "",
    asunto: "",
    mensaje: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (
      !formulario.nombre.trim() ||
      !formulario.email.trim() ||
      !formulario.asunto.trim() ||
      !formulario.mensaje.trim()
    ) {
      setError("Completa todos los campos para enviar tu consulta.");
      return;
    }

    try {
      setCargando(true);
      const respuesta = await enviarContacto(formulario);

      setMensaje(respuesta.mensajeConfirmacion);
      setFormulario({
        nombre: usuarioActual?.nombre || "",
        email: usuarioActual?.email || "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="suscripcion-page">
      <section className="suscripcion-card">
        <div className="suscripcion-info">
          <p className="eyebrow">Contacto</p>
          <h1>Habla con un vendedor FERREMAS</h1>
          <p>
            ¿Tienes una consulta específica sobre un producto, una cotización
            grande o necesitas asesoría? Escríbenos y un vendedor te responderá
            al correo indicado.
          </p>

          <div className="beneficios-lista">
            <div>
              <span>💬</span>
              <p>Consultas técnicas sobre herramientas y materiales.</p>
            </div>

            <div>
              <span>📦</span>
              <p>Cotizaciones especiales para compras al por mayor.</p>
            </div>

            <div>
              <span>🚚</span>
              <p>Información sobre despachos a regiones.</p>
            </div>
          </div>
        </div>

        <form className="suscripcion-form" onSubmit={manejarEnvio}>
          <h2>Enviar mensaje</h2>

          {error && <p className="error-message">{error}</p>}
          {mensaje && <p className="success-message">{mensaje}</p>}

          <label>Nombre</label>
          <input
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            disabled={cargando}
          />

          <label>Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="tu@correo.com"
            value={formulario.email}
            onChange={manejarCambio}
            disabled={cargando}
          />

          <label>Asunto</label>
          <input
            name="asunto"
            type="text"
            placeholder="Ej: Consulta cotización taladros"
            value={formulario.asunto}
            onChange={manejarCambio}
            disabled={cargando}
          />

          <label>Mensaje</label>
          <textarea
            name="mensaje"
            placeholder="Escribe tu consulta..."
            value={formulario.mensaje}
            onChange={manejarCambio}
            disabled={cargando}
            rows={5}
          />

          <button className="btn-primary full" type="submit" disabled={cargando}>
            {cargando ? "Enviando..." : "Enviar mensaje"}
          </button>

          <button
            className="btn-secondary full"
            type="button"
            onClick={() => cambiarPagina("catalogo")}
          >
            Ver catálogo
          </button>
        </form>
      </section>
    </main>
  );
}

export default Contacto;
