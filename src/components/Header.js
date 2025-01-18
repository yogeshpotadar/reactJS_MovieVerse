import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {Appstate} from '../App'

const Header = () => {
  const useAppstate = useContext(Appstate);

  return (
    <div className='sticky z-10 header top-0 px-6 text-3xl flex justify-between items-center text-white-500 font-bold p-3 border-b-2 border-white-300'>
      <Link to={'/'}><span  >MovieFactors<span className='text-white'></span></span></Link>
      {useAppstate.login ?
        <Link to={'/addmovie'}><h1 className='text-lg cursor-pointer flex items-center'>
          <Button><AddIcon className='mr-1' color='secondary' /> <span className='text-white'>Add New</span></Button>
      </h1></Link>
      :
      <Link to={'/login'}><h1 className='text-lg bg-gray-500 cursor-pointer flex items-center'>
          <Button><span className='text-white font-medium capitalize'>Login</span></Button>
      </h1></Link>
      }
    </div>
  )
}

export default Header