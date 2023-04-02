import { useState } from 'react';

function App() {
  return (
    <>
      <h1>Testing to embedd an HTML file</h1>
      <div className='container-iframe'>
        <iframe src='Strategy.html' />
      </div>
    </>
  );
}

export default App;
