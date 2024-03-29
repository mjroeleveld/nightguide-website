import css from 'styled-jsx/css';
import ResponsiveImage from './ResponsiveImage';

const IMG_WIDTHS_BIG = [290, 580, 920];
const IMG_WIDTHS_SMALL = [145, 290, 580];
const IMG_SIZES_BIG = '(max-width: 780px) 100vw, 451px';
const IMG_SIZES_SMALL = '(max-width: 780px) 25vw, 232px';

function ImageGrid(props) {
  const { images, onImageClick } = props;
  return (
    <div className={`container grid-${images.length}`}>
      {images.map((image, index) => (
        <div className="grid-item" key={index} onClick={onImageClick}>
          <div className="inner">
            <ResponsiveImage
              url={image.url}
              width={image.width}
              height={image.height}
              widths={index !== 0 ? IMG_WIDTHS_SMALL : IMG_WIDTHS_BIG}
              sizes={index !== 0 ? IMG_SIZES_SMALL : IMG_SIZES_BIG}
              scale={true}
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
        </div>
      ))}
      {/*language=CSS*/}
      <style jsx>{`
        .container {
          width: 100%;
          display: grid;
          grid-template-rows: auto auto;
          grid-template-columns: repeat(4, 1fr);
          grid-template-areas:
            'main main main main'
            '. . . .';
          grid-gap: 3px;
        }
        .grid-item:nth-child(1) {
          grid-area: main;
          height: 300px;
        }
        .grid-item > .inner {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        @media (max-width: 800px) {
          .grid-item:not(:nth-child(1)) .inner {
            height: 5em;
          }
        }
        @media (min-width: 800px) {
          .container {
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-areas:
              'main main . .'
              'main main . .';
          }
          .grid-item {
            height: 175px;
            border-radius: 3px;
            overflow: hidden;
          }
          .grid-item:nth-child(1) {
            grid-area: main;
            height: 353px;
          }
        }
      `}</style>
    </div>
  );
}

export default ImageGrid;
