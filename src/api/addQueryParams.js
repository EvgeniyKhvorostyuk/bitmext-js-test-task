export function addQueryParams (url, filters) {
  let filterLine = ''
  for (let filter in filters) {
    if (filters[filter].value) {
      if (!filterLine) {
        filterLine += '?'
      } else {
        filterLine += '&'
      }
      filterLine += filter + '=' + filters[filter].value
    }
  }
  return url + filterLine
}
