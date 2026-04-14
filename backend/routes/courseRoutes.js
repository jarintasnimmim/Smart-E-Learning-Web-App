const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// ১. সব কোর্স পাওয়ার জন্য (GET)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ২. নির্দিষ্ট একটি কোর্স আইডি দিয়ে খোঁজা (GET)
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ৩. নতুন কোর্স অ্যাড করার জন্য (POST)
router.post('/add', async (req, res) => {
    const { title, instructor, price, image, videoUrl, description } = req.body;
    try {
        const newCourse = new Course({
            title,
            instructor,
            price,
            image,
            videoUrl,
            description
        });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// ৪. কোর্স আপডেট করার জন্য (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ৫. কোর্স ডিলিট করার জন্য (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Course removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ৬. রিভিউ এবং রেটিং সাবমিট করার রাউট (POST)
router.post('/:id/review', async (req, res) => {
    try {
        const { rating, comment, userId, userName } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.reviews) {
            course.reviews = [];
        }

        const alreadyReviewed = course.reviews.find(
            (r) => r.userId.toString() === userId.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this course' });
        }

        const review = {
            userId,
            userName,
            rating: Number(rating),
            comment,
            createdAt: new Date()
        };

        course.reviews.push(review);
        
        if (course.reviews.length > 0) {
            const totalRating = course.reviews.reduce((acc, item) => item.rating + acc, 0);
            course.averageRating = totalRating / course.reviews.length;
        }

        await course.save();
        res.status(201).json({ message: 'Review added successfully!' });
    } catch (err) {
        console.error("Review Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// ৭. অ্যাডমিন কর্তৃক রিভিউ ডিলিট করার রাউট (DELETE)
router.delete('/:courseId/review/:reviewId', async (req, res) => {
    try {
        const { courseId, reviewId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // রিভিউটি ফিল্টার করে বাদ দেওয়া
        course.reviews = course.reviews.filter(
            (rev) => rev._id.toString() !== reviewId
        );

        // ডিলিট করার পর এভারেজ রেটিং আবার হিসেব করা
        if (course.reviews.length > 0) {
            const totalRating = course.reviews.reduce((acc, item) => item.rating + acc, 0);
            course.averageRating = totalRating / course.reviews.length;
        } else {
            course.averageRating = 0;
        }

        await course.save();
        res.json({ message: "Review deleted successfully!" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ message: "Server Error: Could not delete review" });
    }
});

module.exports = router;