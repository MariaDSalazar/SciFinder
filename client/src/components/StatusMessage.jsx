// Mensaje centrado y reutilizable para estados sin resultados:
// cargando (con spinner animado), error o vacío.
export function StatusMessage({ icon, spinner = false, children }) {
  return (
    <div className="status-message">
      {spinner ? (
        <span className="status-message__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="status-message__icon">{icon}</span>
      )}
      <p>{children}</p>
    </div>
  );
}
