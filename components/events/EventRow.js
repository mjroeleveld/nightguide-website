import React, { useState, useRef } from 'react';

import __ from '../../lib/i18n';
import { Link } from '../../routes';
import dimensions from '../../styles/dimensions';
import colors from '../../styles/colors';
import PropTypes from 'prop-types';
import EventTile from './EventTile';
import RowControls from '../RowControls';
import { useElemDimensions, useWindowWidth } from '../../lib/hooks';

EventRow.propTypes = {
  routeParams: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  seeAllParams: PropTypes.object,
};

function EventRow(props) {
  const { events, seeAllParams, routeParams } = props;

  const innerRef = useRef(null);
  const eventsRef = useRef(null);
  const [eventRef, setEventRef] = useState(null);
  const eventDimensions = useElemDimensions(eventRef);
  const windowWidth = useWindowWidth();

  const gridGap = windowWidth <= 800 ? 10 : 14;

  const scrollLeft = () => {
    innerRef.current.scrollLeft =
      innerRef.current.scrollLeft - eventDimensions.width - gridGap;
  };

  const scrollRight = () => {
    innerRef.current.scrollLeft =
      innerRef.current.scrollLeft + eventDimensions.width + gridGap;
  };

  return (
    <div className="container">
      <div className="inner" ref={innerRef}>
        <div className="events" ref={eventsRef}>
          {events.map((event, index) => (
            <div
              key={event.id + event.dateIndex}
              className="event"
              ref={index === 0 ? setEventRef : undefined}
            >
              <EventTile
                imgWidths={[215, 320, 600]}
                imgSizes={'20em'}
                event={event}
                routeParams={routeParams}
              />
            </div>
          ))}
        </div>
        <div className="more">
          <div className="inner">
            <div className="content">
              {__('EventRow.moreEvents')}
              <Link route="events" params={{ ...routeParams, ...seeAllParams }}>
                <a className="button">{__('EventRow.seeMore')}</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="controls">
        <RowControls onBackPress={scrollLeft} onNextPress={scrollRight} />
      </div>
      {/*language=CSS*/}
      <style jsx>{`
        .container {
          position: relative;
        }
        .container > .inner {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          display: flex;
          scroll-behavior: smooth;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .container > .inner::-webkit-scrollbar {
          display: none;
        }
        .more {
          flex-basis: 15em;
          flex-shrink: 0;
        }
        .more .inner {
          height: 100%;
          font-size: 13px;
          background: ${colors.tileBg};
          border-radius: ${dimensions.tileRadius};
          box-shadow: ${colors.tileShadow};
          padding: 1em;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 ${dimensions.gridGap.S};
        }
        .more .content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .more .button {
          border: 1px solid #686868;
          display: block;
          color: #fff;
          text-align: center;
          border-radius: 3px;
          font-size: inherit;
          box-sizing: border-box;
          padding: 0.25em 0.5em;
          margin: 0.5em 0 0.3em;
        }
        .events {
          display: grid;
          grid-template-columns: repeat(${events.length}, 20em);
          grid-gap: ${dimensions.gridGap.S};
        }
        @media (max-width: 800px) {
          .container {
            margin-right: -${dimensions.bodyPadding};
          }
          .controls {
            display: none;
          }
        }
        @media (min-width: 800px) {
          .more .inner {
            margin: 0 ${dimensions.gridGap.L};
          }
          .events {
            grid-template-columns: repeat(
              ${events.length},
              calc((${dimensions.pageWidth} - 3 * ${dimensions.gridGap.L}) / 4)
            );
            grid-gap: ${dimensions.gridGap.L};
          }
        }
      `}</style>
    </div>
  );
}

export default EventRow;
