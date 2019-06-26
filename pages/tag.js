import Head from 'next/head';

import withPageLayout from '../components/PageLayout';
import colors from '../styles/colors';
import { getEvents, getTagBySlug, getVenues } from '../lib/api';
import __, { _o } from '../lib/i18n';
import { getPostsFiltered } from '../lib/ghost';
import SectionHeader from '../components/SectionHeader';
import CityTitleButton from '../components/CityTitleButton';
import EventGrid from '../components/events/EventGrid';
import ArticleGrid from '../components/articles/ArticleGrid';
import VenueGrid from '../components/venues/VenueGrid';

function CityTagPage(props) {
  const { city, venues, events, articles, tag, baseUrl } = props;
  return (
    <main>
      <Head>
        <title>{__(`tag.meta.title.${tag.slug}`)}</title>
        <meta name="description" content={__(`tag.descriptions.${tag.slug}`)} />
      </Head>

      <h1>
        {__(`tag.titles.${tag.slug}`)}
        &nbsp;
        <CityTitleButton href={baseUrl} city={city} />
      </h1>
      <p className={'intro'}>{__(`tag.descriptions.${tag.slug}`)}</p>
      {!!venues.length && (
        <section className={'venues'}>
          <SectionHeader title={__('cityTagPage.venues')} TitleElem={'h3'} />
          <div className={'content'}>
            <VenueGrid baseUrl={baseUrl} venues={venues} />
          </div>
        </section>
      )}
      {!!events.length && (
        <section className={'events'}>
          <SectionHeader title={__('cityTagPage.events')} TitleElem={'h3'} />
          <div className={'content'}>
            <EventGrid baseUrl={baseUrl} events={events} />
          </div>
        </section>
      )}
      {!!articles.length && (
        <section className={'articles'}>
          <SectionHeader title={__('cityTagPage.articles')} TitleElem={'h3'} />
          <div className={'content'}>
            <ArticleGrid baseUrl={baseUrl} articles={articles} />
          </div>
        </section>
      )}
      {/*language=CSS*/}
      <style jsx>{`
        h1 {
          margin: 0;
          padding: 1em 0 0.5em;
          line-height: 1.6;
        }
        .intro {
          margin-bottom: 2em;
        }
        .venues {
          margin: 1em 0 2em;
        }
        .events,
        .articles {
          margin: 2em 0;
        }
      `}</style>
    </main>
  );
}

CityTagPage.getInitialProps = async ctx => {
  let { citySlug, country, city, tag: tagSlug } = ctx.query;
  const tag = await getTagBySlug(tagSlug);
  return {
    city,
    tag,
    venues: (await getVenues({
      fields: ['name', 'images', 'description'],
      query: {
        country,
        city,
        tag: tag.id,
      },
    })).results,
    events: (await getEvents({
      query: {
        country,
        city,
        tag: tag.id,
      },
    })).results,
    articles: await getPostsFiltered(`tag:${citySlug}+tag:${tag.slug}`, {
      limit: 6,
    }),
  };
};

const getBreadcrumbs = ({ tag }) => [
  { key: 'explore', url: 'explore' },
  { key: 'tag', name: _o(tag.name) },
];

export default withPageLayout(getBreadcrumbs)(CityTagPage);
