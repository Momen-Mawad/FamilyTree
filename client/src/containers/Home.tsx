import React from 'react';

const Home: React.FC = () => (
  <>
    <h1>Home Page</h1>
    <p>This page will render as the homepage and if clicked on "Home" in the navigation menu.</p>
    <p>However...</p>
    <p>If you are not logged in you will be redirected here if trying to access the secret page.</p>
  </>
);


export default Home;