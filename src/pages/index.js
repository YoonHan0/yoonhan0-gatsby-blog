import React, { useCallback, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import Bio from '../components/bio';
import Post from '../models/post';

import { getUniqueCategories } from '../utils/helpers';
import PostTabs from '../components/post-tabs';
import ProjectCard from '../components/project-card';
import Project from '../models/project';

function HomePage({ data }) {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new Post(node));
  console.log("### src/pages/index.js data ### \n", data);
  console.log("### date 확인 ### \n", posts);
  const featuredProjects = data.featuredProjects.nodes.map((node) => new Project(node));
  const { author, language } = data.site.siteMetadata;
  const categories = ['All', ...getUniqueCategories(posts)];                                // main 화면의 카테고리가 담기는 변수
  const featuredTabIndex = categories.findIndex((category) => category === 'featured');
  const [tabIndex, setTabIndex] = useState(featuredTabIndex === -1 ? 0 : featuredTabIndex);
  const onTabIndexChange = useCallback((e, value) => setTabIndex(value), []);

  return (
    <Layout>    {/* 아래 3개의 컴포넌트는 layout/index.js의 children에 해당하는 부분들 */}
      <Seo title="YoonHan0" />
      <Bio author={author} language={language} />
      {featuredProjects.length > 0 && (
        <section className="featured-projects">
          <div className="featured-projects-title">주요 프로젝트</div>
          <div className="project-card-list">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
      <PostTabs
        posts={posts}
        onChange={onTabIndexChange}
        tabs={categories}
        tabIndex={tabIndex}
      />
    </Layout>
  );
}

export default HomePage;

export const pageQuery = graphql`
  query {
    featuredProjects: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "project" } }, frontmatter: { featured: { eq: true } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 4
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          emoji
          projectType
          company
          period
          summary
          techStack
          featured
          thumbnail {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, width: 720, aspectRatio: 1.7778)
            }
          }
        }
      }
    }
    allMarkdownRemark(
            filter: { fields: { contentType: { eq: "post" } } }
            sort: { fields: frontmatter___date, order: DESC }
          ) {
      edges {
        node {
          id
          frontmatter {
            categories
            tags
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }

    site {
      siteMetadata {
        language
        author {
          name
          bio {
            role
            description
            thumbnail
          }
          social {
            github
            linkedIn
            email
            velog
          }
        }
      }
    }
  }
`;
