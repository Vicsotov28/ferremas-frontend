import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import PanelVendedor from "./pages/PanelVendedor";
import PanelBodeguero from "./pages/PanelBodeguero";
import PanelContador from "./pages/PanelContador";
import PanelAdmin from "./pages/PanelAdmin";
import Suscripcion from "./pages/Suscripcion";
import Contacto from "./pages/Contacto";
import CambiarPassword from "./pages/CambiarPassword";
import WebpayResultado from "./pages/WebpayResultado";

function App() {
  const [paginaActual, setPaginaActual] = useState("home");
  const [carrito, setCarrito] = useState([]);
  const [pedidoActual, setPedidoActual] = useState(null);

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuarioFerremas");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [resultadoWebpay, setResultadoWebpay] = useState(null);

  // Detecta el retorno de Webpay: el backend redirige a /?webpayResultado=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("webpayResultado");

    if (estado) {
      setResultadoWebpay({
        estado,
        codigo: params.get("codigo"),
        monto: params.get("monto"),
      });
      setPaginaActual("webpay-resultado");
      // Limpia la URL para que un refresh no repita el resultado
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // Pauta FERREMAS: descuento solo aplica a clientes que compran más de 4 artículos.
  const UMBRAL_DESCUENTO_UNIDADES = 5;
  const PORCENTAJE_DESCUENTO_CLIENTE = 10;

  const cantidadTotalCarritoCalculo = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const obtenerDescuentoUsuario = (usuario, unidadesEnCarrito) => {
    if (!usuario) return 0;
    if (usuario.rol !== "CLIENTE") return 0;
    if (unidadesEnCarrito < UMBRAL_DESCUENTO_UNIDADES) return 0;
    return PORCENTAJE_DESCUENTO_CLIENTE;
  };

  const descuentoUsuario = obtenerDescuentoUsuario(
    usuarioActual,
    cantidadTotalCarritoCalculo
  );

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
    setPedidoActual(null);
    setCarrito([]);
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

  const cantidadTotalCarrito = cantidadTotalCarritoCalculo;

  const renderPagina = () => {
    if (paginaActual === "home") {
      return <Home cambiarPagina={cambiarPagina} />;
    }

    if (paginaActual === "suscripcion") {
      return <Suscripcion cambiarPagina={cambiarPagina} />;
    }

    if (paginaActual === "contacto") {
      return (
        <Contacto cambiarPagina={cambiarPagina} usuarioActual={usuarioActual} />
      );
    }

    if (paginaActual === "webpay-resultado") {
      return (
        <WebpayResultado
          resultado={resultadoWebpay}
          cambiarPagina={cambiarPagina}
        />
      );
    }

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
          descuentoUsuario={descuentoUsuario}
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

  // Si el usuario está logueado y debe cambiar password, bloquea toda la app
  // hasta que lo haga (excepto cerrar sesión).
  if (usuarioActual && usuarioActual.requiereCambioPassword) {
    return (
      <CambiarPassword
        usuarioActual={usuarioActual}
        onPasswordCambiada={() => {
          const actualizado = {
            ...usuarioActual,
            requiereCambioPassword: false,
          };
          setUsuarioActual(actualizado);
          localStorage.setItem("usuarioFerremas", JSON.stringify(actualizado));
          setPaginaActual("catalogo");
        }}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  return (
    <>
      <Navbar
        paginaActual={paginaActual}
        cambiarPagina={cambiarPagina}
        carritoCantidad={cantidadTotalCarrito}
        usuarioActual={usuarioActual}
        cerrarSesion={cerrarSesion}
        descuentoUsuario={descuentoUsuario}
      />

      {renderPagina()}
    </>
  );
}

export default App;