import React from 'react';
import { format } from 'date-fns';
import { useDrop } from 'react-dnd';
import EventItem from './EventItem';

function Day({ date, isCurrentMonth, isToday, isSelected, events, onClick, onMoveEvent }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: (item) => {
      if (item.date !== format(date, 'yyyy-MM-dd')) {
        onMoveEvent(item.id, format(date, 'yyyy-MM-dd'));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [date, onMoveEvent]);

  return (
    <div
      ref={drop}
      className={`
        relative p-2 border transition-all duration-200 
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} 
        ${isToday ? 'border-2 border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}
        ${isSelected ? 'bg-blue-50 shadow-sm' : ''}
        ${isOver ? 'bg-yellow-50 ring-2 ring-yellow-200' : ''}
        cursor-pointer min-h-12 min-w-10 sm:min-h-[100px] md:min-h-[100px] 
        hover:bg-gray-100 hover:shadow-md
      `}
      onClick={onClick}
    >
      <div 
        className={`
          absolute top-1 right-2 text-sm font-semibold 
          ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
          ${isToday ? 'text-blue-600 font-bold' : ''}
        `}
      >
        {format(date, 'd')}
      </div>
      
      {/* Desktop View - More Events */}
      <div className="hidden sm:block mt-6 space-y-1 overflow-hidden">
        {events.slice(0, 1).map(event => (
          <EventItem key={event.id} event={event} />
        ))}
        {events.length > 1 && (
          <div className="text-xs text-gray-500 pl-1">
            +{events.length - 1} more
          </div>
        )}
      </div>
      
      {/* Mobile View - Event Count */}
      <div className="sm:hidden absolute bottom-1 left-1 right-1">
        {events.length > 0 && (
          <div className="bg-blue-500/80 text-white text-xs text-center rounded-sm  h-[25%] w-[50%]">
            {events.length} 
          </div>
        )}
      </div>
    </div>
  );
}

export default Day;