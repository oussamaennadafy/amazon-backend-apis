"use strict"
const Place = require('./../models/placeModel')
const APIFeatures = require('./../utils/APIFeatures')

const multer = require('multer')


const multerStorage = multer.diskStorage({
 destination: (req, file, cb) =>
 {
  cb(null, 'public/img/places')
 },
 filename: (req, file, cb) =>
 {
  const ext = file.mimetype.split('/').at(-1)
  cb(null, `place-${Date.now()}-${Math.random() * 1000}.${ext}`)
 }
})

const multerFilter = (req, file, cb) =>
{
 if (file.mimetype.startsWith('image')) {
  cb(null, true)
 } else {
  cb(new Error('file is not an image'), false)
 }
}

const upload = multer({
 storage: multerStorage,
 fileFilter: multerFilter
})

const uploadPlaceImages = upload.array('images', 15)

const getAllPlaces = async (req, res) =>
{
 try {
  const features = new APIFeatures(Place.find(), req.query)
   .filter()
   .sort()
   .limitFields()
   .paginate()
  const places = await features.query
  res.status(200).json({
   status: "success",
   result: places.length,
   body: {
    places
   }
  })
 } catch (err) {
  res.status(404).json({
   status: "fail",
   // reason: "something went wrong"
   reason: err
  })
 }
}

const getOnePlace = async (req, res) =>
{
 try {
  const place = await Place.findById(req.params.id)
  res.status(200).json({
   status: "success",
   result: place.length,
   body: {
    place
   }
  })
 } catch (err) {
  res.status(404).json({
   status: "fail",
   reason: "something went wrong"
  })
 }
}

const createPlace = async (req, res) =>
{
 try {
  const { title, location, host, price, description, category, from, to, maxAdults, maxChildren, maxInfants,
   maxPets } = req.body
  const images = req.files?.map(image => `http://localhost:${process.env.PORT}/img/places/${image.filename}`)
  if (!title || !location || !host || !price || !images) throw new Error('something went wrong !')
  const createdPlace = await Place.create({
   title,
   description,
   location,
   host,
   price,
   images,
   category,
   from: new Date(from),
   to: new Date(to),
   maxAdults,
   maxChildren,
   maxInfants,
   maxPets
  })
  res.status(200).json({
   status: "success",
   body: {
    createdPlace
   }
  })
 } catch (err) {
  console.log(err);
  res.status(400).json({
   status: "fail",
   reason: "something went wrong"
  })
 }
}

// const getPlacesByCategory = async (req, res) =>
// {
//  try {
//   const { category } = req.params
//   const places = await Place.find({ category })
//   res.status(200).json({
//    status: "success",
//    results: places.length,
//    body: {
//     places
//    }
//   })
//  } catch (err) {
//   console.log(err);
//   res.status(404).json({
//    status: "fail",
//    reason: "something went wrong",
//   })
//  }
// }

// const getTopFiveChaep = async (req, res) =>
// {
//  const topFiveChaepPlaces = await Place.find().sort('price').limit(5)
//  res.json({
//   status: "success",
//   results: topFiveChaepPlaces.length,
//   body: {
//    places: topFiveChaepPlaces
//   }
//  })
// }

const getMonthlyPlan = async (req, res) =>
{
 try {
  const year = parseInt(req.params.year);

  const plan = await Place.aggregate([
   { $unwind: '$ratingsCount' }
  ])

  res.status(200).json({
   status: "success",
   result: plan.length,
   body: {
    plan
   }
  })

 } catch (error) {
  res.status(400).json({
   status: "fail",
   reason: "something went wrong"
  })
 }
}

module.exports = {
 getAllPlaces,
 getOnePlace,
 createPlace,
 uploadPlaceImages,
 // getPlacesByCategory,
 // getTopFiveChaep,
 getMonthlyPlan,
}