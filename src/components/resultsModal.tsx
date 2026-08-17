import React from "react";
import { VotingState } from "@/hooks/useVoting";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  votingState: VotingState;
}

export default function ResultsModal({ isOpen, onClose, votingState }: ResultsModalProps) {
  if (!isOpen) return null;

  const totalVotesCast = Object.values(votingState.votes).reduce((a, b) => a + b, 0);

  
  const sortedCandidates = Object.entries(votingState.votes).sort((a, b) => b[1] - a[1]);

  
  const getRankings = () => {
    if (sortedCandidates.length === 0) return { heads: [], assistants: [] };

    const topVoteCount = sortedCandidates[0][1];
    const heads = sortedCandidates.filter(([_, count]) => count === topVoteCount);


    const remainingAfterHeads = sortedCandidates.filter(([_, count]) => count < topVoteCount);
    
    let assistants: [string, number][] = [];
    if (remainingAfterHeads.length > 0) {
      const secondTopCount = remainingAfterHeads[0][1];
      assistants = remainingAfterHeads.filter(([_, count]) => count === secondTopCount);
    }

    return { heads, assistants, topVoteCount };
  };

  const { heads, assistants } = getRankings();

  const getPercentage = (count: number) => {
    if (totalVotesCast === 0) return "0%";
    return `${((count / totalVotesCast) * 100).toFixed(1)}%`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-800">Election Results</h3>
            <p className="text-xs text-gray-500 font-medium">Total Votes Registered: {totalVotesCast} / 20</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-md">
              {heads.length > 1 ? "Co-Heads of Cohort (Tie)" : "Head of Cohort (Winner)"}
            </span>
            <div className="mt-3 space-y-3">
              {heads.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No votes recorded.</p>
              ) : (
                heads.map(([name, count]) => (
                  <div key={name} className="flex justify-between items-center bg-white p-3.5 rounded-lg shadow-sm border border-indigo-100">
                    <span className="font-bold text-gray-800 capitalize text-lg">{name}</span>
                    <div className="text-right">
                      <span className="font-extrabold text-indigo-600 text-base">{count} votes</span>
                      <span className="block text-xs text-gray-400 font-medium">{getPercentage(count)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md">
              {assistants.length > 1 ? "Co-Assistants (Tie)" : "Assistant Head of Cohort (Runner Up)"}
            </span>
            <div className="mt-3 space-y-3">
              {assistants.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No runner-up candidate qualified.</p>
              ) : (
                assistants.map(([name, count]) => (
                  <div key={name} className="flex justify-between items-center bg-white p-3.5 rounded-lg shadow-sm border border-emerald-100">
                    <span className="font-bold text-gray-800 capitalize text-lg">{name}</span>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-600 text-base">{count} votes</span>
                      <span className="block text-xs text-gray-400 font-medium">{getPercentage(count)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-colors shadow-md"
        >
          Close Results
        </button>
      </div>
    </div>
  );
}
