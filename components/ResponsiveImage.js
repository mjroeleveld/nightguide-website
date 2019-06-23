import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import Observer from '@researchgate/react-intersection-observer';

const getSrcSet = (url, widths = [], additionalParams = null) => {
  const sources = widths.map(size => {
    let params = [`s${size}`];
    params = params.concat(additionalParams);
    return `${url}=${params.join('-')}`;
  });
  const srcSet = sources
    .map((url, index) => `${url} ${widths[index]}w`)
    .join(', ');
  return srcSet;
};

export default function ResponsiveImage(props) {
  const {
    url,
    widths,
    sizes,
    alt,
    style,
    imgStyle,
    lazy = true,
    showOverlay = false,
    styles = null,
    className = null,
    scale = false,
  } = props;

  if (!url) {
    return null;
  }

  const [visible, setVisible] = useState(!lazy);
  const [loaded, setLoaded] = useState(false);

  const jpegSrcSet = getSrcSet(url, widths, ['rj']);
  const webPSrcSet = getSrcSet(url, widths, ['rw']);

  const onIntersect = ({ isIntersecting }) => {
    if (isIntersecting) {
      setVisible(true);
    }
  };

  const onLoad = () => {
    setLoaded(true);
  };

  const containerClasses = [className || ''];
  if (visible) {
    containerClasses.push('visible');
  }
  if (!lazy || loaded) {
    containerClasses.push('loaded');
  }
  if (scale) {
    containerClasses.push('scale');
  }

  const progressiveImgUrl = `${url}=s10-c-fSoften=1,100,0`;

  return (
    <Observer disabled={!lazy} onChange={onIntersect}>
      <picture
        className={`container ${containerClasses.join(' ')}`.trim()}
        style={{
          backgroundImage: visible ? `url(${progressiveImgUrl})` : null,
          ...style,
        }}
      >
        <source type="image/webp" srcSet={webPSrcSet} sizes={sizes} />
        <source type="image/jpeg" srcSet={jpegSrcSet} sizes={sizes} />
        {visible && (
          <Fragment>
            <img
              src={`${url}=s600-rj`}
              className={className}
              alt={alt}
              style={imgStyle}
              onLoad={onLoad}
            />
            {showOverlay && <div className={`${className} overlay`.trim()} />}
          </Fragment>
        )}
        {/*language=CSS*/}
        <style jsx>{`
          picture {
            background: no-repeat center center;
            background-size: cover;
          }
          img {
            position: relative;
            z-index: 0;
            opacity: 0;
            transition: opacity 0.3s;
            vertical-align: middle;
          }
          .loaded img {
            opacity: 1;
          }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          }
          .container.scale:hover img {
            transform: scale(1.05);
          }
          img {
            transition: transform 0.3s;
          }
        `}</style>
        {styles}
      </picture>
    </Observer>
  );
}

ResponsiveImage.propTypes = {
  url: PropTypes.string.isRequired,
  widths: PropTypes.arrayOf(PropTypes.number).isRequired,
  sizes: PropTypes.string,
  alt: PropTypes.string,
  imgStyle: PropTypes.any,
  style: PropTypes.any,
  OverlayComponent: PropTypes.element,
  showOverlay: PropTypes.bool,
};