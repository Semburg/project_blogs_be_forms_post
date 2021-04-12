const express = require('express');

const fs = require('fs');
let data = []
if (fs.existsSync('./blogs.json')) {
    data = require('./blogs.json')
}

const app = express();
const port = 5000

app.use(express.static('public'))

app.set('view engine', 'ejs')

//json paring
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.listen(port, ()=>{
    console.log(`Server running on port: ${port} `);
});


app.get('/', (req, res)=>{
    console.log(req.method);
    res.render('pages/index', {blogs:data});
})

app.get("/post/:id", (req, res)=>{
    
    console.log(req.params)
    // console.log(JSON.parse(req.params))


    fs.readFile("./blogs.json", 'utf-8', (err, data)=>{
        if(err){
            console.log(`Error: ${err}`);
        } else {
            const database = JSON.parse(data);
            const postId = req.params.id

            console.log(database[postId]);

            res.render("pages/post", {post: database[postId]})

            // res.send(database[postId].title)

            // database.forEach(post => {
            //     console.log(post.id);
            //     console.log(post.title);
            // });
        }
    })
})


app.get('/new', (req, res)=>{
    console.log(req.method);
    res.render('pages/new', {blogs:data});
})

app.post('/newPost', (req, res)=>{
    console.log("posting:");
    console.log(req.body);

    res.send('testing posting')

    // res.redirect('/')
})

