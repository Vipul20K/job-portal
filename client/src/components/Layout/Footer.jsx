import React, { useContext } from 'react'
import {Context} from "../../main"
import {Link} from "react-router-dom"
import { FaGithub , FaLinkedin} from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill} from "react-icons/ri"
function Footer() {
  const {isAuthorized}  = useContext(Context)
  return (
    <footer className= {isAuthorized ? "footerShow" : "footerHide"}>
{/* <div>&copy; All Rights Reserved by Abhishek.</div> */}
<div>
  <Link to={'https://github.com/Vipul20K'} target='github'><FaGithub></FaGithub></Link>
  <Link to={'https://leetcode.com/u/Vipul_K404/'} target='leetcode'><SiLeetcode></SiLeetcode></Link>
  <Link to={'https://www.linkedin.com/in/vipul-kumar-212445256/'} target='linkedin'><FaLinkedin></FaLinkedin></Link>
  {/* <Link to={'https://www.instagram.com/vipul_k20/'} target='instagram'><RiInstagramFill></RiInstagramFill></Link> */}
</div>
      
    </footer>
  )
}

export default Footer;