'use strict'

var Course = require('../course/model')
var Students = require('../students/model')
var Teacher = require('../teacher/model')
var Subject = require('../subject/model')

exports.school = function(req, res){
  Course.find({ 'school':req.session.user }).populate('school').populate("parallel").populate("course")
  .then(function(courses){

    Students.find({ 'school':req.session.user }).populate('school').exec()
    .then(function(students){

      Teacher.find({ 'school':req.session.user }).populate('school').exec()
      .then(function(teachers){

        Subject.find({ 'school':req.session.user }).populate('school').exec()
        .then(function(subjects){

          res.render('school/school', {
            user:req.session.user,
            type:"Colegio",
            courses:courses,
            students:students.length,
            teachers:teachers,
            subjects:subjects
          })

        }, function(err){
          return err.message
        })


      }, function(err){
        return err.message
      })

    }, function(err){
      return err.message
    })


  }, function(err){
    return err.message
  })
}
