const express = require('express');
const { body, validationResult } = require('express-validator');
const formidable = require('formidable');
const fs = require('fs');

let data = []
if (fs.existsSync('./blogs.json')) {
    data = require('./blogs.json')
}

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.static('public'))

app.set('view engine', 'ejs')

//json paring
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} `);
});


app.get('/', (req, res) => {
    console.log(req.method);
    res.render('pages/index', { blogs: data });
})

app.get("/post/:id", (req, res) => {

    console.log(req.params)
    // console.log(JSON.parse(req.params))


    fs.readFile("./blogs.json", 'utf-8', (err, data) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            const database = JSON.parse(data);
            const postId = req.params.id

            console.log(database[postId]);

            res.render("pages/post", { post: database[postId], blogs: database })

            // res.send(database[postId].title)

            // database.forEach(post => {
            //     console.log(post.id);
            //     console.log(post.title);
            // });
        }
    })
})


app.get('/new', (req, res) => {
    console.log(req.method);
    res.render('pages/new', { blogs: data });
})

app.post('/newPost',

    body('title').isLength({min:3}),
    body('body').isLength({min:5}),

    (req, res) => {

        const errors = validationResult(req);
        const form = formidable({ multiples: true, uploadDir: './public/images', keepExtensions: true });
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); 
        }

        // form.parse(req, (err, fields, files) => {
        //     if (err) {
        //       next(err);
        //       return;
        //     }
        //     // console.log(req.params);
        //     res.json({ fields, files });
            
        //   });


        console.log("posting:");
        console.log(req.body.title);
        console.log(req.body.body);
        console.log(req.body.username);


        // const database = JSON.parse(data);
        // console.log(database[11]);

        //workaround for new ID
        console.log(data.length);
        let newID = data.length;
        //  newID++
        //  console.log(newID);

        const time = Date.now();
        const publoshedTime = new Date(time)

        //! json manipulation:
        let posts =
        {
            id: newID,
            title: req.body.title,
            body: req.body.body,
            author: req.body.username,

            //?  to correct:
            url: "/img1.jpg",
            published_at: publoshedTime.toLocaleDateString(),
            duration: 4,

            author_bild: "https://source.unsplash.com/random/100x100"
        }

        let postsJson = JSON.parse(fs.readFileSync('./blogs.json', 'utf8'))
        console.log(postsJson)

        postsJson.push(posts)

        console.log(postsJson);


        //!  WRITING:

        fs.writeFile('./blogs.json', JSON.stringify(postsJson), (err) => {
            if (err) throw err
            console.log('updated')
            fs.readFile('./blogs.json', 'utf8', (err, newData) => {
                data = JSON.parse(newData)
                console.log(data);
                res.redirect('/')
            })

        })

        // res.send('testing posting')

        // res.redirect('/')
    })

