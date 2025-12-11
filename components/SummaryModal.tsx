import React from 'react';
import { X, Sparkles, Bot } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, isLoading }) => {
  if (!isOpen) return null;

  // Function to parse **bold** syntax and return React nodes
  const renderFormattedText = (text: string) => {
    // Regex matches **...** and captures content inside
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** delimiters and wrap in strong tag
            return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-start shrink-0">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
               <Sparkles className="text-white" size={24} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">AI Traffic Insight</h2>
               <p className="text-indigo-100 text-sm">Powered by Gemini</p>
             </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
           {isLoading ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium animate-pulse">Analyzing real-time incident data...</p>
             </div>
           ) : (
             <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Bot className="text-indigo-600" size={24} />
                  </div>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                    {renderFormattedText(summary)}
                  </div>
               </div>
             </div>
           )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};