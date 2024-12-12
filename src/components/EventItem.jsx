import React from 'react';
import { useDrag } from 'react-dnd';
import { Clock } from 'lucide-react';

function EventItem({ event }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { id: event.id, date: event.date },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [event.id, event.date]);

  return (
    <div
      ref={drag}
      className={`
        ${event.color} ${event.color.replace('bg-', 'text-').replace('100', '800')}
        flex items-center space-x-2 p-2 rounded-lg text-xs 
        transition-all duration-200 
        ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'}
        cursor-move
      `}
      title={`${event.name} (${event.startTime} - ${event.endTime})`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <div className="flex-1 truncate">
        <span className="font-semibold mr-1">{event.name}</span>
        <span className="text-[0.65rem] opacity-70">
          {event.startTime}
        </span>
      </div>
    </div>
  );
}

export default EventItem;