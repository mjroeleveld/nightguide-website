import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage';
import css from 'styled-jsx/css';
import dimensions from '../styles/dimensions';

HeaderImage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  baseHeight: PropTypes.string,
};

function HeaderImage(props) {
  const { children, imageSrc, baseHeight = '200px' } = props;

  return (
    <header className="container">
      <div className="img">
        <ResponsiveImage
          url={imageSrc}
          widths={[600, 1000, 2000]}
          sizes="(max-width: 800px) 100vw, 960px"
          /*language=CSS*/
          {...css.resolve`
              .container {
                display: block;
                width: 100%;
                height: 100%;
              }
            `}
        />
      </div>
      <div className="content">{children}</div>
      {/*language=CSS*/}
      <style jsx>{`
        .container {
          height: ${baseHeight};
          margin: 0 -${dimensions.bodyPadding} 1em;
          box-sizing: border-box;
          position: relative;
        }
        .img {
          z-index: 0;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
        }
        .content {
          position: relative;
          height: 100%;
          width: 100%;
        }
        @media (min-width: 800px) {
          .container {
            height: 30vh;
          }
        }
      `}</style>
    </header>
  );
}

export default HeaderImage;
