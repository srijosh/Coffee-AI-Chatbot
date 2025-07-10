from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")  

# Initialize Groq Embeddings model
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    cache_folder="./model_cache"
)

# Initialize Chat Model
chat_model = ChatGroq(
    model=MODEL_NAME,
    api_key=API_KEY
)

def get_embedding(text_input):
    """Fetch embeddings using LangChain's Groq integration."""
    return embedding_model.embed_documents([text_input])[0]

def get_chatbot_response(user_prompt):
    """Get response from Groq chatbot using direct invocation."""
    return chat_model.invoke(user_prompt).content  

def double_check_json_output(json_string):
    """Validates and corrects a JSON string using the chatbot model."""

    user_prompt = f"""You will check this JSON string and correct any mistakes that make it invalid. Then, return only the corrected JSON string. If it's correct, return it as is.

    Ensure:
    - No extra text before or after the JSON.
    - Each key is enclosed in double quotes.
    - The first character should be '{{' and the last character should be '}}'.

    Here is the JSON to check:
    ```
    {json_string}
    ```
    """

    
    return get_chatbot_response(user_prompt).replace("`", "") 
