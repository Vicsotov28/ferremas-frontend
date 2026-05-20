function WebpayResultado({ resultado, cambiarPagina }) {
  const config = {
    exito: {
      icono: "✅",
      titulo: "Pago aprobado",
      clase: "payment-result success",
      mensaje:
        "Tu pago fue procesado correctamente por Webpay. El pedido continúa al flujo de revisión del vendedor.",
    },
    rechazado: {
      icono: "❌",
      titulo: "Pago rechazado",
      clase: "payment-result rejected",
      mensaje:
        "Webpay rechazó la transacción. No se realizó ningún cobro. Puedes intentar nuevamente o usar transferencia.",
    },
    cancelado: {
      icono: "⚠️",
      titulo: "Pago anulado",
      clase: "payment-result rejected",
      mensaje:
        "Anulaste el pago en Webpay. El pedido quedó sin pagar; puedes reintentarlo cuando quieras.",
    },
    error: {
      icono: "⚠️",
      titulo: "Error en el pago",
      clase: "payment-result rejected",
      mensaje:
        "Ocurrió un problema procesando el retorno de Webpay. Verifica el estado de tu pedido o intenta de nuevo.",
    },
  };

  const data = config[resultado?.estado] || config.error;

  return (
    <main className="page-container">
      <section className={data.clase} style={{ maxWidth: "640px", margin: "40px auto" }}>
        <div className="payment-icon">{data.icono}</div>

        <div>
          <h3>{data.titulo}</h3>
          <p>{data.mensaje}</p>

          {resultado?.estado === "exito" && resultado?.codigo && (
            <div className="transferencia-box" style={{ marginTop: "16px" }}>
              <div className="transferencia-row">
                <span>Código de autorización</span>
                <strong>{resultado.codigo}</strong>
              </div>
              {resultado.monto && (
                <div className="transferencia-row">
                  <span>Monto pagado</span>
                  <strong>
                    ${Number(resultado.monto).toLocaleString("es-CL")}
                  </strong>
                </div>
              )}
              <div className="transferencia-row">
                <span>Medio de pago</span>
                <strong>Webpay (Transbank)</strong>
              </div>
            </div>
          )}

          <div className="payment-actions" style={{ marginTop: "20px" }}>
            <button
              className="btn-primary"
              onClick={() => cambiarPagina("catalogo")}
            >
              Volver al catálogo
            </button>

            {resultado?.estado === "rechazado" && (
              <button
                className="btn-secondary"
                onClick={() => cambiarPagina("carrito")}
              >
                Ir al carrito
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default WebpayResultado;
