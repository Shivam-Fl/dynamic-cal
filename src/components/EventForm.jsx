import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const colorOptions = [
  { value: 'bg-red-100', label: 'Red', textColor: 'text-red-800' },
  { value: 'bg-blue-100', label: 'Blue', textColor: 'text-blue-800' },
  { value: 'bg-green-100', label: 'Green', textColor: 'text-green-800' },
  { value: 'bg-yellow-100', label: 'Yellow', textColor: 'text-yellow-800' },
  { value: 'bg-purple-100', label: 'Purple', textColor: 'text-purple-800' },
];

function EventForm({ date, event, onSave, onClose }) {
  const [name, setName] = useState(event?.name || '');
  const [startTime, setStartTime] = useState(event?.startTime || '');
  const [endTime, setEndTime] = useState(event?.endTime || '');
  const [description, setDescription] = useState(event?.description || '');
  const [color, setColor] = useState(event?.color || colorOptions[0].value);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setDescription(event.description || '');
      setColor(event.color);
    } else {
      setName('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setColor(colorOptions[0].value);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: event?.id || Date.now().toString(),
      date: format(date, 'yyyy-MM-dd'),
      name,
      startTime,
      endTime,
      description,
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>
            
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-200 transition-all"
            />
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Event Color</label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`
                      ${option.value} ${option.textColor}
                      rounded-lg p-2 text-xs text-center
                      ${color === option.value ? 'ring-2 ring-blue-500' : ''}
                      hover:opacity-80 transition-all
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventForm;