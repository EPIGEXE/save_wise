import MyCalendar from "./MyCalendar";

const TestPage = ({ isCollapsed }: { isCollapsed: boolean }) => {
    return (
        <div className='p-5 flex flex-col gap-4 flex-1'>
            <div className='title text-2xl font-bold'>테스트 페이지</div>
            <MyCalendar />

        </div>
    )
}

export default TestPage;