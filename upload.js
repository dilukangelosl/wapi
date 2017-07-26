var fs = require('fs');
var path = require('path');
var mammoth = require("mammoth");
var WPAPI = require('wpapi');



//init WAAPI

var wp = new WPAPI({
    endpoint: 'https://www.letscodeart.com/restapi/wp-json',
    // This assumes you are using basic auth, as described further below
    username: 'admin',
    password: 'admin123@pass'
});


//Register Custom Post

var namespace = 'wp/v2'; // use the WP API namespace
var route = '/lawreport/(?P<id>)'; // route string - allows optional ID parameter

wp.lawreports = wp.registerRoute(namespace, route);

//get filenames
var filesFolderPath = path.resolve(__dirname, 'files');
var filenames = fs.readdirSync(filesFolderPath);
var tagholder = [];
var counter = 0;



function uploadtag(i, tags, filename,title) {

    console.log(i + " = " + tags.length);
    if (i < tags.length) {
        wp.tags().create({
            name: tags[i],
            slug: tags[i]
        }).then(function (res) {
            console.log("tag created");
            tagholder.push(res.id);
            uploadtag(i + 1, tags, filename);
        }, function (err) {
            //console.log("tag already uploaded");

            console.log("moving to next tag " + i + 1 + "  " + tags.length + " " + filename);

            uploadtag(i + 1, tags, filename,title);
            tagholder.push(res.data);
        })

    } else {
        console.log("uploading to api");
        uploadtowp(filename,title);
    }


}


function uploadtowp(file,title) {
    mammoth.convertToHtml({ path: "files/" + file })
        .then(function (result) {
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion


            wp.lawreports().create({
                // "title" and "content" are the only required properties
                title: title,
                content: html,
                tags: tagholder,
                // Post will be created as a draft by default if a specific "status"
                // is not specified
                status: 'publish'
            }).then(function (response) {
                // "response" will hold all properties of your newly-created post,
                // including the unique `id` the post was assigned on creation
                console.log("done uploading to wp");
            //go to next step
            ++counter;
            step(counter);
            }, function (er) {
                console.log(er);
            })







           
        })
        .done();
}

function step(counter) {
    var i = counter;
    if (i < filenames.length) {

        //get title
        var title = filenames[i].split('.docx')[0];
        //read tagfile docx

        if (filenames[i] != ".DS_Store") {
            mammoth.extractRawText({ path: "tags/" + title + "tags.docx" })
                .then(function (result) {
                    console.log("Cleared Tag Holder");
                    tagholder = [];
                    var text = result.value; // The raw text
                    var messages = result.messages;
                    var tags = text.split(",")
                    console.log("uploading Tags for " + title);
                    uploadtag(0, tags, filenames[i],title);

                })
                .done();





        }
        else {
            ++counter;
            step(counter);
            console.log("No File");
        }





    }
}

step(0);


