import React from 'react';
import { format } from 'date-fns';
import { X, Edit, Trash2 } from 'lucide-react';

function EventList({ date, events, onEdit, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Events on {format(date, 'MMMM d, yyyy')}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 pt-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No events for this day.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {events.map((event) => (
                <li 
                  key={event.id} 
                  className={`
                    ${event.color} ${event.color.replace('bg-', 'text-').replace('100', '800')}
                    border border-opacity-50 rounded-lg p-4 relative
                  `}
                >
                  <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <span className="font-medium">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm opacity-70 mb-3">{event.description}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(event)} 
                      className="
                        flex items-center space-x-1 
                        px-3 py-1.5 bg-blue-100 text-blue-800 
                        rounded-md hover:bg-blue-200 transition-colors
                      "
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-xs">Edit</span>
                    </button>
                    <button 
                      onClick={() => onDelete(event.id)} 
                      className="
                        flex items-center space-x-1 
                        px-3 py-1.5 bg-red-100 text-red-800 
                        rounded-md hover:bg-red-200 transition-colors
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs">Delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventList;