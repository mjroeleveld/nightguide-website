import Head from 'next/head';

import withPageLayout from '../components/PageLayout';
import { getVenue, getEvents } from '../lib/api';
import __, { _o } from '../lib/i18n';
import ImageGrid from '../components/ImageGrid';
import colors from '../styles/colors';
import VenueOpeningHours from '../components/venues/VenueOpeningHours';
import dimensions from '../styles/dimensions';
import PrimaryButton from '../components/PrimaryButton';
import VenueFacilities from '../components/venues/VenueFacilities';
import VenuePriceClass from '../components/venues/VenuePriceClass';
import ReadMoreLess from '../components/ReadMoreLess';
import EventRow from '../components/events/EventRow';
import { useToggleState } from '../lib/hooks';
import ImagesModal from '../components/ImagesModal';
import SeeOnMap from '../components/SeeOnMap';
import React from 'react';
import { createMapsUrl, generateMetaDescription } from '../lib/util';

function VenuePage(props) {
  const { venue, routeParams, events, pageSlug } = props;

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
  } = venue;
  const {
    address1,
    address2,
    postalCode,
    city,
    coordinates,
    googlePlaceId,
  } = location;

  const [isImageModalOpen, toggleIsImageModalOpen] = useToggleState(false);

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
            content={generateMetaDescription(_o(description))}
          />
        )}
        {!!images.length && (
          <meta property="og:image" content={`${images[0].url}=s1200`} />
        )}
      </Head>

      <header className={'header'}>
        <div className="image-grid">
          <ImageGrid
            onImageClick={toggleIsImageModalOpen}
            images={images.slice(0, 5)}
          />
          <ImagesModal
            onClose={toggleIsImageModalOpen}
            isOpen={isImageModalOpen}
            images={images}
          />
        </div>
        <h1>{name}</h1>
      </header>

      <div className="content">
        <div className="main-content">
          {description && (
            <ReadMoreLess initialHeight={400}>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: _o(description) }}
              />
            </ReadMoreLess>
          )}
          {priceClass && (
            <section className="price-class">
              <strong className="label">{__('venuePage.priceClass')}</strong>
              <VenuePriceClass priceClass={priceClass} />
            </section>
          )}
          {pageSlug !== 'es/ibiza' && (
            <section className="facilities">
              <VenueFacilities
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
          )}
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
                href={createMapsUrl({ ...coordinates, googlePlaceId })}
                title={__('venuePage.googleMaps')}
              />
            </div>
            <div className="see-on-map">
              <SeeOnMap {...coordinates} />
            </div>
          </div>
        </aside>
      </div>

      {!!events.results.length && (
        <section>
          <h2>{__('venuePage.events')}</h2>
          <EventRow
            totalCount={events.totalCount}
            routeParams={routeParams}
            events={events.results}
            seeAllParams={{ venue: venue.id }}
          />
        </section>
      )}

      {/*language=CSS*/}
      <style jsx>{`
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
        .description :global(p:first-child) {
          margin-top: 0;
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
        .see-on-map {
          margin: 2em -${dimensions.cardPadding} -${dimensions.cardPadding};
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
        .price-class .label {
          margin-right: 0.5em;
          font-weight: 400;
        }
        .facilities {
          margin-top: 2em;
        }
        @media (max-width: 800px) {
          .header .image-grid {
            margin: 0 -${dimensions.bodyPadding};
          }
        }
        @media (min-width: 800px) {
          .header {
            margin-top: 1em;
          }
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
  const { venue: venueId } = ctx.query;
  const venue = await getVenue(venueId);
  return {
    venue,
    events: await getEvents({
      limit: 8,
      query: {
        venue: venueId,
      },
    }),
  };
};

const breadcrumbs = ({ venue }) => [{ key: 'venue', title: venue.name }];

export default withPageLayout({ breadcrumbs })(VenuePage);
