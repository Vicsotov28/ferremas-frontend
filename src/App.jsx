import { useState } from "react";
import Navbar from "./components/Navbar";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import PanelVendedor from "./pages/PanelVendedor";
import PanelBodeguero from "./pages/PanelBodeguero";
import PanelContador from "./pages/PanelContador";
import PanelAdmin from "./pages/PanelAdmin";

function App() {
  const [paginaActual, setPaginaActual] = useState("catalogo");
  const [carrito, setCarrito] = useState([]);
  const [pedidoActual, setPedidoActual] = useState(null);

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuarioFerremas");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  const iniciarSesion = (usuario) => {
    setUsuarioActual(usuario);
    localStorage.setItem("usuarioFerremas", JSON.stringify(usuario));
    setPaginaActual("catalogo");
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem("usuarioFerremas");
    setPaginaActual("login");
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.id === producto.id);

      if (existe) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== productoId)
    );
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;

    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const cantidadTotalCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const renderPagina = () => {
    if (paginaActual === "login") {
      return <Login iniciarSesion={iniciarSesion} />;
    }

    if (paginaActual === "carrito") {
      return (
        <Carrito
          carrito={carrito}
          eliminarDelCarrito={eliminarDelCarrito}
          actualizarCantidad={actualizarCantidad}
          limpiarCarrito={limpiarCarrito}
          cambiarPagina={cambiarPagina}
          setPedidoActual={setPedidoActual}
          usuarioActual={usuarioActual}
        />
      );
    }

    if (paginaActual === "pedidos") {
      return (
        <Pedidos
          pedidoActual={pedidoActual}
          setPedidoActual={setPedidoActual}
          cambiarPagina={cambiarPagina}
        />
      );
    }

    if (paginaActual === "panel-vendedor") {
      return (
        <PanelVendedor
          usuarioActual={usuarioActual}
          cambiarPagina={cambiarPagina}
        />
      );
    }

    if (paginaActual === "panel-bodeguero") {
      return (
        <PanelBodeguero
          usuarioActual={usuarioActual}
          cambiarPagina={cambiarPagina}
        />
      );
    }

    if (paginaActual === "panel-contador") {
      return (
        <PanelContador
          usuarioActual={usuarioActual}
          cambiarPagina={cambiarPagina}
        />
      );
    }

    if (paginaActual === "panel-admin") {
      return (
        <PanelAdmin
          usuarioActual={usuarioActual}
          cambiarPagina={cambiarPagina}
        />
      );
    }

    return <Catalogo agregarAlCarrito={agregarAlCarrito} />;
  };

  return (
    <>
      <Navbar
        paginaActual={paginaActual}
        cambiarPagina={cambiarPagina}
        carritoCantidad={cantidadTotalCarrito}
        usuarioActual={usuarioActual}
        cerrarSesion={cerrarSesion}
      />

      {renderPagina()}
    </>
  );
}

export default App;