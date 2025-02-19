import { BookUserIcon, Calendar, Car, CarTaxiFrontIcon, ComponentIcon, FileScanIcon, FramerIcon, FuelIcon,  ShieldQuestionIcon, UsersIcon } from "lucide-react";  
export const dataGeneralSidebar = [  
{  
  icon: Car,  
  label: "Vehículos",  
  href: "/dashboard",  
},  
{  
  icon: Calendar,  
  label: "Vehículos Reservados",  
  href: "/reserves",  
},  
// {  
//   icon: Heart,  
//   label: "Loved Cars",  
//   href: "/loved-cars",  
// },  
];


export const dataAdminSidebar = [  
  {  
    icon: FileScanIcon,  
    label: "Gestión de Vehículos",  
    href: "dashboard/admin/cars-manager",  
  },  
  {  
    icon: Calendar,  
    label: "Renta y devoluciones",  
    href: "dashboard/admin/allreserves",  
  },  
  {  
    icon: BookUserIcon,  
    label: "Gestión de Clientes",  
    href: "dashboard/admin/clientes",  
  },   {  
    icon: UsersIcon,  
    label: "Gestión de Empleados",  
    href: "dashboard/admin/empleados",  
  },   {  
    icon: ShieldQuestionIcon,  
    label: "Inspección de Vehículos",  
    href: "dashboard/admin/inspeccion",  
  },   {  
    icon: ComponentIcon,  
    label: "Gestión de Modelos ",  
    href: "dashboard/admin/modelos",  
  },   {  
    icon: FramerIcon,  
    label: "Gestión de Marcas ",  
    href: "dashboard/admin/marcas",  
  },   {  
    icon: CarTaxiFrontIcon,  
    label: "Gestión de Tipos de Vehículos ",  
    href: "dashboard/admin/tpvehiculos",  
  },   {  
    icon: FuelIcon,  
    label: "Gestión de Tipos de Combustibles ",  
    href: "dashboard/admin/tpcombustibles",  
  },  
  
  ];