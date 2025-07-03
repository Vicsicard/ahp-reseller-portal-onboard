import React from 'react';

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="progress-indicator">
      {steps.map((step, index) => {
        // Determine the status of this step
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isIncomplete = index > currentStep;
        
        // Determine the status class for the circle
        let circleClass = 'progress-circle';
        if (isActive) circleClass += ' active';
        else if (isCompleted) circleClass += ' completed';
        else if (isIncomplete) circleClass += ' incomplete';
        
        // Determine the status class for the connecting line
        let lineClass = 'progress-line';
        if (isCompleted) lineClass += ' active';
        
        return (
          <React.Fragment key={index}>
            <div className="progress-step">
              <div className={circleClass}>
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
            
            {/* Add connecting line except after the last step */}
            {index < steps.length - 1 && (
              <div className={lineClass}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
