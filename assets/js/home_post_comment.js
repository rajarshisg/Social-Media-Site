class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#comment-form-${postId}`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
            $(this).val('');
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    $('.comment-content').val('');
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'bootstrap-v3',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        if(comment.user.avatar){
        return $(`<li id="comment-${comment._id}">
        <div class="comment-user-profile-pic">
            <img src="${comment.user.avatar}">
        </div>
        <div class="comment-card">
            <div class="comment-user-name">
                <div>
                <a href="/users/profile/${comment.user.id}">${comment.user.name}</a></div>
                <a href="/comments/destroy/${comment._id}" class="delete-comment-button"><i class="fas fa-times"></i></a>
            </div>
            
            <div class="comment-content">
                ${comment.content}
            </div>
        </div>
        <div class="comment-like">
            <div class="like-button"><a href="/likes/toggle/?id=${comment._id}&type=Comment">Like</a></div>
            <div class="seperator"><i class="fas fa-circle"></i></div>
            <div class="like-count">0 Likes</div>
        </div>
    </li>`);}else{
        return $(`<li id="comment-${comment._id}">
        <div class="comment-user-profile-pic">
            <img src="/images/default-avatar.jpg">
        </div>
        <div class="comment-card">
            <div class="comment-user-name">
                <div>
                <a href="/users/profile/${comment.user.id}">${comment.user.name}</a></div>
                <a href="/comments/destroy/${comment._id}" class="delete-comment-button"><i class="fas fa-times"></i></a>
            </div>
            
            <div class="comment-content">
                ${comment.content}
            </div>
        </div>
        <div class="comment-like">
            <div class="like-button"><a href="/likes/toggle/?id=${comment._id}&type=Comment">Like</a></div>
            <div class="seperator"><i class="fas fa-circle"></i></div>
            <div class="like-count">0 Likes</div>
        </div>
    </li>`);
    }
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log($(`#comment-${data.data.comment_id}`));
                    $(`#comment-${data.data.comment_id}`).remove();
                    console.log($(`#comment-${data.data.comment_id}`));
                    new Noty({
                        theme: 'bootstrap-v3',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}