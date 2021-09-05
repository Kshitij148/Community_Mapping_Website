from flask import Flask
from datetime import datetime
from flask import request
from PIL import Image 
import json
import io 
import base64

app =Flask(__name__)

@app.route("/time",methods=['GET','POST'])
def get_current_time():
    data=request.files['file']
    img=Image.open(data)
    img.show()
    
    return img