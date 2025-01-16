import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const Image = ({ src, ...rest }) => {
  const data = useStaticQuery(graphql`
    query {
      images: allFile(filter: { sourceInstanceName: { eq: "assets" } }) {
        edges {
          node {
            relativePath
            extension
            publicURL
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
        }
      }
    }
  `);

  console.log("### 가져온 데이터 확인 ### \n", data);
  const match = useMemo(() => data.images.edges.find(({ node }) => {
    console.log("### find 확인 ### \n", src, node.relativePath);
    return src === node.relativePath
  }), [
    data,
    src,
  ]);
  console.log("### match 확인 ### \n", match);
  if (!match) return null;

  const { node: { childImageSharp, publicURL, extension } = {} } = match;
  console.log("### match 이후 확인 ### \n", childImageSharp, publicURL, extension);
  if (extension === 'svg' || !childImageSharp) {
    return <img src={publicURL} alt={publicURL} {...rest} />;
  }

  return <GatsbyImage image={childImageSharp.gatsbyImageData} alt={publicURL} {...rest} />;
};

export default Image;
