/**
 * --------------------------------------------------------------------------
 * Importar módulos y componentes necesarios.
 * --------------------------------------------------------------------------
 *
 * - `Card`, `CardContent`, `CardFooter`, `CardHeader`, `CardTitle` de
 *   "@/components/UI/card": Para crear tarjetas.
 * - `Button` de "@/components/UI/button": Para crear botones.
 * - `Badge` de "@/components/UI/badge": Para crear insignias.
 * - `Link` de "next/link": Para crear enlaces.
 */
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/AdminUsuarios/card";
import { Button } from "@/components/AdminUsuarios/button";
import { Badge } from "@/components/AdminUsuarios/badge";
import Link from "next/link";

/**
 * --------------------------------------------------------------------------
 * Interfaz `Branch`.
 * --------------------------------------------------------------------------
 *
 * Esta interfaz define la estructura de un objeto de negocio.
 *
 * @property {string} name - El nombre del negocio.
 * @property {"Activa" | "Inactiva"} status - El estado del negocio.
 * @property {string} ai - La IA asignada.
 * @property {string} lastActivity - La última actividad del negocio.
 */
export interface Branch {
  name: string;
  status: "Activa" | "Inactiva";
  ai: string;
  lastActivity: string;
}

/**
 * --------------------------------------------------------------------------
 * Interfaz `BranchCardProps`.
 * --------------------------------------------------------------------------
 *
 * Esta interfaz define las props para el componente `BranchCard`.
 *
 * @property {Branch} branch - El objeto del negocio.
 */
interface BranchCardProps {
  branch: Branch;
}

/**
 * --------------------------------------------------------------------------
 * Componente `BranchCard`.
 * --------------------------------------------------------------------------
 *
 * Este componente representa una tarjeta que muestra información sobre un negocio.
 *
 * @param {BranchCardProps} { branch } - Las props para el componente.
 * @returns {JSX.Element} El componente `BranchCard` renderizado.
 */
export function BranchCard({ branch }: BranchCardProps) {
  const slug = branch.name.toLowerCase().replace(/ /g, "-");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{branch.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">Estado</p>
          <Badge variant={branch.status === "Activa" ? "default" : "destructive"}>
            {branch.status}
          </Badge>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-500">IA Asignada</p>
          <p className="text-sm">{branch.ai}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-500">Última actividad</p>
          <p className="text-sm">{branch.lastActivity}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/operacion/negocios/${slug}`} className="w-full">
          <Button className="w-full">Seleccionar</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
