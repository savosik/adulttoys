import React, { useState, useEffect } from 'react';

const TypingText = ({ phrases }) => {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const fullText = phrases[currentPhraseIndex];
            
            if (!isDeleting && currentText === fullText) {
                setIsDeleting(true);
                setTypingSpeed(15000); // Pause for 15 seconds at the end of phrase
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                setTypingSpeed(500); // Pause before starting next phrase
            } else {
                const nextText = isDeleting 
                    ? fullText.substring(0, currentText.length - 1)
                    : fullText.substring(0, currentText.length + 1);
                
                setCurrentText(nextText);
                setTypingSpeed(isDeleting ? 25 : 150);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, phrases, currentPhraseIndex, typingSpeed]);

    return (
        <span className="italic text-gray-500 text-[10px] sm:text-xs md:text-sm font-semibold leading-tight inline-block max-w-[150px] sm:max-w-[250px] md:max-w-none transform translate-y-[-1px]">
            {currentText}
            <span className="inline-block w-[1.5px] h-3 bg-gray-500 ml-0.5 animate-pulse align-middle"></span>
        </span>
    );
};

export default TypingText;
