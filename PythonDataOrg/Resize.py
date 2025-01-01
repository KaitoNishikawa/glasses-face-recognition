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
    print(f)
    # Load the image as a NumPy array
    if is_valid_image_pillow(f):

        #image_array = np.array(Image.open(f))
        image_array = cv2.imread(f)

        # Use the cvtColor() function to grayscale the image
        gray_image = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
        # Resize the image using PIL
        new_size = (72,96)  # Desired size (width, height)
        resized_image = Image.fromarray(gray_image).resize(new_size)

        # Convert the resized image back to a NumPy array
        resized_array = np.array(resized_image)

        im = Image.fromarray(resized_array)
        new_filename = re.sub(r'\..*$', '', filename)
        im.save(f"formatted_dataset/{new_filename}.jpeg")

print(resized_array.shape)