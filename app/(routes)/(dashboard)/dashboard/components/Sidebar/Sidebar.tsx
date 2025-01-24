import { LogoDashboard } from "../LogoDashboard";
import { SidebarRoutes } from "../SidebarRouters";

export function Sidebar() {
  return (
    <div className="h-screen">  
    <div className="flex flex-col h-full border-r">  
    <LogoDashboard />  
    <SidebarRoutes/>
    </div>  
    </div>  
  )
}
