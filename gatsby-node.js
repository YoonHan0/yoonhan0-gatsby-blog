const { createFilePath } = require(`gatsby-source-filesystem`);

/**
 * content/posts/**    → contentType: 'post'    , slug: /<폴더명>/  (기존 URL 유지)
 * content/projects/** → contentType: 'project' , slug: /projects/<폴더명>/
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const filePath = createFilePath({ node, getNode, basePath: `content` }); // e.g. /posts/foo/
    const isProject = filePath.startsWith('/projects/');
    const slug = isProject ? filePath : filePath.replace(/^\/posts\//, '/');
    createNodeField({ node, name: `slug`, value: slug });
    createNodeField({ node, name: `contentType`, value: isProject ? 'project' : 'post' });
  }
};

/** 프로젝트 글이 하나도 없어도 쿼리가 깨지지 않도록 frontmatter 스키마를 명시 */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: MarkdownRemarkFields
    }
    type MarkdownRemarkFields {
      slug: String
      contentType: String
    }
    type Frontmatter {
      title: String
      date: Date @dateformat
      emoji: String
      author: String
      tags: String
      categories: String
      projectType: String
      company: String
      period: String
      role: String
      team: String
      summary: String
      techStack: [String]
      featured: Boolean
      thumbnail: File @fileByRelativePath
      links: ProjectLinks
    }
    type ProjectLinks {
      github: String
      demo: String
      post: String
      googlePlay: String
      appStore: String
    }
  `);
};

const createProjectPages = ({ createPage, projects }) => {
  const projectTemplate = require.resolve(`./src/templates/project-template.js`);
  projects.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: projectTemplate,
      context: { slug: node.fields.slug },
    });
  });
};

const createBlogPages = ({ createPage, results }) => {
  const blogPostTemplate = require.resolve(`./src/templates/blog-template.js`);
  results.data.allMarkdownRemark.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.fields.slug,
        nextSlug: next?.fields.slug ?? '',
        prevSlug: previous?.fields.slug ?? '',
      },
    });
  });
};

const createPostsPages = ({ createPage, results }) => {
  const categoryTemplate = require.resolve(`./src/templates/category-template.js`);
  const categorySet = new Set(['All']);
  const { edges } = results.data.allMarkdownRemark;

  edges.forEach(({ node }) => {
    const postCategories = node.frontmatter.categories.split(' ');
    postCategories.forEach((category) => categorySet.add(category));
  });

  const categories = [...categorySet];

  createPage({
    path: `/posts`,
    component: categoryTemplate,
    context: { currentCategory: 'All', edges, categories },
  });

  categories.forEach((currentCategory) => {
    createPage({
      path: `/posts/${currentCategory}`,
      component: categoryTemplate,
      context: {
        currentCategory,
        categories,
        edges: edges.filter(({ node }) => node.frontmatter.categories.includes(currentCategory)),
      },
    });
  });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const results = await graphql(`
    {
      projects: allMarkdownRemark(filter: { fields: { contentType: { eq: "project" } } }) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      allMarkdownRemark(
        filter: { fields: { contentType: { eq: "post" } } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 500, truncate: true)
            fields {
              slug
            }
            frontmatter {
              categories
              title
              date(formatString: "MMMM DD, YYYY")
            }
          }
          next {
            fields {
              slug
            }
          }
          previous {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (results.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  createBlogPages({ createPage, results });
  createPostsPages({ createPage, results });
  createProjectPages({ createPage, projects: results.data.projects.edges });
};
