// Error con código de estado HTTP.
// Permite distinguir errores "esperados" (400, 502, 504...) de bugs internos (500),
// para que el manejador central responda con el código correcto.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
