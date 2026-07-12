import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const subirEvidenciaPago = async (archivo, idPago) => {
  const nombreArchivo = `evidencia-pago-${idPago}-${Date.now()}.${archivo.name.split(".").pop()}`;
  const { data, error } = await supabase.storage
    .from("evidencias-pagos")
    .upload(nombreArchivo, archivo);
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from("evidencias-pagos")
    .getPublicUrl(nombreArchivo);
  return urlData.publicUrl;
};