import { useState } from "react";

function ListaCompras() {
  // Definir el estado para la lista de compras
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [productosComprados, setProductosComprados] = useState([]);

  // Función para agregar un nuevo producto a la lista
  const agregarProducto = () => {
    if (nuevoProducto.trim() !== "") {
      setProductos([...productos, nuevoProducto]);
      setNuevoProducto("");
    }
  };

  // Función para eliminar un producto de la lista
  const eliminarProducto = (index) => {
    // Completar la lógica para eliminar un producto
    const productoEliminado = productos[index]
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    setProductosComprados([...productosComprados, productoEliminado]);
  };

  const eliminarProductosComprados = () => {
    setProductosComprados([]);
  }

  return (
    <div>
      <div style={{ display: "inline-block", padding: "20px" }}>
        <h2>Productos por comprar</h2>
        <input
          type="text"
          value={nuevoProducto}
          onChange={(e) => setNuevoProducto(e.target.value)}
          style={{margin: "20px"}}
        />
        <button onClick={agregarProducto}>Agregar</button>
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>
              {producto}
              <button onClick={() => eliminarProducto(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: "inline-block", padding: "20px" }}>
        <h2>Productos comprados</h2>
        <ul>
          {productosComprados.map((producto, index) => (
            <li key={index}>{producto}</li>
          ))}
        </ul>
        <button onClick={() => eliminarProductosComprados()}>Eliminar</button>

      </div>
    </div>
  );
}

export default ListaCompras;
