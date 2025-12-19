import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { TeamMember } from '@/types/database';

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      return apiGet<TeamMember[]>('/api/team-members/');
    },
  });
}
