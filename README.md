# Interview-Buddy

Interview Buddy is a simple web application to help quickly, efficiently and methodically screen candidates.

## Overview
Questions Table:

![Overview](img/ivew_buddy._1.png?raw=true "Title")

Question Modal:

![Overview](img/ivew_buddy._2.png?raw=true "Title")

Summary Overview:

![Overview](img/ivew_buddy._3.png?raw=true "Title")

Answer Report:

![Overview](img/ivew_buddy._4.png?raw=true "Title")


## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install requirements.

```bash
pip install -r requirements.txt
```

## Usage

This web application can be run in mostly any environment but for quick testing you can run webserver locally by:

```sh
cd app/
python web.py
```
## Questions DB

The questions are located in the following file, and can be updated as desired as long as the follow the standard format:

app/database/questions.yaml
```yaml
---
topic_1: 
  - difficulty: 5
    category: topic_1
    question: Insert Question Here.
    answer: Insert Correct Answer Here.
  - difficulty: 4
    category: topic_1
    question: Insert Question Here.
    answer: Insert Correct Answer Here.
topic_2: 
  - difficulty: 3
    category: topic_2
    question: Insert Another Question Here.
    answer: Insert Correct Answer Here.
  - difficulty: 1
    category: topic_2
    question: Insert Question Here.
    answer: Insert Correct Answer Here.
```

## Contributing
Use as you wish, fork, clone or change it.

## License
[MIT](https://choosealicense.com/licenses/mit/)