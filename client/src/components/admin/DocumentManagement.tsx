import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

export default function DocumentManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fileName: "",
    fileSize: 0,
  });
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/documents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setShowDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      fileName: "",
      fileSize: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">Document Management</h2>
        <div>Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-bank-navy" data-testid="text-document-management-title">
          Document Management
        </h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-bank-blue text-white hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              data-testid="button-upload-document"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Annual Report 2023"
                  required
                  data-testid="input-document-name"
                />
              </div>

              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  placeholder="e.g., annual-report-2023.pdf"
                  required
                  data-testid="input-document-filename"
                />
              </div>

              <div>
                <Label htmlFor="fileSize">File Size (bytes)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 2621440"
                  required
                  data-testid="input-document-filesize"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel-document"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bank-blue text-white hover:bg-blue-700"
                  disabled={createMutation.isPending}
                  data-testid="button-save-document"
                >
                  Upload Document
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <div 
            key={document.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            data-testid={`card-document-${document.id}`}
          >
            <div className="flex items-center mb-3">
              <FileText className="text-bank-red text-2xl mr-3" />
              <div className="flex-1">
                <h4 className="font-semibold text-bank-navy" data-testid={`text-document-name-${document.id}`}>
                  {document.name}
                </h4>
                <p className="text-sm text-bank-gray" data-testid={`text-document-date-${document.id}`}>
                  {new Date(document.uploadDate!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-bank-gray" data-testid={`text-document-size-${document.id}`}>
                {formatFileSize(document.fileSize)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(document.id)}
                className="text-bank-red hover:text-red-700"
                data-testid={`button-delete-document-${document.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {documents.length === 0 && (
          <div className="col-span-full text-center py-8">
            <FileText className="mx-auto text-bank-gray text-4xl mb-4" />
            <p className="text-bank-gray" data-testid="text-no-documents">
              No documents uploaded yet. Upload your first document to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
