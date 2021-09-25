import _ from "lodash";

const monthShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];


export function convertToDollars(cents) {
  return (cents / 100.0).toLocaleString(2, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(dollars) {
  return dollars.toLocaleString(2, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function formatServerTimestamp(timestamp) {
  var options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    time: 'short',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };

  return new Date(timestamp * 1000).toLocaleString('en-US', options);
}

export function truncateLongDescription(text, length) {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
}

export function getDifferenceInDays(date1, date2) {
  console.log(date2);
  const diffInMs = Math.abs(date2 - date1);
  return Math.floor(diffInMs / (60 * 60 * 24));
}

export function processDateTime(schedule) {
  const dt = new Date(schedule.date);
  const date = dt.getDate();
  const mon = monthShort[dt.getUTCMonth()];
  const year = dt.getUTCFullYear();
  return `${date} ${mon} ${year} ${schedule.time}`;
}

export function getTime(date) {
  const dt = new Date(date);
  let hours = dt.getHours();
  let minutes = dt.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + '.' + minutes + ' ' + ampm;
  return strTime;
}

export function getDateString(ts) {
  const dt = new Date(ts);
  const date = dt.getDate();
  const mon = dt.getUTCMonth();
  const month = monthShort[mon];
  const year = dt.getUTCFullYear();
  let hours = dt.getHours();
  let minutes = dt.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + '.' + minutes + ' ' + ampm;

  return `${date} ${month} ${year} ${strTime}`;
}

export function queryProcessor(object) {
  let url = ""
  let global = false
  _.map(object, function (e) {
    if (e != undefined || e != null) {
      global = true
    }
  })

  if (global) {
    url += "?"
    _.map(object, function (e, key) {
      console.log(key)
      console.log(e)
      if (e) {
        url += `${key}=${e}&`
      }
    })
    url = url.slice(0, -1);
  }
  return url
}