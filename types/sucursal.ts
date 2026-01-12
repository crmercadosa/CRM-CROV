export interface Sucursal {
  id: string;
  fk_usuario: string | null;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales: string;
  estado: 'activo' | 'inactivo';
}

export interface SucursalFormData {
  id_usuario: string;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales: string;
  estado: 'activo' | 'inactivo';
}