import { Pool, Profile } from '.';

export interface Member {
  user_id: string;
  user?: Profile;
  pool_id: number;
  pool?: Pool;
  active: boolean;
  role: 'admin' | 'member';
  last_viewed_at: Date;
}
