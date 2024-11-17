import MyCalendar from "./module/MyCalendar";

const CalendarPage = ({ isCollapsed }: { isCollapsed: boolean }) => {
    return (
        <div className='p-5 flex flex-col gap-4 flex-1'>
            <div className='title text-2xl font-bold'>가계부 캘린더</div>
            <MyCalendar />
        </div>
    )
}

export default CalendarPage;