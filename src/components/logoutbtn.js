import React from "react";
import auth from './auth';
import {withRouter, Redirect, Link } from "react-router-dom";

export const LogoutBtn = ({history}) => {
return (
		<button className="btn btn-block create-account"
			onClick={()  =>{
				auth.logout(() =>{
						history.push("/");
				});
			}
		}
		>
		LogOut
		</button>
		

);

}

export default withRouter(LogoutBtn);