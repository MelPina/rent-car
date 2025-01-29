import { Calendar, Car, FileScanIcon, Heart } from "lucide-react";  
export const dataGeneralSidebar = [  
{  
  icon: Car,  
  label: "Cars",  
  href: "/dashboard",  
},  
{  
  icon: Calendar,  
  label: "Cars Reserves",  
  href: "/reserves",  
},  
{  
  icon: Heart,  
  label: "Loved Cars",  
  href: "/loved-cars",  
},  
];


export const dataAdminSidebar = [  
  {  
    icon: FileScanIcon,  
    label: "Manage your Cars",  
    href: "dashboard/admin/cars-manager",  
  },  
  {  
    icon: Calendar,  
    label: "All Reserves",  
    href: "dashboard/admin/allreserves",  
  },  
  
  ];