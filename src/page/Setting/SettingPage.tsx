import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingPage = ({ isCollapsed }: { isCollapsed: boolean }) => {

    const handleAddPaymentMethod = () => {
        
    }

    return (
        <div className='p-5 flex flex-col gap-4 flex-1'>
            <div className='title text-2xl font-bold'>설정 페이지</div>
            <Separator />
            <div className='flex flex-col flex-1'>
                <Tabs defaultValue="asset" className="flex flex-row flex-1">
                    <TabsList className="flex flex-col w-1/6 h-auto bg-white justify-start items-start">
                        <TabsTrigger 
                            value="asset"
                            className="justify-start px-4 py-2 data-[state=active]:bg-gray-200 w-full data-[state=inactive]:hover:underline"
                        >
                            자산 관리
                        </TabsTrigger>
                        <TabsTrigger 
                            value="payment"
                            className="justify-start px-4 py-2 data-[state=active]:bg-gray-200 w-full data-[state=inactive]:hover:underline"
                        >
                            결제 관리
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col flex-1 pl-4">
                        <TabsContent value="asset">
                            <h3 className="text-lg font-semibold">일반 설정</h3>
                            {/* 일반 설정 내용 */}
                        </TabsContent>
                        <TabsContent value="payment">
                            <h3 className="text-lg font-semibold mb-4">결제 관리</h3>
                            <div className="grid grid-cols-4 gap-4">

                                 <div onClick={handleAddPaymentMethod} className="bg-white p-4 rounded-lg shadow border-2 border-dotted border-gray-300 transition-all duration-300 ease-in-out hover:border-solid hover:border-blue-500 hover:scale-105 cursor-pointer" >
                                    <h4 className="font-medium mb-2">결제 방법</h4>
                                    <p className="text-sm text-gray-600">결제 수단을 추가하거나 관리합니다.</p>
                                </div>
                               
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

export default SettingPage;
