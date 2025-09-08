import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, Save, Eye, University } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";

export default function BrandingManagement() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [brandingData, setBrandingData] = useState({
    bankName: "",
    tagline: "",
    primaryColor: "#1e40af", // Default bank blue
    secondaryColor: "#059669", // Default bank green
  });

  const { toast } = useToast();

  const { data: settings = [], isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      apiRequest("PUT", `/api/settings/${id}`, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Branding settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update branding settings",
        variant: "destructive",
      });
    },
  });

  // Get current branding settings
  const brandingSettings = settings.filter(setting => setting.category === "branding");
  const bankNameSetting = brandingSettings.find(s => s.key === "bank_name");
  const taglineSetting = brandingSettings.find(s => s.key === "tagline");
  const logoUrlSetting = brandingSettings.find(s => s.key === "logo_url");
  const primaryColorSetting = brandingSettings.find(s => s.key === "primary_color");
  const secondaryColorSetting = brandingSettings.find(s => s.key === "secondary_color");

  // Initialize form data when settings load
  useState(() => {
    if (bankNameSetting) setBrandingData(prev => ({ ...prev, bankName: bankNameSetting.value }));
    if (taglineSetting) setBrandingData(prev => ({ ...prev, tagline: taglineSetting.value }));
    if (primaryColorSetting) setBrandingData(prev => ({ ...prev, primaryColor: primaryColorSetting.value }));
    if (secondaryColorSetting) setBrandingData(prev => ({ ...prev, secondaryColor: secondaryColorSetting.value }));
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file",
        variant: "destructive",
      });
    }
  };

  const handleSaveBranding = async () => {
    try {
      // Update bank name
      if (bankNameSetting && brandingData.bankName !== bankNameSetting.value) {
        await updateMutation.mutateAsync({ 
          id: bankNameSetting.id, 
          value: brandingData.bankName 
        });
      }

      // Update tagline
      if (taglineSetting && brandingData.tagline !== taglineSetting.value) {
        await updateMutation.mutateAsync({ 
          id: taglineSetting.id, 
          value: brandingData.tagline 
        });
      }

      // Update colors
      if (primaryColorSetting && brandingData.primaryColor !== primaryColorSetting.value) {
        await updateMutation.mutateAsync({ 
          id: primaryColorSetting.id, 
          value: brandingData.primaryColor 
        });
      }

      if (secondaryColorSetting && brandingData.secondaryColor !== secondaryColorSetting.value) {
        await updateMutation.mutateAsync({ 
          id: secondaryColorSetting.id, 
          value: brandingData.secondaryColor 
        });
      }

      // For logo upload, in a real implementation you would upload to a file storage service
      if (logoFile) {
        // Simulated logo upload - in production, upload to cloud storage
        const mockLogoUrl = `/uploads/logo-${Date.now()}.${logoFile.name.split('.').pop()}`;
        
        if (logoUrlSetting) {
          await updateMutation.mutateAsync({ 
            id: logoUrlSetting.id, 
            value: mockLogoUrl 
          });
        }
        
        toast({
          title: "Logo Upload Simulated",
          description: "In production, logo would be uploaded to cloud storage",
        });
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">Branding & Logo Management</h2>
        <div>Loading branding settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold text-bank-navy mb-6" data-testid="text-branding-title">
        Branding & Logo Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Upload Section */}
        <div>
          <h3 className="text-lg font-semibold text-bank-navy mb-4">Bank Logo</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {logoPreview || logoUrlSetting?.value ? (
                <div className="space-y-4">
                  <img 
                    src={logoPreview || logoUrlSetting?.value} 
                    alt="Bank Logo Preview" 
                    className="mx-auto max-h-32 object-contain"
                    data-testid="img-logo-preview"
                  />
                  <p className="text-sm text-bank-gray">Current Bank Logo</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <University className="mx-auto text-bank-gray text-4xl" />
                  <div>
                    <p className="text-bank-gray font-medium">Upload Bank Logo</p>
                    <p className="text-sm text-bank-gray">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-full p-3 border border-bank-blue text-bank-blue rounded-lg hover:bg-bank-blue hover:text-white transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Logo File
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  data-testid="input-logo-upload"
                />
              </Label>
            </div>
          </div>
        </div>

        {/* Branding Settings */}
        <div>
          <h3 className="text-lg font-semibold text-bank-navy mb-4">Branding Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={brandingData.bankName}
                onChange={(e) => setBrandingData({ ...brandingData, bankName: e.target.value })}
                placeholder="Unity Banking"
                data-testid="input-bank-name"
              />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea
                id="tagline"
                value={brandingData.tagline}
                onChange={(e) => setBrandingData({ ...brandingData, tagline: e.target.value })}
                placeholder="Your trusted banking partner"
                rows={2}
                data-testid="textarea-tagline"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                    className="w-12 h-10 p-1 border"
                    data-testid="input-primary-color"
                  />
                  <Input
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                    placeholder="#1e40af"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                    className="w-12 h-10 p-1 border"
                    data-testid="input-secondary-color"
                  />
                  <Input
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                    placeholder="#059669"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-bank-navy mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Preview
        </h3>
        
        <div className="bg-white p-6 rounded-lg border" style={{ 
          borderTopColor: brandingData.primaryColor,
          borderTopWidth: '4px'
        }}>
          <div className="flex items-center mb-4">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="h-8 mr-3 object-contain"
              />
            ) : (
              <University 
                className="text-2xl mr-3" 
                style={{ color: brandingData.primaryColor }}
              />
            )}
            <div>
              <h4 
                className="text-xl font-bold"
                style={{ color: brandingData.primaryColor }}
                data-testid="text-preview-bank-name"
              >
                {brandingData.bankName || "Unity Banking"}
              </h4>
              {brandingData.tagline && (
                <p 
                  className="text-sm"
                  style={{ color: brandingData.secondaryColor }}
                  data-testid="text-preview-tagline"
                >
                  {brandingData.tagline}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div 
              className="px-4 py-2 rounded text-white text-sm"
              style={{ backgroundColor: brandingData.primaryColor }}
            >
              Primary Button
            </div>
            <div 
              className="px-4 py-2 rounded text-white text-sm"
              style={{ backgroundColor: brandingData.secondaryColor }}
            >
              Secondary Button
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSaveBranding}
          className="bg-bank-blue text-white hover:bg-blue-700"
          disabled={updateMutation.isPending}
          data-testid="button-save-branding"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Branding Settings"}
        </Button>
      </div>
    </div>
  );
}