import React, { useMemo, useCallback, useState } from 'react';
import { Link, navigate } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import Post from '../models/post';
import CategoryPageHeader from '../components/category-page-header';
import PostTabs from '../components/post-tabs';
import { postHasTag } from '../utils/tag';

/** posts 페이지 컴포넌트 */
function CategoryTemplate({ pageContext, location }) {
  const { edges, currentCategory } = pageContext;
  const { categories } = pageContext;
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  );
  // 프로젝트의 기술 스택 태그를 누르면 /posts?tag=<태그> 로 들어와 해당 태그 글만 보여준다
  const selectedTag = useMemo(
    () => new URLSearchParams(location?.search || '').get('tag') || '',
    [location?.search],
  );
  const allPosts = edges.map(({ node }) => new Post(node));
  const posts = selectedTag ? allPosts.filter((post) => postHasTag(post, selectedTag)) : allPosts;
  const [moreBtn, setMoreBtn] = useState(true);
  const onTabIndexChange = useCallback(
    (e, value) => {
      if (value === 0) return navigate(`/posts`);
      navigate(`/posts/${categories[value]}`);
    },
    [categories],
  );

  const seoTitle = "Posts";
  console.log("### 포스터 컴포넌트. pageContext ## \n", pageContext);
  console.log("### 포스터 컴포넌트. 선택된 카테고리 ## \n", currentCategory);

  return (
    <Layout>
      <Seo title={seoTitle} />
      <CategoryPageHeader
        title={selectedTag ? `#${selectedTag}` : categories[currentTabIndex]}
        subtitle={`${posts.length} posts`}
      />
      {selectedTag && (
        <div className="tag-filter-bar">
          <span>
            <strong>{selectedTag}</strong> 태그로 검색한 결과입니다.
          </span>
          <Link to={location.pathname.replace(/\/$/, '') || '/posts'}>✕ 태그 해제</Link>
        </div>
      )}
      <PostTabs
        tabIndex={currentTabIndex}
        onChange={onTabIndexChange}
        tabs={categories}
        posts={posts}
        showMoreButton={!selectedTag && currentCategory !== 'All' && moreBtn}
        seoTitle={seoTitle}
        setMoreBtn={setMoreBtn}
      />
      {selectedTag && posts.length === 0 && (
        <p className="tag-filter-empty">아직 이 기술에 대해 정리한 글이 없습니다.</p>
      )}
    </Layout>
  );
}

export default CategoryTemplate;
