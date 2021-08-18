import React from "react";
import { Fragment,useState} from "react";
import {Link } from "react-router-dom";
import validator from 'validator'



const Register = () => {

   const [username,setData1] =useState(""); 
   const [password,setData2] =useState("");
   const [email,setData3] =useState(""); 
   const [number,setData4] =useState("");

   

   


    const onSubmitRegistrationForm = async e =>{

    try{
        console.log("in submit");

        e.preventDefault();

        const response =await fetch("http://localhost:5000/userdata");
		const jsonData = await response.json();

		console.log(jsonData);

      
             var flag=1;
        
	
                
             const body= {username,password,email,number};

              for (let i = 0; i < jsonData.length; i++) {

                    if (jsonData[i]["username"]== username){
                        flag=0;
                        break;
                    }
                     else{
                         // pass
                     }
                    
                }
               if (username==null || username=="" || password==null || password=="" || email==null || email=="" || number==null || number==""){
                        document.getElementById("us-rerror").style.display= "none";
                        document.getElementById("ps-rerror").style.display= "none";
                        document.getElementById("em-rerror").style.display= "none";
                        document.getElementById("pn-rerror").style.display= "none";
                        document.getElementById("gen-rerror").innerHTML = "All Fields Must be filled";
                        document.getElementById("gen-rerror").style.display= "block";
                     
                   }
               else if(password.length<8){  
                          document.getElementById("gen-rerror").style.display= "none";
                        document.getElementById("us-rerror").style.display= "none";
                        document.getElementById("em-rerror").style.display= "none";
                        document.getElementById("pn-rerror").style.display= "none";
                         document.getElementById("ps-rerror").innerHTML = "Password must be atleast of Length 6";
                         document.getElementById("ps-rerror").style.display= "block";
                     
                    
                    
                    }
                else if(!validator.isEmail(email))
                {
                           document.getElementById("gen-rerror").style.display= "none";
                         document.getElementById("us-rerror").style.display= "none";
                        document.getElementById("ps-rerror").style.display= "none";
                        document.getElementById("pn-rerror").style.display= "none";
                         document.getElementById("em-rerror").innerHTML = "Invalid Email Address";
                         document.getElementById("em-rerror").style.display= "block";
                     
                         
                    }
               else if(flag==0){
                           document.getElementById("gen-rerror").style.display= "none";
                        document.getElementById("ps-rerror").style.display= "none";
                        document.getElementById("em-rerror").style.display= "none";
                        document.getElementById("pn-rerror").style.display= "none";
                        document.getElementById("us-rerror").innerHTML = "Username Already Exists";
                        document.getElementById("us-rerror").style.display= "block";
                     
                        
                        setData1("");

                }
               else{
                    
                const response1 = fetch("http://localhost:5000/userdata",{
                
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
                
                
                });

                setData1("");
                setData2("");
                setData3("");
                setData4("");

             
                
                alert("Successfully Registered");



            }
                    
        } catch(err){
       
            console.error(err.message);
        }
    

  }  


	return (
        <Fragment>
       <div className="background">
    <div className="layer">
		 <div className="register-form">
        <form onSubmit= {onSubmitRegistrationForm}>
            <div className="form-icon">
                <span><i className="fa fa-user"></i></span>
            </div>
            <div className="form-group">
                 <div>
                    <center>
                    <p id= "gen-rerror" style={{display:"none",color:"red"}}>  </p>
                    </center>
                   <br />
                </div>
                <input type="text" className="form-control item" id="username" placeholder="Username" value={username} onChange={e => setData1(e.target.value)}/>
                <div>
                    <p id= "us-rerror" style={{display:"none",color:"red"}}>  </p>
                </div>
            </div>
            <div className="form-group">
                <input type="password" className="form-control item" id="password" placeholder="Password" value={password} onChange={e => setData2(e.target.value)} />
                <div>
                    <p id= "ps-rerror" style={{display:"none",color:"red"}}>  </p>
                </div>
             </div>
            <div className="form-group">
                <input type="text" className="form-control item" id="email" placeholder="Email" value={email} onChange={e => setData3(e.target.value)} />
                <div>
                    <p id= "em-rerror" style={{display:"none",color:"red"}}>  </p>
                </div>
            </div>
            <div className="form-group">
                <input type="text" className="form-control item" id="phone-number" placeholder="Phone Number" value={number} onChange={e => setData4(e.target.value)} />
                <div>
                    <p id= "pn-rerror" style={{display:"none",color:"red"}}>  </p>
                </div>
            </div>
           
            <div className="form-group">
                <button id="register-button" className="btn btn-block create-account">Create Account</button>
            </div>

            <div className="form-group">
                <center><Link to="/">Back to Login</Link></center>
            </div>
        </form>

        </div>
        </div>
        </div>
        </Fragment>
      
	)

}

export default Register;



