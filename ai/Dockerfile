#FROM ubuntu:22.04
FROM pytorch/pytorch:2.2.1-cuda11.8-cudnn8-runtime
RUN apt update && apt-get install -y python3.10 python3-pip git libcairo2-dev pkg-config python3-dev
WORKDIR /app
# RUN pip3 install --no-cache-dir -r requirements1.txt
# RUN pip3 install --no-cache-dir -r requirements2.txt
#RUN pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
COPY . .
CMD uvicorn main:app --host 0.0.0.0 --port 8000
