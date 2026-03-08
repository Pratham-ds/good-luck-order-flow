
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Award, Gift, Star, Trophy, Sparkles } from 'lucide-react';

interface LoyaltyStatus {
  total_delivered_orders: number;
  current_milestone: number;
  next_milestone: number;
  orders_to_next: number;
  available_rewards: number;
}

interface LoyaltyReward {
  id: string;
  milestone: number;
  reward_type: string;
  reward_value: number;
  redeemed: boolean;
  redeemed_at: string | null;
  created_at: string;
}

const milestoneIcons: Record<number, React.ReactNode> = {
  5: <Star className="w-5 h-5 text-yellow-500" />,
  10: <Award className="w-5 h-5 text-blue-500" />,
  15: <Trophy className="w-5 h-5 text-purple-500" />,
  20: <Sparkles className="w-5 h-5 text-pink-500" />,
  25: <Gift className="w-5 h-5 text-green-500" />,
};

const getMilestoneLabel = (milestone: number) => {
  if (milestone <= 5) return 'Bronze';
  if (milestone <= 10) return 'Silver';
  if (milestone <= 15) return 'Gold';
  if (milestone <= 25) return 'Platinum';
  return 'Diamond';
};

const getMilestoneColor = (milestone: number) => {
  if (milestone <= 5) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (milestone <= 10) return 'bg-slate-100 text-slate-800 border-slate-300';
  if (milestone <= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (milestone <= 25) return 'bg-purple-100 text-purple-800 border-purple-300';
  return 'bg-blue-100 text-blue-800 border-blue-300';
};

const LoyaltyRewards = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch loyalty status
        const { data: statusData, error: statusError } = await supabase
          .rpc('get_loyalty_status', { user_uuid: user.id });

        if (statusError) throw statusError;
        if (statusData && statusData.length > 0) {
          setStatus(statusData[0] as LoyaltyStatus);
        }

        // Fetch rewards
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('loyalty_rewards')
          .select('*')
          .eq('user_id', user.id)
          .order('milestone', { ascending: true });

        if (rewardsError) throw rewardsError;
        setRewards((rewardsData || []) as LoyaltyReward[]);
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading loyalty status...
        </CardContent>
      </Card>
    );
  }

  const totalOrders = status?.total_delivered_orders || 0;
  const nextMilestone = status?.next_milestone || 5;
  const currentMilestone = status?.current_milestone || 0;
  const ordersToNext = status?.orders_to_next || 5;
  const progressPercent = nextMilestone > 0
    ? Math.min(((totalOrders - currentMilestone) / (nextMilestone - currentMilestone)) * 100, 100)
    : 0;

  const allMilestones = [5, 10, 15, 20, 25, 30, 40, 50];

  return (
    <div className="space-y-6">
      {/* Loyalty Status Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Loyalty Rewards Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Level */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Level</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMilestoneColor(currentMilestone || nextMilestone)}`}>
                  {getMilestoneLabel(currentMilestone || nextMilestone)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Completed Orders</p>
              <p className="text-3xl font-bold text-primary">{totalOrders}</p>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to next reward</span>
              <span className="font-medium">{ordersToNext > 0 ? `${ordersToNext} orders to go` : 'Milestone reached! 🎉'}</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentMilestone} orders</span>
              <span>{nextMilestone} orders</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allMilestones.map((m) => {
              const reached = totalOrders >= m;
              const reward = rewards.find(r => r.milestone === m);
              return (
                <div
                  key={m}
                  className={`relative p-4 rounded-lg border-2 text-center transition-all ${
                    reached
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-muted bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {milestoneIcons[m] || <Star className={`w-5 h-5 ${reached ? 'text-primary' : 'text-muted-foreground'}`} />}
                  </div>
                  <p className="font-bold text-lg">{m}</p>
                  <p className="text-xs text-muted-foreground">orders</p>
                  {reached && (
                    <Badge variant="default" className="mt-2 text-xs">
                      {reward?.redeemed ? 'Redeemed' : reward ? 'Available!' : 'Unlocked'}
                    </Badge>
                  )}
                  {reached && reward && !reward.redeemed && (
                    <p className="text-xs text-primary font-medium mt-1">
                      {reward.reward_value}% off next order
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      {rewards.filter(r => !r.redeemed).length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.filter(r => !r.redeemed).map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Milestone {reward.milestone} Reward</p>
                      <p className="text-sm text-muted-foreground">
                        {reward.reward_value}% discount on your next order
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    Available
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reward History */}
      {rewards.filter(r => r.redeemed).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reward History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewards.filter(r => r.redeemed).map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Milestone {reward.milestone} – {reward.reward_value}% off</p>
                    <p className="text-xs text-muted-foreground">
                      Redeemed on {new Date(reward.redeemed_at!).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Redeemed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoyaltyRewards;
