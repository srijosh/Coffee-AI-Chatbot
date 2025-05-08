import os

# directory = r"C:\Users\Admin\Desktop\Code in a Jiffy  AI Chatbot Using LLMs, Python, RunPod, Hugging Face, and React Native\Coffee_Shop_Ai_Chatbot"
# directory1 = r"C:\Users\Admin\Desktop\Code in a Jiffy  AI Chatbot Using LLMs, Python, RunPod, Hugging Face, and React Native\Coffee_Shop_Ai_Chatbot\coffee_shop_app"
# directory2 = r"C:\Users\Admin\Desktop\Code in a Jiffy  AI Chatbot Using LLMs, Python, RunPod, Hugging Face, and React Native\Coffee_Shop_Ai_Chatbot\python_code"
# directory3 = r"C:\Users\Admin\Desktop\Code in a Jiffy  AI Chatbot Using LLMs, Python, RunPod, Hugging Face, and React Native\Coffee_Shop_Ai_Chatbot\python_code\api"

# directory = r"C:\Users\Admin\Desktop\Coffee app\Coffee\coffee-shop-web\src\components"
directory = r"C:\Users\Admin\Desktop\Coffee app\Coffee\Backend\api\agents"

# Check if the directory exists before listing
if os.path.exists(directory):
    files_and_folders = os.listdir(directory)
    print("Contents of the directory:")
    for item in files_and_folders:
        print(item)
else:
    print(f"Error: Directory '{directory}' does not exist!")
