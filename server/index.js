const express = require("express");
const app= express();
const cors= require("cors");
const pool = require("./db");


//middleware
app.use(cors());
app.use(express.json());


//Route

//user registration
app.post("/userdata",async(req,res) => {
	try{

		console.log(req.body);
	
		var { username, password, email, number } = req.body;

		console.log(username);
		
		//console.log(username);
		const newUser = await pool.query("INSERT INTO user_details(username,password,email,number) VALUES($1,$2,$3,$4) RETURNING *",[username,password,email,number]);
		

	}catch(err){
		console.log(err.message);
	}
	
})

// user login authentication
app.get("/userdata",async (req,res) =>{
	try{

			const allData= await pool.query("SELECT* FROM user_details");
			res.json(allData.rows);
		

			

	}catch (err){
		console.log(err.message);

	}


})




app.listen(8000,() =>{
	
	console.log("server has started on port 8000");

});
