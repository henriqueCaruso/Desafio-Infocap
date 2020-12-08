const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { response } = require('express');
let cities = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    const url = "https://pkgstore.datahub.io/core/world-cities/world-cities_csv/data/6cc66692f0e82b18216a48443b6b95da/world-cities_csv.csv";
    let request_call = new Promise((resolve, reject) => {
        https.get(url, function (response) {
            let chunks_of_data = [];
            //console.log(response);
            response.on("data", (fragments) => {
                //console.log(data);
                //let dataArr = hexToString(data).split('\r\n');
                //console.log(dataArr);
                chunks_of_data.push(fragments);
            });
            response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);

                // promise resolved on success
                resolve(response_body.toString());
            });

            response.on('error', (error) => {
                // promise rejected on error
                reject(error);
            });

        });
    });

    request_call.then((response) => {
        cityString = response;
        cityArr = cityString.split('\r\n');
        cities = [...cityArr];
        //console.log(cities);
    }).catch((error) => {
        console.log(error);
    });
    res.sendFile(__dirname + "/index.html");
});

app.post("/searchCity", function (req, res) {
    const query = req.body.cityName;
    function findCity(city) {
        return (city.includes(query));
    }
    let foundCity = (cities.find(findCity));
    if (foundCity) {
        let city = foundCity.split(',');
        res.write("<p> City Name: " + city[0] + "</p>");
        res.write("<p> Country Name: " + city[1] + "</p>");
        res.write("<p> Subcountry: " + city[2] + "</p>");
        res.write("<p> Geoname id: " + city[3] + "</p>");
        res.write("<a href='/' >Go back</a>");
        res.send();
    }
    //console.log(query);

});

app.listen(3000, function () {
    console.log('Server is running on port 3000.');
});

