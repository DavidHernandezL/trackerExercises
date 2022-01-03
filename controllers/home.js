const ctrl = {};
const path = require('path');
const {user} = require('../models');
const {exercise} = require('../models');
const {log} = require('../models');

ctrl.index = (req,res) =>{
	 res.sendFile(path.join(__dirname,'../views/index.html'));
};

ctrl.createUser = async (req, res) => {
  const userExist = await user.findOne({username: req.body.username});

  if(userExist){
    res.send('User exits');
  }else{
    const newUser = new user({
      username: req.body.username,
    });

    newUser.save((err, data) => {
      if(err){
        console.log(err);
      }else{
        res.json({
          username: data.username,
          '_id': data._id,
        })
      }
    })
  }
}

ctrl.viewUsers = async (req, res) => {
  const users = await user.find();
  res.json(users)
}

ctrl.createExercise = async (req, res) => {
  var userId = req.params._id;
  var dateExist = req.body.date;
  var description = req.body.description;
  var duration = req.body.duration;
  var date;
  if(dateExist){
    date = new Date(dateExist);
  }else{
    date = new Date();
  }
  const userExist = await user.findById(userId);
  if(userExist){
    const newExercise = new exercise({
      "username": userExist.username,
      "description": description,
      "duration": duration,
      "date": date.toDateString(),
    });
    await newExercise.save();
    res.json({
            "_id": userId,
            "username": userExist.username,
            "description":newExercise.description,
            "duration": newExercise.duration,
            "date": newExercise.date.toDateString(),
          })
  }else{
    res.send('User do not exist')
  }
}

ctrl.viewExercise = async (req, res) => {
  const { from, to, limit } = req.query;
  var newLimit;
  var userId = req.params._id;
  var query;
  console.log(from,to,limit)
   let limitChecker = (limit) => {
    let maxLimit = 100;
    if (limit) {
      return limit;
    } else {
      return maxLimit
    }
  }
  const userExist = await user.findById(userId);
  if(userExist){
    query = {username: userExist.username};
    if (from !== undefined && to === undefined) {
      query.date = { $gte: new Date(from)}
    } else if (to !== undefined && from === undefined) {
      query.date = { $lte: new Date(to) }
    } else if (from !== undefined && to !== undefined) {
      query.date = { $gte: new Date(from), $lte: new Date(to)}
    }

    const exercises = await exercise.find((query), null, {limit: limitChecker(+limit)});
    console.log(exercises)
    
    var result = [];

    for(let i = 0; i<exercises.length;i++){
      var exerciseInfo = {date: exercises[i].date.toDateString(),duration:exercises[i].duration,description:exercises[i].description}
      result.push(exerciseInfo);
    }

    const newLog = new log({
      username: userExist.username,
      count: exercise.length,
      log: result,
    });

    await newLog.save();
    res.json({
      "_id": userId,
      "username": newLog.username,
      "count": newLog.count,
      "log": result
      })
  }
  

}

module.exports = ctrl;