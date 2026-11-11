import { Button } from '@mui/material';
import { navigate } from 'gatsby-link';
import React, { useCallback } from 'react';
import PostCard from '../post-card';
import './style.scss';


/** posts 페이지 컴포넌트 > 테그, 포스터 목록 컴포넌트 > 포스터 목록 컴포넌트 */
function PostCardColumn({ posts, showMoreButton, moreUrl, setMoreBtn, seoTitle }) {

  console.log("### 포스터 목록 컴포넌트. moreUrl 확인 ### \n", moreUrl);
  const onMoreButtonClick = useCallback(() => {
    // navigate(moreUrl);
    setMoreBtn(false);
  }, [moreUrl]);

  
  return (
    <div className="post-card-column-wrapper">
      {seoTitle !== 'Posts' ? 
        <div className='post-card-column-title'>공부한 내용들을 정리하고 있어요</div>
        : <></>
      }
      <div className="post-card-column">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
        {showMoreButton && (
          <Button
            className="more-post-card-button"
            onClick={onMoreButtonClick}
            variant="contained"
            disableElevation
          >
            More
          </Button>
        )}
      </div>
    </div>
  );
}

export default PostCardColumn;
