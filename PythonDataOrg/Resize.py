import numpy as np 
from PIL import Image
import os 
import re
import cv2

directory = "Dataset"

def is_valid_image_pillow(file_name):
    try:
        with Image.open(file_name) as img:
            img.verify()
            return True
    except (IOError, SyntaxError):
        return False

for filename in os.listdir(directory): 
    f = os.path.join(directory, filename)
    
    if is_valid_image_pillow(f):
        # Load the image
        image_array = cv2.imread(f)
        
        # Convert to grayscale
        gray_image = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
        
        # Resize the image (note: working directly with numpy array)
        new_size = (72,96)  # Desired size (width, height)

        resized_array = cv2.resize(gray_image, new_size)
    
        new_filename = re.sub(r'\..*$', '', filename) # I love regex
        cv2.imwrite(f"formatted_dataset/{new_filename}.jpg", resized_array)
