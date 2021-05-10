const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000cities = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          owner: '6090e4e56ad19b3b74e2c2eb',
          location: `${cities[random1000cities].city}, ${cities[random1000cities].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. At ab fugit sequi, architecto voluptatibus tenetur officia quisquam sint commodi sapiente expedita et eos pariatur reprehenderit inventore perferendis recusandae optio magnam.',
          price,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000cities].longitude,
              cities[random1000cities].latitude
            ]
          },
          images: [
            {
              _id: '6091d46741e91d22bc5a75d3',
              url: 'https://res.cloudinary.com/das6j3okb/image/upload/v1620169830/YelpCamp/jfzgh8glqpojaozpoyvc.jpg',
              filename: 'YelpCamp/jfzgh8glqpojaozpoyvc'
            }
          ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
  mongoose.connection.close();
})
