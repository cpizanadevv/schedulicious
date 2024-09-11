from flask import request, jsonify, Blueprint
from flask_login import login_required
from app.forms import ImageForm
from app.api.aws_helper import upload_file_to_s3

img_routes = Blueprint("recipes", __name__)

@img_routes.route("/upload-image", methods=["POST"])
@login_required
def upload_image():
    form = ImageForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        image = form.image.data
        if image:
            upload_result = upload_file_to_s3(image)
            if "errors" in upload_result:
                return jsonify({"errors": upload_result["errors"]}), 400

            image_url = upload_result["url"]
            return jsonify({"image_url": image_url}), 200
        else:
            return jsonify({"errors": "No file selected"}), 400

    return jsonify({"errors": form.errors}), 400