from flask import Flask, request, jsonify
import face_recognition

app = Flask(__name__)


@app.route("/compare_images", methods=["POST"])
def compare_images():
    data = request.get_json()

    print(data)

    image_url1 = data.get("image_url1")
    image_url2 = data.get("image_url2")

    print(f"image 1: {image_url1}")
    print(f"image 2: {image_url2}")

    if image_url1 and image_url2:
        try:
            known_image = face_recognition.load_image_file(image_url1)
            unknown_image = face_recognition.load_image_file(image_url2)

            biden_encoding = face_recognition.face_encodings(known_image)[0]
            unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

            results = face_recognition.compare_faces([biden_encoding], unknown_encoding)

            resp = results[0]
        except IndexError as e:
            print(e)
            resp = False
        # print("retults", results)

        if resp:
            flag = 1
        else:
            flag = 0
        result = {"result": flag}
        print("result", result)
        return jsonify(result), 200
    else:
        return jsonify({"error": "Invalid input"}), 400


if __name__ == "__main__":
    app.run(debug=True)
