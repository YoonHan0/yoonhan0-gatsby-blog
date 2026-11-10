import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import PostContent from '../components/post-content';
import ProjectHeader from '../components/project-header';
import Project from '../models/project';

function ProjectTemplate({ data }) {
  const project = new Project(data.project);
  return (
    <Layout>
      <Seo title={project.title} description={project.summary} />
      <ProjectHeader project={project} />
      <PostContent html={project.html} />
    </Layout>
  );
}

export default ProjectTemplate;

export const pageQuery = graphql`
  query($slug: String) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        emoji
        projectType
        company
        period
        role
        team
        summary
        techStack
        featured
        links {
          github
          demo
          post
          googlePlay
          appStore
        }
      }
    }
  }
`;
