import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const { ipcRenderer } = window;

interface Asset {
    id: number; // 자산 ID
    name: string; // 자산 명
    amount: number; // 자산 금액
    description: string; // 자산 설명
}

// 자산 설정
const AssetSetting = () => {
    // ========================================== 상태 정의 ==========================================
    const [currentAsset, setCurrentAsset] = useState<Asset>({ id: 0, name: "", amount: 0, description: "" }); // 현재 자산
    const [assets, setAssets] = useState<Asset[]>([]); // 자산 목록
    const [isSheetOpen, setIsSheetOpen] = useState(false); // 자산 추가 다이얼로그 열림 여부
    const [isEditMode, setIsEditMode] = useState(false); // 자산 수정 모드 여부

    // ========================================== useEffect ==========================================
    // 자산 데이터 가져오기
    useEffect(() => {
        fetchAssets();
    }, []);

    // ========================================== fetch ==========================================
    // 자산 데이터 가져오기
    const fetchAssets = async () => {
        try {
            const fetchedAssets = await ipcRenderer.invoke("get-all-asset");
            setAssets(fetchedAssets);
        } catch (error) {
            console.error("자산을 불러오는데 실패했습니다", error);
        }
    };

    // ========================================== 핸들러 ==========================================
    // 자산 추가 핸들러
    const handleAddPaymentMethod = () => {
        setIsSheetOpen(true);
    };

    // 자산 카드 클릭 핸들러
    const handleCardClick = (id: number) => {
        // 자산 수정 다이올로그를 open
        setIsEditMode(true);
        setIsSheetOpen(true);
        setCurrentAsset(assets.find((asset) => asset.id === id) || { id: 0, name: "", amount: 0, description: "" });
    };

    // 자산 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await ipcRenderer.invoke("update-asset", currentAsset);
            } else {
                await ipcRenderer.invoke("create-asset", currentAsset);
            }

            await fetchAssets();
            handleCloseModal();
        } catch (error) {
            console.error("결제 방법을 추가하는데 실패했습니다", error);
        }
    };

    // 자산 다이얼로그 닫기 핸들러
    const handleCloseModal = () => {
        setIsSheetOpen(false);
        setIsEditMode(false);
        setCurrentAsset({ id: 0, name: "", amount: 0, description: "" });
    };

    // 자산 입력 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentAsset((prev) => ({ ...prev, [name]: value }));
    };

    // 자산 삭제 핸들러
    const handleDeleteAsset = async () => {
        try {
            await ipcRenderer.invoke("delete-asset", currentAsset);
            await fetchAssets();
            handleCloseModal();
        } catch (error) {
            console.error("결제 방법을 삭제하는데 실패했습니다", error);
        }
    };

    return (
        <>
            <h3 className="text-lg font-semibold mb-4">자산 관리</h3>
            <div className="grid grid-cols-4 gap-4">
                {assets.map((asset) => (
                    <div
                        onClick={() => handleCardClick(asset.id)}
                        key={asset.id}
                        className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
                    >
                        <h4 className="font-bold mb-2 text-lg">{asset.name}</h4>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-base font-semibold">{asset.amount.toLocaleString()}원</span>
                        </div>
                    </div>
                ))}

                <div
                    onClick={handleAddPaymentMethod}
                    className="bg-white p-4 rounded-lg shadow border-2 border-dotted border-gray-300 transition-all duration-300 ease-in-out hover:border-solid hover:border-blue-500 hover:scale-105 cursor-pointer"
                >
                    <h4 className="font-medium mb-2">자산</h4>
                    <p className="text-sm text-gray-600">자산을 추가하거나 관리합니다.</p>
                </div>
            </div>
            <Dialog open={isSheetOpen} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>자산 추가</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="name"
                            placeholder="자산 명"
                            value={currentAsset.name}
                            onChange={handleInputChange}
                            className="mb-2"
                        />
                        <Input
                            type="number"
                            name="amount"
                            placeholder="총액"
                            value={currentAsset.amount}
                            onChange={handleInputChange}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            name="description"
                            placeholder="자산 설명"
                            value={currentAsset.description}
                            onChange={handleInputChange}
                            className="mb-2"
                        />
                        <DialogFooter>
                            {isEditMode && (
                                <Button type="button" variant="destructive" onClick={handleDeleteAsset}>
                                    삭제
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={handleCloseModal}>
                                취소
                            </Button>
                            <Button type="submit">{isEditMode ? "수정" : "추가"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AssetSetting;
