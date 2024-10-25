import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Nav } from "./Nav"
import { Inbox, Settings } from "lucide-react"

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: (isCollapsed: boolean) => void
}

const Sidebar = ({isCollapsed, setIsCollapsed}: SidebarProps) => {
    
    return (
        <aside 
            className={`
                h-full
                absolute z-10 left-0 inset-y-0
                bg-side-nav transition-all duration-300 ease-in-out 
                ${isCollapsed ? 'w-[75px]' : 'w-[250px]'} 
                border-r border-side-nav
            `}
            >
            <div className='flex items-center justify-between p-2'>
                <Button variant="destructive" onClick={() => setIsCollapsed(!isCollapsed)} className="w-full">Toggle</Button>
            </div>
            <Separator />
            <Nav
                isCollapsed={isCollapsed} 
                links={[
                    {
                        title: "가계부 캘린더",
                        to: "/",
                        icon: Inbox,
                        variant: "default",
                    },
                    {
                        title: "설정",
                        to: "/setting",
                        icon: Settings,
                        variant: "ghost",
                    },
                    // {
                    //     title: "온실가스 발생 비교",
                    //     to: "/compareEmission",
                    //     icon: File,
                    //     variant: "ghost",
                    // },
                    // {
                    //     title: "지역별 배출량",
                    //     to: "/regionEmission",
                    //     icon: File,
                    //     variant: "ghost",
                    // },
                ]}
            />
        </aside>
    )
}

export default Sidebar