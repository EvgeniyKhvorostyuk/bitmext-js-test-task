import moment from 'moment'

export function formatDate (string, format = 'DD-MM-YYYY H:mm') {
  return moment(string).format(format)
}
