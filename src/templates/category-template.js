import React, { useMemo, useCallback, useState } from 'react';
import { navigate } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import Post from '../models/post';
import CategoryPageHeader from '../components/category-page-header';
import PostTabs from '../components/post-tabs';

/** posts 페이지 컴포넌트 */
function CategoryTemplate({ pageContext }) {
  const { edges, currentCategory } = pageContext;
  const { categories } = pageContext;
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  );
  const posts = edges.map(({ node }) => new Post(node));

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
      <CategoryPageHeader title={categories[currentTabIndex]} subtitle={`${posts.length} posts`} />
      <PostTabs
        tabIndex={currentTabIndex}
        onChange={onTabIndexChange}
        tabs={categories}
        posts={posts}
        showMoreButton={currentCategory !== 'All'}
        seoTitle={seoTitle}
      />
    </Layout>
  );
}

export default CategoryTemplate;
