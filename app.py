from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = "YOUR_API_KEY"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-thinking-exp-01-21')

def analyze_responses(responses):
    # Prepare the prompt
    prompt = """You are a Career Counsellor and You are given some responses from a student. Based on the responses, you need to suggest the most suitable career paths for the student.
    The responses are as follows:
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
    
    # Generate response using Gemini
    response = model.generate_content(prompt)
    return response.text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    responses = data['responses']
    
    # Analyze the responses using Gemini
    suggestion = analyze_responses(responses)
    
    return jsonify({
        'suggestion': suggestion,
        'responses': responses
    })

if __name__ == '__main__':
    app.run(debug=True)