import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import css from 'styled-jsx/css';
import debounce from 'lodash/debounce';

import ResponsiveImage from '../ResponsiveImage';
import { _o } from '../../lib/i18n';
import Pager from '../Pager';
import dimensions from '../../styles/dimensions';
import { removeTags } from '../../lib/util';

const Img = ({ bigOverlay, ...imgProps }) => (
  <ResponsiveImage
    showOverlay={true}
    /*language=CSS*/
    {...css.resolve`
      .container {
        display: block;
        width: 100%;  
        height: 100%;
      }
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
      .overlay {
        bottom: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(rgba(0, 0, 0, 0.01) ${
          bigOverlay ? '30%' : '90%'
        }, rgba(0, 0, 0, 1));
      }
    `}
    {...imgProps}
  />
);

function VenueSliderTile(props) {
  const { baseUrl, venue, imgWidths, imgSizes } = props;
  const { name, images, id, description } = venue;
  const imgProps = { imgWidths, imgSizes };

  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const resizeListener = debounce(() => calculateDimensions(), 100);
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => calculateDimensions(), [containerRef.current]);

  const calculateDimensions = () => {
    if (containerRef.current) {
      setContainerDimensions(containerRef.current.getBoundingClientRect());
    }
  };

  const trimmedDescription =
    description &&
    removeTags(_o(description))
      .slice(0, 130)
      .trim() + '...';

  const slidesCount = 1 + (description ? 1 : 0) + images.slice(1).length;

  const goToSlide = slide => {
    if (slide === slidesCount || slide < 0) return;
    setCurrentSlide(slide);
  };

  return (
    <React.Fragment>
      <div className="container" ref={containerRef}>
        {!!containerDimensions && (
          <div
            className="carousel"
            style={{ width: containerDimensions.width }}
          >
            <div className="prev">
              <button onClick={() => goToSlide(currentSlide - 1)} />
            </div>
            <Link href={`${baseUrl}/${id}`}>
              <a className="venue-link">
                <div
                  className="slides"
                  style={{
                    gridTemplateColumns: `${
                      containerDimensions.width
                    }px `.repeat(slidesCount),
                    width: containerDimensions.width * slidesCount,
                    height: containerDimensions.height,
                    transform: `translateX(${-currentSlide *
                      containerDimensions.width}px)`,
                  }}
                >
                  <div className="slide-name">{name}</div>
                  {!!trimmedDescription && (
                    <div className="slide-description">
                      {trimmedDescription}
                    </div>
                  )}
                  {images.slice(1).map(image => (
                    <div key={image.url} className="slide-image">
                      <Img url={image.url} {...imgProps} />
                    </div>
                  ))}
                </div>
              </a>
            </Link>
            <div className="next">
              <button onClick={() => goToSlide(currentSlide + 1)} />
            </div>
            <div className="pager">
              <Pager itemCount={slidesCount} currentIndex={currentSlide} />
            </div>
            <div className="bg-image">
              {images.length && (
                <Img bigOverlay={true} url={images[0].url} {...imgProps} />
              )}
            </div>
          </div>
        )}
      </div>
      {/*language=CSS*/}
      <style jsx>{`
        .venue-link {
          display: block;
          position: relative;
          z-index: 1;
          height: 100%;
        }
        .container {
          height: 100%;
        }
        .carousel {
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: ${dimensions.tileRadius};
        }
        .bg-image {
          z-index: 0;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
        }
        .pager {
          position: absolute;
          z-index: 2;
          width: 100%;
          left: 0;
          bottom: 0.5em;
        }
        .slides {
          height: 100%;
          z-index: 1;
          display: grid;
          grid-template-rows: 100%;
          position: relative;
          transition: ease-out 0.3s;
        }
        .slide-name,
        .slide-description {
          padding: 0 1.5em 2em;
          height: 100%;
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
        }
        .slide-name {
          font-size: 1.2em;
          font-weight: 600;
        }
        .slide-image {
          position: relative;
          height: 100%;
        }
        .prev,
        .next {
          opacity: 0;
          transition: all 0.3s;
          position: absolute;
          z-index: 3;
          top: 0;
          background-image: linear-gradient(
            270deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0) 100%
          );
          height: 100%;
          width: 10%;
        }
        .container:hover .prev,
        .container:hover .next {
          opacity: 1;
        }
        .prev button,
        .next button {
          display: block;
          height: 100%;
          width: 100%;
          background: url(/static/img/venue-slider-arrow.svg) no-repeat center
            right 1em;
        }
        .next {
          right: 0;
        }
        .prev {
          left: 0;
          transform: rotate(180deg);
        }
      `}</style>
    </React.Fragment>
  );
}

export default VenueSliderTile;