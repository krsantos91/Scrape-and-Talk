$(document).on("click","#CommentButton",function(event){ 
    // display comment box and form when clicked
    if($(this).text() === "Discuss"){
        $(this).text("Hide")
        $(this).siblings("#CommentBox").removeClass("d-none").addClass("active")
        // go into the database and find this article and populate its comments
        var ArticleID = $(this).attr("data-id")
        console.log(ArticleID);
        $.ajax({
            method: "GET",
            url: "/articles/" + ArticleID
        })
        .done(function(data){
            console.log(data)
        })    
    }else{
        $(this).text("Discuss")      
        $(this).siblings("#CommentBox").addClass("d-none").removeClass("active")      
    }

})

$(document).on("click","#SubmitComment",function(event){
    var ArticleID = $(this).attr("data-id")
    // Value taken from title input

    $.ajax({
        method: "POST",
        url: "/articles/" + ArticleID,
        data: {
          // Value taken from title input
          name: $(this).siblings("form").find("#CommentNameInput").val(),
          // Value taken from note textarea
          body: $(this).siblings("form").find("#CommentInput").val(),
        }
    })
    // With that done
    .done(function(data) {
        console.log(data)
        $('#CommentArea[data-id='+ ArticleID + ']').text("thisworks")

        // Also, remove the values entered in the input and textarea for note entry     
    });
    $(this).siblings("form").find("#CommentNameInput").val("")
    // Value taken from note textarea
    $(this).siblings("form").find("#CommentInput").val("")   

})