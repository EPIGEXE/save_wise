import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Categories, EditingCategoryId, NewCategoryName } from '../SettingType';

const { ipcRenderer } = window;

// 카테고리 설정
const CategorySetting = () => {
    // ========================================== 상태 정의 ==========================================
    const [categories, setCategories] = useState<Categories>({ income: [], expense: [] }); // 카테고리 목록
    const [newCategoryName, setNewCategoryName] = useState<NewCategoryName>({ income: '', expense: '' }); // 새 카테고리 이름
    const [editingCategoryId, setEditingCategoryId] = useState<EditingCategoryId>({ income: null, expense: null }); // 수정 중인 카테고리 ID

    // ========================================== useEffect ==========================================
    // 카테고리 데이터 가져오기
    useEffect(() => {
        fetchCategories('income');
        fetchCategories('expense');
    }, []);

    // ========================================== fetch ==========================================
    // 카테고리 데이터 가져오기
    const fetchCategories = async (type: 'income' | 'expense') => {
        try {
            const fetchedCategories = await ipcRenderer.invoke(`get-all-${type}category`);
            setCategories(prev => ({ ...prev, [type]: fetchedCategories }));
        } catch (error) {
            console.error(`${type} 카테고리를 불러오는데 실패했습니다`, error);
        }
    };

    const handleAddCategory = async (type: 'income' | 'expense') => {
        if (newCategoryName[type].trim()) {
            try {
                await ipcRenderer.invoke(`create-${type}category`, { name: newCategoryName[type] });
                setNewCategoryName(prev => ({ ...prev, [type]: '' }));
                fetchCategories(type);
            } catch (error) {
                console.error(`${type} 카테고리 추가에 실패했습니다`, error);
            }
        }
    };

    const handleEditCategory = async (type: 'income' | 'expense', id: number, newName: string) => {
        try {
            await ipcRenderer.invoke(`update-${type}category`, { id, name: newName });
            setEditingCategoryId(prev => ({ ...prev, [type]: null }));
            fetchCategories(type);
        } catch (error) {
            console.error(`${type} 카테고리 수정에 실패했습니다`, error);
        }
    };

    const handleDeleteCategory = async (type: 'income' | 'expense', id: number) => {
        try {
            await ipcRenderer.invoke(`delete-${type}category`, id);
            fetchCategories(type);
        } catch (error) {
            console.error(`${type} 카테고리 삭제에 실패했습니다`, error);
        }
    };

    const renderCategorySection = (type: 'income' | 'expense') => (
        <div className={type === 'income' ? "pr-4 border-r border-gray-300" : "pl-4"}>
            <h4 className="text-md font-semibold mb-2">{type === 'income' ? '수입' : '지출'} 카테고리</h4>
            <div className="flex mb-4">
                <Input
                    type="text"
                    placeholder={`새 ${type === 'income' ? '수입' : '지출'} 카테고리 이름`}
                    value={newCategoryName[type]}
                    onChange={(e) => setNewCategoryName(prev => ({ ...prev, [type]: e.target.value }))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddCategory(type);
                        }
                    }}
                    className="mr-2"
                />
                <Button onClick={() => handleAddCategory(type)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    추가
                </Button>
            </div>
            <div className="space-y-2">
                {categories[type].map((category) => (
                    <Card key={category.id}>
                        <CardContent className="flex items-center justify-between p-2">
                            {editingCategoryId[type] === category.id ? (
                                <Input
                                    type="text"
                                    defaultValue={category.name}
                                    onBlur={(e) => handleEditCategory(type, category.id, e.currentTarget.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleEditCategory(type, category.id, e.currentTarget.value);
                                        }
                                    }}
                                    autoFocus
                                    className="flex-1"
                                />
                            ) : (
                                <span className="pl-2">{category.name}</span>
                            )}
                            <div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingCategoryId(prev => ({ ...prev, [type]: category.id }))}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteCategory(type, category.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <h3 className="text-lg font-semibold mb-4">수입 지출 항목 관리</h3>
            <div className="grid grid-cols-2 gap-4 flex-1">  
                {renderCategorySection('income')}
                {renderCategorySection('expense')}
            </div>
        </>
    );
};

export default CategorySetting;