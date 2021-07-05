class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        console.log('Like : ', this.toggler);
        this.toggler.on('click', function(e){
            e.preventDefault();
            let self = this;
            $.ajax({
                type : 'GET',
                url : $(self).attr('href'),
                success : function(data){
                    let likesCount = parseInt($(self).attr('data-likes'));
                    if(data.data.deleted == false){
                        likesCount += 1;
                    }else{
                        likesCound -= 1;
                    }
    
                    $(self).attr('data-likes', likesCount);
                    $(self).html(`${likesCount} Likes`)
                },
                error : function(err){
                    console.log(error.responseText);
                }
            })
        });
    }
}