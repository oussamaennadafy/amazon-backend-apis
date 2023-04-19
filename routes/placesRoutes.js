const express = require('express')
const router = express.Router()

// middlewares
const { loggedIn, aliasTopPlaces } = require('./../middlewares/userMiddlewares')

// route handlres
const {
 getAllPlaces,
 getOnePlace,
 createPlace,
 uploadPlaceImages,
 getPlacesByCategory,
 getTopFiveChaep,
 getMonthlyPlan,
} = require('./../controllers/placeController')


router.route('/top-5-cheap')
 .get(aliasTopPlaces, getAllPlaces)

router.route('/monthly-plan/:year')
 .get(getMonthlyPlan)

router.route("/:id")
 .get(getOnePlace)

router.route('/')
 .get(getAllPlaces)
 .post(loggedIn, uploadPlaceImages, createPlace)



// router.route("/categories/:category")
//  .get(getPlacesByCategory)

module.exports = router