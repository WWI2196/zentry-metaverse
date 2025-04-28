import React from 'react'

/**
 * BentoCard displays a looping background video with overlaid title and optional description.
 *
 * @param {string} src - Video URL.
 * @param {string} title - Card heading.
 * @param {string} [description] - Optional text below the title.
 * @param {boolean} [isComingSoon] - Flag indicating upcoming content.
 */
const BentoCard = ({src, title,description,isComingSoon}) => {
  return (
    // container for video and overlay
    <div className='relative size-full'>
      {/* Background video: loop, muted, auto-play, covers container */}
      <video
        src={src}
        loop
        muted
        autoPlay
        className='absolute left-0 top-0 size-full object-cover object-center'
      />
      {/* Overlay above video with title and description */}
      <div className='relative z-10 flex size-full flex-col justify-between p-5 text-blue-50'>
        <div>
          {/* Card title */}
          <h1 className='bento-title special-title'>{title}</h1>
          {/* Optional description */}
          {description && (
            <p className='mt-3 max-w-64 text-xs'>{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BentoCard