import React from 'react'

const  Animation= () => {
  return (
    <>
        {/* Yellow Circle */}
      <div
        className="absolute opacity-40 rounded-full"
        style={{
          backgroundColor: '#BF9B30',
          width: '120px',
          height: '120px',
          top: '-40px',
          left: '0px',
          zIndex: 0,
        }}
      ></div>

      {/* Yellow Blur */}
      <div
        className="absolute opacity-40 rounded-full blur-2xl"
        style={{
          backgroundColor: '#BF9B30',
          width: '300px',
          height: '300px',
          top: '-40px',
          left: '-80px',
          zIndex: 0,
        }}
      ></div>

      {/* Red Circle */}
      <div
        className="absolute opacity-60 rounded-full"
        style={{
          backgroundColor: '#BF3030',
          width: '160px',
          height: '160px',
          bottom: '-50px',
          right: '-90px',
          zIndex: 0,
        }}
      ></div>

      {/* Red Blur */}
      <div
        className="absolute opacity-70 rounded-full blur-2xl"
        style={{
          backgroundColor: '#BF3030',
          width: '260px',
          height: '260px',
          bottom: '-130px',
          right: '-10px',
          zIndex: 0,
        }}
      ></div>
    </>
  )
}

export default Animation