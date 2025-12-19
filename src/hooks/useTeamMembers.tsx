import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { TeamMember } from '@/types/database';

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const data = await apiGet<TeamMember[] | { results?: TeamMember[] }>('/api/team-members/');
      const items = Array.isArray(data) ? data : data.results ?? [];
      return items.map((member) => ({
        ...member,
        photo: member.photo_url ?? member.photo ?? null,
      }));
    },
  });
}
