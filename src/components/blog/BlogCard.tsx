import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "../../assets/data/types";

interface BlogCardProps {
  post: BlogPost;
}

const CategoryBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider text-pink-500 uppercase bg-white/95 backdrop-blur-xs rounded-full shadow-sm">
    {label}
  </span>
);

const Metadata: React.FC<{ date: string; readTime?: string }> = ({ date, readTime }) => (
  <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-2 mb-3">
    <div className="flex items-center gap-1">
      <Calendar size={12} />
      <span>{date}</span>
    </div>
    {readTime && (
      <div className="flex items-center gap-1">
        <Clock size={12} />
        <span>{readTime}</span>
      </div>
    )}
  </div>
);

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group">
      <div className="relative h-60 sm:h-64 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge label={post.category} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Metadata date={post.date} readTime={post.readTime} />
        <h3 className="text-xl font-extrabold text-[#2E1347] mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 font-semibold flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide group/link"
          >
            <span>Read More</span>
            <span className="bg-[#E91E63] text-white rounded-full p-1 group-hover/link:translate-x-1 transition-transform">
              <ArrowRight size={10} />
            </span>
          </Link>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            By {post.author}
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
