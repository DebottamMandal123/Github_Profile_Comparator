import React from 'react'

export const Header2: React.FC = () => {
  return (
    <div>
      <header className="flex flex-row bg-white min-h-[70px]  bg-opacity-[10%] backdrop-blur-md rounded-[50px] text-[18px] justify-between text-white items-center">
        <div className='mx-10 text-2xl'>DEBOTTAM MANDAL</div>
        <div className='flex flex-row'>
            <div className='mx-6 text-2xl cursor-not-allowed'>HOME</div>
            <a className='mx-10 text-2xl' href='https://x.com/debmsn43' target='_blank' rel='noopener noreferrer'>HELLO!</a>
        </div>
      </header>
    </div>
  )
}