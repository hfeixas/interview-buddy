import json
import flask
import yaml 

app = flask.Flask(__name__)

def db_load():
    data = yaml.safe_load(open("database/questions.yaml"))
    return data

@app.get("/")
def test():
    """Test Page for Azure User Data"""
    return flask.render_template("index.html")

@app.get("/api/topics")
def topics():
    """Topics"""
    data = db_load()
    topics = list(data.keys())
    return json.dumps(topics)

@app.get("/api/questions")
def questions():
    """Questions"""
    questions = db_load()
    return json.dumps(questions)

if __name__ == "__main__":
    app.run(debug=True)