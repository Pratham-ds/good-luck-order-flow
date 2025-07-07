
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Sparkles } from 'lucide-react';

interface Suggestion {
  last_order_date: string;
  service_type: string;
  days_since_last_order: number;
  suggestion_message: string;
}

const SmartSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_reorder_suggestions', { user_uuid: user.id });

      if (error) throw error;
      
      // Filter out null suggestions
      const validSuggestions = (data || []).filter((suggestion: Suggestion) => 
        suggestion.suggestion_message !== null
      );
      
      setSuggestions(validSuggestions);
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reorder suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (suggestion: Suggestion) => {
    const serviceName = suggestion.service_type.replace('_', ' ').toUpperCase();
    const message = `Hi! I saw your smart suggestion and would like to reorder my ${serviceName} service. It's been ${suggestion.days_since_last_order} days since my last order. Please schedule a pickup at my convenience.`;
    const whatsappUrl = `https://wa.me/918171647906?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <CardTitle>Smart Reorder Suggestions</CardTitle>
          </div>
          <Button onClick={fetchSuggestions} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
            <p className="text-gray-600">
              Once you have some order history, we'll provide smart suggestions based on your cleaning patterns.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 mb-2">
                      {suggestion.suggestion_message}
                    </p>
                    <p className="text-xs text-yellow-600">
                      Last {suggestion.service_type.replace('_', ' ')} service: {suggestion.days_since_last_order} days ago
                    </p>
                  </div>
                  <Button
                    onClick={() => handleReorder(suggestion)}
                    size="sm"
                    className="ml-4 bg-yellow-600 hover:bg-yellow-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reorder Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
