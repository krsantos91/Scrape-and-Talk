

$(document).ready(function(){
    $(document).on("click","#CommentButton",function(event){ 
        var ArticleID = $(this).attr("data-id")
        // display comment box and form when clicked
        if($(this).text().charAt(0) === "V"){
            $(this).text("Hide")
            $(this).siblings("#CommentBox").removeClass("d-none").addClass("active")
            // go into the database and find this article and populate its comments
            $.ajax({
                method: "GET",
                url: "/articles/" + ArticleID
            })
            .done(function(data){  
                console.log(data) 
                data.comments.forEach(index=>{
                    console.log($('#CommentArea[data-id="'+ ArticleID + '"]'))
                    $('#CommentArea[data-id="'+ ArticleID + '"]').append(
                        '<div class="CommentContainer">'+
                            '<span class="CommentName">' + index.comment.name +'</span>' + 
                            '<span class="CommentBody">: ' + index.comment.body + '</span>'+
                            '<i class="fa fa-trash float-right animated infinite pulse"  id="DeleteButton" data-article-id="' + ArticleID + '" data-comment-id="'+ index.comment._id + '" aria-hidden="true"></i>' +                        
                        '</div>'  
                    )             
                })         
            })    
        }else{
            $.ajax({
                method: "GET",
                url: "/articles/" + ArticleID
            })
            .done(function(data){  
                console.log(data) 
                    $('#CommentButton[data-id="' + ArticleID + '"]').siblings("#CommentBox").children("#CommentArea").empty()     
                    $('#CommentButton[data-id="' + ArticleID + '"]').html('View Comments <span class="badge badge-pill badge-warning">'+ data.comments.length + '</span>')      
                    $('#CommentButton[data-id="' + ArticleID + '"]').siblings("#CommentBox").addClass("d-none").removeClass("active")                  
            })             
        
        }

    })

    $(document).on("click","#SubmitComment",function(event){
        event.preventDefault();
        var ArticleID = $(this).attr("data-id")
        name = $(this).siblings("form").children().find("#CommentNameInput").val();
        var body = $(this).siblings("form").children().find("#CommentInput").val();
        // Value taken from title input

        $.ajax({
            method: "POST",
            url: "/articles/" + ArticleID,
            data: {
            // Value taken from title input
            name: name,
            // Value taken from note textarea
            body: body,
            }
        })
        // With that done
        .done(function(data) {
            $('#CommentArea[data-id="'+ ArticleID + '"]').empty();      
            data.comments.forEach(index=>{
                $('#CommentArea[data-id="'+ ArticleID + '"]').append(
                    '<div class="CommentContainer">'+
                        '<span class="CommentName">' + index.comment.name +'</span>' + 
                        '<span class="CommentBody">: ' + index.comment.body + '</span>'+
                        '<i class="fa fa-trash float-right animated infinite pulse"  id="DeleteButton" data-article-id="' + ArticleID + '" data-comment-id="'+ index.comment._id + '" aria-hidden="true"></i>' +                        
                    '</div>'            
                )                
            })
        });
        // Clear comment form and erase name form
        $(this).siblings("form").find("#CommentInput").val("")   

    })

    $(document).on("click","#DeleteButton",function(event){
        console.log("Trying to delete")
        var commentId = $(this).attr("data-comment-id");
        var articleId = $(this).attr("data-article-id")
        $.ajax({
            method: "POST",
            url: "/deletecomment/",
            data: {
                commentid: commentId,
                articleid: articleId
            }
        })
        // With that done
        .done(function(data) {
            $('i[data-comment-id="'+ commentId + '"]').parent().empty();      
        });
    })
    
    $("#ScrapeButton").on("click",function(event){
        $('#ScrapeContainer').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>')
        $.get("/scrape",function(res){
            if(res === "ok"){
                window.location.reload();       
            }
        })
    })
})
