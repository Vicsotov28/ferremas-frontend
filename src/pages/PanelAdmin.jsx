import { useEffect, useState } from "react";
import {
  crearProducto,
  eliminarProducto,
  obtenerPedidos,
  obtenerProductosAdmin,
} from "../services/api";

function PanelAdmin({ usuarioActual, cambiarPagina }) {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState({
    codigoProducto: "",
    marca: "",
    codigoMarca: "",
    nombre: "",
    modelo: "",
    categoria: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");
      const productosData = await obtenerProductosAdmin();
      const pedidosData = await obtenerPedidos();

      setProductos(productosData);
      setPedidos(pedidosData);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      codigoProducto: "",
      marca: "",
      codigoMarca: "",
      nombre: "",
      modelo: "",
      categoria: "",
      descripcion: "",
      precio: "",
      stock: "",
    });
  };

  const manejarCrearProducto = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (
      !formulario.codigoProducto ||
      !formulario.marca ||
      !formulario.nombre ||
      !formulario.precio ||
      !formulario.stock
    ) {
      setError("Complete los campos obligatorios del producto.");
      return;
    }

    try {
      const nuevoProducto = await crearProducto({
        ...formulario,
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
      });

      setProductos((productosActuales) => [...productosActuales, nuevoProducto]);
      limpiarFormulario();
      setMensaje("Producto creado correctamente.");
    } catch (error) {
      setError(error.message);
    }
  };

  const manejarEliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarProducto(id);

      setProductos((productosActuales) =>
        productosActuales.filter((producto) => producto.id !== id)
      );

      setMensaje("Producto eliminado correctamente.");
    } catch (error) {
      setError(
        "No se pudo eliminar el producto. Puede estar asociado a un pedido."
      );
    }
  };

  if (!usuarioActual) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Acceso restringido</h2>
          <p>Debes iniciar sesión para acceder al panel administrador.</p>
          <button className="btn-primary" onClick={() => cambiarPagina("login")}>
            Ir al login
          </button>
        </section>
      </main>
    );
  }

  if (usuarioActual.rol !== "ADMINISTRADOR") {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">⛔</div>
          <h2>No tienes permisos</h2>
          <p>Esta pantalla es solo para usuarios con rol ADMINISTRADOR.</p>
          <button
            className="btn-primary"
            onClick={() => cambiarPagina("catalogo")}
          >
            Volver al catálogo
          </button>
        </section>
      </main>
    );
  }

  const totalVentas = pedidos
    .filter((pedido) => pedido.estado !== "RECHAZADO")
    .reduce((sum, pedido) => sum + (pedido.total || 0), 0);

  const pedidosPendientes = pedidos.filter(
    (pedido) => pedido.estado === "PENDIENTE"
  ).length;

  const pedidosFinalizados = pedidos.filter(
    (pedido) => pedido.estado === "DESPACHADO"
  ).length;

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Panel administrador</h2>
          <p>
            Gestión general de productos, pedidos y métricas principales del
            sistema FERREMAS.
          </p>
        </div>

        <button className="btn-secondary" onClick={cargarDatos}>
          Actualizar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {mensaje && <p className="success-message">{mensaje}</p>}

      {cargando ? (
        <section className="empty-state">
          <div className="empty-icon">⏳</div>
          <h2>Cargando datos</h2>
          <p>Consultando productos y pedidos desde el backend.</p>
        </section>
      ) : (
        <>
          <section className="admin-stats">
            <article className="stat-card">
              <span>Productos</span>
              <strong>{productos.length}</strong>
            </article>

            <article className="stat-card">
              <span>Pedidos</span>
              <strong>{pedidos.length}</strong>
            </article>

            <article className="stat-card">
              <span>Pendientes</span>
              <strong>{pedidosPendientes}</strong>
            </article>

            <article className="stat-card">
              <span>Finalizados</span>
              <strong>{pedidosFinalizados}</strong>
            </article>

            <article className="stat-card wide">
              <span>Total ventas</span>
              <strong>${totalVentas.toLocaleString("es-CL")}</strong>
            </article>
          </section>

          <section className="admin-layout">
            <form className="admin-form" onSubmit={manejarCrearProducto}>
              <h3>Crear producto</h3>
              <p>Agrega nuevos productos al catálogo FERREMAS.</p>

              <div className="form-grid">
                <input
                  name="codigoProducto"
                  placeholder="Código producto *"
                  value={formulario.codigoProducto}
                  onChange={manejarCambio}
                />

                <input
                  name="marca"
                  placeholder="Marca *"
                  value={formulario.marca}
                  onChange={manejarCambio}
                />

                <input
                  name="codigoMarca"
                  placeholder="Código marca"
                  value={formulario.codigoMarca}
                  onChange={manejarCambio}
                />

                <input
                  name="nombre"
                  placeholder="Nombre *"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                />

                <input
                  name="modelo"
                  placeholder="Modelo"
                  value={formulario.modelo}
                  onChange={manejarCambio}
                />

                <input
                  name="categoria"
                  placeholder="Categoría"
                  value={formulario.categoria}
                  onChange={manejarCambio}
                />

                <input
                  name="precio"
                  type="number"
                  placeholder="Precio *"
                  value={formulario.precio}
                  onChange={manejarCambio}
                />

                <input
                  name="stock"
                  type="number"
                  placeholder="Stock *"
                  value={formulario.stock}
                  onChange={manejarCambio}
                />
              </div>

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formulario.descripcion}
                onChange={manejarCambio}
              />

              <button className="btn-primary full" type="submit">
                Crear producto
              </button>
            </form>

            <section className="admin-productos">
              <div className="admin-card-header">
                <div>
                  <p className="eyebrow-dark">Catálogo</p>
                  <h3>Productos registrados</h3>
                </div>
              </div>

              <div className="admin-product-list">
                {productos.map((producto) => (
                  <article className="admin-product-item" key={producto.id}>
                    <div>
                      <strong>{producto.nombre}</strong>
                      <span>
                        {producto.codigoProducto} · {producto.marca}
                      </span>
                      <small>
                        Stock: {producto.stock} · $
                        {producto.precio?.toLocaleString("es-CL")}
                      </small>
                    </div>

                    <button
                      className="btn-danger"
                      onClick={() => manejarEliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </>
      )}
    </main>
  );
}

export default PanelAdmin;