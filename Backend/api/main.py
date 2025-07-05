from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from agent_controller import AgentController
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, errors
from pymongo.collection import ObjectId
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional
import uuid
import hmac
import hashlib
import base64
import logging
import urllib.parse
import json
from typing import List

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agent Controller
agent_controller = AgentController()

# MongoDB Configuration
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["coffeeapp"]
products_collection = db["products"]
users_collection = db["users"]
orders_collection = db["orders"]

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your_random_secret_key_here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# eSewa Configuration (Sandbox Mode)
ESEWA_SANDBOX_URL = os.getenv("ESEWA_SANDBOX_URL", "https://rc-epay.esewa.com.np/api/epay/main/v2/form")
ESEWA_MERCHANT_CODE = os.getenv("ESEWA_MERCHANT_CODE", "EPAYTEST")
ESEWA_SECRET_KEY = os.getenv("ESEWA_SECRET_KEY", "8gBm/:&EnhH.1/q")
USD_TO_NPR_RATE = float(os.getenv("USD_TO_NPR_RATE", 132.0))

VERIFY_ESEWA_SIGNATURE = False  # Set to False for sandbox testing, True in production

# Pydantic models
class ChatRequest(BaseModel):
    input: dict

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class OrderItem(BaseModel):
    product_name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: list[OrderItem]
    user_email: str
    total_price_usd: float
    delivery_mode: str
    address: Optional[str] = None

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(email: str):
    user = users_collection.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
        return user
    return None

def generate_signature(total_amount: str, transaction_uuid: str, product_code: str, secret_key: str) -> str:
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    hmac_obj = hmac.new(
        key=secret_key.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    )
    signature = base64.b64encode(hmac_obj.digest()).decode('utf-8')
    return signature

def verify_esignature(parsed_response: dict, secret_key: str) -> bool:
    """
    Verify the signature provided by eSewa to ensure the response is legitimate.
    """
    signed_field_names = parsed_response.get("signed_field_names", "").split(",")
    # Log the raw values for debugging
    logger.info(f"Raw parsed_response values: {parsed_response}")
    
    # Normalize total_amount by removing commas and trailing '.0'
    normalized_response = parsed_response.copy()
    if "total_amount" in normalized_response:
        # Remove commas
        normalized_response["total_amount"] = normalized_response["total_amount"].replace(",", "")
        # Remove '.0' if present
        if normalized_response["total_amount"].endswith(".0"):
            normalized_response["total_amount"] = normalized_response["total_amount"][:-2]
        logger.info(f"Normalized total_amount: {normalized_response['total_amount']}")
    
    # Create the message by joining the fields listed in signed_field_names
    # Exclude 'signed_field_names' and 'signature' from the message
    message_fields = [
        f"{field}={normalized_response.get(field, '')}"
        for field in signed_field_names
        if field not in ["signature", "signed_field_names"]
    ]
    message = ",".join(message_fields)
    logger.info(f"Signature message: {message}")
    
    # Generate the expected signature using the secret key
    hmac_obj = hmac.new(
        key=secret_key.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    )
    expected_signature = base64.b64encode(hmac_obj.digest()).decode('utf-8')
    logger.info(f"Expected signature: {expected_signature}")
    logger.info(f"Provided signature: {parsed_response.get('signature')}")
    
    return expected_signature == parsed_response.get("signature")

# API Endpoints (Existing)
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        response = agent_controller.get_response(request.model_dump())
        return {"output": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
def get_products():
    try:
        products = list(products_collection.find())
        for product in products:
            product["_id"] = str(product["_id"])
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register")
async def register(user: User):
    if await get_user(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_password = hash_password(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "phone_number": user.phone_number,
    }
    try:
        result = users_collection.insert_one(user_dict)
        return {"message": "User registered successfully", "user_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "name": user["name"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=300)
        email: str = payload.get("sub")
        name: str = payload.get("name")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await get_user(email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": user["email"], "name": name, "phone_number": user["phone_number"]}

@app.put("/users/me")
async def update_user(
    user_update: UserUpdate,
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=300)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await get_user(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = {}
        if user_update.name is not None:
            update_data["name"] = user_update.name
        if user_update.email is not None:
            if user_update.email != email:
                if await get_user(user_update.email):
                    raise HTTPException(status_code=400, detail="Email already taken")
                update_data["email"] = user_update.email
                orders_result = orders_collection.update_many(
                    {"user_email": email},
                    {"$set": {"user_email": user_update.email}}
                )
        if user_update.phone_number is not None:
            update_data["phone_number"] = user_update.phone_number

        if not update_data:
            return {"email": user["email"], "name": user["name"], "phone_number": user["phone_number"]}

        result = users_collection.update_one({"email": email}, {"$set": update_data})
        if result.modified_count == 0:
            return {"email": user["email"], "name": user["name"], "phone_number": user["phone_number"]}

        updated_user = await get_user(email if not user_update.email else user_update.email)
        return {
            "name": updated_user["name"],
            "email": updated_user["email"],
            "phone_number": updated_user["phone_number"]
        }
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New Endpoints for eSewa Payment
@app.post("/create-order")
async def create_order(order: OrderCreate, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=300)
        email: str = payload.get("sub")
        if email != order.user_email:
            raise HTTPException(status_code=403, detail="Not authorized to create order for this user")
        
        total_price_npr = order.total_price_usd * USD_TO_NPR_RATE
        
        order_dict = {
            "user_email": order.user_email,
            "items": [item.dict() for item in order.items],
            "total_price_usd": order.total_price_usd,
            "total_price_npr": total_price_npr,
            "delivery_mode": order.delivery_mode,
            "address": order.address,
            "transaction_uuid": str(uuid.uuid4()),
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        result = orders_collection.insert_one(order_dict)
        return {"order_id": str(result.inserted_id), "transaction_uuid": order_dict["transaction_uuid"]}
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Error in create_order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/initiate-payment/{order_id}")
async def initiate_payment(order_id: str, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=300)
        email: str = payload.get("sub")
        
        # Convert order_id to ObjectId if valid
        try:
            order_id_obj = ObjectId(order_id)
        except errors.InvalidId:
            raise HTTPException(status_code=400, detail="Invalid order ID format")
        
        # Fetch order
        order = orders_collection.find_one({"_id": order_id_obj})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order["user_email"] != email:
            raise HTTPException(status_code=403, detail="Not authorized to pay for this order")
        
        # Use NPR amount for eSewa
        amount_npr = order.get("total_price_npr", 0)
        if not isinstance(amount_npr, (int, float)) or amount_npr <= 0:
            raise HTTPException(status_code=400, detail="Invalid amount in order")
        
        total_amount = amount_npr
        transaction_uuid = order.get("transaction_uuid")
        if not transaction_uuid:
            raise HTTPException(status_code=400, detail="Missing transaction UUID")
        
        product_code = ESEWA_MERCHANT_CODE
        
        # Generate signature
        signature = generate_signature(
            total_amount=str(total_amount),
            transaction_uuid=transaction_uuid,
            product_code=product_code,
            secret_key=ESEWA_SECRET_KEY
        )
        
        # Prepare form data
        payment_data = {
            "amount": str(amount_npr),
            "total_amount": str(total_amount),
            "transaction_uuid": transaction_uuid,
            "product_code": product_code,
            "tax_amount": "0",
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "success_url": "http://localhost:8000/payment-success",
            "failure_url": "http://localhost:8000/payment-failure",
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "signature": signature
        }
        
        return payment_data
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error in initiate_payment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/payment-success")
async def payment_success(data: str):
    try:
        # Decode the Base64-encoded data parameter
        decoded_response = base64.b64decode(data).decode('utf-8')
        logger.info(f"Raw decoded eSewa response: {decoded_response}")
        
        # Try to parse as JSON first
        try:
            parsed_response = json.loads(decoded_response)
            logger.info(f"Parsed eSewa response (JSON): {parsed_response}")
        except json.JSONDecodeError:
            # If JSON parsing fails, try parsing as a query string
            logger.info("JSON parsing failed, attempting query string parsing")
            decoded_response = urllib.parse.unquote(decoded_response)
            parsed_response = dict(urllib.parse.parse_qsl(decoded_response))
            logger.info(f"Parsed eSewa response (Query String): {parsed_response}")
        
        transaction_uuid = parsed_response.get("transaction_uuid")
        if not transaction_uuid:
            raise HTTPException(status_code=400, detail="Invalid response from eSewa: Missing transaction_uuid")
        
        # Verify the eSewa signature (skip in sandbox if flag is False)
        if VERIFY_ESEWA_SIGNATURE:
            if not verify_esignature(parsed_response, ESEWA_SECRET_KEY):
                raise HTTPException(status_code=400, detail="Invalid signature from eSewa")
        else:
            logger.warning("eSewa signature verification skipped (VERIFY_ESEWA_SIGNATURE is False)")
        
        # Update order status
        order = orders_collection.find_one({"transaction_uuid": transaction_uuid})
        if order:
        # Update order status
            result = orders_collection.update_one(
            {"transaction_uuid": transaction_uuid},
            {"$set": {"status": "completed"}}
            )
        if result.matched_count == 0:
            logger.warning(f"No order found with transaction_uuid: {transaction_uuid}")
        
        # Extract cart items from the order
        cart_items = {item["product_name"]: item["quantity"] for item in order["items"]}
            # Encode cart items for URL
        encoded_items = urllib.parse.quote(json.dumps(cart_items))
        # Redirect to the ThankYou page with a flag
        return RedirectResponse(url=f"http://localhost:5173/thankyou?status=success&fromPayment=true&items={encoded_items}")  # Updated port and added flag
    except base64.binascii.Error as e:
        logger.error(f"Base64 decoding error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Base64 data from eSewa")
    except Exception as e:
        logger.error(f"Error in payment_success: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/payment-failure")
async def payment_failure(data: str):
    try:
        # Decode the Base64-encoded data parameter
        decoded_response = base64.b64decode(data).decode('utf-8')
        logger.info(f"Raw decoded eSewa response: {decoded_response}")
        
        # Try to parse as JSON first
        try:
            parsed_response = json.loads(decoded_response)
            logger.info(f"Parsed eSewa response (JSON): {parsed_response}")
        except json.JSONDecodeError:
            # If JSON parsing fails, try parsing as a query string
            logger.info("JSON parsing failed, attempting query string parsing")
            decoded_response = urllib.parse.unquote(decoded_response)
            parsed_response = dict(urllib.parse.parse_qsl(decoded_response))
            logger.info(f"Parsed eSewa response (Query String): {parsed_response}")
        
        transaction_uuid = parsed_response.get("transaction_uuid")
        if not transaction_uuid:
            raise HTTPException(status_code=400, detail="Invalid response from eSewa: Missing transaction_uuid")
        
        # Verify the eSewa signature (skip in sandbox if flag is False)
        if VERIFY_ESEWA_SIGNATURE:
            if not verify_esignature(parsed_response, ESEWA_SECRET_KEY):
                raise HTTPException(status_code=400, detail="Invalid signature from eSewa")
        else:
            logger.warning("eSewa signature verification skipped (VERIFY_ESEWA_SIGNATURE is False)")
        
        # Update order status
        result = orders_collection.update_one(
            {"transaction_uuid": transaction_uuid},
            {"$set": {"status": "failed"}}
        )
        if result.matched_count == 0:
            logger.warning(f"No order found with transaction_uuid: {transaction_uuid}")
        
        # Redirect to the ThankYou page with a flag
        return RedirectResponse(url="http://localhost:5173/thankyou?status=failed&fromPayment=true")  # Updated port and added flag
    except base64.binascii.Error as e:
        logger.error(f"Base64 decoding error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Base64 data from eSewa")
    except Exception as e:
        logger.error(f"Error in payment_failure: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orders", response_model=List[dict])
async def get_orders(user_email: str, token: str = Depends(oauth2_scheme)):
    try:
        # Verify token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=300)
        email: str = payload.get("sub")
        if email is None or email != user_email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these orders",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Fetch orders
        orders = orders_collection.find({"user_email": user_email})
        # Convert MongoDB documents to JSON-serializable format
        serialized_orders = []
        for order in orders:
            serialized_order = {
                "order_id": str(order["_id"]),
                "user_email": order["user_email"],
                "items": order["items"],
                "total_price_usd": order["total_price_usd"],
                "total_price_npr": order.get("total_price_npr", 0.0),
                "delivery_mode": order["delivery_mode"],
                "address": order.get("address"),
                "status": order.get("status", "pending"),
                "created_at": order["created_at"].isoformat() if "created_at" in order else None,
            }
            serialized_orders.append(serialized_order)
        
        return serialized_orders
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)