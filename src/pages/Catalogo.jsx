import { useEffect, useState } from "react";
import { obtenerProductos, obtenerValorDolar } from "../services/api";
import ProductoCard from "../components/ProductoCard";

function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [valorDolar, setValorDolar] = useState(null);
  const [error, setError] = useState("");
  const [errorDivisa, setErrorDivisa] = useState("");

  useEffect(() => {
    obtenerProductos()
      .then((data) => setProductos(data))
      .catch((error) => setError(error.message));

    obtenerValorDolar()
      .then((data) => setValorDolar(data.valor))
      .catch(() =>
        setErrorDivisa(
          "No se pudo cargar la conversión de moneda desde la API."
        )
      );
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

        <div className="divisa-box">
          <span>Conversión referencial</span>
          <strong>
            {valorDolar
              ? `1 USD = $${valorDolar.toLocaleString("es-CL")} CLP`
              : "Cargando divisa..."}
          </strong>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}
      {errorDivisa && <p className="warning-message">{errorDivisa}</p>}

      <section className="productos-grid">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
            valorDolar={valorDolar}
          />
        ))}
      </section>
    </main>
  );
}

export default Catalogo;