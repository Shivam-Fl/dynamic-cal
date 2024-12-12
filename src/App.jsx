import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  startOfWeek, 
  endOfWeek, 
  parseISO 
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CalendarPlus 
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Day from './components/Day';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import ExportButton from './components/ExportButton';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowEventList(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSaveEvent = (event) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e));
    } else {
      setEvents([...events, event]);
    }
    setShowEventForm(false);
  };

  const handleMoveEvent = (eventId, newDate) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, date: newDate } : event
    ));
  };

  // Count events for the current month
  const currentMonthEvents = events.filter(event => 
    isSameMonth(parseISO(event.date), currentDate)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              {/* Month Navigation */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={prevMonth} 
                  className="
                    p-2 bg-gray-100 hover:bg-gray-200 
                    rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                  "
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                
                <h1 className="text-sm md:text-3xl font-bold text-gray-800">
                  {format(currentDate, 'MMMM yyyy')}
                </h1>
                
                <button 
                  onClick={nextMonth} 
                  className="
                    p-2 bg-gray-100 hover:bg-gray-200 
                    rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                  "
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-3 max-md:space-x-1">
                <ExportButton events={events} currentDate={currentDate} />
                {selectedDate && (
                  <button 
                    onClick={handleAddEvent}
                    className="
                      flex items-center space-x-2 
                      bg-blue-600 text-white 
                      px-4 py-2 rounded-lg 
                      hover:bg-blue-700 
                      transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-300 max-md:space-x-0 max-md:py-2 max-sm:px-1 max-md:font-lg
                    "
                  >
                    <Plus className="w-5 h-5 max-md:w-3 max-md:h-3 max-sm:hidden" />
                    <span className='max-md:text-xs'>Add Event</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Month Summary */}
            <div className="mt-4 text-sm text-gray-600 flex items-center space-x-3">
              <CalendarPlus className="w-5 h-5 text-blue-500" />
              <span>
                {currentMonthEvents.length} event{currentMonthEvents.length !== 1 ? 's' : ''} 
                {' '}this month
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-100 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div 
                  key={day} 
                  className="
                    text-center font-semibold text-gray-600 
                    p-3 text-sm uppercase tracking-wider
                  "
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {days.map(day => (
                <Day
                  key={day.toString()}
                  date={day}
                  isCurrentMonth={isSameMonth(day, currentDate)}
                  isToday={isToday(day)}
                  isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                  events={events.filter(event => isSameDay(parseISO(event.date), day))}
                  onClick={() => handleDayClick(day)}
                  onMoveEvent={handleMoveEvent}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <EventForm
            date={selectedDate}
            event={editingEvent}
            onSave={handleSaveEvent}
            onClose={() => setShowEventForm(false)}
          />
        )}

        {/* Event List Modal */}
        {showEventList && selectedDate && (
          <EventList
            date={selectedDate}
            events={events.filter(event => isSameDay(parseISO(event.date), selectedDate))}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setShowEventList(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;