const router = require('express').Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
 */
router.get('',async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "A simple blog application using NodeJs, ExpressJs and MongoDB."
        }
        
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ] )
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    }catch(error) {
        console.log(error);
    }
});


/**
 * GET /
 * POST : id
*/
router.get('/post/:id',async (req, res) => {
    try {
        let slug = req.params.id;
        
        const data = await Post.findById({ _id: slug });
        
        const locals = {
            title: data.title,
            description: "A simple blog application using NodeJs, ExpressJs and MongoDB.",
            currentRoute: `/post/${slug}`
        }
        
        res.render('post', { locals, data });
    }catch(error) {
        console.log(error);
    }
});

/**
 * GET /
 * POST search
*/
router.post('/search',async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "A simple blog application using NodeJs, ExpressJs and MongoDB."
        }
        
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        });
        
        res.render("search", { locals, data, currentRoute: '/' });
    }catch(error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
});

/*
function insertPostData() {
    Post.insertMany([
        {
            title: "Building a Blog1",
            body: "This is the body text1"
        },
        {
            title: "Building a Blog2",
            body: "This is the body text2"
        },
        {
            title: "Building a Blog3",
            body: "This is the body text3"
        },
        {
            title: "Building a Blog4",
            body: "This is the body text4"
        }
    ])
}
insertPostData();
*/

/*
router.get('',async (req, res) => {
    const locals = {
        title: "NodeJs Blog",
        description: "A simple blog application using NodeJs, ExpressJs and MongoDB."
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    }catch(error) {
        console.log(error);
    }
});
*/


module.exports = router;