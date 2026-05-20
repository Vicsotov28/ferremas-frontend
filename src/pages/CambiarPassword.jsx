import { useState } from "react";

const API_URL = "http://localhost:8080";

function CambiarPassword({ usuarioActual, onPasswordCambiada, cerrarSesion }) {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordActual || !passwordNueva || !passwordConfirmacion) {
      setError("Completa todos los campos.");
      return;
    }

    if (passwordNueva !== passwordConfirmacion) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    if (passwordNueva.length < 4) {
      setError("La nueva contraseña debe tener al menos 4 caracteres.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/usuarios/cambiar-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: usuarioActual.id,
          passwordActual,
          passwordNueva,
        }),
      });

      if (!response.ok) {
        let mensaje = "Error al cambiar la contraseña.";
        try {
          const data = await response.json();
          mensaje = data?.message || mensaje;
        } catch {
          // sin body
        }
        throw new Error(mensaje);
      }

      onPasswordCambiada();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-info">
          <p className="eyebrow">Seguridad</p>
          <h1>Cambio de contraseña obligatorio</h1>
          <p>
            Por política de seguridad de FERREMAS, debes cambiar tu contraseña
            inicial antes de continuar usando el sistema.
          </p>

          <div className="demo-users">
            <h3>Usuario</h3>
            <span>
              {usuarioActual?.nombre} ({usuarioActual?.rol})
            </span>
            <span>{usuarioActual?.email}</span>
          </div>

          <button
            className="btn-secondary full"
            type="button"
            onClick={cerrarSesion}
            style={{ marginTop: "16px" }}
          >
            Cancelar y cerrar sesión
          </button>
        </div>

        <form className="login-form" onSubmit={manejarSubmit}>
          <h2>Definir nueva contraseña</h2>

          {error && <p className="error-message">{error}</p>}

          <label>Contraseña actual</label>
          <input
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            disabled={cargando}
          />

          <label>Nueva contraseña</label>
          <input
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            disabled={cargando}
          />

          <label>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={passwordConfirmacion}
            onChange={(e) => setPasswordConfirmacion(e.target.value)}
            disabled={cargando}
          />

          <button className="btn-primary full" type="submit" disabled={cargando}>
            {cargando ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CambiarPassword;
