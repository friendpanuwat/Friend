# หน้าแกลเลอรีคลังชิ้นส่วน

- หน้าที่เผยแพร่แล้ว: https://claude.ai/artifact/MfHsnKa7qnP96UjNFe3cg7 (เปิดได้เฉพาะ Friend)
- Friend กดเลือก เก็บ / ไม่แน่ใจ / ทิ้ง ให้กับการ์ด C1–C11, F1 และวิดเจ็ต W1–W14 ตัวเลือกจะเก็บไว้ในฐานข้อมูลของหน้า ที่ collection `picks` แต่ละ document มี id ตรงกับชิ้นส่วน และเก็บค่า `{choice, note}` เจ้าของหน้าเป็นคนเดียวที่เขียนได้
- อ่านผลด้วย ArtifactData `list` ที่ collection `picks`
- สร้างคลิปใหม่: รัน `../../style-rules/previews/make_previews.sh <work>` ก่อน เพื่อเตรียมเฟรมของคลิป แล้วรัน `make_clips.sh <work> <out>` จากนั้นเผยแพร่ `gallery.html` พร้อมไฟล์ `clips/*.mp4` และ `clips/*.jpg`
