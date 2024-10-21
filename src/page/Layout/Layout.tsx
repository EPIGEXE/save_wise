import { Outlet } from "react-router-dom"
import Sidebar from "./module/Sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const Layout = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (isCollapsed: boolean) => void }) => {

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen w-full flex flex-col">
                <header className='bg-gray-800 text-white p-4 h-16 flex items-center'>header</header>
                <div className='relative flex flex-1'>
                    <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                    <Outlet />
                </div>
            </div>
        </TooltipProvider>
    )
}

export default Layout