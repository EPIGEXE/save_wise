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
                    <div className='flex flex-col flex-1'>
                        <main
                            className={`
                            max-h-[calc(100vh-4rem)]
                            overflow-y-auto
                            transition-all duration-300 ease-in-out 
                            flex flex-col flex-1 p-3 ${isCollapsed ? 'pl-[75px]' : 'pl-[250px]'}
                            `}
                        >
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}

export default Layout