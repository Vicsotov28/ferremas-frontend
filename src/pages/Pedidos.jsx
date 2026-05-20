import { useState } from "react";
import { crearTransaccionWebpay, pagarPedido } from "../services/api";

function Pedidos({ pedidoActual, setPedidoActual, cambiarPagina }) {
  const [metodoPago, setMetodoPago] = useState("WEBPAY");
  // Nota: Mercado Pago se mantiene integrado en el backend (3ra API del proyecto)
  // pero no se ofrece como medio de pago al cliente. Métodos activos: Webpay y Transferencia.
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultadoPago, setResultadoPago] = useState(null);


  const totalMostrado =
    pedidoActual?.totalConDescuento !== undefined
      ? pedidoActual.totalConDescuento
      : pedidoActual?.total;

  const subtotalMostrado =
    pedidoActual?.subtotalOriginal !== undefined
      ? pedidoActual.subtotalOriginal
      : pedidoActual?.total;

  const descuentoAplicado = pedidoActual?.descuentoAplicado || 0;
  const montoDescuento = pedidoActual?.montoDescuento || 0;

  const confirmarTransferencia = async () => {
    if (!pedidoActual) return;

    try {
      setError("");
      setResultadoPago(null);
      setCargando(true);

      // Si el lote tiene varios pedidos, marca transferencia en todos.
      const pedidosLote = pedidoActual.pedidosRelacionados?.length
        ? pedidoActual.pedidosRelacionados
        : [pedidoActual];

      let pedidoPrincipalPagado = null;

      for (const pedido of pedidosLote) {
        const pedidoPagado = await pagarPedido({
          pedidoId: pedido.id,
          metodoPago: "TRANSFERENCIA",
        });

        if (pedido.id === pedidoActual.id) {
          pedidoPrincipalPagado = pedidoPagado;
        }
      }

      const pedidoActualizado = {
        ...(pedidoPrincipalPagado || pedidoActual),
        subtotalOriginal: pedidoActual.subtotalOriginal,
        descuentoAplicado: pedidoActual.descuentoAplicado,
        montoDescuento: pedidoActual.montoDescuento,
        totalConDescuento: pedidoActual.totalConDescuento,
        pedidosRelacionados: pedidoActual.pedidosRelacionados,
      };

      setPedidoActual(pedidoActualizado);

      const mensajeLote =
        pedidosLote.length > 1
          ? `Se registraron ${pedidosLote.length} transferencias (una por pedido del carrito). `
          : "Tu transferencia fue registrada. ";

      setResultadoPago({
        tipo: "exito",
        titulo: "Transferencia registrada",
        mensaje:
          mensajeLote +
          "El pedido queda EN REVISIÓN DE PAGO hasta que el contador la confirme. Una vez confirmada, pasa al vendedor para aprobación.",
      });
    } catch (error) {
      setError(error.message);
      setResultadoPago({
        tipo: "rechazado",
        titulo: "Error en transferencia",
        mensaje:
          "No se pudo registrar la transferencia. Intenta nuevamente o vuelve al catálogo.",
      });
    } finally {
      setCargando(false);
    }
  };

  const pagarConWebpay = async () => {
    if (!pedidoActual) return;

    try {
      setError("");
      setResultadoPago(null);
      setCargando(true);

      // Todos los pedidos del lote (multiproducto)
      const pedidosLote = pedidoActual.pedidosRelacionados?.length
        ? pedidoActual.pedidosRelacionados
        : [pedidoActual];

      const idsLote = pedidosLote.map((p) => p.id);

      // Monto total = suma de los totales de todos los pedidos del lote
      const montoTotal = pedidosLote.reduce(
        (sum, p) => sum + (Number(p.total) || 0),
        0
      );

      // Paso 1: pide al backend que cree la transacción en Transbank
      const { token, url } = await crearTransaccionWebpay({
        pedidoId: pedidoActual.id,
        pedidosLote: idsLote,
        monto: montoTotal,
      });

      if (!token || !url) {
        throw new Error("No se recibió token o URL desde Webpay.");
      }

      // Paso 2: redirige al formulario de Webpay vía POST con el token_ws.
      // Webpay exige POST, así que creamos un form dinámico y lo enviamos.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setError(error.message);
      setResultadoPago({
        tipo: "rechazado",
        titulo: "Error al iniciar pago",
        mensaje:
          "No se pudo iniciar la transacción con Webpay. Revisa que el backend esté corriendo e intenta nuevamente.",
      });
      setCargando(false);
    }
  };

  const procesarPago = () => {
    if (metodoPago === "WEBPAY") {
      pagarConWebpay();
      return;
    }

    if (metodoPago === "TRANSFERENCIA") {
      confirmarTransferencia();
    }
  };

  if (!pedidoActual) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay pedidos activos</h2>
          <p>Crea un pedido desde el carrito para hacer seguimiento.</p>
          <button
            className="btn-primary"
            onClick={() => cambiarPagina("catalogo")}
          >
            Ir al catálogo
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Seguimiento de pedidos</h2>
          <p>Estado actual del pedido creado desde el carrito.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {resultadoPago && (
        <section
          className={
            resultadoPago.tipo === "exito"
              ? "payment-result success"
              : "payment-result rejected"
          }
        >
          <div className="payment-icon">
            {resultadoPago.tipo === "exito" ? "✅" : "❌"}
          </div>

          <div>
            <h3>{resultadoPago.titulo}</h3>
            <p>{resultadoPago.mensaje}</p>

            <div className="payment-actions">
              {resultadoPago.tipo === "exito" ? (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => cambiarPagina("pedidos")}
                  >
                    Ver estado del pedido
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => cambiarPagina("catalogo")}
                  >
                    Volver al catálogo
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => cambiarPagina("catalogo")}
                  >
                    Volver al catálogo
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => cambiarPagina("carrito")}
                  >
                    Ir al carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="pedido-layout">
        <article className="pedido-card">
          <div className="pedido-header">
            <div>
              <p className="eyebrow-dark">Pedido #{pedidoActual.id}</p>
              <h3>{pedidoActual.producto?.nombre}</h3>
            </div>

            <span className={`estado-badge estado-${pedidoActual.estado}`}>
              {pedidoActual.estado}
            </span>
          </div>

          <div className="pedido-grid">
            <div>
              <span>Producto</span>
              <strong>{pedidoActual.producto?.nombre}</strong>
            </div>

            <div>
              <span>Cantidad</span>
              <strong>{pedidoActual.cantidad}</strong>
            </div>

            <div>
              <span>Subtotal</span>
              <strong>${subtotalMostrado?.toLocaleString("es-CL")}</strong>
            </div>

            <div>
              <span>Descuento</span>
              <strong>
                {descuentoAplicado}% (-$
                {montoDescuento?.toLocaleString("es-CL")})
              </strong>
            </div>

            <div>
              <span>Total final</span>
              <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
            </div>

            <div>
              <span>Entrega</span>
              <strong>{pedidoActual.tipoEntrega}</strong>
            </div>

            <div>
              <span>Dirección</span>
              <strong>{pedidoActual.direccion || "Retiro en tienda"}</strong>
            </div>

            <div>
              <span>Método de pago</span>
              <strong>{pedidoActual.metodoPago || "NO DEFINIDO"}</strong>
            </div>
          </div>
        </article>

        <aside className="resumen-compra">
          <h3>Pago del pedido</h3>

          <div className="checkout-box">
            <label>Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              disabled={pedidoActual.estado !== "PENDIENTE"}
            >
              <option value="WEBPAY">Webpay (Tarjeta Crédito / Débito)</option>
              <option value="TRANSFERENCIA">Transferencia bancaria</option>
            </select>
          </div>

          {metodoPago === "WEBPAY" &&
            pedidoActual.estado === "PENDIENTE" && (
              <div className="transferencia-box">
                <h4>💳 Pago con Webpay</h4>
                <p>
                  Al confirmar serás redirigido al <strong>portal seguro de
                  Webpay (Transbank)</strong>, donde ingresarás los datos de tu
                  tarjeta. Al terminar volverás automáticamente a FERREMAS.
                </p>

                <div className="transferencia-total">
                  <span>Monto a pagar</span>
                  <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
                </div>

                <p style={{ fontSize: "12px", opacity: 0.7 }}>
                  💡 <strong>Tarjeta de prueba (ambiente integración):</strong>
                  <br />
                  VISA aprueba: 4051 8856 0044 6623 · CVV 123 · fecha futura
                  cualquiera
                  <br />
                  Autenticación: RUT 11.111.111-1 · clave 123
                </p>
              </div>
            )}

          {metodoPago === "TRANSFERENCIA" &&
            pedidoActual.estado === "PENDIENTE" && (
              <div className="transferencia-box">
                <h4>Datos para transferencia</h4>

                <div className="transferencia-row">
                  <span>Banco</span>
                  <strong>Banco FERREMAS</strong>
                </div>

                <div className="transferencia-row">
                  <span>Tipo de cuenta</span>
                  <strong>Cuenta corriente</strong>
                </div>

                <div className="transferencia-row">
                  <span>N° de cuenta</span>
                  <strong>123456789</strong>
                </div>

                <div className="transferencia-row">
                  <span>RUT empresa</span>
                  <strong>76.123.456-7</strong>
                </div>

                <div className="transferencia-row">
                  <span>Correo</span>
                  <strong>pagos@ferremas.cl</strong>
                </div>

                <div className="transferencia-row">
                  <span>Asunto</span>
                  <strong>Pedido #{pedidoActual.id}</strong>
                </div>

                <div className="transferencia-total">
                  <span>Monto a transferir</span>
                  <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
                </div>

                <p>
                  Luego de realizar la transferencia, presiona “Confirmar
                  transferencia” para simular la validación del pago.
                </p>
              </div>
            )}

          <button
            className="btn-primary full"
            onClick={procesarPago}
            disabled={pedidoActual.estado !== "PENDIENTE" || cargando}
          >
            {pedidoActual.estado === "PENDIENTE"
              ? cargando
                ? "Procesando..."
                : metodoPago === "WEBPAY"
                ? "Pagar con Webpay"
                : "Confirmar transferencia"
              : "Pago procesado"}
          </button>

          <p className="nota-carrito">
            El pago con tarjeta de crédito o débito se procesa mediante Webpay.
            La transferencia bancaria queda EN REVISIÓN hasta que el contador la
            confirme.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Pedidos;