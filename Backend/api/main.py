from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent_controller import AgentController
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize Agent Controller
agent_controller = AgentController()

# MongoDB Configuration
mongo_uri = os.getenv("MONGO_URI")  # From .env
client = MongoClient(mongo_uri)
db = client["coffeeapp"]  # Database Name
products_collection = db["products"]  # Collection Name


# Define request model
class ChatRequest(BaseModel):
    input: dict  # Ensuring input follows the correct format

# Define response route
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        response = agent_controller.get_response(request.model_dump()) 
        return {"output": response}  # Matches frontend expectation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Fetch products from MongoDB
@app.get("/products")
def get_products():
    try:
        products = list(products_collection.find())  # Fetch all products
        # Convert MongoDB ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        return {"products": products}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Run the server (for local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
