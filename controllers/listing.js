const Listing = require("../models/listing");

module.exports.home = async (req, res) => {
    res.render("listings/home");
};
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({ owner: req.user._id });
    res.render("listings/index", {allListings});
};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new") 
};

module.exports.searchListing = async (req, res) => {
  const { q } = req.query;
  let allListings = [];
  if (q) {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ]
    });
  }
  res.render("listings/index", { allListings });
};
module.exports.createListing =  async (req, res) => {
    let {title, description} = req.body.listing;
    const newListing = new Listing({title, description});
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing is Updated!");
    res.redirect("/listings");
};
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
};