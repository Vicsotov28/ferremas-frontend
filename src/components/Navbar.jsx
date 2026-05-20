import logoFerremas from "../assets/logo/logo.jpg";

function Navbar({
  paginaActual,
  cambiarPagina,
  carritoCantidad,
  usuarioActual,
  cerrarSesion,
  descuentoUsuario,
}) {
  const mostrarPanelVendedor =
    usuarioActual &&
    (usuarioActual.rol === "VENDEDOR" || usuarioActual.rol === "ADMINISTRADOR");

  const mostrarPanelBodeguero =
    usuarioActual &&
    (usuarioActual.rol === "BODEGUERO" ||
      usuarioActual.rol === "ADMINISTRADOR");

  const mostrarPanelContador =
    usuarioActual &&
    (usuarioActual.rol === "CONTADOR" ||
      usuarioActual.rol === "ADMINISTRADOR");

  const mostrarPanelAdmin =
    usuarioActual && usuarioActual.rol === "ADMINISTRADOR";

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => cambiarPagina("home")}>
        <img src={logoFerremas} alt="Logo FERREMAS" className="navbar-logo" />

        <div>
          <strong>FERREMAS</strong>
          <small>Ferretería y construcción</small>
        </div>
      </div>

      <div className="navbar-links">
        <button
          className={paginaActual === "home" ? "nav-link active" : "nav-link"}
          onClick={() => cambiarPagina("home")}
        >
          Inicio
        </button>

        <button
          className={
            paginaActual === "catalogo" ? "nav-link active" : "nav-link"
          }
          onClick={() => cambiarPagina("catalogo")}
        >
          Catálogo
        </button>

        <button
          className={
            paginaActual === "suscripcion" ? "nav-link active" : "nav-link"
          }
          onClick={() => cambiarPagina("suscripcion")}
        >
          Suscripción
        </button>

        <button
          className={
            paginaActual === "contacto" ? "nav-link active" : "nav-link"
          }
          onClick={() => cambiarPagina("contacto")}
        >
          Contacto
        </button>

        <button
          className={
            paginaActual === "carrito" ? "nav-link active" : "nav-link"
          }
          onClick={() => cambiarPagina("carrito")}
        >
          Carrito ({carritoCantidad})
        </button>

        <button
          className={
            paginaActual === "pedidos" ? "nav-link active" : "nav-link"
          }
          onClick={() => cambiarPagina("pedidos")}
        >
          Pedidos
        </button>

        {mostrarPanelVendedor && (
          <button
            className={
              paginaActual === "panel-vendedor" ? "nav-link active" : "nav-link"
            }
            onClick={() => cambiarPagina("panel-vendedor")}
          >
            Vendedor
          </button>
        )}

        {mostrarPanelBodeguero && (
          <button
            className={
              paginaActual === "panel-bodeguero"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => cambiarPagina("panel-bodeguero")}
          >
            Bodega
          </button>
        )}

        {mostrarPanelContador && (
          <button
            className={
              paginaActual === "panel-contador"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => cambiarPagina("panel-contador")}
          >
            Contador
          </button>
        )}

        {mostrarPanelAdmin && (
          <button
            className={
              paginaActual === "panel-admin" ? "nav-link active" : "nav-link"
            }
            onClick={() => cambiarPagina("panel-admin")}
          >
            Admin
          </button>
        )}

        {usuarioActual ? (
          <div className="user-box">
            <div>
              <strong>{usuarioActual.nombre}</strong>
              <small>
                {usuarioActual.rol}
                {usuarioActual.rol === "CLIENTE" && descuentoUsuario > 0 &&
                  ` · Descuento ${descuentoUsuario}%`}
                {usuarioActual.rol === "CLIENTE" && descuentoUsuario === 0 &&
                  ` · Descuento desde 5 unidades`}
              </small>
            </div>

            <button className="nav-link logout" onClick={cerrarSesion}>
              Salir
            </button>
          </div>
        ) : (
          <button
            className={paginaActual === "login" ? "nav-link active" : "nav-link"}
            onClick={() => cambiarPagina("login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;