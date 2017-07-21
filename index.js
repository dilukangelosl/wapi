var WPAPI = require( 'wpapi' );
var loop = require('node-async-loop');


// You must authenticate to be able to POST (create) a post
var wp = new WPAPI({
    endpoint: 'https://www.letscodeart.com/restapi/wp-json',
    // This assumes you are using basic auth, as described further below
    username: 'admin',
    password: 'admin123@pass'
});
/*
wp.posts().create({
    // "title" and "content" are the only required properties
    title: 'Your Post Title',
    content: 'Your post content',
    // Post will be created as a draft by default if a specific "status"
    // is not specified
    status: 'publish'
}).then(function( response ) {
    // "response" will hold all properties of your newly-created post,
    // including the unique `id` the post was assigned on creation
    console.log(done);
    console.log( response.id );
},function(er){
  console.log(er);
})
*/




var namespace = 'wp/v2'; // use the WP API namespace
var route = '/lawreport/(?P<id>)'; // route string - allows optional ID parameter


wp.lawreports = wp.registerRoute( namespace, route );
wp.lawreports().then(function(res){
  console.log();
})



var post = {
  tags :["missing","dog","sammy"],
  title:"Sherlock homes",
  content:"Perhaps you were looking for one of the resources below:"
}

//createpost(post);


function createpost(postdata){
  var tagarray = [];

for(var i = 0 ; i < postdata.tags.length;i++){
console.log("creating tag " + postdata.tags[i]);
    wp.tags().create({
      name:postdata.tags[i],
      slug:postdata.tags[i]
    }).then(function(res){
        tagarray.push(res.id);
        console.log("adding new tag");
        if(i == postdata.tags.length-1){
            //  post();
        }
        else{
          console.console.log(i +" == " +postdata.tags.length-1);
        }


    },function(err){
        console.log(i);
      tagarray.push(res.data);
        console.log("adding new tag");
      if(i == postdata.tags.length-1){

        //post();
      }
      else{
          console.console.log(i +" == " +postdata.tags.length-1);
      }
    })


}

function post(){
console.log("posting...");
  wp.lawreports().create({
      // "title" and "content" are the only required properties
      title: postdata.title,
      content: postdata.content,
      tags:tagarray,
      // Post will be created as a draft by default if a specific "status"
      // is not specified
      status: 'publish'
  }).then(function( response ) {
      // "response" will hold all properties of your newly-created post,
      // including the unique `id` the post was assigned on creation
      console.log("done");
      console.log( response.id );
  },function(er){
    console.log(er);
  })
}

}






var data = [];

loop(post.tags, function (item, next)
{

//do something
console.log(item);
wp.tags().create({
  name:item,
  slug:item
}).then(function(res){
  data.push(res.id);
  next();
},function(e){
  data.push(e.data);
  next();
})


}, function (err)
{
    if (err)
    {
        console.error('Error: ' + err.message);
        return;
    }

    wp.lawreports().create({
        // "title" and "content" are the only required properties
        title: post.title,
        content: post.content,
        tags:data,
        
        meta: {
    "wpcf-casedate": "1996-08-26"
},
        // Post will be created as a draft by default if a specific "status"
        // is not specified
        status: 'publish'
    }).then(function(res){
      console.log("Created Post");
    },function(ee){
      console.log(ee);
    })
});
