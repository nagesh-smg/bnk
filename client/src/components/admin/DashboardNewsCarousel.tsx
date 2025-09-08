import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Newspaper, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { News } from "@shared/schema";

export default function DashboardNewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const publishedNews = news.filter(item => item.status === "published");

  useEffect(() => {
    if (publishedNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % publishedNews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [publishedNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % publishedNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + publishedNews.length) % publishedNews.length);
  };

  const getIcon = (index: number) => {
    const icons = [Newspaper, TrendingUp, Award];
    const Icon = icons[index % icons.length];
    return <Icon className="text-bank-blue text-lg mr-3" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-bank-navy mb-4">Latest News</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (publishedNews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-bank-navy mb-4">Latest News</h3>
        <p className="text-bank-gray">No published news articles found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-bank-navy mb-4" data-testid="text-dashboard-news-title">
        Latest News
      </h3>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            data-testid="carousel-dashboard-news"
          >
            {publishedNews.map((newsItem, index) => (
              <div key={newsItem.id} className="w-full flex-shrink-0">
                <div className="flex items-start mb-3">
                  {getIcon(index)}
                  <div className="flex-1">
                    <h4 className="font-medium text-bank-navy mb-2" data-testid={`text-dashboard-news-title-${newsItem.id}`}>
                      {newsItem.title}
                    </h4>
                    <p className="text-sm text-bank-gray mb-2" data-testid={`text-dashboard-news-excerpt-${newsItem.id}`}>
                      {newsItem.excerpt}
                    </p>
                    <span className="text-xs text-bank-gray" data-testid={`text-dashboard-news-date-${newsItem.id}`}>
                      {new Date(newsItem.publishDate!).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {publishedNews.length > 1 && (
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
              data-testid="button-dashboard-news-previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {publishedNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-bank-blue" : "bg-gray-300"
                  }`}
                  data-testid={`button-news-indicator-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="border-bank-blue text-bank-blue hover:bg-bank-blue hover:text-white"
              data-testid="button-dashboard-news-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}