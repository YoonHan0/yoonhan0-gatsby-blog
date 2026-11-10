import React, { useMemo, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import CategoryPageHeader from '../components/category-page-header';
import ProjectCard from '../components/project-card';
import Project from '../models/project';

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'company', label: '회사' },
  { key: 'side', label: '사이드' },
];

function ProjectsPage({ data }) {
  const projects = data.allMarkdownRemark.nodes.map((node) => new Project(node));
  const [filter, setFilter] = useState('all');
  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.projectType === filter)),
    [projects, filter],
  );
  // 데이터가 있는 필터만 노출 (사이드 프로젝트가 생기면 자동으로 탭이 나타남)
  const filters = FILTERS.filter(
    ({ key }) => key === 'all' || projects.some((p) => p.projectType === key),
  );

  return (
    <Layout>
      <Seo title="Projects" />
      <CategoryPageHeader title="Projects" subtitle={`${visible.length} projects`} />
      {filters.length > 2 && (
        <div className="project-filters">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={filter === key ? 'selected' : ''}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {visible.length === 0 ? (
        <p className="project-empty">아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="project-card-list">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default ProjectsPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { contentType: { eq: "project" } } }
      sort: { fields: frontmatter___date, order: DESC }
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
  }
`;
