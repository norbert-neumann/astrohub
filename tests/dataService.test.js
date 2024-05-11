import dateService from '../services/dateService.js'

describe('dateService', () => {
    
    describe('minutesBetweenDates', () => {

        it('should return the correct minutes between datetimes', () => {
            const baseDate = new Date('2024-05-11T00:00:00Z')
            const futureDate = new Date('2024-05-11T00:10:00Z')

            const ellapsedMinutes = dateService.minutesBetweenDates(baseDate, futureDate)

            expect(ellapsedMinutes).toBe(10)
        }),

        it('should return the correct minutes between datetimes (in the past)', () => {
            const baseDate = new Date('2024-05-11T00:00:00Z')
            const pastDate = new Date('2024-05-10T23:00:00Z')

            const ellapsedMinutes = dateService.minutesBetweenDates(baseDate, pastDate)

            expect(ellapsedMinutes).toBe(-60)
        }),

        it('should return 0 between identical datetimes', () => {
            const date = new Date('2024-05-11T00:00:00Z')

            const ellapsedMinutes = dateService.minutesBetweenDates(date, date)

            expect(ellapsedMinutes).toBe(0)
        }),

        it('should be insensitive to different time zones', () => {
            const dateInUTC = new Date('2024-05-11T00:00:00Z')
            const dateInOtherTimezone = new Date('2024-05-11T02:00:00+02:00')

            const ellapsedMinutes = dateService.minutesBetweenDates(dateInUTC, dateInOtherTimezone)

            expect(ellapsedMinutes).toBe(0)
        }),

        it('should be insensitive to different time zones', () => {
            const dateInUTC = new Date('2024-05-11T00:00:00Z')
            const dateInOtherTimezone = new Date('2024-05-10T12:00:00-12:00')

            const ellapsedMinutes = dateService.minutesBetweenDates(dateInUTC, dateInOtherTimezone)

            expect(ellapsedMinutes).toBe(0)
        })
    })

    describe('offsetDateByMinutes', () => {

        it('should return expected future date with positive offset', () => {
            const dateInMillis = new Date('2024-05-11T00:00:00Z').getTime()
            const expectedDate = new Date('2024-05-11T00:05:00Z')

            const result = dateService.offsetDateByMinutes(dateInMillis, 5)

            expect(result).toStrictEqual(expectedDate)
        }),

        it('should return expected past date with negative offset', () => {
            const dateInMillis = new Date('2024-05-11T00:05:00Z').getTime()
            const expectedDate = new Date('2024-05-11T00:00:00Z')

            const result = dateService.offsetDateByMinutes(dateInMillis, -5)

            expect(result).toStrictEqual(expectedDate)
        }),

        it('should return expected the same date with zero offset', () => {
            const date = new Date('2024-05-11T00:00:00Z')
            const dateInMillis = date.getTime()

            const result = dateService.offsetDateByMinutes(dateInMillis, 0)

            expect(result).toStrictEqual(date)
        })
    })

    describe('convertToMinutes', () => {

        it('should return expected value given valid parameters ', () => {
            const day = 1
            const timeString = '13:24'
            const expected = 1 * 1440 + 13 * 60 + 24

            const result = dateService.convertToMinutes(day, timeString)

            expect(result).toBe(expected)
        }),

        it('should return expected value given valid parameters ', () => {
            const day = 0
            const timeString = '00:00'
            const expected = 0

            const result = dateService.convertToMinutes(day, timeString)

            expect(result).toBe(expected)
        }),

        it('should return expected value given valid parameters ', () => {
            const day = 2
            const timeString = '23:59'
            const expected = 2 * 1440 + 23 * 60 + 59

            const result = dateService.convertToMinutes(day, timeString)

            expect(result).toBe(expected)
        })
    })

    describe('convertForecastToTimeZone', () => {

        it('should change datetimes to expected time zone', () => {
            const forecast = [
                {
                    sunset: new Date('2024-05-11T00:00:00Z'),
                    sunrise: new Date('2024-05-11T00:10:00Z'),
                    stars: [
                        {
                            rise: new Date('2024-05-11T00:01:00Z'),
                            set: new Date('2024-05-11T00:02:00Z')
                        },
                        {
                            rise: new Date('2024-05-11T00:03:00Z'),
                            set: new Date('2024-05-11T00:04:00Z')
                        }
                    ]
                }
            ]
            const timeZone = 'Europe/Budapest'
            const expected = [
                {
                    sunset: "Saturday, May 11, 2024 at 2:00:00 AM GMT+2",
                    sunrise: "Saturday, May 11, 2024 at 2:10:00 AM GMT+2",
                    stars: [
                        {
                            rise: "Saturday, May 11, 2024 at 2:01:00 AM GMT+2",
                            set: "Saturday, May 11, 2024 at 2:02:00 AM GMT+2"
                        },
                        {
                            rise: "Saturday, May 11, 2024 at 2:03:00 AM GMT+2",
                            set: "Saturday, May 11, 2024 at 2:04:00 AM GMT+2"
                        }
                    ]
                }
            ]
            
            const result = dateService.convertForecastToTimeZone(forecast, timeZone)

            expect(result).toStrictEqual(expected)
        }),

        it('should change datetimes to expected time zone', () => {
            const forecast = [
                {
                    sunset: new Date('2024-05-11T00:00:00Z'),
                    sunrise: new Date('2024-05-11T00:10:00Z'),
                    stars: [
                        {
                            rise: new Date('2024-05-11T00:01:00Z'),
                            set: new Date('2024-05-11T00:02:00Z')
                        },
                        {
                            rise: new Date('2024-05-11T00:03:00Z'),
                            set: new Date('2024-05-11T00:04:00Z')
                        }
                    ]
                }
            ]
            const timeZone = 'America/New_York'
            const expected = [
                {
                    sunset: "Friday, May 10, 2024 at 8:00:00 PM EDT",
                    sunrise: "Friday, May 10, 2024 at 8:10:00 PM EDT",
                    stars: [
                        {
                            rise: "Friday, May 10, 2024 at 8:01:00 PM EDT",
                            set: "Friday, May 10, 2024 at 8:02:00 PM EDT"
                        },
                        {
                            rise: "Friday, May 10, 2024 at 8:03:00 PM EDT",
                            set: "Friday, May 10, 2024 at 8:04:00 PM EDT"
                        }
                    ]
                }
            ]
             
            const result = dateService.convertForecastToTimeZone(forecast, timeZone)

            expect(result).toStrictEqual(expected)
        }),

        it('should change datetimes to expected time zone', () => {
            const forecast = [
                {
                    sunset: new Date('2024-05-11T00:00:00Z'),
                    sunrise: new Date('2024-05-11T00:10:00Z'),
                    stars: [
                        {
                            rise: new Date('2024-05-11T00:01:00Z'),
                            set: new Date('2024-05-11T00:02:00Z')
                        },
                        {
                            rise: new Date('2024-05-11T00:03:00Z'),
                            set: new Date('2024-05-11T00:04:00Z')
                        }
                    ]
                }
            ]
            const timeZone = 'UTC'
            const expected = [
                {
                    sunset: "Saturday, May 11, 2024 at 12:00:00 AM UTC",
                    sunrise: "Saturday, May 11, 2024 at 12:10:00 AM UTC",
                    stars: [
                        {
                            rise: "Saturday, May 11, 2024 at 12:01:00 AM UTC",
                            set: "Saturday, May 11, 2024 at 12:02:00 AM UTC"
                        },
                        {
                            rise: "Saturday, May 11, 2024 at 12:03:00 AM UTC",
                            set: "Saturday, May 11, 2024 at 12:04:00 AM UTC"
                        }
                    ]
                }
            ];
            
             
            const result = dateService.convertForecastToTimeZone(forecast, timeZone)

            expect(result).toStrictEqual(expected)
        }),

        it('should leave the forecast parameter unchanged', () => {
            const forecast = [
                {
                    sunset: new Date('2024-05-11T00:00:00Z'),
                    sunrise: new Date('2024-05-11T00:10:00Z'),
                    stars: [
                        {
                            rise: new Date('2024-05-11T00:01:00Z'),
                            set: new Date('2024-05-11T00:02:00Z')
                        },
                        {
                            rise: new Date('2024-05-11T00:03:00Z'),
                            set: new Date('2024-05-11T00:04:00Z')
                        }
                    ]
                }
            ]

            const forecastCopy = [
                {
                    sunset: new Date('2024-05-11T00:00:00Z'),
                    sunrise: new Date('2024-05-11T00:10:00Z'),
                    stars: [
                        {
                            rise: new Date('2024-05-11T00:01:00Z'),
                            set: new Date('2024-05-11T00:02:00Z')
                        },
                        {
                            rise: new Date('2024-05-11T00:03:00Z'),
                            set: new Date('2024-05-11T00:04:00Z')
                        }
                    ]
                }
            ]

            const timeZone = 'America/New_York'

            const result = dateService.convertForecastToTimeZone(forecast, timeZone)

            expect(forecast).toStrictEqual(forecastCopy)
        })

    })

})
