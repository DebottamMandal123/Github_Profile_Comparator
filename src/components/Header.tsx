import React from 'react'

export const Header: React.FC = () => {
  return (
    <div>
      <header className="flex flex-row bg-white min-h-[90px]  bg-opacity-[10%] backdrop-blur-md rounded-[50px] text-[18px] justify-between text-white items-center">
        <div className='mx-10 text-3xl'>DEBOTTAM MANDAL</div>
        <div className='flex flex-row'>
            <div className='mx-6 text-3xl cursor-not-allowed'>HOME</div>
            <a className='mx-10 text-3xl' href='https://x.com/debmsn43' target='_blank' rel='noopener noreferrer'>HELLO!</a>
        </div>
      </header>
    </div>
  )
}