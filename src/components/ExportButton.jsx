import React, { useState } from 'react';
import { format, parse, isSameMonth } from 'date-fns';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

function ExportButton({ events, currentDate }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    const currentMonthEvents = events.filter(event => 
      isSameMonth(parse(event.date, 'yyyy-MM-dd', new Date()), currentDate)
    );

    let content;
    let filename;
    let mimeType;

    if (exportFormat === 'json') {
      content = JSON.stringify(currentMonthEvents, null, 2);
      filename = `events_${format(currentDate, 'yyyy-MM')}.json`;
      mimeType = 'application/json';
    } else {
      const headers = ['id', 'date', 'name', 'startTime', 'endTime', 'description', 'color'];
      const csvContent = [
        headers.join(','),
        ...currentMonthEvents.map(event => 
          headers.map(header => JSON.stringify(event[header] || '')).join(',')
        )
      ].join('\n');
      content = csvContent;
      filename = `events_${format(currentDate, 'yyyy-MM')}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Simulate export completion
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="
            appearance-none w-full pl-3 pr-8 py-2 
            border border-gray-300 rounded-lg 
            text-sm bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-200
            max-md:text-xs
          "
        >
          <option value="json" className="flex items-center">
            JSON
          </option>
          <option value="csv">CSV</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {exportFormat === 'json' ? (
            <FileJson className="w-5 h-5 text-gray-400" />
          ) : (
            <FileSpreadsheet className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <button 
        onClick={handleExport} 
        disabled={isExporting}
        className="
          flex items-center justify-center 
          px-4 py-2 
          bg-blue-600 text-white 
          rounded-lg 
          hover:bg-blue-700 
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          space-x-2
        "
      >
        {isExporting ? (
          <span className="animate-pulse">Exporting...</span>
        ) : (
          <>
            <Download className="w-5 h-5 max-md:w-4 max-md:h-4" />
            <span className='max-md:text-xs'>Export</span>
          </>
        )}
      </button>
    </div>
  );
}

export default ExportButton;