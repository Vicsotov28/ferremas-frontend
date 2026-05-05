import { useState } from "react";
import { loginUsuario } from "../services/api";

function Login({ iniciarSesion }) {
  const [email, setEmail] = useState("cliente@ferremas.cl");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Debe ingresar correo y contraseña");
      return;
    }

    try {
      setCargando(true);
      const usuario = await loginUsuario(email, password);
      iniciarSesion(usuario);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-info">
          <p className="eyebrow">Acceso FERREMAS</p>
          <h1>Inicia sesión para continuar</h1>
          <p>
            Accede al sistema usando uno de los usuarios demo cargados desde el
            backend. El login consume la API REST de Spring Boot y devuelve un DTO
            sin exponer la contraseña.
          </p>

          <div className="demo-users">
            <h3>Usuarios demo</h3>
            <span>cliente@ferremas.cl / 1234</span>
            <span>vendedor@ferremas.cl / 1234</span>
            <span>bodeguero@ferremas.cl / 1234</span>
            <span>contador@ferremas.cl / 1234</span>
            <span>admin@ferremas.cl / 1234</span>
          </div>
        </div>

        <form className="login-form" onSubmit={manejarLogin}>
          <h2>Inicio de sesión</h2>

          {error && <p className="error-message">{error}</p>}

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="cliente@ferremas.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary full" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;