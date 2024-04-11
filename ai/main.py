# uvicorn main:app --reload
from typing import Union
from kobert_tokenizer import KoBERTTokenizer
from fastapi import FastAPI
from pydantic import BaseModel

import AI

class Memo(BaseModel):
    memo: str

app = FastAPI()
tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')

@app.post("/ai")
def read_root():
    print()
    return {"Hello": "World"}

@app.post("/ai/emotion/dic_test")
async def dic_test(memo: Memo):
    return {"result" : AI.predict(memo.memo, tokenizer).tolist()[0]}

@app.post("/ai/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
