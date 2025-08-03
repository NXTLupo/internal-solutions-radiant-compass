#!/usr/bin/env python3

from openai import OpenAI
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client with your API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print("🎨 Generating compassionate female doctor avatar using OpenAI responses API...")
print("⏳ This will take several minutes...")

try:
    # Generate image using OpenAI's responses API
    response = client.responses.create(
        model="gpt-4.1-mini",
        input="Generate an image of a compassionate female doctor with warm, kind eyes and a gentle smile. Professional medical attire, soft lighting, approachable and trustworthy appearance. Healthcare professional portrait, clean background, photorealistic style. Conveying empathy, expertise, and caring bedside manner.",
        tools=[{"type": "image_generation"}],
    )

    # Save the image to a file
    image_data = [
        output.result
        for output in response.output
        if output.type == "image_generation_call"
    ]
        
    if image_data:
        image_base64 = image_data[0]
        
        # Save to frontend public directory so it can be served
        avatar_path = "/Users/jonathanlupo/Documents/internal-solutions-radiant-compass/frontend/public/dr_maya_avatar.png"
        
        with open(avatar_path, "wb") as f:
            f.write(base64.b64decode(image_base64))
        
        print(f"✅ Avatar image generated successfully!")
        print(f"📁 Saved to: {avatar_path}")
        print("🎭 Dr. Maya's compassionate avatar is ready!")
        
    else:
        print("❌ No image data returned from OpenAI API")

except Exception as e:
    print(f"❌ Error generating avatar: {str(e)}")