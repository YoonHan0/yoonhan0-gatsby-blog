import React, { useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';
import PostCardColumn from '../post-card-column';
import './style.scss';

/** posts 페이지 컴포넌트 > 테그, 포스터 목록 컴포넌트 */
function PostTabs({ tabIndex, onChange, tabs, posts, showMoreButton, seoTitle, setMoreBtn }) {
  const tabPosts = useMemo(() => {
    if (tabs[tabIndex] === 'All') return posts;
    return posts.filter((post) => post.categories.includes(tabs[tabIndex]));
  }, [posts, tabs, tabIndex]);

  console.log("### 태그, 포스터 목록 컴포넌트 tabIndex 확인 ### \n", tabIndex, `posts/${tabIndex === 0 ? '' : tabs[tabIndex]}`);

  return (
    <div className="post-tabs-wrapper">
      {
        /* /posts 로 접근 시에만 카테고리 출력  */
        seoTitle === 'Posts' ?
          <div className="post-tabs">
          <Tabs
            className="mui-tabs"
            value={tabIndex}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="desktop"
          >
            {tabs.map((title, index) => (
              <Tab label={title} key={index} />
            ))}
          </Tabs>
        </div>
        :
        <></>
      }
      
      <PostCardColumn
        posts={showMoreButton ? tabPosts.slice(0, 4) : tabPosts}
        showMoreButton={showMoreButton && tabPosts.length > 4}
        moreUrl={`posts/${tabIndex === 0 ? '' : tabs[tabIndex]}`}
        setMoreBtn={setMoreBtn}
      />
    </div>
  );
}
export default PostTabs;
