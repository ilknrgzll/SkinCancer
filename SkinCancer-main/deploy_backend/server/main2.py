from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from config import cfg
import os

app = FastAPI() 

origins = [
      
    "http://localhost:3000",
    "http://localhost/predict",
    "http://agridl.com.tr",
    "http://agridl.com.tr:3000",
    "http://185.244.145.226",
    "http://185.244.145.226:3000",
    "https://firatelli.com/predict",
    "https://firatelli.com",
    "http://www.firatelli.com",
    "http://www.firatelli.com/predict",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#sample_detection = DetectionSample()
#MODEL = sample_detection.get_model()
MODEL = tf.keras.models.load_model(os.path.join(cfg.ROOT_DIR, '3', 'best_model.h5'))
#CLASS_NAMES = sample_detection.get_class_names()
CLASS_NAMES = ['4', '6', '2', 
               '1', '5','0','3']

@app.get("/ping")
async def ping():
    return "hi, I am alive"

def read_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image
    

def read_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    # Görüntüyü 256x256 boyutuna dönüştür
    image_resized = tf.image.resize(image, [28, 28])
    return image_resized
    
@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image_data = await file.read()  # Değişiklik burada: Gelen dosyanın verilerini al
    image = read_image(image_data)  # image değişkenini tanımla

    image_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(image_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        'predicted_class': predicted_class,
        'confidence': float(confidence),
    }


if __name__ == "__main__":
    uvicorn.run("main2:app", host='localhost', port=8002, reload=True)   