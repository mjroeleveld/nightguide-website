const nextRoutes = require('next-routes');
const routes = (module.exports = nextRoutes());

// Static routes
routes.add('home', '/');
routes.add('expert-chat');
routes.add('privacy-policy');
routes.add('ticket-redirect');

// Cities
routes.add('/es/ibiza', 'cities/ibiza');
routes.add('/nl/utrecht', 'cities/utrecht');

// Dynamic routes
routes.add('event', '/:country/:city/events/:event');

routes.add('venues', '/:country/:city/venues');
routes.add('venue', '/:country/:city/venues/:venue');

routes.add('areas', '/:country/:city/areas');
routes.add('area', '/:country/:city/areas/:area');

routes.add('artists', '/:country/:city/artists');
routes.add('artist', '/:country/:city/artists/:artist');

routes.add('date', '/:country/:city/date');

routes.add('article', '/:country/:city/articles/:article');
routes.add('articles', '/:country/:city/articles');

routes.add('explore', '/:country/:city/explore');
routes.add('tag', '/:country/:city/tags/:tag');
routes.add('events', '/:country/:city/events');