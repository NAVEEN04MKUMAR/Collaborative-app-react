

const passport=require('passport');
const {Strategy,ExtractJwt}=require('passport-jwt');
const User=require('../model/user');

const opts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'3d73ab700a0dd51ee5f63f5639615ef662c9332b0432fae8c24a22676a10d35c89090f60c582ba73586779eab5f1bf120b855af5a89e5bae45c11dd2ee7e3266',
};

passport.use(new Strategy(opts,async(jwt_payload,done)=>{

    try{
        const user=await User.findById(jwt_payload.id);
        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    }catch(err){
        return done(err,false);
    }

}));