import { NavarDashboard } from "./dashboard/components/NavarDashboard";
import { Sidebar } from "./dashboard/components/Sidebar";

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
    return (

        <div className="flex w-full h-full">  
        <div className="hidden h-full xl:block w-80 xl:fixed">
            <Sidebar/>
        </div>  
        <div className="w-full h-full xl:ml-80">  
        <NavarDashboard/>
        <div className="p-6 h-max">{children}</div>  
        </div>  
        </div>
    )
}
