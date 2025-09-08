import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { News, InsertNews } from "@shared/schema";

export default function NewsManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<InsertNews>({
    title: "",
    content: "",
    excerpt: "",
    status: "published",
  });
  const { toast } = useToast();

  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertNews) => apiRequest("POST", "/api/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setShowDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "News article created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create news article",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertNews> }) =>
      apiRequest("PUT", `/api/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setShowDialog(false);
      setEditingNews(null);
      resetForm();
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update news article",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete news article",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      status: "published",
    });
    setEditingNews(null);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      status: newsItem.status,
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-bank-navy mb-6">News Management</h2>
        <div>Loading news articles...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-bank-navy" data-testid="text-news-management-title">
          News Management
        </h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-bank-blue text-white hover:bg-blue-700"
              onClick={() => {
                resetForm();
                setShowDialog(true);
              }}
              data-testid="button-add-news"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Edit News Article" : "Add News Article"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-news-title"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for the news carousel"
                  required
                  data-testid="textarea-news-excerpt"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content"
                  rows={6}
                  required
                  data-testid="textarea-news-content"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger data-testid="select-news-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel-news"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bank-blue text-white hover:bg-blue-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-news"
                >
                  {editingNews ? "Update" : "Create"} Article
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {news.map((newsItem) => (
          <div 
            key={newsItem.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            data-testid={`card-news-${newsItem.id}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-bank-navy mb-2" data-testid={`text-news-title-${newsItem.id}`}>
                  {newsItem.title}
                </h4>
                <p className="text-bank-gray text-sm mb-2" data-testid={`text-news-excerpt-${newsItem.id}`}>
                  {newsItem.excerpt}
                </p>
                <p className="text-xs text-bank-gray" data-testid={`text-news-date-${newsItem.id}`}>
                  {new Date(newsItem.publishDate!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge 
                  className={newsItem.status === "published" ? "bg-bank-green text-white" : "bg-gray-500 text-white"}
                  data-testid={`badge-news-status-${newsItem.id}`}
                >
                  {newsItem.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(newsItem)}
                  className="text-bank-blue hover:text-blue-700"
                  data-testid={`button-edit-news-${newsItem.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(newsItem.id)}
                  className="text-bank-red hover:text-red-700"
                  data-testid={`button-delete-news-${newsItem.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
