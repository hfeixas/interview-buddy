function render_topic(topic) {
    return `<button>${topic}</button>`
}

function render_report(candidate_questions) {
    let [percent_text, correct_answers, total_answers] = get_candidate_standing(candidate_questions);
    let topics = get_topics_asked(candidate_questions);
    return `<div class="report_table">
            <h5>Score: ${percent_text}</h5>
            <h5>Topics Covered: ${topics}</h5>
                <table class="table table-striped table-hover be-table-responsive dataTable no-footer" id="report-table"></table>
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                    <tbody></tbody>
                </table>
            </div>`
}

function render_question(category, question, answer) {
    return `
<div class="modal" tabindex="-1" role="dialog">
<div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="category">${category}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
        </div>
        <div class="modal-body">
            <h5>Question:</h5>
            <p id="question" value=${question}>${question}</p>
            <h5>Answer:</h5>
            <p id="answer" value=${answer} >${answer}</p>
            <h5>Candidate Answer:</h5>
            <input type="text" class="form-control input-lg flex-fill" id="candidate_answer"><br>
            <div class="custom-control custom-switch" id="answer_correct_div">
                <input type="checkbox" class="custom-control-input" name="answer_correct" checked id="answer_correct">
                <label class="custom-control-label" for="answer_correct">Answer Correct</label>
            </div>
        </div>
        <div class="modal-footer">
            <button id="submit" type="button" class="btn btn-primary">Submit</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
    </div>
</div>
</div>
`
}

$.ajax({
    url: `/api/questions`,
    method: "get",
    contentType: 'application/json;charset=UTF-8',
    beforeSend: function() {
        console.log("making Call");
    },
    success: function(response) {
        console.log(response);
        questions = JSON.parse(response)
        question_list_html = ``
        $.each(questions, function(key, value) {
            $.each(value, function(index, question_data) {
                question_list_html += `${render_question(question_data)}`
            });
        });
        $('#questions').html(question_list_html);
    },
    error: function(xhr, ajaxOptions, thrownError) {
        $('body').html(xhr.responseText);
    }
});

$.ajax({
    url: `/api/topics`,
    method: "get",
    contentType: 'application/json;charset=UTF-8',
    beforeSend: function() {
        console.log("making Call");
    },
    success: function(response) {
        console.log(response);
        topics = JSON.parse(response);

        topic_list_html = ``

        $.each(topics, function(index, value) {
            topic_list_html += `${render_topic(value)}`
        });
        $('#topics').html(topic_list_html);
    },
    error: function(xhr, ajaxOptions, thrownError) {
        $('body').html(xhr.responseText);
    }
});

$('#questions-table')
    .dataTable({
        lengthChange: true,
        processing: false,
        serverSide: false,
        cache: true,
        paging: true,
        "lengthMenu": [
            [5, 10, 25],
            [5, 10, 25]
        ],
        pageLength: 30,
        responsive: false,
        // autoWidth: false,
        ajax: {
            processing: true,
            contentType: "application/json",
            data: function(data) {
                return JSON.stringify(data)
            },
            dataSrc: function(json) {
                var questions = []
                $.each(json, function(key, value) {
                    $.each(value, function(index, question_data) {
                        questions.push(question_data)
                    });
                });
                console.log(questions);
                return questions
            },
            url: `/api/questions`,
            type: "GET",
        },
        language: {
            "info": "Showing _START_ to _END_ of _TOTAL_ shortcuts",
            "emptyTable": "No questions to display.",
            "infoEmpty": "No questions match your filters.",
            "infoFiltered": "(filtered from _MAX_ total questions)"
        },
        columns: [{
            "data": "category",
            "name": "Category",
            "autoWidth": true,
            "title": "Category"
        }, {
            "data": "question",
            "name": "Question",
            "autoWidth": true,
            "title": "Question"
        }, {
            "data": "answer",
            "name": "Answer",
            "autoWidth": true,
            "title": "Answer"
        }, {
            "data": "difficulty",
            "name": "Difficulty",
            "autoWidth": true,
            "title": "Difficulty"
        }, {
            "data": "difficulty",
            "name": "Select",
            "autoWidth": true,
            "title": "Select",
            "render": function(category) {
                return `<button type="button" class="btn btn-primary td-button" >Ask</button>`
            }
        }, ],
        drawCallback: function() {
            console.log("drawCallback placeholder")
        }
    });

$('body').on('click', '.td-button', function(event) {
    event.preventDefault()
    var table = $('#questions-table').DataTable();
    console.log("Removing", $(this).parents('tr').text());
    table.row($(this).parents('tr')).remove().draw();
    var row = $(this).closest("tr");
    var category = row.find("td:eq(0)").text();
    var question = row.find("td:eq(1)").text();
    var answer = row.find("td:eq(2)").text();
    question_html = render_question(category, question, answer);
    $('#question').html(question_html);
    $(".modal").modal("show")
    console.log(question);
})

function get_candidate_standing(candidate_questions) {
    correct_answers = 0
    $.each(candidate_questions, function(index, data) {
        if (data["answer_correct"] == true) {
            correct_answers += 1
        }
    });
    percent = ((correct_answers / candidate_questions.length) * 100).toFixed(0);
    percent_text = percent + "%";
    return [percent_text, correct_answers, candidate_questions.length]
}

function get_topics_asked(candidate_questions) {
    let topics = Array()
    $.each(candidate_questions, function(index, data) {
        if (topics.indexOf(data["category"]) === -1) {
            topics.push(data["category"]);
        }
    });
    return topics
}

var candidate_questions = []
var count = 0
$('body').on('click', '#submit', function(event) {
    event.preventDefault()
    let main_div = $(this).parent().parent()
    let answer = main_div.find("#answer").text();
    let question = main_div.find("#question").text();
    let candidate_answer = main_div.find("#candidate_answer").val();
    let answer_correct = $("#answer_correct").is(':checked');
    let category = $("#category").text()
    let answer_map = {
        "question": question,
        "answer": answer,
        "candidate_answer": candidate_answer,
        "answer_correct": answer_correct,
        "category": category
    }
    candidate_questions.push(answer_map)
    $(".modal").modal("hide")
    count += 1;
    $("#count").html(` <a href="#" id="count" style="color:#228B22;"><i class="fa fa-ravelry" aria-hidden="true"></i> Questions: ${count}</a>`)
})

$('body').on('click', '#reset', function(event) {
    console.log("Resetting Questions");
    candidate_questions = []
    count = 0
    $("#count").html(` <a href="#" id="count" ><i class="fa fa-ravelry" aria-hidden="true"></i> Questions: 0</a>`)
    $("#report_table_container").hide()
    $('.question_table').show()
    alert("Session Reset.")
    $('#questions-table').DataTable().ajax.reload();
});

$('body').on('mouseover', '#count', function(event) {
    console.log("Mouse Over");
    let [percent_text, correct_answers, total_answers] = get_candidate_standing(candidate_questions);
    let topics = get_topics_asked(candidate_questions)
    $("#current_session_info_div").html(`
            <div class="box box1" style="background-color: #000; color: #fff; opacity: .5; text-align: center;">
            <h3>Candidate Standing:</h3>
            <div>Percent Right: ${percent_text}</div>
            <div>Answers Right: ${correct_answers}</div>
            <div>Total Questions: ${total_answers}</div>
            <div>Topics Covered: ${topics}</div>
            </div>
        `)
});

$('body').on('mouseleave', '#count', function(event) {
    console.log("Mouse Leave");
    $("#current_session_info_div").html(``)
});

$('body').on('click', '#report', function(event) {
    report_html = render_report(candidate_questions);
    $('.question_table').hide();
    $("#report_table_container").html(report_html);
    $("#report_table_container").show();
    $('#report-table').dataTable({
        data: candidate_questions,
        columns: [{
            title: "Question",
            data: "question"
        }, {
            title: "Answer",
            data: "answer"
        }, {
            title: "Candidate Answer",
            data: "candidate_answer"
        }, {
            title: "Correct",
            data: "answer_correct",
            render: function(answer_correct) {
                if (answer_correct == true) {
                    return `<i class="fa fa-check" style="color:green;" aria-hidden="true"></i>`
                } else {
                    return `<i class="fa fa-times" style="color:red;" aria-hidden="true"></i>`
                }
            }
        }]
    })
})

$('body').on('click', '#home', function(event) {
    $("#report_table_container").hide()
    $('.question_table').show()
});