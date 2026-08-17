import React, { useState } from "react";
import { useVoting } from "@/hooks/useVoting";

export default function VotingForm() {
  const { votingState, castVote, isVoting, resetVoting } = useVoting();
  const [selectedVoterId, setSelectedVoterId] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const activeVoters = votingState.voters.filter((v) => !v.hasVoted);
  const totalVotedCount = votingState.voters.filter((v) => v.hasVoted).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedVoterId) {
      setError("Please select a voter from the dropdown.");
      return;
    }

    if (!candidateName.trim()) {
      setError("Please enter a candidate name.");
      return;
    }

    try {
      await castVote({
        voterId: Number(selectedVoterId),
        candidateName: candidateName,
      });
      setSuccessMsg(`Vote successfully cast for "${candidateName.trim()}"!`);
      setSelectedVoterId("");
      setCandidateName("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Cast Your Vote</h2>
          <p className="text-sm text-gray-500">Progress: {totalVotedCount} / 20 Voters Voted</p>
        </div>
        <button
          onClick={() => resetVoting()}
          className="text-xs bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg border transition-colors"
        >
          Reset All Votes
        </button>
      </div>

      {votingState.isClosed ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-amber-800 font-medium">
          Voting is now closed! All 20 votes have been cast. Check the results button below.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-lg font-medium">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Voter (Remaining: {activeVoters.length})
            </label>
            <select
              value={selectedVoterId}
              onChange={(e) => setSelectedVoterId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value=""> Choose your voter ID </option>
              {votingState.voters.map((voter) => (
                <option key={voter.id} value={voter.id} disabled={voter.hasVoted}>
                  {voter.name} {voter.hasVoted ? " (Already Voted)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Type candidate name..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isVoting || activeVoters.length === 0}
            className="w-full bg-slate-950/50 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
          >
            {isVoting ? "Submitting..." : "Submit Vote"}
          </button>
        </form>
      )}
    </div>
  );
}
