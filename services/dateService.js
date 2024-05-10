import _ from 'lodash'

const dateService = {
    convertForecastToTimeZone: (forecast, timeZone) => {
        const convertedForecast = _.cloneDeep(forecast)
    
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            dateStyle: 'full',
            timeStyle: 'long'
        })
    
        convertedForecast.forEach(night => {
            night.sunset = formatter.format(night.sunset)
            night.sunrise = formatter.format(night.sunrise)
            night.stars.forEach(star => {
                star.rise = formatter.format(star.rise)
                star.set = formatter.format(star.set)
            })
        })
    
        return convertedForecast
    },

    minutesBetweenDates: function (baseDate, date) {
        return Math.floor((date - baseDate) / (1000 * 60))
    },
    
    offsetDateByMinutes: (baseDate, range) => {
        return new Date(range * 60 * 1000 + baseDate)
    },
    
    convertToMinutes: (day, timeString) => {
        const [hours, minutes] = timeString.split(':')
        return day * 1440 + Number(hours) * 60 + Number(minutes)
    }
}

export default dateService