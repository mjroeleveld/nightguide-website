import PropTypes from 'prop-types';
import { memo, useState, useEffect } from 'react';
import Modal from 'react-modal';
import css from 'styled-jsx/css';

import __ from '../../lib/i18n';
import colors from '../../styles/colors';
import { useDisableBodyScrolling } from '../../lib/hooks';
import dimensions from '../../styles/dimensions';
import { generateTicketPageUrl } from './util';
import Spinner from '../Spinner';

EventTicketExternalCheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
  ticketProvider: PropTypes.string.isRequired,
  providerData: PropTypes.object,
};

function EventTicketExternalCheckoutModal(props) {
  const {
    isOpen,
    onClose,
    eventId,
    ticketProvider: providerId,
    providerData = {},
    ...modalProps
  } = props;

  const [iframeLoading, setIframeLoading] = useState(true);

  const iframeSrc = generateTicketPageUrl(providerId, eventId, providerData);

  useDisableBodyScrolling('EventTicketExternalCheckoutModal', isOpen);

  useEffect(() => {
    setIframeLoading(isOpen);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={modalStyles.className}
      className={modalStyles.className}
      {...modalProps}
    >
      <div className="container">
        <header className="header">
          <button className="close" onClick={() => onClose()} />
          <span className="title">
            {__('EventTicketExternalCheckoutModal.buyTicket')}
          </span>
        </header>
        <div className="content">
          {iframeLoading && (
            <div className="spinner">
              <Spinner size={25} center={true} />
            </div>
          )}
          <iframe
            onLoad={() => setIframeLoading(false)}
            className="iframe"
            src={iframeSrc}
          />
        </div>
      </div>
      {modalStyles.styles}
      {/*language=CSS*/}
      <style jsx>{`
        .container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 3em;
          width: 100%;
          box-sizing: border-box;
          box-shadow: ${colors.headerShadow};
          padding: 0 ${dimensions.bodyPadding};
          position: relative;
        }
        .title {
          flex-grow: 1;
          text-align: center;
          font-size: 0.92em;
        }
        .content {
          height: 100%;
          flex-grow: 1;
          justify-content: center;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        .iframe {
          width: ${dimensions.pageWidth};
          max-width: 100%;
          border: none;
          margin: 0 auto;
          display: block;
          min-height: 100%;
          position: relative;
          z-index: 1;
        }
        .close {
          position: absolute;
          left: ${dimensions.bodyPadding};
          width: 1em;
          height: 1em;
          padding: 0.5em;
          margin-right: 1em;
          background: url(/static/img/close.svg) no-repeat center center;
          background-size: cover;
        }
        .spinner {
          margin: 2em 0;
          position: absolute;
          width: 100%;
          z-index: 0;
        }
      `}</style>
    </Modal>
  );
}

/*language=CSS*/
const modalStyles = css.resolve`
  .ReactModal__Overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${colors.bg};
  }
  .ReactModal__Content {
      height: 100%;
      width: 100%;
      outline: none;
      WebkitOverflowScrolling: touch;
  }
`;

export default memo(EventTicketExternalCheckoutModal);
