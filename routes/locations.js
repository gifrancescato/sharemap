const router= require('express').Router();
const Location= require('../models/Locations');
const User= require('../models/User');

const MapboxClient = require('mapbox');
const accessToken = 'pk.eyJ1IjoibGF2YXBpZXMiLCJhIjoiY2t6bXFmenJvNDZtdTMwbzEyMGtocmFyeSJ9.fZ0tppeLAusfK9l8yfgZFA';
const client = new MapboxClient(accessToken);

const {loginCheck}= require('./middleware');

router.get('/new', (req, res, next) => {
    Location.find().then((locationFromDB) => {
        const plz= req.query.plz || "";
        const city = req.query.city || "";
        const street = req.query.street || "";
        res.render('new', { locations: locationFromDB, plz: plz, city: city, street: street});
    });
});

router.get('/locations', (req, res, next) => {
    Location.find()
      .then((locationFromDB) => {
        const loggedInUser = req.user;
        res.render('locations', { locations: locationFromDB,  user: loggedInUser });
        
        
      })
      .catch((err) => {
        next(err);
      });
  });

  router.get('/locations', (req, res, next) => {
    Location.find()
      .then((locationFromDB) => {
        

        res.json(locationFromDB);
      })
      .catch((err) => {
        next(err);
      });
  });

  router.post('/locations', (req, res, next) => {
    const {
      name,
      imageUrl,
      reviews,
      street,
      city,
      zip,
    } = req.body;
    //const list = '';
    // list += '<option select></option>';
    
    // const imgPath = req.file.path;
    // const imgName = req.file.originalname;
    // const publicId = req.file.filename;
    const address = `${street}, ${city}, ${zip}`;
    client.geocodeForward(address)
    .then(response => {
      // res is the http response, including: status, headers and entity properties
      var data = response.entity.features[0].geometry.coordinates; // data is the geocoding result as parsed JSON
      const latitude = data[0]
      const longitude = data[1]
      
      const location = {
        address: {
          street: street,
          city: city,
          zipcode: zip,
        }
      }
      Location.create({
        name: name,
        imageUrl: imageUrl,
        // imgPath: imgPath,
        // imgName: imgName,
        location: location,
        latitude: latitude,
        longitude: longitude,
        reviews: reviews,
      })
      .then((createdLocation) => {
        
        res.json(createdLocation);
      })
      .catch((err) => next(err));
     }) 
  });

  router.get('/location/delete/:id', loginCheck(), (req, res, next) => {
  
	const locationId = req.params.id;
  const query = { _id: locationId, owner: req.user._id }
  
	Location.findOneAndDelete(query)
    .then(() => res.redirect('/locations'))
    .catch(err => next(err));
});

// show location details
router.get('/location/:id', (req, res, next) => {
  const loggedInUser = req.user;
  Location.findById(req.params.id)
    .then((location) => {
      res.render('show.hbs', { spaeti, user: loggedInUser });
    })
    .catch((err) => {
      next(err);
    });
});

// Edit location:
router.get('/location/edit/:id', (req, res, next) => {

	const locationId = req.params.id;
	Spaeti.findById(locationId)
		.then(locationFromDB => {
      
			res.render('locationEdit', { location: locationFromDB });
		})
		.catch(err => {
			next(err);
		})
});

router.post('/location/edit/:id', (req, res, next) => {
	const locationId = req.params.id;
	const { name, image } = req.body;
	

	Location.findByIdAndUpdate(locationId, {
		name: name,
		image: image,
	}, { new: true })
		.then(updatedLocation => {
			
			res.redirect(`/spaeti/${updatedLocation._id}`);
		})
		.catch(err => {
			next(err);
		})
});

router.post('/location/:id/reviews', (req, res, next) => {
    const user = req.user.username
    
    const locationId = req.params.id;
    const { text } = req.body;
    Location.findByIdAndUpdate(locationId, { $push: { reviews: { user: user, text: text } } }, { new: true })
      .then(spaetiFromDB => {
        
        // redirect to the detail view of this book
        (res.redirect(`/location/${locationId}`));
      })
      .catch(err => {
        next(err);
      })
    });
    
    module.exports = router;