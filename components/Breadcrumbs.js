import Link from 'next/link';
import range from 'lodash/range';

import { withNavigation } from './Navigation';
import __ from '../lib/i18n';
import colors from '../styles/colors';

function Breadcrumbs(props) {
  const { items } = props;

  const breadcrumbs = items.map(({ key, label, url, ...params }, index) => {
    url = range(0, index + 1).reduce((url, index) => {
      const part = items[index].url;
      return `${url}/${part}`;
    }, '');

    if (!label && key) {
      label = __(`menu.${key}`, params);
    }

    return { key, label, url };
  });

  return (
    <ol className="container">
      {breadcrumbs.map(({ key, url, label }, index) => (
        <li key={key}>
          <Link href={url}>
            <a>{label}</a>
          </Link>
          {index !== breadcrumbs.length - 1 && (
            <span className="arrow">{'>'}</span>
          )}
        </li>
      ))}
      {/*language=CSS*/}
      <style jsx>{`
        .container {
          display: flex;
        }
        li {
          list-style: none;
          display: flex;
          align-items: center;
          color: ${colors.textSecondary};
          font-size: 0.9em;
        }
        .arrow {
          font-size: 0.8em;
          display: block;
          margin: 0 1em;
        }
      `}</style>
    </ol>
  );
}

export default withNavigation(Breadcrumbs);
