import React from 'react';

/**
 * A reusable button component.
 *
 * @param {string} title - The text to display on the button.
 * @param {string} id - The ID attribute for the button element.
 * @param {React.ReactNode} [rightIcon] - Optional icon to display on the right side of the text.
 * @param {React.ReactNode} [leftIcon] - Optional icon to display on the left side of the text.
 * @param {string} [containerClass] - Optional additional CSS classes for the button container.
 * @param {function} [onClick] - Optional click handler for the button.
 */
const Button = ({ title, id, rightIcon, leftIcon, containerClass, onClick }) => {
    return (
        // Main button element with base styling and optional custom classes
        <button
            id={id}
            className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-2 text-black ${containerClass}`}
            onClick={onClick}
        >
            {/* Render the left icon */}
            {leftIcon}

            <span className='relative inline-flex overflow-hidden font-general uppercase'>
                <div>
                    {/* Display the button title */}
                    {title}
                </div>
            </span>

            {/* Render the right icon */}
            {rightIcon}
        </button>
    );
};

export default Button;