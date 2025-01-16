import React, { useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayIcon from '@mui/icons-material/PlayArrowOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import './style.scss';

function IconButtonBar({ links = {} }) {

  const IconPicker = useCallback((icon) => {
    const props = { className: 'icon' };  /* https://velog.io/@parkyw1206/github-page-Github-Page-%EB%A1%9C-%EA%B8%B0%EA%B9%94%EB%82%98%EB%8A%94-%ED%8F%AC%ED%86%A0%ED%8F%B4%EB%A6%AC%EC%98%A4-%EB%A7%8C%EB%93%A4%EA%B8%B0-4-%EB%A7%81%ED%81%AC-%EC%95%84%EC%9D%B4%EC%BD%98%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90 */

    console.log("### icon ### \n", icon);
    switch (icon) {
      case 'post':
        return <DescriptionIcon {...props} />;
      case 'demo':
        return <PlayIcon {...props} />;
      case 'github':
        return <GitHubIcon {...props} />;
      case 'googlePlay':
        return <AndroidIcon {...props} />;
      case 'appStore':
        return <AppleIcon {...props} />;
      case 'email':
        return <EmailIcon {...props} />;
      case 'linkedIn':
        return <LinkedInIcon {...props} />;
      case 'velog':
        console.log("### velog ###")
        return <AutoStoriesIcon {...props} />
      default:
        return <></>;
    }
  }, []);

  return (
    <>
      {Object.keys(links).map((link, index) => {
        console.log("### link 확인 ### \n", link);
        return (
          links[link] && (
            <Tooltip key={index} title={link} arrow className="icon-tooltip">
              <IconButton size="small" href={`${link === 'email' ? `mailto:` : ``}${links[link]}`}>
                {IconPicker(link)}
              </IconButton>
            </Tooltip>
          )
        );
      })}
    </>
  );
}

export default IconButtonBar;
