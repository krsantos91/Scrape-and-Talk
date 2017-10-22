$(document).on("click","#CommentButton",function(event){ 

    // display comment box and form when clicked
    if($(this).text() === "Discuss"){
        $(this).text("Hide")
        $(this).siblings("#CommentBox").removeClass("d-none").addClass("active")
        // go into the database and find this article and populate its comments
        var ArticleID = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/articles/" + ArticleID
        })
        .done(function(data){    
            data.comments.forEach(index=>{
                $('#CommentArea[data-id='+ ArticleID + ']').append(
                    '<h4> <span class="text-primary">' + index.comment.name + ': '+'</span>' + index.comment.body + '</h4>'            
                )               
            })         
        })    
    }else{
        $(this).siblings("#CommentBox").children("#CommentArea").empty()     
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
        $('#CommentArea[data-id='+ ArticleID + ']').empty();      
        data.comments.forEach(index=>{
            $('#CommentArea[data-id='+ ArticleID + ']').append(
                '<h4> <span class="text-primary">' + index.comment.name + ': '+'</span>' + index.comment.body + '</h4>'            
            )               
        })
    });
    $(this).siblings("form").find("#CommentNameInput").val("")
    // Value taken from note textarea
    $(this).siblings("form").find("#CommentInput").val("")   

})