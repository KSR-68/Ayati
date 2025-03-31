from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import markdown
import bleach

app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = "YOUR_API_KEY"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-pro-exp-03-25')

def analyze_responses(responses):
    # Filter out responses with no answers
    valid_responses = [r for r in responses if r.get('answer') is not None]
    
    if not valid_responses:
        return "Not enough responses to make career suggestions. Please answer the questions."

    prompt = """As a Career Counsellor, analyze these student responses which were conducted on RIASEC type test and suggest suitable career paths.
    Each response is on a Likert scale of 1-5 (1=Strongly Disagree, 5=Strongly Agree).

    Student's Responses:
    """
    
    # Group responses by section
    sections = {}
    for response in valid_responses:
        section = response.get('section', 'Other')
        if section not in sections:
            sections[section] = []
        sections[section].append(response)
    
    # Format responses by section
    for section, resp in sections.items():
        prompt += f"\n{section}:\n"
        for r in resp:
            prompt += f"- {r['question']}: {r['answer']}/5\n"
    
    prompt += """
    Please suggest 3 most suitable career paths based on these responses.
    Format your response as:
    
    1. [Career 1] - [Brief justification based on specific responses]
    2. [Career 2] - [Brief justification based on specific responses]
    3. [Career 3] - [Brief justification based on specific responses]
    """
    
    # Generate response from the model
    response = model.generate_content(prompt)
    
    # Convert Markdown to HTML
    md = markdown.Markdown()
    html_content = md.convert(response.text)
    
    # Configure allowed HTML tags and attributes
    allowed_tags = ['h1', 'h2', 'ol', 'li', 'p', 'strong', 'em']
    allowed_attrs = {}
    
    # Sanitize HTML
    clean_html = bleach.clean(
        html_content,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )
    
    return clean_html

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    responses = data['responses']
    
    # Validate responses
    if not responses:
        return jsonify({
            'error': 'No responses provided',
            'suggestion': 'Please complete the questionnaire first.'
        }), 400
    
    # Check for valid answers
    valid_responses = [r for r in responses if r.get('answer') is not None]
    if len(valid_responses) < 5:  # Minimum required responses
        return jsonify({
            'error': 'Insufficient responses',
            'suggestion': 'Please answer at least 5 questions for meaningful career suggestions.'
        }), 400
    
    # Analyze the responses using Gemini
    suggestion = analyze_responses(valid_responses)
    
    return jsonify({
        'suggestion': suggestion,
        'responses': valid_responses
    })

if __name__ == '__main__':
    app.run(debug=True)