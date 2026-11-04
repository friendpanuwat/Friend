# ไฟล์โมเดลที่นำเข้าจากภายนอก

| ไฟล์ | ใช้ทำอะไร | แหล่งที่มา | license | วันที่ตรวจ |
|---|---|---|---|---|
| `face_detection_yunet_2023mar.onnx` | ตัวหาหน้า (YuNet) ใน `plan/faces.py` ผ่าน `cv2.FaceDetectorYN` | https://huggingface.co/opencv/face_detection_yunet (สำเนาของ opencv_zoo) | MIT (`LICENSE-yunet.txt`) | 2026-11-04 |

ไลบรารีที่ต้องติดตั้ง: `opencv-python-headless` (ทดสอบกับรุ่น 5.0.0, license Apache 2.0) Friend ตกลงให้ใช้ OpenCV เมื่อ 2026-11-04
