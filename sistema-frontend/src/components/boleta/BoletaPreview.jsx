import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { EMPRESA_CONFIG } from "../../utils/constans";

function BoletaPreview({ boleta, pedido, detalles = [], pago = null, onCerrar }) {
  const boletaRef = useRef(null);

  if (!boleta) return null;

  const descargarPDF = async () => {
    const elemento = boletaRef.current;
    if (!elemento) return;

    try {
      const container = elemento.closest(".overflow-y-auto");
      let prevStyle = "";
      if (container) {
        prevStyle = container.style.cssText;
        container.style.maxHeight = "none";
        container.style.overflow = "visible";
      }

      const imgData = await toPng(elemento, { quality: 1, pixelRatio: 2 });

      if (container) {
        container.style.cssText = prevStyle;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (elemento.offsetHeight * pdfWidth) / elemento.offsetWidth;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BOL-000${boleta.idBoleta}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold">Vista Previa Boleta</h3>
          <button onClick={onCerrar} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-6">
          <div ref={boletaRef} className="border-2 border-dashed border-outline-variant rounded-lg p-5">
            {/* Logo + Empresa */}
            <div className="text-center mb-4">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img
                  src="/img/logowTwo.jpg"
                  alt="Logo Empresa"
                  className="w-35 h-35 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">business</span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-on-surface">{EMPRESA_CONFIG.nombre}</h2>
              <p className="text-xs text-on-surface-variant">{EMPRESA_CONFIG.direccion}</p>
              <p className="text-xs text-on-surface-variant">{EMPRESA_CONFIG.telefono}</p>
            </div>

            {/* N Boleta */}
            <div className="text-center border-t border-b border-outline-variant py-2 mb-4">
              <p className="text-xs text-on-surface-variant">BOLETA DE VENTA</p>
              <p className="text-xl font-bold text-primary">BOL-000{boleta.idBoleta}</p>
              <p className="text-xs text-on-surface-variant">Fecha: {boleta.fechaEmision}</p>
            </div>

            {/* Datos Cliente */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500">Cliente</p>
              <p className="text-sm">{pedido?.cliente?.nombre || "-"}</p>
              <p className="text-xs text-on-surface-variant">{pedido?.direccionEntrega || "-"}</p>
            </div>

            {/* Detalle Productos */}
            {detalles.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Detalle</p>
                <div className="space-y-1">
                  {detalles.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{d.producto?.nombreProducto || `Producto #${d.producto?.idProducto}`} x{d.cantidad}</span>
                      <span className="font-bold">S/ {(d.cantidad * d.precioUnitario).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Costo Envio */}
            <div className="flex justify-between text-sm border-t border-outline-variant pt-2 mb-2">
              <span>Costo envio</span>
              <span>S/ {pedido?.costoEnvio?.toFixed(2) || "0.00"}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-bold border-t-2 border-on-surface pt-2">
              <span>TOTAL</span>
              <span className="text-primary">S/ {boleta.total?.toFixed(2)}</span>
            </div>

            {/* Forma de Pago del Cliente */}
            {pago && (
              <div className="mt-4 p-3 bg-[#43A047]/10 border border-[#43A047]/30 rounded-lg">
                <p className="text-xs font-bold text-[#43A047] mb-1">Forma de Pago</p>
                <p className="text-sm text-on-surface">Metodo: <span className="font-bold">{pago.metodoPago}</span></p>
                <p className="text-xs text-on-surface-variant">Estado: {pago.estadoPago}</p>
                {pago.referenciaTransaccion && (
                  <p className="text-xs text-on-surface-variant">Referencia: {pago.referenciaTransaccion}</p>
                )}
              </div>
            )}

            {/* Formas de Pago Disponibles */}
            <div className="mt-3 p-3 bg-surface-container-low rounded-lg">
              <p className="text-xs font-bold text-slate-500 mb-1">Formas de Pago</p>
              <p className="text-xs text-on-surface-variant">Transferencia: {EMPRESA_CONFIG.ctaBancaria}</p>
              <p className="text-xs text-on-surface-variant">Yape: {EMPRESA_CONFIG.yape}</p>
              <p className="text-xs text-on-surface-variant">Plin: {EMPRESA_CONFIG.plin}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2">
          <button onClick={descargarPDF} className="px-4 py-2.5 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">download</span>
            Descargar PDF
          </button>
          <button onClick={onCerrar} className="px-5 py-2.5 rounded-lg font-bold border border-outline-variant hover:bg-surface-container-low">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoletaPreview;
