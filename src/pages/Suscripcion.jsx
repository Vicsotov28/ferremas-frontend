import { useState } from "react";

function Suscripcion({ cambiarPagina }) {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarSuscripcion = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!email.trim()) {
      setError("Debe ingresar un correo electrónico.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    setMensaje(
      "¡Felicitaciones! Tu correo fue registrado correctamente para recibir ofertas y descuentos FERREMAS."
    );
    setEmail("");
  };

  return (
    <main className="suscripcion-page">
      <section className="suscripcion-card">
        <div className="suscripcion-info">
          <p className="eyebrow">Suscríbete</p>
          <h1>Recibe ofertas y descuentos exclusivos</h1>
          <p>
            Registra tu correo para recibir noticias, promociones y beneficios
            especiales en productos FERREMAS.
          </p>

          <div className="beneficios-lista">
            <div>
              <span>✅</span>
              <p>Ofertas especiales en herramientas y materiales.</p>
            </div>

            <div>
              <span>✅</span>
              <p>Noticias sobre nuevos productos del catálogo.</p>
            </div>

            <div>
              <span>✅</span>
              <p>Descuentos aplicables a compras seleccionadas.</p>
            </div>
          </div>
        </div>

        <form className="suscripcion-form" onSubmit={manejarSuscripcion}>
          <h2>Registrar correo</h2>
          <p>
            Ingresa tu email para quedar registrado en la base de suscriptores.
          </p>

          {error && <p className="error-message">{error}</p>}
          {mensaje && <p className="success-message">{mensaje}</p>}

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="cliente@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn-primary full" type="submit">
            Recibir ofertas
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

export default Suscripcion;