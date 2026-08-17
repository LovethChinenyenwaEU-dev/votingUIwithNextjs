import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Voter {
  id: number;
  name: string;
  hasVoted: boolean;
  votedFor?: string;
}

export interface VotingState {
  voters: Voter[];
  votes: Record<string, number>;
  isClosed: boolean;
}

const STORAGE_KEY = "cohort_voting_system_state";


const initialVoters: Voter[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `Voter ${index + 1}`,
  hasVoted: false,
}));


const getInitialState = (): VotingState => {
  return { voters: initialVoters, votes: {}, isClosed: false };
};

const saveStateToStorage = (state: VotingState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

export function useVoting() {
  const queryClient = useQueryClient();

  
  const { data = getInitialState() } = useQuery({
    queryKey: ["votingState"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            return JSON.parse(saved) as VotingState;
          } catch (e) {
            console.error("Failed to parse voting state from storage", e);
          }
        }
      }
      return getInitialState();
    },
    staleTime: Infinity,
  });

  
  const voteMutation = useMutation({
    mutationFn: async ({ voterId, candidateName }: { voterId: number; candidateName: string }) => {
      const normalizedCandidate = candidateName.trim().toLowerCase();
      if (!normalizedCandidate) throw new Error("Candidate name cannot be empty");

      const currentState = queryClient.getQueryData<VotingState>(["votingState"]) || getInitialState();
      
      
      const targetVoter = currentState.voters.find((v) => v.id === voterId);
      if (!targetVoter || targetVoter.hasVoted) {
        throw new Error("This voter has already cast their vote.");
      }

      
      const updatedVoters = currentState.voters.map((v) => 
        v.id === voterId ? { ...v, hasVoted: true, votedFor: normalizedCandidate } : v
      );

  
      const updatedVotes = { ...currentState.votes };
      updatedVotes[normalizedCandidate] = (updatedVotes[normalizedCandidate] || 0) + 1;

      
      const allVoted = updatedVoters.every((v) => v.hasVoted);

      const newState: VotingState = {
        voters: updatedVoters,
        votes: updatedVotes,
        isClosed: allVoted,
      };

      saveStateToStorage(newState);
      return newState;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["votingState"], newData);
    },
  });

  
  const resetMutation = useMutation({
    mutationFn: async () => {
      const freshState: VotingState = { voters: initialVoters, votes: {}, isClosed: false };
      saveStateToStorage(freshState);
      return freshState;
    },
    onSuccess: (freshData) => {
      queryClient.setQueryData(["votingState"], freshData);
    },
  });

  return {
    votingState: data,
    castVote: voteMutation.mutateAsync,
    isVoting: voteMutation.isPending,
    resetVoting: resetMutation.mutateAsync,
  };
}
