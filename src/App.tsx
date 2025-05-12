import React, { useState } from 'react'
import gorillaImage from "./assets/gorilla-bg-min.jpg"
import { Header } from './components/Header';
import { Input } from './components/Input';
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowRight } from 'lucide-react';
import { getGithubProfileContributions, getGithubProfileInformations } from './API/ProfileData';
import { AxiosError } from 'axios';
import { Loader } from './components/Loader';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ComparisonPage } from './ComparisonPage';

const calculateYearlyContributions = async (username: string) => {
  try {
    const userInfo = await getGithubProfileInformations(username);
    const createdAt = new Date(userInfo.created_at);
    const currentYear = new Date().getFullYear();
    const startYear = createdAt.getFullYear();

    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    const contributions = years.map((year) => getGithubProfileContributions(username, year));
    const yearlyContributions = await Promise.all(contributions);

    const contributionsMap = yearlyContributions.reduce((acc, { year, totalContributions }) => {
      acc[year] = totalContributions;
      return acc;
    }, {} as { [year: string]: number });

    console.log(`Processed yearly contributions for ${username}:`, contributionsMap);
    return contributionsMap;
  } catch (error) {
    console.error("Error calculating the yearly contributions", error);
    throw error;
  }
};

const App: React.FC = () => {
  const [myGithubUsername, setMyGithubUsername] = useState<string>("");
  const [comparerGithubUsername, setComparerGithubUsername] = useState<string>("");
  const [ , setMyName] = useState<string>("");
  const [ , setComparerName] = useState<string>("");
  const [ , setMyGithubContribution] = useState<{ [year: string]: number }>({});
  const [ , setComparerGithubContribution] = useState<{ [year: string]: number }>({});
  const [ , setStartYear] = useState<number>(new Date().getFullYear());
  const [ , setEndYear] = useState<number>(new Date().getFullYear());
  const [ , SetMaxYValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWarning1, setShowWarning1] = useState<boolean>(false);
  const [showWarning2, setShowWarning2] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleCompare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setMyName("");
    setComparerName("");
    setMyGithubContribution({});
    setComparerGithubContribution({});
    setIsLoading(true);
    setShowWarning1(false);
    setShowWarning2(false);
    setError("");

    if (!myGithubUsername){
      setShowWarning1(true);
      return;
    }

    if (!comparerGithubUsername){
      setShowWarning2(true);
      return;
    }

    if (myGithubUsername == comparerGithubUsername){
      setError("You can't compare to yourself");
      setIsLoading(false);
      return;
    }

    try {
      const[myUsername, comparerUsername] = await Promise.all([
        getGithubProfileInformations(myGithubUsername),
        getGithubProfileInformations(comparerGithubUsername),
      ]);

      console.log(myUsername.name);
      console.log(comparerUsername.name);

      setMyName(myUsername.name || myGithubUsername);
      setComparerName(comparerUsername.name || comparerGithubUsername);

      const[myContributions, comparerContributions] = await Promise.all([
        calculateYearlyContributions(myGithubUsername),
        calculateYearlyContributions(comparerGithubUsername)
      ])

      setMyGithubContribution(myContributions);
      setComparerGithubContribution(comparerContributions);

      const allYears = [
        ...Object.keys(myContributions),
        ...Object.keys(comparerContributions)
      ].map(year => parseInt(year));
      
      const calculatedStartYear = Math.min(...allYears);
      const calculatedEndYear = Math.max(...allYears);
      
      setStartYear(calculatedStartYear);
      setEndYear(calculatedEndYear);
  
      const maxContribution = Math.max(
        ...Object.values(myContributions),
        ...Object.values(comparerContributions)
      );
      SetMaxYValue(maxContribution);

      navigate("/chart", {
        state: {
          myName: myUsername.name || myGithubUsername,
          comparerName: comparerUsername.name || comparerGithubUsername,
          user1Contributions: myContributions,
          user2Contributions: comparerContributions,
          startYear: calculatedStartYear,
          endYear: calculatedEndYear,
          maxYValue: maxContribution
        }
      });

    }
    catch(error: unknown) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      if (axiosError.response && axiosError.response.status === 404){
        const url = axiosError.config?.url;
        console.log(url);
        if (url) {
          if (url.includes(myGithubUsername)){
            setError("Username not found");
          }
          else if (url.includes(comparerGithubUsername)){
            setError("Comparer username not found");
          }
        }
        else {
          setError("Request url is not available");
        }
      }
      else {
        setError("Error fetching the data, please try again");
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <Routes>
      <Route path='/' element={
        <div className="bg-cover bg-[center_top] min-h-screen" style={{backgroundImage: `url(${gorillaImage})`}}>
          <div className="relative z-10 container mx-auto py-12">
            <Header />
            <div className="flex flex-col mt-80">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-white text-8xl text-center font-semibold font-[Helvetica] ml-10"
              >
                GitHub Profile<br />Comparison
              </motion.div>
              <motion.div
                initial={{ y: "100%", opacity: 0, scale: 1.2 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0 }}
                className="flex justify-around my-4"
              >
                <div className="translate-x-14">
                  <Input placeholder="Your Username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setMyGithubUsername(e.target.value);
                    setShowWarning1(false);
                  }}/>
                  {showWarning1 && (
                    <div className="mt-2 px-4 py-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg flex items-center ml-10 text-xl relative w-72">
                      <AlertCircle className="mr-2" size={24} />
                      Please fill out this field.
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-yellow-100 border-l border-t border-yellow-300 transform -rotate-45"></div>
                    </div>
                  )}
                </div>
                <div className="bg-none text-white text-6xl font-bold border-4 rounded-full w-[100x] h-[100px] px-2 py-2.5 translate-x-10"> {isLoading ? <Loader /> : "VS"}</div>
                <div className="-translate-x-24">
                  <Input placeholder="Enter other persons username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setComparerGithubUsername(e.target.value);
                    setShowWarning2(false);
                  }}/>
                  {showWarning2 && (
                    <div className="mt-3 px-4 py-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg flex items-center ml-10 text-xl relative w-72">
                      <AlertCircle className="mr-2" size={24} />
                      Please fill out this field.
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-yellow-100 border-l border-t border-yellow-300 transform -rotate-45"></div>
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ y: "100%", opacity: 0, scale: 1.2 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0 }}
                className="flex justify-around my-4"
              >
                <div className='translate-x-8'>
                  <button
                    type="submit"
                    className="bg-transparent text-white border-2 border-white rounded-full text-2xl flex items-center overflow-hidden w-72 relative"
                    onClick={handleCompare}
                  >
                    <span className="flex-grow text-left pl-10 py-6">COMPARE</span>
                    <div className="bg-white rounded-full h-full aspect-square flex items-center justify-center absolute right-0">
                      <ArrowRight className="text-black" size={24} />
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 right-4 w-96 bg-red-500 text-white p-4 rounded-md shadow-lg flex items-center"
              >
                <AlertCircle className="h-6 w-6 mr-3" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }></Route>
      <Route path='/chart' element={<ComparisonPage />}></Route>
    </Routes>
  )
}

export default App