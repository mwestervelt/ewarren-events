import React from 'react';
import ReactDOM from 'react-dom';

import './App.scss';

function formatEventAddress(event) {
  const { publicAddress, city, state } = event;
  const fields = [ publicAddress, city, state ];

  const formattedAddress = fields.map((field, index) => {
      if (field && field.length) {
          const isLast = fields.length - 1 === index;
          return `${field}${isLast ? '' : ', '}`;
      }
      return '';
  });
  return formattedAddress.join('');
}

function makeEventDate(input, timezone, language = 'en-US') {
  const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone,
  };
  const formatted = new Intl.DateTimeFormat(language, options).format(new Date(input));
  return formatted;
}

function App() {
  const [events, setEvents] = React.useState(null);
  const [visible, setVisible] = React.useState(6);

  React.useEffect(() => {
      fetch('https://api.elizabethwarren.codes/prod-events-v2/upcoming')
        .then(res => res.json())
        .then(data => setEvents(data.events));
    }, []);

  const handleClick = event => { setVisible(visible + 6) };

  if (!events) {
  console.log(events)
      return (
          <div className="loading"></div>
      );
  }
console.log(events)
  return (
      <div>
          <div className="header">All Events</div>
          <div className="event-list">
              {events.slice(0, visible).map((event) => (
                  <div key={event.title['en-US']} className="event">
                      <h3 className="event-title content">{event.title['en-US']}</h3>
                      <p className="event-address content">{formatEventAddress(event)}</p>
                      <p className="event-time content">{makeEventDate(event.date, event.timezone)}</p>
                      <a href={event.rsvpLink} target="_blank">RSVP</a>
                  </div>
              ))}
              {visible <= 25 ? <a onClick={handleClick} type="button" className="load-btn">Load more</a> : null}
          </div>
      </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));