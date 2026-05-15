import { imagenesProductos } from "../data/imagenesProductos";

function ProductoCard({ producto, agregarAlCarrito, valorDolar }) {
  const precioUsd =
    valorDolar && valorDolar > 0 ? producto.precio / valorDolar : null;
  
  const imagenProducto = imagenesProductos[producto.codigoProducto];

  return (
    <article className="producto-card">
      <div className="producto-badge">{producto.categoria}</div>

      <div className="producto-imagen">
        {imagenProducto ? (
          <img src={imagenProducto} alt={producto.nombre} />
        ) : (
          <span>🔧</span>
        )}
      </div>

      <div className="producto-info">
        <p className="producto-marca">{producto.marca}</p>
        <h3>{producto.nombre}</h3>
        <p className="producto-modelo">Modelo: {producto.modelo}</p>
        <p className="producto-descripcion">{producto.descripcion}</p>

        <div className="producto-footer">
          <div>
            <span className="producto-precio">
              ${producto.precio.toLocaleString("es-CL")}
            </span>

            {precioUsd && (
              <p className="producto-usd">
                USD {precioUsd.toFixed(2)} aprox.
              </p>
            )}

            <p className="producto-stock">Stock: {producto.stock}</p>
          </div>

          <button
            className="btn-primary"
            onClick={() => agregarAlCarrito(producto)}
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? "Agregar" : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;