import MyCalendar from "./MyCalendar";

const TestPage = ({ isCollapsed }: { isCollapsed: boolean }) => {
    return (
        <div className='flex flex-col flex-1'>
            <main
                className={`
                max-h-[calc(100vh-4rem)]
                overflow-y-auto
                transition-all duration-300 ease-in-out 
                flex flex-col flex-1 p-3 ${isCollapsed ? 'pl-[75px]' : 'pl-[250px]'}
                `}
            >
                <div className='p-5 flex flex-col gap-4 flex-1'>
                    <div className='title text-2xl font-bold'>테스트 페이지</div>
                    <MyCalendar />

                </div>
            </main>
        </div>
    )
}

export default TestPage;