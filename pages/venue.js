import Head from 'next/head';

import withPageLayout from '../components/PageLayout';
import { getVenue, getEvents, getVenues } from '../lib/api';
import __, { _o } from '../lib/i18n';
import ImageGrid from '../components/ImageGrid';
import colors from '../styles/colors';
import VenueOpeningHours from '../components/venues/VenueOpeningHours';
import dimensions from '../styles/dimensions';
import PrimaryButton from '../components/PrimaryButton';
import VenueTiles from '../components/venues/VenueTiles';
import VenuePriceClass from '../components/venues/VenuePriceClass';
import TagList from '../components/TagList';
import EventGrid from '../components/events/EventGrid';
import VenueGrid from '../components/venues/VenueGrid';

function VenuePage(props) {
  const { venue, routeParams, events, similarVenues } = props;

  const {
    name,
    description,
    images,
    timeSchedule,
    location,
    website,
    instagram,
    facilities,
    dresscode,
    fees,
    entranceFeeRange,
    paymentMethods,
    capacityRange,
    doorPolicy,
    currency,
    priceClass,
    tags,
  } = venue;
  const {
    address1,
    address2,
    postalCode,
    city,
    coordinates,
    googlePlaceId,
  } = location;

  let mapsUrl = `http://www.google.com/maps/search/?api=1&query=${
    coordinates.latitude
  },${coordinates.longitude}`;
  if (googlePlaceId) {
    mapsUrl += `&query_place_id=${googlePlaceId}`;
  }

  return (
    <main>
      <Head>
        <title>
          {__('venuePage.meta.title', {
            venue: name,
            city: location.city,
          })}
        </title>
        {description && (
          <meta
            name="description"
            content={
              _o(description)
                .slice(0, 160)
                .replace('\n', ' ')
                .replace('  ', ' ') + '...'
            }
          />
        )}
      </Head>

      <header className={'header'}>
        <ImageGrid images={images.slice(0, 5)} />
        <h1>{name}</h1>
      </header>

      <div className="content">
        <div className="main-content">
          <div className="tags">
            <TagList routeParams={routeParams} tags={tags} />
          </div>
          {description && (
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: _o(description) }}
            />
          )}
          {priceClass && (
            <section className="price-class">
              <strong className="label">{__('venuePage.priceClass')}</strong>
              <VenuePriceClass priceClass={priceClass} />
            </section>
          )}
          <section className="facilities">
            <h2 className="facilities">{__('venuePage.facilities')}</h2>
            <VenueTiles
              facilities={facilities}
              dresscode={dresscode}
              fees={fees}
              entranceFeeRange={entranceFeeRange}
              paymentMethods={paymentMethods}
              capacityRange={capacityRange}
              doorPolicy={doorPolicy}
              currency={currency}
            />
          </section>
        </div>

        <aside className={'info'}>
          <div className={'card'}>
            {timeSchedule && timeSchedule.open && (
              <div className="opening-hours">
                <VenueOpeningHours schedule={timeSchedule.open} />
              </div>
            )}
            <div className={'labeled-text'}>
              <strong>{__('venuePage.address')}</strong>
              <span>{[address1, address2, city].join(' ')}</span>
              <br />
              <span>{postalCode}</span>
            </div>
            <div className={'labeled-text links'}>
              <strong>{__('venuePage.links')}</strong>
              {!!website && (
                <a
                  href={website}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="website"
                >
                  {__('venuePage.website')}
                </a>
              )}
              {instagram && instagram.id && (
                <a
                  href={`https://instagram.com/${instagram.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="instagram"
                >
                  {__('venuePage.instagram')}
                </a>
              )}
            </div>
            <div className="maps-link">
              <PrimaryButton
                rel="noopener noreferrer"
                target="_blank"
                href={mapsUrl}
                title={__('venuePage.googleMaps')}
              />
            </div>
          </div>
        </aside>
      </div>

      {!!events.length && (
        <section>
          <h2>{__('venuePage.events')}</h2>
          <EventGrid showBuy={true} routeParams={routeParams} events={events} />
        </section>
      )}

      {!!similarVenues.length && (
        <section>
          <h2>{__('venuePage.similarVenues')}</h2>
          <VenueGrid routeParams={routeParams} venues={similarVenues} />
        </section>
      )}

      {/*language=CSS*/}
      <style jsx>{`
        .header {
          margin-top: 1em;
        }
        h1 {
          margin: 1.2em 0 0.1em;
        }
        .header {
          border-bottom: 1px solid ${colors.separator};
          padding-bottom: 1em;
          margin-bottom: 2em;
        }
        .description {
          margin: 0;
          padding-right: 1em;
        }
        .content {
          display: grid;
        }
        .info {
          margin-top: 5em;
        }
        .info .labeled-text {
          margin: 0.9em 0;
        }
        .labeled-text > strong {
          display: block;
        }
        .info > .card {
          background-color: ${colors.cardBg};
          box-shadow: ${colors.cardShadow};
          padding: ${dimensions.cardPadding};
        }
        .links a {
          display: block;
          color: ${colors.linkText};
        }
        .opening-hours {
          margin: 0 -${dimensions.cardPadding} 1.5em;
          padding: 0.3em ${dimensions.cardPadding} 1.3em;
          border-bottom: 1px solid ${colors.cardSeparator};
          border-bottom: 1px solid ${colors.cardSeparator};
        }
        .maps-link {
          margin-top: 1.5em;
        }
        .main-content {
          padding-right: 2em;
        }
        h2 {
          margin-top: 2em;
        }
        .price-class {
          margin: 1.5em 0 1em;
          display: flex;
        }
        .tags {
          margin: -2em 0 2em;
        }
        .price-class .label {
          margin-right: 0.5em;
          font-weight: 400;
        }
        @media (min-width: 780px) {
          .content {
            grid-template-columns: 2fr 1fr;
          }
          .info {
            margin-top: 0;
          }
        }
      `}</style>
    </main>
  );
}

VenuePage.getInitialProps = async ctx => {
  const { venue: venueId, pageSlug } = ctx.query;
  const venue = await getVenue(venueId);
  return {
    venue,
    events: (await getEvents({
      limit: 8,
      query: {
        venue: venueId,
      },
    })).results,
    similarVenues: venue.tags.length
      ? (await getVenues({
          limit: 3,
          query: {
            pageSlug,
            exclude: venueId,
            tags: venue.tags.map(tag => tag.id),
          },
        })).results
      : [],
  };
};

const getBreadcrumbs = ({ venue }) => [
  { key: 'venues', url: 'venues', disabled: true },
  { key: 'venue', title: venue.name },
];

export default withPageLayout(getBreadcrumbs)(VenuePage);
