import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Newspaper, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { News } from "@shared/schema";

export default function NewsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const publishedNews = news.filter(item => item.status === "published");

  useEffect(() => {
    if (publishedNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % publishedNews.length);
    }, 5000);

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
    return <Icon className="text-bank-blue text-xl mr-3" />;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bank-navy mb-4">Latest News & Updates</h2>
            <div className="text-xl text-bank-gray">Loading news...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bank-navy mb-4" data-testid="text-news-title">
            Latest News & Updates
          </h2>
          <p className="text-xl text-bank-gray" data-testid="text-news-subtitle">
            Stay informed about our latest offerings and important announcements.
          </p>
        </div>

        {publishedNews.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                data-testid="carousel-news"
              >
                {publishedNews.map((newsItem, index) => (
                  <div key={newsItem.id} className="w-full flex-shrink-0">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-xl shadow-md p-8 h-full">
                        <div className="flex items-center mb-4">
                          {getIcon(index)}
                          <span className="text-sm text-bank-gray font-medium" data-testid={`text-news-date-${newsItem.id}`}>
                            {new Date(newsItem.publishDate!).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h3 className="text-2xl font-semibold text-bank-navy mb-4" data-testid={`text-news-title-${newsItem.id}`}>
                          {newsItem.title}
                        </h3>
                        <p className="text-bank-gray mb-6 text-lg" data-testid={`text-news-excerpt-${newsItem.id}`}>
                          {newsItem.excerpt}
                        </p>
                        <Button 
                          variant="link" 
                          className="text-bank-blue hover:text-blue-700 p-0"
                          data-testid={`button-read-more-${newsItem.id}`}
                        >
                          Read More →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {publishedNews.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full hover:bg-gray-50"
                  onClick={prevSlide}
                  data-testid="button-news-previous"
                >
                  <ChevronLeft className="text-bank-blue" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full hover:bg-gray-50"
                  onClick={nextSlide}
                  data-testid="button-news-next"
                >
                  <ChevronRight className="text-bank-blue" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
