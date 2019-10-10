import ReactMarkdown from 'react-markdown';
import withPageLayout from '../components/PageLayout';
import { _o } from '../lib/i18n';
import ResponsiveImage from '../components/ResponsiveImage';
import find from 'lodash/find';
import dimensions from '../styles/dimensions';
import colors from '../styles/colors';
import { classNames } from '../lib/util';
import blogStyles from '../styles/blogStyles';
import AnimatedLink from '../components/AnimatedLink';

function BlogPage(props) {
  const { article } = props;
  const { title, coverImage, images = [], intro, body } = article;

  const headerImage = coverImage && find(images, { id: coverImage });

  const renderImage = ({ src }) => {
    const { width, height, url } = find(images, { id: src }) || {};

    return (
      <ResponsiveImage
        url={url || src}
        widths={[360, 640, 1000, 2000]}
        sizes={`(max-width: 38em) calc(100vw - 2 * ${
          dimensions.bodyPadding
        }), 38em`}
        width={width}
        height={height}
      />
    );
  };

  const getLinkTarget = url => {
    return url.charAt(0) === '/' ||
      url.indexOf(process.env.REACT_APP_HOST) === 0
      ? undefined
      : '_blank';
  };

  return (
    <main>
      <header>
        <h1>{_o(title)}</h1>
        <div className="cover-image">
          {headerImage && (
            <ResponsiveImage
              url={headerImage.url}
              widths={[600, 900, 2000]}
              sizes={'(max-width: 38em) 100vw, 46em'}
              width={headerImage.width}
              height={headerImage.height}
            />
          )}
        </div>
        <div className="intro">{_o(intro)}</div>
      </header>

      <div className={classNames(['content', blogStyles.className])}>
        <ReactMarkdown
          renderers={{
            image: renderImage,
            link: AnimatedLink,
          }}
          linkTarget={getLinkTarget}
          source={_o(body)}
        />
        {blogStyles.styles}
      </div>

      {/*language=CSS*/}
      <style jsx>{`
        h1 {
          margin-bottom: 1.1em;
          font-weight: 800;
        }
        .intro {
          font-size: 1.125em;
          color: ${colors.textSecondary};
          margin: 2em 0;
        }
        @media (max-width: 800px) {
          .cover-image {
            margin: 0 -${dimensions.bodyPadding};
          }
        }
        @media (min-width: 800px) {
          .cover-image {
            margin: 0 -4em;
          }
        }
      `}</style>
    </main>
  );
}

export default withPageLayout({
  pageWidth: '38em',
  breadcrumbs: ({ article }) => [
    { key: 'articles', route: 'articles' },
    { key: 'article', title: _o(article.title) },
  ],
})(BlogPage);