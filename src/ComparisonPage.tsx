/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Chart } from "./components/Chart"
import { useLocation } from 'react-router-dom'
import { Header2 } from './components/Header2';

export const ComparisonPage: React.FC = () => {
  const location = useLocation();
  const { myName, comparerName, user1Contributions, user2Contributions, startYear, endYear, maxYValue } = location.state as any

  console.log("ComparisonPage received data:", {
    myName,
    comparerName,
    user1Contributions,
    user2Contributions,
    startYear,
    endYear,
    maxYValue
  });

  return (
    <div className="bg-cover bg-[center_top] min-h-screen bg-custom-gradient text-white flex flex-col items-center">
      <div className="relative z-10 container mx-auto py-12">
        <Header2 />
        <h1 className="text-5xl font-semibold font-[Helvetica] p-8">GitHub Profile <br /> Comparison</h1>
        <div className='px-8'>
          <Chart 
            myName={myName} 
            comparerName={comparerName} 
            user1Contributions={user1Contributions} 
            user2Contributions={user2Contributions} 
            startYear={startYear} 
            endYear={endYear} 
            maxYValue={maxYValue} 
          />
        </div>
      </div>
    </div>
  )
}