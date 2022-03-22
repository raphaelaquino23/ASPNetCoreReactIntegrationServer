import React, { useState } from 'react';
import Constants from '../utilities/Constants';

function PostUpdateForm(props) {
    const initialFormData = Object.freeze({
        title: props.post.title,
        content: props.post.content
    });
    
    const [formData, setFormData] = useState(initialFormData);


    const handleChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault(); // prevents default action of reloading. We handle the form submit ourselves. 

        const postToUpdate = {
            postId: props.post.postId,
            title: formData.title,
            content: formData.content
        };

        const url = Constants.API_URL_UPDATE_POST;
        
        fetch(url, {
            method: "PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postToUpdate)
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            });
        props.onPostUpdated(postToUpdate);
    };


    return(
        <div>
            <form className="w-100 px-5">
                <h1 className="mt-5">Update Post titled "{props.post.title}".</h1>
                <div className="mt-5">
                    <label className="h3 form-label">Post title</label>
                    <input value={formData.title} name ="title" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <div className="mt-5">
                    <label className="h3 form-label">Post Content</label>
                    <input value={formData.content} name ="content" type="text" className="form-control" onChange={handleChange}/>
                </div>
                <button onClick={handleSubmit} className="btn btn-dark w-100 mt-5">Submit</button>
                <button onClick={() => props.onPostUpdated(null)} className="btn btn-secondary w-100 mt-3">Cancel</button>
            </form>
        </div>
    );
};

export default PostUpdateForm;