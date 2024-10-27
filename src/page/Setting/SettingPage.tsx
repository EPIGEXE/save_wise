import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentSetting from "./module/PaymentSetting";
import AssetSetting from "./module/AssetSetting";
import CategorySetting from "./module/CategorySetting";

const SettingPage = ({ isCollapsed }: { isCollapsed: boolean }) => {

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
                        <TabsTrigger 
                            value="category"
                            className="justify-start px-4 py-2 data-[state=active]:bg-gray-200 w-full data-[state=inactive]:hover:underline"
                        >
                            수입 지출 항목 관리
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col flex-1 pl-4">
                        <TabsContent value="asset">
                            <AssetSetting />
                        </TabsContent>
                        <TabsContent value="payment">
                            <PaymentSetting />
                        </TabsContent>
                        <TabsContent value="category" className="flex flex-col flex-1">
                            <CategorySetting />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            
        </div>
    )
}

export default SettingPage;
