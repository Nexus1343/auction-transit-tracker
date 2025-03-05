
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  buyer_id: string;
  buyer_id_2: string;
  dealer_fee: number;
  dealer_fee_2: number;
  transport_price_id: number;
  container_price_id: number;
  user_id: number;
  profile_image: any;
}

interface PricePlan {
  id: number;
  name: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    name: '',
    email: '',
    password: '********',
    mobile: '',
    buyer_id: '',
    buyer_id_2: '',
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: 0,
    container_price_id: 0,
    user_id: 0,
    profile_image: null
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for password change
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for pricing plans (from the pricing tables)
  const [transportPricePlans, setTransportPricePlans] = useState<PricePlan[]>([]);
  const [containerPricePlans, setContainerPricePlans] = useState<PricePlan[]>([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile from user_profile table
        const { data: userProfile, error: userProfileError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (userProfileError) throw userProfileError;
        
        if (userProfile) {
          // Fetch dealer info if exists
          const { data: dealerData, error: dealerError } = await supabase
            .from('dealers')
            .select('*')
            .eq('user_id', userProfile.id)
            .maybeSingle();
            
          if (dealerError) throw dealerError;
          
          setProfileData({
            id: dealerData?.id || 0,
            name: userProfile.name || '',
            email: userProfile.email || '',
            password: '********',
            mobile: userProfile.mobile || dealerData?.mobile || '',
            buyer_id: dealerData?.buyer_id || '',
            buyer_id_2: dealerData?.buyer_id_2 || '',
            dealer_fee: dealerData?.dealer_fee || 0,
            dealer_fee_2: dealerData?.dealer_fee_2 || 0,
            transport_price_id: dealerData?.transport_price_id || 0,
            container_price_id: dealerData?.container_price_id || 0,
            user_id: userProfile.id || 0,
            profile_image: null
          });
        }
        
        // Fetch transport price plans
        const { data: transportPrices, error: transportError } = await supabase
          .from('transport_prices')
          .select('id, city, state');
          
        if (transportError) throw transportError;
        
        setTransportPricePlans(transportPrices?.map(tp => ({
          id: tp.id,
          name: `${tp.city || ''}, ${tp.state || ''} Transportation`
        })) || []);
        
        // Fetch container price plans
        const { data: containerPrices, error: containerError } = await supabase
          .from('container_prices')
          .select('id, port, vehicle_type');
          
        if (containerError) throw containerError;
        
        setContainerPricePlans(containerPrices?.map(cp => ({
          id: cp.id,
          name: `${cp.port || ''} - ${cp.vehicle_type || ''} Container`
        })) || []);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, toast]);

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    showPasswordDialog,
    setShowPasswordDialog,
    passwordData,
    setPasswordData,
    transportPricePlans,
    containerPricePlans,
    isLoading,
    handleChange
  };
};
