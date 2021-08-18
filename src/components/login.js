import React, { Fragment,useState } from "react";
import {withRouter, Redirect, Link } from "react-router-dom";

import auth from "./auth";





const Login = ({history}) => {
   
    
   const [username,setLoginData1] =useState(""); 
   const [password,setLoginData2] =useState("");

  



   const onSubmitLoginForm = async e=>{



    try{
        console.log("in submit");

        e.preventDefault();

           
             const body= {username,password};

        const response =await fetch("http://localhost:5000/userdata");
		const jsonData = await response.json();
        console.log(jsonData);
        var f=0

             for (let i = 0; i < jsonData.length; i++) {

                    if (jsonData[i]["username"]== username){
                              f=1;
                            if( jsonData[i]["password"]==password){
                                document.getElementById("us-error").style.display= "none";
                                 document.getElementById("ps-error").style.display= "none";
                                var setsession = window.sessionStorage.setItem("username",username);

                                auth.login(()=>{
                                history.push("/map");                      
                              });
                                setLoginData1("");
                                setLoginData2("");
                                break;
                            }
                            else{
                                 document.getElementById("us-error").style.display= "none";
                                 document.getElementById("ps-error").innerHTML = "Invalid Password";
                                 document.getElementById("ps-error").style.display= "block";
                                break;
                            }
                    }
                   
                    
                }    
        if (f==0){
               document.getElementById("ps-error").style.display= "none";
              document.getElementById("us-error").innerHTML = "Invalid Username";
             document.getElementById("us-error").style.display= "block";
        }
        else{
                //pass
              }
        
      }catch(err){
            console.log(err.message);
      }

    }

	return (
	<Fragment>
   <div className="background">
    <div className="layer">
 
    <div className="login-form">
        <form onSubmit= {onSubmitLoginForm}>
           
            <div className="form-icon">
                <span><i className="fa fa-user"></i></span>
            </div>

            <div className="form-group">
                <input type="text" className="form-control item" id="username" placeholder="Username" value={username} onChange={e => setLoginData1(e.target.value)} />
                <div>
                    <p id= "us-error" style={{display:"none",color:"red"}}>  </p>
                </div>
            </div>


            <div className="form-group">
                <input type="password" className="form-control item" id="password" placeholder="Password" value={password}  onChange={e => setLoginData2(e.target.value)}/>
                <div>
                    <p id= "ps-error" style={{display:"none",color:"red"}}>  </p>
                </div>
                
            </div>



            <div className="form-group">
                 <button id="login-button"  className="btn btn-block create-account" >LOGIN</button>
            </div>
           
          

            <div className="form-group">
                <center><Link to="/register">Create New Account </Link></center>
            </div>
        </form>
       
        </div>
         </div>
        </div>
      </Fragment>
 


		
	)

}

export default withRouter(Login);



