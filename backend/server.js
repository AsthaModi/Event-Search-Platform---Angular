const path = require('path')
const express = require('express')
const app = express()
app.use(express.static(path.join(__dirname, "dist")));
const port = process.env.PORT || 3000;

const axios = require('axios');
var cors = require('cors')
var geohash = require('ngeohash');
// Using cors
app.use(cors())

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: 'f5592dc57ff24884b3868fd36f75f751',
    clientSecret: 'dfbf8f26b82c4b94b8abf156788d8d0f',
    redirectUri: 'http://localhost:3000/'
});

async function spotifyGetArtistName(artistName) {
    // console.log('in functionnnn', artistName)
    try {
        // console.log('in tryyyy')
        var data = await spotifyApi.searchArtists(artistName)
        return JSON.stringify(data.body)
    }
    catch (error) {
        if (error.statusCode === 401) {
            // console.log('in catchhhh')
            const reconnection1 = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(reconnection1.body['access_token']);
            data = await spotifyApi.searchArtists(artistName);
            return JSON.stringify(data.body)
        }
    }
}

async function spotifyGetArtistAlbums(artistId) {
    try {
        var data = await spotifyApi.getArtistAlbums(artistId, { limit: 3 })
        return JSON.stringify(data.body)
    }
    catch (error) {
        if (error.statusCode === 401) {
            const reconnection1 = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(reconnection1.body['access_token']);
            data = await spotifyApi.getArtistAlbums(artistId, { limit: 3 });
            return JSON.stringify(data.body)
        }
    }
}

// Tickemaster API Keys
const api_key = 'e8P4McihfrXMlMGGnFhQWHbEn612b4dX';



app.get('/eventdetails', async (request, response) => {
    try {
        // console.log("in server get eventdetails")
        const { keyword, distance, category, lat, long } = request.query;

        geopoint = geohash.encode(lat, long);
        // console.log(geopoint)
        // Construct URL for Ticketmaster API
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&radius=${distance}&segmentId=${category}&geoPoint=${geopoint}&unit=miles&apikey=${api_key}`;

        var eventList;
        // Request to axios
        const results = await axios.get(url);
        // console.log(results.data.page.totalElements)
        if (results.data.page.totalElements == 0) {
            eventList = ""
        }

        else {
            var eList = results.data._embedded.events.map(e => {
                //for id
                if (e.id == undefined) {
                    eId = ""
                }
                else {
                    eId = e.id;
                }

                // for date
                if (e.dates.start.localDate == undefined) {
                    eDate = ""
                }
                else {
                    eDate = e.dates.start.localDate;
                }

                // for time
                if (e.dates.start.localTime == undefined) {
                    eTime = ""
                }
                else {
                    eTime = e.dates.start.localTime;
                }

                // for icon
                if (e.images[0].url == undefined) {
                    eIcon = ""
                }
                else {
                    eIcon = e.images[0].url;
                }

                // for name
                if (e.name == undefined) {
                    eName = ""
                }
                else {
                    eName = e.name;
                }

                //for genre
                if (e.classifications[0].segment.name == undefined) {
                    eGenre = ""
                }
                else {
                    eGenre = `${e.classifications[0].segment.name}`;
                }

                //for venue
                if (typeof e._embedded.venues == undefined) {
                    eVenue = ""
                }
                else if (e._embedded.venues[0].name == undefined) {
                    eVenue = ""
                }
                else {
                    eVenue = `${e._embedded.venues[0].name}`;
                }

                return {
                    eId: eId,
                    eDate: eDate,
                    eTime: eTime,
                    eDateTime: eDate + " " + eTime,
                    eIcon: eIcon,
                    eName: eName,
                    eGenre: eGenre,
                    eVenue: eVenue
                }
            });

            eventList = eList.sort((data1, data2) => {
                if (data1.eDate < data2.eDate) {
                    return -1;
                }
                else if (data1.eDate > data2.eDate) {
                    return 1;
                }
                else {
                    // Dates are equal, compare times
                    if (data1.eTime < data2.eTime) {
                        return -1;
                    }
                    else if (data1.eTime < data2.eTime) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            });
        }
        response.json(eventList);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server error');
    }
});

app.get('/events', async (request, response) => {
    try {

        const { event_id } = request.query;
        // console.log(event_id)
        const url = `https://app.ticketmaster.com/discovery/v2/events/${event_id}.json?apikey=${api_key}`;
        // console.log(url)
        const apiResponse = await axios.get(url);
        const eventData = apiResponse.data;


        var dict = {};

        // event id
        dict['eventId'] = event_id

        // event name
        dict['eventName'] = eventData.name;

        //event date
        if (eventData?.dates?.start?.localDate) {
            dict['eventDate'] = eventData.dates.start.localDate;
        }
        else {
            dict['eventDate'] = '';
        }

        //event genre
        if (eventData.classifications?.[0]?.segment?.name && eventData.classifications[0].segment.name != "Undefined") {
            var segment = `${eventData.classifications[0].segment.name}`;
        }
        else {
            var segment = ""
        }

        // console.log("Segment", segment)

        if (eventData.classifications?.[0]?.genre?.name && eventData.classifications[0].genre.name != "Undefined") {
            var genre = " | " + `${eventData.classifications[0].genre.name}`;
        }
        else {
            var genre = ""
        }
        // console.log("Genre", genre)

        if (eventData.classifications?.[0]?.subGenre?.name && eventData.classifications[0].subGenre.name != "Undefined") {
            var subGenre = " | " + `${eventData.classifications[0].subGenre.name}`;
        }
        else {
            var subGenre = ""
        }

        // console.log("subGenre", subGenre)

        if (eventData.classifications?.[0]?.subType?.name && eventData.classifications[0].subType.name != "Undefined") {
            var subType = " | " + `${eventData.classifications[0].subType.name}`;
        }
        else {
            var subType = ""
        }

        // console.log("subType", subType)

        if (eventData.classifications?.[0]?.type?.name && eventData.classifications[0].type.name != "Undefined") {
            var type = " | " + `${eventData.classifications[0].type.name}`;
        }
        else {
            var type = ""
        }

        // console.log("type", type)

        // console.log(segment + genre + subGenre + type + subType)
        dict['genres'] = segment + genre + subGenre + type + subType



        // console.log("Segemnghghft", segment)
        //event artist
        var allArtists = []
        var artist = ''

        // console.log('asthaa')

        if (eventData?._embedded?.attractions?.[0]?.name) {
            var spotifyDict = {}
            // console.log("Inf hereeer")
            artist = eventData._embedded.attractions[0].name
            // console.log(artist)
            // console.log(eventData._embedded.attractions[0].classifications[0].segment.name)
            if (eventData._embedded?.attractions?.[0]?.classifications?.[0]?.segment?.name == "Music") {
                var spotifyData = ''
                // console.log('asthaaaajnhgjdhgj')
                spotifyData = await spotifyGetArtistName(artist)
                // console.log(spotifyData)
                s = JSON.parse(spotifyData)
                // console.log('Length', s.artists.items.length)
                if (s.artists.items.length != 0) {
                    // console.log('modi')

                    spotifyDict['spotifyName'] = s.artists?.items?.[0]?.name
                    // console.log('s.artists.item[0].name')
                    spotifyDict['popularity'] = s.artists?.items?.[0]?.popularity
                    // console.log('s.artists.items[0].popularity')
                    spotifyDict['followers'] = s.artists?.items?.[0]?.followers?.total
                    // console.log('s.artists.items[0].followers')
                    spotifyDict['link'] = s.artists?.items?.[0]?.external_urls?.spotify
                    spotifyDict['img'] = `${s.artists?.items?.[0]?.images?.[0]?.url}`
                    aid = s.artists?.items?.[0]?.id
                    // console.log('ais', aid)
                    var albumData = await spotifyGetArtistAlbums(aid)
                    if (albumData) {
                        var aD = JSON.parse(albumData)
                        spotifyDict['albumImg1'] = aD.items?.[0]?.images?.[1]?.url
                        spotifyDict['albumImg2'] = aD.items?.[1]?.images?.[1]?.url
                        spotifyDict['albumImg3'] = aD.items?.[2]?.images?.[1]?.url
                    }
                    allArtists.push(spotifyDict)
                }


            }
            // console.log('outside if')
            for (let i = 1; i < eventData._embedded.attractions.length; i++) {
                // console.log('for')
                artistNameOnly = eventData._embedded.attractions[i].name
                artist += " | " + eventData._embedded.attractions[i].name
                // console.log('eventData?._embedded?.attractions?.[i]?.segment?.name')
                if (eventData._embedded.attractions[i].classifications[0].segment.name == 'Music') {
                    spotifyDictFor = {}
                    // console.log("================")
                    spotifyData = await spotifyGetArtistName(artistNameOnly)
                    s = JSON.parse(spotifyData)
                    if (s.artists.items.length != 0) {
                        // console.log('in forrrr')
                        spotifyDictFor['spotifyName'] = s.artists?.items?.[0]?.name
                        spotifyDictFor['popularity'] = s.artists?.items?.[0]?.popularity
                        spotifyDictFor['followers'] = s.artists?.items?.[0]?.followers?.total
                        spotifyDictFor['link'] = s.artists?.items?.[0]?.external_urls?.spotify
                        spotifyDictFor['img'] = s.artists?.items?.[0]?.images?.[0]?.url
                        aidFor = s.artists?.items?.[0]?.id
                        var albumDataFor = await spotifyGetArtistAlbums(aidFor)
                        if (albumDataFor) {
                            var aDF = JSON.parse(albumDataFor)
                            // s = JSON.parse(spotifyData)
                            // console.log('in albums for')
                            spotifyDictFor['albumImg1'] = aDF.items?.[0]?.images?.[1]?.url
                            spotifyDictFor['albumImg2'] = aDF.items?.[1]?.images?.[1]?.url
                            spotifyDictFor['albumImg3'] = aDF.items?.[2]?.images?.[1]?.url
                            // console.log('dipali')

                        }
                        // console.log('for agter')
                        allArtists.push(spotifyDictFor)
                    }
                }
            }
            // console.log("allll", allArtists)
        }
        else {
            artist = ''
        }
        // console.log(allArtists)
        dict['Artists'] = allArtists
        dict['artists'] = artist
        dict['spotify'] = spotifyDict

        //event Venue Name
        if (eventData._embedded?.venues?.[0]?.name) {
            var venueName = eventData._embedded.venues[0].name;
            dict['venueName'] = eventData._embedded.venues[0].name
        }
        else {
            var venueName = ''
            dict['venueName'] = ''
        }

        if (eventData._embedded?.venues?.[0]?.id) {
            dict['venueId'] = `${eventData._embedded.venues[0].id}`;
        }
        else {
            dict['venueId'] = ''
        }

        //event price ranges
        // console.log(eventData.priceRanges)
        if (eventData.priceRanges?.[0]?.min && eventData.priceRanges?.[0]?.min) {
            var priceRange = `${eventData.priceRanges[0].min}` + "-" + `${eventData.priceRanges[0].max}`
        }
        else {
            var priceRange = ""
        }

        dict['priceRanges'] = priceRange

        // ticket status
        // console.log(eventData.dates.status.code)
        if (eventData.dates?.status?.code) {
            dict['ticketstatus'] = `${eventData.dates.status.code}`
        }
        else {
            dict['ticketstatus'] = ''
        }
        // seatmap
        // console.log("seatmap", eventData.seatmap)
        if (eventData.seatmap == undefined) {
            dict['seatmap'] = ""
        }
        else {
            dict['seatmap'] = eventData.seatmap
        }

        // ticketmaster url
        dict['ticketmasterUrl'] = eventData.url

        //============================venue details========================================
        vNameUrl = venueName.replace(" ", "%20")
        // console.log(vNameUrl)
        const venueUrl = `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${vNameUrl}&apikey=${api_key}`
        // console.log(venueUrl)
        const venueResponse = await axios.get(venueUrl);
        const venueData = venueResponse.data;

        // address
        if (venueData._embedded?.venues?.[0]?.address?.line1) {
            // console.log("Address", venueData._embedded.venues[0].address.line1)
            var address = venueData._embedded.venues[0].address.line1 + ", "
        }
        else {
            var address = ""
        }

        //city 
        if (venueData._embedded?.venues?.[0]?.city?.name) {
            // console.log("City", venueData._embedded.venues[0].city.name)
            var city = venueData._embedded.venues[0].city.name + ", "
        }
        else {
            var city = ""
        }

        if (venueData._embedded?.venues?.[0]?.state?.name) {
            // console.log("City", venueData._embedded.venues[0].state.name)
            var state = venueData._embedded.venues[0].state.name
        }
        else {
            var state = ""
        }

        if (venueData._embedded?.venues?.[0]?.boxOfficeInfo?.phoneNumberDetail) {
            // console.log("Phone Number", venueData._embedded.venues[0].boxOfficeInfo.phoneNumberDetail)
            var phoneNumber = venueData._embedded.venues[0].boxOfficeInfo.phoneNumberDetail
        }
        else {
            var phoneNumber = ""
        }

        if (venueData._embedded?.venues?.[0]?.boxOfficeInfo?.openHoursDetail) {
            // console.log("Open hour", venueData._embedded.venues[0].boxOfficeInfo.openHoursDetail)
            var openHour = venueData._embedded.venues[0].boxOfficeInfo.openHoursDetail
        }
        else {
            var openHour = ""
        }

        if (venueData._embedded?.venues?.[0]?.generalInfo?.generalRule) {
            // console.log("General Rule", venueData._embedded.venues[0].generalInfo.generalRule)
            var generalRule = venueData._embedded.venues[0].generalInfo.generalRule
        }
        else {
            var generalRule = ""
        }

        if (venueData._embedded?.venues?.[0]?.generalInfo?.childRule) {
            // console.log("Child Rule", venueData._embedded.venues[0].generalInfo.childRule)
            var childRule = venueData._embedded.venues[0].generalInfo.childRule
        }
        else {
            var childRule = ""
        }

        if (venueData._embedded?.venues?.[0]?.location?.latitude) {
            var venueLat = venueData._embedded.venues[0].location.latitude
        }
        else {
            var venueLat = ''
        }

        if (venueData._embedded?.venues?.[0]?.location?.longitude) {
            var venueLon = venueData._embedded.venues[0].location.longitude
        }
        else {
            var venueLon = ""
        }

        dict['venueLat'] = venueLat
        dict['venueLon'] = venueLon
        dict['venueAddress'] = address + city + state
        dict['phoneNumber'] = phoneNumber
        dict['openHour'] = openHour
        dict['generalRule'] = generalRule
        dict['childRule'] = childRule

        // console.log("================")
        // console.log("returning")

        response.json(dict);
    }
    catch (error) {
        // console.error(error);
        response.status(500).send('Server error');
    }
});

app.get('/autoComplete', async (request, response) => {

    const { keyword } = request.query;
    // console.log(keyword)

    // Construct URL for Ticketmaster API
    const url = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${api_key}&keyword=${keyword}`;
    // console.log(url)
    try {
        // Request to axios
        const apiResponse = await axios.get(url);
        const recommendations = apiResponse.data._embedded.attractions.map(
            attraction => attraction.name
        );

        response.json(recommendations);
    }
    catch (error) {
        // console.error(error);
        // console.log('HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII from autocomplete')
        response.status(500).send('Server error');
    }

})

app.get('*', (request, result) => {
    result.sendFile(path.join(__dirname, "dist/index.html"))
})

// Start server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});


