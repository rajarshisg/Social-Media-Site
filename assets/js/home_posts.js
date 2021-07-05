{
    //method to submit the new form data for a post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post', //it is a post request
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-container>ul').prepend(newPost);
                    $('#post-content').val(''); //removing user entered text from input form 
                    deletePost($(' .post-delete-button>a', newPost));
                    new Noty({
                        theme : 'bootstrap-v3',
                        text : 'Post Published!',
                        type : 'success',
                        layout : 'topRight',
                        timeout : 1500
                    }).show()
                },
                error: function (error) {
                    console.log(error.responseText);
                    new Noty({
                        theme : 'bootstrap-v3',
                        text : 'Error in posting!',
                        type : 'error',
                        layout : 'topRight',
                        timeout : 1500
                    }).show()
                }
            });
        });
    }
    //method to create a post in DOM
    let newPostDom = function (post) {
        if(post.user.avatar){
        return $(`<li id="post-${post._id}">
        <div class="post-card">
            <div class="post-card-header">
                <img src="${post.user.avatar}" alt="${post.user.name}" class="post-user-profile-pic">&nbsp;&nbsp;
                <div class="user-name">
                    <a href="/users/profile/${post.user._id}">${post.user.name}</a>
                </div>
                <div class="delete-post-button"><a href="/posts/destroy/${post._id}"><i class="fas fa-times"></i></a>
                </div>
            </div>
    
            <div class="post-content">
                ${post.content}
            </div>
            <div class="likes-count"><b>0 Likes</b></div>
            <div class="like-comment-bar">
                <div class="like"><b><a href="/likes/toggle/?id=${post._id}&type=Post" class=".toggle-likes-button" data-likes='0'><i class="far fa-thumbs-up"></i></i>&nbsp;&nbsp;Like</b></a></div>
                <div class="comment" id="comment-${post._id}"><i class="far fa-comment-alt"></i>&nbsp;&nbsp;<b>Comment</b></div>
            </div>
            <div class="comments-container">
                <div class="posted-comments" id="posted-comments-${post._id}">
    
                    <ul type="none">    
                    </ul>
                </div>
                    <form action="/comments/create" method="POST" id="comment-form-${post._id}">
                        <textarea id="comment-content" name="content" placeholder="Add comment" rows="2" cols="20"
                        required></textarea>
                        <input type="hidden" name="post_id" value="${post._id}" style="display: none;">
                        <button type="submit">Add comment</button>
                    </form>
            </div>
        </div>
    </li>`);}else{
        return $(`<li id="post-${post._id}">
        <div class="post-card">
            <div class="post-card-header">
                <img src="/images/default-avatar.jpg" alt="${post.user.name}" class="post-user-profile-pic">&nbsp;&nbsp;
                <div class="user-name">
                    <a href="/users/profile/${post.user._id}">${post.user.name}</a>
                </div>
                <div class="delete-post-button"><a href="/posts/destroy/${post._id}"><i class="fas fa-times"></i></a>
                </div>
            </div>
    
            <div class="post-content">
                ${post.content}
            </div>
            <div class="likes-count"><b>0 Likes</b></div>
            <div class="like-comment-bar">
                <div class="like"><b><a href="/likes/toggle/?id=${post._id}&type=Post" class=".toggle-likes-button" data-likes='0'><i class="far fa-thumbs-up"></i></i>&nbsp;&nbsp;Like</b></a></div>
                <div class="comment" id="comment-${post._id}"><i class="far fa-comment-alt"></i>&nbsp;&nbsp;<b>Comment</b></div>
            </div>
            <div class="comments-container">
                <div class="posted-comments" id="posted-comments-${post._id}">
    
                    <ul type="none">    
                    </ul>
                </div>
                    <form action="/comments/create" method="POST" id="comment-form-${post._id}">
                        <textarea id="comment-content" name="content" placeholder="Add comment" rows="2" cols="20"
                        required></textarea>
                        <input type="hidden" name="post_id" value="${post._id}" style="display: none;">
                        <button type="submit">Add comment</button>
                    </form>
            </div>
        </div>
    </li>`)
    }
    }

    //method to delete a post from Dom
    let deletePost = function(deleteLink){
        
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme : 'bootstrap-v3',
                        text : 'Post Removed!',
                        type : 'success',
                        layout : 'topRight',
                        timeout : 1500
                    }).show()
                },
                error : function(error){
                    new Noty({
                        theme : 'bootstrap-v3',
                        text : 'Error in deleting the post!',
                        type : 'error',
                        layout : 'topRight',
                        timeout : 1500
                    }).show()
                    console.log(error.responseText);
                }
            });
        });
    }

    //adding the deletePost() to every post
    let addDelete = function(){
        let postList = $('#posts-container ul li');
        postList.each(function(){
            var postDeleteButton = $(this).find('.post-delete-button').find('a');
            deletePost(postDeleteButton);
            let postId = $(this).prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    /*let addToggleLike = function(){
        let postList = $('#posts-container ul li');
        postList.each(function(){
            console.log('GHGHG', $(this));
            var toggleLikesButton = $(this).find('a');
            console.log('BTTN', toggleLikesButton);
            new ToggleLike(toggleLikesButton);
        })
    }*/
    
    createPost();
    addDelete();
    //addToggleLike();
}