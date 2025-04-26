import React from 'react'

import {Outlet} from "react-router-dom"


import Footer from './Footer'

import Header from './Header'
const Layout = () => {


  return (
    
    <div className="content pt-[1rem]">
     
    

    
     <Header/>
     
      <Outlet />
  
      <Footer/>
      </div>
   
  )
}

export default Layout;
