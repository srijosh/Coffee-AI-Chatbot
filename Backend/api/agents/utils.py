from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from huggingface_hub import InferenceClient
import os
import numpy as np
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

USE_CLOUD_EMBEDDINGS = os.getenv("USE_CLOUD_EMBEDDINGS", "false").lower() == "true"
if USE_CLOUD_EMBEDDINGS:
    
    client = InferenceClient(
        model="sentence-transformers/all-MiniLM-L6-v2",
        token=os.getenv("HUGGINGFACE_API_KEY"),
    )

    def get_embedding(text_input):

        result = client.feature_extraction(text_input)

        embedding = np.array(result)

        # mean pooling if token embeddings returned
        if embedding.ndim == 3:
            embedding = embedding.mean(axis=1)[0]

        elif embedding.ndim == 2:
            embedding = embedding.mean(axis=0)

        return embedding.tolist()
else:
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        cache_folder="./model_cache"
    )
    def get_embedding(text_input):
        return embedding_model.embed_documents([text_input])[0]


# Initialize Chat Model
chat_model = ChatGroq(
    model=MODEL_NAME,
    api_key=API_KEY
)



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
