import styled from "styled-components";

export const StyledCalendarWrapper = styled.div`
    .rbc-calendar {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .rbc-month-view {
        border-radius: 8px;

    }

    .rbc-day-bg {
        position: relative;
        overflow: hidden;
        
        &::after {
            content: '이벤트 추가';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(59, 130, 246, 0.8);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        }
        
        &:hover::after {
            opacity: 1;
        }
        
        &.has-event::after {
            content: none;
        }

        &.has-event {
            & ~ .rbc-row-content {
                pointer-events: auto;
            }
        }
    }

    .rbc-row {
        pointer-events: none;

        &:has(.rbc-day-bg.has-event) {
            pointer-events: auto;
        }
    }

    .rbc-row-content {
        pointer-events: none;
    }

    .rbc-event {
        pointer-events: auto;
    }
`;