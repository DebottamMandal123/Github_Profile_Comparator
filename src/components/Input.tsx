import React from 'react'

interface InputProps {
  placeholder: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({ placeholder, onChange }) => {
  return (
    <div>
      <input className='bg-white border py-5 rounded-[50px] w-[130%] text-3xl px-4 font-light hover:border-black hover:border-spacing-4' placeholder={placeholder} onChange={onChange}></input>
    </div>
  )
}