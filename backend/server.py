import cv2
import numpy as np
import moviepy.editor as mp
from PIL import Image
import pyrebase
import os

from flask import Flask, request, jsonify

app = Flask(__name__)

# Configure Firebase
firebase_config = {
  "apiKey": "AIzaSyB2P1shClSEVwCSQ5mHr1Lp8pmEE8-bdWQ",
  "authDomain": "ttvclub-d0e86.firebaseapp.com",
  "databaseURL": "https://ttvclub-d0e86-default-rtdb.firebaseio.com",
  "projectId": "ttvclub-d0e86",
  "storageBucket": "ttvclub-d0e86.appspot.com",
  "messagingSenderId": "105621257759",
  "appId": "1:105621257759:web:1bbd6511feb9aee086df2a",
  "measurementId": "G-JQGDMJKKRK"
}

firebase = pyrebase.initialize_app(firebase_config)
storage = firebase.storage()

@app.route('/generate_video', methods=['POST'])
def generate_video():
    project_data = request.json  # Assuming the request contains project data
    
    frame_width, frame_height = 1920, 1080  # Adjust based on your desired resolution
    out = cv2.VideoWriter('output_movie.mp4', cv2.VideoWriter_fourcc(*'mp4v'), 30, (frame_width, frame_height))

    # Load images and create a movie
    for scene in project_data["project"]["scenes"]:
        img_url = scene["URL"]
        img = cv2.imread(img_url)
        img = cv2.resize(img, (frame_width, frame_height))
        out.write(img)

    out.release()

    # Combine images and audio to create a final movie
    video_clip = mp.VideoFileClip('output_movie.mp4')
    final_audio = mp.AudioFileClip(project_data["project"]["backgroundmusic"])  # Combine your audio clips if needed
    final_clip = video_clip.set_audio(final_audio)
    codec = "libx264"  # H.264 codec
    final_clip.write_videofile('final_movie.mp4', codec=codec)
    
    # Upload the video to Firebase Storage
    storage.child("videos/final_movie.mp4").put("final_movie.mp4")

    # Get the download URL of the uploaded video
    video_url = storage.child("videos/final_movie.mp4").get_url(None)

    os.remove("output_movie.mp4")
    os.remove("final_movie.mp4")

    return jsonify({"video_url": video_url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
