import React from 'react';
import PropTypes from 'prop-types';

import colors from '../styles/colors';

function PrimaryButton(props) {
  const { title, onClick, href, ...otherProps } = props;
  const aProps = {
    ...otherProps,
    ...(href ? { href } : { onClick }),
  };
  return (
    <React.Fragment>
      <a {...aProps}>{title}</a>
      {/*language=CSS*/}
      <style jsx>{`
        a {
          display: block;
          padding: 0.5em 1em;
          text-align: center;
          background: ${colors.primaryButton};
          color: ${colors.textDark};
          text-decoration: none;
          border-radius: 20px;
          box-shadow: 1px 1px 0 0 #000000;
          cursor: pointer;
          transition: transform 0.3s;
        }
      `}</style>
    </React.Fragment>
  );
}

export default PrimaryButton;

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
};
