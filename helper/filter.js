const eventFilter = async (eventName, startDate, endDate, userName) => {
  let filter = {};

  if (eventName) {
    filter.event_name = eventName;
  }

  if (userName) {
    filter['user_info.name'] = userName;
  }

  if (
    startDate &&
    endDate &&
    !isNaN(Date.parse(startDate)) &&
    !isNaN(Date.parse(endDate))
  ) {
    filter.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate && !isNaN(Date.parse(startDate))) {
    filter.created_at = { $gte: new Date(startDate) };
  } else if (endDate && !isNaN(Date.parse(endDate))) {
    filter.created_at = { $lte: new Date(endDate) };
  }

  return filter;
};

const bookingFilter = async (eventName, startDate, endDate, userName) => {
  let filter = {};

  if (eventName) {
    filter.event_info.event_name = { $eq: eventName };
  }

  if (userName) {
    filter['user_info.name'] = userName;
  }

  if (
    startDate &&
    endDate &&
    !isNaN(Date.parse(startDate)) &&
    !isNaN(Date.parse(endDate))
  ) {
    filter.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate && !isNaN(Date.parse(startDate))) {
    filter.created_at = { $gte: new Date(startDate) };
  } else if (endDate && !isNaN(Date.parse(endDate))) {
    filter.created_at = { $lte: new Date(endDate) };
  }

  return filter;
};

module.exports = { bookingFilter, eventFilter };