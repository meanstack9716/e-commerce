export interface RewardHistory {
  id: string;
  points: number;
  reason: string;
  created_at: string;
}

export interface RewardPointsResponse {
  available_points: number;
  total_earned: number;
  total_redeemed: number;
}

export interface RewardHistoryResponse {
  data: RewardHistory[];
  total_items: number;
  per_page: number;
  current_page: number;
  last_page: number;
}