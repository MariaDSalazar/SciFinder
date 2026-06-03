// Mensaje centrado y reutilizable para estados sin resultados:
// cargando, error o vacío. Mantiene esos textos fuera del App.
export function StatusMessage({ icon, children }) {
  return (
    <div className="status-message">
      {icon && <span className="status-message__icon">{icon}</span>}
      <p>{children}</p>
    </div>
  );
}
