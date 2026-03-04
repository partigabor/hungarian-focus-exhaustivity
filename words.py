from PIL import Image, ImageDraw, ImageFont

# Read xlsx file
import pandas as pd
df = pd.read_excel("experiment_stimuli.xlsx")

# Get a list of all words in the column 'left' starting with row 164
# words = df["left"].dropna().astype(str).tolist() # DANGER, OVERWRITES CURRENT IMAGES

# Read words from words.txt
with open("words.txt", "r", encoding="utf-8") as file:
    words = [line.strip() for line in file if line.strip()]

# Image settings
image_size = (500, 500)
bg_color = "white"
text_color = "#095276"
# font_path = "arial.ttf"
font_path = "C:/Windows/Fonts/times.ttf"
font_size = 80

# Generate image for each word
for word in words:
    img = Image.new("RGB", image_size, color=bg_color)
    draw = ImageDraw.Draw(img)

    font = ImageFont.truetype(font_path, font_size)

    # Use textbbox for accurate centering
    bbox = draw.textbbox((0, 0), word, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((image_size[0] - text_width) / 2, (image_size[1] - text_height) / 2)

    draw.text(position, word, fill=text_color, font=font)
    
    # Save the image in the folder chunk_includes
    img.save(f"chunk_includes/{word}.png")
   