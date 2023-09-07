import cv2
import numpy as np
import moviepy.editor as mp
from PIL import Image, ImageDraw, ImageFont

# Read image filenames and durations from 'image_duration_map.txt'
with open('image_duration_map.txt', 'r') as file:
    image_duration_map = [line.strip().split(':') for line in file]

# Read time-to-text map from 'time_to_text_map.txt'
with open('time_to_text_map.txt', 'r') as file:
    text_map = {}
    for line in file:
        timestamp, text = line.strip().split(':')
        text_map[int(timestamp)] = text

# Read audio filenames and durations from 'audio_names.txt'
with open('audio_names.txt', 'r') as file:
    audio_files = [line.strip().split(':') for line in file]

# Create a VideoCapture object
frame_width, frame_height = 1920, 1080  # Adjust based on your desired resolution
out = cv2.VideoWriter('output_movie.mp4', cv2.VideoWriter_fourcc(*'mp4v'), 30, (frame_width, frame_height))

# Load images and create a movie
for image_file, duration in image_duration_map:
    img = cv2.imread("./ttvfiles/yupepu/"+image_file)
    img = cv2.resize(img, (frame_width, frame_height))
    for _ in range(int(float(duration) * 30)):  # Display each image for 'duration' seconds
        out.write(img)

out.release()

# Combine images and audio to create a final movie
video_clip = mp.VideoFileClip('output_movie.mp4')
final_audio = mp.AudioFileClip("ttvfiles/yupepu/lovemybby.mp3")  # Combine your audio clips if needed
final_clip = video_clip.set_audio(final_audio)
codec = "libx264"  # H.264 codec
final_clip.write_videofile('final_movie.mp4', codec=codec)

# Text overlay function
def add_text(image, text, position):
    font = font = ImageFont.load_default()
    draw = ImageDraw.Draw(image)
    draw.text(position, text, (255, 255, 255), font=font)

# Load each image and add text overlay at specific times
for idx, (image_file, _) in enumerate(image_duration_map):
    img = Image.open("./ttvfiles/yupepu/" + image_file)
    text = text_map.get(idx + 1, "")  # Use idx + 1 to match the time-to-text map
    position = (10, frame_height - 40)  # Adjust the position as needed
    add_text(img, text, position)
    img.save(f'output_frames/frame_{idx}.jpg')

# Combine text-overlayed frames and audio to create a final movie
frame_files = [f'output_frames/frame_{idx}.jpg' for idx in range(len(image_duration_map))]
frame_clip = mp.ImageSequenceClip(frame_files, durations=[float(duration) for _, duration in image_duration_map], fps=30)
final_clip = frame_clip.set_audio(final_audio)
final_clip.write_videofile('final_movie_with_text.mp4')
