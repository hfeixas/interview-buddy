import yaml

def questions():
    questions = yaml.safe_load(open("app/database/questions.yaml"))
    return questions