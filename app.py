from flask import Flask

from backend.database import init_db
from backend.routes.partials import bp_partials

from backend.routes.index import bp_index
from backend.routes.students import bp_students
from backend.routes.teachers import bp_teachers
from backend.routes.classes import bp_classes
from backend.routes.subjects import bp_subjects
from backend.routes.enrollments import bp_enrollments

app = Flask(__name__)

app.register_blueprint(bp_index)
app.register_blueprint(bp_partials)

app.register_blueprint(bp_students)
app.register_blueprint(bp_teachers)
app.register_blueprint(bp_classes)
app.register_blueprint(bp_subjects)
app.register_blueprint(bp_enrollments)


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
