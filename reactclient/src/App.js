import React, { useState } from "react";
import Constants from './utilities/Constants';
import PostCreateForm from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";


function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;
    console.log(url);

    fetch(url, {
      method: "GET",
    })
      .then(response => response.json())
      .then(postsFromServer => {
        setPosts(postsFromServer);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      }); // GET request to our server .then() runs after fetch is complete as async code
  }

  function deletePost(postId){
      const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
  
      fetch(url, {
        method: "DELETE",
      })
        .then(response => response.json())
        .then(responseFromServer => {
          console.log(responseFromServer);
          onPostDeleted(postId);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        }); // GET request to our server .then() runs after fetch is complete as async code
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {(showingCreateNewPostForm === false && postCurrentlyBeingUpdated ===null ) && (
          <div>
            <h1>ASP.NET Core React Integration</h1>

            <div className="mt-5">
              <button onClick={getPosts} className="btn btn-dark btn-lg w-100"> Get Posts from Server</button>
              <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Create New Post</button>
            </div>
          </div>
          )}

          {posts.length > 0 && postCurrentlyBeingUpdated === null && showingCreateNewPostForm === false && renderPostsTable()}
          
          {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated}/>} 

          {postCurrentlyBeingUpdated !== null && <PostUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />}
        </div>
      </div>
    </div>
  ); // essentially the triple brackets for posts.length, showingCreateNewPostForm, and postCurrentlyBeingUpdated are conditional statements. If true then the furthest right && in this case, will execute. [if(true){blahblah} etc.]

  function renderPostsTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">PostId (PK)</th>
              <th scope="col">Title (PK)</th>
              <th scope="col">Content (PK)</th>
              <th scope="col">CRUD Operations (PK)</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.postId}>
                <th scope="row">{post.postId}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button onClick={() => setPostCurrentlyBeingUpdated(post)}className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                  <button onClick={() => { if(window.confirm(`Are you sure you want to delete the post titled "${post.title}"?`)) deletePost(post.postId)}}className="btn btn-secondary btn-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100"> Empty React Posts Array </button>
      </div>
    );
  }

  function onPostCreated(createdPost){
    setShowingCreateNewPostForm(false);
    if(createdPost==null){
      return;
    }

    alert(`Post succeesfully created. After clicking OK, your new post titled "${createdPost.title}" will show up on the table below`);

    getPosts();
  }

  function onPostUpdated(updatedPost){
    setPostCurrentlyBeingUpdated(null);

    if(updatedPost === null){
      return;
    }

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === updatedPost.postId){
        return true; 
      } 
      return 0;
    });

    if (index !== -1){
      postsCopy[index] = updatedPost; 
    }

    setPosts(postsCopy);

    alert(`Post successfully updated. After clicking Ok, look for the post with title "${updatedPost.title}" in the table below so the updates.`);
  }

  function onPostDeleted(deletedPostPostId){
    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === deletedPostPostId){
        return true; 
      } 
      return 0;
    });

    if (index !== -1){
      postsCopy.splice(index, 1); 
    }

    setPosts(postsCopy);

    alert(`Post successfully deleted. After clicking Ok, you may see the results at the table below.`);
  }
};

export default App;
