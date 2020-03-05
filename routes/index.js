var express = require("express");
var router = express.Router();
const MongooseStudentModel = require('../models/student')

// list all students
router.get("/", (req, res, next) => {
    MongooseStudentModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.render("index", { 
            title: "List Students",
            jsonData: data
        });          
    });
});

// display create student form
router.get("/create", (req, res, next) => {
    res.render("create", { title: "Add a student" });
});

// create student
router.post("/students", function(req, res, next) {
    var student = req.body;
    if (!student.StartDate) {
        student.StartDate = new Date();
    }

    if (!student.FirstName || !student.LastName
        || !student.School)  {
        res.status(400);
        res.json(
            {"error": "Bad data, could not be inserted into the database."}
        )
    } else {
        let newStudent = new MongooseStudentModel(student);
        newStudent.save((err, data) => {
            if (err) res.send(err);
            res.redirect("/");
        });
    }
});

// display the delete confirmation page
router.get("/delete/:id", (req, res, next) => {
    MongooseStudentModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        var jsonObj = { 
            title: "Delete a student",
            jsonData: data
        };
        res.render("delete",jsonObj);
    });
});

// delete student
router.post("/delete", function(req, res, next) {
    var student = req.body;

    MongooseStudentModel.findOneAndRemove({ _id: student._id }, (err, data) => {
        if (err) res.send(err);
        res.redirect("/");
    });
});

// display edit student form
router.get("/edit/:id", (req, res, next) => {
    MongooseStudentModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        var jsonObj = { 
            title: "Edit a student",
            jsonData: data
        };
        res.render("edit",jsonObj);
    });
});

// edit student
router.post("/edit", function(req, res, next) {
     var course = req.body;
    var changedCourse = {};
    if (course.CourseNumber) {
        changedCourse.CourseNumber = course.CourseNumber;
    }
    if (course.CourseName) {
        changedCourse.CourseName = course.CourseName;
    }
    if (course.Instructor) {
        changedCourse.Instructor = course.Instructor;
    }
    if (!changedStudent) {
        res.status(400);
        res.json(
            {"error": "Bad Data"}
        )        
    } else {
        MongooseStudentModel.findOneAndUpdate({ _id: student._id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.redirect("/");
            }
        );
    }
});

// Generate dummydata
router.get("/dummydata", (req, res, next) => {
    var data = [
                {
        "CourseNumber":"COSC101",
        "CourseName":"Intro to Computer Sci",
        "Instructor":"Medhat",
        },{
        "CourseNumber":"Math 300",
        "CourseName":"Calc 4",
        "Instructor":"Tyson",
        },{
        "CourseNumber":"Physics 341",
        "CourseName":"Intro to experimental physics",
        "Instructor":"Bobowski",
        },{
        "CourseNumber":"Physics 451",
        "CourseName":"Intro to thermal Physics",
        "Instructor":"Bobowski",
        }
    ];

    MongooseStudentModel.collection.insert(data, function (err, docs) { 
        if (err){  
            return console.error(err); 
        } else { 
          console.log("Multiple documents inserted to students collection"); 
        } 
    });
    res.redirect("/");
});

module.exports = router;
