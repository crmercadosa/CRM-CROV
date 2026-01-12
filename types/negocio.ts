//types/negocio.ts
export interface Negocio {
  id: string;
  id_usuario: string;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales: string;
  estado: 'activo' | 'inactivo';
}

export interface NegocioFormData {
  id_usuario: string;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales: string;
  estado: 'activo' | 'inactivo';
}
