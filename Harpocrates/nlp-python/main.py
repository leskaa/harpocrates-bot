import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pyap

class Text(BaseModel):
  content: str

#intialize web app / pi
app = FastAPI()

# Allows cors for everyone **Ignore**
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Parses address out of text that was sent
@app.post("/parse")
def parse(text: Text):
    return pyap.parse(text.content, country='US')


if __name__ == "__main__":
    print("Listening!")
    uvicorn.run(app, host="0.0.0.0", port=8000)