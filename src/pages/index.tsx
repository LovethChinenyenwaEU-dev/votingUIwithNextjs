import React, { useState, useEffect } from "react";
import { useVoting } from "@/hooks/useVoting";
import VotingForm from "@/components/votingform";
import ResultsModal from "@/components/resultsModal";

export default function Home() {
  const { votingState } = useVoting();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalVotedCount = votingState.voters.filter((v) => v.hasVoted).length;

  
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">Loading election application...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Africaplan Foundation Election
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">
          Cast your vote here and select your best candidate
        </p>
      </div>

      <VotingForm />

      <div className="flex flex-col items-center justify-center pt-2">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!votingState.isClosed}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg transition-all transform active:scale-95"
        >
          <span> View Winners</span>
          {!votingState.isClosed && (
            <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-md font-normal">
              ({totalVotedCount}/20 Voted)
            </span>
          )}
        </button>
        {!votingState.isClosed && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
          </p>
        )}
      </div>

      <ResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        votingState={votingState}
      />
    </div>
  );
}
