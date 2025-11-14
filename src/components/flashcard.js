'use client'

import { useState } from 'react'

export function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <div className="w-full max-w-sm aspect-[3/2] perspective-1000">
      <div 
        className="relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-card rounded-3xl shadow-2xl p-8 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Translate this word:</p>
            <h2 className="text-4xl font-bold text-card-foreground">{front}</h2>
            <p className="text-xs text-muted-foreground mt-4">Tap to reveal</p>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-primary rounded-3xl shadow-2xl p-8 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center">
            <p className="text-sm text-primary-foreground/80 mb-2">Translation:</p>
            <h2 className="text-4xl font-bold text-primary-foreground">{back}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
