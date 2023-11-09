const Auth = () => {
  return (
    <div className="bg-lime-200">
        <div className='flex justify-center items-center h-screen bg-amber-400 m-0'>
          <div className='flex flex-col items-center justify-center h-96 w-96'>
            <input className="self-center justify-center rounded" placeholder="Name"></input>
            <input className="self-center justify-center rounded" placeholder="Password"></input>
          </div> 
        </div>
    </div>
  )
}

export default Auth;