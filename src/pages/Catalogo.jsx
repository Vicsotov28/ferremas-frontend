import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/api";
import ProductoCard from "../components/ProductoCard";

function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProductos()
      .then((data) => setProductos(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <main className="catalogo-page">
      <section className="hero">
        <div>
          <p className="eyebrow">FERREMAS E-Commerce</p>
          <h1>Herramientas y materiales para construir tus proyectos</h1>
          <p>
            Catálogo integrado con la API REST de FERREMAS, mostrando productos,
            stock, marcas y precios en tiempo real.
          </p>
        </div>
      </section>

      <section className="catalogo-header">
        <div>
          <h2>Catálogo de productos</h2>
          <p>{productos.length} productos disponibles</p>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="productos-grid">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </section>
    </main>
  );
}

export default Catalogo;