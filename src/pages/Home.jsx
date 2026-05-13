function Home({ cambiarPagina }) {
  const categorias = [
    {
      nombre: "Herramientas manuales",
      icono: "🔨",
      descripcion: "Martillos, destornilladores y herramientas básicas.",
    },
    {
      nombre: "Herramientas eléctricas",
      icono: "⚡",
      descripcion: "Taladros, sierras y equipos eléctricos.",
    },
    {
      nombre: "Materiales básicos",
      icono: "🧱",
      descripcion: "Productos esenciales para construcción.",
    },
    {
      nombre: "Pinturas",
      icono: "🎨",
      descripcion: "Pinturas, brochas y productos de terminación.",
    },
    {
      nombre: "Equipos de seguridad",
      icono: "🦺",
      descripcion: "Elementos de protección personal.",
    },
    {
      nombre: "Tornillos y anclajes",
      icono: "🔩",
      descripcion: "Fijaciones para distintos tipos de trabajo.",
    },
  ];

  return (
    <main className="home-simple-page">
      <section className="home-simple-hero">
        <div className="home-logo-box">
          <span>🛠️</span>
        </div>

        <p className="eyebrow">Bienvenido a</p>
        <h1>FERREMAS</h1>
        <p className="home-subtitle">
          Plataforma de venta online para productos de ferretería y construcción.
        </p>

        <div className="home-simple-actions">
          <button
            className="btn-primary"
            onClick={() => cambiarPagina("catalogo")}
          >
            Herramientas
          </button>

          <button
            className="btn-secondary"
            onClick={() => cambiarPagina("suscripcion")}
          >
            Suscríbete
          </button>

          <button
            className="btn-secondary"
            onClick={() => cambiarPagina("login")}
          >
            Iniciar sesión
          </button>
        </div>
      </section>

      <section className="home-category-section">
        <div className="catalogo-header">
          <div>
            <h2>Categorías principales</h2>
            <p>Selecciona una categoría para explorar el catálogo FERREMAS.</p>
          </div>
        </div>

        <div className="home-category-grid">
          {categorias.map((categoria) => (
            <article
              className="home-category-card"
              key={categoria.nombre}
              onClick={() => cambiarPagina("catalogo")}
            >
              <div className="home-category-icon">{categoria.icono}</div>
              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>
              <button className="category-link">Ver productos</button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-subscribe-banner">
        <div>
          <h2>Suscríbete a nuestras ofertas</h2>
          <p>
            Registra tu correo para recibir descuentos y novedades de FERREMAS.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => cambiarPagina("suscripcion")}
        >
          Ir a suscripción
        </button>
      </section>
    </main>
  );
}

export default Home;