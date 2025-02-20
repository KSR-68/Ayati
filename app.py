from flask import Flask, render_template, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
# Load the model and tokenizer
model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)

def analyze_responses(responses):
    # Prepare a more focused prompt
    prompt = """You are a Career Counsellor and You are given some responses from a student. Based on the responses, you need to suggest the most suitable career paths for the student.
    The respones are as follows:
    """
    for response in responses:
        prompt += f"Question: {response['question']}\n"
        prompt += f"Answer: {response['answer']}\n\n"
    
    prompt += """Based on the responses you need to Recommended Career Paths in this format:
    1. [Career 1] - Brief one-line justification
    2. [Career 2] - Brief one-line justification
    3. [Career 3] - Brief one-line justification

    Do not forget to consider the student's interests, skills, and personality traits while suggesting the career paths.
    Do not rewrite the questions asked.
    """
    # Add parameters to control response length
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_length=1000,  # Reduced max length
        min_length=100,  # Added min length
        num_return_sequences=1,
        temperature=0.7,
        do_sample=True,
        top_p=0.9,
    )
    
    suggestion = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return suggestion

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    responses = data['responses']
    
    # Analyze the responses using the model
    suggestion = analyze_responses(responses)
    
    return jsonify({
        'suggestion': suggestion,
        'responses': responses
    })

if __name__ == '__main__':
    app.run(debug=True)