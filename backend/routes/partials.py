from flask import Blueprint, render_template

bp_partials = Blueprint('partials', __name__)

@bp_partials.route('/partials/<page>')
def partials(page):
    return render_template(f'partials/{page}.html')