import React from 'react';
import "./Home.css"

function Home (){
    return(
    <div className='start-container'>
        <div className='background'></div>
        <footer className="footer">
        © {new Date().getFullYear()} Martyna Wielgopolan — Digital Art Gallery. All rights reserved. • Powered by <a href="https://www.artsy.net/api" target="_blank" rel="noopener noreferrer">Artsy API</a>
      </footer>
          
    </div>
    );

}
export default Home;