import { Link } from 'gatsby';
import React from 'react';
import './style.scss';

function PostCard({ post }) {
  const { id, slug, title, excerpt, date, categories } = post;
  
  return (
    <div className="post-card-wrapper">
      <Link className="post-card" key={id} to={slug}>
        <div className="title">{title}</div>
        <p className="description" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div className="info">
          <div className="date">{date}</div>
          <div className="categories">
            {
              categories.slice(0, 5).map((category) => (
                <Link className="category" key={category} to={`/posts/${category}`}>
                  {category}
                </Link>
              ))
            }
            { categories.length > 5 && '...' }
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostCard;
