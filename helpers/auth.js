
// CheckAuth is a middleware to prevet unusual persons
// entering in not allowed routes

module.exports.checkAuth = function(req,res,next){

    const userid = req.session.userid

    //If the user is not logged, then we send him to de /login
    // because it not allowed to go to dashboard
    if(!userid){
        res.redirect('/login')
    }

    next()
}