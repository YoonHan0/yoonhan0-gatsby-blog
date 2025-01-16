import React, { useCallback } from 'react';
import { Tooltip, Button } from '@mui/material';

import './style.scss';

function TextButtonBar({ links = {} }) {

  const TextPicker = useCallback((text) => {
    switch (text) {
      case 'post':
        return 'Post';
      case 'demo':
        return 'Demo';
      case 'github':
        return 'GitHub';
      case 'googlePlay':
        return 'Google Play';
      case 'appStore':
        return 'App Store';
      case 'email':
        return 'Email';
      case 'linkedIn':
        return 'LinkedIn';
      case 'velog':
        return 'Velog';
      default:
        return '';
    }
  }, []);

  return (
    <div className="link-button-bar">
      {Object.keys(links).map((link, index) => {
        return (
          links[link] && (
            <Tooltip key={index} title={link} arrow className="link-tooltip">
              <Button
                size="small"
                href={`${link === 'email' ? `mailto:` : ``}${links[link]}`}
                className="link-button"
              >
                {TextPicker(link)}
              </Button>
            </Tooltip>
          )
        );
      })}
    </div>
  );
}

export default TextButtonBar;
