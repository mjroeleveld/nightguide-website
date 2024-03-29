import PropTypes from 'prop-types';
import { classNames } from '../lib/util';

Spinner.propTypes = {
  size: PropTypes.number,
  center: PropTypes.bool,
  style: PropTypes.object,
};

function Spinner(props) {
  const { size = 20, style, center = false } = props;

  return (
    <div
      className={classNames(['container', center && 'center'])}
      style={style}
    >
      <div className="spinner" />
      {/*language=CSS*/}
      <style jsx>{`
        .container.center {
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .spinner,
        .spinner:after {
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
        }
        .spinner {
          font-size: 10px;
          position: relative;
          text-indent: -9999em;
          border-top: ${size * 0.11}px solid rgba(89, 89, 89, 0.4);
          border-right: ${size * 0.11}px solid rgba(89, 89, 89, 0.4);
          border-bottom: ${size * 0.11}px solid rgba(89, 89, 89, 0.4);
          border-left: ${size * 0.11}px solid #595959;
          transform: translateZ(0);
          animation: load8 1.1s infinite linear;
        }
        @-webkit-keyframes load8 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes load8 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
